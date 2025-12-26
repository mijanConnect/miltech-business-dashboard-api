import React from "react";
import { Modal, Form, Input, Select } from "antd";

const { Option } = Select;

const AddNewUserModal = ({
  visible,
  onCancel,
  onSubmit,
  editingUser = null,
  roles = [],
}) => {
  const [form] = Form.useForm();

  // Update form when editingUser changes
  React.useEffect(() => {
    if (editingUser) {
      form.setFieldsValue(editingUser);
    } else {
      form.resetFields();
    }
  }, [editingUser, form, visible]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      onSubmit(values);
      form.resetFields();
    });
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={editingUser ? "Edit User" : "Add New User"}
      open={visible}
      onCancel={handleCancel}
      onOk={handleOk}
      okText={editingUser ? "Update User" : "Add User"}
      width={600}
    >
      <Form form={form} layout="vertical" className="flex flex-col gap-4 mb-6">
        <Form.Item
          name="firstName"
          label="User Name"
          rules={[{ required: true, message: "Please enter name" }]}
        >
          <Input className="mli-tall-input" />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Please enter email" },
            {
              validator: (_, value) => {
                if (!value) return Promise.resolve();
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                  return Promise.reject(
                    new Error("Please enter a valid email address")
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input className="mli-tall-input" placeholder="example@domain.com" />
        </Form.Item>
        <Form.Item
          name="phone"
          label="Phone Number"
          rules={[
            { required: true, message: "Please enter phone number" },
            {
              validator: (_, value) => {
                if (!value) return Promise.resolve();
                // Allow phone numbers with digits, spaces, hyphens, parentheses, and + sign
                const phoneRegex =
                  /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
                if (!phoneRegex.test(value.replace(/\s/g, ""))) {
                  return Promise.reject(
                    new Error("Please enter a valid phone number")
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input
            className="mli-tall-input"
            placeholder="e.g., +1 (555) 123-4567"
          />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[
            {
              required: !editingUser,
              message: "Please enter password",
            },
          ]}
        >
          <Input.Password className="mli-tall-input" />
        </Form.Item>
        <Form.Item
          name="role"
          label="Role"
          rules={[{ required: true, message: "Please select a role" }]}
        >
          <Select placeholder="Select role" className="mli-tall-select">
            <Option value="MERCENT">Admin</Option>
            <Option value="VIEW_MERCENT">User</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddNewUserModal;
