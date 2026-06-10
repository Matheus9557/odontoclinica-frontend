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
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* 🔑 z-0 evita que fundos cubram dropdowns e notificações */}
      <main className="flex-1 relative z-0">
        <Routes>

          {/* Página inicial → Login */}
          <Route path="/" element={<Login />} />

          {/* Login e Cadastros */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup-dentist" element={<SignupDentist />} />
          <Route path="/signup-patient" element={<SignupPatient />} />

          {/* Dashboard do Dentista */}
          <Route
            path="/dashboard-dentist"
            element={
              <ProtectedRoute>
                <RoleRoute allowed="dentist">
                  <DentistDashboard />
                </RoleRoute>
              </ProtectedRoute>
            }
          />

          {/* Formulário diário do Paciente */}
          <Route
            path="/daily-form"
            element={
              <ProtectedRoute>
                <RoleRoute allowed="patient">
                  <DailyForm />
                </RoleRoute>
              </ProtectedRoute>
            }
          />

          {/* Mensagens */}
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            }
          />

          {/* Perfil (qualquer tipo logado pode acessar) */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

        </Routes>
      </main>

      <Footer />
    </div>
  );
}
