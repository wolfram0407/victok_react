import { Form, Input, Modal } from "antd";
import { useState, useEffect } from "react";
import { useMutation } from "react-query";
import styled, { css } from "styled-components";
import BasicButton from "../../../../../components/atom/BasicButton";
import RowWrapper from "../../../../../components/atom/RowWrapper";
import TextAtom from "../../../../../components/atom/TextAtom";
import { API } from "../../../../../utils/api";
import SettingSectionBox from "../atom/SettingSectionBox";
import { phoneNumReg } from "../../../../../utils/Reg";
import axios from "axios";

const Wrapper = styled.div``;

const EditAccountSection = ({ meData }) => {
  const [isReCertification, setIsReCertification] = useState(false);
  const [isSendCode, setIsSendCode] = useState(false);
  const [reCertificated, setRecertificated] = useState(false);
  const [form] = Form.useForm();

  const phoneCertificateMutation = useMutation(
    (data) => API.post("/user/auth-send", data),
    {
      onSuccess: () => {
        Modal.success({
          title: "인증번호 발송",
          content: "입력하신 휴대폰 번호로 인증번호가 발송되었습니다.",
          okText: "확인",
        });
        setIsSendCode(true);
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

  const onClickReCertification = () => {
    const phone_number = form.getFieldValue(["auth", "phone_number"]);
    const checkPhone = phoneNumReg.test(phone_number);
    if (!isReCertification) {
      setIsReCertification(true);
      return;
    }
    if (checkPhone) {
      phoneCertificateMutation.mutate({ phone_number });
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
      setIsReCertification(false);
      setRecertificated(true);
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

  const onAuth = () => {
    const {
      auth: { phone_number, auth_number },
    } = form.getFieldsValue();
    onAuthMutation.mutate({ phone_number, auth_number });
  };

  const onModifyMutation = useMutation(
    (data) => API.put("/user/user-info", data),
    {
      onSuccess: () => {
        Modal.success({
          title: "개인 정보 수정 완료!",
          content: "개인 정보가 수정되었습니다.",
          okText: "확인",
          onOk: () => {
            setRecertificated(false);
            setIsSendCode(false);
            form.setFieldValue(["auth", "auth_number"], "");
          },
        });
      },
      onError: (error) => {
        const displayError = axios.isAxiosError(error)
          ? error.response.data
          : error;
        Modal.error({
          title: "개인 정보 수정 실패!",
          content: displayError,
          okText: "확인",
        });
      },
    }
  );

  const onModify = (values) => {
    const phoneNum = values ? values.auth.phone_number : "";
    const changePhone = meData.phone !== phoneNum;
    if (changePhone && !(phoneNum && reCertificated)) {
      return Modal.error({
        title: "개인 정보 수정 실패!",
        content: "핸드폰 번호 인증을 완료해 주세요.",
        okText: "확인",
      });
    }
    if (!values) return;
    const {
      user_name: name,
      auth: { phone_number: phone },
      user_email: email,
    } = values;
    const formData = {
      name,
      phone,
      email,
    };

    onModifyMutation.mutate(formData);
  };

  useEffect(() => {
    if (!meData) return;
    const { user_name, phone, user_email } = meData;
    form.setFieldsValue({
      user_name,
      user_email,
      auth: {
        phone_number: phone,
      },
    });
    // eslint-disable-next-line
  }, [meData]);

  return (
    <SettingSectionBox>
      <TextAtom fontSize={"2rem"} fontWeight={600} marginBottom="2.4rem">
        개인 정보 수정
      </TextAtom>
      <Form form={form} layout="vertical" onFinish={onModify}>
        <Form.Item
          label="이름"
          name={"user_name"}
          rules={[{ required: true, message: "이름을 입력해 주세요!" }]}
        >
          <Input placeholder="이름을 입력해 주세요." />
        </Form.Item>

        <Form.Item
          label="이메일"
          name={"user_email"}
          rules={[{ required: true, message: "이메일을 입력해 주세요!" }]}
        >
          <Input placeholder="이메일을 입력해 주세요." disabled />
        </Form.Item>
        <Wrapper>
          <RowWrapper
            styles={css`
              align-items: center;
              gap: 0.6rem;
              ${!isSendCode &&
              css`
                margin-bottom: 4rem;
              `}
            `}
            marginBottom="1.6rem"
          >
            <Form.Item
              label="휴대폰 번호"
              name={["auth", "phone_number"]}
              rules={[{ required: true }]}
              style={{ width: "100%", margin: 0 }}
            >
              <Input
                placeholder="휴대폰 번호"
                type="number"
                maxLength={11}
                disabled={!isReCertification || isSendCode}
              />
            </Form.Item>
            <BasicButton
              styles={css`
                width: 15rem;
                align-self: flex-end;
              `}
              focused
              onClick={onClickReCertification}
              disabled={isSendCode}
            >
              {isReCertification ? "인증번호 요청" : "재인증"}
            </BasicButton>
          </RowWrapper>
          {isSendCode && (
            <RowWrapper
              styles={css`
                align-items: center;
                gap: 0.6rem;
                margin-bottom: 4rem;
              `}
            >
              <Form.Item
                name={["auth", "auth_number"]}
                rules={[{ required: isSendCode ? true : false }]}
                style={{ width: "100%", margin: 0 }}
              >
                <Input placeholder="인증 번호" type="number" maxLength={11} />
              </Form.Item>
              <BasicButton
                focused
                styles={css`
                  width: 15rem;
                `}
                onClick={onAuth}
              >
                확인
              </BasicButton>
            </RowWrapper>
          )}
        </Wrapper>
        <BasicButton
          focused
          htmlType={"sumbit"}
          size={"large"}
          styles={css`
            width: 100%;
          `}
        >
          수정
        </BasicButton>
      </Form>
    </SettingSectionBox>
  );
};

export default EditAccountSection;
