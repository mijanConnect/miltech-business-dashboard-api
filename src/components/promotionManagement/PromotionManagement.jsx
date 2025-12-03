"use client";
import React, { useState } from "react";
import {
  Table,
  Button,
  Switch,
  Form,
  Input,
  Tooltip,
  Select,
  Upload,
  message,
  Modal,
  DatePicker,
} from "antd";
import { FaEdit } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";
import { UploadOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
import MarchantIcon from "../../assets/marchant.png";
import NewCampaign from "../promotionManagement/components/NewCampaing.jsx";
import dayjs from "dayjs"; // ✅ AntD v5 uses Dayjs

const { Option } = Select;

const components = {
  header: {
    row: (props) => (
      <tr
        {...props}
        style={{
          backgroundColor: "#f0f5f9",
          height: "50px",
          color: "secondary",
          fontSize: "18px",
          textAlign: "center",
          padding: "12px",
        }}
      />
    ),
    cell: (props) => (
      <th
        {...props}
        style={{
          color: "secondary",
          fontWeight: "bold",
          fontSize: "18px",
          textAlign: "center",
          padding: "12px",
        }}
      />
    ),
  },
};

const PromotionManagement = () => {
  const [data, setData] = useState([
    {
      id: 1,
      promotionName: "Spring Sale",
      promotionType: "Discount",
      customerReach: 1000,
      customerSegment: "New Customers",
      discountPercentage: 20,
      startDate: "2023-11-21",
      endDate: "2023-12-31",
      status: "Active",
    },
    {
      id: 2,
      promotionName: "Summer Offer",
      promotionType: "Cashback",
      customerReach: 500,
      customerSegment: "Returning Customers",
      discountPercentage: 15,
      startDate: "2023-06-01",
      endDate: "2023-06-30",
      status: "Inactive",
    },
  ]);

  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isNewCampaignModalVisible, setIsNewCampaignModalVisible] =
    useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isNotifyModalVisible, setIsNotifyModalVisible] = useState(false);
  const [uploadedImage, setUploadedImage] = useState([]);

  const handleAddCampaign = (newCampaign) => {
    setData((prev) => [
      ...prev,
      { id: prev.length + 1, status: "Active", ...newCampaign },
    ]);
    setIsNewCampaignModalVisible(false);
    Swal.fire({
      icon: "success",
      title: "Campaign Added!",
      text: "Your new campaign has been added successfully.",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  const handleEditSave = (values) => {
    setData((prev) =>
      prev.map((item) =>
        item.id === selectedRecord.id ? { ...item, ...values } : item
      )
    );
    setIsEditModalVisible(false);
    setSelectedRecord(null);
    Swal.fire({
      icon: "success",
      title: "Updated!",
      text: "Your campaign has been updated successfully.",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  const handleEditCancel = () => {
    setIsEditModalVisible(false);
    setSelectedRecord(null);
  };

  const handleSendNotification = (values) => {
    setIsNotifyModalVisible(false);
    Swal.fire({
      icon: "success",
      title: "Notification Sent!",
      text: `Message titled "${values.title}" has been sent to ${values.segment}.`,
      timer: 1500,
      showConfirmButton: false,
    });
    setUploadedImage([]); // Clear uploaded image after sending
  };

  // Image upload validation
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG files!");
    }
    return isJpgOrPng || Upload.LIST_IGNORE;
  };

  const handleUploadChange = ({ fileList }) => {
    setUploadedImage(fileList);
  };

  const columns = [
    { title: "SL", dataIndex: "id", key: "id", align: "center" },
    {
      title: "Promotion Name",
      dataIndex: "promotionName",
      key: "promotionName",
      align: "center",
    },
    {
      title: "Promotion Type",
      dataIndex: "promotionType",
      key: "promotionType",
      align: "center",
    },
    {
      title: "Customer Reach",
      dataIndex: "customerReach",
      key: "customerReach",
      align: "center",
    },
    {
      title: "Customer Segment",
      dataIndex: "customerSegment",
      key: "customerSegment",
      align: "center",
    },
    {
      title: "Discount Percentage",
      dataIndex: "discountPercentage",
      key: "discountPercentage",
      align: "center",
    },
    {
      title: "Date",
      key: "dateRange",
      align: "center",
      render: (_, record) => {
        const start = record.startDate
          ? new Date(record.startDate).toLocaleDateString()
          : "-";
        const end = record.endDate
          ? new Date(record.endDate).toLocaleDateString()
          : "-";
        return (
          <div className="flex flex-col items-start justify-center gap-1">
            <p>
              <span className="font-bold">Start Date: </span>
              <span className="border border-primary px-[5px] py-[1px] rounded-sm">
                {start}
              </span>
            </p>
            <p>
              <span className="font-bold">End Date: </span>
              <span className="border border-primary px-[5px] py-[1px] rounded-sm">
                {end}
              </span>
            </p>
          </div>
        );
      },
    },
    { title: "Status", dataIndex: "status", key: "status", align: "center" },
    {
      title: "Action",
      key: "action",
      align: "center",
      width: 100,
      render: (_, record) => (
        <div className="py-[10px] px-[10px] border border-primary rounded-md">
          <div className="flex gap-2 justify-between align-middle">
            <Tooltip title="Edit">
              <button
                onClick={() => {
                  setSelectedRecord(record);
                  setIsEditModalVisible(true);
                }}
                className="text-primary hover:text-green-700 text-[17px]"
              >
                <FaEdit />
              </button>
            </Tooltip>
            <Switch
              size="small"
              checked={record.status === "Active"}
              style={{
                backgroundColor:
                  record.status === "Active" ? "#3fae6a" : "gray",
              }}
              onChange={(checked) => {
                Swal.fire({
                  title: "Are you sure?",
                  text: `You are about to change status to ${
                    checked ? "Active" : "Inactive"
                  }.`,
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonColor: "#3085d6",
                  cancelButtonColor: "#d33",
                  confirmButtonText: "Yes, change it!",
                }).then((result) => {
                  if (result.isConfirmed) {
                    setData((prev) =>
                      prev.map((item) =>
                        item.id === record.id
                          ? { ...item, status: checked ? "Active" : "Inactive" }
                          : item
                      )
                    );
                    Swal.fire({
                      title: "Updated!",
                      text: `Status has been changed to ${
                        checked ? "Active" : "Inactive"
                      }.`,
                      icon: "success",
                      timer: 1500,
                      showConfirmButton: false,
                    });
                  }
                });
              }}
            />
          </div>
        </div>
      ),
    },
  ];

  const columns2 = [
    { title: "SL", dataIndex: "id", key: "id", align: "center" },
    {
      title: "Promotion Name",
      dataIndex: "promotionName",
      key: "promotionName",
      align: "center",
    },
    {
      title: "Promotion Type",
      dataIndex: "promotionType",
      key: "promotionType",
      align: "center",
    },
    {
      title: "Customer Reach",
      dataIndex: "customerReach",
      key: "customerReach",
      align: "center",
    },
    {
      title: "Customer Segment",
      dataIndex: "customerSegment",
      key: "customerSegment",
      align: "center",
    },
    {
      title: "Discount Percentage",
      dataIndex: "discountPercentage",
      key: "discountPercentage",
      align: "center",
    },
    { title: "Status", dataIndex: "status", key: "status", align: "center" },
  ];

  // Full-page view
  if (selectedRecord && !isEditModalVisible) {
    return (
      <div className="">
        <div className="flex justify-between items-center">
          <div className="flex items-center mb-4 gap-6">
            <Button
              icon={<IoArrowBack />}
              onClick={() => setSelectedRecord(null)}
              className="mb-4"
            ></Button>
            <div>
              <h1 className="text-[24px] font-bold">Campaign Details</h1>
              <p className="text-[16px] font-normal mt-2">
                View and manage all the details of your active campaigns.
              </p>
            </div>
          </div>
          <Button
            onClick={() => setSelectedRecord(null)}
            type="primary"
            className="bg-primary !text-white hover:!text-secondary hover:!bg-white hover:!border-primary px-[30px] py-[25px] rounded-full text-[18px] font-bold"
          >
            Export
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table
            dataSource={data}
            columns={columns2}
            pagination={{ pageSize: 10 }}
            bordered={false}
            size="small"
            rowClassName="custom-row"
            components={components}
            className="custom-table"
            scroll={{ x: "max-content" }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="flex justify-between items-end flex-col md:flex-row gap-4 mb-4">
        <div>
          <h1 className="text-[24px] font-bold">Campaigns List</h1>
          <p className="text-[16px] font-normal mt-2">
            View and manage all your active campaigns in one place.
          </p>
        </div>
        <div className="flex gap-4 flex-col md:flex-row">
          <Button
            className="bg-primary px-8 py-5 rounded-full text-white hover:text-secondary text-[17px] font-bold"
            onClick={() => setIsNotifyModalVisible(true)}
          >
            Notification Management
          </Button>
          <Button
            className="bg-primary px-8 py-5 rounded-full text-white hover:text-secondary text-[17px] font-bold"
            onClick={() => setIsNewCampaignModalVisible(true)}
          >
            New Promo & Discount
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table
          dataSource={data}
          columns={columns}
          pagination={{ pageSize: 10 }}
          bordered={false}
          size="small"
          rowClassName="custom-row"
          components={components}
          className="custom-table"
          scroll={{ x: "max-content" }}
        />
      </div>

      {/* Edit Campaign Modal */}
      <Modal
        title="Edit Promotion"
        visible={isEditModalVisible}
        onCancel={handleEditCancel}
        footer={null}
        width={600}
        closable={true}
      >
        {selectedRecord && (
          <Form
            layout="vertical"
            // ✅ Convert string dates to Dayjs for DatePicker initial values
            initialValues={{
              ...selectedRecord,
              startDate: selectedRecord.startDate
                ? dayjs(selectedRecord.startDate)
                : null,
              endDate: selectedRecord.endDate
                ? dayjs(selectedRecord.endDate)
                : null,
            }}
            onFinish={handleEditSave}
            className="flex flex-col gap-4"
          >
            <Form.Item
              name="promotionName"
              label="Promotion Name"
              rules={[{ required: true, message: "Please enter name" }]}
            >
              <Input className="mli-tall-input" />
            </Form.Item>
            <Form.Item name="promotionType" label="Promotion Type">
              <Input className="mli-tall-input" />
            </Form.Item>
            <Form.Item name="customerReach" label="Customer Reach">
              <Input type="number" className="mli-tall-input" />
            </Form.Item>
            <Form.Item name="customerSegment" label="Customer Segment">
              <Input className="mli-tall-input" />
            </Form.Item>
            <Form.Item name="discountPercentage" label="Discount Percentage">
              <Input type="number" className="mli-tall-input" />
            </Form.Item>

            {/* ✅ Updated to AntD DatePicker like your reference */}
            <Form.Item name="startDate" label="Start Date">
              <DatePicker
                className="mli-tall-picker"
                style={{ width: "100%" }}
                format="YYYY-MM-DD"
              />
            </Form.Item>
            <Form.Item name="endDate" label="End Date">
              <DatePicker
                className="mli-tall-picker"
                style={{ width: "100%" }}
                format="YYYY-MM-DD"
              />
            </Form.Item>

            <div className="flex gap-2 mt-4">
              <Button
                type="default"
                className="flex-1"
                onClick={handleEditCancel}
              >
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" className="flex-1">
                Save Changes
              </Button>
            </div>
          </Form>
        )}
      </Modal>

      {/* New Campaign Modal */}
      <Modal
        title="New Campaign"
        visible={isNewCampaignModalVisible}
        onCancel={() => setIsNewCampaignModalVisible(false)}
        footer={null}
        width={1000}
        closable={true}
      >
        <NewCampaign
          onSave={handleAddCampaign}
          onCancel={() => setIsNewCampaignModalVisible(false)}
        />
      </Modal>

      {/* Notification Modal */}
      <Modal
        title="Send Notification"
        visible={isNotifyModalVisible}
        onCancel={() => setIsNotifyModalVisible(false)}
        footer={null}
        width={500}
        closable={true}
      >
        <Form
          layout="vertical"
          onFinish={handleSendNotification}
          className="flex flex-col gap-4"
        >
          <Form.Item
            name="segment"
            label="All customers (that have transacted with this merchant)"
            rules={[{ required: true, message: "Please select a segment" }]}
          >
            <Select placeholder="Choose segment" className="mli-tall-select">
              <Option value="New Customers">New Customers</Option>
              <Option value="Returning Customers">Returning Customers</Option>
              <Option value="VIP Customers">VIP Customers</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="title"
            label="All customers that have at least x number of points"
            rules={[{ required: true, message: "Please enter a number" }]}
          >
            <Input placeholder="" className="mli-tall-input" />
          </Form.Item>

          <Form.Item
            name="message"
            label="Customers located within x km of radius from the merchant location"
            rules={[{ required: true, message: "Please enter distance/KM" }]}
          >
            <Input placeholder="" className="mli-tall-input" />
          </Form.Item>

          <Form.Item
            name="additionalInfo"
            label="Promotion/discount message"
            rules={[{ required: false }]}
          >
            <Input.TextArea
              placeholder="Enter additional information here"
              autoSize={{ minRows: 3, maxRows: 6 }}
              className="mli-tall-input"
            />
          </Form.Item>

          <Form.Item name="image" label="Upload Image (JPG/PNG only)">
            <Upload
              listType="picture"
              fileList={uploadedImage}
              beforeUpload={(file) => {
                const isJpgOrPng =
                  file.type === "image/jpeg" || file.type === "image/png";
                if (!isJpgOrPng)
                  message.error("You can only upload JPG/PNG files!");
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isLt2M) message.error("Image must smaller than 2MB!");
                return isJpgOrPng && isLt2M;
              }}
              onChange={handleUploadChange}
              onRemove={(file) =>
                setUploadedImage((prev) =>
                  prev.filter((f) => f.uid !== file.uid)
                )
              }
              maxCount={1}
              accept=".jpg,.jpeg,.png"
            >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
            <p className="text-sm text-gray-500 mt-1">
              Allowed file types: JPG, PNG. Maximum file size: 2MB.
            </p>
          </Form.Item>

          <div className="flex gap-2 mt-4">
            <Button
              type="default"
              className="flex-1"
              onClick={() => setIsNotifyModalVisible(false)}
            >
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" className="flex-1">
              Send
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default PromotionManagement;
