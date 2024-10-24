import { LoadingOutlined } from "@ant-design/icons";
import { Checkbox, Input } from "antd";
import { useRef, useState } from "react";
import { MdOutlineCancel } from "react-icons/md";
import styled from "styled-components";
import BasicButton from "../../../../../components/atom/BasicButton";
import TextAtom from "../../../../../components/atom/TextAtom";
import { color } from "../../../../../styles/theme";
import { actionImgCompress, encodeFileName } from "../../../../../utils/utils";
import BannerSettingItemRow from "../atom/BannerSettingItemRow";

const Container = styled.div`
  width: 100%;
`;

const ImageWrapper = styled.div`
  width: fit-content;
  height: fit-content;
  position: relative;
`;

const Image = styled.img`
  width: ${(p) =>
    p.currentTab === "locker"
      ? "42rem"
      : p.currentTab === "customer"
      ? "12rem"
      : p.currentTab === "setting"
      ? "9rem"
      : "100%"};
  height: ${(p) =>
    p.currentTab === "locker"
      ? "8rem"
      : p.currentTab === "customer"
      ? "21rem"
      : p.currentTab === "setting"
      ? "33rem"
      : "100%"};
  object-fit: cover;
`;

const BannerSettingItem = ({
  title,
  currentTab,
  links,
  images,
  shows,
  onChange,
  index,
  imageSizeString,
}) => {
  const [compressLoading, setCompressLoading] = useState(false);

  const photoRef = useRef();

  const onClickUploadBtn = () => {
    photoRef.current.click();
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

    if (files) {
      Promise.all(
        Object.values(files).map(async (file) => {
          const compressedFile = await actionImgCompress(file);
          return setImageFromFile({
            file: compressedFile,
            setImageUrl: ({ result }) => {
              onChange(
                { file: encodeFileName(compressedFile), url: result },
                index,
                "image"
              );
            },
          });
        })
      ).then(() => {
        setCompressLoading(false);
        e.target.value = "";
      });
    }
  };

  const onClickDelete = (e) => {
    e.stopPropagation();
    onChange(null, index, "image");
  };

  const onChangeCheckBox = (value) => {
    if (value === shows) {
      return;
    }
    onChange(value, index, "show");
  };

  const checkBoxList = [
    { id: 1, label: "노출", checked: shows[index], value: 1 },
    { id: 2, label: "비노출", checked: !shows[index], value: 0 },
  ];

  return (
    <Container>
      <TextAtom
        fontSize={"2rem"}
        fontWeight={500}
        marginBottom="2.4rem"
        color={color.mainBlue}
      >
        {title}
      </TextAtom>
      <BannerSettingItemRow title={"연결 링크"} marginBottom={"2rem"}>
        <Input
          placeholder="배너에 연결될 링크를 입력해 주세요."
          value={links[index]}
          onChange={(e) => onChange(e.target.value, index, "link")}
          style={{ flex: 1 }}
        />
      </BannerSettingItemRow>
      <BannerSettingItemRow
        title={`이미지
${imageSizeString ?? "(1390x270)"}`}
        marginBottom={"2rem"}
        alignTop
      >
        {images[index].url ? (
          <ImageWrapper
            onClick={onClickUploadBtn}
            style={{ cursor: "pointer" }}
          >
            <Image
              key={images[index].url}
              src={images[index].url}
              alt="x"
              currentTab={currentTab}
            />
            <MdOutlineCancel
              size={"2.4rem"}
              color={color.red}
              onClick={onClickDelete}
              style={{
                position: "absolute",
                top: "0.4rem",
                right: "0.4rem",
                cursor: "pointer",
              }}
            />
          </ImageWrapper>
        ) : (
          <BasicButton onClick={onClickUploadBtn} marginright="1.4rem">
            {compressLoading ? (
              <LoadingOutlined style={{ fontSize: 20 }} />
            ) : (
              "업로드"
            )}
          </BasicButton>
        )}
        <input
          type="file"
          accept="image/*"
          ref={photoRef}
          onChange={onClickUpload}
          //   multiple
          //   max={3}
          style={{ display: "none" }}
        />
      </BannerSettingItemRow>
      <BannerSettingItemRow title={"노출 여부"}>
        {checkBoxList.map((item) => (
          <Checkbox
            key={item.id}
            checked={item.checked}
            onChange={() => onChangeCheckBox(item.value)}
          >
            {item.label}
          </Checkbox>
        ))}
      </BannerSettingItemRow>
    </Container>
  );
};

export default BannerSettingItem;
