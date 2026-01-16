import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar.jsx";
import EventTypesPage from "./pages/EventTypesPage.jsx";
import AvailabilityPage from "./pages/AvailabilityPage.jsx";
import MeetingsPage from "./pages/MeetingsPage.jsx";
import PublicBookingPage from "./pages/PublicBookingPage.jsx";
import ConfirmationPage from "./pages/ConfirmationPage.jsx";

const AdminLayout = ({ children }) => {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content">{children}</main>
    </div>
  );
};

const App = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <AdminLayout>
            <EventTypesPage />
          </AdminLayout>
        }
      />
      <Route
        path="/availability"
        element={
          <AdminLayout>
            <AvailabilityPage />
          </AdminLayout>
        }
      />
      <Route
        path="/meetings"
        element={
          <AdminLayout>
            <MeetingsPage />
          </AdminLayout>
        }
      />
      <Route path="/book/:slug" element={<PublicBookingPage />} />
      <Route path="/book/:slug/confirm" element={<ConfirmationPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
