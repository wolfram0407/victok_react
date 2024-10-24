import { Button, Checkbox, Form } from "antd";
import React, { useState } from "react";
import styled from "styled-components";
import { color } from "../../../styles/theme";
import { useAppContext } from "../../../utils/context";

// 회원가입 - 약관 동의

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.div`
  width: 100%;
  font-size: 2.4rem;
  font-weight: bold;
  text-align: left;
  margin-bottom: 3.2rem;
`;

const RowWrapper = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  padding: 1.6rem 0;
`;

const A = styled.a`
  color: ${color.gold};
  text-decoration: underline;
`;

const Terms = ({ form, setStep, currentStep }) => {
  const { termList } = useAppContext();
  const [all, setAll] = useState(false);

  const termsList = [
    {
      id: 1,
      value: "use",
      body: "빅톡 서비스 이용약관 동의합니다.",
      required: true,
      href: termList[0].url,
    },
    {
      id: 2,
      value: "privacy",
      body: "빅톡 개인정보 수집 및 이용에 동의합니다.",
      required: true,
      href: termList[1].url,
    },
    {
      id: 3,
      value: "marketing",
      body: "빅톡 마케팅 정보 수신에 동의합니다.",
      required: false,
      href: null,
    },
  ];

  const onSubmit = () => {
    setStep("account");
  };

  const onValueChange = (value) => {
    const agree = form.getFieldValue("agree");
    if (agree.length > 2) {
      setAll(true);
    } else {
      setAll(false);
    }
  };

  const onAll = (value) => {
    if (value.target.checked) {
      setAll(true);
      form.setFieldsValue({ agree: ["use", "privacy", "marketing"] });
    } else {
      setAll(false);
      form.setFieldsValue({ agree: [] });
    }
  };

  return (
    <Container style={{ display: currentStep ? "flex" : "none" }}>
      <Title>이용약관</Title>
      <Form
        form={form}
        style={{
          display: "flex",
          flexDirection: "column",
          minWidth: 450,
          flex: 1,
        }}
        onFinish={onSubmit}
        onValuesChange={onValueChange}
      >
        <RowWrapper style={{ borderBottom: `0.1rem solid ${color.mainBlue}` }}>
          <Checkbox
            checked={all}
            onChange={onAll}
            style={{ fontSize: "1.6rem" }}
          >
            모든 약관에 동의합니다.
          </Checkbox>
        </RowWrapper>
        <Form.Item
          name="agree"
          rules={[
            () => ({
              validator(_, value) {
                if (
                  value &&
                  value.includes("use") &&
                  value.includes("privacy")
                ) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("필수 약관에 동의해 주세요."));
              },
            }),
          ]}
        >
          <Checkbox.Group
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              alignItems: "center",
            }}
          >
            {termsList.map((item) => (
              <RowWrapper key={item.id}>
                <Checkbox value={item.value} style={{ fontSize: "1.6rem" }}>
                  {`${item.body} ${item.required ? "(필수)" : ""}`}
                </Checkbox>
                {item.href && (
                  <A href={item.href} target="_blank">
                    자세히
                  </A>
                )}
              </RowWrapper>
            ))}
          </Checkbox.Group>
        </Form.Item>

        <Form.Item style={{ margin: 0 }} noStyle>
          <Button
            type="primary"
            htmlType="submit"
            block
            style={{
              height: 48,
              fontSize: 16,
              borderRadius: 4,
              background: color.mainBlue,
            }}
          >
            동의하기
          </Button>
        </Form.Item>
      </Form>
    </Container>
  );
};

export default Terms;
