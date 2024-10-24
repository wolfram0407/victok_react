import { CloseOutlined } from "@ant-design/icons";
import { Form, Modal } from "antd";
import React, { useContext } from "react";
import { useState } from "react";
import { useCallback } from "react";
import { css } from "styled-components";
import RowWrapper from "../../../../../components/atom/RowWrapper";
import TextAtom from "../../../../../components/atom/TextAtom";
import { MainContext } from "../../utils/mainContext";
import { useMutation, useQuery } from "react-query";
import { API } from "../../../../../utils/api";
import { useEffect } from "react";
import dayjs from "dayjs";
import axios from "axios";
import { queryClient } from "../../../../../App";
import useGetArrayMutation from "../../utils/getArrayMutation";
// import { lockerListResultFormat } from "../../../../../utils/utils";
import CreateModalUserSection from "./CreateModalUserSection";
import CreateModalPeriodSection from "./CreateModalPeriodSection";
import { useAppContext } from "../../../../../utils/context";

const CreateLockerUserModal = ({
  open: initialLockerInfo,
  setCreateLockerUserModal,
  user_idx,
  admin,
  lockerType: lockerTypeProps,
}) => {
  const { isAdmin } = useAppContext();
  const { lockerType, setLockerArrayData, selectedLockerType } =
    useContext(MainContext);
  const _lockerType = admin ? lockerTypeProps : lockerType;
  const [infoForm] = Form.useForm();
  const [settingForm] = Form.useForm();
  const [isEdit, setIsEdit] = useState(false);
  const [page, setPage] = useState(1);
  const [lockerData, setLockerData] = useState({
    selectedType: false,
    number: [],
    price: [],
    periodType: {
      type: null,
      period: null,
    },
  });
  const [lockerTypeQueryOn, setLockerTypeQueryOn] = useState(false);
  const [resultPrice, setResultPrice] = useState(0);
  const [resultDeposit, setResultDeposit] = useState(0);
  const [selectedLocker, setSelectedLocker] = useState(null);
  const [mutationLoading, setMutationLoading] = useState(false);

  const onCancel = () => {
    setCreateLockerUserModal(null);
    setSelectedLocker(null);
    setTimeout(() => {
      setIsEdit(false);
    }, 300);
    // eslint-disable-next-line
  };

  const onNext = useCallback((values) => {
    setPage(2);
  }, []);

  // 라카 넘버 가져오는 쿼리
  useQuery(
    ["lockerNumberData", lockerTypeQueryOn, selectedLocker],
    async () => {
      if (!lockerTypeQueryOn || !selectedLocker) return;
      const { data } = await API.get("locker/locker-number", {
        params: { locker_type_idx: selectedLocker },
      });
      return data;
    },
    {
      onSuccess: (data) => {
        if (!data) return;
        const list = [];
        const lockerInfoData = _lockerType?.find(
          (item) => item.idx === selectedLocker
        );
        const checkNum = initialLockerInfo.locker_number
          ? data.lockerNumber.filter(
              (num) => num !== initialLockerInfo.locker_number
            )
          : data.lockerNumber;
        for (
          let i = lockerInfoData.start_number;
          i < lockerInfoData.locker_amount + lockerInfoData.start_number;
          i++
        ) {
          if (!checkNum.includes(i)) {
            list.push(i);
          }
        }
        setLockerData((prev) => ({
          ...prev,
          number: list,
          price: lockerInfoData.charge,
          selectedType: true,
        }));
        if (initialLockerInfo.locker_number) {
          infoForm.setFieldValue(
            "locker_number",
            initialLockerInfo.locker_number
          );
        } else {
          infoForm.setFieldsValue({ locker_number: undefined });
        }
        setLockerTypeQueryOn(false);
      },
      onError: (error) => {
        console.log(error);
        setLockerTypeQueryOn(false);
      },
    }
  );

  const getMemoMutation = useMutation(
    (data) =>
      API.post(data.user_idx ? "admin/customer-memo" : "locker/customer-memo", {
        name: data.name,
        phone: data.phone,
        user_idx: data.user_idx,
      }),
    {
      onSuccess: ({ data }) => {
        if (data !== "null") {
          infoForm.setFieldsValue({ memo: data });
        }
      },
      onError: () => {
        console.log("해당유저 없음");
        infoForm.setFieldsValue({ memo: "" });
      },
    }
  );

  // 라카 현황에서 배열 항목 리스트 불러오기
  const getArrayMutation = useGetArrayMutation(
    selectedLockerType,
    setLockerArrayData
  );

  const onConfirmMutation = useMutation(
    async (data) =>
      await API.post(isAdmin ? "admin/locker" : "locker/locker", data).then(
        () => data
      ),
    {
      onError: () => {
        Modal.error({
          title: "사용자 등록 실패",
          content: "동일한 번호를 사용 중인 회원이 이미 존재합니다.",
          okText: "확인",
          onOk: () => onCancel(),
        });
      },
      onSuccess: (data) => {
        onCancel();
        Modal.success({
          title: "사용자 등록 완료",
          content: "사용자가 등록되었습니다.",
          okText: "확인",
        });
        const cachedKey = admin
          ? ["adminLockerList"]
          : ["lockerCurrentData", "lockerRemainData"];
        cachedKey.forEach((key) => {
          queryClient.fetchQuery(key);
        });
        getArrayMutation.mutate();
        setMutationLoading(false);
      },
    }
  );

  const onUpdateUserMutation = useMutation(
    (data) => API.put("/locker/locker", data).then(() => ({ newData: data })),
    {
      onSuccess: ({ newData }) => {
        const queryKeys = admin
          ? ["adminLockerList"]
          : ["lockerCurrentData", "lockerRemainData"];
        queryKeys.forEach((key) => {
          queryClient.fetchQuery(key);
        });
        Modal.success({
          title: "라카 이용자 수정 완료",
          content: "라카 이용자가 수정되었습니다.",
          okText: "확인",
          onOk: onCancel,
        });
      },
      onError: (error) => {
        if (axios.isAxiosError(error)) {
          if (error.response.status === 409) {
            return Modal.error({
              title: "라카 이용자 수정 실패",
              content: error.response.data.message,
              okText: "확인",
              onOk: onCancel,
            });
          }
          console.log(error.response);
        } else {
          console.log(error);
        }
      },
    }
  );

  const onUpdatePeriodMutation = useMutation(
    (data) =>
      API.put("/locker/locker-extend", data).then(() => ({ newData: data })),
    {
      onSuccess: ({ newData }) => {
        const queryKeys = ["lockerCurrentData", "lockerRemainData"];
        queryKeys.forEach((key) => {
          queryClient.fetchQuery(key);
        });
        Modal.success({
          title: "라카 기간 연장 완료",
          content: "라카 기간 연장이 완료되었습니다.",
          okText: "확인",
          onOk: onCancel,
        });
      },
      onError: (error) => {
        if (axios.isAxiosError(error)) {
          console.log(error.response);
          return Modal.error({
            title: "라커 연장 실패",
            content: error.response.data.msg,
            okText: "확인",
            onOk: onCancel,
          });
        } else {
          console.log(error);
        }
      },
    }
  );

  const getMemo = async (name, phone, user_idx) => {
    if (!name || !phone || !user_idx) return;
    getMemoMutation.mutate({ name, phone, user_idx });
  };

  const onConfirm = async (values) => {
    const useInfo = values;
    const lockerInfo = infoForm.getFieldsValue();
    if (dayjs().diff(dayjs(useInfo.period.end), "day") > 0) {
      return Modal.error({
        title: "라커 등록 실패",
        content: "종료일이 현재보다 과거가 될 수 없습니다.",
        okText: "확인",
      });
    } else {
      const formData = {
        customer_name: lockerInfo.name,
        customer_phone: lockerInfo.hp,
        memo: lockerInfo.memo,
        locker_type: _lockerType.find(
          (item) => item.idx === lockerInfo.locker_type
        ).locker_type,
        locker_number: lockerInfo.locker_number,
        start_date: dayjs(useInfo.period.start).format("YYYY-MM-DD"),
        end_date: dayjs(useInfo.period.end).format("YYYY-MM-DD"),
        charge: useInfo.price,
        paid: useInfo.paid ? "수납" : "미수납",
        user_idx: user_idx,
        deposit: resultDeposit,
        price: resultPrice,
        period: lockerData.price.find((d) => d.idx === useInfo.price).period,
        period_type: lockerData.periodType.type,
      };
      // console.log(formData);
      setMutationLoading(true);
      onConfirmMutation.mutate(formData);
    }
  };

  const onUpdateUser = (values) => {
    if (!values) return;
    const { name, hp, locker_type, locker_number, memo } = values;
    const formData = {
      locker_idx: initialLockerInfo.idx,
      customer_name: name,
      customer_phone: hp,
      locker_type: _lockerType.find((item) => item.idx === locker_type)
        .locker_type,
      locker_number,
      memo,
      admin: isAdmin ?? false,
      user_idx,
    };

    onUpdateUserMutation.mutate(formData);
  };

  const onUpdatePeriod = (values) => {
    if (!values) return;
    const { period, price, paid } = values;
    if (dayjs().diff(dayjs(period.end), "day") > 0) {
      return Modal.error({
        title: "라커 등록 실패",
        content: "종료일이 현재보다 과거가 될 수 없습니다.",
        okText: "확인",
      });
    } else {
      const types = ["deposit", "period", "charge"];
      const chargeObj = {};
      let charge = price;
      if (typeof price === "string") {
        price
          .replace(/[^0-9/]/g, "")
          .split("/")
          .forEach((item, index) => (chargeObj[types[index]] = Number(item)));
        charge = lockerData.price.find(
          (p) =>
            p.deposit === chargeObj.deposit &&
            p.charge === chargeObj.charge &&
            p.period === chargeObj.period
        ).idx;
      }
      const formData = {
        locker_idx: initialLockerInfo.idx,
        end_date: dayjs(period.end).format("YYYY-MM-DD"),
        charge,
        paid: paid ? "수납" : "미수납",
        admin: isAdmin ?? false,
      };
      onUpdatePeriodMutation.mutate(formData);
    }
  };

  useEffect(() => {
    if (initialLockerInfo) {
      if (initialLockerInfo.idx) {
        setIsEdit(true);
        setPage(!initialLockerInfo.name ? 2 : 1);
        const _locker_type = _lockerType.find(
          (item) => item.locker_type === initialLockerInfo.locker_type
        );
        setSelectedLocker(_locker_type.idx);
        if (initialLockerInfo.name) {
          const { locker_number, memo, name, phone: hp } = initialLockerInfo;
          infoForm.setFieldsValue({
            locker_type: _locker_type.idx,
            locker_number,
            memo,
            name,
            hp,
          });
        } else {
          const {
            locker_charge,
            deposit,
            // start_date,
            end_date,
            period,
            period_type,
            paid,
          } = initialLockerInfo;
          const endDate =
            period_type === 1
              ? dayjs(end_date).add(period, "day").format("YYYY/MM/DD")
              : dayjs(end_date).add(period, "month").format("YYYY/MM/DD");
          settingForm.setFieldsValue({
            paid: paid === "미수납" ? false : true,
            period: {
              start: dayjs(end_date).add(1, "day"),
              end: dayjs(endDate),
            },
            price: `${deposit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            원 / ${period}${period_type === 1 ? "일" : "개월"} /
            ${locker_charge.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            원`,
          });
          setResultPrice(locker_charge);
          setResultDeposit(deposit);
        }
        setLockerTypeQueryOn(true);
      } else {
        setSelectedLocker(initialLockerInfo.locker_type);
        infoForm.setFieldsValue({
          locker_type: initialLockerInfo.locker_type,
          locker_number: initialLockerInfo.locker_number,
        });
      }
    } else {
      setTimeout(() => {
        setPage(1);
        infoForm.resetFields();
        settingForm.resetFields();
        setLockerData({
          selectedType: false,
          number: [],
          price: [],
        });
        setResultPrice(0);
        setResultDeposit(0);
      }, 300);
    }
    // eslint-disable-next-line
  }, [initialLockerInfo]);

  return (
    <Modal
      open={Boolean(initialLockerInfo)}
      maskClosable={false}
      closable={false}
      getContainer={false}
      title={
        <RowWrapper
          styles={css`
            justify-content: space-between;
          `}
        >
          <TextAtom>
            {isEdit
              ? initialLockerInfo?.name
                ? "라카 이용자 정보 수정"
                : "라카 이용자 기간 연장"
              : `라카 이용자 추가(${page}/2)`}
          </TextAtom>

          <CloseOutlined style={{ cursor: "pointer" }} onClick={onCancel} />
        </RowWrapper>
      }
      onCancel={onCancel}
      footer={[]}
      forceRender={true}
    >
      {(!isEdit || !initialLockerInfo?.onlyLocker) && (
        <CreateModalUserSection
          form={infoForm}
          page={page}
          onFinish={isEdit ? onUpdateUser : onNext}
          numberOptions={lockerData.number}
          btnText={isEdit ? "수정하기" : "다음"}
          setLockerData={setLockerData}
          setLockerTypeQueryOn={setLockerTypeQueryOn}
          setSelectedLocker={setSelectedLocker}
          getMemo={getMemo}
          user_idx={user_idx}
          initialLockerInfo={initialLockerInfo}
          lockerType={_lockerType}
          isEdit={isEdit}
        />
      )}
      <CreateModalPeriodSection
        form={settingForm}
        page={page}
        onFinish={isEdit ? onUpdatePeriod : onConfirm}
        priceList={lockerData.price}
        resultPrice={resultPrice}
        resultDeposit={resultDeposit}
        isEdit={isEdit}
        mutationLoading={mutationLoading}
        onClickPrev={() => setPage(1)}
        setResultPrice={setResultPrice}
        setResultDeposit={setResultDeposit}
        setLockerData={setLockerData}
        fixedStartDate={dayjs(initialLockerInfo?.end_date).add(1, "day")}
        fixedEndDate={dayjs(initialLockerInfo?.end_date)}
      />
    </Modal>
  );
};

export default CreateLockerUserModal;
