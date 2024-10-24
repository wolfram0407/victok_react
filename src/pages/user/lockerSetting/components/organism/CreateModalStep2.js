import { Button, Checkbox, Divider, Form, Input } from "antd";
import styled, { css } from "styled-components";
import BasicButton from "../../../../../components/atom/BasicButton";
import RowWrapper from "../../../../../components/atom/RowWrapper";
import TextAtom from "../../../../../components/atom/TextAtom";
import { color } from "../../../../../styles/theme";
import { DeleteFilled } from "@ant-design/icons/lib/icons";
import TabList from "../../../../../components/organism/TabList";
import { numberToLocaleString } from "../../../../../utils/utils";

const checkBoxList = [
  { id: 1, label: "전날", value: 1 },
  { id: 2, label: "3일 전", value: 3 },
  { id: 3, label: "7일 전", value: 7 },
  { id: 4, label: "15일 전", value: 15 },
  { id: 5, label: "30일 전", value: 30 },
];

const tabList = [
  { id: 1, value: 1, name: " 일 단위 계산" },
  { id: 2, value: 2, name: "월 단위 계산" },
];

const ChargeItem = styled.div`
  padding: 1.2rem 2.4rem;
  background-color: ${color.brightGrey};
  margin-bottom: 0.5rem;
`;

const CreateModalStep2 = ({
  settingForm,
  periodType,
  setPeriodType,
  chargeList,
  setPage,
  onAddCharge,
  onDeleteCharge,
  onConfirm,
  admin,
  grade,
}) => {
  return (
    <Form
      form={settingForm}
      name="setting"
      layout="vertical"
      style={{ width: "100%" }}
    >
      <Form.Item
        name="talk_dday"
        label="알림 주기"
        style={{ flex: 1 }}
        rules={[
          {
            required: true,
            message: "알림 주기는 최소 1개 이상 선택해 주세요.",
          },
        ]}
      >
        <Checkbox.Group>
          {checkBoxList.map((item) => (
            <Checkbox
              key={item.id}
              value={item.value}
              disabled={!admin && grade === 0}
            >
              {item.label}
            </Checkbox>
          ))}
        </Checkbox.Group>
      </Form.Item>
      <Divider />
      <TabList
        list={tabList}
        onChange={setPeriodType}
        currentTab={periodType}
        borderRadius={"0.2rem"}
        gap="1rem"
        marginBottom={"1rem"}
      />

      <RowWrapper
        marginBottom={"1rem"}
        styles={css`
          align-items: flex-start;
        `}
      >
        <Form.Item
          label="보증금"
          name="deposit"
          style={{ flex: 0.5, marginRight: 5, marginBottom: 0 }}
          rules={[
            {
              message: "숫자만 입력 가능합니다.",
              pattern: /[0-9]/g,
            },
          ]}
        >
          <Input
            placeholder="보증금 입력"
            maxLength={9}
            onChange={(e) => {
              e.target.value = e.target.value.replace(/[^0-9]/g, "");
              return settingForm.setFieldValue("deposit", e.target.value);
            }}
          />
        </Form.Item>
        <Form.Item
          label="요금"
          name="charge"
          required
          style={{ flex: 0.5, marginRight: 5, marginBottom: 0 }}
          rules={[
            {
              message: "숫자만 입력 가능합니다.",
              pattern: /[0-9]/g,
            },
          ]}
        >
          <Input
            placeholder="요금 입력"
            maxLength={9}
            onChange={(e) => {
              e.target.value = e.target.value.replace(/[^0-9]/g, "");
              return settingForm.setFieldValue("charge", e.target.value);
            }}
          />
        </Form.Item>
        <Form.Item
          label={`기간(${periodType === 1 ? "일" : "월"})`}
          name="period"
          required
          style={{ flex: 1, marginBottom: 0 }}
          rules={[
            {
              message: "숫자만 입력 가능합니다.",
              pattern: /[0-9]/g,
            },
          ]}
        >
          <Input
            placeholder={`${periodType === 1 ? "일" : "월"} 단위`}
            maxLength={5}
            onChange={(e) => {
              e.target.value = e.target.value.replace(/[^0-9]/g, "");
              return settingForm.setFieldValue("period", e.target.value);
            }}
          />
        </Form.Item>
        <BasicButton
          focused
          styles={css`
            margin-left: 0.4rem;
            border-radius: 0.5rem;
            margin-top: 3rem;
          `}
          onClick={() => onAddCharge()}
        >
          추가
        </BasicButton>
      </RowWrapper>
      <Form.Item
        label={`이용 요금 ${chargeList.length}/6`}
        style={{
          flex: 1,
          marginLeft: 5,
        }}
      >
        <div style={{ maxHeight: "calc(5.8rem * 4)", overflowY: "auto" }}>
          {chargeList.map((item, index) => {
            return (
              <ChargeItem key={index} style={{ borderRadius: 5 }}>
                <RowWrapper
                  styles={css`
                    justify-content: space-between;
                  `}
                >
                  <TextAtom>
                    {numberToLocaleString(parseInt(item.deposit))
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    원 / {numberToLocaleString(parseInt(item.period))}
                    {item.period_type === 1 ? "일" : "개월"} /{" "}
                    {numberToLocaleString(parseInt(item.charge))
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    원
                  </TextAtom>
                  <BasicButton
                    focused
                    onClick={() => onDeleteCharge(index)}
                    style={{ borderRadius: 5 }}
                  >
                    <DeleteFilled />
                  </BasicButton>
                </RowWrapper>
              </ChargeItem>
            );
          })}
        </div>
      </Form.Item>
      <RowWrapper>
        <Button
          style={{ marginRight: 5, height: 43, borderRadius: 5 }}
          block
          onClick={() => setPage(1)}
        >
          이전
        </Button>
        <Form.Item noStyle>
          <Button
            style={{
              height: 43,
              borderRadius: 5,
              backgroundColor: color.mainBlue,
            }}
            type="primary"
            htmlType="submit"
            block
            onClick={() => {
              onConfirm();
            }}
          >
            등록하기
          </Button>
        </Form.Item>
      </RowWrapper>
    </Form>
  );
};

export default CreateModalStep2;
