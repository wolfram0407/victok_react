import { Input, Modal } from "antd";
import { useState } from "react";
import { css } from "styled-components";
import BasicButton from "../../../../../components/atom/BasicButton";
import RowWrapper from "../../../../../components/atom/RowWrapper";
import TextAtom from "../../../../../components/atom/TextAtom";
import SettingSectionBox from "../atom/SettingSectionBox";
import BasicTag from "../../../../../components/atom/BasicTag";
import { color } from "../../../../../styles/theme";
import { useMutation, useQuery } from "react-query";
import { API } from "../../../../../utils/api";
import axios from "axios";
import { queryClient } from "../../../../../App";

const DrillerSection = () => {
  const [drillerNameInput, setDrillerNameInput] = useState("");
  const [drillerList, setDrillerList] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useQuery(
    "myDriller",
    async () => await API.get("user/driller").then((res) => res.data),
    {
      onSuccess: (data) => setDrillerList(data),
    }
  );

  const createDrillerMutation = useMutation(
    (data) => API.post("user/driller", data),
    {
      onSuccess: () => {
        Modal.success({
          title: <span style={{ color: color.success }}>지공사 등록 완료</span>,
          content: "지공사가 등록되었습니다.",
          okText: "확인",
          okButtonProps: { style: { backgroundColor: color.mainBlue } },
        });
        queryClient.fetchQuery("myDriller");
        setDrillerNameInput("");
      },
      onError: (error) => {
        let errorContent;
        if (axios.isAxiosError(error)) {
          errorContent = error.response.data.message;
        } else {
          errorContent = error;
        }
        return Modal.error({
          title: "지공사 등록 실패",
          content: errorContent,
          okText: "확인",
        });
      },
    }
  );

  const onClickAdd = () => {
    if (drillerNameInput === "") {
      return;
    }
    createDrillerMutation.mutate({ name: drillerNameInput });
  };

  const deleteDrillerMutation = useMutation(
    (data) => API.post("user/driller-delete", data),
    {
      onSuccess: () => {
        Modal.error({
          title: <span style={{ color: color.red }}>지공사 삭제 완료</span>,

          content: `선택한 지공사(${deleteTarget.name})가 삭제되었습니다.`,
          okText: "확인",
          okButtonProps: { style: { backgroundColor: color.mainBlue } },
          // style: [{ color: "red" }],
        });
        queryClient.fetchQuery("myDriller");
        setDeleteTarget(null);
      },
      onError: (error) => {
        if (axios.isAxiosError(error)) {
          console.log(error);
        } else {
          console.log(error);
        }
      },
    }
  );

  const onClickDelete = (item) => {
    setDeleteTarget(item);
    Modal.confirm({
      title: "지공사 삭제",
      content: `선택한 지공사(${item.name})를 삭제하시겠습니까?`,
      okText: "삭제",
      onOk: () => deleteDrillerMutation.mutate({ driller_idx: item.idx }),
      cancelText: "취소",
    });
  };

  return (
    <SettingSectionBox width={"100%"}>
      <TextAtom fontSize={"2rem"} fontWeight={600} marginBottom="2.4rem">
        지공사 관리
      </TextAtom>
      <RowWrapper marginBottom={"2rem"}>
        <Input
          value={drillerNameInput}
          onChange={(e) => setDrillerNameInput(e.target.value)}
          style={{ width: "20rem", marginRight: "0.6rem" }}
          placeholder="이름"
          maxLength={10}
        />
        <BasicButton focused onClick={onClickAdd}>
          추가
        </BasicButton>
      </RowWrapper>
      <RowWrapper
        styles={css`
          flex-wrap: wrap;
          gap: 1rem;
        `}
      >
        {drillerList.length !== 0 &&
          drillerList.map((item, index) => (
            <BasicTag
              key={item.idx}
              styles={css`
                height: 3.2rem;
                min-width: 10rem;
                justify-content: space-between;
                border-color: ${color.border};
                border-radius: 0.4rem;
                color: ${color.black};
                font-size: 1.4rem;
              `}
              closable
              onClose={() => onClickDelete(item)}
            >
              {item.name}
            </BasicTag>
          ))}
      </RowWrapper>
    </SettingSectionBox>
  );
};

export default DrillerSection;
