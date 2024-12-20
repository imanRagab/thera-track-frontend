import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import apiClient from "../api/apiClient";
import DeleteModal from "../components/DeleteModal";
import Alert from "../components/Alert";

function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alert, setAlert] = useState({ isOpen: false, message: "", type: "" });
  const [error, setError] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentPatient, setCurrentPatient] = useState(null);

  // Initial patient state for add/edit
  const [newPatient, setNewPatient] = useState({
    name: "",
    surname: "",
    gender: "Male",
    birthdate: "",
    address: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await apiClient.get("/patients");
        setPatients(response.data);
      } catch (error) {
        setError("Failed to load patients. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

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
      await apiClient.delete(`/patients/${id}`);
      setPatients(patients.filter((patient) => patient.id !== id));
      setAlert({ isOpen: true, message: "Patient deleted successfully!", type: "success" });
    } catch (error) {
      setAlert({ isOpen: true, message: "Failed to delete patient.", type: "error" });
    }
    closeModal();
  };

  const handlePopupOpenForAdd = () => {
    setIsPopupOpen(true);
    setNewPatient({
      name: "",
      surname: "",
      gender: "Male",
      birthdate: "",
      address: "",
      email: "",
      phone: "",
    });
    setCurrentPatient(null);
  };

  const handlePopupOpenForEdit = (patient) => {
    setIsPopupOpen(true);
    setCurrentPatient(patient);
    setNewPatient(patient);
  };

  const handlePopupClose = () => {
    setIsPopupOpen(false);
    setCurrentPatient(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPatient((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddPatient = async () => {
    try {
      const response = await apiClient.post("/patients", newPatient);
      setPatients([...patients, response.data]);
      setAlert({ isOpen: true, message: "Patient added successfully!", type: "success" });
    } catch (error) {
      setAlert({ isOpen: true, message: "Failed to add patient.", type: "error" });
    }
    handlePopupClose();
  };

  const handleEditPatient = async () => {
    try {
      await apiClient.put(`/patients/${currentPatient.id}`, newPatient);
      setPatients((prev) =>
          prev.map((patient) => (patient.id === currentPatient.id ? { ...patient, ...newPatient } : patient))
      );
      setAlert({ isOpen: true, message: "Patient updated successfully!", type: "success" });
    } catch (error) {
      setAlert({ isOpen: true, message: "Failed to update patient.", type: "error" });
    }
    handlePopupClose();
  };

  return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-grow p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Patients</h1>
          <button
              onClick={handlePopupOpenForAdd}
              className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add Patient
          </button>
          {loading ? (
              <p>Loading patients...</p>
          ) : error ? (
              <p className="text-red-500">{error}</p>
          ) : (
              <table className="w-full border-collapse border border-gray-300">
                <thead className="bg-gray-200">
                <tr>
                  <th className="border p-2">ID</th>
                  <th className="border p-2">Name</th>
                  <th className="border p-2">Gender</th>
                  <th className="border p-2">Birthdate</th>
                  <th className="border p-2">Address</th>
                  <th className="border p-2">Actions</th>
                </tr>
                </thead>
                <tbody>
                {patients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-gray-100">
                      <td className="border p-2">{patient.id}</td>
                      <td className="border p-2">{patient.name}</td>
                      <td className="border p-2">{patient.gender}</td>
                      <td className="border p-2">{patient.birthdate}</td>
                      <td className="border p-2">{patient.address}</td>
                      <td className="border p-2">
                        <button
                            onClick={() => handlePopupOpenForEdit(patient)}
                            className="mr-2 px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                          Edit
                        </button>
                        <button
                            onClick={() => openModal(patient.id)}
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
          {isPopupOpen && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded shadow-md">
                  <h2 className="text-xl font-bold mb-4">
                    {currentPatient ? "Edit Patient" : "Add New Patient"}
                  </h2>
                  <input
                      name="name"
                      placeholder="Name"
                      value={newPatient.name}
                      onChange={handleInputChange}
                      className="w-full mb-2 p-2 border"
                  />
                  <input
                      name="surname"
                      placeholder="Surname"
                      value={newPatient.surname}
                      onChange={handleInputChange}
                      className="w-full mb-2 p-2 border"
                  />
                  <select
                      name="gender"
                      value={newPatient.gender}
                      onChange={handleInputChange}
                      className="w-full mb-2 p-2 border"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  <input
                      name="birthdate"
                      placeholder="Birthdate"
                      type="date"
                      value={newPatient.birthdate}
                      onChange={handleInputChange}
                      className="w-full mb-2 p-2 border"
                  />
                  <input
                      name="address"
                      placeholder="Address"
                      value={newPatient.address}
                      onChange={handleInputChange}
                      className="w-full mb-2 p-2 border"
                  />
                  <input
                      name="email"
                      placeholder="Email"
                      value={newPatient.email}
                      onChange={handleInputChange}
                      className="w-full mb-2 p-2 border"
                  />
                  <input
                      name="phone"
                      placeholder="Phone"
                      value={newPatient.phone}
                      onChange={handleInputChange}
                      className="w-full mb-2 p-2 border"
                  />
                  <div className="flex justify-end">
                    <button onClick={handlePopupClose} className="mr-2 px-4 py-2 bg-gray-500 text-white rounded">
                      Cancel
                    </button>
                    <button
                        onClick={currentPatient ? handleEditPatient : handleAddPatient}
                        className="px-4 py-2 bg-blue-600 text-white rounded"
                    >
                      {currentPatient ? "Save" : "Add"}
                    </button>
                  </div>
                </div>
              </div>
          )}

          <DeleteModal
              isOpen={isModalOpen}
              onClose={closeModal}
              onConfirm={() => handleDelete(deleteId)}
              title="Confirm Deletion"
              message="Are you sure you want to delete this patient?"
          />
          {alert.isOpen && <Alert {...alert} onClose={closeAlert} />}
        </div>
      </div>
  );
}

export default PatientsPage;
