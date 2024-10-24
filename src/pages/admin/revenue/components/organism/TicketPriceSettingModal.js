import { Divider, Input, Modal } from "antd";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { css } from "styled-components";
import { queryClient } from "../../../../../App";
import BasicButton from "../../../../../components/atom/BasicButton";
import TextAtom from "../../../../../components/atom/TextAtom";
import { API } from "../../../../../utils/api";

const TicketPriceSettingModal = ({ open, onCancel: onCancelProp }) => {
  const [priceInput, setPriceInput] = useState("");

  useQuery(
    ["adminGetPaymentSettingQuery", open],
    async () => {
      if (!open) return;
      return await API.get("/admin/payment-setting").then((res) => res.data);
    },
    {
      onSuccess: (data) => {
        if (!data) return;
        const { amount } = data;
        setPriceInput(amount);
      },
    }
  );

  const onCancel = () => {
    setPriceInput("");
    onCancelProp();
  };

  const updatePaymentMutation = useMutation(
    (data) => API.put("/admin/payment-setting", data),
    {
      onSuccess: () => {
        queryClient.fetchQuery("adminGetPaymentSettingQuery");
        Modal.success({
          title: "이용권 정보 수정 완료",
          content: "이용권 정보가 수정되었습니다.",
          onOk: () => {
            onCancel();
          },
          okText: "확인",
        });
      },
    }
  );

  const onClickSave = () => {
    const formData = {
      name: "베이직",
      amount: priceInput,
    };
    updatePaymentMutation.mutate(formData);
  };

  return (
    <Modal
      open={open}
      title={`이용권 정보 설정`}
      onCancel={onCancel}
      footer={[]}
      bodyStyle={{ padding: "0 1.6rem" }}
      maskClosable={false}
    >
      <Divider style={{ marginTop: "2rem" }} />
      <TextAtom fontSize={"1.4rem"} fontWeight={500} marginBottom="0.8rem">
        베이직
      </TextAtom>
      <Input
        value={priceInput}
        onChange={(e) => setPriceInput(e.target.value)}
        placeholder="금액 입력"
        type="number"
        style={{ marginBottom: "3rem" }}
      />

      <BasicButton
        size={"large"}
        focused
        styles={css`
          width: 100%;
        `}
        onClick={onClickSave}
      >
        적용하기
      </BasicButton>
    </Modal>
  );
};

export default TicketPriceSettingModal;
