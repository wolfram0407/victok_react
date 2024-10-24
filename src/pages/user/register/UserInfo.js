import { Button, Form, Input, Modal } from "antd";
import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { useMutation } from "react-query";
import { phoneNumReg } from "../../../utils/Reg";
import { color } from "../../../styles/theme";
import RowWrapper from "../../../components/atom/RowWrapper";
import { API } from "../../../utils/api";

// 회원가입 - 개인 정보

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

const Section = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserInfo = ({ currentStep, form, step, setStep, emailConfirm }) => {
  const [send, setSend] = useState(true);
  const [auth, setAuth] = useState(true);

  const authSendMutation = useMutation(
    (data) => API.post("/user/auth-send", data),
    {
      onSuccess: () => {
        Modal.success({
          title: "인증번호 발송",
          content: "입력하신 휴대폰 번호로 인증번호가 발송되었습니다.",
          okText: "확인",
        });
        setSend(false);
      },
      onError: (error) => {
        console.log(error);
        Modal.error({
          title: "핸드폰 인증 실패!",
          content: "이미 가입된 번호입니다.",
          okText: "확인",
        });
      },
    }
  );

  const onSend = async () => {
    const phone_number = form.getFieldValue(["auth", "phoneNum"]);
    if (phone_number.length !== 11) {
      Modal.error({
        title: "핸드폰 인증 실패!",
        content: "핸드폰 번호를 올바르게 입력해 주세요.",
      });
      return;
    }

    const check = phoneNumReg.test(phone_number);
    if (check) {
      authSendMutation.mutate({ phone_number });
    } else {
      Modal.error({
        title: "핸드폰 인증 실패!",
        content: "핸드폰 번호를 올바르게 입력해 주세요.",
      });
    }
  };

  const onAuthMutation = useMutation((data) => API.post("/user/auth", data), {
    onSuccess: () => {
      Modal.success({
        title: "인증번호 확인 완료",
        content: "휴대폰 인증이 완료되었습니다.",
        okText: "확인",
      });
      setAuth(false);
    },
    onError: (error) => {
      console.log(error);
      Modal.error({
        title: "인증번호 확인 실패",
        content: "인증번호가 올바르지 않습니다.",
        okText: "확인",
      });
    },
  });

  const onAuth = async () => {
    const auth_number = form.getFieldValue(["auth", "phoneAuth"]);
    const phone_number = form.getFieldValue(["auth", "phoneNum"]);
    onAuthMutation.mutate({ phone_number, auth_number });
  };

  const onSubmit = (values) => {
    if (!auth) setStep("facility");
    else {
      Modal.error({
        title: "휴대폰 인증 오류",
        content: "휴대폰 인증을 완료해 주세요.",
        okText: "확인",
      });
    }
  };

  useEffect(() => {
    if (step === "info") {
      setAuth(true);
      setSend(true);
      const phoneNum = form.getFieldValue(["auth", "phoneNum"]) ?? "";
      if (phoneNum)
        form.setFieldsValue({ auth: { phoneNum: "", phoneAuth: "" } });
    }
    // eslint-disable-next-line
  }, [step]);

  return (
    <Container style={{ display: currentStep ? "flex" : "none" }}>
      <Title>기본 정보</Title>
      <Form
        form={form}
        layout="vertical"
        style={{ minWidth: 450 }}
        onFinish={onSubmit}
      >
        <Wrap style={{ flex: 1 }}>
          <Section style={{ flex: 1 }}>
            <Form.Item
              label="대표자 이름"
              name="name"
              rules={[{ required: true, message: "이름을 입력해 주세요!" }]}
            >
              <Input placeholder="이름을 입력해 주세요." />
            </Form.Item>

            <Form.Item label="이메일" required>
              <Input
                placeholder="이메일을 입력해 주세요."
                disabled={true}
                value={emailConfirm}
              />
            </Form.Item>
            <Form.Item
              label="휴대폰 번호"
              name="auth"
              dependencies={["phoneNum", "phoneAuth"]}
              rules={[
                { required: true, message: "휴대폰 인증을 완료해 주세요!" },
              ]}
            >
              <RowWrapper
                styles={css`
                  flex-direction: column;
                  align-items: flex-start;
                `}
              >
                <Wrap
                  style={{
                    marginBottom: 5,
                    width: "100%",
                  }}
                >
                  <Form.Item
                    name={["auth", "phoneNum"]}
                    noStyle
                    rules={[
                      {
                        required: true,
                        message: "휴대폰 번호를 입력해 주세요!",
                      },
                    ]}
                  >
                    <Input
                      placeholder="휴대폰 번호"
                      style={{ marginRight: 5 }}
                      disabled={!auth || !send}
                      maxLength={11}
                      minLength={11}
                    />
                  </Form.Item>
                  <Button
                    type="primary"
                    style={{
                      width: 170,
                      background: !auth ? color.grey : color.mainBlue,
                      color: color.white,
                    }}
                    onClick={onSend}
                    disabled={!auth}
                  >
                    {send ? "인증번호 요청" : "재전송"}
                  </Button>
                </Wrap>
                <Wrap
                  style={{
                    width: "100%",
                  }}
                >
                  <Form.Item name={["auth", "phoneAuth"]} noStyle>
                    <Input
                      placeholder="인증 번호"
                      style={{ marginRight: 5 }}
                      disabled={!auth || send}
                    />
                  </Form.Item>
                  <Button
                    type="primary"
                    style={{
                      width: 170,
                      background: !auth || send ? color.grey : color.mainBlue,
                      color: color.white,
                    }}
                    disabled={!auth || send}
                    onClick={onAuth}
                  >
                    확인
                  </Button>
                </Wrap>
              </RowWrapper>
            </Form.Item>
          </Section>
        </Wrap>
        <Wrap style={{ marginTop: 10 }}>
          <Form.Item noStyle>
            <Button
              onClick={() => setStep("account")}
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
              다음
            </Button>
          </Form.Item>
        </Wrap>
      </Form>
    </Container>
  );
};

export default UserInfo;
