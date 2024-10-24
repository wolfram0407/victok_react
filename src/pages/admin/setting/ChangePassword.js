import { Form, Input, Modal } from "antd";
import axios from "axios";
import React from "react";
import { useMutation } from "react-query";
import { css } from "styled-components";
import BasicButton from "../../../components/atom/BasicButton";
import AdminSettingLayout from "../../../components/layouts/AdminSettingLayout";
import LoggedInLayout from "../../../components/layouts/LoggedInLayout";
import { API } from "../../../utils/api";
import { useAppContext } from "../../../utils/context";
import { passwordReg } from "../../../utils/Reg";

const ChangePassword = () => {
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

  return (
    <LoggedInLayout>
      <AdminSettingLayout
        title={"비밀번호 재설정"}
        caption={`새로운 비밀번호를 입력해주세요!
비밀번호 변경 후 새 비밀번호로 로그인해주세요.`}
        captionMarginBottom={"3rem"}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onModify}
          style={{ width: "100%" }}
        >
          <Form.Item
            label="새 비밀번호"
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
              placeholder="비밀번호를 입력해 주세요."
              style={{ marginRight: 5, borderRadius: 4 }}
            />
          </Form.Item>
          <Form.Item
            label="새 비밀번호 확인"
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
              placeholder="비밀번호를 입력해 주세요."
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
      </AdminSettingLayout>
    </LoggedInLayout>
  );
};

export default ChangePassword;
