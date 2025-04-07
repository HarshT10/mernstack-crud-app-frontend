import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditOrder = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    jobNumber: "",
    companyName: "",
    jobName: "",
    jobType: "",
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
    date: "",
  });

  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const textAreasRef = useRef({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [orderResponse, companiesResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/orders/${orderId}`, {
            credentials: "include",
          }),
          fetch(`${API_BASE_URL}/companies`, { credentials: "include" }),
        ]);
        const orderData = await orderResponse.json();
        const companiesData = await companiesResponse.json();

        if (orderData) {
          setFormData({
            ...orderData,
            date: new Date(orderData.createdAt).toLocaleDateString("en-GB"),
          });
        }

        setCompanies(companiesData);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    fetchData();
  }, [orderId]);

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
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedOrder = await response.json();
        navigate(`/orders/${updatedOrder.updatedOrder._id}`);
      } else {
        console.error("Failed to update order", response.statusText);
      }
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto py-8 ">
      <h2 className="text-center text-3xl font-bold mb-8">Edit Job Card</h2>
      <form onSubmit={handleSubmit}>
        {/* Basic Details */}
        <div className="mb-8 border rounded shadow-sm">
          <div className="bg-blue-500 text-white px-4 py-2 rounded-t">
            Basic Details
          </div>
          <div className="p-4 flex flex-col gap-4">
            <div>
              <label className="block font-bold mb-1">Job Number</label>
              <input
                className="w-full border p-2 rounded"
                readOnly
                value={formData.jobNumber || ""}
                name="jobNumber"
              />
            </div>
            <div>
              <label className="block font-bold mb-1">Date</label>
              <input
                className="w-full border p-2 rounded"
                readOnly
                value={formData.date || ""}
                name="date"
              />
            </div>
            <div>
              <label className="block font-bold mb-1">Job Type</label>
              <select
                name="jobType"
                value={formData.jobType || ""}
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

        {/* Company & Job Info */}
        <div className="mb-8 border rounded shadow-sm">
          <div className="bg-green-500 text-white px-4 py-2 rounded-t">
            Company Name & Job Name Information
          </div>
          <div className="p-4 flex flex-col gap-4">
            <div>
              <label className="block font-bold mb-1">Company Name</label>
              <select
                name="companyName"
                value={formData.companyName || ""}
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
                value={formData.jobName || ""}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="mb-8 border rounded shadow-sm">
          <div className="bg-yellow-500 text-white px-4 py-2 rounded-t">
            Specifications
          </div>
          <div className="p-4 flex flex-col md:flex-row gap-4">
            <div className="w-full">
              <label className="block font-bold mb-1">Job Quantity</label>
              <input
                type="text"
                name="jobQuantity"
                value={formData.jobQuantity || ""}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>
            <div className="w-full">
              <label className="block font-bold mb-1">Size</label>
              <input
                type="text"
                name="size"
                value={formData.size || ""}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>
            <div className="w-full">
              <label className="block font-bold mb-1">Rate</label>
              <input
                type="text"
                name="rate"
                value={formData.rate || ""}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>
          </div>
          <div className="p-4 flex flex-col gap-4">
            <div>
              <label className="block font-bold mb-1">
                Papers and Colors of Papers
              </label>
              <textarea
                name="papersAndColorsOfPapers"
                value={formData.papersAndColorsOfPapers || ""}
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
                Quantity and Size to run on machine
              </label>
              <textarea
                name="quantityAndSizeToRunOnMachine"
                value={formData.quantityAndSizeToRunOnMachine || ""}
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

        {/* Additional Info */}
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
                  value={formData.colorOfInk || ""}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Numbering</label>
                <input
                  type="text"
                  name="numbering"
                  value={formData.numbering || ""}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Punching</label>
                <input
                  type="text"
                  name="punching"
                  value={formData.punching || ""}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold mb-1">Fixed Copy</label>
                <input
                  type="text"
                  name="fixedCopy"
                  value={formData.fixedCopy || ""}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Perforation</label>
                <input
                  type="text"
                  name="perforation"
                  value={formData.perforation || ""}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Lamination</label>
                <input
                  type="text"
                  name="lamination"
                  value={formData.lamination || ""}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />
              </div>
            </div>
            <div>
              <label className="block font-bold mb-1">Type Of Binding</label>
              <input
                type="text"
                name="typeOfBinding"
                value={formData.typeOfBinding || ""}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="block font-bold mb-1">Special Note</label>
              <textarea
                name="specialNote"
                value={formData.specialNote || ""}
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
            className="w-full py-2 bg-blue-600 text-white rounded"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditOrder;
