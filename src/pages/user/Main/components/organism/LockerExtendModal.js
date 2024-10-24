import { Modal } from "antd";

const LockerExtendModal = ({ open, onCancel }) => {
  return (
    <Modal
      open={open}
      title={"라카 이용자 기간 연장"}
      onCancel={onCancel}
      footer={[]}
      maskClosable={false}
    ></Modal>
  );
};

export default LockerExtendModal;
