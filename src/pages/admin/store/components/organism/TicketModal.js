import { DatePicker, Divider, Input, Modal, Select } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { css } from "styled-components";
import { queryClient } from "../../../../../App";
import BasicButton from "../../../../../components/atom/BasicButton";
import RowWrapper from "../../../../../components/atom/RowWrapper";
import TextAtom from "../../../../../components/atom/TextAtom";
import { API } from "../../../../../utils/api";
import {
  checkDisabledDate,
  numberToLocaleString,
} from "../../../../../utils/utils";
import TicketModalInputItem from "../atom/TicketModalInputItem";

const { Option } = Select;

const TicketModal = ({
  open,
  onCancel: onCancelProp,
  targetData,
  user_idx,
  lastPaymentEndDate,
  disabledRange,
}) => {
  const [isEdit, setIsEdit] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [prevIdx, setPrevIdx] = useState(null);
  const [type, setType] = useState("");
  const [typeOptions, setTypeOptions] = useState([]);
  const [price, setPrice] = useState(0);
  const [paidAt, setPaidAt] = useState("");
  const [period, setPeriod] = useState({
    start: null,
    end: null,
  });
  const onCancel = () => {
    setType("");
    setPrice("");
    setPaidAt("");
    setPeriod({ start: null, end: null });
    setPrevIdx(null);
    setIsEdit(false);
    onCancelProp();
  };

  // 이용권 정보 가져오기
  useQuery(
    "paymentSettingInfo",
    async () => await API.get("/admin/payment-setting").then((res) => res.data),
    {
      onSuccess: (data) => {
        if (data.length) {
          setTypeOptions(
            data.map((item) => ({ name: item.name, amount: item.amount }))
          );
        } else {
          setTypeOptions([
            {
              name: data.name,
              amount: data.amount,
            },
          ]);
        }
      },
      staleTime: "Infinity",
      retry: false,
    }
  );

  const createTicketMutation = useMutation(
    (data) => API.post("/admin/payment-current", data),
    {
      onSuccess: () => {
        queryClient.fetchQuery("paymentCurrentList");
        queryClient.fetchQuery("paymentHistories");

        onCancel();
      },
    }
  );

  const updateTicketMutation = useMutation(
    (data) => API.put("/admin/payment-current", data),
    {
      onSuccess: () => {
        queryClient.fetchQuery("paymentCurrentList");
        queryClient.fetchQuery("paymentHistories");
        onCancel();
      },
    }
  );

  const onClickSubmit = () => {
    if (dayjs(period.start).diff(dayjs(period.end), "day") > 0) {
      return Modal.error({
        title: "이용권 등록 실패",
        content: "종료일이 현재보다 과거가 될 수 없습니다.",
        okText: "확인",
      });
    } else {
      const formData = {
        ...(isEdit && { payment_idx: targetData?.idx }),
        payment_name: type,
        amount:
          typeof price === "string" ? price.replace(/[^0-9]/g, "") : price,
        paid_time: dayjs(paidAt).format("YYYY-MM-DD HH:mm:ss"),
        start_date: dayjs(period.start).format("YYYY-MM-DD"),
        end_date: dayjs(period.end).format("YYYY-MM-DD"),
        ...(!isEdit && { user_idx }),
      };
      if (isEdit) {
        const { amount, end_date, idx, paid_time, payment_name, start_date } =
          targetData;
        const prevData = {
          payment_idx: idx,
          payment_name,
          amount,
          paid_time: dayjs(paid_time).format("YYYY-MM-DD HH:mm:ss"),
          start_date,
          end_date,
        };
        if (
          Object.values(formData).filter(
            (data) => !Object.values(prevData).includes(data)
          ).length === 0
        ) {
          return onCancel();
        } else {
          updateTicketMutation.mutate(formData);
        }
      } else {
        if (isValid) {
          createTicketMutation.mutate(formData);
        } else {
          Modal.error({ title: "모든 값을 기입해주세요.", okText: "확인" });
        }
      }
    }
  };

  useEffect(() => {
    if (targetData) {
      const { amount, end_date, paid_time, payment_name, start_date, idx } =
        targetData;
      setType(payment_name);
      setPaidAt(dayjs(paid_time));
      setPrice(amount);
      setPeriod((prev) => ({
        ...prev,
        start: dayjs(start_date).endOf("day"),
        end: end_date ? dayjs(end_date).endOf("day") : null,
      }));
      setPrevIdx(idx);
      setIsEdit(true);
    }
    // eslint-disable-next-line
  }, [targetData]);

  useEffect(() => {
    if (type && price && paidAt && period.end && period.start) {
      setIsValid(true);
      return;
    }
    setIsValid(false);
  }, [type, price, paidAt, period]);

  return (
    <Modal
      open={open}
      title={`이용권 ${isEdit ? "수정" : "등록"}`}
      onCancel={onCancel}
      footer={[]}
      maskClosable={false}
    >
      <Divider style={{ marginTop: "1.6rem", marginBottom: "2.4rem" }} />
      <RowWrapper
        styles={css`
          width: 100%;
          gap: 1rem;
        `}
        marginBottom="1.6rem"
      >
        <TicketModalInputItem label={"이용권"}>
          <Select
            placeholder="선택해 주세요."
            onSelect={(e) => {
              setType(e);
              const defaultOptionValue = typeOptions.find(
                (item) => item.name === e
              );
              if (defaultOptionValue) {
                setPrice(defaultOptionValue.amount);
              }
            }}
            value={type}
          >
            {typeOptions.map((item, index) => (
              <Option value={item.name} key={index}>
                {item.name}
              </Option>
            ))}
          </Select>
        </TicketModalInputItem>
        <TicketModalInputItem label={"금액"}>
          <Input
            placeholder="숫자만 입력"
            value={numberToLocaleString(
              price.toString().replace(/[^0-9]/g, "")
            )}
            onChange={(e) => setPrice(e.target.value)}
          />
        </TicketModalInputItem>
        <TicketModalInputItem label={"거래 날짜"}>
          <DatePicker
            format={"YYYY년 MM월 DD일"}
            onChange={(e) => setPaidAt(e)}
            value={paidAt}
          />
        </TicketModalInputItem>
      </RowWrapper>
      <TicketModalInputItem label={"이용 기간"} marginBottom="3rem">
        <RowWrapper
          styles={css`
            gap: 0.6rem;
          `}
        >
          <DatePicker
            style={{ flex: 1 }}
            format={"YYYY-MM-DD"}
            onChange={(e) => setPeriod((prev) => ({ ...prev, start: e }))}
            value={period.start}
            disabledDate={(current) => {
              if (
                checkDisabledDate({
                  current: { idx: targetData?.idx, date: current },
                  range_list: disabledRange,
                })
              ) {
                return true;
              }
              return current && current < dayjs().startOf("day");
            }}
          />
          <TextAtom fontSize={"1.4rem"} fontWeight={600}>
            ~
          </TextAtom>
          <DatePicker
            style={{ flex: 1 }}
            format={"YYYY-MM-DD"}
            onChange={(e) => setPeriod((prev) => ({ ...prev, end: e }))}
            value={period.end}
            disabledDate={(current) => {
              if (
                checkDisabledDate({
                  current: { idx: targetData?.idx, date: current },
                  range_list: disabledRange,
                })
              ) {
                return true;
              }
              if (period.start) {
                return current && current < dayjs(period.start).endOf("day");
              } else {
                return current && current < dayjs().startOf("day");
              }
            }}
          />
        </RowWrapper>
      </TicketModalInputItem>
      <BasicButton
        focused
        styles={css`
          width: 100%;
          height: 4rem;
        `}
        onClick={onClickSubmit}
      >
        {isEdit ? "수정" : "등록"}
      </BasicButton>
    </Modal>
  );
};

export default TicketModal;
