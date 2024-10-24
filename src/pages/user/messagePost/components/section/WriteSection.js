import styled, { css } from "styled-components";
import { useRef, useState } from "react";
import RowWrapper from "../../../../../components/atom/RowWrapper";
import TextAtom from "../../../../../components/atom/TextAtom";
import { color } from "../../../../../styles/theme";
import SimpleToggleHeader from "../atom/SimpleToggleHeader";
import { Button, Input, Modal, Typography } from "antd";
import BasicButton from "../../../../../components/atom/BasicButton";
import DeviceTextarea from "../atom/DeviceTextarea";
import {
  actionImgCompress,
  encodeFileName,
  filenameEllipsis,
  getByteLength,
} from "../../../../../utils/utils";
import BasicTag from "../../../../../components/atom/BasicTag";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import UploadInfoModal from "../organism/UploadInfoModal";
import AdMessageInfoModal from "../organism/AdMessageInfoModal";
import MessageLoadBox from "../organism/MessageLoadBox";
import { useMutation, useQuery } from "react-query";
import { API } from "../../../../../utils/api";
import { queryClient } from "../../../../../App";

const { TextArea } = Input;

const Section = styled.div`
  width: 100%;
  display: flex;
`;

const LeftSection = styled.div`
  width: 40%;
  display: flex;
  flex-direction: column;
`;

const TextAreaWrapper = styled.div`
  width: 36em;
  height: 100%;
  border: none;

  border: 0.2rem solid ${color.border};
`;

const BtnWrapper = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
`;

const BtnGroupWrapepr = styled.div`
  display: flex;
  flex-direction: column;
`;

const RightSection = styled.div`
  width: 60%;
