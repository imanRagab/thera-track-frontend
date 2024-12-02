import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import apiClient from "../api/apiClient";
import DeleteModal from "../components/DeleteModal";
import Alert from "../components/Alert";

function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null); // ID of the appointment to delete
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [alert, setAlert] = useState({ isOpen: false, message: "", type: "" });
  const [error, setError] = useState("");

  const fetchAppointments = async () => {
    try {
      const response = await apiClient.get("/appointments");
      setAppointments(response.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setError("Failed to load appointments. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

    // Open modal and set the ID of the appointment to delete
    const openModal = (id) => {
      setDeleteId(id);
      setIsModalOpen(true);
    };
  
    const closeModal = () => {
      setDeleteId(null);
      setIsModalOpen(false);
    };

    const closeAlert = () => {
      setAlert({ isOpen: false, message: "", type: "" });
    };
  


  const handleDelete = async (id) => {
    try {
      await apiClient.delete(`/appointments/${id}`);
      setAppointments(appointments.filter((appointment) => appointment.id !== id));
      setAlert({
        isOpen: true,
        message: "Appointment deleted successfully!",
        type: "success",
      });
    } catch (error) {
      console.error("Error deleting appointment:", error);
      setAlert({
        isOpen: true,
        message: "Failed to delete the appointment.",
        type: "error",
      });
    }
    closeModal();
  };

  const handleEdit = (id) => {
    // Logic for editing an appointment
    alert(`Edit appointment with ID: ${id}`);
  };

  const handleAdd = async () => {
    try {
      const newAppointment = {
        dateTime: new Date().toISOString(),
        sessionDuration: 60,
        status: "Scheduled",
      };
      const response = await apiClient.post("/appointments", newAppointment);
      setAppointments([...appointments, response.data]);
    } catch (error) {
      console.error("Error adding appointment:", error);
      alert("Failed to add appointment.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-grow p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Appointments</h1>
        <button
          onClick={handleAdd}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Appointment
        </button>
        {loading ? (
          <p className="text-gray-600">Loading appointments...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="border border-gray-300 p-2 text-left">ID</th>
                <th className="border border-gray-300 p-2 text-left">Date & Time</th>
                <th className="border border-gray-300 p-2 text-left">Session Duration</th>
                <th className="border border-gray-300 p-2 text-left">Status</th>
                <th className="border border-gray-300 p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.id} className="hover:bg-gray-100">
                  <td className="border border-gray-300 p-2">{appointment.id}</td>
                  <td className="border border-gray-300 p-2">
                    {appointment.dateTime || "N/A"}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {appointment.sessionDuration} mins
                  </td>
                  <td className="border border-gray-300 p-2">
                    {appointment.status || "N/A"}
                  </td>
                  <td className="border border-gray-300 p-2">
                    <button
                      onClick={() => handleEdit(appointment.id)}
                      className="mr-2 px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openModal(appointment.id)}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {/* Use Modal Component */}
        <DeleteModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onConfirm={() => {
            handleDelete(deleteId)
          }}
          title="Confirm Deletion"
          message="Are you sure you want to delete this appointment?"
        />
        {/* Alert */}
        {alert.isOpen && (
          <Alert
            message={alert.message}
            type={alert.type}
            onClose={closeAlert}
          />
        )}
      </div>
    </div>
  );
}

export default AppointmentsPage;
