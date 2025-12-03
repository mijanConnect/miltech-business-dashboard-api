import React, { useState } from "react";
import { Table, DatePicker, Row, Col } from "antd";
import "antd/dist/reset.css";
import dayjs from "dayjs";

// Sample data for cash receivable
const data = [
  {
    sl: 1,
    date: "2025-01-01",
    transactions: 5,
    totalCollected: 1200.5,
  },
  {
    sl: 2,
    date: "2025-02-01",
    transactions: 3,
    totalCollected: 850.0,
  },
  {
    sl: 3,
    date: "2025-03-01",
    transactions: 7,
    totalCollected: 1500.0,
  },
];

// Table columns
const columns = [
  {
    title: "SL",
    dataIndex: "sl",
    key: "sl",
    align: "center",
    render: (_, __, index) => index + 1,
  },
  { title: "Date", dataIndex: "date", key: "date", align: "center" },
  {
    title: "Transactions",
    dataIndex: "transactions",
    key: "transactions",
    align: "center",
  },
  {
    title: "Total Collected",
    dataIndex: "totalCollected",
    key: "totalCollected",
    align: "center",
    render: (value) => `$${value.toFixed(2)}`,
  },
];

export default function CashReceivable() {
  const [filteredData, setFilteredData] = useState(data);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const handleDateChange = () => {
    let filtered = data;
    if (fromDate) {
      filtered = filtered.filter((item) =>
        dayjs(item.date).isSameOrAfter(fromDate, "day")
      );
    }
    if (toDate) {
      filtered = filtered.filter((item) =>
        dayjs(item.date).isSameOrBefore(toDate, "day")
      );
    }
    setFilteredData(filtered);
  };

  const handleFromDateChange = (date) => {
    setFromDate(date);
    handleDateChange(); // Trigger the date filter when "From" date changes
  };

  const handleToDateChange = (date) => {
    setToDate(date);
    handleDateChange(); // Trigger the date filter when "To" date changes
  };

  return (
    <div style={{ width: "100%" }}>
      <Row
        justify="space-between"
        align="middle"
      >
        <Col>
          <h1 className="text-[30px] font-bold mb-2">Cash Receivable</h1>
        </Col>
        <Col>
          <Row gutter={16}>
            <Col>
              <DatePicker
                value={fromDate ? dayjs(fromDate) : null}
                onChange={handleFromDateChange}
                style={{ marginLeft: "auto", marginRight: "20px" }}
                placeholder="From Date"
                format="YYYY-MM-DD"
              />
            </Col>
            <Col>
              <DatePicker
                value={toDate ? dayjs(toDate) : null}
                onChange={handleToDateChange}
                style={{ marginRight: "20px" }}
                placeholder="To Date"
                format="YYYY-MM-DD"
              />
            </Col>
          </Row>
        </Col>
      </Row>
      <Table
        bordered={false}
        size="small"
        rowClassName="custom-row"
        className="custom-table"
        columns={columns}
        dataSource={filteredData.map((row, index) => ({
          ...row,
          key: index,
        }))}
        pagination={{ pageSize: 6 }}
      />
    </div>
  );
}
