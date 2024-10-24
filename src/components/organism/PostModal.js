import { Modal } from "antd";
import React from "react";
import DaumPostcode from "react-daum-postcode";

function PostModal({ visible, setVisible, setAddress }) {
  const onCancel = () => {
    setVisible(false);
  };

  const onComplete = (data) => {
    setVisible(false);
    setAddress(data);
  };

  return (
    <Modal
      open={visible}
      title={`우편번호 검색`}
      onCancel={onCancel}
      footer={[]}
      maskClosable={false}
    >
      <DaumPostcode
        style={{ flex: 1 }}
        onComplete={onComplete}
        autoClose={false}
        defaultQuery=""
      />
    </Modal>
  );
}

export default PostModal;
