import { Button, Form, Typography } from "antd";
import React, { useState } from "react";
import OTPInput from "react-otp-input";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

const OtpVerification = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const email = new URLSearchParams(window.location.search).get("email");
  const [verificationStatus, setVerificationStatus] = useState("");

  const onFinish = () => {
    // 🔹 Temporary: allow any OTP
    if (otp && otp.length === 6) {
      localStorage.setItem("verifyToken", "temporary-token"); // mock token
      navigate(`/auth/shop-info?email=${encodeURIComponent(email)}`);
    } else {
      setVerificationStatus("Please enter a 6-digit OTP.");
    }
  };

  const handleResendEmail = () => {
    // 🔹 Mock resend
    setVerificationStatus(
      "A new verification code has been sent to your email. (mock)"
    );
  };

  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <h1 className="text-[25px] font-semibold mb-6">
          Enter the Verification Code For Verify Your Phone Number
        </h1>
      </div>

      <Form layout="vertical" onFinish={onFinish}>
        <div className="flex items-center justify-center mb-6">
          <OTPInput
            value={otp}
            onChange={setOtp}
            numInputs={6}
            inputStyle={{
              height: 40,
              width: 40,
              borderRadius: "8px",
              margin: "16px",
              fontSize: "20px",
              border: "1px solid #3fae6a",
              color: "#2B2A2A",
              outline: "none",
              marginBottom: 10,
            }}
            renderInput={(props) => <input {...props} />}
          />
        </div>

        {verificationStatus && (
          <div className="text-center mb-4 text-red-500">
            {verificationStatus}
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <Text>Don't receive the code?</Text>

          <p
            onClick={handleResendEmail}
            className="login-form-forgot"
            style={{ color: "#3fae6a", cursor: "pointer" }}
          >
            Resend
          </p>
        </div>

        <Form.Item style={{ marginBottom: 0 }}>
          <Button
            htmlType="submit"
            style={{
              width: "100%",
              height: 45,
              color: "white",
              fontWeight: "400px",
              fontSize: "18px",
              marginTop: 20,
            }}
            className="flex items-center justify-center bg-primary hover:bg-green-700 rounded-3xl"
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default OtpVerification;
