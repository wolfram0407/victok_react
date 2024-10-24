import { Divider, Form, Input, Modal } from "antd";
import { useEffect, useState } from "react";
import { css } from "styled-components";
import BasicButton from "../../../components/atom/BasicButton";
import RowWrapper from "../../../components/atom/RowWrapper";
import TextAtom from "../../../components/atom/TextAtom";
import LoggedInLayout from "../../../components/layouts/LoggedInLayout";
import WhiteBoxLayout from "../../../components/layouts/WhiteBoxLayout";
import LockerInfoSection from "./components/section/LockerInfoSection";
import MemberInfoSection from "./components/section/MemberInfoSection";
import DrillingChartSection from "./components/section/DrillingChartSection";
import DrillingChart from "./components/organism/DrillingChart";
import {
  useLocation,
  useMatch,
  useNavigate,
  useOutletContext,
} from "react-router-dom";
import useGetMemberDetail from "../../../hooks/useGetMemberDetail";
import { useMutation, useQuery } from "react-query";
import { API } from "../../../utils/api";
import { queryClient } from "../../../App";
import TabList from "../../../components/organism/TabList";
import { memberDetailTabList } from "../../../utils/constans";
import { color } from "../../../styles/theme";
import { useAppContext } from "../../../utils/context";
import { chargeConvert } from "../../../utils/utils";

const convertColumn = (value) => {
  return value;
  // switch (value) {
  //   case "charge":
  //     return "charge.charge";
  //   default:
  //     return `locker.${value}`;
  // }
};

