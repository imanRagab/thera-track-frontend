import { useState, useEffect } from "react";
import apiClient from "../api/apiClient";
import Sidebar from "../components/Sidebar";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalPatients: 0,
    totalTherapists: 0,
    totalAppointments: 0,
    recentAppointments: [],
    topTreatments: [],
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await apiClient.get("/dashboard");
        setDashboardData(response.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        // Placeholder data in case of failure
        setDashboardData({
          totalPatients: 20,
          totalTherapists: 5,
          totalAppointments: 100,
          recentAppointments: [
            { id: 1, patientName: "John Doe", date: "2024-11-28" },
            { id: 2, patientName: "Jane Smith", date: "2024-11-27" },
            { id: 3, patientName: "Alice Johnson", date: "2024-11-26" },
          ],
          topTreatments: [
            { name: "Physical Therapy", count: 40 },
            { name: "Sports Therapy", count: 30 },
            { name: "Kids Therapy", count: 20 },
          ],
        });
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-100">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-lg font-semibold text-gray-600">Total Patients</h2>
            <p className="text-2xl font-bold text-indigo-600">{dashboardData.totalPatients}</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-lg font-semibold text-gray-600">Total Therapists</h2>
            <p className="text-2xl font-bold text-indigo-600">{dashboardData.totalTherapists}</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-lg font-semibold text-gray-600">Total Appointments</h2>
            <p className="text-2xl font-bold text-indigo-600">{dashboardData.totalAppointments}</p>
          </div>
        </div>

        {/* Recent Appointments */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-700 mb-4">Recent Appointments</h2>
          <div className="bg-white shadow-md rounded-lg p-4">
            <ul>
              {dashboardData.recentAppointments.map((appointment) => (
                <li
                  key={appointment.id}
                  className="border-b border-gray-200 py-2 last:border-0"
                >
                  <span className="font-semibold">{appointment.patientName}</span>{" "}
                  <span className="text-gray-500">{appointment.date}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Top Treatments */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-700 mb-4">Top Treatments</h2>
          <div className="bg-white shadow-md rounded-lg p-4">
            <ul>
              {dashboardData.topTreatments.map((treatment, index) => (
                <li
                  key={index}
                  className="border-b border-gray-200 py-2 last:border-0 flex justify-between"
                >
                  <span>{treatment.name}</span>
                  <span className="font-semibold text-indigo-600">{treatment.count}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
