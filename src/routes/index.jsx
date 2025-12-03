import { createBrowserRouter } from "react-router-dom";
import Auth from "../Layout/Auth/Auth";
import Main from "../Layout/Main/Main";
import Home from "../Pages/Dashboard/Home";
import PrivacyPolicy from "../Pages/Dashboard/PrivacyPolicy";
import TermsAndConditions from "../Pages/Dashboard/TermsAndCondition";
import ChangePassword from "../Pages/Auth/ChangePassword";
import Login from "../Pages/Auth/Login";
import ForgotPassword from "../Pages/Auth/ForgotPassword";
import VerifyOtp from "../Pages/Auth/VerifyOtp";
import NotFound from "../NotFound";
import Notifications from "../Pages/Dashboard/Notifications";
import AdminProfile from "../Pages/Dashboard/AdminProfile/AdminProfile";
import SaleRepsManagement from "../components/SalesRepsManagement/SaleRepsManagement";
import ResetSuccess from "../Pages/Auth/ResetSuccess";
import SetPassword from "../Pages/Auth/SetPassword";
import CustomerManagement from "../components/customerManagement/customerManagement";
import TierSystem from "../components/TierSystem/TierSystem";
import PromotionManagement from "../components/promotionManagement/PromotionManagement";
import ReportingAnalytics from "../components/reportingAnalytics/ReportingAnalytics";
import SignUp from "../Pages/Auth/SignUp";
import OtpVerification from "../Pages/Auth/OtpVerification";
import ShopInfo from "../Pages/Auth/ShopInfo";
import PrivateRoute from "./ProtectedRoute";
import UserManagement from "../components/loginCredentials/LoginCredentials";

const router = createBrowserRouter([
  {
    // path: "/",
    element: (
      <PrivateRoute>
        <Main />
      </PrivateRoute>
    ),
    // element: <Main />,
    // element: <Auth />,

    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/sell-management",
        element: <SaleRepsManagement />,
      },
      {
        path: "/customer-management",
        element: <CustomerManagement />,
      },
      {
        path: "/point-tyre-system",
        element: <TierSystem />,
      },
      {
        path: "/promotion-management",
        element: <PromotionManagement />,
      },
      {
        path: "/user-management",
        element: <UserManagement />,
      },
      {
        path: "/reporting-analytics",
        element: <ReportingAnalytics />,
      },
      // Burger King end
      {
        path: "/privacy-policy",
        element: <PrivacyPolicy />,
      },
      {
        path: "/terms-and-conditions",
        element: <TermsAndConditions />,
      },
      {
        path: "/change-password",
        element: <ChangePassword />,
      },
      {
        path: "/profile",
        element: <AdminProfile />,
      },
      {
        path: "/notification",
        element: <Notifications />,
      },
    ],
  },
  {
    path: "/auth",
    element: <Auth />,
    children: [
      {
        path: "/auth",
        element: <Login />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "verify-otp",
        element: <VerifyOtp />,
      },
      {
        path: "reset-success",
        element: <ResetSuccess />,
      },
      {
        path: "set-password",
        element: <SetPassword />,
      },
      {
        path: "signup",
        element: <SignUp />,
      },
      {
        path: "otp-verification",
        element: <OtpVerification />,
      },
      {
        path: "shop-info",
        element: <ShopInfo />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
