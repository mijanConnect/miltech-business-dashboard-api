import React, { useState } from "react";
import { Table, Select, Input, Button, Tooltip, message, Form } from "antd";
import { FaEdit, FaTrash } from "react-icons/fa";
import NewSell from "./components/NewSell";
import dayjs from "dayjs"; // Import dayjs

const { Option } = Select;

const SellManagement = () => {
  const [selectedCards, setSelectedCards] = useState([]);
  const [data, setData] = useState([
    {
      id: 1,
      customerName: "Alice Johnson",
      customerId: "CARD001",
      totalAmount: "$120",
      pointRedeem: 20,
      pointEarned: 12,
      finalAmount: "$100",
      transactionStatus: "Completed",
      date: "2025-08-17",
    },
    {
      id: 2,
      customerName: "John Doe",
      customerId: "CARD002",
      totalAmount: "$80",
      pointRedeem: 10,
      pointEarned: 8,
      finalAmount: "$70",
      transactionStatus: "Pending",
      date: "2025-07-16",
    },
    {
      id: 3,
      customerName: "Michael Brown",
      customerId: "CARD003",
      totalAmount: "$200",
      pointRedeem: 50,
      pointEarned: 20,
      finalAmount: "$150",
      transactionStatus: "Completed",
      date: "2025-08-15",
    },
  ]);

  const [searchText, setSearchText] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [isNewSellPage, setIsNewSellPage] = useState(false);
  const [editingRow, setEditingRow] = useState(null);

  const [form] = Form.useForm();

  const handleMonthChange = (month) => setSelectedMonth(month);
  const handleSearchChange = (e) => setSearchText(e.target.value);

  const filteredData = data.filter((item) => {
    const matchesMonth = selectedMonth
      ? new Date(item.date).getMonth() + 1 === parseInt(selectedMonth)
      : true;
    const matchesSearch = searchText
      ? item.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.customerId.toLowerCase().includes(searchText.toLowerCase())
      : true;
    return matchesMonth && matchesSearch;
  });

  const handleNewSellSubmit = (values) => {
    const newEntry = {
      id: data.length + 1,
      customerName: values.customerName,
      customerId: values.customerId,
      totalAmount: `$${values.totalAmount}`,
      pointRedeem: values.pointRedeem,
      pointEarned: values.pointEarned,
      finalAmount: `$${values.finalAmount}`,
      transactionStatus: values.transactionStatus,
      date: values.date, // Use the formatted date string
    };
    setData([newEntry, ...data]);
    setIsNewSellPage(false);
  };

  const handleEdit = (record) => {
    setEditingRow({ ...record, date: dayjs(record.date) }); // Ensure date is a valid dayjs object
    setIsNewSellPage(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this entry?",
      onOk: () => {
        setData(data.filter((item) => item.id !== id));
        message.success("Entry deleted successfully");
      },
    });
  };

  const columns = [
    { title: "SL", dataIndex: "id", key: "id", align: "center" },
    {
      title: "Customer Name",
      dataIndex: "customerName",
      key: "customerName",
      align: "center",
    },
    {
      title: "Card ID",
      dataIndex: "customerId",
      key: "customerId",
      align: "center",
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      align: "center",
    },
    {
      title: "Point Redeem",
      dataIndex: "pointRedeem",
      key: "pointRedeem",
      align: "center",
    },
    {
      title: "Point Earned",
      dataIndex: "pointEarned",
      key: "pointEarned",
      align: "center",
    },
    {
      title: "Final Amount",
      dataIndex: "finalAmount",
      key: "finalAmount",
      align: "center",
    },
    {
      title: "Transaction Status",
      dataIndex: "transactionStatus",
      key: "transactionStatus",
      align: "center",
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      width: 80,
      render: (_, record) => (
        <div
          className="flex gap-2 justify-between align-middle py-[7px] px-[15px] border border-primary rounded-md"
          style={{ alignItems: "center" }}
        >
          <Tooltip title="Edit">
            <button
              onClick={() => handleEdit(record)}
              className="text-primary hover:text-green-700 text-[17px]"
            >
              <FaEdit />
            </button>
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              type="danger"
              size="small"
              onClick={() => handleDelete(record.id)}
            >
              <FaTrash className="text-red-600" />
            </Button>
          </Tooltip>
        </div>
      ),
    },
  ];

  if (isNewSellPage) {
    return (
      <NewSell
        onBack={() => setIsNewSellPage(false)}
        onSubmit={handleNewSellSubmit} // Pass the function as a prop
        editingRow={editingRow} // Pass the editing row data
      />
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-[24px] font-bold">Today’s Sell</h1>
      </div>
      <div className="flex flex-row items-start justify-between gap-4 mb-4">
        <div className="flex gap-4">
          <Input
            placeholder="Search by Customer Name or Card ID"
            style={{ width: 300 }}
            value={searchText}
            onChange={handleSearchChange}
            allowClear
          />
          <Select
            placeholder="Filter by Month"
            style={{ width: 200 }}
            onChange={handleMonthChange}
            allowClear
            className="text-[14px] h-10"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <Option key={i + 1} value={String(i + 1)}>
                {new Date(0, i).toLocaleString("default", { month: "long" })}
              </Option>
            ))}
          </Select>
        </div>
        <Button
          onClick={() => setIsNewSellPage(true)}
          className="bg-primary px-8 py-5 rounded-full text-white hover:text-secondary text-[17px] font-bold"
        >
          New Sell
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table
          dataSource={filteredData}
          columns={columns}
          pagination={{ pageSize: 10 }}
          bordered={false}
          size="small"
          rowClassName="custom-row"
          className="custom-table"
          scroll={{ x: "max-content" }}
        />
      </div>
    </div>
  );
};

export default SellManagement;
