import { useEffect } from "react";
import { useQuery } from "react-query";
import { API } from "../utils/api";
import { useAppContext } from "../utils/context";
import { Modal } from "antd";
import { useState } from "react";

const useMe = (onSuccess, onError, onSettled) => {
  // const token =
  //   localStorage.getItem("token") ?? sessionStorage.getItem("token") ?? null;
  const { logUserOut, token } = useAppContext();
  const [noData, setNoData] = useState(false);

  const {
    data = { store_name: "" },
    isLoading,
    refetch,
  } = useQuery(
    "myData",
    async () => {
      if (!token) return logUserOut();
      const res = await API.get("/user/info");
      return res.data;
    },
    {
      onSuccess,
      onError,
      onSettled,
    }
  );

  useEffect(() => {
    if (isLoading) return;
    if (!data) {
      setNoData(true);
    }
    // eslint-disable-next-line
  }, [data, isLoading]);

  useEffect(() => {
    if (noData) {
      Modal.error({
        title: "회원 정보 없음.",
        content: "회원정보가 존재하지 않습니다. 로그인페이지로 돌아갑니다.",
        okText: "확인",
        onOk: () => logUserOut(),
      });
    }
  }, [noData]);

  return { data, isLoading, refetch };
};

export default useMe;
