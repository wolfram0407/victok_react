import { useState } from "react";
import { createContext } from "react";

export const MainContext = createContext({
  lockerType: [],
  setLockerType: () => {},
  selectedLockerType: null,
  setSelectedLockerType: () => {},
  lockerArrayData: [],
  setLockerArrayData: () => {},
});

const MainContextProvider = ({ children }) => {
  const setLockerType = (arg) => {
    setState((prev) => ({
      ...prev,
      lockerType: arg,
    }));
  };

  const setSelectedLockerType = (arg) => {
    setState((prev) => ({
      ...prev,
      selectedLockerType: arg,
    }));
  };

  const setLockerArrayData = (arr) => {
    setState((prev) => ({
      ...prev,
      lockerArrayData: arr,
    }));
  };

  const initialState = {
    lockerType: [],
    setLockerType,
    selectedLockerType: null,
    setSelectedLockerType,
    lockerArrayData: [],
    setLockerArrayData,
  };

  const [state, setState] = useState(initialState);

  return <MainContext.Provider value={state}>{children}</MainContext.Provider>;
};

export default MainContextProvider;
