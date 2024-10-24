import { Divider, Modal } from "antd";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { css } from "styled-components";
import BasicButton from "../../../components/atom/BasicButton";
import RowWrapper from "../../../components/atom/RowWrapper";
import TextAtom from "../../../components/atom/TextAtom";
import LoggedInLayout from "../../../components/layouts/LoggedInLayout";
import WhiteBoxLayout from "../../../components/layouts/WhiteBoxLayout";
import useMe from "../../../hooks/useMe";
import { color } from "../../../styles/theme";
import { API } from "../../../utils/api";
import { getByteLength, numberToLocaleString } from "../../../utils/utils";
import BoxLayout from "./components/atom/BoxLayout";
import SendMessageModal from "./components/organism/SendMessageModal";
import InfoSection from "./components/section/InfoSection";
import MemberListSection from "./components/section/MemberListSection";
import MessageTypeSection from "./components/section/MessageTypeSection";
import SelectedMemberSection from "./components/section/SelectedMemberSection";
import WriteSection from "./components/section/WriteSection";

const MessagePost = () => {
  const { grade, gradeLoading } = useOutletContext();
  const [messageType, setMessageType] = useState("notice");
  const [messageInput, setMessageInput] = useState("");
  const [messageByte, setMessageByte] = useState(0);
  const [messageTitleInput, setMessageTitleInput] = useState("");
  const [messageTitleByte, setMessageTitleByte] = useState(0);
  const [files, setFiles] = useState([]);
  const [tagGroup, setTagGroup] = useState("00");
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [messagePrice, setMessagePrice] = useState({
    sms: 0,
    lms: 0,
    mms: 0,
  });
  const [adMessageInfo, setAdMessageInfo] = useState({
    initialText: "",
    telInfo: "",
  });

  const [sendMessageModal, setSendMessageModal] = useState(false);
  const sendType = "message";
  const [storeMessageInfo, setStoreMessageInfo] = useState({
    initialText: "",
    telInfo: "",
  });
  const [sort, setSort] = useState({
    keyword: "",
    page: 1,
    amount: 10,
    column: null,
    order: null,
  });

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { data: meData } = useMe((d) => {
    setStoreMessageInfo((prev) => ({
      ...prev,
      initialText: `(광고)${d.store_name}`,
    }));
  });

  const messageTypeAddBytes =
    getByteLength(adMessageInfo.initialText) +
    getByteLength(adMessageInfo.telInfo) +
    4;

  useQuery(
    "messagePriceInfoQuery",
    () => API.get("/message/message-setting").then((res) => res.data),
    {
      onSuccess: (data) => {
        if (!data) return;
        const { SMS, LMS, MMS, deny_number } = data;
        setMessagePrice((prev) => ({
          ...prev,
          sms: SMS,
          lms: LMS,
          mms: MMS,
        }));
        setStoreMessageInfo((prev) => ({
          ...prev,
          telInfo: `무료거부 ${deny_number}`,
        }));
      },
    }
  );

  const onReset = () => {
    setMessageType("notice");
    setMessageInput("");
    setMessageByte(0);
    setMessageTitleInput("");
    setMessageTitleByte(0);
    setFiles([]);
    setTagGroup("");
    setSelectedTags([]);
    setSelectedMembers([]);
  };

  const onClickConfirmListBtn = () => {
    setSendMessageModal(false);
    navigate("/messageList");
  };

  const onClickMoreSendMessageBtn = () => {
    setSendMessageModal(false);
    navigate("/messagePost", { replace: true });
    onReset();
    setSort((prev) => ({
      ...prev,
      keyword: "",
    }));
    window.scrollTo(0, 0);
  };

  const sendMessageMutation = useMutation(
    async (data) =>
      await API.post("/message/message", data, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    {
      onSuccess: () => {
        setSendMessageModal(true);
      },
      onError: (e) => {
        alert(e.response.data?.message);
      },
    }
  );

  const onClickSend = () => {
    const msg = adMessageInfo
      ? adMessageInfo.initialText +
        "\n\n" +
        messageInput +
        "\n\n" +
        adMessageInfo.telInfo
      : messageInput;
    const formData = {
      is_ad: Number(Boolean(messageType === "ad")),
      title: messageTitleInput,
      msg,
      images: files.map((image) => (image.file ? image.file : image.url)),
      customer_idxs: JSON.stringify(
        selectedMembers.map((member) => member.idx)
      ),
      sender: meData.contact,
      // rdate: null,
      // rtime: null,
    };

    const form = new FormData();

    for (let key in formData) {
      if (key === "images") {
        formData[key].forEach((image) => form.append(key, image));
      }
      form.append(key, formData[key]);
    }

    sendMessageMutation.mutate(form);
  };

  useEffect(() => {
    if (messageType === "ad") {
      setAdMessageInfo(storeMessageInfo);
    } else {
      setAdMessageInfo({
        initialText: "",
        telInfo: "",
      });
    }
    setMessageInput("");
    setMessageByte(0);
  }, [messageType, storeMessageInfo]);
  useEffect(() => {
    setMessageByte(getByteLength(messageInput));
  }, [messageInput]);

  useEffect(() => {
    if (gradeLoading) return;
    if (grade === 0) {
      Modal.confirm({
        title: "메시지 내역 확인 불가",
        content:
          "메시지 관련 기능은 이용권 구매 후 이용가능합니다. 이용권을 구매하시겠습니까?",
        okText: "구매하기",
        onOk: () => navigate("/goodsInfo"),
        cancelText: "취소",
        onCancel: () => navigate(-1),
      });
    }
    // eslint-disable-next-line
  }, [grade, gradeLoading]);

  return (
    <LoggedInLayout paddingBottom={"5rem"}>
      {grade !== 0 && (
        <>
          <WhiteBoxLayout>
            <RowWrapper
              styles={css`
                justify-content: space-between;
              `}
            >
              <RowWrapper>
                <TextAtom
                  fontSize={"2.2rem"}
                  fontWeight="bold"
                  marginRight={"3rem"}
                >
                  메시지
                </TextAtom>
                <BasicButton
                  focused={pathname === "/messagePost"}
                  marginright={"0.6rem"}
                  onClick={null}
                >
                  메시지 전송
                </BasicButton>
                <BasicButton
                  focused={pathname === "/messageList"}
                  marginright={"1rem"}
                  onClick={() => navigate("/messageList")}
                >
                  전송 내역
                </BasicButton>
                <BasicButton
                  styles={css`
                    border: 0.1rem solid ${color.mainBlue};
                    color: ${color.mainBlue};
                  `}
                  onClick={() => navigate("/setting?tab=tag")}
                >
                  태그 설정하기
                </BasicButton>
              </RowWrapper>
              <RowWrapper>
                <TextAtom
                  styles={css`
                    font-weight: 500;
                    > span {
                      color: ${color.green};
                    }
                  `}
                >
                  메시지 가격: 단문 <span>{messagePrice.sms}</span>원 | 장문{" "}
                  <span>{messagePrice.lms}</span>원 | 포토{" "}
                  <span>{messagePrice.mms}</span>원
                </TextAtom>
              </RowWrapper>
            </RowWrapper>
            <Divider />
            <InfoSection />
            <BoxLayout
              flexDirection={"column"}
              styles={css`
                padding-bottom: 2.4rem;
              `}
              marginBottom={"3rem"}
            >
              <MessageTypeSection
                sendType={sendType}
                messageType={messageType}
                setMessageType={setMessageType}
                setMessageInput={setMessageInput}
              />
              <Divider />
              <WriteSection
                messageInput={messageInput}
                setMessageInput={setMessageInput}
                messageByte={messageByte}
                messageTitleInput={messageTitleInput}
                setMessageTitleInput={setMessageTitleInput}
                messageTitleByte={messageTitleByte}
                setMessageTitleByte={setMessageTitleByte}
                stateFiles={files}
                setFiles={setFiles}
                messageType={messageType}
                adMessageInfo={adMessageInfo}
                messageTypeAddBytes={messageTypeAddBytes}
              />
              <Divider />

              <MemberListSection
                setTagGroup={setTagGroup}
                tagGroup={tagGroup}
                selectedMembers={selectedMembers}
                setSelectedMembers={setSelectedMembers}
                selectedTags={selectedTags}
                setSelectedTags={setSelectedTags}
                sort={sort}
                setSort={setSort}
              />
              <Divider />
              <SelectedMemberSection
                selectedMembers={selectedMembers}
                setSelectedMembers={setSelectedMembers}
              />
              <Divider style={{ marginBottom: "1.6rem" }} />
              <RowWrapper>
                <TextAtom
                  fontSize={"1.8rem"}
                  fontWeight={600}
                  marginRight="3rem"
                >
                  발신자 정보
                </TextAtom>
                <TextAtom fontSize={"1.4rem"} marginRight="2rem">
                  {meData.contact}
                </TextAtom>
                <TextAtom fontSize={"1.4rem"}>{meData.store_name}</TextAtom>
              </RowWrapper>
              <Divider style={{ marginTop: "1.6rem" }} />
              <RowWrapper
                styles={css`
                  width: 100%;
                  justify-content: center;
                `}
              >
                <TextAtom
                  fontSize={"1.8rem"}
                  fontWeight={500}
                  styles={css`
                    justify-self: center;
                  `}
                >
                  최종 확인:
                  <span
                    style={{
                      margin: "0 0.8rem",
                    }}
                  >
                    {files.length !== 0
                      ? "포토"
                      : messageByte > 90
                      ? "장문"
                      : "단문"}
                  </span>
                  (
                  <span style={{ margin: "0 0.8rem", color: color.gold }}>
                    {numberToLocaleString(selectedMembers.length)}
                  </span>
                  건 )
                </TextAtom>
              </RowWrapper>
            </BoxLayout>
            <RowWrapper
              styles={css`
                width: 100%;
                justify-content: center;
              `}
            >
              <BasicButton
                size={"large"}
                styles={css`
                  font-size: 1.8rem;
                  font-weight: bold;
                  width: 50rem;
                `}
                focused
                onClick={onClickSend}
                disabled={
                  selectedMembers.length === 0 ||
                  messageInput.length === 0 ||
                  !meData.contact
                }
              >
                문자 전송하기
              </BasicButton>
            </RowWrapper>
          </WhiteBoxLayout>
          <SendMessageModal
            open={sendMessageModal}
            onClickConfirmListBtn={onClickConfirmListBtn}
            onClickMoreSendMessageBtn={onClickMoreSendMessageBtn}
          />
        </>
      )}
    </LoggedInLayout>
  );
};

export default MessagePost;
