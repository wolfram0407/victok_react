import { Form } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useMutation } from "react-query";
import LoggedOutLayout from "../../../components/layouts/LoggedOutLayout";
import { API } from "../../../utils/api";
import Account from "./Account";
import Complete from "./Complete";
import StoreInfo from "./StoreInfo";
import Terms from "./Terms";
import UserInfo from "./UserInfo";

const Register = () => {
  const [step, setStep] = useState("terms");
  const [emailConfirm, setEmailConfirm] = useState("");
  const [termsForm] = Form.useForm();
  const [accountForm] = Form.useForm();
  const [infoForm] = Form.useForm();
  const [storeForm] = Form.useForm();

  const registerMutation = useMutation(
    (data) =>
      API.post("/user/account", data, {
        headers: { "content-type": "multipart/form-data" },
      }),
    {
      onSuccess: () => {
        setStep("complete");
      },
      onError: (error) => {
        if (axios.isAxiosError(error)) {
          console.error(error.response);
        }
      },
    }
  );

  const onSubmit = async () => {
    const terms = termsForm.getFieldsValue();
    const { email, password } = accountForm.getFieldsValue();
    const {
      name,
      auth: { phoneNum: phone },
    } = infoForm.getFieldsValue();
    const {
      type,
      storeName: store_name,
      address: { zip: zip_code, addr: address1, detail: address2 },
      hp: contact,
    } = storeForm.getFieldsValue();
    const formData = {
      email,
      password,
      name,
      phone,
      type,
      store_name,
      zip_code,
      address1,
      address2,
      contact,
      agree_marketing: terms.agree.includes("marketing") ? 1 : 0,
    };

    const form = new FormData();

    for (let key in formData) {
      form.append(key, formData[key]);
    }

    registerMutation.mutate(form);
  };

  useEffect(() => {
    if (step === "info") {
      setEmailConfirm(accountForm.getFieldValue("email"));
      // infoForm.setFieldsValue({ email: accountForm.getFieldValue("email") });
    }
    // eslint-disable-next-line
  }, [step]);

  return (
    <LoggedOutLayout>
      <Terms
        currentStep={step === "terms"}
        form={termsForm}
        setStep={setStep}
      />
      <Account
        currentStep={step === "account"}
        form={accountForm}
        setStep={setStep}
      />
      <UserInfo
        currentStep={step === "info"}
        form={infoForm}
        setStep={setStep}
        step={step}
        emailConfirm={emailConfirm}
      />
      <StoreInfo
        currentStep={step === "facility"}
        form={storeForm}
        onSubmit={onSubmit}
        setStep={setStep}
      />
      <Complete currentStep={step === "complete"} />
    </LoggedOutLayout>
  );
};

export default Register;
