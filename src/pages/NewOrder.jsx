import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const NewOrder = () => {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    jobNumber: "",
    companyName: "",
    jobName: "",
    jobType: "Digital",
    jobQuantity: "",
    size: "",
    rate: "",
    papersAndColorsOfPapers: "",
    quantityAndSizeToRunOnMachine: "",
    colorOfInk: "",
    numbering: "",
    punching: "",
    perforation: "",
    lamination: "",
    fixedCopy: "",
    typeOfBinding: "",
    specialNote: "",
    status: "Pending",
    date: today,
  });
  const [companies, setCompanies] = useState([]);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const textAreasRef = useRef({});

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [companiesRes, ordersRes] = await Promise.all([
          fetch(`${API_BASE_URL}/companies`, { credentials: "include" }),
          fetch(`${API_BASE_URL}/orders`, { credentials: "include" }),
        ]);
        const companiesData = await companiesRes.json();
        const ordersData = await ordersRes.json();
        setCompanies(companiesData);
        const maxJobNumber = ordersData.orders.reduce(
          (max, order) => Math.max(max, order.jobNumber),
          0
        );
        setFormData((prevState) => ({
          ...prevState,
          jobNumber: Math.max(maxJobNumber + 1, 4001),
        }));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchInitialData();
  }, [API_BASE_URL]);

  useEffect(() => {
    const scrollY = window.scrollY;

    Object.values(textAreasRef.current).forEach((textarea) => {
      if (textarea) {
        const previousHeight = textarea.style.height;

        textarea.style.height = "auto";
        const newHeight = textarea.scrollHeight + "px";
        textarea.style.height = newHeight;

        if (previousHeight !== newHeight) {
          requestAnimationFrame(() => {
            window.scrollTo({ top: scrollY });
          });
        }
      }
    });
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const { orderId } = await response.json();
        navigate(`/orders/${orderId}`);
      } else {
        console.error("Failed to create new order");
      }
    } catch (error) {
      console.error("Error submitting new order:", error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <h2 className="text-center text-3xl font-bold mb-8">
        Create New Job Card
      </h2>
      <form onSubmit={handleSubmit}>
        {/* Basic Details Section */}
        <div className="mb-8 border rounded shadow-sm">
          <div className="bg-blue-500 text-white px-4 py-2 rounded-t">
            Basic Details
          </div>
          <div className="p-4 flex flex-col gap-4">
            <div>
              <label className="block font-bold mb-1">Job Number</label>
              <input
                type="text"
                name="jobNumber"
                value={formData.jobNumber}
                readOnly
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="block font-bold mb-1">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                readOnly
                className="w-full border p-2 rounded"
              />
            </div>
            <div className="w-full">
              <label className="block font-bold mb-1">Job Type</label>
              <select
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option value="Digital">Digital</option>
                <option value="Offset">Offset</option>
                <option value="Screen">Screen</option>
              </select>
            </div>
          </div>
        </div>

        {/* Company & Job Information Section */}
        <div className="mb-8 border rounded shadow-sm">
          <div className="bg-green-500 text-white px-4 py-2 rounded-t">
            Company Name & Job Name Information
          </div>
          <div className="p-4 grid grid-cols-1 gap-4">
            <div>
              <label className="block font-bold mb-1">Company Name</label>
              <select
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option value="">Select a company</option>
                {companies.map((company) => (
                  <option key={company._id} value={company.companyName}>
                    {company.companyName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-bold mb-1">Job Name</label>
              <input
                type="text"
                name="jobName"
                value={formData.jobName}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>
          </div>
        </div>

        {/* Specifications Section */}
        <div className="mb-8 border rounded shadow-sm">
          <div className="bg-yellow-500 text-white px-4 py-2 rounded-t">
            Specifications
          </div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold mb-1">Job Quantity</label>
              <input
                type="text"
                name="jobQuantity"
                value={formData.jobQuantity}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="block font-bold mb-1">Size</label>
              <input
                type="text"
                name="size"
                value={formData.size}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="block font-bold mb-1">Rate</label>
              <input
                type="text"
                name="rate"
                value={formData.rate}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>
          </div>
          <div className="p-4 grid grid-cols-1 gap-4">
            <div>
              <label className="block font-bold mb-1">
                Papers and Colors of Papers
              </label>
              <textarea
                name="papersAndColorsOfPapers"
                value={formData.papersAndColorsOfPapers}
                onChange={handleChange}
                ref={(el) =>
                  (textAreasRef.current["papersAndColorsOfPapers"] = el)
                }
                style={{ overflow: "hidden", resize: "none" }}
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="block font-bold mb-1">
                Quantity and Size to Run on Machine
              </label>
              <textarea
                name="quantityAndSizeToRunOnMachine"
                value={formData.quantityAndSizeToRunOnMachine}
                onChange={handleChange}
                ref={(el) =>
                  (textAreasRef.current["quantityAndSizeToRunOnMachine"] = el)
                }
                style={{ overflow: "hidden", resize: "none" }}
                className="w-full border p-2 rounded"
              />
            </div>
          </div>
        </div>

        {/* Additional Information Section */}
        <div className="mb-8 border rounded shadow-sm">
          <div className="bg-gray-500 text-white px-4 py-2 rounded-t">
            Additional Information
          </div>
          <div className="p-4 grid grid-cols-1 gap-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold mb-1">Color of Ink</label>
                <input
                  type="text"
                  name="colorOfInk"
                  value={formData.colorOfInk}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Numbering</label>
                <input
                  type="text"
                  name="numbering"
                  value={formData.numbering}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Punching</label>
                <input
                  type="text"
                  name="punching"
                  value={formData.punching}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold mb-1">Perforation</label>
                <input
                  type="text"
                  name="perforation"
                  value={formData.perforation}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Lamination</label>
                <input
                  type="text"
                  name="lamination"
                  value={formData.lamination}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Fixed Copy</label>
                <input
                  type="text"
                  name="fixedCopy"
                  value={formData.fixedCopy}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />
              </div>
            </div>
            <div>
              <label className="block font-bold mb-1">Type of Binding</label>
              <input
                type="text"
                name="typeOfBinding"
                value={formData.typeOfBinding}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="block font-bold mb-1">Special Note</label>
              <textarea
                name="specialNote"
                value={formData.specialNote}
                onChange={handleChange}
                ref={(el) => (textAreasRef.current["specialNote"] = el)}
                style={{ overflow: "hidden", resize: "none" }}
                className="w-full border p-2 rounded"
              />
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="w-full py-2 bg-green-600 text-white rounded"
          >
            Create Job Card
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewOrder;
