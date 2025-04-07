import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AddCompany = () => {
  const [companyName, setCompanyName] = useState("");
  const [companies, setCompanies] = useState([]);
  // State for editing: store the company _id being edited and its new name
  const [editingCompanyId, setEditingCompanyId] = useState(null);
  const [editingCompanyName, setEditingCompanyName] = useState("");
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/companies`, {
        credentials: "include",
      });
      const data = await response.json();
      setCompanies(data);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  // Handle adding a new company
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/companies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ companyName }),
      });

      if (response.ok) {
        setCompanyName("");
        fetchCompanies();
      } else {
        console.error("Failed to add company");
      }
    } catch (error) {
      console.error("Error adding company:", error);
    }
  };

  // Handle updating an existing company
  const handleUpdate = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/companies/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ companyName: editingCompanyName }),
      });

      if (response.ok) {
        // Refresh the companies list after update
        fetchCompanies();
        setEditingCompanyId(null);
        setEditingCompanyName("");
      } else {
        console.error("Failed to update company");
      }
    } catch (error) {
      console.error("Error updating company:", error);
    }
  };

  return (
    <div className="py-5">
      <h2 className="text-center mb-4 new-company-title">Add Company</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label fw-bold text-xl">Company Name</label>
          <input
            type="text"
            className="form-control"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Add Company
        </button>
      </form>

      <h3 className="mt-5 mb-3 fw-bold text-xl">Current Companies</h3>
      <ul className="list-group">
        {companies.map((company) => (
          <li
            key={company._id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            {editingCompanyId === company._id ? (
              <>
                <input
                  type="text"
                  className="form-control me-2"
                  value={editingCompanyName}
                  onChange={(e) => setEditingCompanyName(e.target.value)}
                />
                <button
                  className="btn btn-success btn-sm me-2"
                  onClick={() => handleUpdate(company._id)}
                >
                  Save
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setEditingCompanyId(null);
                    setEditingCompanyName("");
                  }}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span>{company.companyName}</span>
                <button
                  className="btn btn-warning btn-sm"
                  onClick={() => {
                    setEditingCompanyId(company._id);
                    setEditingCompanyName(company.companyName);
                  }}
                >
                  Edit
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AddCompany;
