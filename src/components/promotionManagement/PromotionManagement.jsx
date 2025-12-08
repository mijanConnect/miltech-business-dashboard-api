"use client";
import { useMemo, useState } from "react";
import { Button, Switch, Tooltip, Modal } from "antd";
import { FaEdit } from "react-icons/fa";
import Swal from "sweetalert2";
import NewCampaign from "../promotionManagement/components/NewCampaing.jsx";
import NotificationsModal from "../promotionManagement/components/NotificationsModal.jsx";
import CustomTable from "../../components/common/CustomTable.jsx";
import { useSearchParams } from "react-router-dom";
import {
  useGetPromoDetailsQuery,
  useTogglePromoStatusMutation,
  useUpdatePromotionMutation,
  useCreatePromotionMutation,
} from "../../redux/apiSlices/promoSlice.js";

const PromotionManagement = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const queryParams = [
    { name: "page", value: page },
    { name: "limit", value: limit },
  ];
  if (searchText.trim()) {
    queryParams.push({ name: "searchTerm", value: searchText.trim() });
  }

  const {
    data: response,
    isLoading,
    isFetching,
    error,
  } = useGetPromoDetailsQuery(queryParams);

  const [togglePromoStatus] = useTogglePromoStatusMutation();
  const [updatePromotion] = useUpdatePromotionMutation();
  const [createPromotion] = useCreatePromotionMutation();

  console.log(response);

  const tableData = useMemo(() => {
    const items = response?.data || [];
    return items.map((item, index) => ({
      key: item._id,
      id: index + 1 + (page - 1) * limit,
      promotionName: item.name,
      promotionType: item.promotionType,
      customerReach: item.customerReach,
      customerSegment: item.customerSegment,
      discountPercentage: item.discountPercentage,
      startDate: item.startDate,
      endDate: item.endDate,
      selectedDays:
        item.availableDays && item.availableDays[0] === "all"
          ? ["sun", "mon", "tue", "wed", "thu", "fri", "sat"]
          : item.availableDays || item.promotionDays || [],
      status: item.status === "active" ? "Active" : "Inactive",
      raw: item,
    }));
  }, [response, page, limit]);

  const paginationData = {
    pageSize: limit,
    total: response?.pagination?.total || 0,
    current: page,
  };

  const handlePaginationChange = (newPage, newPageSize) => {
    setPage(newPage);
    if (newPageSize !== limit) {
      setLimit(newPageSize);
    }
  };

  const [isNewCampaignModalVisible, setIsNewCampaignModalVisible] =
    useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isNotifyModalVisible, setIsNotifyModalVisible] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);

  const handleAddCampaign = async (newCampaign) => {
    try {
      const formData = new FormData();

      // Check if all days are selected
      const promotionDays = newCampaign.promotionDays || [];
      const isAllDays = promotionDays.length === 7;

      // Create the data object matching the required structure
      const dataObj = {
        name: newCampaign.promotionName,
        discountPercentage: Number(newCampaign.discountPercentage),
        promotionType: newCampaign.promotionType?.toLowerCase() || "seasonal",
        customerSegment:
          newCampaign.customerSegment?.toLowerCase().replace(/\s+/g, "_") ||
          "all_customer",
        startDate: newCampaign.startDate
          ? new Date(newCampaign.startDate).toISOString()
          : null,
        endDate: newCampaign.endDate
          ? new Date(
              new Date(newCampaign.endDate).setHours(23, 59, 59, 999)
            ).toISOString()
          : null,
        availableDays: isAllDays ? ["all"] : promotionDays,
      };

      // Append data as JSON string
      formData.append("data", JSON.stringify(dataObj));

      // Append image if exists
      if (newCampaign.imageFile) {
        formData.append("image", newCampaign.imageFile);
      }

      await createPromotion(formData).unwrap();

      setIsNewCampaignModalVisible(false);
      Swal.fire({
        icon: "success",
        title: "Campaign Added!",
        text: "Your new campaign has been added successfully.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: error?.data?.message || "Failed to create campaign.",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  const handleEditSave = async (updatedCampaign) => {
    try {
      console.log("Updated Campaign:", updatedCampaign);
      const formData = new FormData();

      // Check if all days are selected
      const promotionDays = updatedCampaign.promotionDays || [];
      console.log("Promotion Days Array:", promotionDays);
      const isAllDays = promotionDays.length === 7;

      // Create the data object matching the required structure
      const dataObj = {
        name: updatedCampaign.promotionName,
        discountPercentage: Number(updatedCampaign.discountPercentage),
        promotionType:
          updatedCampaign.promotionType?.toLowerCase() || "seasonal",
        customerSegment:
          updatedCampaign.customerSegment?.toLowerCase().replace(/\s+/g, "_") ||
          "all_customer",
        startDate: updatedCampaign.startDate
          ? new Date(updatedCampaign.startDate).toISOString()
          : null,
        endDate: updatedCampaign.endDate
          ? new Date(
              new Date(updatedCampaign.endDate).setHours(23, 59, 59, 999)
            ).toISOString()
          : null,
        availableDays: isAllDays ? ["all"] : promotionDays,
      };

      console.log("Data Object to send:", dataObj);

      // Append data as JSON string
      formData.append("data", JSON.stringify(dataObj));

      // Append image if exists
      if (updatedCampaign.imageFile) {
        formData.append("image", updatedCampaign.imageFile);
      }

      await updatePromotion({
        id: editingCampaign.raw._id,
        formData,
      }).unwrap();

      setIsEditModalVisible(false);
      setEditingCampaign(null);
      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Your campaign has been updated successfully.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: error?.data?.message || "Failed to update campaign.",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  const handleEditCancel = () => {
    setIsEditModalVisible(false);
    setEditingCampaign(null);
  };

  const handleEditClick = (record) => {
    setEditingCampaign(record);
    setIsEditModalVisible(true);
  };

  const columns = [
    { title: "SL", dataIndex: "id", key: "id", align: "center" },
    {
      title: "Promotion Name",
      dataIndex: "promotionName",
      key: "promotionName",
      align: "center",
    },
    {
      title: "Promotion Type",
      dataIndex: "promotionType",
      key: "promotionType",
      align: "center",
    },
    {
      title: "Customer Segment",
      dataIndex: "customerSegment",
      key: "customerSegment",
      align: "center",
    },
    {
      title: "Discount Percentage",
      dataIndex: "discountPercentage",
      key: "discountPercentage",
      align: "center",
    },
    {
      title: "Date",
      key: "dateRange",
      align: "center",
      render: (_, record) => {
        const start = record.startDate
          ? new Date(record.startDate).toLocaleDateString()
          : "-";
        const end = record.endDate
          ? new Date(record.endDate).toLocaleDateString()
          : "-";
        return (
          <div className="flex flex-col items-start justify-center gap-1">
            <p>
              <span className="font-bold">Start Date: </span>
              <span className="border border-primary px-[5px] py-[1px] rounded-sm">
                {start}
              </span>
            </p>
            <p>
              <span className="font-bold">End Date: </span>
              <span className="border border-primary px-[5px] py-[1px] rounded-sm">
                {end}
              </span>
            </p>
          </div>
        );
      },
    },
    {
      title: "Days",
      dataIndex: "selectedDays",
      key: "selectedDays",
      align: "center",
      render: (days) => {
        // Check if days array contains "all" or has all 7 days
        const isAllDays = days && (days.includes("all") || days.length === 7);

        if (isAllDays) {
          return (
            <div className="flex justify-center">
              <span className="border border-primary px-3 py-1 rounded-sm text-xs font-semibold bg-primary/10">
                All Days
              </span>
            </div>
          );
        }

        return (
          <div className="flex flex-wrap justify-center gap-1 max-w-[200px]">
            {days && days.length > 0 ? (
              days.map((day, index) => (
                <span
                  key={index}
                  className="border border-primary px-2 py-0 rounded-sm text-xs"
                >
                  {day.substring(0, 3)}
                </span>
              ))
            ) : (
              <span className="text-gray-400">-</span>
            )}
          </div>
        );
      },
    },
    { title: "Status", dataIndex: "status", key: "status", align: "center" },
    {
      title: "Action",
      key: "action",
      align: "center",
      width: 100,
      render: (_, record) => (
        <div className="py-[10px] px-[10px] border border-primary rounded-md">
          <div className="flex gap-2 justify-between align-middle">
            <Tooltip title="Edit">
              <button
                onClick={() => handleEditClick(record)}
                className="text-primary hover:text-green-700 text-[17px]"
              >
                <FaEdit />
              </button>
            </Tooltip>
            <Switch
              size="small"
              checked={record.status === "Active"}
              style={{
                backgroundColor:
                  record.status === "Active" ? "#3fae6a" : "gray",
              }}
              onChange={async (checked) => {
                const result = await Swal.fire({
                  title: "Are you sure?",
                  text: `You are about to change status to ${
                    checked ? "Active" : "Inactive"
                  }.`,
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonColor: "#3085d6",
                  cancelButtonColor: "#d33",
                  confirmButtonText: "Yes, change it!",
                });

                if (result.isConfirmed) {
                  try {
                    const response = await togglePromoStatus(
                      record.raw._id
                    ).unwrap();
                    Swal.fire({
                      title: "Updated!",
                      text: `Status has been changed to ${
                        checked ? "Active" : "Inactive"
                      }.`,
                      icon: "success",
                      timer: 1500,
                      showConfirmButton: false,
                    });
                  } catch (error) {
                    Swal.fire({
                      title: "Error!",
                      text: error?.data?.message || "Failed to update status.",
                      icon: "error",
                      timer: 2000,
                      showConfirmButton: false,
                    });
                  }
                }
              }}
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="">
      <div className="flex justify-between items-end flex-col md:flex-row gap-4 mb-4">
        <div>
          <h1 className="text-[24px] font-bold">Campaigns List</h1>
          <p className="text-[16px] font-normal mt-2">
            View and manage all your active campaigns in one place.
          </p>
        </div>
        <div className="flex gap-4 flex-col md:flex-row">
          <Button
            className="bg-primary px-8 py-5 rounded-full text-white hover:text-secondary text-[17px] font-bold"
            onClick={() => setIsNotifyModalVisible(true)}
          >
            Notification Management
          </Button>
          <Button
            className="bg-primary px-8 py-5 rounded-full text-white hover:text-secondary text-[17px] font-bold"
            onClick={() => setIsNewCampaignModalVisible(true)}
          >
            New Promo & Discount
          </Button>
        </div>
      </div>

      <CustomTable
        data={tableData}
        columns={columns}
        isLoading={isLoading}
        isFetching={isFetching}
        pagination={paginationData}
        onPaginationChange={handlePaginationChange}
        rowKey="key"
      />

      {/* Edit Campaign Modal */}
      <Modal
        title="Edit Campaign"
        visible={isEditModalVisible}
        onCancel={handleEditCancel}
        footer={null}
        width={1000}
        closable={true}
      >
        {editingCampaign && (
          <NewCampaign
            onSave={handleEditSave}
            onCancel={handleEditCancel}
            editData={editingCampaign}
            isEdit={true}
          />
        )}
      </Modal>

      {/* New Campaign Modal */}
      <Modal
        title="New Campaign"
        visible={isNewCampaignModalVisible}
        onCancel={() => setIsNewCampaignModalVisible(false)}
        footer={null}
        width={1000}
        closable={true}
      >
        <NewCampaign
          onSave={handleAddCampaign}
          onCancel={() => setIsNewCampaignModalVisible(false)}
        />
      </Modal>

      {/* Notification Modal */}
      <NotificationsModal
        visible={isNotifyModalVisible}
        onCancel={() => setIsNotifyModalVisible(false)}
      />
    </div>
  );
};

export default PromotionManagement;