const MemberDetail = () => {
  const { isAdmin } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();

  const customer_idx = useMatch("/member/detail/:id")?.params?.id;
  const [lockerFilter, setLockerFilter] = useState({
    column: "start_date",
    order: "desc",
    page: 1,
  });
  const [chartFilter, setChartFilter] = useState({
    page: 1,
  });
  const [storeList, setStoreList] = useState([]);
  const [currentStore, setCurrentStore] = useState("");
  const [adminAllCustomerLockers, setAdminAllCustomerLockers] = useState({
    list: [],
    total: 0,
  });

  const { data: memberData } = useGetMemberDetail({
    customer_idx,
    ...(!isAdmin && { lockerFilter }),
    chartFilter,
    additionalLockerFilterSuccessCallback: (data) => {
      if (data.list.length === 0) {
        if (lockerFilter.page !== 1) {
          setLockerFilter((prev) => ({ ...prev, page: prev.page - 1 }));
        }
      }
    },
    additionalChartFilterSuccessCallback: (data) => {
      if (data.chartList.length === 0) {
        if (chartFilter.page !== 1) {
          setChartFilter((prev) => ({ ...prev, page: prev.page - 1 }));
        }
      }
    },
  });

  const defaultInfo = memberData.customerInfo;
  const lockerInfo = memberData.customerLocker;
  const chartInfo = memberData.drillingChart;
  const user_idx = defaultInfo.user_idx;

  // TODO: admin/all-customer-locker-list로 해두긴했는데, 다시 체크해보는게 좋을 듯.
  const { refetch: adminCustomerAllLockersRefetch } = useQuery(
    ["adminCustomerAllLockers", isAdmin, defaultInfo],
    async () => {
      if (!isAdmin || !defaultInfo.name) return;
      return await API.get("/admin/all-customer-locker-list", {
        params: {
          column: convertColumn(lockerFilter.column),
          order: lockerFilter.order,
          name: defaultInfo.name,
          phone: defaultInfo.phone,
          page: lockerFilter.page,
        },
      }).then((res) => res.data);
    },
    {
      onSuccess: (data) => {
        if (!data) return;
        setAdminAllCustomerLockers({
          list: data.list.map((item, index) => ({
            ...item,
            charge: chargeConvert(item.charge),
            key: index,
          })),
          total: data.total,
        });
      },
    }
  );

  const { currentTab, setCurrentTab, initialChartData, initialInfoData } =
    useOutletContext();
  const [defaultInfoForm] = Form.useForm();
  const [isDrillingChartAdd, setIsDrillingChartAdd] = useState(false);
  const [newInfoData, setNewInfoData] = useState(initialInfoData);
  const [newChartData, setNewChartData] = useState({
    name: "",
    data: initialChartData,
  });
  const [drillerName, setDrillerName] = useState("");

  const onClickStore = (value) => {
    if (currentStore === value) {
      return;
    }
    navigate(
      `/member/detail/${
        storeList.find((item) => item.store_name === value).customer_idx
      }`
    );
  };

  const onClickTab = (value) => {
    if (isDrillingChartAdd) {
      setIsDrillingChartAdd(false);
    }
    setCurrentTab(value);
  };

  useQuery(
    ["adminCustomerInfoOtherQuery", isAdmin],
    async () => {
      if (!isAdmin) return;
      return await API.get("/customer/customer-info-other", {
        params: { customer_idx },
      }).then((res) => res.data);
    },
    {
      onSuccess: (data) => {
        if (!data) return;
        const list = data.map((store, index) => ({
          ...store,
          value: store.store_name,
          name: store.store_name,
          id: index,
          customer_idx: store.customer_idx,
        }));
        setStoreList(list);
        setCurrentStore(
          list.find((item) => item.customer_idx === parseInt(customer_idx))
            .value
        );
      },
    }
  );

  const updateMemberMutation = useMutation(
    async (data) => await API.put("/customer/customer-info", data),
    {
      onSuccess: () => {
        Modal.success({
          title: "사용자 정보 수정 완료",
          content: "사용자 정보가 수정되었습니다.",
          okText: "확인",
        });
        queryClient.fetchQuery(["customerInfo", customer_idx]);
      },
    }
  );

  const onClickSave = () => {
    const {
      name,
      gender,
      hp: phone,
      birth,
      tags,
      memo,
      agree_marketing,
    } = defaultInfoForm.getFieldsValue();

    const formData = {
      name,
      phone,
      memo,
      user_idx,
      gender,
      birth,
      tags,
      customer_idx: parseInt(customer_idx),
      agree_marketing: agree_marketing ? 1 : 0,
    };
    if (
      Object.values(formData).filter(
        (data) => !Object.values(defaultInfo).includes(data)
      ).length === 0
    )
      return;

    updateMemberMutation.mutate(formData);
  };

  const createChartMutation = useMutation(
    async (data) =>
      await API.post("customer/drilling-chart", data).then((res) => ({
        resData: res.data,
        data,
      })),
    {
      onSuccess: ({ data }) => {
        queryClient.fetchQuery([
          "drillingChartList",
          chartFilter,
          customer_idx,
        ]);
        Modal.success({
          title: "지공차트 등록 완료",
          content: "지공차트가 등록되었습니다.",
          okText: "확인",
          onOk: () => {
            setIsDrillingChartAdd(false);
          },
        });
        setNewInfoData(initialInfoData);
        setNewChartData({ name: "", data: initialChartData });
      },
    }
  );

  const onClickAddDrillingChart = () => {
    if (!newInfoData.ballName)
      return Modal.error({
        title: "지공차트 등록 실패",
        content: "볼 이름을 입력해 주세요.",
        okText: "확인",
      });
    if (!newInfoData.weight)
      return Modal.error({
        title: "지공차트 등록 실패",
        content: "무게를 입력해 주세요.",
        okText: "확인",
      });
    if (!newInfoData.driller_idx)
      return Modal.error({
        title: "지공차트 등록 실패",
        content: "지공사를 선택해 주세요.",
        okText: "확인",
      });
    const formData = {
      title: newChartData.name,
      customer_idx,
      chart_data: Object.values(newChartData.data),
      ball_name: newInfoData.ballName,
      weight: newInfoData.weight,
      driller_idx: newInfoData.driller_idx,
      hand: newInfoData.hand,
      layout: newInfoData.layout,
      pin: newInfoData.pin,
      memo: newInfoData.memo,
    };
    createChartMutation.mutate(formData);
  };

  useEffect(() => {
    defaultInfoForm.setFieldsValue({
      name: defaultInfo.name,
      hp: defaultInfo.phone,
      memo: defaultInfo.memo,
      gender: defaultInfo.gender,
      birth: defaultInfo.birth,
      agree_marketing: defaultInfo.agree_marketing,
      tags: defaultInfo.tags,
    });
    setNewInfoData((prev) => ({
      ...prev,
      name: defaultInfo.name,
      hp: defaultInfo.phone,
    }));
    // eslint-disable-next-line
  }, [defaultInfo, defaultInfoForm]);

  useEffect(() => {
    if (storeList.length !== 0) {
      setCurrentStore(
        storeList.find((item) => item.customer_idx === parseInt(customer_idx))
          .value
      );
    }
  }, [storeList, customer_idx]);

  useEffect(() => {
    setNewChartData((prev) => ({
      ...prev,
      name: `지공차트${
        chartInfo.chartList.length ? chartInfo.chartList.length + 1 : 1
      }`,
    }));
  }, [chartInfo.chartList.length]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      return adminCustomerAllLockersRefetch();
    }, 300);

    return () => clearTimeout(debounce);
    // eslint-disable-next-line
  }, [lockerFilter]);

  return (
    <LoggedInLayout paddingTop={isAdmin ? 0 : "7rem"}>
      <WhiteBoxLayout marginBottom={isDrillingChartAdd ? "2.4rem" : 0}>
        <RowWrapper
          styles={css`
            justify-content: space-between;
          `}
          marginBottom={isAdmin ? "2rem" : 0}
        >
          <TextAtom
            fontSize={isAdmin ? "2.4rem" : "2.2rem"}
            fontWeight="bold"
            color={isAdmin ? color.mainBlue : color.black}
          >
            {isAdmin
              ? // defaultInfo.name
                "회원 상세"
              : `${defaultInfo.name} - ${
                  memberDetailTabList.find((item) => item.value === currentTab)
                    .name
                }`}
          </TextAtom>
          <BasicButton
            onClick={() => {
              const backUrl = location.state?.backUrl;
              if (backUrl) {
                navigate(backUrl);
              } else {
                navigate("/member");
              }
            }}
          >
            목록
          </BasicButton>
        </RowWrapper>
        {isAdmin && (
          <TabList
            list={storeList}
            onChange={onClickStore}
            currentTab={currentStore}
            borderRadius={"0.2rem"}
            gap="0.6rem"
          />
        )}
        <Divider />
        <TabList
          list={memberDetailTabList}
          onChange={onClickTab}
          currentTab={currentTab}
          borderRadius={"0.2rem"}
          gap="0.6rem"
          marginBottom={"3rem"}
        />

        {currentTab === "basicInfo" && (
          <>
            <TextAtom fontSize={"2rem"} fontWeight={600} marginBottom="2rem">
              기본 정보
            </TextAtom>
            <MemberInfoSection
              form={defaultInfoForm}
              name="basicInfo"
              structure="page"
              onClickDoneBtn={onClickSave}
              initialTags={defaultInfo.tags}
              isAdmin={isAdmin}
              user_idx={user_idx}
            />
          </>
        )}
        {currentTab === "lockerInfo" && (
          <LockerInfoSection
            lockerInfo={isAdmin ? adminAllCustomerLockers : lockerInfo}
            setLockerFilter={setLockerFilter}
            lockerFilter={lockerFilter}
          />
        )}
        {currentTab === "drillingChart" && (
          <DrillingChartSection
            chartInfo={chartInfo}
            isDrillingChartAdd={isDrillingChartAdd}
            setIsDrillingChartAdd={setIsDrillingChartAdd}
            chartFilter={chartFilter}
            setChartFilter={setChartFilter}
            customer_idx={customer_idx}
          />
        )}
      </WhiteBoxLayout>
      {isDrillingChartAdd && (
        <WhiteBoxLayout>
          <RowWrapper
            styles={css`
              justify-content: space-between;
              /* text-align: center; */
            `}
          >
            <RowWrapper
              styles={css`
                /* background-color: wheat; */
                width: 60%;
              `}
            >
              <TextAtom
                fontSize={"2rem"}
                fontWeight={600}
                marginRight="2.4rem"
                styles={css`
                  width: 40%;
                `}
              >
                지공 차트 등록
              </TextAtom>
              <Input
                placeholder="제목을 입력해 주세요."
                bordered={false}
                style={{
                  borderBottom: "0.2rem solid rgba(0,0,0,0.1)",
                  borderRadius: 0,
                }}
                maxLength={10}
                value={newChartData.name}
                onChange={(e) =>
                  setNewChartData((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </RowWrapper>
            <RowWrapper>
              <BasicButton
                focused
                marginright={"0.8rem"}
                onClick={onClickAddDrillingChart}
              >
                등록하기
              </BasicButton>
              <BasicButton onClick={() => setIsDrillingChartAdd(false)}>
                취소
              </BasicButton>
            </RowWrapper>
          </RowWrapper>
          <Divider />
          <DrillingChart
            chartData={newChartData.data}
            setChartData={setNewChartData}
            infoData={newInfoData}
            setInfoData={setNewInfoData}
            setDrillerName={setDrillerName}
          />
        </WhiteBoxLayout>
      )}
    </LoggedInLayout>
  );
};

export default MemberDetail;
