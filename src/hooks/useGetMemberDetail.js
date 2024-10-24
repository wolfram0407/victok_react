import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { API } from "../utils/api";
import { chargeConvert } from "../utils/utils";

const convertColumn = (value) => {
  return value;
  // switch (value) {
  //   case "charge":
  //     return "charge.charge";
  //   default:
  //     return `locker.${value}`;
  // }
};

const useGetMemberDetail = ({
  customer_idx,
  lockerFilter,
  chartFilter,
  additionalLockerFilterSuccessCallback,
  additionalChartFilterSuccessCallback,
}) => {
  const isReady = lockerFilter
    ? Boolean(customer_idx) && Boolean(lockerFilter) && Boolean(chartFilter)
    : Boolean(customer_idx) && Boolean(chartFilter);

  const [isLoading, setIsLoading] = useState(false);

  const initialCustomerInfo = {
    idx: 0,
    memo: "",
    name: "",
    phone: "",
    user_idx: 0,
    gender: "",
    tags: [],
    agree_marketing: 0,
  };

  const initialCustomerLocker = {
    customerName: "",
    list: [],
    total: 0,
  };

  const initialDrillingChart = {
    chartList: [],
    total: 0,
  };

  const [data, setData] = useState({
    customerInfo: initialCustomerInfo,
    customerLocker: initialCustomerLocker,
    drillingChart: initialDrillingChart,
  });
  const { isLoading: customerInfoLoading } = useQuery(
    ["customerInfo", customer_idx],
    async () => {
      if (!customer_idx)
        return setData((prev) => ({
          ...prev,
          customerInfo: initialCustomerInfo,
        }));
      const res = await API.get("/customer/customer-info", {
        params: { customer_idx },
      });
      return res.data;
    },
    {
      onSuccess: (data) => {
        if (!data) return;
        setData((prev) => ({
          ...prev,
          customerInfo: {
            idx: data.idx,
            memo: data.memo,
            name: data.name,
            phone: data.phone,
            user_idx: data.user_idx,
            gender: data.gender,
            tags: data.tags,
            birth: data.birth
              ? dayjs(data.birth).format("YYYYMMDD").toString()
              : "",
            agree_marketing: data.agree_marketing,
          },
        }));
      },
      onError: (error) => {
        setData((prev) => ({
          ...prev,
          customerInfo: initialCustomerInfo,
        }));
        if (axios.isAxiosError(error)) {
          console.log(error.response);
        }
      },
      enabled: isReady,
    }
  );

  const { isLoading: customerLockerLoading } = useQuery(
    ["customerLocker", lockerFilter, customer_idx],
    async () => {
      if (!customer_idx || !lockerFilter)
        return setData((prev) => ({
          ...prev,
          customerLocker: initialCustomerLocker,
        }));
      const res = await API.get("/locker/customer-locker", {
        params: {
          column: convertColumn(lockerFilter.column),
          order: lockerFilter.order,
          customer_idx,
          page: lockerFilter.page,
        },
      });
      return res.data;
    },
    {
      onSuccess: (data) => {
        if (!data) return;
        additionalLockerFilterSuccessCallback &&
          additionalLockerFilterSuccessCallback(data);
        setData((prev) => ({
          ...prev,
          customerLocker: {
            customerName: data.customerName,
            list: data.list.map((item, index) => ({
              ...item,
              charge: chargeConvert(item.charge),
              key: index,
            })),
            total: data.total,
          },
        }));
      },
      onError: (error) => {
        setData((prev) => ({ ...prev, customerLocker: initialCustomerLocker }));
        if (axios.isAxiosError(error)) {
          console.log(error.response);
        }
      },
      enabled: isReady,
    }
  );

  const { isLoading: drillingChartLoading } = useQuery(
    ["drillingChartList", chartFilter, customer_idx],
    async () => {
      if (!customer_idx || !chartFilter)
        return setData((prev) => ({
          ...prev,
          drillingChart: initialDrillingChart,
        }));
      const res = await API.get("/customer/drilling-chart-list", {
        params: {
          customer_idx,
          page: chartFilter.page,
        },
      });
      return res.data;
    },
    {
      onSuccess: (data) => {
        if (!data) return;
        additionalChartFilterSuccessCallback &&
          additionalChartFilterSuccessCallback(data);
        setData((prev) => ({
          ...prev,
          drillingChart: {
            chartList: data.chartList.map((item) => ({
              ...item,
              key: item.idx,
            })),
            total: data.total,
          },
        }));
      },
      enabled: isReady,
    }
  );

  useEffect(() => {
    if (lockerFilter) {
      if (
        customerInfoLoading ||
        customerLockerLoading ||
        drillingChartLoading
      ) {
        setIsLoading(true);
      } else {
        setIsLoading(false);
      }
    } else {
      if (customerInfoLoading || drillingChartLoading) {
        setIsLoading(true);
      } else {
        setIsLoading(false);
      }
    }
  }, [
    customerInfoLoading,
    customerLockerLoading,
    drillingChartLoading,
    lockerFilter,
  ]);

  return { data, isLoading };
};

export default useGetMemberDetail;
