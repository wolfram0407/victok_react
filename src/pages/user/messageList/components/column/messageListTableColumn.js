import { FileTextOutlined } from "@ant-design/icons";
import { css } from "styled-components";
import BasicButton from "../../../../../components/atom/BasicButton";
import { color } from "../../../../../styles/theme";
import { numberToLocaleString } from "../../../../../utils/utils";

const renderTextFormatter = (str, unit) => {
  return str + " " + unit;
};

const messageTypeConvert = (type) => {
  switch (type) {
    case "SMS":
      return "단문";
    case "LMS":
      return "장문";
    case "MMS":
      return "포토";
    default:
      return "";
  }
};

const messageListTableColumn = ({
  onClickShowMore,
  onClickDetail,
  noStoreName: noStoreNameProp,
  isAdmin,
}) => {
  const noStoreName = Boolean(noStoreNameProp);

  const defaultList = [
    {
      title: "전송 일시",
      dataIndex: "created_time",
      sorter: (a, b) => new Date(b) - new Date(a),
      sortDirection: ["ascend", "descend"],
    },
    {
      title: "전송 유형",
      dataIndex: "is_ad",
      render: (value) => (value === 1 ? "광고" : "단순 알림"),
      sorter: (a, b) => b - a,
      sortDirection: ["ascend", "descend"],
    },
    {
      title: "전송 시점",
      dataIndex: "is_reserve",
      render: (value) => (value === 1 ? "예약" : "즉시"),
      sorter: (a, b) => a < b,
      sortDirection: ["ascend", "descend"],
    },
    {
      title: "메시지 타입",
      dataIndex: "type",
      sorter: (a, b) => {
        return b - a;
      },
      render: (value) => messageTypeConvert(value),
      sortDirection: ["ascend", "descend"],
    },
    {
      title: "전송 건 수",
      dataIndex: "cnt",
      render: (value) => renderTextFormatter(value, "건"),
    },
    {
      title: "전송 내용",
      dataIndex: "msg",
      render: (value, row) => {
        const maxLength = 20;
        return (
          <div style={{ display: "flex", alignItems: "center", gap: "1.4rem" }}>
            <div
              style={{
                width: 220,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                wordBreak: "keep-all",
              }}
            >
              {value}
            </div>
            {(value.length > maxLength || row.type === "MMS") && (
              <BasicButton
                styles={css`
                  border-radius: 1.8rem;
                `}
                onClick={() =>
                  onClickShowMore(value, row.type, row.img_cnt, row.title)
                }
              >
                더보기
              </BasicButton>
            )}
          </div>
        );
      },
    },
    {
      title: "성공 건 수",
      dataIndex: "success_cnt",

      render: (value) => (
        <span>
          <span style={{ color: isAdmin ? color.gold : color.black }}>
            {numberToLocaleString(value)}
          </span>{" "}
          건
        </span>
      ),
    },
    {
      title: "사용 금액",
      dataIndex: "charge",
      render: (value) => (
        <span style={{ wordBreak: "keep-all", whiteSpace: "nowrap" }}>
          {renderTextFormatter(value, "원")}
        </span>
      ),
    },
    {
      title: "상세",
      dataIndex: "idx",
      render: (value, row) => (
        <FileTextOutlined
          style={{ fontSize: 20 }}
          onClick={() => onClickDetail(value, row.user_idx)}
        />
      ),
    },
  ];
  let resultList = defaultList;
  if (isAdmin && !noStoreName) {
    resultList = [
      {
        title: "시설명",
        dataIndex: "store_name",
      },
      ...defaultList,
    ];
  }
  return resultList;
};

export default messageListTableColumn;
