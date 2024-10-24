import { Checkbox, Form, Input, Modal } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useMutation } from "react-query";
import styled, { css } from "styled-components";
import { queryClient } from "../../../../../App";
import BasicButton from "../../../../../components/atom/BasicButton";
import RowWrapper from "../../../../../components/atom/RowWrapper";
import TextAtom from "../../../../../components/atom/TextAtom";
import { API } from "../../../../../utils/api";

import { phoneNumReg } from "../../../../../utils/Reg";

const CheckBoxWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 4rem;
`;

const Wrapper = styled.div``;

const BasicInfoSection = ({ userInfo, user_idx }) => {
  const [isReCertification, setIsReCertification] = useState(false);
  const [isSendCode, setIsSendCode] = useState(false);
  const [certificated, setCertificated] = useState(false);
  const [agreeMarketing, setAgreeMarketing] = useState(0);

  // 뮤테이션 등 실행시 중복 클릭 방지용 로딩
  const [mutationLoading, setMutationLoading] = useState(false);

  const [form] = Form.useForm();

  const phoneCertificateMutation = useMutation(
    (data) => {
      setMutationLoading(true);
      return API.post("/user/auth-send", data);
    },
    {
      onSuccess: () => {
        Modal.success({
          title: "인증번호 발송",
          content: "입력하신 휴대폰 번호로 인증번호가 발송되었습니다.",
          okText: "확인",
          onOk: () => setMutationLoading(false),
        });
        setIsSendCode(true);
      },
      onError: (error) => {
        console.log(error);
        Modal.error({
          title: "핸드폰 인증 실패!",
          content: "이미 가입된 번호입니다.",
          okText: "확인",
          onOk: () => setMutationLoading(false),
        });
      },
    }
  );

  const onClickReCertification = () => {
    const phone_number = form.getFieldValue("phone_number");
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

  const onAuthMutation = useMutation(
    (data) => {
      setMutationLoading(true);
      return API.post("/user/auth", data);
    },
    {
      onSuccess: () => {
        Modal.success({
          title: "인증번호 확인 완료",
          content: "휴대폰 인증이 완료되었습니다.",
          okText: "확인",
          onOk: () => setMutationLoading(false),
        });
        setIsReCertification(false);
        setCertificated(true);
      },
      onError: (error) => {
        console.log(error);
        Modal.error({
          title: "인증번호 확인 실패",
          content: "인증번호가 올바르지 않습니다.",
          okText: "확인",
          onOk: () => setMutationLoading(false),
        });
      },
    }
  );

  const onAuth = () => {
    const { phone_number, auth_number } = form.getFieldsValue();
    onAuthMutation.mutate({ phone_number, auth_number });
  };

  const updateUserInfoMutation = useMutation(
    (data) => {
      setMutationLoading(true);
      return API.put("/admin/user-info", data);
    },
    {
      onSuccess: () => {
        Modal.success({
          title: "개인 정보 수정 완료!",
          content: "개인 정보가 수정되었습니다.",
          okText: "확인",
          onOk: () => {
            setIsReCertification(false);
            setIsSendCode(false);
            setCertificated(false);
            form.setFieldsValue({ auth_number: null });
            setMutationLoading(false);
          },
        });
        queryClient.fetchQuery("adminUserInfo");
      },
      onError: (error) => {
        if (axios.isAxiosError(error)) {
          Modal.error({
            title: "개인 정보 수정 실패!",
            content: error.response.data.message,
            okText: "확인",
            onOk: () => {
              const { email, name, phone } = userInfo;
              setIsSendCode(false);
              setCertificated(false);
              form.setFieldsValue({
                auth_number: null,
                email,
                name,
                phone_number: phone,
              });
              setMutationLoading(false);
            },
          });
        }
      },
    }
  );

  const onToggleMargeting = () => {
    if (agreeMarketing === 0) {
      setAgreeMarketing(1);
    } else {
      setAgreeMarketing(0);
    }
  };

  const onClickSave = (values) => {
    if (
      (values.phone_number !== userInfo.phone && !values.auth_number) ||
      (values.phone_number !== userInfo.phone && !certificated)
    )
      return Modal.error({
        title: "개인 정보 수정 실패!",
        content: "핸드폰 번호 인증을 완료해 주세요.",
        okText: "확인",
      });
    if (!values) return;

    const { email, name, phone_number } = values;
    const formData = {
      user_idx: parseInt(user_idx),
      name,
      agree_marketing: agreeMarketing,
      email,
      phone: phone_number,
    };

    if (
      Object.values(userInfo).filter(
        (data) => !Object.values(formData).includes(data)
      ).length === 0
    )
      return;

    updateUserInfoMutation.mutate(formData);
  };

  const checkBoxList = [
    {
      id: 1,
      body: "서비스 이용약관",
      defaultChecked: true,
      disabled: true,
    },
    {
      id: 2,
      body: "개인정보 수집 및 이용",
      defaultChecked: true,
      disabled: true,
    },
    {
      id: 3,
      body: "마케팅 정보 수신",
      defaultChecked: Boolean(agreeMarketing === 1),
      disabled: false,
      onChange: onToggleMargeting,
    },
  ];

  useEffect(() => {
    const { agree_marketing, email, name, phone } = userInfo;
    form.setFieldsValue({
      email,
      name,
      phone_number: phone,
    });
    setAgreeMarketing(agree_marketing);
    // eslint-disable-next-line
  }, [userInfo]);

  return (
    <>
      <TextAtom fontSize={"2rem"} fontWeight={600} marginBottom="2.4rem">
        기본 정보
      </TextAtom>
      <Form
        form={form}
        layout="vertical"
        name="basicInfo"
        style={{ width: "45rem" }}
        onFinish={onClickSave}
      >
        <Form.Item
          name="name"
          label="이름"
          rules={[
            {
              required: true,
              message: "이름을 입력해 주세요.",
            },
          ]}
        >
          <Input placeholder="이름을 입력해 주세요." />
        </Form.Item>
        <Form.Item
          name="email"
          label="이메일"
          rules={[
            {
              required: true,
              message: "이메일을 입력해 주세요.",
            },
          ]}
        >
          <Input placeholder="이메일을 입력해 주세요." />
        </Form.Item>
        <Wrapper>
          <RowWrapper
            styles={css`
              align-items: center;
              gap: 0.6rem;
            `}
            marginBottom={isSendCode ? "1.6rem" : "4rem"}
          >
            <Form.Item
              label="휴대폰 번호"
              name={"phone_number"}
              rules={[
                { required: true, message: "휴대폰 번호를 입력해주세요." },
              ]}
              style={{ width: "100%", margin: 0 }}
            >
              <Input
                placeholder="휴대폰 번호"
                onChange={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, "");
                  return form.setFieldValue("phone_number", e.target.value);
                }}
                maxLength={11}
                disabled={!isReCertification || isSendCode}
              />
            </Form.Item>
            <BasicButton
              styles={css`
                width: 15rem;
                margin-top: 3rem;
              `}
              focused
              onClick={() =>
                mutationLoading ? null : onClickReCertification()
              }
              disabled={isSendCode}
            >
              {isReCertification ? "인증번호 요청" : "수정"}
            </BasicButton>
          </RowWrapper>
          {isSendCode && (
            <RowWrapper
              styles={css`
                align-items: flex-start;
                gap: 0.6rem;
                margin-bottom: 4rem;
              `}
            >
              <Form.Item
                name={"auth_number"}
                rules={[
                  { required: true, message: "인증번호를 입력해주세요." },
                ]}
                style={{ width: "100%", margin: 0 }}
              >
                <Input placeholder="인증 번호" type="number" maxLength={11} />
              </Form.Item>
              <BasicButton
                focused
                styles={css`
                  width: 15rem;
                `}
                onClick={() => (mutationLoading ? null : onAuth())}
                disabled={certificated}
              >
                확인
              </BasicButton>
            </RowWrapper>
          )}
        </Wrapper>

        <TextAtom fontSize={"2rem"} fontWeight={600} marginBottom="1.4rem">
          이용약관 동의
        </TextAtom>
        <CheckBoxWrapper>
          {checkBoxList.map((item, index) => (
            <Checkbox
              key={item.id}
              checked={item.defaultChecked}
              style={{
                padding: 0,
                margin: 0,
                marginBottom: index !== checkBoxList.length - 1 ? "1rem" : 0,
              }}
              disabled={item.disabled}
              onChange={() => item.onChange()}
            >
              {item.body}
            </Checkbox>
          ))}
        </CheckBoxWrapper>

        <Form.Item noStyle>
          <BasicButton
            focused
            styles={css`
              width: 100%;
              height: 4rem;
            `}
            htmlType="submit"
            disabled={mutationLoading}
          >
            저장
          </BasicButton>
        </Form.Item>
      </Form>
    </>
  );
};

export default BasicInfoSection;
