import { useEffect } from "react";
import styled from "styled-components";
import MainContextProvider from "./pages/user/Main/utils/mainContext";
import MasterRouter from "./routers/MasterRouter";
import ContextProvider from "./utils/context";
import { QueryClient, QueryClientProvider } from "react-query";
import moment from "moment";

import { ConfigProvider } from "antd";
import locale from "antd/lib/locale/ko_KR";
import axios from "axios";

const Container = styled.div`
  display: flex;
  width: 100vw;
  height: 100%;
  flex-direction: column;
  background-color: #f3f5f8;
  font-family: "Pretendard", -apple-system, BlinkMacSystemFont, system-ui,
    Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR",
    "Malgun Gothic", sans-serif;
  position: relative;
`;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      onError: (error) => {
        if (axios.isAxiosError(error)) {
          if (
            error.response.data?.message?.includes("token") &&
            error.response.data?.message?.includes("인증")
          ) {
            sessionStorage.clear();
            localStorage.clear();
            window.location.replace("/");
          }
        } else {
          console.log(error);
        }
      },
    },
  },
});

function App() {
  moment.locale("ko");

  useEffect(() => {
    const jquery = document.createElement("script");
    jquery.src = "https://code.jquery.com/jquery-1.12.4.min.js";
    const iamport = document.createElement("script");
    iamport.src = "https://cdn.iamport.kr/js/iamport.payment-1.2.0.js";
    document.head.appendChild(jquery);
    document.head.appendChild(iamport);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ContextProvider>
        <MainContextProvider>
          <ConfigProvider locale={locale}>
            <Container>
              <MasterRouter />
            </Container>
          </ConfigProvider>
        </MainContextProvider>
      </ContextProvider>
    </QueryClientProvider>
  );
}

export default App;
