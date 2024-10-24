import { LoadingOutlined } from "@ant-design/icons";
import { DatePicker, Form, Input, Modal } from "antd";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { useMutation } from "react-query";
import { css } from "styled-components";
import { queryClient } from "../../../../../App";
import BasicButton from "../../../../../components/atom/BasicButton";
import BasicTag from "../../../../../components/atom/BasicTag";
import TextAtom from "../../../../../components/atom/TextAtom";
import { color } from "../../../../../styles/theme";
import { API } from "../../../../../utils/api";
import {
  actionImgCompress,
  download,
  encodeFileName,
  numberHyphenDivider,
} from "../../../../../utils/utils";
import RowWrapper from "./../../../../../components/atom/RowWrapper";

const BusinessInfoSection = ({ businessInfo, user_idx }) => {
  const [compressLoading, setCompressLoading] = useState(false);
  const [stateFiles, setStateFiles] = useState([]);
  const [period, setPeriod] = useState({
    start: null,
    end: null,
  });

  const [form] = Form.useForm();
  const fileRef = useRef();
  // const companyNameValue = Form.useWatch("company_name", form);

  const onClickUploadBtn = () => {
    fileRef.current.click();
  };

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
    setCompressLoading(true);
    const imagesLength = stateFiles.length;
    let limit = 3;
    if (imagesLength !== 0) {
      limit = 3 - imagesLength;
    }
    if (files) {
      if (files.length > limit) {
        alert("자료는 최대 3개까지 등록가능합니다.");
        // return;
      }
      let loopLimit = files.length > limit ? limit : files.length;
      Promise.all(
        Object.values(files)
          .slice(0, loopLimit)
          .map(async (file) => {
            if (file.type === "application/pdf") {
              return setImageFromFile({
                file,
                setImageUrl: ({ result }) =>
                  setStateFiles((prev) => [
                    ...prev,
                    {
                      file: encodeFileName(file),
                      url: result,
                    },
                  ]),
              });
            } else {
              const compressedFile = await actionImgCompress(file);
              return setImageFromFile({
                file: compressedFile,
                setImageUrl: ({ result }) =>
                  setStateFiles((prev) => [
                    ...prev,
                    {
                      file: encodeFileName(compressedFile),
                      url: result,
                    },
                  ]),
              });
            }
          })
      ).then(() => {
        setCompressLoading(false);
      });
    }
    e.target.value = "";
  };

  const onClickRemoveBtn = (index) => {
    setStateFiles((prev) => [
      ...prev.slice(0, index),
      ...prev.slice(index + 1),
    ]);
    Modal.success({
      title: "삭제 완료",
      content: "사업자등록증이 삭제되었습니다.",
      okText: "확인",
    });
  };

  const updateBusinessInfoMutation = useMutation(
    (data) =>
      API.put("/admin/business-info", data, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    {
      onSuccess: () => {
        Modal.success({
          title: "사업자 정보 수정 완료!",
          content: "사업자 정보가 수정되었습니다.",
          okText: "확인",
        });
        queryClient.fetchQuery("adminBusinessInfo");
      },
    }
  );

  const onUpdate = (values) => {
    if (!values) return;
    const { company_name, ceo_name, business_number, ceo_phone } = values;
    const removeHyphen = (str) => str.replaceAll("-", "");
    const infoFormData = {
      company_name,
      ceo_name,
      business_number:
        business_number?.length > 0 ? removeHyphen(business_number) : "",
      ceo_phone: ceo_phone?.length > 0 ? removeHyphen(ceo_phone) : "",
      images: stateFiles.map((image) => (image.file ? image.file : image.url)),
      user_idx,
    };
    const paymentFormData = {
      start_date: period.start
        ? dayjs(period.start).format("YYYY-MM-DD")
        : null,
      end_date: period.end ? dayjs(period.end).format("YYYY-MM-DD") : null,
    };
    const formData = {
      ...infoFormData,
      ...paymentFormData,
    };

    const prevInfo = {
      ...businessInfo.info,
      registration_images: businessInfo.info.registration_images
        ? JSON.parse(businessInfo.info.registration_images).join(",")
        : [],
      user_idx: businessInfo.info.user_idx
        ? businessInfo.info.user_idx.toString()
        : "",
    };
    const prevPayment = {
      start_date: businessInfo.payment.start_date
        ? dayjs(businessInfo.payment.start_date).format("YYYY-MM-DD")
        : null,
      end_date: businessInfo.payment.end_date
        ? dayjs(businessInfo.payment.end_date).format("YYYY-MM-DD")
        : null,
    };

    if (
      Object.values({
        ...infoFormData,
        images: infoFormData.images.join(","),
      }).filter((data) => !Object.values(prevInfo).includes(data)).length ===
        0 &&
      Object.values(paymentFormData).filter(
        (data) => !Object.values(prevPayment).includes(data)
      ).length === 0
    )
      return;

    const form = new FormData();

    for (let key in formData) {
      if (key === "images") {
        formData[key].forEach((image) => form.append(key, image));
      }
      form.append(key, formData[key]);
    }

    updateBusinessInfoMutation.mutate(form);
  };

  const onClickTag = ({ file, url }) => {
    // const uploadUrl = "http://victok2023.cafe24.com/uploads/";
    const uploadUrl = "https://victok.co.kr/uploads/";
    download({ file, url: file ? url : uploadUrl + encodeURI(url) });
  };

  useEffect(() => {
    if (businessInfo.info.company_name) {
      const {
        company_name,
        ceo_name,
        business_number,
        ceo_phone,
        registration_images,
      } = businessInfo.info;
      form.setFieldsValue({
        company_name,
        ceo_name,
        business_number: numberHyphenDivider(business_number, 4, 6),
        ceo_phone: numberHyphenDivider(ceo_phone, 4, 8),
      });
      if (registration_images) {
        setStateFiles(
          JSON.parse(registration_images).map((image) => ({ url: image }))
        );
      }
    }
    if (businessInfo.payment) {
      const { start_date, end_date } = businessInfo.payment;
      setPeriod((prev) => ({
        ...prev,
        start: start_date ? dayjs(start_date) : null,
        end: end_date ? dayjs(end_date) : null,
      }));
    }
    // eslint-disable-next-line
  }, [businessInfo]);

  return (
    <>
      <TextAtom fontSize={"2rem"} fontWeight={600} marginBottom="2.4rem">
        사업자 정보
      </TextAtom>
      <Form
        form={form}
        layout="vertical"
        name="businessInfo"
        style={{ width: "45rem" }}
        onFinish={onUpdate}
      >
        <Form.Item name="company_name" label="상호">
          <Input placeholder="사업자등록증 내 상호명을 입력해 주세요." />
        </Form.Item>
        <Form.Item
          name="ceo_name"
          label="대표자 이름"
          // rules={[
          //   {
          //     required: Boolean(companyNameValue),
          //     message: "대표자 이름을 입력해주세요.",
          //   },
          // ]}
        >
          <Input placeholder="사업자등록증 내 대표자 이름을 입력해 주세요." />
        </Form.Item>
        <Form.Item
          name="business_number"
          label="사업자등록번호"
          // rules={[
          //   {
          //     required: Boolean(companyNameValue),
          //     message: "사업자등록번호를 입력해주세요.",
          //   },
          // ]}
        >
          <Input
            placeholder="사업자등록증 내 사업자등록번호를 입력해 주세요."
            onChange={(e) => {
              e.target.value = e.target.value.replace(/[^0-9]/g, "");
              return form.setFieldValue(
                "business_number",
                numberHyphenDivider(e.target.value, 4, 6)
              );
            }}
          />
        </Form.Item>
        <Form.Item
          name="ceo_phone"
          label="대표자 연락처"
          // rules={[
          //   {
          //     required: Boolean(companyNameValue),
          //     message: "대표자 연락처를 입력해주세요.",
          //   },
          // ]}
        >
          <Input
            placeholder="대표자의 개인 연락처를 입력해 주세요."
            onChange={(e) => {
              e.target.value = e.target.value.replace(/[^0-9]/g, "");
              return form.setFieldValue(
                "ceo_phone",
                numberHyphenDivider(e.target.value, 4, 8)
              );
            }}
            maxLength={13}
          />
        </Form.Item>
        <TextAtom fontSize={"1.4rem"} marginBottom="0.8rem">
          사업자등록증
        </TextAtom>
        <RowWrapper
          styles={css`
            flex-wrap: wrap;
            gap: 0.6rem;
            margin-bottom: 3rem;
          `}
        >
          <BasicButton
            onClick={onClickUploadBtn}
            marginright="1.4rem"
            disabled={stateFiles.length >= 3}
          >
            {compressLoading ? (
              <LoadingOutlined style={{ fontSize: 20 }} />
            ) : (
              "업로드"
            )}
            <input
              type="file"
              accept=".jpg, .jpeg, .png, .pdf"
              ref={fileRef}
              onChange={onClickUpload}
              multiple
              max={3}
              style={{ display: "none" }}
            />
          </BasicButton>
          {stateFiles.length !== 0 &&
            stateFiles.map((item, index) => (
              <BasicTag
                key={index}
                closable
                onClose={() => onClickRemoveBtn(index)}
                styles={css`
                  width: fit-content;
                  margin: 0;
                  background-color: ${color.grey};
                  border: none;
                `}
                onClick={() => onClickTag({ file: item.file, url: item.url })}
              >
                {item.file ? decodeURI(item.file.name) : decodeURI(item.url)}
              </BasicTag>
            ))}
        </RowWrapper>
        <TextAtom fontSize={"2rem"} fontWeight={600} marginBottom="2rem">
          계약 정보
        </TextAtom>
        <RowWrapper marginBottom={"3.4rem"}>
          <TextAtom fontSize={"1.4rem"} fontWeight={500} marginRight="1rem">
            계약 기간
          </TextAtom>
          <DatePicker
            style={{ width: "14rem" }}
            format={"YYYY-MM-DD"}
            onChange={(e) => setPeriod({ start: e })}
            value={period.start}
            disabled
          />
          <TextAtom
            fontSize={"1.4rem"}
            fontWeight={600}
            marginLeft="0.6rem"
            marginRight="0.6rem"
          >
            ~
          </TextAtom>
          <DatePicker
            style={{ width: "14rem", marginRight: "0.6rem" }}
            format={"YYYY-MM-DD"}
            onChange={(e) => setPeriod({ end: e })}
            value={period.end}
            disabled
            // disabled={period.start ? false : true}
          />
        </RowWrapper>
        <Form.Item noStyle>
          <BasicButton
            focused
            styles={css`
              width: 100%;
              height: 4rem;
            `}
            htmlType="submit"
          >
            저장
          </BasicButton>
        </Form.Item>
      </Form>
    </>
  );
};

export default BusinessInfoSection;
