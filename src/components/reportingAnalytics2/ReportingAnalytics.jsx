import React, { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Table, Select, Button } from "antd";
import "antd/dist/reset.css";

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

// Sample data
const data = [
  {
    sl: 1,
    date: "Jan 2025",
    category: "Employee",
    region: "USA",
    Revenue: 100,
    Users: 65,
    "Points Redeemed": 32,
  },
  {
    sl: 2,
    date: "Feb 2025",
    category: "Employee",
    region: "USA",
    Revenue: 75,
    Users: 60,
    "Points Redeemed": 27,
  },
  {
    sl: 3,
    date: "Mar 2025",
    category: "Employee",
    region: "USA",
    Revenue: 50,
    Users: 62,
    "Points Redeemed": 22,
  },
  {
    sl: 4,
    date: "Apr 2025",
    category: "Employee",
    region: "UK",
    Revenue: 69,
    Users: 54,
    "Points Redeemed": 29,
  },
  {
    sl: 5,
    date: "May 2025",
    category: "Employee",
    region: "UK",
    Revenue: 47,
    Users: 59,
    "Points Redeemed": 24,
  },
  {
    sl: 6,
    date: "Jun 2025",
    category: "Employee",
    region: "UK",
    Revenue: 60,
    Users: 68,
    "Points Redeemed": 37,
  },
  {
    sl: 7,
    date: "Jul 2025",
    category: "Employee",
    region: "USA",
    Revenue: 88,
    Users: 57,
    "Points Redeemed": 45,
  },
  {
    sl: 8,
    date: "Aug 2025",
    category: "Employee",
    region: "USA",
    Revenue: 88,
    Users: 57,
    "Points Redeemed": 45,
  },
  {
    sl: 9,
    date: "Sep 2025",
    category: "Customer",
    region: "UK",
    Revenue: 38,
    Users: 57,
    "Points Redeemed": 100,
  },
  {
    sl: 10,
    date: "Oct 2025",
    category: "Customer",
    region: "UK",
    Revenue: 88,
    Users: 57,
    "Points Redeemed": 45,
  },
  {
    sl: 11,
    date: "Nov 2025",
    category: "Customer",
    region: "USA",
    Revenue: 88,
    Users: 57,
    "Points Redeemed": 45,
  },
  {
    sl: 12,
    date: "Dec 2025",
    category: "Customer",
    region: "USA",
    Revenue: 88,
    Users: 57,
    "Points Redeemed": 45,
  },
];

// Dropdown options
const monthYearOptions = [...new Set(data.map((d) => d.date))];
const categoryOptions = [
  "All Categories",
  ...new Set(data.map((d) => d.category)),
];
const regionOptions = ["All Regions", ...new Set(data.map((d) => d.region))];
const metricOptions = ["Revenue", "Users", "Points Redeemed"];

