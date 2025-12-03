import React, { useState } from "react";
import { Table, Tooltip, Modal } from "antd";

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

const OrderTable = () => {
  const [data, setData] = useState([
    {
      id: 1,
      customerId: "CUST001",
      customerName: "John Doe",
      points: 1200,
      tier: "Gold",
      joiningDate: "2023-01-15",
      accountStatus: "Active",
    },
    {
      id: 2,
      customerId: "CUST002",
      customerName: "Jane Smith",
      points: 900,
      tier: "Silver",
      joiningDate: "2023-03-20",
      accountStatus: "Inactive",
    },
    {
      id: 3,
      customerId: "CUST003",
      customerName: "Michael Brown",
      points: 1500,
      tier: "Platinum",
      joiningDate: "2022-11-05",
      accountStatus: "Active",
    },
  ]);

  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const showViewModal = (record) => {
    setSelectedRecord(record);
    setIsViewModalVisible(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalVisible(false);
    setSelectedRecord(null);
  };

  const columns = [
    { title: "SL", dataIndex: "id", key: "id", align: "center" },
    {
      title: "Customer ID",
      dataIndex: "customerId",
      key: "customerId",
      align: "center",
    },
    {
      title: "Customer Name",
      dataIndex: "customerName",
      key: "customerName",
      align: "center",
    },
    { title: "Points", dataIndex: "points", key: "points", align: "center" },
    { title: "Tier", dataIndex: "tier", key: "tier", align: "center" },
    {
      title: "Joining Date",
      dataIndex: "joiningDate",
      key: "joiningDate",
      align: "center",
    },
    {
      title: "Account Status",
      dataIndex: "accountStatus",
      key: "accountStatus",
      align: "center",
    },
  ];

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row justify-between mb-2 items-start sm:items-center gap-2 sm:gap-0">
        <h1 className="text-lg sm:text-xl md:text-xl font-bold text-secondary mb-2">
          Today’s New Member
        </h1>
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
    </div>
  );
};

export default OrderTable;
