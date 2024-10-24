import { Button, Checkbox, DatePicker, Form, Select } from "antd";
import dayjs from "dayjs";
import React, { useEffect } from "react";
import { css } from "styled-components";
import RowWrapper from "../../../../../components/atom/RowWrapper";
import TextAtom from "../../../../../components/atom/TextAtom";
import ModalLayout from "../../../../../components/layouts/ModalLayout";
import { color } from "../../../../../styles/theme";

const { Option } = Select;

const CreateModalPeriodSection = ({
  form,
  page,
  onFinish,
  priceList,
  resultPrice,
  resultDeposit,
  isEdit,
  mutationLoading,
  onClickPrev,
  setResultPrice,
  setResultDeposit,
  setLockerData,
  fixedStartDate,
  fixedEndDate,
}) => {
  const onValuesChange = (value) => {
    if ("price" in value) {
      const locker = priceList.find((item) => item.idx === value.price);
      if (locker.period_type === 1) {
        const date = dayjs(form.getFieldValue(["period", "start"]))
          .add(locker.period, "day")
          .format("YYYY/MM/DD");
        form.setFieldsValue({
          period: {
            end: isEdit
              ? dayjs(fixedEndDate).add(locker.period, "day")
              : dayjs(date),
          },
        });
      } else {
        const date = dayjs(form.getFieldValue(["period", "start"]))
          .subtract(1, "day")
          .add(locker.period, "month")
          .format("YYYY/MM/DD");
        form.setFieldsValue({
          period: {
            end: isEdit
              ? dayjs(fixedEndDate).add(locker.period, "month")
              : dayjs(date),
          },
        });
      }
      setResultPrice(locker.charge);
      setResultDeposit(locker.deposit);
      setLockerData((prev) => ({
        ...prev,
        periodType: {
          ...prev.periodType,
          type: locker.period_type,
          period: locker.period,
        },
      }));
    }
    if ("period" in value) {
      const price = form.getFieldValue("price");
      if (price) {
        const locker = priceList.find((item) => item.idx === price);
        if (locker.period_type === 1) {
          const date = dayjs(value.period.start)
            .add(locker.period, "day")
            .format("YYYY/MM/DD");
          form.setFieldsValue({
            period: {
              end: isEdit
                ? dayjs(fixedEndDate).add(locker.period, "day")
                : dayjs(date),
            },
          });
        } else {
          const date = dayjs(value.period.start)
            .subtract(1, "day")
            .add(locker.period, "month")
            .format("YYYY/MM/DD");
          form.setFieldsValue({
            period: {
              end: isEdit
                ? dayjs(fixedEndDate).add(locker.period, "month")
                : dayjs(date),
            },
          });
        }
      }
    }
  };

  useEffect(() => {
    if (isEdit) {
      if (fixedStartDate) {
        form.setFieldsValue({
          period: { start: dayjs(fixedStartDate) },
        });
      }
    }
    // eslint-disable-next-line
  }, [isEdit, fixedStartDate]);

  return (
    <ModalLayout focused={page === 2}>
      <Form
        form={form}
        layout="vertical"
        name="addPeriod"
        initialValues={{ paid: false }}
        style={{ width: "100%" }}
        onFinish={onFinish}
        onValuesChange={onValuesChange}
      >
        <Form.Item
          name="price"
          label="보증금 / 기간 / 금액 선택"
          rules={[
            {
              required: true,
              message: "사용일을 선택해 주세요.",
            },
          ]}
        >
          <Select placeholder="사용일을 선택해 주세요.">
            {priceList.map((item) =>
              item.period_type === 1 ? (
                <Option value={item.idx} key={item.idx}>
                  {item.deposit
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  원 / {item.period}일 /{" "}
                  {item.charge.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  원
                </Option>
              ) : (
                <Option value={item.idx} key={item.idx}>
                  {item.deposit
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  원 / {item.period}개월 /{" "}
                  {item.charge.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  원
                </Option>
              )
            )}
          </Select>
        </Form.Item>
        <RowWrapper>
          <Form.Item
            label="시작일"
            name={["period", "start"]}
            style={{ flex: 1, marginRight: 5 }}
            initialValue={dayjs()}
          >
            <DatePicker
              style={{ width: "100%" }}
              format={"YYYY/MM/DD"}
              disabled={isEdit ? true : false}
            />
          </Form.Item>
          <Form.Item
            label="종료일"
            name={["period", "end"]}
            style={{ flex: 1 }}
          >
            <DatePicker
              style={{ width: "100%" }}
              disabled={true}
              format={"YYYY/MM/DD"}
              placeholder="자동 입력"
            />
          </Form.Item>
        </RowWrapper>
        <RowWrapper
          styles={css`
            justify-content: space-between;
            background-color: ${color.brightGrey};
            padding: 2.4rem;
            border-radius: 0.5rem;
          `}
          marginBottom="2rem"
        >
          <TextAtom fontSize={"1.6rem"} fontWeight="bold">
            이용 금액 :{" "}
            {resultPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원 /
            보증금 :{" "}
            {resultDeposit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원
          </TextAtom>
          <Form.Item name="paid" valuePropName="checked" noStyle>
            <Checkbox>수납 완료</Checkbox>
          </Form.Item>
        </RowWrapper>

        <RowWrapper>
          {!isEdit && (
            <Button
              block
              onClick={onClickPrev}
              style={{ height: 48, marginRight: 5, borderRadius: 5 }}
            >
              이전
            </Button>
          )}

          <Button
            type="primary"
            htmlType="submit"
            block
            style={{
              height: 48,
              borderRadius: 5,
              backgroundColor: color.mainBlue,
            }}
            disabled={mutationLoading}
          >
            {isEdit ? "연장하기" : "등록하기"}
          </Button>
        </RowWrapper>
      </Form>
    </ModalLayout>
  );
};

export default CreateModalPeriodSection;
