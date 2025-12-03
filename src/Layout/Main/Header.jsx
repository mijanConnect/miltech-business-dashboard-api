import { Badge, Button, Dropdown, Menu, Modal } from "antd";
import { useState } from "react";
import { FaRegBell } from "react-icons/fa6";
import { Menu as MenuIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getImageUrl } from "../../components/common/imageUrl";
import { useUser } from "../../provider/User";

const Header = ({ toggleSidebar, isMobile }) => {
  const { user } = useUser();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const navigate = useNavigate();

  const showLogoutConfirm = () => {
    setIsLogoutModalOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLogoutModalOpen(false);
    navigate("/auth/login");
  };

  const handleCancelLogout = () => {
    setIsLogoutModalOpen(false);
  };

  const menu = (
    <Menu>
      <Menu.Item key="settings">
        <Link to="/profile">Settings</Link>
      </Menu.Item>
      <Menu.Item
        key="logout"
        danger
        onClick={showLogoutConfirm}
        style={{ display: "flex", alignItems: "center" }}
      >
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="flex items-center justify-between gap-5 w-full px-6 rounded-md shadow-sm py-2 bg-white border-b border-gray-200">
      <div className="py-2 flex items-center gap-4">
        {isMobile && (
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Toggle Sidebar"
          >
            <MenuIcon size={24} color="#3FAE6A" />
          </button>
        )}
        <h2 className="font-bold text-xl text-secondary">
          Business Dashboard{" "}
          <span className="text-primary">(Premium Plan)</span>
        </h2>
      </div>
      <div className="flex items-center gap-3">
        {/* Profile Icon with Dropdown Menu */}
        <Dropdown overlay={menu} trigger={["click"]} placement="bottomRight">
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="flex flex-row gap-1">
              <p>Hello,</p>{" "}
              <p className="text-[16px] font-semibold">
                {user?.firstName || ""}
              </p>
            </div>
            <img
              style={{
                clipPath: "circle()",
                width: 45,
                height: 45,
                objectFit: "cover",
              }}
              src={getImageUrl(user?.profile)}
              alt="profile-pic"
              className="clip"
            />
          </div>
        </Dropdown>

        {/* Notification Icon */}
        <Link to="/notification" className="h-fit mt-[10px]">
          <Badge count={5} backgroundColor="#3FC7EE">
            <FaRegBell color="#3FAE6A" size={24} />
          </Badge>
        </Link>
      </div>

      {/* Logout Confirmation Modal */}
      <Modal
        title="Confirm Logout"
        visible={isLogoutModalOpen}
        onCancel={handleCancelLogout}
        footer={[
          <Button key="cancel" onClick={handleCancelLogout}>
            Cancel
          </Button>,
          <Button key="logout" danger onClick={handleLogout}>
            Logout
          </Button>,
        ]}
      >
        <p>Are you sure you want to log out?</p>
      </Modal>
    </div>
  );
};

export default Header;
