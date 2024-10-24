import { Route, Routes } from "react-router-dom";
import Footer from "../components/Footer";
import LoggedOutHeader from "../components/LoggedOutHeader";
import Welecome from "../pages/Welecome";
import Login from "../pages/user/Login";
import styled from "styled-components";
import FindPw from "../pages/user/FindPw";
import Register from "../pages/user/register/Register";
const RootView = styled.div`
  width: 100vw;
  height: calc(100vh - 26rem);
`;

const LoggedOutRouter = () => {
  return (
    <>
      <LoggedOutHeader />
      <RootView>
        <Routes>
          <Route path="/" element={<Welecome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/findpw" element={<FindPw />} />
          <Route path="*" element={<Welecome />} />
        </Routes>
      </RootView>
      <Footer />
    </>
  );
};

export default LoggedOutRouter;
