import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import apiClient from "../api/apiClient";
import { useNavigate } from "react-router-dom";

function AddAppointmentPage() {
  const [dateTime, setDateTime] = useState("");
  const [sessionDuration, setSessionDuration] = useState("");
  const [status, setStatus] = useState("PENDING");
  const [therapistId, setTherapistId] = useState("");
  const [patientId, setPatientId] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [therapists, setTherapists] = useState([]);
  const [patients, setPatients] = useState([]);
  const [alert, setAlert] = useState({ isOpen: false, message: "", type: "" });
  const navigate = useNavigate();

  // Fetch therapists and patients for dropdowns
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [therapistsResponse, patientsResponse] = await Promise.all([
          apiClient.get("/therapists"),
          apiClient.get("/patients"),
        ]);
        setTherapists(therapistsResponse.data);
        setPatients(patientsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setAlert({
          isOpen: true,
          message: "Failed to load therapists or patients.",
          type: "error",
        });
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestBody = {
      appointment: {
        dateTime,
        sessionDuration: parseInt(sessionDuration, 10),
        additionalNotes,
        status,
      },
      patient: { id: parseInt(patientId, 10) },
      therapist: { id: parseInt(therapistId, 10) },
    };

    try {
      await apiClient.post("/appointments", requestBody);
      setAlert({
        isOpen: true,
        message: "Appointment added successfully!",
        type: "success",
      });
      setTimeout(() => navigate("/appointments"), 2000);
    } catch (error) {
      console.error("Error adding appointment:", error);
      setAlert({
        isOpen: true,
        message: "Failed to add appointment.",
        type: "error",
      });
    }
  };

  const closeAlert = () => {
    setAlert({ isOpen: false, message: "", type: "" });
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-grow p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Add Appointment</h1>
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
          <div>
            <label htmlFor="dateTime" className="block text-gray-700 font-medium">
              Date & Time
            </label>
            <input
              type="datetime-local"
              id="dateTime"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              className="w-full mt-1 p-2 border rounded focus:ring focus:ring-indigo-300"
              required
            />
          </div>
          <div>
            <label htmlFor="sessionDuration" className="block text-gray-700 font-medium">
              Session Duration (minutes)
            </label>
            <input
              type="number"
              id="sessionDuration"
              value={sessionDuration}
              onChange={(e) => setSessionDuration(e.target.value)}
              className="w-full mt-1 p-2 border rounded focus:ring focus:ring-indigo-300"
              required
            />
          </div>
          <div>
            <label htmlFor="status" className="block text-gray-700 font-medium">
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full mt-1 p-2 border rounded focus:ring focus:ring-indigo-300"
            >
              <option value="PENDING">Pending</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="CANCELED">Canceled</option>
              <option value="COMPLETED">Completed</option>
              <option value="RESCHEDULED">Rescheduled</option>
              <option value="NO_SHOW">No Show</option>
            </select>
          </div>
          <div>
            <label htmlFor="therapistId" className="block text-gray-700 font-medium">
              Therapist
            </label>
            <select
              id="therapistId"
              value={therapistId}
              onChange={(e) => setTherapistId(e.target.value)}
              className="w-full mt-1 p-2 border rounded focus:ring focus:ring-indigo-300"
              required
            >
              <option value="" disabled>
                Select a therapist
              </option>
              {therapists.map((therapist) => (
                <option key={therapist.id} value={therapist.id}>
                  {therapist.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="patientId" className="block text-gray-700 font-medium">
              Patient
            </label>
            <select
              id="patientId"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="w-full mt-1 p-2 border rounded focus:ring focus:ring-indigo-300"
              required
            >
              <option value="" disabled>
                Select a patient
              </option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="additionalNotes" className="block text-gray-700 font-medium">
              Additional Notes
            </label>
            <textarea
              id="additionalNotes"
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              className="w-full mt-1 p-2 border rounded focus:ring focus:ring-indigo-300"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
          >
            Add Appointment
          </button>
        </form>
        {/* Alert */}
        {alert.isOpen && (
          <div
            className={`mt-4 p-4 rounded ${
              alert.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            {alert.message}
            <button
              onClick={closeAlert}
              className="ml-4 text-sm text-gray-600 hover:text-gray-800"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddAppointmentPage;
