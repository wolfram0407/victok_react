import { AutoComplete, Form, Input, Select } from "antd";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { useQuery } from "react-query";
import { css } from "styled-components";
import BasicButton from "../../../../../components/atom/BasicButton";
import ModalLayout from "../../../../../components/layouts/ModalLayout";
import { API } from "../../../../../utils/api";

const { Option } = Select;
const { TextArea } = Input;

const CreateModalUserSection = ({
  form,
  page,
  onFinish,
  numberOptions,
  btnText,
  setLockerData,
  setLockerTypeQueryOn,
  setSelectedLocker,
  getMemo,
  user_idx,
  initialLockerInfo,
  lockerType,
  isEdit,
}) => {
  const timer = useRef();
  const [allNames, setAllNames] = useState([]);
  const [namesAutoOptions, setNamesAutoOptions] = useState([]);
  const [existPhoneList, setExistPhoneList] = useState([]);
  // 이용자 추가 때 회원이름 자동완성용 전체 회원 이름 & 전화번호 목록 쿼리
  const { refetch: customerNamesFetch } = useQuery(
    ["all-customer-names", initialLockerInfo],
    async () => {
      if (!initialLockerInfo) return;
      return await API.get("/customer/customer-names", {
        params: { user_idx },
      }).then((res) => res.data);
    },
    {
      onSuccess: (data) => {
        if (!data) return;
        setAllNames(
          data.map((item, index) => ({
            ...item,
            value: item.name,
            label: item.name + " | " + item.phone,
            key: item.name + index,
          }))
        );
        setNamesAutoOptions(
          data.map((item, index) => ({
            ...item,
            value: item.name,
            label: item.name + " | " + item.phone,
            key: item.name + index,
          }))
        );
        setExistPhoneList(data.map((item) => item.phone));
      },
      enabled: false,
    }
  );

  const onValuesChange = (value) => {
    const values = form.getFieldsValue();
    if ("locker_type" in value) {
      setLockerData((prev) => ({
        ...prev,
        selectedType: false,
      }));
      setSelectedLocker(value.locker_type);
      setLockerTypeQueryOn(true);
    }
    if ("hp" in value) {
      form.setFieldsValue({ hp: value.hp.replace(/[^0-9]/g, "") });
      const hp = values.hp;
      const name = values.name;
      if (hp && name) {
        if (timer.current) {
          clearTimeout(timer.current);
        }
        timer.current = setTimeout(() => {
          getMemo(name, hp, user_idx);
        }, 300);
      }
    }
    if ("name" in value) {
      const hp = values.hp;
      const name = values.name;
      if (hp && name) {
        if (timer.current) {
          clearTimeout(timer.current);
        }
        timer.current = setTimeout(() => {
          getMemo(name, hp, user_idx);
        }, 300);
      }
    }
  };

  useEffect(() => {
    if (initialLockerInfo && !initialLockerInfo.idx) {
      customerNamesFetch();
    }
    // eslint-disable-next-line
  }, [initialLockerInfo]);

  useEffect(() => {
    if (initialLockerInfo && initialLockerInfo.locker_type) {
      setLockerTypeQueryOn(true);
    }
    // eslint-disable-next-line
  }, [initialLockerInfo]);

  return (
    <ModalLayout focused={page === 1}>
      <Form
        form={form}
        layout="vertical"
        name="addUser"
        onFinish={onFinish}
        onValuesChange={onValuesChange}
        style={{ width: "100%" }}
      >
        <Form.Item
          name="locker_type"
          label="라카 구분"
          rules={[
            {
              required: true,
              message: "라카 구분을 선택해 주세요.",
            },
          ]}
        >
          <Select
            placeholder="라카 구분을 선택해 주세요."
            onChange={(e) => {
              if (initialLockerInfo.idx) {
                const prevValue = lockerType.find(
                  (item) => item.locker_type === initialLockerInfo.locker_type
                ).idx;
                if (e !== prevValue) {
                  form.setFieldValue({
                    locker_type: e,
                    locker_number: numberOptions[0],
                  });
                }
              } else {
                form.setFieldValue({ locker_type: e });
              }
            }}
          >
            {lockerType.map((item) => (
              <Option key={`locker_type_${item.idx}`} value={item.idx}>
                {item.locker_type}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="locker_number"
          label="라카 번호"
          rules={[
            {
              required: true,
              message: "라카 번호를 선택해 주세요.",
            },
          ]}
        >
          <Select
            placeholder="라카 번호를 선택해 주세요."
            disabled={!Form.useWatch("locker_type", form)}
          >
            {numberOptions?.map((item) => (
              <Option key={item} value={item}>
                {item}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="name"
          label="회원 이름"
          rules={[
            {
              required: true,
              message: "이름을 입력해 주세요.",
            },
          ]}
        >
          {/* 요기 */}
          <AutoComplete
            placeholder="이름을 입력해 주세요."
            options={namesAutoOptions}
            onSearch={(str) =>
              setNamesAutoOptions(
                !str
                  ? allNames
                    ? allNames
                    : []
                  : allNames.filter((item) => item.value.includes(str))
              )
            }
            onChange={(str) => {
              if (allNames.find((item) => item.name === str)) {
                if (allNames.find((item) => item.name === str).phone) {
                  form.setFieldsValue({
                    name: str,
                    hp: allNames.find((item) => item.name === str).phone,
                  });
                  if (timer.current) {
                    clearTimeout(timer.current);
                  }
                  timer.current = setTimeout(() => {
                    getMemo(
                      str,
                      allNames.find((item) => item.name === str).phone,
                      user_idx
                    );
                  }, 300);
                }
              } else {
                form.setFieldValue("name", str);
              }
            }}
            onSelect={(str) => {
              if (allNames.find((item) => item.name === str)) {
                if (allNames.find((item) => item.name === str).phone) {
                  form.setFieldsValue({
                    name: str,
                    hp: allNames.find((item) => item.name === str).phone,
                  });
                }
              } else {
                form.setFieldValue("name", str);
              }
            }}
            disabled={isEdit}
          />
        </Form.Item>
        <Form.Item
          name="hp"
          label="휴대폰 번호"
          rules={[
            {
              required: true,
              message: "휴대폰 번호를 입력해 주세요.",
            },
            () => ({
              validator: (_, v) => {
                if (!existPhoneList) return Promise.resolve();
                if (existPhoneList.findIndex((phone) => phone === v) !== -1) {
                  if (
                    namesAutoOptions.find(
                      (item) => item.name === form.getFieldValue("name")
                    ).phone === v
                  ) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("동일한 번호를 사용 중인 회원이 이미 존재합니다.")
                  );
                } else {
                  return Promise.resolve();
                }
              },
            }),
          ]}
        >
          <Input placeholder="휴대폰 번호를 입력해 주세요." disabled={isEdit} />
        </Form.Item>
        <Form.Item name="memo" label="기타 메모">
          <TextArea
            placeholder={`이용자 개개인에 대한 자세한 내용을 자유롭게 남겨주세요😊\nex) 13일까지 볼 지공 완료해줘야 함\n※ 클럽과 같이 그룹핑이 가능한 요소는 태그로 관리하면 좋습니다!`}
            style={{ height: "160px", paddingTop: "7px" }}
          />
        </Form.Item>
        <Form.Item noStyle>
          <BasicButton
            focused
            htmlType={"submit"}
            size={"large"}
            styles={css`
              width: 100%;
              margin-top: 2rem;
            `}
          >
            {btnText}
          </BasicButton>
        </Form.Item>
      </Form>
    </ModalLayout>
  );
};

export default CreateModalUserSection;
