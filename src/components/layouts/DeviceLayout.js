import styled from "styled-components";
import { color } from "../../styles/theme";

const Device = styled.div`
  width: ${(p) => (p.width ? p.width : "20rem")};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: ${(p) => (p.padding ? p.padding : "3.5rem 1.6rem 2rem 1.6rem")};
  border: 0.2rem solid ${color.border};
  border-radius: 3.5rem;
  margin-right: 2rem;
  ${(p) => p.styles}
`;

const DeviceDisplayBox = styled.div`
  width: 100%;
  height: ${(p) => (p.displayHeight ? p.displayHeight : "28rem")};
  display: flex;
  padding: 1.6rem 0.4rem;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  border: 0.2rem solid ${color.border};
  border-radius: 1rem;
  margin-bottom: 1.6rem;
  ${(p) => p.displayStyles}
`;

const DeviceBtn = styled.div`
  width: 11rem;
  height: 1.6rem;
  border: 0.2rem solid ${color.border};
  border-radius: 3.5rem;
  box-shadow: 0 0.3rem 0.5rem rgba(0, 0, 0, 0.16);
`;

const DeviceLayout = ({
  children,
  width,
  padding,
  displayHeight,
  styles,
  displayStyles,
}) => {
  return (
    <Device width={width} padding={padding} styles={styles}>
      <DeviceDisplayBox
        displayHeight={displayHeight}
        displayStyles={displayStyles}
      >
        {children}
      </DeviceDisplayBox>
      <DeviceBtn />
    </Device>
  );
};

export default DeviceLayout;
