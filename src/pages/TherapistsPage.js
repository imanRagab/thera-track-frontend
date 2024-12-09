import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import apiClient from "../api/apiClient";
import Alert from "../components/Alert";
import DeleteModal from "../components/DeleteModal";

function TherapistsPage() {
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alert, setAlert] = useState({ isOpen: false, message: "", type: "" });
  const [error, setError] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentTherapist, setCurrentTherapist] = useState(null);
  
 

  
 
 
 


  // Initial patient state for add/edit
  const [newTherapist, setNewTherapist] = useState({
    name: "",           // Required
    surname: "",        // Required
    gender: "Not specified", // Default to "Not specified"
    birthDate: "",      // Optional, ISO string format (e.g., "YYYY-MM-DD")
    email: "",          // Optional
    phone: "",          // Optional, validated against a pattern
    
 
  });



// Fetch all therapists
useEffect(() => {
  const fetchTherapists = async () => {
    try {
      const response = await apiClient.get("/therapists");
      setTherapists(response.data);
    } catch (err) {
      setError("Failed to load therapists. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  fetchTherapists();
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

  const handleDelete = async () => {
    try {
      await apiClient.delete(`/therapists/${deleteId}`);
      setTherapists(therapists.filter((therapist) => therapist.id !== deleteId));
      setAlert({ isOpen: true, message: "Therapist deleted successfully!", type: "success" });
    } catch (error) {
      setAlert({ isOpen: true, message: "Failed to delete therapist.", type: "error" });
    }
    closeModal();
  };


  const handlePopupOpenForAdd = () => {
    setIsPopupOpen(true);
    setNewTherapist({
      name: "",
      surname: "",
      email: "",
      phone: "",
      gender: "Not specified",
      birthDate: "",
    });
    setCurrentTherapist(null);
  };
  

  const handlePopupOpenForEdit = (therapist) => {
    setIsPopupOpen(true);
    setCurrentTherapist(therapist);
    setNewTherapist(therapist);
  };

  const handlePopupClose = () => {
    setIsPopupOpen(false);
    setCurrentTherapist(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTherapist((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTherapist = async () => {
    try {
      const response = await apiClient.post("/therapists", newTherapist);
      setTherapists([...therapists, response.data]);
      setAlert({ isOpen: true, message: "Therapist added successfully!", type: "success" });
    } catch (error) {
      setAlert({ isOpen: true, message: "Failed to add therapist.", type: "error" });
    }
    handlePopupClose();
  };

  const handleEditTherapist = async () => {
    try {
      await apiClient.put(`/therapists/${currentTherapist.id}`, newTherapist);
      setTherapists((prev) =>
        prev.map((therapist) =>
          therapist.id === currentTherapist.id ? { ...therapist, ...newTherapist } : therapist
        )
      );
      setAlert({ isOpen: true, message: "Therapist updated successfully!", type: "success" });
    } catch (error) {
      setAlert({ isOpen: true, message: "Failed to update therapist.", type: "error" });
    }
    handlePopupClose();
  };
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-grow p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Therapists</h1>
        <button
          onClick={handlePopupOpenForAdd}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Therapist
        </button>
        {loading ? (
          <p>Loading therapists...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="border p-2">ID</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">Specialization</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {therapists.map((therapist) => (
 
 
 
 



                <tr key={therapist.id} className="hover:bg-gray-100">
                  <td className="border p-2">{therapist.id}</td>
                  <td className="border p-2">{therapist.name}</td>
                  <td className="border p-2">{therapist.gender}</td>
                  <td className="border p-2">{therapist.birthdate}</td>
                  <td className="border p-2">{therapist.email}</td>
                  <td className="border p-2">
                    <button
                      onClick={() => handlePopupOpenForEdit(therapist)}
                      className="mr-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                       Edit
  </button>
  <button
      onClick={() => openModal(therapist.id)}
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

        {/* Add/Edit Therapist Popup */}
        {isPopupOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-md">
              <h2 className="text-xl font-bold mb-4">
                {currentTherapist ? "Edit Therapist" : "Add New Therapist"}
              </h2>
              <input
                  name="name"
                  placeholder="Name"
                  value={newTherapist.name}
                  onChange={handleInputChange}
                  className="w-full mb-2 p-2 border"
              />
              <input
                  name="surname"
                  placeholder="Surname"
                  value={newTherapist.surname}
                  onChange={handleInputChange}
                  className="w-full mb-2 p-2 border"
              />
              <select
                  name="gender"
                  value={newTherapist.gender}
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
                  value={newTherapist.birthdate}
                  onChange={handleInputChange}
                  className="w-full mb-2 p-2 border"
              />
              <input
                  name="address"
                  placeholder="Address"
                  value={newTherapist.address}
                  onChange={handleInputChange}
                  className="w-full mb-2 p-2 border"
              />
              <input
                  name="email"
                  placeholder="Email"
                  value={newTherapist.email}
                  onChange={handleInputChange}
                  className="w-full mb-2 p-2 border"
              />
              <input
                  name="phone"
                  placeholder="Phone"
                  value={newTherapist.phone}
                  onChange={handleInputChange}
                  className="w-full mb-2 p-2 border"
              />
              <div className="flex justify-end">
                <button onClick={handlePopupClose} className="mr-2 px-4 py-2 bg-gray-500 text-white rounded">
                  Cancel
                </button>
                <button
                    onClick={currentTherapist ? handleEditTherapist : handleAddTherapist}
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  {currentTherapist ? "Save" : "Add"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        <DeleteModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onConfirm={handleDelete}
          title="Delete Therapist?"
          message="Are you sure you want to delete this therapist?"
        />
          {alert.isOpen && <Alert {...alert} onClose={closeAlert} />}

         
      </div>
    </div>
  );
}

export default TherapistsPage;