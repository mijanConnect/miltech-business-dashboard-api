import React from "react";
import { Tabs } from "antd";
import RevenuePerUser from "./Reports/RevenuePerUser";
import PointsRedeemed from "./Reports/PointsRedeemed";
import CashReceivable from "./Reports/CashReceivable";
import CashCollections from "./Reports/CashCollections";

const { TabPane } = Tabs;

export default function AccountingReports() {
  return (
    <div style={{ width: "100%" }}>
      <h1 className="text-[30px] font-bold mb-2">Accounting Reports</h1>
      <Tabs defaultActiveKey="1" type="card">
        <TabPane
          tab={<span className="custom-tab-text">Cash Collection</span>}
          key="1"
        >
          <CashCollections />
        </TabPane>
        <TabPane
          tab={<span className="custom-tab-text">Cash Receivable</span>}
          key="2"
        >
          <CashReceivable />
        </TabPane>
        <TabPane
          tab={<span className="custom-tab-text">Revenue Per User</span>}
          key="3"
        >
          <RevenuePerUser />
        </TabPane>
        <TabPane
          tab={<span className="custom-tab-text">Points Redeemed</span>}
          key="4"
        >
          <PointsRedeemed />
        </TabPane>
      </Tabs>
    </div>
  );
}
