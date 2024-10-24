import { Divider } from "antd";
import { useState } from "react";
import { useQuery } from "react-query";
import AdminSettingLayout from "../../../components/layouts/AdminSettingLayout";
import LoggedInLayout from "../../../components/layouts/LoggedInLayout";
import TabList from "../../../components/organism/TabList";
import { API } from "../../../utils/api";
import { bannerSettingTabList } from "../../../utils/constans";

import LockerBannerSection from "./components/section/LockerBannerSection";

const BannerSetting = () => {
  const [currentTab, setCurrentTab] = useState("locker");
  const [bannerData, setBannerData] = useState({
    locker: {
      1: {
        link: "",
        image: null,
        show: 1,
      },
      2: {
        link: "",
        image: null,
        show: 1,
      },
    },
    customer: {
      1: {
        link: "",
        image: null,
        show: 1,
      },
      2: {
        link: "",
        image: null,
        show: 1,
      },
    },
    setting: {
      1: {
        link: "",
        image: null,
        show: 1,
      },
    },
  });

  useQuery(
    "adminBannerQuery",
    async () => await API.get("/admin/banner").then((res) => res.data),
    {
      onSuccess: (data) => {
        let result = {};
        const types = bannerSettingTabList.map((item) => item.value);
        for (let type of types) {
          result = { ...data, [type]: { ...bannerData[type], ...data[type] } };
        }
        setBannerData(result);
      },
    }
  );

  const onClickTab = (value) => {
    if (currentTab === value) {
      return;
    }
    setCurrentTab(value);
  };

  return (
    <LoggedInLayout>
      <AdminSettingLayout
        title={"배너 관리"}
        caption={"각 페이지의 배너에 적용됩니다."}
        captionMarginBottom={"2.4rem"}
      >
        <TabList
          list={bannerSettingTabList}
          currentTab={currentTab}
          onChange={onClickTab}
          borderRadius="0.2rem"
          gap={"0.6rem"}
        />
        <Divider style={{ marginTop: "3rem", marginBottom: "2.4rem" }} />
        <LockerBannerSection
          currentTab={currentTab}
          data={bannerData}
          setData={setBannerData}
        />
      </AdminSettingLayout>
    </LoggedInLayout>
  );
};

export default BannerSetting;
