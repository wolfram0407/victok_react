import { Select } from "antd";

const { Option } = Select;

const SelectList = ({
  onChange,
  width,
  marginRight,
  optionList,
  placeholder,
  value,
}) => {
  return (
    <Select
      placeholder={placeholder}
      onChange={(e) => onChange(e)}
      style={{
        width: width ? width : "12rem",
        marginRight: marginRight ? marginRight : "1rem",
      }}
    >
      {optionList.map((item) => (
        <Option key={item.id} value={item.value}>
          {item.name}
        </Option>
      ))}
    </Select>
  );
};

export default SelectList;
