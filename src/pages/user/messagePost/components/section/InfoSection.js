import { useState } from "react";
import { css } from "styled-components";

import TextAtom from "../../../../../components/atom/TextAtom";
import { color } from "../../../../../styles/theme";
import BoxLayout from "../atom/BoxLayout";
import SimpleToggleHeader from "../atom/SimpleToggleHeader";
import { useNavigate } from "react-router-dom";

const InfoSection = () => {
  const [isMore, setIsMore] = useState(false);
  const toggleMore = () => setIsMore((prev) => !prev);
  const navigate = useNavigate();

  const onClickInquiry = () => navigate("/inquiry");
  return (
    <BoxLayout flexDirection={"column"} marginBottom="1.6rem">
      <SimpleToggleHeader
        title={"메시지 전송 관련 안내 및 유의사항"}
        isMore={isMore}
        toggleMore={toggleMore}
      />
      {isMore && (
        <>
          <TextAtom
            fontSize={"1.4rem"}
            styles={css`
              white-space: pre-wrap;
            `}
          >
            {`· 전월 메시지 이용 건에 대한 요금은 익월 초 청구됩니다.
· 45자 이내는 SMS, 그 이상은 LMS로, 이미지 첨부 시 MMS 로 자동 발송됩니다.
· 시스템상 글자 스타일이나 이모지 등은 제대로 반영되지 않을 수 있습니다.`}
          </TextAtom>
          <TextAtom
            fontSize={"1.4rem"}
            styles={css`
              > span {
                text-decoration: underline;
                color: ${color.mainBlue};
                cursor: pointer;
              }
            `}
          >
            · 기타 궁금한 사항은 <span onClick={onClickInquiry}>문의</span>를
            이용해주시기 바랍니다.
          </TextAtom>
        </>
      )}
    </BoxLayout>
  );
};

export default InfoSection;
