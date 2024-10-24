import { Form, Input, Modal } from "antd";
import TextAtom from "../../../../../components/atom/TextAtom";
import SettingSectionBox from "../atom/SettingSectionBox";
import { API } from "../../../../../utils/api";
import axios from "axios";
import { passwordReg } from "../../../../../utils/Reg";
import BasicButton from "../../../../../components/atom/BasicButton";
import { css } from "styled-components";
import { useMutation } from "react-query";
import { useAppContext } from "../../../../../utils/context";

const ChangePasswordSection = () => {
  const [form] = Form.useForm();
  const { logUserOut } = useAppContext();

  const updatePasswordMutation = useMutation(
    (data) => API.put("/user/my-password", data),
    {
      onSuccess: () => {
        Modal.success({
          title: "비밀번호 변경 완료!",
          content:
            "비밀번호가 변경되었습니다. 변경된 비밀번호로 다시 로그인해 주세요.",
          okText: "확인",
          onOk: () => {
            logUserOut("/login");
          },
        });
      },
      onError: (error) => {
        if (axios.isAxiosError(error)) {
          Modal.error({
            title: "비밀번호 변경 실패!",
            content: error.response.data.meessage,
            okText: "확인",
          });
        }
      },
    }
  );

  const onModify = async (values) => {
    updatePasswordMutation.mutate({ new_password: values.newPassword });
  };

  const checkPw = async () => {
    const password = form.getFieldValue("newPassword");
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

  const doubleCheck = async () => {
    const password1 = form.getFieldValue("newPassword");
    const password2 = form.getFieldValue("checkPassword");
    if (password1 !== password2) {
      return Promise.reject(new Error("비밀번호가 서로 일치하지 않습니다."));
    }
    return Promise.resolve();
  };

  const rightCheck = async () => {
    const password = form.getFieldValue("nowPassword");
    if (password) {
      try {
        await API.post("/user/my-password-auth", { password });
        return Promise.resolve();
      } catch (error) {
        return Promise.reject(new Error("기존 비밀번호와 일치하지 않습니다."));
      }
    }
  };

  return (
    <SettingSectionBox>
      <TextAtom fontSize={"2rem"} fontWeight={600} marginBottom="2.4rem">
        비밀번호 재설정
      </TextAtom>
      <TextAtom fontSize={"1.6rem"} marginBottom="2.4rem">
        비밀번호 확인 후 재설정이 가능합니다.
      </TextAtom>
      <Form
        form={form}
        layout="vertical"
        onFinish={onModify}
        style={{ width: "100%" }}
      >
        <Form.Item
          label="기존 비밀번호"
          name="nowPassword"
          style={{ marginBottom: 10 }}
          rules={[
            {
              required: true,
              message: "기존 비밀번호를 입력해 주세요!",
            },
            { validator: rightCheck, validateTrigger: "onBlur" },
          ]}
          validateTrigger={["onBlur"]}
        >
          <Input.Password
            placeholder="기존 비밀번호"
            style={{ marginRight: 5, borderRadius: 4 }}
          />
        </Form.Item>
        <Form.Item
          label="새로운 비밀번호"
          name="newPassword"
          style={{ marginBottom: 10 }}
          rules={[
            {
              required: true,
              message: "새 비밀번호를 입력해 주세요!",
            },
            { validator: checkPw, validateTrigger: "onChange" },
          ]}
          validateTrigger={["onChange"]}
        >
          <Input.Password
            placeholder="새로운 비밀번호"
            style={{ marginRight: 5, borderRadius: 4 }}
          />
        </Form.Item>
        <Form.Item
          label="비밀번호 확인"
          name="checkPassword"
          dependencies={["password"]}
          rules={[
            {
              required: true,
              message: "새 비밀번호를 입력해 주세요!",
            },
            { validator: doubleCheck, validateTrigger: "onChange" },
          ]}
          validateTrigger={["onChange"]}
          style={{ marginBottom: "4rem" }}
        >
          <Input.Password
            placeholder="새로운 비밀번호 재입력"
            style={{ borderRadius: 4 }}
          />
        </Form.Item>
        <BasicButton
          focused
          htmlType="submit"
          size={"large"}
          styles={css`
            width: 100%;
            min-height: 4.8rem;
          `}
        >
          비밀번호 재설정
        </BasicButton>
      </Form>
    </SettingSectionBox>
  );
};

export default ChangePasswordSection;
