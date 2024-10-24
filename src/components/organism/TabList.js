import { Radio } from "antd";
import { color } from "../../styles/theme";

const TabList = ({
  list,
  onChange,
  currentTab,
  borderRadius,
  marginBottom,
  gap,
}) => {
  return (
    <Radio.Group
      name="tab"
      onChange={(e) => onChange(e.target.value)}
      value={currentTab}
      style={{
        display: "flex",
        marginBottom: marginBottom ? marginBottom : "3rem",
        gap: gap ? gap : 0,
      }}
    >
      {list.map((item) => (
        <Radio.Button
          key={item.id}
          value={item.value}
          style={{
            border: `0.1rem solid ${color.border}`,
            borderRadius: borderRadius ? borderRadius : 0,
            borderColor:
              currentTab === item.value ? color.mainBlue : color.border,
            color: currentTab === item.value ? color.white : color.black,
            backgroundColor:
              currentTab === item.value ? color.mainBlue : "transparent",
            textAlign: "center",
          }}
        >
          {item.name}
        </Radio.Button>
      ))}
    </Radio.Group>
  );
};

export default TabList;