const maxValues = {
  Revenue: Math.max(...data.map((d) => d.Revenue)),
  Users: Math.max(...data.map((d) => d.Users)),
  "Points Redeemed": Math.max(...data.map((d) => d["Points Redeemed"])),
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

export default function MonthlyStatsChart() {
  const [fromMonth, setFromMonth] = useState(monthYearOptions[0]);
  const [toMonth, setToMonth] = useState(
    monthYearOptions[monthYearOptions.length - 1]
  );
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedRegion, setSelectedRegion] = useState("All Regions");
  const [selectedMetric, setSelectedMetric] = useState("all");
  const [chartType, setChartType] = useState("Bar");

  const filteredData = useMemo(() => {
    return data.filter((d) => {
      const monthIndex = monthYearOptions.indexOf(d.date);
      const fromIndex = monthYearOptions.indexOf(fromMonth);
      const toIndex = monthYearOptions.indexOf(toMonth);
      return (
        monthIndex >= fromIndex &&
        monthIndex <= toIndex &&
        (selectedCategory === "All Categories" ||
          d.category === selectedCategory) &&
        (selectedRegion === "All Regions" || d.region === selectedRegion)
      );
    });
  }, [fromMonth, toMonth, selectedCategory, selectedRegion]);

  const columns = [
    {
      title: "SL",
      dataIndex: "sl",
      key: "sl",
      align: "center",
      render: (_, __, index) => index + 1,
    },
    { title: "Date", dataIndex: "date", key: "date", align: "center" },
    { title: "Revenue", dataIndex: "Revenue", key: "Revenue", align: "center" },
    { title: "Users", dataIndex: "Users", key: "Users", align: "center" },
    {
      title: "Points Redeemed",
      dataIndex: "Points Redeemed",
      key: "Points Redeemed",
      align: "center",
    },
  ];

  return (
    <div className="mt-4" style={{ width: "100%", padding: "1rem" }}>
      {/* From -> To Month Dropdowns */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "1rem",
          flexWrap: "wrap",
        }}
      >
        <Select
          value={fromMonth}
          style={{ width: 150 }}
          onChange={setFromMonth}
        >
          {monthYearOptions.map((option) => (
            <Option key={option} value={option}>
              {option}
            </Option>
          ))}
        </Select>
        <Select value={toMonth} style={{ width: 150 }} onChange={setToMonth}>
          {monthYearOptions.map((option) => (
            <Option key={option} value={option}>
              {option}
            </Option>
          ))}
        </Select>

        <Select
          value={selectedRegion}
          style={{ width: 150 }}
          onChange={setSelectedRegion}
        >
          {regionOptions.map((option) => (
            <Option key={option} value={option}>
              {option}
            </Option>
          ))}
        </Select>

        <Select
          value={selectedMetric}
          style={{ width: 150 }}
          onChange={setSelectedMetric}
        >
          <Option value="all">All Metrics</Option>
          {metricOptions.map((option) => (
            <Option key={option} value={option}>
              {option}
            </Option>
          ))}
        </Select>

        <Select
          value={chartType}
          style={{ width: 150 }}
          onChange={setChartType}
        >
          <Option value="Bar">Bar Chart</Option>
          <Option value="Line">Line Chart</Option>
          <Option value="Area">Area Chart</Option>
        </Select>

        <Button>Export Report</Button>
      </div>

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
          columns={columns.filter(
            (col) =>
              selectedMetric === "all" || col.dataIndex === selectedMetric
          )}
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

// import React, { useState, useMemo } from "react";
// import {
//   BarChart,
//   Bar,
//   LineChart,
//   Line,
//   AreaChart,
//   Area,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
// import { Table, Select, Button, DatePicker } from "antd";
// import "antd/dist/reset.css";
// import dayjs from "dayjs";

// const { Option } = Select;
// const { RangePicker } = DatePicker;

// const components = {
//   header: {
//     row: (props) => (
//       <tr
//         {...props}
//         style={{
//           backgroundColor: "#f0f5f9",
//           height: "50px",
//           color: "secondary",
//           fontSize: "18px",
//           textAlign: "center",
//           padding: "12px",
//         }}
//       />
//     ),
//     cell: (props) => (
//       <th
//         {...props}
//         style={{
//           color: "secondary",
//           fontWeight: "bold",
//           fontSize: "18px",
//           textAlign: "center",
//           padding: "12px",
//         }}
//       />
//     ),
//   },
// };

// // Sample data
// const data = [
//   {
//     sl: 1,
//     date: "Jan 2025",
//     category: "Employee",
//     region: "USA",
//     Revenue: 100,
//     Users: 65,
//     "Points Redeemed": 32,
//   },
//   {
//     sl: 2,
//     date: "Feb 2025",
//     category: "Employee",
//     region: "USA",
//     Revenue: 75,
//     Users: 60,
//     "Points Redeemed": 27,
//   },
//   {
//     sl: 3,
//     date: "Mar 2025",
//     category: "Employee",
//     region: "USA",
//     Revenue: 50,
//     Users: 62,
//     "Points Redeemed": 22,
//   },
//   {
//     sl: 4,
//     date: "Apr 2025",
//     category: "Employee",
//     region: "UK",
//     Revenue: 69,
//     Users: 54,
//     "Points Redeemed": 29,
//   },
//   {
//     sl: 5,
//     date: "May 2025",
//     category: "Employee",
//     region: "UK",
//     Revenue: 47,
//     Users: 59,
//     "Points Redeemed": 24,
//   },
//   {
//     sl: 6,
//     date: "Jun 2025",
//     category: "Employee",
//     region: "UK",
//     Revenue: 60,
//     Users: 68,
//     "Points Redeemed": 37,
//   },
//   {
//     sl: 7,
//     date: "Jul 2025",
//     category: "Employee",
//     region: "USA",
//     Revenue: 88,
//     Users: 57,
//     "Points Redeemed": 45,
//   },
//   {
//     sl: 8,
//     date: "Aug 2025",
//     category: "Employee",
//     region: "USA",
//     Revenue: 88,
//     Users: 57,
//     "Points Redeemed": 45,
//   },
//   {
//     sl: 9,
//     date: "Sep 2025",
//     category: "Customer",
//     region: "UK",
//     Revenue: 38,
//     Users: 57,
//     "Points Redeemed": 100,
//   },
//   {
//     sl: 10,
//     date: "Oct 2025",
//     category: "Customer",
//     region: "UK",
//     Revenue: 88,
//     Users: 57,
//     "Points Redeemed": 45,
//   },
//   {
//     sl: 11,
//     date: "Nov 2025",
//     category: "Customer",
//     region: "USA",
//     Revenue: 88,
//     Users: 57,
//     "Points Redeemed": 45,
//   },
//   {
//     sl: 12,
//     date: "Dec 2025",
//     category: "Customer",
//     region: "USA",
//     Revenue: 88,
//     Users: 57,
//     "Points Redeemed": 45,
//   },
// ];

// // Dropdown options
// const categoryOptions = [
//   "All Categories",
//   ...new Set(data.map((d) => d.category)),
// ];
// const regionOptions = ["All Regions", ...new Set(data.map((d) => d.region))];
// const metricOptions = ["Revenue", "Users", "Points Redeemed"];

// const maxValues = {
//   Revenue: Math.max(...data.map((d) => d.Revenue)),
//   Users: Math.max(...data.map((d) => d.Users)),
//   "Points Redeemed": Math.max(...data.map((d) => d["Points Redeemed"])),
// };

// // Custom 3D Bar with watermark
// const Custom3DBarWithWatermark = ({
//   x,
//   y,
//   width,
//   height,
//   fill,
//   dataKey,
//   payload,
// }) => {
//   const depth = 10;
//   const maxValue = maxValues[dataKey];
//   const scale = maxValue / payload[dataKey];
//   const watermarkHeight = height * scale;
//   const watermarkY = y - (watermarkHeight - height);

//   return (
//     <g>
//       <g opacity={0.1}>
//         <rect
//           x={x}
//           y={watermarkY}
//           width={width}
//           height={watermarkHeight}
//           fill={fill}
//         />
//         <polygon
//           points={`${x},${watermarkY} ${x + depth},${watermarkY - depth} ${
//             x + width + depth
//           },${watermarkY - depth} ${x + width},${watermarkY}`}
//           fill={fill}
//         />
//         <polygon
//           points={`${x + width},${watermarkY} ${x + width + depth},${
//             watermarkY - depth
//           } ${x + width + depth},${watermarkY + watermarkHeight} ${x + width},${
//             watermarkY + watermarkHeight
//           }`}
//           fill={fill}
//         />
//       </g>
//       <rect
//         x={x}
//         y={y}
//         width={width}
//         height={height}
//         fill={fill}
//         opacity={0.4}
//       />
//       <polygon
//         points={`${x},${y} ${x + depth},${y - depth} ${x + width + depth},${
//           y - depth
//         } ${x + width},${y}`}
//         fill={fill}
//         opacity={0.6}
//       />
//       <polygon
//         points={`${x + width},${y} ${x + width + depth},${y - depth} ${
//           x + width + depth
//         },${y + height} ${x + width},${y + height}`}
//         fill={fill}
//         opacity={0.7}
//       />
//     </g>
//   );
// };

// export default function MonthlyStatsChart() {
//   // Default date range: from first to last available month in the dataset
//   const firstMonth = dayjs(data[0].date, "MMM YYYY").startOf("month");
//   const lastMonth = dayjs(data[data.length - 1].date, "MMM YYYY").startOf(
//     "month"
//   );

//   const [dateRange, setDateRange] = useState([firstMonth, lastMonth]);
//   const [selectedCategory, setSelectedCategory] = useState("All Categories");
//   const [selectedRegion, setSelectedRegion] = useState("All Regions");
//   const [selectedMetric, setSelectedMetric] = useState("all");
//   const [chartType, setChartType] = useState("Bar");

//   const filteredData = useMemo(() => {
//     // normalize range (can be null if user clears)
//     const fromDate =
//       dateRange && dateRange[0] ? dayjs(dateRange[0]).startOf("month") : null;
//     const toDate =
//       dateRange && dateRange[1] ? dayjs(dateRange[1]).startOf("month") : null;

//     return data.filter((d) => {
//       const rowDate = dayjs(d.date, "MMM YYYY").startOf("month");

//       const afterFrom =
//         !fromDate || rowDate.isAfter(fromDate) || rowDate.isSame(fromDate);
//       const beforeTo =
//         !toDate || rowDate.isBefore(toDate) || rowDate.isSame(toDate);

//       return (
//         afterFrom &&
//         beforeTo &&
//         (selectedCategory === "All Categories" ||
//           d.category === selectedCategory) &&
//         (selectedRegion === "All Regions" || d.region === selectedRegion)
//       );
//     });
//   }, [dateRange, selectedCategory, selectedRegion]);

//   const columns = [
//     {
//       title: "SL",
//       dataIndex: "sl",
//       key: "sl",
//       align: "center",
//       render: (_, __, index) => index + 1,
//     },
//     { title: "Date", dataIndex: "date", key: "date", align: "center" },
//     { title: "Revenue", dataIndex: "Revenue", key: "Revenue", align: "center" },
//     { title: "Users", dataIndex: "Users", key: "Users", align: "center" },
//     {
//       title: "Points Redeemed",
//       dataIndex: "Points Redeemed",
//       key: "Points Redeemed",
//       align: "center",
//     },
//   ];

//   return (
//     <div style={{ width: "100%", padding: "1rem" }} className="mt-4">
//       {/* Filters */}
//       <div
//         style={{
//           display: "flex",
//           gap: "1rem",
//           marginBottom: "1rem",
//           flexWrap: "wrap",
//         }}
//       >
//         <RangePicker
//           picker="month"
//           value={dateRange}
//           onChange={(val) => setDateRange(val)}
//           format="MMM YYYY"
//         />

//         <Select
//           value={selectedRegion}
//           style={{ width: 150 }}
//           onChange={setSelectedRegion}
//         >
//           {regionOptions.map((option) => (
//             <Option key={option} value={option}>
//               {option}
//             </Option>
//           ))}
//         </Select>

//         <Select
//           value={selectedMetric}
//           style={{ width: 150 }}
//           onChange={setSelectedMetric}
//         >
//           <Option value="all">All Metrics</Option>
//           {metricOptions.map((option) => (
//             <Option key={option} value={option}>
//               {option}
//             </Option>
//           ))}
//         </Select>

//         <Select
//           value={chartType}
//           style={{ width: 150 }}
//           onChange={setChartType}
//         >
//           <Option value="Bar">Bar Chart</Option>
//           <Option value="Line">Line Chart</Option>
//           <Option value="Area">Area Chart</Option>
//         </Select>

//         <Button>Export Report</Button>
//       </div>

//       {/* Chart */}
//       <div
//         className="p-4 rounded-lg border"
//         style={{ width: "100%", height: 400, marginTop: "20px" }}
//       >
//         <ResponsiveContainer>
//           {chartType === "Bar" ? (
//             <BarChart
//               data={filteredData}
//               margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
//               barCategoryGap="20%"
//               barGap={13}
//             >
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="date" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               {(selectedMetric === "all" || selectedMetric === "Revenue") && (
//                 <Bar
//                   dataKey="Revenue"
//                   fill="#7086FD"
//                   shape={(props) => (
//                     <Custom3DBarWithWatermark {...props} dataKey="Revenue" />
//                   )}
//                 />
//               )}
//               {(selectedMetric === "all" || selectedMetric === "Users") && (
//                 <Bar
//                   dataKey="Users"
//                   fill="#6FD195"
//                   shape={(props) => (
//                     <Custom3DBarWithWatermark {...props} dataKey="Users" />
//                   )}
//                 />
//               )}
//               {(selectedMetric === "all" ||
//                 selectedMetric === "Points Redeemed") && (
//                 <Bar
//                   dataKey="Points Redeemed"
//                   fill="#FFAE4C"
//                   shape={(props) => (
//                     <Custom3DBarWithWatermark
//                       {...props}
//                       dataKey="Points Redeemed"
//                     />
//                   )}
//                 />
//               )}
//             </BarChart>
//           ) : chartType === "Line" ? (
//             <LineChart
//               data={filteredData}
//               margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
//             >
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="date" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               {(selectedMetric === "all" || selectedMetric === "Revenue") && (
//                 <Line type="monotone" dataKey="Revenue" stroke="#7086FD" />
//               )}
//               {(selectedMetric === "all" || selectedMetric === "Users") && (
//                 <Line type="monotone" dataKey="Users" stroke="#6FD195" />
//               )}
//               {(selectedMetric === "all" ||
//                 selectedMetric === "Points Redeemed") && (
//                 <Line
//                   type="monotone"
//                   dataKey="Points Redeemed"
//                   stroke="#FFAE4C"
//                 />
//               )}
//             </LineChart>
//           ) : (
//             <AreaChart
//               data={filteredData}
//               margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
//             >
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="date" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               {(selectedMetric === "all" || selectedMetric === "Revenue") && (
//                 <Area
//                   type="monotone"
//                   dataKey="Revenue"
//                   stroke="#7086FD"
//                   fill="#7086FD"
//                 />
//               )}
//               {(selectedMetric === "all" || selectedMetric === "Users") && (
//                 <Area
//                   type="monotone"
//                   dataKey="Users"
//                   stroke="#6FD195"
//                   fill="#6FD195"
//                 />
//               )}
//               {(selectedMetric === "all" ||
//                 selectedMetric === "Points Redeemed") && (
//                 <Area
//                   type="monotone"
//                   dataKey="Points Redeemed"
//                   stroke="#FFAE4C"
//                   fill="#FFAE4C"
//                 />
//               )}
//             </AreaChart>
//           )}
//         </ResponsiveContainer>
//       </div>

//       {/* Ant Design Table */}
//       <div style={{ marginTop: "50px" }}>
//         <h1 className="text-[22px] font-bold mb-2">Data Table</h1>
//         <Table
//           bordered={false}
//           size="small"
//           rowClassName="custom-row"
//           components={components}
//           className="custom-table"
//           columns={columns.filter(
//             (col) =>
//               selectedMetric === "all" || col.dataIndex === selectedMetric
//           )}
//           dataSource={filteredData.map((row, index) => ({
//             ...row,
//             key: index,
//           }))}
//           pagination={{ pageSize: 6 }}
//         />
//       </div>
//     </div>
//   );
// }
