import React, { useState } from "react";
import { Table, DatePicker, Row, Col } from "antd";
import "antd/dist/reset.css";
import dayjs from "dayjs";

// Sample data for points redeemed
const data = [
  {
    sl: 1,
    period: "2025-01",
    redemptions: 15,
    totalPointsRedeemed: 3200,
    date: "2025-01-01", // Add date to the data
  },
  {
    sl: 2,
    period: "2025-02",
    redemptions: 10,
    totalPointsRedeemed: 2500,
    date: "2025-02-01", // Add date to the data
  },
  {
    sl: 3,
    period: "2025-03",
    redemptions: 20,
    totalPointsRedeemed: 4500,
    date: "2025-03-01", // Add date to the data
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
  { title: "Period", dataIndex: "period", key: "period", align: "center" },
  {
    title: "Redemptions",
    dataIndex: "redemptions",
    key: "redemptions",
    align: "center",
  },
  {
    title: "Total Points Redeemed",
    dataIndex: "totalPointsRedeemed",
    key: "totalPointsRedeemed",
    align: "center",
    render: (value) => value.toLocaleString(), // Format as a number with commas
  },
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
    align: "center",
  },
];

export default function PointsRedeemed() {
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
          <h1 className="text-[30px] font-bold mb-2">Points Redeemed</h1>
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
