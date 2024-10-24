import { Input, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { css } from "styled-components";
import { queryClient } from "../../../App";
import BasicButton from "../../../components/atom/BasicButton";
import TextAtom from "../../../components/atom/TextAtom";
import AdminSettingLayout from "../../../components/layouts/AdminSettingLayout";
import LoggedInLayout from "../../../components/layouts/LoggedInLayout";
import { API } from "../../../utils/api";

const LinkSetting = () => {
  const [prevData, setPrevData] = useState({
    termsInput: "",
    privacyInput: "",
    faqInput: "",
    refundInput: "",
  });
  const [termsInput, setTermsInput] = useState("");
  const [privacyInput, setPrivacyInput] = useState("");
  const [faqInput, setFaqInput] = useState("");
  const [refundInput, setRefundInput] = useState("");
  const [isChange, setIsChange] = useState(false);

  useQuery(
    "adminTermsQuery",
    async () => await API.get("/user/terms").then((res) => res.data),
    {
      onSuccess: (data) => {
        if (!data) return;
        const { terms_of_use, privacy_policy, faq, refund_policy } = data[0];
        setTermsInput(terms_of_use);
        setPrivacyInput(privacy_policy);
        setFaqInput(faq);
        setRefundInput(refund_policy);
        setPrevData({
          termsInput: terms_of_use,
          privacyInput: privacy_policy,
          faqInput: faq,
          refundInput: refund_policy,
        });
      },
    }
  );

  const linkList = [
    {
      id: 1,
      title: "서비스이용약관",
      placeholder: "서비스이용약관 주소를 입력해 주세요.",
      value: termsInput,
      setValue: setTermsInput,
    },
    {
      id: 2,
      title: "개인정보처리방침",
      placeholder: "개인정보처리방침 주소를 입력해 주세요.",
      value: privacyInput,
      setValue: setPrivacyInput,
    },
    {
      id: 3,
      title: "자주하는 질문 (FAQ)",
      placeholder: "자주하는 질문 주소를 입력해 주세요.",
      value: faqInput,
      setValue: setFaqInput,
    },
    {
      id: 4,
      title: "취소·환불 정책",
      placeholder: "취소·환불 정책 주소를 입력해 주세요.",
      value: refundInput,
      setValue: setRefundInput,
    },
  ];

  const saveTermsMutation = useMutation(
    (data) => API.put("/admin/terms", data),
    {
      onSuccess: () => {
        Modal.success({
          title: "링크 수정 완료",
          content: "링크가 수정되었습니다.",
          okText: "확인",
        });
        queryClient.fetchQuery("adminTermsQuery");
      },
    }
  );

  const onClickSave = () => {
    if (!isChange) {
      return;
    }
    let formData = {};
    linkList.forEach((link, index) => {
      return (formData[`link${index + 1}`] = link.value);
    });
    saveTermsMutation.mutate(formData);
  };

  useEffect(() => {
    if (
      prevData.termsInput !== termsInput ||
      prevData.privacyInput !== privacyInput ||
      prevData.faqInput !== faqInput ||
      prevData.refundInput !== refundInput
    ) {
      setIsChange(true);
      return;
    }
    setIsChange(false);
  }, [prevData, termsInput, privacyInput, faqInput, refundInput]);

  return (
    <LoggedInLayout>
      <AdminSettingLayout
        title={"링크 관리"}
        caption={
          "서비스이용약관 / 개인정보처리방침 / 자주하는 질문 / 취소·환불 정책 링크에 적용됩니다."
        }
        captionMarginBottom={"5rem"}
      >
        {linkList.map((item, index) => (
          <React.Fragment key={item.id}>
            <TextAtom
              fontSize={"1.6rem"}
              fontWeight={700}
              marginBottom="1.2rem"
            >
              {item.title}
            </TextAtom>
            <Input
              placeholder={item.placeholder}
              value={item.value}
              onChange={(e) => item.setValue(e.target.value)}
              style={{
                marginBottom: index !== linkList.length - 1 ? "4rem" : "5rem",
              }}
            />
          </React.Fragment>
        ))}
        <BasicButton
          size={"large"}
          focused
          styles={css`
            width: 100%;
          `}
          onClick={onClickSave}
          // disabled={!isChange}
        >
          저장
        </BasicButton>
      </AdminSettingLayout>
    </LoggedInLayout>
  );
};

export default LinkSetting;
