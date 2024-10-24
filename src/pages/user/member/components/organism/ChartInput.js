import { Input } from "antd";
import { useAppContext } from "../../../../../utils/context";

function ChartInput({ name, value, onChange, style, maxLength }) {
  const { isAdmin } = useAppContext();
  return (
    <Input
      name={name}
      value={value}
      onChange={onChange}
      style={style}
      maxLength={maxLength}
      disabled={isAdmin}
    />
  );
}

export default ChartInput;
