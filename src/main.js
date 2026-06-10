import { jsx as _jsx } from "react/jsx-runtime";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "@/contexts/AuthProvider";
import { NotificationProvider } from "@/contexts/NotificationProvider";
import "./index.css";
ReactDOM.createRoot(document.getElementById("root")).render(_jsx(React.StrictMode, { children: _jsx(BrowserRouter, { children: _jsx(AuthProvider, { children: _jsx(NotificationProvider, { children: _jsx(App, {}) }) }) }) }));
