import { Divider, Modal } from "antd";
import { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { css } from "styled-components";
import { queryClient } from "../../../../../App";
import BasicButton from "../../../../../components/atom/BasicButton";
import { API } from "../../../../../utils/api";
import BannerSettingItem from "../organism/BannerSettingItem";

const LockerBannerSection = ({ currentTab, data, setData }) => {
  const [dataArr, setDataArr] = useState([]);

  const objDivider = (key) => {
    const arr = dataArr.map((data) => data[key]);
    let newObj = {};
    arr.forEach((item, index) => {
      if (key === "image") {
        return (newObj[index + 1] = item?.file
          ? item
          : item?.url
          ? item
          : { url: item });
      }
      return (newObj[index + 1] = item);
    });
    return newObj;
  };

  const onChange = (value, index, target) => {
    setData((prev) => ({
      ...prev,
      [currentTab]: {
        ...prev[currentTab],
        [index]: {
          ...prev[currentTab][index],
          [target]: value,
        },
      },
    }));
  };

  const saveBannerMutation = useMutation(
    (data) =>
      API.post("/admin/banner", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
    {
      onSuccess: () => {
        Modal.success({
          title: "배너 설정 완료",
          content: "배너 설정이 저장되었습니다.",
          okText: "확인",
        });
        queryClient.fetchQuery("adminBannerQuery");
      },
    }
  );

  const onClickSave = () => {
    const form = new FormData();
    const changedData = data[currentTab];
    form.append("type", currentTab);
    const idxs = Object.keys(changedData);
    for (let idx of idxs) {
      const item = changedData[idx];
      if (item.image) {
        form.append("idxs[]", idx);
        form.append(`link${idx}`, item.link);
        form.append(
          `image${idx}`,
          item.image.file ? item.image.file : item.image.url
        );
        form.append(`show${idx}`, item.show);
      }
    }
    saveBannerMutation.mutate(form);
  };

  useEffect(() => {
    setDataArr(Object.values(data[currentTab]));
  }, [data, currentTab]);

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "4rem" }}>
        {dataArr.map((_, index) => {
          const number = index + 1;
          const text =
            currentTab === "locker"
              ? "라카 현황"
              : currentTab === "customer"
              ? "전체 회원"
              : currentTab === "setting"
              ? "설정"
              : "";
          const imageSizeString =
            currentTab === "customer"
              ? "(320x600)"
              : currentTab === "setting"
              ? "(360x1320)"
              : null;
          return (
            <div
              key={index}
              // style={{ marginTop: index > 0 ? "1.6rem" : 0 }}
            >
              {index > 0 && <Divider />}
              <BannerSettingItem
                title={`${text} 배너${
                  dataArr.length > 1 ? " - " + number : ""
                }`}
                currentTab={currentTab}
                links={objDivider("link")}
                images={objDivider("image")}
                shows={objDivider("show")}
                onChange={onChange}
                index={number}
                imageSizeString={imageSizeString}
              />
            </div>
          );
        })}
      </div>
      <Divider style={{ marginTop: "4rem", marginBottom: "4.4rem" }} />
      <BasicButton
        size={"large"}
        focused
        styles={css`
          width: 100%;
        `}
        onClick={onClickSave}
      >
        저장
      </BasicButton>
    </>
  );
};

export default LockerBannerSection;
