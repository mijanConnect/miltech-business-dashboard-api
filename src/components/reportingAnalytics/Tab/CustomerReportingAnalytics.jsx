import { Button, Col, DatePicker, Form, Row, Select, Table } from "antd";
import "antd/dist/reset.css";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

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

// Sample data with additional fields
const data = [
  {
    sl: 1,
    date: "2025-01-01",
    category: "Employee",
    region: "USA",
    CustomerName: "Customer 1",
    CustomerID: "CUST001",
    Location: "New York",
    SubscriptionStatus: "Active",
    PaymentStatus: "Paid",
    DaysToExpire: 30,
    Revenue: 100,
    Users: 65,
    "Points Redeemed": 32,
    "Points Accumulated": 45,
  },
  {
    sl: 2,
    date: "2025-02-01",
    category: "Employee",
    region: "USA",
    CustomerName: "Customer 2",
    CustomerID: "CUST002",
    Location: "Los Angeles",
    SubscriptionStatus: "Inactive",
    PaymentStatus: "Unpaid",
    DaysToExpire: 15,
    Revenue: 75,
    Users: 60,
    "Points Redeemed": 27,
    "Points Accumulated": 38,
  },
  {
    sl: 3,
    date: "2025-03-01",
    category: "Employee",
    region: "USA",
    CustomerName: "Customer 3",
    CustomerID: "CUST003",
    Location: "Chicago",
    SubscriptionStatus: "Active",
    PaymentStatus: "Paid",
    DaysToExpire: 45,
    Revenue: 50,
    Users: 62,
    "Points Redeemed": 22,
    "Points Accumulated": 55,
  },
  // Other data...
];

// Dropdown options
const monthYearOptions = [...new Set(data.map((d) => d.date))];
const categoryOptions = [
  "All Categories",
  ...new Set(data.map((d) => d.category)),
];
const regionOptions = ["All Regions", ...new Set(data.map((d) => d.region))];
const CustomerOptions = [
  "All Customers",
  ...new Set(data.map((d) => d.CustomerName)),
];
const locationOptions = [
  "All Locations",
  ...new Set(data.map((d) => d.Location)),
];
const subscriptionOptions = ["All Statuses", "Active", "Inactive"];
const paymentOptions = ["All Payments", "Paid", "Unpaid"];
const metricOptions = ["Revenue", "Users", "Points Redeemed"];
const pointsFilterOptions = ["All", "Points Redeemed", "Points Accumulated"];

const maxValues = {
  Revenue: Math.max(...data.map((d) => d.Revenue)),
  Users: Math.max(...data.map((d) => d.Users)),
  "Points Redeemed": Math.max(...data.map((d) => d["Points Redeemed"])),
  "Points Accumulated": Math.max(...data.map((d) => d["Points Accumulated"])),
};

// Custom 3D Bar with watermark
const Custom3DBarWithWatermark = ({
  x,
  y,
  width,
  height,
  fill,
  dataKey,
  payload,
}) => {
  const depth = 10;
  const maxValue = maxValues[dataKey];
  const scale = maxValue / payload[dataKey];
  const watermarkHeight = height * scale;
  const watermarkY = y - (watermarkHeight - height);

  return (
    <g>
      <g opacity={0.1}>
        <rect
          x={x}
          y={watermarkY}
          width={width}
          height={watermarkHeight}
          fill={fill}
        />
        <polygon
          points={`${x},${watermarkY} ${x + depth},${watermarkY - depth} ${
            x + width + depth
          },${watermarkY - depth} ${x + width},${watermarkY}`}
          fill={fill}
        />
        <polygon
          points={`${x + width},${watermarkY} ${x + width + depth},${
            watermarkY - depth
          } ${x + width + depth},${watermarkY + watermarkHeight} ${x + width},${
            watermarkY + watermarkHeight
          }`}
          fill={fill}
        />
      </g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill}
        opacity={0.4}
      />
      <polygon
        points={`${x},${y} ${x + depth},${y - depth} ${x + width + depth},${
          y - depth
        } ${x + width},${y}`}
        fill={fill}
        opacity={0.6}
      />
      <polygon
        points={`${x + width},${y} ${x + width + depth},${y - depth} ${
          x + width + depth
        },${y + height} ${x + width},${y + height}`}
        fill={fill}
        opacity={0.7}
      />
    </g>
  );
};

