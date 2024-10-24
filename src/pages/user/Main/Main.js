import LoggedInLayout from "../../../components/layouts/LoggedInLayout";
import styled from "styled-components";
import { API } from "../../../utils/api";
import LockerCurrentSection from "./components/section/LockerCurrentSection";
import MonthlySection from "./components/section/MonthlySection";
import { useContext, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { MainContext } from "./utils/mainContext";
import { useState } from "react";
import CreateLockerUserModal from "./components/organism/CreateLockerUserModal";
import { color } from "../../../styles/theme";
import { useQuery } from "react-query";
import useMe from "../../../hooks/useMe";

const BannerWrapper = styled.div`
  display: flex;
  width: 100%;
  min-height: ${(p) => (p.hasHeight ? "136px" : "unset")};
  justify-content: space-between;
  margin-top: 1rem;
  margin-bottom: 1rem;
`;

const Banner = styled.div`
  width: 49.5%;
`;

const BannerImg = styled.img`
  width: 100%;
  height: 136px;
`;

const Main = () => {
  const [createLockerUserModal, setCreateLockerUserModal] = useState(null);
  const { setLockerType, selectedLockerType, setSelectedLockerType } =
    useContext(MainContext);
  const {
    adData: { locker = {} },
    adRefetch,
  } = useOutletContext();
  const {
    data: { idx: user_idx = "" },
  } = useMe();

  const { isLoading } = useQuery(
    "getLockerInfo",
    async () => {
      const res = await API.get("/locker/locker-type-all");
      if (!res.data) {
        return [];
      }
      return res.data;
    },
    {
      onSuccess: (data) => {
        setLockerType(data.chargeList);
        if (!selectedLockerType) {
          if (data.chargeList.length > 0) {
            setSelectedLockerType(data.chargeList[0]);
          }
        }
      },
      // staleTime: 5000 * 60 * 2,
    }
  );

  useEffect(() => {
    adRefetch();
    // eslint-disable-next-line
  }, []);

  return (
    <LoggedInLayout>
      <BannerWrapper
        hasHeight={
          Object.values(locker).filter((item) => item.show === 1).length > 0
        }
      >
        {Object.values(locker)
          .filter((item) => item.show === 1)
          .map((item, index) => {
            return (
              <Banner
                key={index}
                style={{
                  backgroundColor: color.caption,
                  cursor: "pointer",
                }}
                onClick={() => window.open(item.link)}
              >
                <BannerImg src={item.image} alt="banner" />
              </Banner>
            );
          })}
      </BannerWrapper>
      {!isLoading && (
        <>
          <MonthlySection setCreateLockerUserModal={setCreateLockerUserModal} />
          <LockerCurrentSection
            setCreateLockerUserModal={setCreateLockerUserModal}
          />
        </>
      )}
      <CreateLockerUserModal
        open={createLockerUserModal}
        setCreateLockerUserModal={setCreateLockerUserModal}
        user_idx={user_idx}
      />
    </LoggedInLayout>
  );
};

export default Main;
