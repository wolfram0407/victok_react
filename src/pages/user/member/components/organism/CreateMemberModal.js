import { Form, Modal } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { css } from "styled-components";
import RowWrapper from "../../../../../components/atom/RowWrapper";
import TextAtom from "../../../../../components/atom/TextAtom";
import ModalLayout from "../../../../../components/layouts/ModalLayout";
import { useState } from "react";
import MemberInfoSection from "../section/MemberInfoSection";
import { useMutation } from "react-query";
import { API } from "../../../../../utils/api";
import axios from "axios";
import { queryClient } from "../../../../../App";

const CreateMemberModal = ({
  open,
  setCreateMemberModal,
  user_idx,
  isAdmin = false,
}) => {
  const [infoForm] = Form.useForm();
  const [isInfoBox, setIsInfoBox] = useState(false);
  const onCancel = () => {
    setCreateMemberModal(false);
    infoForm.setFieldsValue({
      name: "",
      gender: "",
      hp: "",
      birth: "",
      tags: [],
      memo: "",
    });
  };

  const onClickLayout = () => {
    if (isInfoBox) {
      setIsInfoBox(false);
    }
  };

  const createMemberMutation = useMutation(
    async (data) => await API.post("/customer/customer", data),
    {
      onSuccess: () => {
        Modal.success({
          title: "사용자 등록 완료",
          content: "사용자가 등록되었습니다.",
          okText: "확인",
          onOk: () => {
            onCancel();
          },
        });
        queryClient.fetchQuery("allMemberData");
      },
      onError: (error) => {
        if (axios.isAxiosError(error)) {
          if (error.response.status === 409) {
            return Modal.error({
              title: "회원 등록 실패",
              content: "해당 정보로 등록된 회원이 존재합니다.",
              okText: "확인",
            });
          } else {
            return Modal.error({
              title: "회원 등록 실패",
              content: error.response.data.message ?? "입력값을 확인해주세요",
              okText: "확인",
            });
          }
        } else {
          console.log(error);
        }
      },
    }
  );

  const onClickCreate = () => {
    const {
      name: customer_name,
      gender,
      hp: customer_phone,
      birth,
      tags,
      memo,
      agree_marketing,
    } = infoForm.getFieldsValue();
    const formData = {
      customer_name,
      customer_phone,
      memo,
      user_idx: user_idx,
      gender,
      birth,
      tags,
      agree_marketing: agree_marketing ? 1 : 0,
    };
    if (!customer_name || customer_name.length === 0) {
      return Modal.error({
        title: "회원 등록 실패",
        content: "회원 이름을 입력해주세요.",
        okText: "확인",
      });
    }
    if (!customer_phone || customer_phone.length === 0) {
      return Modal.error({
        title: "회원 등록 실패",
        content: "회원 휴대폰 번호를 입력해주세요.",
        okText: "확인",
      });
    }
    createMemberMutation.mutate(formData);
  };

  return (
    <Modal
      open={open}
      title={
        <RowWrapper
          styles={css`
            justify-content: space-between;
          `}
        >
          <TextAtom>회원 등록</TextAtom>
          <CloseOutlined style={{ cursor: "pointer" }} onClick={onCancel} />
        </RowWrapper>
      }
      closable={false}
      footer={[]}
      onCancel={onCancel}
      maskClosable={false}
    >
      <ModalLayout focused onClick={onClickLayout}>
        <MemberInfoSection
          form={infoForm}
          structure="modal"
          onClickDoneBtn={onClickCreate}
          isAdmin={isAdmin}
          user_idx={user_idx}
        />
      </ModalLayout>
    </Modal>
  );
};

export default CreateMemberModal;
