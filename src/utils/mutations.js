import { useMutation } from "react-query";
import { queryClient } from "../App";
import { API } from "./api";

export const LockerPaidChangeMutation = ({ displayMonthly }) => {
  useMutation((data) => API.put("/locker/locker-paid", data), {
    onSuccess: () => {
      let displayData;
      if (displayMonthly === "remain") {
        displayData = "lockerRemainData";
      } else if (displayMonthly === "expired") {
        displayData = "lockerExpiredData";
      } else {
        displayData = "lockerCurrentData";
      }
      queryClient.fetchQuery(displayData);
    },
  });
};
