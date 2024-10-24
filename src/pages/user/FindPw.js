import { Button, Form, Input, Modal } from "antd";
import axios from "axios";
import { useState } from "react";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { css } from "styled-components";
import RowWrapper from "../../components/atom/RowWrapper";
import TextAtom from "../../components/atom/TextAtom";
import LoggedOutLayout from "../../components/layouts/LoggedOutLayout";
import { color } from "../../styles/theme";
import { API } from "../../utils/api";
import { passwordReg, phoneNumReg } from "../../utils/Reg";

const FindPw = () => {
  const navigate = useNavigate();
  const [certification] = Form.useForm();
  const [changeForm] = Form.useForm();
  const [send, setSend] = useState(false);
  const [auth, setAuth] = useState(true);
  const [next, setNext] = useState(1);
  const [userIdx, setUserIdx] = useState();

  const authSendMutation = useMutation(
    (data) => API.post("/user/auth-send-pw", data),
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
        Modal.error({
          title: "핸드폰 인증 실패!",
          content: "가입 되어있는 번호가 아닙니다.",
          okText: "확인",
        });
      },
    }
  );

  const onSend = async () => {
    const phone_number = certification.getFieldValue(["auth", "phoneNum"]);
    const check = phoneNumReg.test(phone_number);
    if (check) {
      const formData = {
        phone_number,
      };
      authSendMutation.mutate(formData);
    } else {
      Modal.error({
        title: "핸드폰 인증 실패!",
        content: "핸드폰 번호를 올바르게 입력해 주세요.",
        okText: "확인",
      });
    }
  };

  const onAuthMutation = useMutation(
    (data) => API.post("/user/auth", data).then((res) => res.data),
    {
      onSuccess: (data) => {
        Modal.success({
          title: "인증번호 확인 완료",
          content: "휴대폰 인증이 완료되었습니다.",
          okText: "확인",
        });
        setAuth(false);
        setUserIdx(data.user_idx);
      },
      onError: (error) => {
        console.log(error);
        Modal.error({
          title: "인증번호 확인 실패",
          content: "인증번호가 올바르지 않습니다.",
          okText: "확인",
        });
      },
    }
  );

  const onAuth = async () => {
    const auth_number = certification.getFieldValue(["auth", "phoneAuth"]);
    const phone_number = certification.getFieldValue(["auth", "phoneNum"]);
    const formData = {
      auth_number,
      phone_number,
    };

    onAuthMutation.mutate(formData);
  };

  const onCheck = async (values) => {
    if (auth) {
      return Modal.error({
        title: "휴대폰 인증 오류",
        content: "휴대폰 인증을 완료해 주세요.",
        okText: "확인",
      });
    }
    try {
      setNext(2);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error.response);
      }
    }
  };

  const checkPw = async () => {
    const password = changeForm.getFieldValue("password");
    if (password && password.length < 8) {
      return Promise.reject(
        new Error("비밀번호는 최소 8자 이상이어야 합니다.")
      );
    }
    if (password && !passwordReg.test(password)) {
      return Promise.reject(
        new Error(
          "영어 대문자 또는 소문자, 숫자, 특수문자 최소 1자씩 조합해 주세요."
        )
      );
    }

    return Promise.resolve();
  };

  const modifyPasswordMutation = useMutation(
    (data) => API.put("/user/password", data),
    {
      onSuccess: () => {
        Modal.success({
          title: "비밀번호 변경 완료",
          content:
            "비밀번호 변경이 완료되었습니다. 새 비밀번호로 로그인해 주세요.",
          okText: "확인",
          onOk: () => navigate("/login"),
        });
      },
      onError: (error) => {
        if (axios.isAxiosError(error)) {
          console.log(error);
        }
      },
    }
  );

  const onModify = async (values) => {
    if (!values) return;
    const { password: new_password } = values;
    const { idx } = userIdx;
    const formData = {
      idx,
      new_password,
    };
    modifyPasswordMutation.mutate(formData);
  };

  const doubleCheck = async () => {
    const password1 = changeForm.getFieldValue("password");
    const password2 = changeForm.getFieldValue("confirm");
    if (password1 !== password2) {
      return Promise.reject(new Error("비밀번호가 서로 일치하지 않습니다."));
    }
    return Promise.resolve();
  };

  return (
    <LoggedOutLayout>
      <TextAtom fontSize={"2.4rem"} fontWeight="bold" marginBottom={"2.4rem"}>
        비밀번호 재설정
      </TextAtom>
      <TextAtom
        marginBottom={"3rem"}
        styles={css`
          white-space: pre-wrap;
        `}
      >{`가입 시 등록한 휴대폰 번호를 입력해 주세요.
인증 후 비밀번호 재설정이 가능합니다.`}</TextAtom>
      {next === 1 && (
        <Form
          form={certification}
          layout="vertical"
          onFinish={onCheck}
          style={{ width: "100%" }}
        >
          <Form.Item
            label="휴대폰 번호"
            name="auth"
            dependencies={["phoneNum", "phoneAuth"]}
          >
            <RowWrapper
              styles={css`
                width: 100%;
                flex-direction: column;
              `}
            >
              <RowWrapper
                marginBottom={"0.8rem"}
                styles={css`
                  width: 100%;
                `}
              >
                <Form.Item
                  name={["auth", "phoneNum"]}
                  noStyle
                  rules={[
                    { required: send, message: "휴대폰 번호를 입력해 주세요!" },
                  ]}
                >
                  <Input
                    placeholder="휴대폰 번호"
                    style={{ marginRight: 8, borderRadius: 4 }}
                    disabled={!auth}
                  />
                </Form.Item>
                <Button
                  type="primary"
                  style={{
                    width: 170,
                    borderRadius: 4,
                    background: !auth ? color.grey : color.mainBlue,
                  }}
                  onClick={onSend}
                  disabled={!auth}
                >
                  {send ? "재전송" : "인증번호 요청"}
                </Button>
              </RowWrapper>
              <RowWrapper
                styles={css`
                  width: 100%;
                `}
              >
                <Form.Item name={["auth", "phoneAuth"]} noStyle>
                  <Input
                    placeholder="인증 번호"
                    style={{ marginRight: 8, borderRadius: 4 }}
                    disabled={!auth}
                  />
                </Form.Item>
                <Button
                  type="primary"
                  style={{
                    width: 170,
                    borderRadius: 4,
                    background: !auth ? color.grey : color.mainBlue,
                  }}
                  disabled={!auth}
                  onClick={onAuth}
                >
                  확인
                </Button>
              </RowWrapper>
            </RowWrapper>
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
                background: color.mainBlue,
              }}
            >
              다음
            </Button>
          </Form.Item>
        </Form>
      )}
      {next === 2 && (
        <Form
          form={changeForm}
          layout="vertical"
          onFinish={onModify}
          style={{ width: "100%" }}
        >
          <Form.Item
            label="비밀번호"
            name="password"
            extra={
              <TextAtom
                fontSize={"1.2rem"}
                color={color.mainBlue}
                styles={css`
                  white-space: pre-wrap;
                `}
              >{`ㆍ최소 8글자
ㆍ영어 대문자 또는 소문자, 숫자, 특수문자 최소 1자씩 조합`}</TextAtom>
            }
            rules={[
              {
                required: true,
                message: "비밀번호를 입력해 주세요!",
              },
              { validator: checkPw, validateTrigger: "onChange" },
            ]}
            validateTrigger={["onChange"]}
          >
            <Input.Password placeholder="비밀번호를 입력해 주세요." />
          </Form.Item>

          <Form.Item
            label="비밀번호 확인"
            name="confirm"
            dependencies={["password"]}
            rules={[
              {
                required: true,
                message: "비밀번호를 입력해 주세요!",
              },
              { validator: doubleCheck, validateTrigger: "onChange" },
            ]}
            validateTrigger={["onChange"]}
          >
            <Input.Password placeholder="비밀번호를 입력해 주세요." />
          </Form.Item>
          <Form.Item noStyle>
            <Button
              type="primary"
              htmlType="submit"
              block
              style={{ height: 48, fontSize: 16, borderRadius: 4 }}
            >
              비밀번호 재설정
            </Button>
          </Form.Item>
        </Form>
      )}
    </LoggedOutLayout>
  );
};

export default FindPw;
