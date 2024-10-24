import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useAppContext } from "../utils/context";

const MemberDetailOutlet = ({ grade, gradeRefetch }) => {
  const { isAdmin } = useAppContext();
  const location = useLocation();
  const [currentTab, setCurrentTab] = useState("basicInfo");

  const initialChartData = {};
  for (let i = 1; i <= 37; i++) {
    initialChartData[i] = "";
  }

  const initialInfoData = {
    name: "",
    hp: "",
    ballName: "",
    weight: "",
    driller_idx: null,
    hand: "",
    layout: "",
    pin: "",
    memo: "",
  };

  useEffect(() => {
    if (location.pathname.includes("drillingChart")) {
      setCurrentTab("drillingChart");
    }
    // eslint-disable-next-line
  }, []);

  const context = {
    currentTab,
    setCurrentTab,
    initialChartData,
    initialInfoData,
    ...(!isAdmin && { grade, gradeRefetch }),
  };

  return <Outlet context={context} />;
};

export default MemberDetailOutlet;