`;

const WriteSection = ({
  messageInput,
  setMessageInput,
  messageByte,
  messageTitleInput,
  setMessageTitleInput,
  messageTitleByte,
  setMessageTitleByte,
  stateFiles,
  setFiles,
  messageType,
  adMessageInfo,
  messageTypeAddBytes,
}) => {
  const [isMore, setIsMore] = useState(true);
  const [isLoadBox, setIsLoadBox] = useState(false);
  const [uploadInfoModal, setUploadInfoModal] = useState(false);
  const [adMessageInfoModal, setAdMessageInfoModal] = useState(false);
  const photoRef = useRef();

  const [templates, setTemplates] = useState([]);

  useQuery(
    ["messageTemplate"],
    async () =>
      await API.get("/message/message-template-list").then((res) => res.data),
    {
      onSuccess: (data) =>
        setTemplates(data.map((item) => ({ ...item, key: item.idx }))),
      retry: false,
    }
  );

  const setImageFromFile = ({ file, setImageUrl }) => {
    let reader = new FileReader();
    reader.onload = () => {
      setImageUrl({ result: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const onClickUpload = async (e) => {
    const {
      target: { files },
    } = e;
    const imagesLength = stateFiles.length;
    let limit = 3;
    if (imagesLength !== 0) {
      limit = 3 - imagesLength;
    }
    if (files) {
      if (files.length > limit) {
        return Modal.error({
          title: "이미지 등록 개수 초과",
          content: "이미지는 최대 3장까지 등록가능합니다.",
          okText: "확인",
        });
      }
      let loopLimit = files.length > limit ? limit : files.length;
      Promise.all(
        Object.values(files)
          .slice(0, loopLimit)
          .map(async (file) => {
            const compressedFile = await actionImgCompress(file);
            return setImageFromFile({
              file: compressedFile,
              setImageUrl: ({ result }) =>
                setFiles((prev) => [
                  ...prev,
                  {
                    file: encodeFileName(compressedFile),
                    url: result,
                  },
                ]),
            });
          })
      );
      e.target.value = "";
    }
  };

  const onClickUploadBtn = () => {
    photoRef.current.click();
  };
  const onClickRemoveBtn = (url) => {
    Modal.confirm({
      title: "알림",
      content: "이미지를 삭제하시겠습니까?",
      okText: "확인",
      onOk: () => setFiles(stateFiles.filter((file) => file.url !== url)),
      cancelText: "취소",
    });
  };

  const saveTemplateMutation = useMutation(
    async (data) =>
      await API.post("/message/message-template", data, {
        headers: { "content-type": "multipart/form-data" },
      }),
    {
      onSuccess: () => {
        Modal.success({
          title: "알림",
          content: "템플릿이 저장되었습니다.",
          okText: "확인",
        });
        queryClient.fetchQuery("messageTemplate");
      },
    }
  );
  const onClickSave = () => {
    if (templates.length > 9) {
      return Modal.warn({
        title: "알림",
        content: "10개 이상 저장할 수 없습니다.",
        okText: "확인",
      });
    }
    const formData = {
      msg: messageInput,
      images: stateFiles.map((item) => item.file),
    };

    const form = new FormData();

    for (let key in formData) {
      if (key === "images") {
        formData[key].forEach((image) => form.append(key, image));
      }
      form.append(key, formData[key]);
    }
    saveTemplateMutation.mutate(form);
  };

  return (
    <>
      <SimpleToggleHeader
        title={"메시지 작성"}
        isMore={isMore}
        toggleMore={() => setIsMore((prev) => !prev)}
      />
      {isMore && (
        <Section>
          <LeftSection>
            <Button
              type="text"
              style={{
                padding: 0,
                margin: 0,
                marginBottom: "1rem",
                width: "fit-content",
              }}
              onClick={() => setAdMessageInfoModal(true)}
            >
              <TextAtom
                fontSize={"1.4rem"}
                color={color.red}
                styles={css`
                  text-decoration: underline;
                  cursor: pointer;
                `}
              >
                [필독] 광고메시지 전송 가이드
              </TextAtom>
            </Button>
            {(messageByte > 90 || stateFiles.length !== 0) && (
              <Input
                placeholder="LMS/MMS 제목 입력 (최대 30Byte)"
                value={messageTitleInput}
                onChange={(e) => {
                  if (messageTitleByte > 30) {
                    e.target.value = e.target.value.slice(
                      0,
                      messageTitleInput.length
                    );
                  }
                  setMessageTitleInput(e.target.value);
                  setMessageTitleByte(getByteLength(e.target.value));
                }}
                style={{
                  width: "36rem",
                  marginBottom: "1rem",
                }}
              />
            )}
            <RowWrapper
              styles={css`
                height: fit-content;
                min-height: 40rem;
              `}
              marginBottom={stateFiles.length > 0 ? "1.6rem" : 0}
            >
              <TextAreaWrapper>
                {adMessageInfo && (
                  <Typography style={{ padding: "1.6rem" }}>
                    {adMessageInfo.initialText}
                  </Typography>
                )}
                <TextArea
                  placeholder={`※ 알림 내용을 입력해주세요.\n\n\n[주의] 문자내용을 붙여넣기 하는 경우 실제 발송된 문자에 물음표(?)가 추가될 수 있으니 반드시 확인하신 후 발송하시기 바랍니다.`}
                  rows={16}
                  style={{
                    border: "none",
                    borderRadius: 0,
                    resize: "none",
                    padding: "0 1.6rem",
                  }}
                  value={messageInput}
                  onChange={(e) => {
                    if (messageType === "ad") {
                      if (e.target.value.length >= 1000 - messageTypeAddBytes) {
                        if (
                          getByteLength(e.target.value) >
                          2000 - messageTypeAddBytes
                        ) {
                          let newStr = "";
                          let i = 0;
                          while (
                            getByteLength(newStr + e.target.value[i]) <=
                            2000 - messageTypeAddBytes
                          ) {
                            newStr += e.target.value[i];
                            i += 1;
                          }
                          setMessageInput(newStr);
                          return;
                        }
                      }

                      setMessageInput(e.target.value);
                    } else {
                      if (e.target.value.length >= 1000) {
                        if (getByteLength(e.target.value) > 2000) {
                          let newStr = "";
                          let i = 0;
                          while (
                            getByteLength(newStr + e.target.value[i]) <= 2000
                          ) {
                            newStr += e.target.value[i];
                            i += 1;
                          }
                          setMessageInput(newStr);
                          return;
                        }
                      }

                      setMessageInput(e.target.value);
                    }
                  }}
                />
                {adMessageInfo && (
                  <Typography style={{ padding: "1.6rem" }}>
                    {adMessageInfo.telInfo}
                  </Typography>
                )}
              </TextAreaWrapper>
              <BtnWrapper>
                <BtnGroupWrapepr>
                  <RowWrapper
                    styles={css`
                      position: relative;
                    `}
                  >
                    <BasicButton
                      focused
                      mode={"vertical"}
                      styles={css`
                        height: 12rem;
                      `}
                      onClick={() => setIsLoadBox((prev) => !prev)}
                    >
                      {isLoadBox ? "닫기" : `>불러오기`}
                    </BasicButton>
                    {isLoadBox && (
                      <MessageLoadBox
                        setIsLoadBox={setIsLoadBox}
                        setMessageInput={setMessageInput}
                        templates={templates}
                        setFiles={setFiles}
                      />
                    )}
                  </RowWrapper>
                  <BasicButton mode={"vertical"} onClick={onClickSave}>
                    저장
                  </BasicButton>
                </BtnGroupWrapepr>
                <BtnGroupWrapepr>
                  <BasicButton
                    mode={"vertical"}
                    onClick={onClickUploadBtn}
                    disabled={stateFiles.length === 3}
                  >
                    이미지첨부
                    <input
                      hidden
                      type="file"
                      accept="image/*"
                      ref={photoRef}
                      onChange={onClickUpload}
                      multiple
                      max={3}
                    />
                  </BasicButton>
                  <BasicButton
                    mode={"vertical"}
                    onClick={() => setUploadInfoModal(true)}
                  >
                    <ExclamationCircleOutlined />
                  </BasicButton>
                </BtnGroupWrapepr>
              </BtnWrapper>
            </RowWrapper>
            {stateFiles.length !== 0 && (
              <RowWrapper
                styles={css`
                  flex-wrap: wrap;
                  gap: 0.4rem;
                `}
              >
                {stateFiles.map((item, index) => {
                  let filename = "";
                  if (item.file) {
                    filename = filenameEllipsis(item.file.name);
                  } else {
                    const url = new URL(item.url);
                    const path = url.pathname
                      .split("/")
                      .filter((p) => p !== "");
                    filename = filenameEllipsis(path[path.length - 1]);
                  }
                  return (
                    <BasicTag
                      key={index}
                      closable
                      onClose={() => onClickRemoveBtn(item.url)}
                      styles={css`
                        width: fit-content;
                        max-width: 90%;
                        margin: 0;
                      `}
                    >
                      <TextAtom
                        styles={css`
                          text-overflow: ellipsis;
                          white-space: nowrap;
                          overflow: hidden;
                        `}
                        fontSize={"1.4rem"}
                      >
                        {filename}
                      </TextAtom>
                    </BasicTag>
                  );
                })}
              </RowWrapper>
            )}
          </LeftSection>
          <RightSection>
            <DeviceTextarea
              value={
                adMessageInfo
                  ? adMessageInfo.initialText +
                    "\n\n" +
                    messageInput +
                    "\n\n" +
                    adMessageInfo.telInfo
                  : messageInput
              }
              files={stateFiles}
              messageByte={messageByte}
              setFiles={setFiles}
              titleValue={messageTitleInput}
              messageType={messageType}
              messageTypeAddBytes={messageTypeAddBytes}
            />
            <TextAtom>
              ※ 실제 발송문자는 통신사 및 수신단말기별 차이가 있습니다.
            </TextAtom>
          </RightSection>
        </Section>
      )}
      <AdMessageInfoModal
        open={adMessageInfoModal}
        onCancel={() => setAdMessageInfoModal(false)}
      />
      <UploadInfoModal
        open={uploadInfoModal}
        onCancel={() => setUploadInfoModal(false)}
      />
    </>
  );
};

export default WriteSection;
