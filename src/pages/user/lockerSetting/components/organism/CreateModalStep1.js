import { Form, Input } from "antd";
import { useState } from "react";
import { css } from "styled-components";
import BasicButton from "../../../../../components/atom/BasicButton";
import RowWrapper from "../../../../../components/atom/RowWrapper";

import { useEffect } from "react";
import BasicTag from "../../../../../components/atom/BasicTag";

const page1InputList = [
  {
    id: 1,
    name: "name",
    label: "라카 이름",
    rules: [
      { required: true, message: "라카 이름을 입력해 주세요." },
      { type: "string", max: 10 },
    ],
    inputPlaceholder: "라카 이름을 입력해 주세요(10자 이내).",
    inputMaxLength: 10,
    inputType: "string",
  },
  {
    id: 2,
    name: "max",
    label: "라카 수",
    rules: [
      { required: true, message: "라카 총 개수를 입력해 주세요." },
      {
        message: "숫자만 입력 가능합니다.",
        pattern: /[0-9]/g,
      },
    ],
    inputPlaceholder: "라카 총 개수를 입력해 주세요.",
    inputMaxLength: 5,
    inputType: "number",
    customOnChange: (e, item) => {
      e.target.value = e.target.value
        .replace(/[^0-9]/g, "")
        .replace(/(^0+)/, "")
        .slice(0, item.inputMaxLength);
    },
  },
  {
    id: 3,
    name: "startNum",
    label: "시작 번호",
    rules: [
      { required: true, message: "라카 시작 번호를 입력해 주세요." },
      {
        required: true,
        message: "숫자만 입력 가능합니다.",
        pattern: /[0-9]/g,
      },
    ],
    inputPlaceholder: "라카 시작 번호를 입력해 주세요.",
    inputMaxLength: 5,
    inputType: "number",
  },
];

const CreateModalStep1 = ({
  infoForm,
  onClickNext,
  exceptTags,
  setExceptTags,
}) => {
  const [exceptInputText, setExceptInputText] = useState("");

  const onAddExceptTag = (text) => {
    if (text === "") {
      return;
    }
    setExceptTags((prev) => [...prev, text]);
    setExceptInputText("");
  };
  const onDeleteExceptTag = (index) => {
    setExceptTags((prev) => [
      ...prev.slice(0, index),
      ...prev.slice(index + 1),
    ]);
  };

  useEffect(() => {
    infoForm.setFieldValue("except", exceptTags.join(","));
  }, [exceptTags, infoForm]);

  return (
    <Form
      form={infoForm}
      name="info"
      layout="vertical"
      autoComplete="off"
      style={{ width: "100%" }}
      onFinish={onClickNext}
    >
      {page1InputList.map((item) => (
        <Form.Item
          key={item.id}
          name={item.name}
          label={item.label}
          rules={item.rules}
        >
          <Input
            placeholder={item.inputPlaceholder}
            maxLength={item.inputMaxLength ?? null}
            // type={item.inputType}
            onChange={(e) => {
              if (item.customOnChange) {
                item.customOnChange(e, item);
              } else {
                if (item.inputType === "number") {
                  e.target.value = e.target.value
                    .replace(/[^0-9]/g, "")
                    .slice(0, item.inputMaxLength);
                } else {
                  e.target.value = e.target.value.slice(0, item.inputMaxLength);
                  // console.log(e.target.value, e.target.value.length);
                }
              }
              return infoForm.setFieldValue(item.name, e.target.value);
            }}
          />
        </Form.Item>
      ))}

      <Form.Item
        name={"except"}
        label={"예외 번호"}
        rules={[
          { required: false },
          {
            message: "숫자만 입력 가능합니다.",
            pattern: /[0-9]/g,
          },
        ]}
      >
        <RowWrapper
          styles={css`
            width: 100%;
            justify-content: space-between;
          `}
        >
          <Input
            placeholder="예외 번호를 입력해 주세요."
            style={{ width: "85%" }}
            // type={"number"}
            value={exceptInputText}
            onChange={(e) => {
              e.target.value = e.target.value.replace(/[^0-9]/g, "");
              return setExceptInputText(e.target.value);
            }}
            onPressEnter={(e) => {
              e.preventDefault();
              onAddExceptTag(exceptInputText);
            }}
          />
          <BasicButton focused onClick={() => onAddExceptTag(exceptInputText)}>
            추가
          </BasicButton>
        </RowWrapper>
      </Form.Item>
      {exceptTags.length !== 0 && (
        <RowWrapper
          styles={css`
            flex-wrap: wrap;
            gap: 0.4rem;
          `}
        >
          {exceptTags.map((item, index) => (
            <BasicTag
              key={index}
              closable
              onClose={() => onDeleteExceptTag(index)}
            >
              {item}
            </BasicTag>
          ))}
        </RowWrapper>
      )}
      <Form.Item noStyle>
        <BasicButton
          htmlType={"submit"}
          focused
          size="large"
          styles={css`
            width: 100%;
            margin-top: 2rem;
          `}
        >
          다음
        </BasicButton>
      </Form.Item>
    </Form>
  );
};

export default CreateModalStep1;
