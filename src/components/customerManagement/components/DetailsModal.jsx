import { Modal, Table } from "antd";
import MarchantIcon from "../../../assets/marchant.png";

const DetailsModal = ({
  isVisible,
  selectedRecord,
  onClose,
  columns2,
  data,
}) => {
  return (
    <Modal visible={isVisible} onCancel={onClose} width={700} footer={[]}>
      {selectedRecord && (
        <div>
          <div className="flex flex-row justify-between items-start gap-3 mt-8">
            <img
              src={MarchantIcon}
              alt={selectedRecord.name}
              className="w-214 h-214 rounded-full"
            />
            <div className="flex flex-col gap-2 border border-primary rounded-md p-4 w-full">
              <p className="text-[22px] font-bold text-primary">
                Customer Profile
              </p>
              <p>
                <strong>Name:</strong> {selectedRecord.name}
              </p>
              <p>
                <strong>Location:</strong> {selectedRecord.location}
              </p>
              <p>
                <strong>Total Sales:</strong> $
                {selectedRecord.sales.toFixed
                  ? selectedRecord.sales.toFixed(2)
                  : selectedRecord.sales}
              </p>
              <p>
                <strong>Status:</strong> {selectedRecord.status}
              </p>
              <p className="text-[22px] font-bold text-primary mt-4">
                Loyalty Points
              </p>
              <p>
                <strong>Points Balance:</strong>{" "}
                {selectedRecord.remainingRedemptionPoints}
              </p>
              <p>
                <strong>Points Earned:</strong>{" "}
                {selectedRecord.totalPointsEarned}
              </p>
              <p>
                <strong>Points Redeemed:</strong>{" "}
                {selectedRecord.pointsRedeemed}
              </p>
              <p>
                <strong>Total Transactions:</strong>{" "}
                {selectedRecord.totalTransactions}
              </p>
            </div>
          </div>
          <Table
            columns={columns2}
            dataSource={data}
            rowKey="orderId"
            pagination={{ pageSize: 5 }}
            className="mt-6"
          />
        </div>
      )}
    </Modal>
  );
};

export default DetailsModal;
