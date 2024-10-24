import { Form, Input, Modal, Select } from "antd";
import BasicButton from "../../../../../components/atom/BasicButton";
import RowWrapper from "../../../../../components/atom/RowWrapper";
import TextAtom from "../../../../../components/atom/TextAtom";
import SettingSectionBox from "../atom/SettingSectionBox";
import styled, { css } from "styled-components";
import { API } from "../../../../../utils/api";
import { useState, useEffect } from "react";
import axios from "axios";
import { useMutation } from "react-query";
import { queryClient } from "../../../../../App";
import PostModal from "../../../../../components/organism/PostModal";
import { useOutletContext } from "react-router-dom";

const { Option } = Select;

const Wrapper = styled.div``;

const EditStoreSection = ({ meData }) => {
  const [form] = Form.useForm();
  const [postModal, setPostModal] = useState(false);
  const [storeIdx, setStoreIdx] = useState();
  const { grade } = useOutletContext();

  const onAddress = (value) => {
    form.setFieldsValue({
      address: { zip: value.zonecode, addr: value.address },
    });
  };

  const onUpdateStoreInfo = useMutation(
    (data) => API.put("/user/store-info", data),
    {
      onSuccess: () => {
        Modal.success({
          title: "시설 정보 변경 완료!",
          content: "시설 정보가 변경되었습니다.",
          okText: "확인",
        });
        queryClient.fetchQuery("myData");
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

  const onFinish = (data) => {
    const {
      address: { zip: zip_code, addr: address1, detail: address2 },
      type,
      name,
      hp: contact,
    } = data;
    const formData = {
      store_idx: storeIdx,
      type,
      name,
      zip_code,
      address1,
      address2,
      contact,
    };

    if (
      Object.values(formData).filter(
        (data) => !Object.values(meData).includes(data)
      ).length === 0
    )
      return;

    onUpdateStoreInfo.mutate(formData);
  };

  useEffect(() => {
    if (!meData) return;
    const {
      type,
      store_name,
      zip_code,
      address1,
      address2,
      contact,
      store_idx,
    } = meData;
    form.setFieldsValue({
      type,
      name: store_name,
      address: {
        zip: zip_code,
        addr: address1,
        detail: address2,
      },
      hp: contact,
    });
    setStoreIdx(store_idx);
    // eslint-disable-next-line
  }, [meData]);

  return (
    <SettingSectionBox>
      <TextAtom fontSize={"2rem"} fontWeight={600} marginBottom="2.4rem">
        시설 정보 수정
      </TextAtom>
      <Form form={form} layout="vertical" onFinish={onFinish}>
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
          //   style={{ marginBottom: 10 }}
          rules={[
            {
              required: true,
              message: "시설 이름을 입력해 주세요!",
            },
          ]}
        >
          <Input placeholder="시설 이름을 입력해 주세요." />
        </Form.Item>
        <Wrapper style={{ marginBottom: "2.4rem" }}>
          <RowWrapper>
            <Form.Item
              label="시설 주소"
              name={["address", "zip"]}
              style={{ flex: 1, marginRight: 6, marginBottom: 0 }}
              rules={[{ required: true, message: "주소를 입력해 주세요!" }]}
            >
              <Input placeholder="우편번호" disabled={true} />
            </Form.Item>
            <BasicButton
              focused
              onClick={() => setPostModal(true)}
              styles={css`
                align-self: flex-end;
              `}
            >
              우편번호 검색
            </BasicButton>
          </RowWrapper>
          <Form.Item
            name={["address", "addr"]}
            style={{ marginTop: 6, marginBottom: 6 }}
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
        </Wrapper>
        <Form.Item
          label="시설 연락처"
          name="hp"
          rules={[{ required: true, message: "시설 연락처를 입력해 주세요!" }]}
          style={{ marginBottom: "4rem" }}
        >
          <Input
            placeholder="시설 연락처를 입력해 주세요."
            onChange={(e) => {
              e.target.value = e.target.value.replace(/[^0-9]/g, "");
              form.setFieldValue("hp", e.target.value);
            }}
            maxLength={12}
            disabled={grade !== 0}
          />
        </Form.Item>
        <BasicButton
          size="large"
          styles={css`
            width: 100%;
          `}
          focused
          htmlType={"submit"}
        >
          수정
        </BasicButton>
      </Form>
      <PostModal
        visible={postModal}
        setVisible={setPostModal}
        setAddress={onAddress}
      />
    </SettingSectionBox>
  );
};

export default EditStoreSection;
