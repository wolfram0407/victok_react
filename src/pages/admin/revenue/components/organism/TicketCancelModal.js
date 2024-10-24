import { Divider, Input, Modal } from "antd";
import { useState } from "react";
import { useMutation } from "react-query";
import { css } from "styled-components";
import { queryClient } from "../../../../../App";
import BasicButton from "../../../../../components/atom/BasicButton";
import TextAtom from "../../../../../components/atom/TextAtom";
import { API } from "../../../../../utils/api";

const TicketCancelModal = ({ open, onCancel, targetId }) => {
  const [priceInput, setPriceInput] = useState("");
  const [memoInput, setMemoInput] = useState("");

  const onClickCancel = () => {
    if (priceInput) {
      setPriceInput("");
    }
    if (memoInput) {
      setMemoInput("");
    }
    onCancel();
  };

  const refundMutation = useMutation(
    (data) => API.put("/admin/payment", data),
    {
      onSuccess: () => {
        queryClient.fetchQuery("adminPaymentQuery");
        Modal.success({
          title: "결제 취소/환불 처리 완료",
          content: "취소/환불 처리가 완료되었습니다.",
          onOk: () => {
            onCancel();
            setPriceInput("");
            setMemoInput("");
          },
          okText: "확인",
        });
      },
    }
  );

  const onClickSave = () => {
    if (!priceInput)
      return Modal.error({
        title: "알림",
        content: "취소/환불 금액을 입력해 주세요.",
        okText: "확인",
      });
    if (priceInput !== "") {
      const formData = {
        payment_idx: targetId,
        amount: priceInput,
        memo: memoInput,
      };
      refundMutation.mutate(formData);
    }
    onClickCancel();
  };

  return (
    <Modal
      open={open}
      title={`결제 취소/환불`}
      onCancel={onClickCancel}
      footer={[]}
      bodyStyle={{ padding: "0 1.6rem" }}
      maskClosable={false}
    >
      <Divider style={{ marginTop: "2rem" }} />
      <TextAtom fontSize={"1.4rem"} fontWeight={500} marginBottom="0.8rem">
        취소/환불 금액
      </TextAtom>
      <Input
        value={priceInput}
        onChange={(e) => setPriceInput(e.target.value.replace(/[^0-9]/g, ""))}
        placeholder="금액 입력"
        style={{ marginBottom: "1.6rem" }}
      />
      <TextAtom fontSize={"1.4rem"} fontWeight={500} marginBottom="0.8rem">
        메모
      </TextAtom>
      <Input
        value={memoInput}
        onChange={(e) => setMemoInput(e.target.value)}
        placeholder="메모 입력"
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

export default TicketCancelModal;
