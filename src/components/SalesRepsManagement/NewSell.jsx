import React from "react";
import { Button, Form, Input, Select, DatePicker, Space } from "antd";
import { IoArrowBack } from "react-icons/io5";
import dayjs from "dayjs"; // Import dayjs

const { Option } = Select;

const giftCardsData = [
  { id: 1, name: "Gift Card #1234", points: 500 },
  { id: 2, name: "Gift Card #5678", points: 300 },
  { id: 3, name: "Gift Card #9012", points: 700 },
];

const NewSell = ({ onBack, onSubmit, editingRow }) => {
  const [selectedCards, setSelectedCards] = React.useState([]);

  const toggleSelect = (id) => {
    setSelectedCards((prev) =>
      prev.includes(id) ? prev.filter((cardId) => cardId !== id) : [...prev, id]
    );
  };

  const handleSubmit = (values) => {
    const updatedValues = {
      ...values,
      date: values.date ? values.date.format("YYYY-MM-DD") : undefined, // Convert date to string
    };
    onSubmit(updatedValues); // Calls the onSubmit function passed from parent component
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="flex gap-4 items-center mb-3">
        <Button
          icon={<IoArrowBack />}
          onClick={onBack}
          className="mb-3"
        ></Button>
        <h1 className="text-[24px] font-bold mb-4">New Sell</h1>
      </div>
      <Form
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={editingRow}
      >
        <div className="flex justify-between gap-10">
          <div className="w-full border rounded-lg">
            <h1 className="text-[24px] font-bold text-primary bg-white px-6 py-2">
              New Transaction
            </h1>
            <div className="bg-[#D7F4DE] px-6 py-2 flex flex-col gap-4">
              <Form.Item
                label="Find Customer by Card ID"
                name="customerId"
                className="mb-3"
              >
                <Space.Compact style={{ width: "100%" }}>
                  <Input style={{ width: "70%" }} className="mli-tall-input" />
                  <Button
                    style={{ width: "30%" }}
                    className="h-10 bg-primary text-white font-semibold text-[18px]"
                  >
                    Find
                  </Button>
                </Space.Compact>
              </Form.Item>

              <Form.Item
                label="Available Point"
                name="pointEarned"
                className="mb-3"
              >
                <Input className="mli-tall-input" />
              </Form.Item>
              <Form.Item
                label="Total Bill Amount ($)"
                name="totalAmount"
                className="mb-3"
              >
                <Input className="mli-tall-input" />
              </Form.Item>
              <Form.Item
                label="Point Redeem"
                name="pointRedeem"
                className="mb-3"
              >
                <Input className="mli-tall-input" />
              </Form.Item>
              <Form.Item label="Expiry Date" name="date" className="mb-6">
                <DatePicker
                  style={{ width: "100%" }}
                  className="mli-tall-picker"
                  defaultValue={editingRow ? dayjs(editingRow.date) : null}
                />
              </Form.Item>

              <div className="flex flex-wrap gap-4">
                {giftCardsData.map((card) => (
                  <div
                    key={card.id}
                    onClick={() => toggleSelect(card.id)}
                    className={`flex flex-col items-center border rounded p-4 cursor-pointer ${
                      selectedCards.includes(card.id)
                        ? "border-primary bg-blue-100"
                        : "border-primary bg-white"
                    }`}
                  >
                    <h1 className="text-[14px] font-bold">{card.name}</h1>
                    <p className="text-[14px] font-normal">
                      Available {card.points} Points
                    </p>
                  </div>
                ))}
              </div>
              <Button className="w-full bg-primary text-white mt-4 text-[16px] font-bold p-5">
                Apply Gift Card
              </Button>
              <div className="flex justify-between mt-4 mb-3">
                <Button className="bg-primary text-white">Scan Now</Button>
                <Button className="bg-primary text-white">Add Rewards</Button>
              </div>
            </div>
          </div>

          <div className="w-full border py-8 rounded-lg">
            <h1 className="text-[24px] font-bold text-primary bg-white px-6 pb-6">
              Summery
            </h1>
            <div className="px-6 flex flex-col gap-2">
              <div className="flex justify-between">
                <p className="font-bold text-[24px] text-secondary">
                  Total Bill:
                </p>
                <p className="font-bold text-[24px] text-secondary">$0.00</p>
              </div>
              <div className="flex justify-between">
                <p className="font-bold text-[24px] text-secondary">
                  Points Redeemed:
                </p>
                <p className="font-bold text-[24px] text-secondary">$0.00</p>
              </div>
              <div className="flex justify-between">
                <p className="font-bold text-[24px] text-secondary">
                  Points Earned:
                </p>
                <p className="font-bold text-[24px] text-secondary">+0</p>
              </div>
              <div className="flex justify-between">
                <p className="font-bold text-[24px] text-secondary">
                  Gift Card:
                </p>
                <p className="font-bold text-[24px] text-secondary">+0</p>
              </div>
              <div className="flex justify-between border-t-2 border-primary">
                <p className="font-bold text-[24px] text-secondary">
                  Final Amount:
                </p>
                <p className="font-bold text-[24px] text-secondary">$0.00</p>
              </div>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full bg-primary text-white mt-6 text-[16px] font-bold p-5"
                >
                  Complete Transaction
                </Button>
              </Form.Item>
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default NewSell;
