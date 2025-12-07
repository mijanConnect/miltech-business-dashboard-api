import { UploadOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  Input,
  Select,
  Upload,
  message,
} from "antd";
import { useState } from "react";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;
const { Option } = Select;

const daysOptions = [
  { label: "Mon", value: "Monday" },
  { label: "Tue", value: "Tuesday" },
  { label: "Wed", value: "Wednesday" },
  { label: "Thu", value: "Thursday" },
  { label: "Fri", value: "Friday" },
  { label: "Sat", value: "Saturday" },
  { label: "Sun", value: "Sunday" },
];

const NewCampaign = ({ onSave, onCancel, editData = null, isEdit = false }) => {
  const [form] = Form.useForm();
  const [thumbnail, setThumbnail] = useState("");
  const [uploadedImage, setUploadedImage] = useState([]);
  const [checkedDays, setCheckedDays] = useState([]);
  const [checkAll, setCheckAll] = useState(false);

  // Initialize form with editData if in edit mode
  useState(() => {
    if (isEdit && editData) {
      // Handle availableDays or promotionDays
      const rawDays =
        editData.raw?.availableDays ||
        editData.selectedDays ||
        editData.promotionDays ||
        [];

      // Check if "all" is in the array or if all 7 days are present
      const isAllDays =
        (Array.isArray(rawDays) && rawDays.includes("all")) ||
        (Array.isArray(rawDays) && rawDays.length === 7);

      const initialDays = isAllDays
        ? daysOptions.map((day) => day.value)
        : rawDays;

      setCheckedDays(initialDays);
      setCheckAll(isAllDays || initialDays.length === daysOptions.length);

      const dateRange =
        editData.startDate && editData.endDate
          ? [dayjs(editData.startDate), dayjs(editData.endDate)]
          : null;

      // Set existing image if available
      if (editData.raw?.image) {
        setUploadedImage([
          {
            uid: "-1",
            name: "image.png",
            status: "done",
            url: editData.raw.image,
          },
        ]);
      }

      form.setFieldsValue({
        promotionName: editData.promotionName,
        promotionType: editData.promotionType,
        customerReach: editData.customerReach,
        customerSegment: editData.customerSegment,
        discountPercentage: editData.discountPercentage,
        dateRange: dateRange,
        promotionDays: initialDays,
      });
    }
  }, []);

  const handleThumbnailChange = ({ file }) => {
    if (file.status === "done" || file.originFileObj) {
      const reader = new FileReader();
      reader.onload = (e) => setThumbnail(e.target.result);
      reader.readAsDataURL(file.originFileObj);
    }
  };

  const handleSubmit = (values) => {
    const [startDate, endDate] = values.dateRange || [];
    const campaignData = {
      promotionName: values.promotionName,
      promotionType: values.promotionType,
      customerReach: values.customerReach,
      customerSegment: values.customerSegment,
      discountPercentage: values.discountPercentage,
      startDate: startDate ? startDate.format("YYYY-MM-DD") : null,
      endDate: endDate ? endDate.format("YYYY-MM-DD") : null,
      thumbnail,
      promotionDays: values.promotionDays || [],
      imageFile: uploadedImage[0]?.originFileObj || null,
    };

    // If editing, include the id
    if (isEdit && editData) {
      campaignData.id = editData.id;
    }

    onSave(campaignData);
    form.resetFields();
    setThumbnail("");
    setUploadedImage([]);
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
    // Only keep the latest file (for replacement)
    const newFileList = fileList.slice(-1);
    setUploadedImage(newFileList);
  };

  const handleCheckAllChange = (e) => {
    const allDays = daysOptions.map((day) => day.value);
    const newCheckedDays = e.target.checked ? allDays : [];
    setCheckedDays(newCheckedDays);
    setCheckAll(e.target.checked);
    form.setFieldsValue({ promotionDays: newCheckedDays });
  };

  const handleDaysChange = (checkedValues) => {
    setCheckedDays(checkedValues);
    setCheckAll(checkedValues.length === daysOptions.length);
    form.setFieldsValue({ promotionDays: checkedValues });
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">
        {isEdit ? "Edit Promotion" : "Add New Promotion"}
      </h2>
      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        <div className="flex flex-row justify-between gap-4">
          <div className="w-full flex flex-col gap-4">
            <Form.Item
              label="Promotion Name"
              name="promotionName"
              rules={[{ required: true }]}
            >
              <Input
                className="px-3 mli-tall-input"
                placeholder="Enter Promotion Name"
              />
            </Form.Item>

            <Form.Item
              label="Promotion Type"
              name="promotionType"
              rules={[{ required: true }]}
            >
              <Select
                placeholder="Select Promotion Type"
                className="mli-tall-select"
              >
                <Option value="Seasonal">Seasonal</Option>
                <Option value="Referral">Referral</Option>
                <Option value="Flash Sale">Flash Sale</Option>
                <Option value="Loyalty">Loyalty</Option>
              </Select>
            </Form.Item>
          </div>

          <div className="w-full flex flex-col gap-4">
            {/* <Form.Item
              label="Customer Reach"
              name="customerReach"
              rules={[{ required: true }]}
            >
              <Input
                className="px-3 mli-tall-input"
                placeholder="Enter Customer Reach"
              />
            </Form.Item> */}

            <Form.Item
              name="customerSegment"
              label="Customer Segment"
              rules={[{ required: true, message: "Please select a segment" }]}
            >
              <Select
                placeholder="Select Customer Segment"
                className="mli-tall-select"
              >
                <Select.Option value="New Customers">
                  New Customers
                </Select.Option>
                <Select.Option value="Returning Customers">
                  Returning Customers
                </Select.Option>
                <Select.Option value="Loyal Customers">
                  Loyal Customers
                </Select.Option>
                <Select.Option value="All Customers">
                  All Customers
                </Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Date Range"
              name="dateRange"
              rules={[{ required: true }]}
            >
              <RangePicker
                style={{ width: "100%" }}
                className="px-3 mli-tall-picker"
              />
            </Form.Item>
          </div>

          <div className="w-full flex flex-col gap-4">
            <Form.Item
              label="Discount Percentage"
              name="discountPercentage"
              rules={[{ required: true }]}
            >
              <Input
                className="px-3 mli-tall-input"
                placeholder="Enter Discount Percentage"
              />
            </Form.Item>
          </div>
        </div>

        <div className="w-full mb-4 mt-4">
          <Form.Item
            label="Select Promotion Days"
            name="promotionDays"
            rules={[
              { required: true, message: "Please select at least one day" },
            ]}
          >
            <div>
              <Checkbox
                onChange={handleCheckAllChange}
                checked={checkAll}
                className="mb-2 font-semibold"
              >
                All days
              </Checkbox>
              <Checkbox.Group
                options={daysOptions}
                className="flex gap-2"
                value={checkedDays}
                onChange={handleDaysChange}
              />
            </div>
          </Form.Item>
        </div>

        <Form.Item
          name="image"
          label="Upload Image (JPG/PNG only)"
          className="mt-6"
        >
          <Upload
            listType="picture"
            fileList={uploadedImage}
            beforeUpload={(file) => {
              // Allow only JPG or PNG
              const isJpgOrPng =
                file.type === "image/jpeg" || file.type === "image/png";
              if (!isJpgOrPng) {
                message.error("You can only upload JPG/PNG files!");
              }

              // Limit file size to 2MB
              const isLt2M = file.size / 1024 / 1024 < 2;
              if (!isLt2M) {
                message.error("Image must be smaller than 2MB!");
              }

              // Only accept file if both conditions are true
              return isJpgOrPng && isLt2M;
            }}
            onChange={handleUploadChange}
            onRemove={() => {
              setUploadedImage([]);
            }}
            maxCount={1}
            accept=".jpg,.jpeg,.png" // Restrict file picker to JPG/PNG
          >
            <Button icon={<UploadOutlined />}>
              {uploadedImage.length > 0 ? "Replace Image" : "Click to Upload"}
            </Button>
          </Upload>
          <p className="text-sm text-gray-500 mt-1">
            Allowed file types: JPG, PNG. Maximum file size: 2MB.
          </p>
        </Form.Item>

        <div className="flex justify-end gap-2">
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="primary" htmlType="submit" className="bg-primary">
            {isEdit ? "Update" : "Save"}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default NewCampaign;
