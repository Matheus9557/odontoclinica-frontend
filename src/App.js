import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Routes, Route } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Login from "@/pages/Login";
import SignupDentist from "@/pages/SignupDentist";
import SignupPatient from "@/pages/SignupPatient";
import DailyForm from "@/pages/patient/DailyForm";
import DentistDashboard from "@/pages/dentist/DentistDashboard";
import Profile from "@/pages/Profile";
import Messages from "@/pages/messages/Message";
import ProtectedRoute from "@/components/ProtectedRoute";
import RoleRoute from "@/components/RoleRoute";
export default function App() {
    return (_jsxs("div", { className: "flex flex-col min-h-screen", children: [_jsx(Header, {}), _jsx("main", { className: "flex-1 relative z-0", children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Login, {}) }), _jsx(Route, { path: "/login", element: _jsx(Login, {}) }), _jsx(Route, { path: "/signup-dentist", element: _jsx(SignupDentist, {}) }), _jsx(Route, { path: "/signup-patient", element: _jsx(SignupPatient, {}) }), _jsx(Route, { path: "/dashboard-dentist", element: _jsx(ProtectedRoute, { children: _jsx(RoleRoute, { allowed: "dentist", children: _jsx(DentistDashboard, {}) }) }) }), _jsx(Route, { path: "/daily-form", element: _jsx(ProtectedRoute, { children: _jsx(RoleRoute, { allowed: "patient", children: _jsx(DailyForm, {}) }) }) }), _jsx(Route, { path: "/messages", element: _jsx(ProtectedRoute, { children: _jsx(Messages, {}) }) }), _jsx(Route, { path: "/profile", element: _jsx(ProtectedRoute, { children: _jsx(Profile, {}) }) })] }) }), _jsx(Footer, {})] }));
}
