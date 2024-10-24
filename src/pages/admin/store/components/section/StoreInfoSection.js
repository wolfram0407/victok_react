import { Form, Input, Modal, Select } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { css } from "styled-components";
import { queryClient } from "../../../../../App";
import RowWrapper from "../../../../../components/atom/RowWrapper";
import TextAtom from "../../../../../components/atom/TextAtom";
import PostModal from "../../../../../components/organism/PostModal";
import { API } from "../../../../../utils/api";
import BasicButton from "./../../../../../components/atom/BasicButton";

const { Option } = Select;

const StoreInfoSection = ({ storeInfo }) => {
  const [showModal, setShowModal] = useState(false);
  const store_idx = storeInfo.idx;

  const [form] = Form.useForm();

  const onAddress = (value) => {
    form.setFieldsValue({
      address: { zip: value.zonecode, addr: value.address },
    });
  };

  const updateStoreMutation = useMutation(
    (data) => API.put("/admin/store-info", data),
    {
      onSuccess: () => {
        Modal.success({
          title: "시설 정보 변경 완료!",
          content: "시설 정보가 변경되었습니다.",
          okText: "확인",
        });
        queryClient.fetchQuery("adminStoreInfo");
      },
      onError: (error) => {
        if (axios.isAxiosError(error)) {
          Modal.error({
            title: "시설 정보 변경 실패!",
            content: error.response.data.messsage,
            okText: "확인",
          });
        }
      },
    }
  );

  const onFinish = async (values) => {
    if (!values) return;
    const {
      type,
      name,
      address: { zip: zip_code, addr: address1, detail: address2 },
      hp: contact,
    } = values;
    const formData = {
      store_idx,
      type,
      name,
      zip_code,
      address1,
      address2,
      contact,
    };
    const prevInfo = {
      address1: storeInfo?.address1,
      address2: storeInfo?.address2,
      contact: storeInfo?.contact,
      name: storeInfo?.name,
      store_idx: storeInfo?.idx,
      type: storeInfo?.type,
      zip_code: storeInfo?.zip_code,
    };
    let sameCount = 0;
    for (let key in prevInfo) {
      if (formData[key] === prevInfo[key]) {
        sameCount += 1;
      }
    }
    if (Object.keys(formData).length === sameCount) {
      return;
    }
    updateStoreMutation.mutate(formData);
  };

  useEffect(() => {
    const { address1, address2, contact, name, type, zip_code } = storeInfo;
    form.setFieldsValue({
      name,
      type,
      address: {
        zip: zip_code,
        addr: address1,
        detail: address2,
      },
      hp: contact,
    });
    // eslint-disable-next-line
  }, [storeInfo]);

  return (
    <>
      <TextAtom fontSize={"2rem"} fontWeight={600} marginBottom="2.4rem">
        시설 정보
      </TextAtom>
      <Form
        form={form}
        layout="vertical"
        name="basicInfo"
        style={{ width: "45rem" }}
        onFinish={onFinish}
      >
        <Form.Item
          label="시설 유형"
          name="type"
          rules={[{ required: true, message: "시설 유형을 선택해 주세요!" }]}
        >
          <Select placeholder="선택해 주세요.">
            <Option value="볼링장">볼링장</Option>
            <Option value="기타">기타</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="시설 이름"
          name="name"
          rules={[
            {
              required: true,
              message: "시설 이름을 입력해 주세요!",
            },
            {
              max: 20,
              message: "시설이름은 20자까지 작성가능합니다.",
            },
          ]}
        >
          <Input placeholder="시설 이름을 입력해 주세요." />
        </Form.Item>
        <Form.Item
          label="시설 주소"
          name="address"
          rules={[{ required: true }]}
        >
          <RowWrapper
            styles={css`
              flex-direction: column;
            `}
          >
            <RowWrapper
              styles={css`
                width: 100%;
              `}
            >
              <Form.Item
                name={["address", "zip"]}
                style={{
                  flex: 1,
                  marginRight: 5,
                  marginBottom: 0,
                }}
                rules={[{ required: true, message: "주소를 입력해 주세요!" }]}
              >
                <Input placeholder="우편번호" disabled={true} />
              </Form.Item>
              <BasicButton focused onClick={() => setShowModal(true)}>
                우편번호 검색
              </BasicButton>
            </RowWrapper>
            <Form.Item
              name={["address", "addr"]}
              style={{ marginTop: 5, marginBottom: 5, width: "100%" }}
            >
              <Input placeholder="주소" disabled={true} />
            </Form.Item>
            <Form.Item
              name={["address", "detail"]}
              noStyle
              rules={[{ required: true, message: "상세주소를 입력해 주세요!" }]}
            >
              <Input placeholder="상세주소를 입력해 주세요." />
            </Form.Item>
          </RowWrapper>
        </Form.Item>
        <Form.Item
          label="시설 연락처"
          name="hp"
          rules={[
            { required: true, message: "시설 연락처를 입력해 주세요!" },
            {
              max: 11,
              message: "최대 11자이내로 입력해주세요.",
            },
          ]}
        >
          <Input
            placeholder="시설 연락처를 입력해 주세요."
            onChange={(e) => {
              e.target.value = e.target.value.replace(/[^0-9]/g, "");
              return form.setFieldValue("hp", e.target.value);
            }}
            maxLength={11}
          />
        </Form.Item>
        <Form.Item noStyle>
          <BasicButton
            focused
            styles={css`
              width: 100%;
              height: 4rem;
            `}
            htmlType="submit"
          >
            저장
          </BasicButton>
        </Form.Item>
      </Form>
      <PostModal
        visible={showModal}
        setVisible={setShowModal}
        setAddress={onAddress}
      />
    </>
  );
};

export default StoreInfoSection;
