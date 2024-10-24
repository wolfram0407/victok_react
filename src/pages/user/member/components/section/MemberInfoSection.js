import { InfoCircleFilled, InfoCircleOutlined } from "@ant-design/icons";
import { AutoComplete, Button, Checkbox, Form, Input } from "antd";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import { css } from "styled-components";
import BasicButton from "../../../../../components/atom/BasicButton";
import BasicTag from "../../../../../components/atom/BasicTag";
import RowWrapper from "../../../../../components/atom/RowWrapper";
import TextAtom from "../../../../../components/atom/TextAtom";
import { color } from "../../../../../styles/theme";
import { API } from "../../../../../utils/api";
import InfoBox from "../atom/InfoBox";
import TagImage from "../atom/TagImage";

const { TextArea } = Input;

const MemberInfoSection = ({
  structure,
  form,
  onClickDoneBtn,
  initialTags,
  isAdmin,
  user_idx,
}) => {
  const tags = Form.useWatch("tags", form);
  const gender = Form.useWatch("gender", form);
  const agree_marketing = Form.useWatch("agree_marketing", form);
  const location = useLocation();
  const isEdit = location.pathname.includes("detail") ? true : false;
  const [isInfoBox, setIsInfoBox] = useState(false);
  const [messageTagText, setMessageTagText] = useState("");
  const [isMessageTagTextError, setIsMessageTagTextError] = useState(false);
  const [checkTag, setCheckTag] = useState(false);
  const [autoCompleteOptions, setAutoCompleteOptions] = useState([]);
  const [allDefaultTags, setAllDefaultTags] = useState([]);
  const [allCustomTags, setAllCustomTags] = useState([]);
  const queryKey = isAdmin ? ["messageTags", user_idx] : "messageTags";
  const { isLoading: tagsLoading } = useQuery(
    queryKey,
    async () => {
      if (isAdmin) {
        if (!user_idx) return;
        return await API.get("/tag/tag-type-all", {
          params: { user_idx },
        }).then((res) => res.data);
      } else {
      }
    },
    {
      onSuccess: (data) => {
        if (!data) return;
        const _allDefaultTags = data
          .find((group) => group.name === "기본")
          .tags.map((tag) => ({
            ...tag,
            key: tag.idx,
            value: tag.name,
            is_default: 1,
          }));
        let _allCustomTags = [];
        data
          .filter((group) => group.name !== "기본")
          .forEach((group) => {
            group.tags.forEach((tag) =>
              _allCustomTags.push({
                ...tag,
                key: tag.idx,
                value: tag.name,
                is_default: 0,
              })
            );
          });
        setAllDefaultTags(_allDefaultTags);
        setAllCustomTags(_allCustomTags);
      },
    }
  );

  useQuery(
    ["messageTagCheck", checkTag, messageTagText],
    async () => {
      if (!checkTag || !messageTagText) return;
      return await API.get("/tag/tag", {
        params: { name: messageTagText, ...(isAdmin && { user_idx }) },
      }).then((res) => {
        return res.data;
      });
    },
    {
      onSuccess: (data) => {
        if (!checkTag || !messageTagText) return;
        if (!data) return;
        setMessageTagText("");
        if (tags.findIndex((tag) => tag.name === data.name) === -1) {
          form.setFieldValue("tags", [...tags, data]);
        }
      },
      onError: () => setIsMessageTagTextError(true),
      onSettled: () => setCheckTag(false),
      retry: false,
    }
  );

  const onAddMessageTag = (text) => {
    if (text === "") {
      return;
    }
    setCheckTag(true);
  };

  const onDeleteMessageTag = ({ item: selectedTag }) => {
    form.setFieldValue(
      "tags",
      tags.filter((tag) => tag.name !== selectedTag.name)
    );
  };

  // 성별 선택시 태그 자동 생성
  const onChangeGender = (e) => {
    const genderValue = e.target.value === "M" ? "남성" : "여성";
    const tagFormatter = () => {
      const genderTag = allDefaultTags.find((tag) => tag.name === genderValue);
      if (genderTag) {
        return genderTag;
      } else {
        return {
          name: genderValue,
          key: "gender_default",
          is_default: 1,
        };
      }
    };
    const target = tags.find(
      (tag) =>
        tag.name === "남성" ||
        tag.name === "여성" ||
        tag.name === "M" ||
        tag.name === "F"
    );
    if (gender === e.target.value) {
      form.setFieldValue("gender", "");
      form.setFieldValue(
        "tags",
        tags.filter((tag) => tag.name !== target.name)
      );
    } else {
      form.setFieldValue("gender", e.target.value);
      if (tags) {
        const prevTags = target
          ? tags.filter((tag) => tag.name !== target.name)
          : tags;
        form.setFieldValue("tags", [...prevTags, tagFormatter()]);
      }
    }
    // eslint-disable-next-line
  };

  // 생년월일 입력시 태그 자동 생성
  const birthTagFormatter = (value, key) => {
    const existTarget = allDefaultTags.find((tag) => tag.name === value);
    if (existTarget) {
      return existTarget;
    } else {
      return {
        name: value,
        key,
        is_default: 1,
      };
    }
  };
  const onChangeBirthYear = (value) => {
    if (tags) {
      if (value) {
        const yearValue = value.length >= 4 && value.slice(0, 4);
        const yearTarget = tags.find((tag) => parseInt(tag.name))
          ? tags.find((tag) => parseInt(tag.name) > 1000)
          : null;
        if (yearValue) {
          const prevTags = yearTarget
            ? tags.filter((tag) => tag.name !== yearTarget.name)
            : tags;
          form.setFieldValue("tags", [
            ...prevTags,
            birthTagFormatter(yearValue, "birth_year_default"),
          ]);
        } else {
          form.setFieldValue(
            "tags",
            tags.filter((tag) => !(parseInt(tag.name) && tag.name.length === 4))
          );
        }
      } else {
        form.setFieldValue(
          "tags",
          tags.filter(
            (tag) => !(parseInt(tag.name) && parseInt(tag.name) > 1000)
          )
        );
      }
    }
  };
  const onChangeBirthMonth = (value) => {
    if (tags) {
      if (value) {
        const monthValue = value.length >= 6 && value.slice(4, 6);
        const monthTarget = tags.find((tag) => tag.name.endsWith("월"))
          ? tags.find((tag) => tag.name.endsWith("월") && tag.name.length < 4)
          : null;
        if (monthValue) {
          const prevTags = monthTarget
            ? tags.filter((tag) => tag.name !== monthTarget.name)
            : tags;
          form.setFieldValue("tags", [
            ...prevTags,
            birthTagFormatter(
              parseInt(monthValue) + "월",
              "birth_month_default"
            ),
          ]);
        } else {
          form.setFieldValue(
            "tags",
            tags.filter(
              (tag) => !(tag.name.endsWith("월") && tag.name.length < 4)
            )
          );
        }
      } else {
        form.setFieldValue(
          "tags",
          tags.filter(
            (tag) => !(parseInt(tag.name) && parseInt(tag.name) > 1000)
          )
        );
      }
    }
  };

  // 최초 로드시에만 실행
  useEffect(() => {
    if (initialTags) {
      if (initialTags.length > 0) {
        form.setFieldValue("tags", initialTags);
      }
    } else {
      if (!tagsLoading) {
        const formattedTag = (name, newKey) => {
          const existTag = allDefaultTags.find((tag) => tag.name === name);
          return existTag
            ? {
                ...existTag,
                key: existTag.idx,
              }
            : {
                name: name,
                key: newKey,
                is_default: true,
              };
        };
        if (!isEdit) {
          form.setFieldValue("tags", [
            formattedTag("라카미이용", "lockerNoUse"),
            formattedTag("지공차트미이용", "chartNoUse"),
          ]);
        }
      }
    }
    // eslint-disable-next-line
  }, [initialTags, tagsLoading]);

  return (
    <Form
      form={form}
      layout="vertical"
      name="addUser"
      style={{ width: structure === "modal" ? "100%" : "52rem" }}
      onFinish={onClickDoneBtn}
    >
      <RowWrapper
        styles={css`
          justify-content: space-between;
        `}
      >
        <Form.Item
          name="name"
          label="회원 이름"
          rules={[
            {
              required: true,
              message: "이름을 입력해 주세요.",
            },
          ]}
          style={{ width: "70%" }}
        >
          <Input placeholder="이름을 입력해 주세요." />
        </Form.Item>
        <Form.Item name="gender" label="성별" style={{ width: "28%" }}>
          <RowWrapper>
            <Button
              onClick={() => {
                const e = { target: { value: "M" } };
                onChangeGender(e);
                // if (gender !== "M") {
                //   form.setFieldValue("gender", "M");
                // } else {
                //   form.setFieldValue("gender", "");
                // }
              }}
              style={{
                borderRadius: 0,
                borderColor: gender === "M" ? color.mainBlue : color.border,
                color: gender === "M" ? color.white : color.border,
                backgroundColor:
                  gender === "M" ? color.mainBlue : "transparent",
                width: "50%",
                textAlign: "center",
              }}
            >
              남
            </Button>
            <Button
              onClick={() => {
                const e = { target: { value: "F" } };
                onChangeGender(e);
                // if (gender !== "F") {
                //   form.setFieldValue("gender", "F");
                // } else {
                //   form.setFieldValue("gender", "");
                // }
              }}
              style={{
                borderRadius: 0,
                borderColor: gender === "F" ? color.mainBlue : color.border,
                color: gender === "F" ? color.white : color.border,
                backgroundColor:
                  gender === "F" ? color.mainBlue : "transparent",
                width: "50%",
                textAlign: "center",
              }}
            >
              여
            </Button>
          </RowWrapper>
          {/* <Radio.Group
            name="gender"
            style={{ width: "100%" }}
            onChange={(e) => onChangeGender(e)}
          >
            <Radio.Button
              value={"M"}
              style={{
                borderRadius: 0,
                borderColor: gender === "M" ? color.mainBlue : color.border,
                color: gender === "M" ? color.white : color.border,
                backgroundColor:
                  gender === "M" ? color.mainBlue : "transparent",
                width: "50%",
                textAlign: "center",
              }}
            >
              남
            </Radio.Button>
            <Radio.Button
              value={"F"}
              style={{
                borderRadius: 0,
                borderColor: gender === "F" ? color.mainBlue : color.border,
                color: gender === "F" ? color.white : color.border,
                backgroundColor:
                  gender === "F" ? color.mainBlue : "transparent",
                width: "50%",
                textAlign: "center",
              }}
            >
              여
            </Radio.Button>
          </Radio.Group> */}
        </Form.Item>
      </RowWrapper>
      <RowWrapper
        styles={css`
          justify-content: space-between;
        `}
      >
        <Form.Item
          name="hp"
          label="휴대폰 번호"
          rules={[
            {
              required: true,
              message: "휴대폰 번호를 입력해 주세요.",
              pattern: /[0-9]/g,
            },
            { max: 11 },
          ]}
          style={{ width: "70%" }}
        >
          <Input
            placeholder="휴대폰 번호를 입력해 주세요."
            maxLength={11}
            onChange={(e) => {
              e.target.value = e.target.value.replace(/[^0-9]/g, "");
              return form.setFieldValue("hp", e.target.value);
            }}
          />
        </Form.Item>
        <Form.Item
          name="birth"
          rules={[{ min: 8, max: 8, message: "8자로 입력해주세요." }]}
          label="생년월일"
          style={{ width: "28%" }}
        >
          <Input
            maxLength={8}
            placeholder="ex) 19950825"
            minLength={8}
            onChange={(e) => {
              e.target.value = e.target.value.replace(/[^0-9]/g, "");
              onChangeBirthMonth(e.target.value);
              return form.setFieldValue("birth", e.target.value);
            }}
            onKeyUp={(e) => {
              onChangeBirthYear(e.target.value);
            }}
          />
        </Form.Item>
      </RowWrapper>
      <RowWrapper
        styles={css`
          width: 100%;
          justify-content: space-between;
          position: relative;
        `}
        marginBottom="0.8rem"
      >
        <RowWrapper>
          <TextAtom fontSize={"1.4rem"} marginRight="0.6rem">
            메시지 태그
          </TextAtom>
          <TagImage />
        </RowWrapper>
        {isInfoBox ? (
          <InfoCircleFilled
            style={{ position: "absolute", right: 0, cursor: "pointer" }}
            onClick={() => setIsInfoBox((prev) => !prev)}
          />
        ) : (
          <InfoCircleOutlined
            style={{ position: "absolute", right: 0, cursor: "pointer" }}
            onClick={() => setIsInfoBox((prev) => !prev)}
          />
        )}
        {isInfoBox && <InfoBox />}
      </RowWrapper>
      <Form.Item
        name="tags"
        style={{
          position: "relative",
          marginBottom: Boolean(tags) ? "0.8rem" : "2.4rem",
        }}
      >
        <RowWrapper
          styles={css`
            width: 100%;
            flex-direction: column;
            align-items: flex-start;
          `}
        >
          <RowWrapper
            styles={css`
              width: 100%;
              justify-content: space-between;
            `}
          >
            <AutoComplete
              placeholder="원하는 태그를 입력해주세요."
              style={{ width: "85%" }}
              value={messageTagText}
              options={autoCompleteOptions}
              onSearch={(str) => {
                setAutoCompleteOptions(
                  !str
                    ? []
                    : allCustomTags.filter((tag) => tag.name.includes(str))
                );
              }}
              onChange={(str) => {
                setMessageTagText((prev) => {
                  if (str !== prev) {
                    setIsMessageTagTextError(false);
                  }
                  return str;
                });
              }}
              onSelect={(str) => setMessageTagText(str)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();

                  onAddMessageTag(messageTagText);
                }
              }}
            />
            <BasicButton
              focused
              onClick={() => onAddMessageTag(messageTagText)}
            >
              추가
            </BasicButton>
          </RowWrapper>
          {isMessageTagTextError && (
            <TextAtom color={color.red} marginTop="0.4rem" fontSize={"1.4rem"}>
              등록되지 않은 태그입니다.
              <br />
              [설정 - 태그 관리]를 통해 원하시는 태그를 등록 후 이용해주세요.
            </TextAtom>
          )}
        </RowWrapper>
      </Form.Item>
      {tags?.length > 0 && (
        <RowWrapper
          styles={css`
            flex-wrap: wrap;
            gap: 0.4rem;
          `}
          marginBottom={"2.4rem"}
        >
          {[
            ...tags.filter((item) => item.is_default === 1),
            ...tags.filter((item) => item.is_default !== 1),
          ].map(({ idx, name, is_default, key }) => (
            <BasicTag
              key={idx ? idx : key}
              closable={is_default === 0 ? true : false}
              onClick={() =>
                is_default === 0
                  ? onDeleteMessageTag({ item: { idx, name, is_default } })
                  : {}
              }
              onClose={() =>
                is_default === 0
                  ? onDeleteMessageTag({ item: { idx, name, is_default } })
                  : {}
              }
            >
              {name}
            </BasicTag>
          ))}
        </RowWrapper>
      )}

      <Form.Item name="memo" label="기타 메모">
        <TextArea
          placeholder="이용자에 개개인에 대한 자세한 내용을 자유롭게 남겨주세요😊
ex) 13일까지 볼 지공 완료해줘야 함
※ 클럽과 같은 그룹핑이 가능한 요소는 태그로 관리하면 좋습니다!"
          style={{ height: "100px" }}
        />
      </Form.Item>
      <Form.Item name="agree_marketing">
        <Checkbox
          checked={agree_marketing}
          style={{
            padding: 0,
            margin: 0,
          }}
          onChange={(e) => {
            form.setFieldValue("agree_marketing", e.target.checked);
          }}
        >
          마케팅 정보 수신
        </Checkbox>
      </Form.Item>

      <Form.Item noStyle>
        <BasicButton
          focused
          styles={css`
            width: 100%;
            height: 4rem;
          `}
          htmlType="submit"
        >
          {structure === "modal" ? "등록" : "저장"}
        </BasicButton>
      </Form.Item>
    </Form>
  );
};

export default MemberInfoSection;
