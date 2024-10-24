import { Button } from "antd";
import dayjs from "dayjs";
import { color } from "../../../../../styles/theme";

const SettingButton = ({ children, onClick, disabled, isFree }) => {
  return (
    <Button
      type={isFree ? "text" : "default"}
      onClick={() => onClick()}
      disabled={disabled}
      style={{ color: color.black }}
    >
      {children}
    </Button>
  );
};

const holdingStatusTableColumn = ({
  onClickExtend,
  onClickUpgrade,
  onClickManage,
  admin,
}) => [
  {
    title: "NO.",
    dataIndex: "index",
    render: (_, __, index) => index + 1,
  },
  {
    title: "빅톡 이용권",
    dataIndex: "payment_name",
  },
  {
    title: "이용 기간",
    dataIndex: "start_date",
    render: (value, row) => {
      if (!row.end_date) {
        return dayjs(value).format("YYYY.MM.DD") + "~";
      }
      return (
        dayjs(value).format("YYYY.MM.DD") +
        "~" +
        dayjs(row.end_date).format("YYYY.MM.DD")
      );
    },
  },
  {
    title: "관리",
    dataIndex: "end_date",
    render: (value, row) => {
      const isExtend = Boolean(row.payment_name !== "무료");
      return admin ? (
        <SettingButton
          isFree={!isExtend}
          onClick={() => onClickManage(row)}
          disabled={!isExtend}
        >
          {isExtend ? "관리" : "-"}
        </SettingButton>
      ) : (
        <SettingButton
          onClick={() =>
            isExtend
              ? onClickExtend && onClickExtend(value)
              : onClickUpgrade && onClickUpgrade()
          }
        >
          {isExtend ? "연장" : "업그레이드"}
        </SettingButton>
      );
    },
  },
];

export default holdingStatusTableColumn;
