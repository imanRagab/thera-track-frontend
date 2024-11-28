import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar"; // Sidebar reused from the previous version
import apiClient from "../api/apiClient";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get("/dashboard");
        setDashboardData(response.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setDashboardData({
          upcomingAppointments: [],
          patientsCount: 0,
          appointmentsCount: 0,
          therapistsCount: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="text-center text-xl">Loading...</div>;
  }

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-grow p-6 bg-gray-100">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-4 shadow rounded">
            <h2 className="text-xl font-semibold text-gray-700">Patients</h2>
            <p className="text-3xl font-bold text-indigo-600">{dashboardData?.patientsCount || 0}</p>
          </div>
          <div className="bg-white p-4 shadow rounded">
            <h2 className="text-xl font-semibold text-gray-700">Appointments</h2>
            <p className="text-3xl font-bold text-indigo-600">{dashboardData?.appointmentsCount || 0}</p>
          </div>
          <div className="bg-white p-4 shadow rounded">
            <h2 className="text-xl font-semibold text-gray-700">Therapists</h2>
            <p className="text-3xl font-bold text-indigo-600">{dashboardData?.therapistsCount || 0}</p>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <h2 className="text-2xl font-bold mb-4">Upcoming Appointments</h2>
        {dashboardData?.upcomingAppointments?.length > 0 ? (
          <table className="w-full bg-white shadow rounded">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Duration</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.upcomingAppointments.map((appointment, index) => (
                <tr key={appointment.id} className="text-gray-600">
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">
                    {appointment.dateTime ? new Date(appointment.dateTime).toLocaleString() : "N/A"}
                  </td>
                  <td className="border px-4 py-2">{appointment.sessionDuration} mins</td>
                  <td className="border px-4 py-2">{appointment.status || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-600">No upcoming appointments available.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
