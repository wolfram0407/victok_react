import { Button, Form, Input, Select } from "antd";
import React, { useState } from "react";
import styled, { css } from "styled-components";
import RowWrapper from "../../../components/atom/RowWrapper";
import PostModal from "../../../components/organism/PostModal";
import { color } from "../../../styles/theme";
import { numberHyphenDivider } from "../../../utils/utils";

// 회원가입 - 시설 정보

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.div`
  width: 100%;
  font-size: 24px;
  font-weight: bold;
  text-align: left;
  margin-bottom: 3.2rem;
`;

const Wrap = styled.div`
  display: flex;
  flex-direction: row;
`;

const { Option } = Select;

const StoreInfo = ({ currentStep, form, onSubmit, setStep }) => {
  const [showModal, setShowModal] = useState(false);

  const onChange = (value) => {
    console.log(`selected ${value}`);
  };

  const onAddress = (value) => {
    form.setFieldsValue({
      address: { zip: value.zonecode, addr: value.address },
    });
  };

  return (
    <Container style={{ display: currentStep ? "flex" : "none" }}>
      <Title>시설정보</Title>
      <Form
        form={form}
        layout="vertical"
        style={{ width: "100%" }}
        onFinish={onSubmit}
      >
        <Wrap>
          <Form.Item
            label="시설 유형"
            name="type"
            rules={[{ required: true, message: "시설 유형을 선택해 주세요!" }]}
            style={{ flex: 1, marginRight: 10 }}
          >
            <Select
              placeholder="선택해 주세요."
              onChange={onChange}
              style={{ minWidth: 220 }}
            >
              <Option value="볼링장">볼링장</Option>
              <Option value="기타">기타</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="시설 이름"
            name="storeName"
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
            style={{ flex: 1 }}
          >
            <Input
              placeholder="이름을 입력해 주세요."
              style={{ minWidth: 220 }}
              maxLength={20}
            />
          </Form.Item>
        </Wrap>
        <Form.Item
          label="시설 주소"
          name="address"
          rules={[{ required: true, message: "시설 주소를 설정해 주세요!" }]}
        >
          <RowWrapper
            styles={css`
              flex-direction: column;
              /* justify-content: flex-start; */
              align-items: flex-start;
            `}
          >
            <Wrap style={{ width: "100%" }}>
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
              <Button
                type="primary"
                style={{ background: color.mainBlue }}
                onClick={() => setShowModal(true)}
              >
                우편번호 검색
              </Button>
            </Wrap>
            <Form.Item
              name={["address", "addr"]}
              style={{ marginTop: 5, marginBottom: 5, width: "100%" }}
            >
              <Input placeholder="주소" style={{ flex: 1 }} disabled={true} />
            </Form.Item>
            <Form.Item
              name={["address", "detail"]}
              noStyle
              rules={[{ required: true, message: "상세주소를 입력해 주세요!" }]}
            >
              <Input
                placeholder="상세주소를 입력해 주세요."
                style={{ flex: 1 }}
              />
            </Form.Item>
          </RowWrapper>
        </Form.Item>
        <Form.Item
          label="시설 연락처"
          name="hp"
          style={{ flex: 1 }}
          rules={[{ required: true, message: "시설 연락처를 입력해 주세요!" }]}
        >
          <Input
            placeholder="시설 연락처를 입력해 주세요."
            style={{ flex: 1 }}
            onChange={(e) => {
              e.target.value = e.target.value.replace(/[^0-9]/g, "");
              const dividerNumber = (value) => {
                if (value.length === 10) {
                  return numberHyphenDivider(value, 4, 7);
                } else {
                  return numberHyphenDivider(value, 4, 8);
                }
              };
              return form.setFieldValue("hp", dividerNumber(e.target.value));
            }}
          />
        </Form.Item>
        <Wrap style={{ marginTop: 10 }}>
          <Form.Item noStyle>
            <Button
              onClick={() => setStep("info")}
              block
              style={{
                height: 48,
                fontSize: 16,
                borderRadius: 4,
                backgroundColor: color.white,
                color: color.mainBlue,
                boxSizing: "border-box",
                borderColor: color.mainBlue,
                marginRight: 3,
              }}
            >
              이전
            </Button>
          </Form.Item>
          <Form.Item noStyle>
            <Button
              type="primary"
              htmlType="submit"
              block
              style={{
                height: 48,
                fontSize: 16,
                borderRadius: 4,
                marginLeft: 3,
                background: color.mainBlue,
              }}
            >
              회원가입
            </Button>
          </Form.Item>
        </Wrap>
      </Form>
      <PostModal
        visible={showModal}
        setVisible={setShowModal}
        setAddress={onAddress}
      />
    </Container>
  );
};

export default StoreInfo;
