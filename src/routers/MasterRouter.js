import { BrowserRouter as Router } from "react-router-dom";
import { queryClient } from "../App";
import { useAppContext } from "../utils/context";
import LoggedInRouter from "./LoggedInRouter";
import LoggedOutRouter from "./LoggedOutRouter";

const MasterRouter = () => {
  const { loggedIn } = useAppContext();
  queryClient.setQueryData("isAdmin", () =>
    JSON.parse(
      localStorage.getItem("isAdmin") ??
        sessionStorage.getItem("isAdmin") ??
        false
    )
  );

  return <Router>{loggedIn ? <LoggedInRouter /> : <LoggedOutRouter />}</Router>;
};

export default MasterRouter;
