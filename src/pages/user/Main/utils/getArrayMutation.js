import { useMutation } from "react-query";
import { API } from "../../../../utils/api";

const useGetArrayMutation = (selectedLockerType, setState, user_idx) => {
  return useMutation(
    () => {
      if (!selectedLockerType) return;
      if (!selectedLockerType.idx) return;
      return API.post("/locker/locker-array", {
        locker_type: selectedLockerType.locker_type,
        ...(user_idx && { user_idx: parseInt(user_idx) }),
      }).then((res) => res.data);
    },
    {
      onSuccess: (data) => {
        if (!data) return;
        const array = [];
        const useNum = data.list.map((item) => item.locker_number);
        const exceptNumbers = selectedLockerType.except_number
          ? selectedLockerType.except_number.split(",")
          : [];
        for (
          let i = selectedLockerType.start_number;
          i <
          selectedLockerType.start_number + selectedLockerType.locker_amount;
          i++
        ) {
          if (useNum.includes(i)) {
            array.push(data.list.find((item) => i === item.locker_number));
          } else {
            array.push({
              idx: i,
              customer_idx: 0,
              locker_number: i,
              locker_type: selectedLockerType.locker_type,
              start_date: "",
              end_date: "",
              name: "",
              remain: 0,
              available: 1,
              isExcept:
                exceptNumbers.findIndex((item) => parseInt(item) === i) !== -1
                  ? 1
                  : 0,
            });
          }
        }
        setState(array);
      },
    }
  );
};

export default useGetArrayMutation;
