import { Divider, Input, Modal } from "antd";
import axios from "axios";
import React, { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { css } from "styled-components";
import { queryClient } from "../../../../../App";
import BasicButton from "../../../../../components/atom/BasicButton";
import TextAtom from "../../../../../components/atom/TextAtom";
import { API } from "../../../../../utils/api";

const MessagePriceSettingModal = ({ open, onCancel: onCancelProp }) => {
  const [shortPriceInput, setShortPriceInput] = useState("");
  const [longPriceInput, setLongPriceInput] = useState("");
  const [photoPriceInput, setPhotoPriceInput] = useState("");

  useQuery(
    "messageSettingQuery",
    () => API.get("/message/message-setting").then((res) => res.data),
    {
      onSuccess: (data) => {
        if (!data) return;
        const { SMS, LMS, MMS } = data;
        setShortPriceInput(SMS);
        setLongPriceInput(LMS);
        setPhotoPriceInput(MMS);
      },
    }
  );

  const onCancel = () => {
    setShortPriceInput("");
    setLongPriceInput("");
    setPhotoPriceInput("");
    onCancelProp();
  };

  const editPriceMutation = useMutation(
    (data) => API.post("/message/message-setting", data),
    {
      onSuccess: () => {
        queryClient.fetchQuery("messageSettingQuery");
        Modal.success({
          title: "메시지 금액 수정 완료!",
          content: "메시지 금액 수정이 완료되었습니다.",
          okText: "확인",
          onOk: onCancel,
        });
      },
      onError: (error) => {
        if (axios.isAxiosError(error)) {
          console.log(error.response);
        } else {
          console.log(error);
        }
        Modal.error({
          title: "메시지 금액 수정 실패!",
          content: error.response.data.meessage,
          okText: "확인",
          onOk: onCancel,
        });
      },
    }
  );

  const onClickSave = () => {
    if (
      shortPriceInput !== "" ||
      longPriceInput !== "" ||
      photoPriceInput !== ""
    ) {
      const formData = {
        sms: Number(shortPriceInput),
        lms: Number(longPriceInput),
        mms: Number(photoPriceInput),
      };
      editPriceMutation.mutate(formData);
    }
  };

  const inputList = [
    {
      id: 1,
      title: "단문 건당 금액",
      value: shortPriceInput,
      setValue: setShortPriceInput,
    },
    {
      id: 2,
      title: "장문 건당 금액",
      value: longPriceInput,
      setValue: setLongPriceInput,
    },
    {
      id: 3,
      title: "포토 건당 금액",
      value: photoPriceInput,
      setValue: setPhotoPriceInput,
    },
  ];

  return (
    <Modal
      open={open}
      title={`메시지 금액 설정`}
      onCancel={onCancel}
      footer={[]}
      bodyStyle={{ padding: "0 1.6rem" }}
      maskClosable={false}
    >
      <Divider style={{ marginTop: "2rem" }} />
      {inputList.map((item, index) => (
        <React.Fragment key={item.id}>
          <TextAtom fontSize={"1.4rem"} fontWeight={500} marginBottom="0.8rem">
            {item.title}
          </TextAtom>
          <Input
            value={item.value}
            onChange={(e) => item.setValue(e.target.value)}
            placeholder="금액 입력"
            type="number"
            style={{
              marginBottom: index !== inputList.length - 1 ? "2rem" : "3rem",
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
      >
        적용하기
      </BasicButton>
    </Modal>
  );
};

export default MessagePriceSettingModal;
