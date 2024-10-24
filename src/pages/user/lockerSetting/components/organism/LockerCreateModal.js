import { Form, Modal } from "antd";
import { useEffect, useState } from "react";
import { API } from "../../../../../utils/api";
import ModalLayout from "../../../../../components/layouts/ModalLayout";
import CreateModalStep1 from "./CreateModalStep1";
import CreateModalStep2 from "./CreateModalStep2";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdModalContent from "../../../../../components/organism/AdModalContent";
import { useMutation } from "react-query";
import { queryClient } from "../../../../../App";

const LockerCreateModal = ({
  open,
  onCancel: onCancelProp,
  grade,
  target,
  setTarget,
  setNoData,
  admin,
  user_idx,
}) => {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [periodType, setPeriodType] = useState(1);
  const [chargeList, setChargeList] = useState([]);
  const [infoForm] = Form.useForm();
  const [settingForm] = Form.useForm();
  const [exceptTags, setExceptTags] = useState([]);

  const onCancel = () => {
    infoForm.resetFields();
    settingForm.resetFields();
    setPage(1);
    onCancelProp();
    setTarget(null);
    setChargeList([]);
    setExceptTags([]);
  };

  const onClickNext = () => {
    setPage(2);

    // eslint-disable-next-line
  };

  const onAddCharge = () => {
    const period = Number(settingForm.getFieldValue("period"));
    const charge = Number(settingForm.getFieldValue("charge"));
    const deposit = Number(settingForm.getFieldValue("deposit"));
    if (chargeList.length === 6) {
      return Modal.error({
        title: "요금 추가 알림",
        content: "요금은 최대 6개까지만 추가할 수 있습니다.",
        okText: "확인",
      });
    }

    if (!period || !String(charge)) {
      return Modal.error({
        title: "요금 추가 알림",
        content: `기간은 1일 이상이어야 하며, 금액은 100원 단위로 입력할 수 있습니다.`,
        okText: "확인",
      });
    }
    if (Number(period) === 0 || Number(charge) % 100 !== 0) {
      return Modal.error({
        title: "요금 추가 알림",
        content: `기간은 1일 이상이어야 하며, 금액은 100원 단위로 입력할 수 있습니다.`,
        okText: "확인",
      });
    }
    const duplication = chargeList.find(
      (item) =>
        item.period === period &&
        item.period_type === periodType &&
        item.charge === charge &&
        item.deposit === deposit
    );

    if (!duplication) {
      const item = {
        period_type: periodType,
        period,
        charge,
        deposit: deposit ? deposit : 0,
      };

      setChargeList([...chargeList, item]);
      settingForm.setFieldsValue({ period: "", charge: "", deposit: "" });
    } else {
      Modal.error({
        title: "요금 추가 알림",
        content: `이미 동일한 기간의 요금제가 있습니다.`,
        okText: "확인",
      });
    }
  };
  const onDeleteCharge = (value) => {
    const reCharge = chargeList.filter((item, index) => index !== value);
    setChargeList(reCharge);
  };

  const onValuesChangeInfoForm = async (value) => {
    if ("max" in value) {
      infoForm.setFieldsValue({ max: value.max.replace(/[^0-9]/g, "") });
    }
    if ("startNum" in value) {
      infoForm.setFieldsValue({
        startNum: value.startNum.replace(/[^0-9]/g, ""),
      });
    }
    if ("except" in value) {
      infoForm.setFieldValue({
        except: value.except.join(","),
      });
    }
  };

  const onValueChangeSettingForm = async (value) => {
    if ("period" in value) {
      settingForm.setFieldsValue({
        period: value.period.replace(/[^0-9]/g, ""),
      });
    }
    if ("charge" in value) {
      settingForm.setFieldsValue({
        charge: value.charge.replace(/[^0-9]/g, ""),
      });
    }
    if ("deposit" in value) {
      settingForm.setFieldsValue({
        deposit: value.deposit.replace(/[^0-9]/g, ""),
      });
    }
    if ("talk_dday" in value) {
      if (grade === 0 && value.talk_dday.length > 1) {
        settingForm.setFieldsValue({ talk_dday: [3] });
        Modal.info({
          title: "유료 회원 전용 기능",
          content: <AdModalContent />,
          okText: "이용권 구매하기",
          onOk: () => {
            // localStorage.setItem("myPageTab", "payment");
            // navigate("/mypage");
            navigate("/goodsInfo");
          },
          closable: true,
        });
      }
    }
  };
  const onConfirmMutation = useMutation(
    (data) =>
      API.post(admin ? "/admin/locker-type" : "/locker/locker-type", data).then(
        () => data
      ),
    {
      onSuccess: (data) => {
        const displayData = admin
          ? ['"adminGetStoreLockerInfo"', '"lockerData"']
          : ['"getLockerInfo"', ["lockerData"]];
        displayData.forEach((key) => {
          if (queryClient.getQueryData(key)) {
            queryClient.fetchQuery(key);
          }
        });
        onCancel();
        setNoData(false);
      },
      onError: (error) => {
        if (axios.isAxiosError(error)) {
          console.log(error.response);
          Modal.error({
            title: "라카 구분 등록 알림",
            content: `이미 동일한 이름의 라카 구분이 있습니다.`,
            okText: "확인",
          });
        } else {
          console.log(error);
        }
      },
    }
  );

  const onUpdateMutation = useMutation(
    (data) =>
      API.put(admin ? "/admin/locker-type" : "/locker/locker-type", data).then(
        () => data
      ),
    {
      onSuccess: (data) => {
        Modal.success({
          title: "라카 구분 등록 알림",
          content: "라카 수정이 완료되었습니다.",
          okText: "확인",
          onOk: () => onCancel(),
        });
        queryClient.fetchQuery("lockerData");
      },
      onError: (error) => {
        if (axios.isAxiosError(error)) {
          Modal.error({
            title: "라카 구분 등록 알림",
            // content: `${error.response.data.message}`,
            content: "이용 중인 회원이 있어 수정이 불가합니다.",
            okText: "확인",
          });
        } else {
          console.log(error);
        }
      },
    }
  );

  const onConfirm = async (values) => {
    if (chargeList.length === 0) {
      return Modal.error({
        title: "라카 구분 등록 알림",
        content: `기간 및 요금을 입력해 주세요.`,
        okText: "확인",
      });
    }
    const lockerInfo = infoForm.getFieldsValue();
    const talk_dday = settingForm.getFieldValue("talk_dday");
    const formData = {
      locker_type: lockerInfo.name,
      locker_amount: lockerInfo.max,
      start_number: lockerInfo.startNum,
      except_number: lockerInfo.except,
      talk_dday: talk_dday,
      charge: chargeList.map((item) => ({
        ...item,
        charge: parseInt(item.charge),
        deposit: parseInt(item.deposit),
        period: parseInt(item.period),
      })),
      ...(target && { locker_type_idx: target.idx }),
      ...(admin && { user_idx }),
    };

    if (target) {
      onUpdateMutation.mutate(formData);
    } else {
      onConfirmMutation.mutate(formData);
    }
  };

  useEffect(() => {
    if (target) {
      infoForm.setFieldsValue({
        name: target.locker_type,
        max: target.locker_amount,
        startNum: target.start_number,
      });
      if (target.except_number) {
        setExceptTags(target.except_number.split(","));
      }
      setChargeList(target.charge);
      settingForm.setFieldsValue({
        talk_dday: target.dday.split(",").map((item) => Number(item)),
      });
    }
    if (target) {
      settingForm.setFieldValue(
        "talk_dday",
        target.dday.split("/").map((day) => parseInt(day))
      );
    } else {
      settingForm.setFieldValue("talk_dday", [3]);
    }

    // eslint-disable-next-line
  }, [open]);

  return (
    <Modal
      forceRender
      open={open}
      onCancel={onCancel}
      title={`라카 구분 ${target ? "수정" : "추가"}(${page}/2)`}
      footer={[]}
      closable={true}
      maskClosable={false}
    >
      <ModalLayout focused={page === 1}>
        <CreateModalStep1
          infoForm={infoForm}
          onClickNext={onClickNext}
          onValueChange={onValuesChangeInfoForm}
          exceptTags={exceptTags}
          setExceptTags={setExceptTags}
        />
      </ModalLayout>

      <ModalLayout focused={page === 2}>
        <CreateModalStep2
          settingForm={settingForm}
          chargeList={chargeList}
          periodType={periodType}
          setPeriodType={setPeriodType}
          onAddCharge={onAddCharge}
          onDeleteCharge={onDeleteCharge}
          setPage={setPage}
          onConfirm={onConfirm}
          onValueChange={onValueChangeSettingForm}
          admin={admin}
          grade={grade}
        />
      </ModalLayout>
    </Modal>
  );
};

export default LockerCreateModal;
