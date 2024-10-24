import { useQuery } from "react-query";
import { API } from "../utils/api";

export const getLockerList = async ({ type, formData }) => {
  try {
    let apiUrl = "";
    if (type) {
      apiUrl = `/locker/locker-list-${type}`;
    } else {
      apiUrl = "/locker/locker-list";
    }
    const res = await API.get(apiUrl, { params: formData });
    return res.data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

const useGetLockerList = ({ dataKey, type, formData, onSuccess, onError }) => {
  return useQuery(
    dataKey,
    () =>
      getLockerList({
        type,
        formData,
      }),
    {
      onSuccess,
      onError,
    }
  );
};

export default useGetLockerList;
