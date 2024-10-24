import { Button, Checkbox, Form, Input, Modal } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router";
import styled from "styled-components";
import LoggedOutLayout from "../../components/layouts/LoggedOutLayout";
import { isAxiosError } from "axios";
import { color } from "../../styles/theme";
import { useAppContext } from "../../utils/context";
import AdModalContent from "../../components/organism/AdModalContent";

const Image = styled.img`
  width: 24rem;
  height: 6rem;
  object-fit: cover;
  margin-bottom: 5rem;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
`;

const Text = styled.div`
  font-size: 1.6rem;
`;

const Login = () => {
  const { logUserIn } = useAppContext();
  const [checked, setChecked] = useState(false);
  const navigate = useNavigate();
  const onClickFindPassword = () => navigate("/findpw");
  const onClickRegister = () => navigate("/register");

  const onFinish = ({ id, password }) => {
    try {
      logUserIn({
        id,
        password,
        isAuto: checked,
        callback: (login_time) => {
          navigate("/");
          if (!login_time) {
            Modal.info({
              title: "알림",
              content: <AdModalContent />,
              okText: "이용권 구매하기",
              closable: true,
              onOk: () => {
                // navigate("/setting?tab=payment");
                navigate("/goodsInfo");
                // localStorage.
                // navigate('/mypage');
              },
            });
          }
        },
      });
    } catch (error) {
      if (isAxiosError(error)) {
        Modal.error({
          title: "로그인 오류",
          content: error.response.data.message,
        });
      }
    }
  };

  return (
    <LoggedOutLayout center>
      <Image src={require("../../assets/images/login.png")} />
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          rules={[
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!getFieldValue("id") || !getFieldValue("password")) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("아이디 및 비밀번호를 확인해 주세요.")
                );
              },
            }),
          ]}
          style={{ flex: 1, width: 440, marginBottom: 0 }}
        >
          <Form.Item name="id" style={{ marginBottom: 5 }}>
            <Input
              placeholder="이메일을 입력해 주세요."
              style={{ flex: 1, height: 43, fontSize: 14, borderRadius: 4 }}
            />
          </Form.Item>
          <Form.Item name="password">
            <Input
              placeholder="비밀번호를 입력해 주세요."
              type="password"
              style={{ flex: 1, height: 43, fontSize: 14, borderRadius: 4 }}
            />
          </Form.Item>
          <Form.Item>
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
              로그인
            </Button>
          </Form.Item>
        </Form.Item>
      </Form>
      <Row
        style={{
          width: "100%",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <Row>
          <Checkbox
            onChange={(e) => setChecked(e.target.checked)}
            defaultChecked={checked}
            style={{
              "--background-color": color.mainBlue,
              "--border-color": color.mainBlue,
            }}
          >
            자동로그인
          </Checkbox>
        </Row>

        <Text
          style={{
            cursor: "pointer",
          }}
          onClick={onClickFindPassword}
        >
          비밀번호가 기억나지 않으신가요?
        </Text>
      </Row>
      <Row
        style={{
          width: "100%",
          alignItems: "flex-end",
          justifyContent: "center",
          marginTop: 60,
        }}
      >
        <Text>VICTOK을 처음 시작하시나요?</Text>
        <Text
          style={{
            color: color.gold,
            textDecoration: "underline",
            marginLeft: "0.8rem",
            cursor: "pointer",
          }}
          onClick={onClickRegister}
        >
          회원가입
        </Text>
      </Row>
    </LoggedOutLayout>
  );
};

export default Login;
