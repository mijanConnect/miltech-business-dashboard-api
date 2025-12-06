import { Form, Input, Select, Upload, message } from "antd";
import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UploadOutlined } from "@ant-design/icons";
import Swal from "sweetalert2"; // ✅ import SweetAlert2
import { useUpdateProfileMutation } from "../../redux/apiSlices/authSlice";

const { Option } = Select;

const ShopInfo = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const phoneFromQuery = searchParams.get("phone") || "";
  const emailFromQuery = searchParams.get("email") || "";
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const onFinish = async (values) => {
    const formData = new FormData();

    const payloadMap = {
      firstName: values.firstName,
      businessName: values.businessName,
      email: values.email,
      phone: values.phone,
      country: values.country,
      city: values.city,
      service: values.service,
      address: values.address,
    };

    Object.entries(payloadMap).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "") {
        formData.append(key, val);
      }
    });

    const logoFile = values.logo?.[0]?.originFileObj;
    if (logoFile) {
      formData.append("profile", logoFile);
    }

    try {
      await updateProfile(formData).unwrap();
      Swal.fire({
        title: "Your Profile is Under Review",
        text: "Your application is under review. Please wait for admin approval.",
        icon: "success",
        confirmButtonText: "Done",
      }).then(() => {
        navigate("/auth/login");
      });
    } catch (err) {
      const errorMsg = err?.data?.message || "Profile update failed";
      message.error(errorMsg);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="text-center mb-2">
        <h1 className="text-[25px] font-semibold mb-[10px] mt-[20px]">
          Enter your Shop Information
        </h1>
        <p className="mb-6">
          Provide your shop details to get started and make your store ready for
          customers.
        </p>
      </div>

      {/* Form */}
      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        className="flex flex-col gap-4"
        initialValues={{
          phone: phoneFromQuery,
          email: emailFromQuery,
        }}
      >
        {/* First Name */}
        {/* <Form.Item
          name="firstName"
          rules={[{ required: true, message: "Please enter first name" }]}
        >
          <Input
            placeholder="Enter First Name"
            style={{
              height: 45,
              border: "1px solid #3FAE6A",
              borderRadius: "200px",
            }}
          />
        </Form.Item> */}

        {/* Business Name */}
        <Form.Item
          name="businessName"
          rules={[{ required: true, message: "Please enter business name" }]}
        >
          <Input
            placeholder="Enter Business Name"
            style={{
              height: 45,
              border: "1px solid #3FAE6A",
              borderRadius: "200px",
            }}
          />
        </Form.Item>

        {/* Email */}
        {/* <Form.Item
          name="email"
          rules={[{ required: true, message: "Please enter email" }]}
        >
          <Input
            placeholder="Enter Email"
            style={{
              height: 45,
              border: "1px solid #3FAE6A",
              borderRadius: "200px",
            }}
          />
        </Form.Item> */}

        {/* Phone */}
        {/* <Form.Item
          name="phone"
          rules={[{ required: true, message: "Please enter phone number" }]}
        >
          <Input
            placeholder="Enter Phone"
            style={{
              height: 45,
              border: "1px solid #3FAE6A",
              borderRadius: "200px",
            }}
          />
        </Form.Item> */}

        {/* Country Dropdown */}
        <Form.Item
          name="country"
          rules={[{ required: true, message: "Please select your country" }]}
        >
          <Select
            placeholder="Select Your Country"
            className="custom-select"
            dropdownClassName="custom-dropdown"
            style={{
              height: 45,
            }}
          >
            <Option value="Bangladesh">Bangladesh</Option>
            <Option value="India">India</Option>
            <Option value="USA">USA</Option>
          </Select>
        </Form.Item>

        {/* City Dropdown */}
        <Form.Item
          name="city"
          rules={[{ required: true, message: "Please select your city" }]}
        >
          <Select
            placeholder="Select Your City"
            className="custom-select"
            dropdownClassName="custom-dropdown"
            style={{
              height: 45,
            }}
          >
            <Option value="Dhaka">Dhaka</Option>
            <Option value="Chattogram">Chattogram</Option>
            <Option value="Sylhet">Sylhet</Option>
          </Select>
        </Form.Item>

        {/* Services Dropdown */}
        <Form.Item
          name="service"
          rules={[{ required: true, message: "Please select your services" }]}
        >
          <Select
            placeholder="Select Your Services"
            className="custom-select"
            dropdownClassName="custom-dropdown"
            style={{
              height: 45,
            }}
          >
            <Option value="Software Development">Software Development</Option>
            <Option value="E-commerce">E-commerce</Option>
            <Option value="Logistics">Logistics</Option>
          </Select>
        </Form.Item>

        {/* Upload Logo */}
        <Form.Item
          name="logo"
          rules={[{ required: true, message: "Please upload your logo" }]}
          style={{ marginBottom: 24 }}
        >
          <Upload
            beforeUpload={() => false}
            maxCount={1}
            className="w-full"
            accept=".jpg,.jpeg,.png"
          >
            <button
              type="button"
              style={{
                width: "100%",
                height: 45,
                border: "1px solid #3FAE6A",
                borderRadius: "200px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "#fff",
                cursor: "pointer",
                padding: "0 16px",
              }}
            >
              <div className="flex items-center justify-between w-full gap-12">
                <span>Upload Logo</span>
                <UploadOutlined />
              </div>
            </button>
          </Upload>
        </Form.Item>

        {/* Shop Address */}
        <Form.Item
          name="address"
          rules={[
            { required: true, message: "Please enter your shop address" },
          ]}
          style={{ marginBottom: 24 }}
        >
          <Input.TextArea
            placeholder="Enter Your Shop Address"
            rows={4}
            style={{
              border: "1px solid #3FAE6A",
              borderRadius: "15px",
            }}
          />
        </Form.Item>

        {/* Submit button */}
        <Form.Item style={{ marginBottom: 0 }}>
          <button
            htmlType="submit"
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              height: 45,
              color: "white",
              fontWeight: "400px",
              marginTop: 20,
              borderRadius: "200px",
            }}
            className="flex items-center justify-center bg-[#3FAE6A] rounded-lg"
          >
            {isLoading ? "Submitting..." : "Continue"}
          </button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ShopInfo;
