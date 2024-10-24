import { Modal } from "antd";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { createContext, useContext, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { API } from "./api";

export const isAdmin = JSON.parse(
  localStorage.getItem("isAdmin") ?? sessionStorage.getItem("isAdmin") ?? false
);

export const AppContext = createContext({
  loggedIn: false,
  logUserIn: () => {},
  logUserOut: () => {},
  termList: [],
  isAdmin: false,
  token: null,
});

export const token =
  localStorage.getItem("token") ?? sessionStorage.getItem("token") ?? null;

const ContextProvider = ({ children }) => {
  const loginMutation = useMutation(
    ({ email, password, isAuto, callback }) =>
      API.post("/user/sign-in", { email, password }).then((res) => ({
        res: res.data,
        req: { isAuto, callback },
      })),
    {
      onSuccess: ({ res, req: { isAuto, callback } }) => {
        const {
          token,
          userInfo: { login_time },
        } = res;
        const userIdx = jwtDecode(token);
        const isAdmin = Boolean(userIdx.idx === 1 || userIdx.idx === 100055);
        setState((prev) => ({
          ...prev,
          loggedIn: true,
          token,
          isAdmin,
        }));
        API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        if (isAuto) {
          localStorage.setItem("token", token);
          if (isAdmin) {
            localStorage.setItem("isAdmin", true);
          }
        } else {
          sessionStorage.setItem("token", token);
          if (isAdmin) {
            sessionStorage.setItem("isAdmin", true);
          }
        }
        callback(login_time);
      },
      onError: (error) => {
        if (axios.isAxiosError(error)) {
          Modal.error({
            title: "로그인 오류",
            content: error.response.data.message,
          });
        }
      },
    }
  );

  const logUserIn = ({ id, password, isAuto, callback }) => {
    loginMutation.mutate({ email: id, password, isAuto, callback });
  };

  const logUserOut = (customPath) => {
    setState((prev) => ({
      ...prev,
      loggedIn: false,
    }));
    sessionStorage.clear();
    localStorage.clear();
    if (customPath) {
      window.location.replace(customPath);
    } else {
      window.location.replace("/");
    }
  };

  const [termList, setTermList] = useState([
    { id: 1, title: "서비스 이용약관", url: "" },
    { id: 2, title: "개인정보처리방침", url: "" },
    { id: 3, title: "FAQ", url: "" },
    { id: 4, title: "ChannelTalk", url: "" },
  ]);
  useQuery(
    ["termsInfo", isAdmin],
    async () => {
      if (isAdmin) return;
      const res = await API.get("/user/terms");
      return res.data;
    },
    {
      onSuccess: (data) => {
        if (!data) return;
        setTermList((prev) => {
          prev[0].url = data[0].terms_of_use;
          prev[1].url = data[0].privacy_policy;
          prev[2].url = data[0].faq;
          prev[3].url = data[0].channel_talk;
          return prev;
        });
      },
      onError: (error) => console.log(error),
      refetchOnWindowFocus: false,
      staleTime: "Infinity",
    }
  );

  const initialState = {
    loggedIn:
      localStorage.getItem("token") ?? sessionStorage.getItem("token")
        ? true
        : false,
    logUserIn,
    logUserOut,
    termList,
    isAdmin: JSON.parse(
      localStorage.getItem("isAdmin") ??
        sessionStorage.getItem("isAdmin") ??
        false
    ),
    token: localStorage.getItem("token") ?? sessionStorage.getItem("token"),
  };

  const [state, setState] = useState(initialState);

  return <AppContext.Provider value={state}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};

export default ContextProvider;
