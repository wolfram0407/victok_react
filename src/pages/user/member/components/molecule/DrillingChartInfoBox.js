import { Checkbox, Empty, Input, Select } from "antd";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import styled, { css } from "styled-components";
import RowWrapper from "../../../../../components/atom/RowWrapper";
import TextAtom from "../../../../../components/atom/TextAtom";
import { color } from "../../../../../styles/theme";
import { API } from "../../../../../utils/api";
import { useAppContext } from "../../../../../utils/context";

const { Option } = Select;
const { TextArea } = Input;

const Container = styled.div`
  width: 52rem;
`;

const DrillingChartInfoBox = ({
  detail,
  isEdit,
  setIsEdit,
  infoData,
  setInfoData,
  setDrillerName,
}) => {
  const { isAdmin } = useAppContext();
  const { name, hp, ballName, weight, driller_idx, hand, layout, pin, memo } =
    infoData;
  const [drillerList, setDrillerList] = useState([]);

  const adminStyle = isAdmin
    ? {
        backgroundColor: "white",
        color: color.black,
      }
    : null;

  useQuery(
    "drillerData",
    async () => await API.get("user/driller").then((res) => res.data),
    {
      onSuccess: (data) => {
        console.log(data);
        setDrillerList(data);
      },
    }
  );

  const setValue = (e, target) => {
    setInfoData((prev) => ({ ...prev, [target]: e }));
  };

  const onChangeValue = () => {
    if (detail) {
      if (isEdit) {
        return;
      }
      setIsEdit(true);
    }
    return;
  };

  useEffect(() => {
    if (setDrillerName && drillerList.length > 0 && driller_idx) {
      setDrillerName(
        drillerList.find((driller) => driller.idx === driller_idx).name
      );
    }
    // eslint-disable-next-line
  }, [driller_idx, drillerList]);

  return (
    <Container>
      <TextAtom fontSize={"1.6rem"} fontWeight={500} marginBottom="0.6rem">
        기본 정보
      </TextAtom>
      <RowWrapper
        styles={css`
          justify-content: space-between;
        `}
        marginBottom="1.6rem"
      >
        <Input
          value={name}
          disabled
          style={{
            width: "32%",
            borderRadius: 2,
            ...adminStyle,
          }}
        />
        <Input
          value={hp}
          disabled
          style={{
            width: "64%",
            borderRadius: 2,
            ...adminStyle,
          }}
        />
      </RowWrapper>
      <TextAtom fontSize={"1.6rem"} fontWeight={500} marginBottom="0.6rem">
        지공 정보
      </TextAtom>
      <RowWrapper marginBottom="1.6rem">
        <Input
          value={ballName}
          onChange={(e) => {
            onChangeValue();
            setValue(e.target.value, "ballName");
          }}
          style={{
            flex: 1.5,
            borderRadius: 2,
            marginRight: "1rem",
            ...adminStyle,
          }}
          maxLength={10}
          disabled={isAdmin}
        />
        <Input
          type="number"
          value={weight}
          onChange={(e) => {
            onChangeValue();
            setValue(e.target.value, "weight");
          }}
          style={{
            flex: 0.5,
            borderRadius: 2,
            marginRight: "0.6rem",
            ...adminStyle,
          }}
          disabled={isAdmin}
        />
        <TextAtom fontSize={"1.4rem"} fontWeight="regular">
          lbs
        </TextAtom>
      </RowWrapper>
      <TextAtom fontSize={"1.6rem"} fontWeight={500} marginBottom="0.6rem">
        지공사
      </TextAtom>
      <Select
        className={isAdmin && "adminDriller"}
        placeholder="선택해 주세요."
        style={{
          display: "flex",
          marginBottom: "2rem",
          ...adminStyle,
        }}
        value={driller_idx}
        onChange={(e) => {
          onChangeValue();
          setValue(e, "driller_idx");
        }}
        disabled={isAdmin}
        notFoundContent={
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={"No Data"} />
        }
      >
        {drillerList.map((item) => (
          <Option key={item.idx} value={item.idx}>
            {item.name}
          </Option>
        ))}
      </Select>
      <RowWrapper
        styles={css`
          align-items: flex-start;
          justify-content: space-between;
        `}
        marginBottom="3rem"
      >
        <RowWrapper
          styles={css`
            width: 35%;
            flex-direction: column;
            align-items: flex-start;
          `}
        >
          <TextAtom fontSize={"1.6rem"} fontWeight={500} marginBottom="0.6rem">
            사용하는 손
          </TextAtom>
          <RowWrapper>
            <Checkbox
              className={isAdmin && "adminDriller"}
              checked={hand === "right"}
              onChange={() => {
                onChangeValue();
                setValue("right", "hand");
              }}
              disabled={isAdmin}
            >
              오른손
            </Checkbox>
            <Checkbox
              className={isAdmin && "adminDriller"}
              checked={hand === "left"}
              onChange={() => {
                onChangeValue();
                setValue("left", "hand");
              }}
              disabled={isAdmin}
            >
              왼손
            </Checkbox>
          </RowWrapper>
        </RowWrapper>
        <RowWrapper
          styles={css`
            width: 55%;
            flex-direction: column;
            align-items: flex-start;
          `}
        >
          <TextAtom fontSize={"1.6rem"} fontWeight={500} marginBottom="0.6rem">
            레이아웃
          </TextAtom>
          <Input
            className={isAdmin && "adminDriller"}
            value={layout}
            onChange={(e) => {
              onChangeValue();
              setValue(e.target.value, "layout");
            }}
            maxLength={20}
            style={{
              flex: 0.5,
              borderRadius: 2,
              marginRight: "0.6rem",
              marginBottom: "1.4rem",
              ...adminStyle,
            }}
            disabled={isAdmin}
          />
          <RowWrapper>
            <Checkbox
              className={isAdmin && "adminDriller"}
              checked={pin === "up"}
              onChange={() => {
                onChangeValue();
                setValue("up", "pin");
              }}
              disabled={isAdmin}
            >
              핀업
            </Checkbox>
            <Checkbox
              className={isAdmin && "adminDriller"}
              checked={pin === "down"}
              onChange={() => {
                onChangeValue();
                setValue("down", "pin");
              }}
              disabled={isAdmin}
            >
              핀다운
            </Checkbox>
          </RowWrapper>
        </RowWrapper>
      </RowWrapper>
      <TextAtom fontSize={"1.6rem"} fontWeight={500} marginBottom="0.6rem">
        메모 및 상담 내용
      </TextAtom>
      <TextArea
        placeholder="지공 시 상담한 내용을 적으시면 됩니다."
        value={memo}
        onChange={(e) => {
          onChangeValue();
          setValue(e.target.value, "memo");
        }}
        style={{
          height: "16rem",
          paddingTop: "0.8rem",
          borderRadius: 2,
          ...adminStyle,
        }}
        disabled={isAdmin}
      />
    </Container>
  );
};

export default DrillingChartInfoBox;
