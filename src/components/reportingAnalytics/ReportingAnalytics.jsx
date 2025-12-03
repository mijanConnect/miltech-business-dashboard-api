import React from "react";
import { Tabs } from "antd";
import MerchantReportingAnalytics from "./Tab/MerchantReportingAnalytics";
import CustomerReportingAnalytics from "./Tab/CustomerReportingAnalytics";
import AccountingReports from "./Tab/AccountingReports";

const { TabPane } = Tabs;

export default function ReportingAnalyticsPage() {
  return (
    <div className="">
      <h1 className="text-[28px] font-bold mb-4">Customer Report</h1>
      <CustomerReportingAnalytics />
    </div>
  );
}