export default function MonthlyStatsChartCustomer() {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedRegion, setSelectedRegion] = useState("All Regions");
  const [selectedCustomer, setSelectedCustomer] = useState("All Customers");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedSubscription, setSelectedSubscription] =
    useState("All Statuses");
  const [selectedPayment, setSelectedPayment] = useState("All Payments");
  const [selectedMetric, setSelectedMetric] = useState("all");
  const [selectedPointsFilter, setSelectedPointsFilter] = useState("All");
  const [chartType, setChartType] = useState("Bar");

  const filteredData = useMemo(() => {
    return data.filter((d) => {
      const isDateInRange =
        (!fromDate || dayjs(d.date).isAfter(dayjs(fromDate))) &&
        (!toDate || dayjs(d.date).isBefore(dayjs(toDate)));
      return (
        isDateInRange &&
        (selectedCategory === "All Categories" ||
          d.category === selectedCategory) &&
        (selectedRegion === "All Regions" || d.region === selectedRegion) &&
        (selectedCustomer === "All Customers" ||
          d.CustomerName === selectedCustomer) &&
        (selectedLocation === "All Locations" ||
          d.Location === selectedLocation) &&
        (selectedSubscription === "All Statuses" ||
          d.SubscriptionStatus === selectedSubscription) &&
        (selectedPayment === "All Payments" ||
          d.PaymentStatus === selectedPayment)
      );
    });
  }, [
    fromDate,
    toDate,
    selectedCategory,
    selectedRegion,
    selectedCustomer,
    selectedLocation,
    selectedSubscription,
    selectedPayment,
  ]);

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
      title: "Customer ID",
      dataIndex: "CustomerID",
      key: "CustomerID",
      align: "center",
    },
    {
      title: "Customer Name",
      dataIndex: "CustomerName",
      key: "CustomerName",
      align: "center",
    },
    {
      title: "Location",
      dataIndex: "Location",
      key: "Location",
      align: "center",
    },
    {
      title: "Subscription Status",
      dataIndex: "SubscriptionStatus",
      key: "SubscriptionStatus",
      align: "center",
    },
    {
      title: "Payment Status",
      dataIndex: "PaymentStatus",
      key: "PaymentStatus",
      align: "center",
    },
    { title: "Revenue", dataIndex: "Revenue", key: "Revenue", align: "center" },
    { title: "Users", dataIndex: "Users", key: "Users", align: "center" },
    {
      title: "Points Redeemed",
      dataIndex: "Points Redeemed",
      key: "Points Redeemed",
      align: "center",
    },
    {
      title: "Points Accumulated",
      dataIndex: "Points Accumulated",
      key: "Points Accumulated",
      align: "center",
    },
  ];

  return (
    <div style={{ width: "100%" }}>
      <Form layout="vertical">
        {/* From -> To Date Picker */}
        <div style={{ marginBottom: "0.5rem", width: "100%" }}>
          <Row gutter={[8, 8]} wrap>
            <Col flex="1 1 200px">
              <Form.Item label="Start Date" style={{ marginBottom: "0.5rem" }}>
                <DatePicker
                  value={fromDate ? dayjs(fromDate) : null}
                  onChange={(date) => setFromDate(date)}
                  style={{ width: "100%" }}
                  placeholder="Start Date"
                  className="mli-tall-picker"
                />
              </Form.Item>
            </Col>

            <Col flex="1 1 200px">
              <Form.Item label="End Date" style={{ marginBottom: "0.5rem" }}>
                <DatePicker
                  value={toDate ? dayjs(toDate) : null}
                  onChange={(date) => setToDate(date)}
                  style={{ width: "100%" }}
                  placeholder="End Date"
                  className="mli-tall-picker"
                />
              </Form.Item>
            </Col>

            <Col flex="1 1 200px">
              <Form.Item
                label={<span className="mli-custom-label">Customer Name</span>}
                style={{ marginBottom: "0.5rem" }}
              >
                <Select
                  className="mli-custom-select mli-tall-select"
                  showSearch
                  value={selectedCustomer}
                  style={{ width: "100%" }}
                  placeholder="Select a Customer"
                  optionFilterProp="children"
                  onChange={setSelectedCustomer}
                  filterOption={(input, option) => {
                    const label = String(option?.children ?? "");
                    return label.toLowerCase().includes(input.toLowerCase());
                  }}
                >
                  {CustomerOptions.map((option) => (
                    <Option key={option} value={option}>
                      {option}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col flex="1 1 200px">
              <Form.Item label="Location" style={{ marginBottom: "0.5rem" }}>
                <Select
                  showSearch
                  value={selectedLocation}
                  style={{ width: "100%" }}
                  placeholder="Select a location"
                  optionFilterProp="children"
                  onChange={setSelectedLocation}
                  className="mli-tall-select"
                  filterOption={(input, option) => {
                    const label = String(option?.children ?? "");
                    return label.toLowerCase().includes(input.toLowerCase());
                  }}
                >
                  {locationOptions.map((option) => (
                    <Option key={option} value={option}>
                      {option}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col flex="1 1 200px">
              <Form.Item
                label="Subscription Status"
                style={{ marginBottom: "0.5rem" }}
              >
                <Select
                  value={selectedSubscription}
                  style={{ width: "100%" }}
                  onChange={setSelectedSubscription}
                  className="mli-tall-select"
                >
                  {subscriptionOptions.map((option) => (
                    <Option key={option} value={option}>
                      {option}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* Bottom row: 4 items + buttons */}
          <Row gutter={[8, 8]} wrap style={{ marginTop: 8 }}>
            <Col flex="1 1 220px">
              <Form.Item
                label="Payment Status"
                style={{ marginBottom: "0.5rem" }}
              >
                <Select
                  value={selectedPayment}
                  style={{ width: "100%" }}
                  onChange={setSelectedPayment}
                  className="mli-tall-select"
                >
                  {paymentOptions.map((option) => (
                    <Option key={option} value={option}>
                      {option}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            {/* <Col flex="1 1 220px">
              <Form.Item
                label="Days to Expire"
                style={{ marginBottom: "0.5rem" }}
              >
                <DatePicker
                  value={toDate ? dayjs(toDate) : null}
                  onChange={(date) => setToDate(date)}
                  style={{ width: "100%" }}
                  placeholder="End Date"
                  className="mli-tall-picker"
                />
              </Form.Item>
            </Col> */}

            <Col flex="1 1 220px">
              <Form.Item
                label="Select Chart Type"
                style={{ marginBottom: "0.5rem" }}
              >
                <Select
                  value={chartType}
                  style={{ width: "100%" }}
                  onChange={setChartType}
                  className="mli-tall-select"
                >
                  <Option value="Bar">Bar Chart</Option>
                  <Option value="Line">Line Chart</Option>
                  <Option value="Area">Area Chart</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col flex="1 1 220px">
              <Form.Item
                label="Select Metrics"
                style={{ marginBottom: "0.5rem" }}
              >
                <Select
                  value={selectedMetric}
                  style={{ width: "100%" }}
                  onChange={setSelectedMetric}
                  className="mli-tall-select"
                >
                  <Option value="all">All Metrics</Option>
                  {metricOptions.map((option) => (
                    <Option key={option} value={option}>
                      {option}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col flex="1 1 220px">
              <Form.Item
                label="Points Filter"
                style={{ marginBottom: "0.5rem" }}
              >
                <Select
                  value={selectedPointsFilter}
                  style={{ width: "100%" }}
                  onChange={setSelectedPointsFilter}
                  className="mli-tall-select"
                >
                  {pointsFilterOptions.map((option) => (
                    <Option key={option} value={option}>
                      {option}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col flex="1 1 220px">
              <Form.Item label="Actions" style={{ marginBottom: "0.5rem" }}>
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      setFromDate(null);
                      setToDate(null);
                      setSelectedCategory("All Categories");
                      setSelectedRegion("All Regions");
                      setSelectedCustomer("All Customers");
                      setSelectedLocation("All Locations");
                      setSelectedSubscription("All Statuses");
                      setSelectedPayment("All Payments");
                      setSelectedMetric("all");
                      setSelectedPointsFilter("All");
                      setChartType("Bar");
                    }}
                  >
                    Clear Selection
                  </Button>
                  <Button>Export Report</Button>
                </div>
              </Form.Item>
            </Col>
          </Row>
        </div>
      </Form>

      {/* Chart */}
      <div
        className="p-4 rounded-lg border"
        style={{ width: "100%", height: 400, marginTop: "40px" }}
      >
        <ResponsiveContainer>
          {chartType === "Bar" ? (
            <BarChart
              data={filteredData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              barCategoryGap="20%"
              barGap={13}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              {(selectedMetric === "all" || selectedMetric === "Revenue") && (
                <Bar
                  dataKey="Revenue"
                  fill="#7086FD"
                  shape={(props) => (
                    <Custom3DBarWithWatermark {...props} dataKey="Revenue" />
                  )}
                />
              )}
              {(selectedMetric === "all" || selectedMetric === "Users") && (
                <Bar
                  dataKey="Users"
                  fill="#6FD195"
                  shape={(props) => (
                    <Custom3DBarWithWatermark {...props} dataKey="Users" />
                  )}
                />
              )}
              {(selectedMetric === "all" ||
                selectedMetric === "Points Redeemed") && (
                <Bar
                  dataKey="Points Redeemed"
                  fill="#FFAE4C"
                  shape={(props) => (
                    <Custom3DBarWithWatermark
                      {...props}
                      dataKey="Points Redeemed"
                    />
                  )}
                />
              )}
            </BarChart>
          ) : chartType === "Line" ? (
            <LineChart
              data={filteredData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              {(selectedMetric === "all" || selectedMetric === "Revenue") && (
                <Line type="monotone" dataKey="Revenue" stroke="#7086FD" />
              )}
              {(selectedMetric === "all" || selectedMetric === "Users") && (
                <Line type="monotone" dataKey="Users" stroke="#6FD195" />
              )}
              {(selectedMetric === "all" ||
                selectedMetric === "Points Redeemed") && (
                <Line
                  type="monotone"
                  dataKey="Points Redeemed"
                  stroke="#FFAE4C"
                />
              )}
            </LineChart>
          ) : (
            <AreaChart
              data={filteredData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              {(selectedMetric === "all" || selectedMetric === "Revenue") && (
                <Area
                  type="monotone"
                  dataKey="Revenue"
                  stroke="#7086FD"
                  fill="#7086FD"
                />
              )}
              {(selectedMetric === "all" || selectedMetric === "Users") && (
                <Area
                  type="monotone"
                  dataKey="Users"
                  stroke="#6FD195"
                  fill="#6FD195"
                />
              )}
              {(selectedMetric === "all" ||
                selectedMetric === "Points Redeemed") && (
                <Area
                  type="monotone"
                  dataKey="Points Redeemed"
                  stroke="#FFAE4C"
                  fill="#FFAE4C"
                />
              )}
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Ant Design Table */}
      <div style={{ marginTop: "50px" }}>
        <h1 className="text-[22px] font-bold mb-2">Data Table</h1>
        <Table
          bordered={false}
          size="small"
          rowClassName="custom-row"
          components={components}
          className="custom-table"
          columns={columns.filter((col) => {
            // Always show these columns
            if (
              [
                "sl",
                "date",
                "CustomerName",
                "CustomerID",
                "Location",
                "SubscriptionStatus",
                "PaymentStatus",
              ].includes(col.dataIndex)
            ) {
              return true;
            }

            // Filter by selected metric
            if (selectedMetric !== "all" && col.dataIndex !== selectedMetric) {
              return false;
            }

            // Filter by points filter
            if (selectedPointsFilter === "Points Redeemed") {
              return col.dataIndex !== "Points Accumulated";
            } else if (selectedPointsFilter === "Points Accumulated") {
              return col.dataIndex !== "Points Redeemed";
            }

            return true;
          })}
          dataSource={filteredData.map((row, index) => ({
            ...row,
            key: index,
          }))}
          pagination={{ pageSize: 6 }}
        />
      </div>
    </div>
  );
}
