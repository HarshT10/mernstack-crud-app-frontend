import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [order, setOrder] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch order: ${response.statusText}`);
        }
        const data = await response.json();
        setOrder({
          ...data,
          status: data.status || "Pending",
        });
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };

    fetchOrderDetails();
  }, [orderId, API_BASE_URL]);

  const handleCopyOrder = async () => {
    if (!order) return;
    try {
      const jobNumberResponse = await fetch(`${API_BASE_URL}/orders`, {
        credentials: "include",
      });
      const jobNumberData = await jobNumberResponse.json();
      const newJobNumber = jobNumberData.orders.length + 1;

      const copiedOrder = {
        ...order,
        jobNumber: newJobNumber,
        _id: undefined,
        createdAt: undefined,
        updatedAt: undefined,
      };

      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(copiedOrder),
      });

      if (response.ok) {
        const newOrder = await response.json();
        alert("Order copied successfully!");
        navigate(`/orders/${newOrder.orderId}`);
      } else {
        console.error("Failed to copy order", response.statusText);
      }
    } catch (error) {
      console.error("Error copying order:", error);
    }
  };

  const handleToggleStatus = async () => {
    if (!order) return;
    try {
      const updatedStatus =
        order.status === "Pending" ? "Completed" : "Pending";
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: updatedStatus }),
      });
      if (response.ok) {
        setOrder((prev) => ({ ...prev, status: updatedStatus }));
        alert(`Order status updated to ${updatedStatus}!`);
      } else {
        console.error("Failed to update order status", response.statusText);
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      {order ? (
        <>
          {/* Screen Layout: Split-View (Visible on Screen Only) */}
          <div className="print:hidden">
            <div className="text-center mb-8">
              <h2 className="print-logo">MERN Crud App</h2>
              <h1 className="text-3xl md:text-4xl font-bold">Job Work Order</h1>
            </div>

            {currentUser && currentUser.role !== "staff" && (
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
                <button
                  onClick={() => navigate(`/orders/${orderId}/edit`)}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
                >
                  Edit
                </button>
                <button
                  onClick={handleCopyOrder}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
                >
                  Copy
                </button>
                <button
                  onClick={handleToggleStatus}
                  className={`px-4 py-2 rounded text-white ${
                    order.status === "Pending"
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-yellow-500 hover:bg-yellow-600"
                  }`}
                >
                  {order.status === "Pending"
                    ? "Mark as Completed"
                    : "Mark as Pending"}
                </button>
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded"
                >
                  Print
                </button>
              </div>
            )}

            <div className="mb-8 border rounded shadow-sm">
              <div className="bg-blue-500 text-white px-4 py-2 rounded-t">
                Order Summary
              </div>
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-2xl">
                    <strong>Job Number:</strong> {order.jobNumber}
                  </p>
                  <p className="text-xl">
                    <strong>Status:</strong>{" "}
                    <span
                      className={`px-3 py-1 rounded ${
                        order.status === "Pending"
                          ? "bg-yellow-400 text-white"
                          : "bg-green-500 text-white"
                      }`}
                    >
                      {order.status}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-xl">
                    <strong>Date:</strong>{" "}
                    {new Date(order.createdAt).toLocaleDateString("en-GB")}
                  </p>
                  <p className="text-xl">
                    <strong>Job Type:</strong> {order.jobType}
                  </p>
                </div>
              </div>
            </div>

            {/* Company & Job Information Section */}
            <div className="mb-8 border rounded shadow-sm">
              <div className="bg-green-500 text-white px-4 py-2 rounded-t">
                Company & Job Information
              </div>
              <div className="p-4">
                <p className="text-xl">
                  <strong>Company Name:</strong> {order.companyName}
                </p>
                <p className="text-xl">
                  <strong>Job Name:</strong> {order.jobName}
                </p>
              </div>
            </div>

            {/* Specifications Section */}
            <div className="mb-8 border rounded shadow-sm">
              <div className="bg-yellow-500 text-white px-4 py-2 rounded-t">
                Specifications
              </div>
              <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <p className="text-xl">
                  <strong>Job Quantity:</strong> {order.jobQuantity}
                </p>
                {currentUser && currentUser.role !== "staff" && (
                  <p className="text-xl">
                    <strong>Rate:</strong> {order.rate}
                  </p>
                )}
                <p className="text-xl">
                  <strong>Size:</strong> {order.size}
                </p>
              </div>
            </div>

            {/* Details Section */}
            <div className="mb-8 border rounded shadow-sm">
              <div className="bg-purple-500 text-white px-4 py-2 rounded-t">
                Details
              </div>
              <div className="p-4">
                <div className="mb-4">
                  <h4 className="text-xl font-semibold">Papers & Colors</h4>
                  <pre className="bg-gray-100 p-3 rounded whitespace-pre-wrap">
                    {order.papersAndColorsOfPapers}
                  </pre>
                </div>
                <div className="mb-4">
                  <h4 className="text-xl font-semibold">
                    Quantity & Size to Run on Machine
                  </h4>
                  <pre className="bg-gray-100 p-3 rounded whitespace-pre-wrap">
                    {order.quantityAndSizeToRunOnMachine}
                  </pre>
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
                  <p className="text-xl">
                    <strong>Color of Ink:</strong> {order.colorOfInk}
                  </p>
                  <p className="text-xl">
                    <strong>Numbering:</strong> {order.numbering}
                  </p>
                  <p className="text-xl">
                    <strong>Punching:</strong> {order.punching}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <p className="text-xl">
                    <strong>Fixed Copy:</strong> {order.fixedCopy}
                  </p>
                  <p className="text-xl">
                    <strong>Perforation:</strong> {order.perforation}
                  </p>
                  <p className="text-xl">
                    <strong>Lamination:</strong> {order.lamination}
                  </p>
                </div>
                <div>
                  <p className="text-xl">
                    <strong>Type of Binding:</strong> {order.typeOfBinding}
                  </p>
                </div>
                <div>
                  <h4 className="text-xl font-semibold">Special Note</h4>
                  <pre className="bg-gray-100 p-3 rounded whitespace-pre-wrap">
                    {order.specialNote}
                  </pre>
                </div>
              </div>
            </div>
          </div>

          {/* Print Layout: Single Column (Visible on Print Only) */}
          <div className="hidden print:block py-3 order-details">
            {order ? (
              <div>
                <div className="flex flex-column items-center mb-5">
                  <div>
                    <h2 className="text-2xl my-3">MERN Crud App</h2>
                  </div>
                  <div className="w-100">
                    <hr className="line" />
                    <h4 className="text-3xl fw-bold text-center">
                      Job Work Order
                    </h4>
                    <hr className="line" />
                  </div>
                </div>

                <div className="mb-5 text-center status-mb">
                  <p
                    className={`status ${
                      order.status === "Pending"
                        ? "status-pending"
                        : "status-completed"
                    }`}
                  >
                    {order.status}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-4 md:gap-5 mb-5">
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => navigate(`/orders/${orderId}/edit`)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleCopyOrder}
                  >
                    Copy
                  </button>

                  <button
                    type="button"
                    className={`btn ${
                      order.status === "Pending" ? "btn-success" : "btn-warning"
                    } `}
                    onClick={handleToggleStatus}
                  >
                    {order.status === "Pending"
                      ? "Mark as Completed"
                      : "Mark as Pending"}
                  </button>

                  <button
                    type="button"
                    onClick={handlePrint}
                    className="btn btn-dark"
                  >
                    Print
                  </button>
                </div>

                <div className="flex flex-col md:flex-row text-xl md:text-2xl justify-between print-text">
                  <ul className="flex mb-3 gap-2">
                    <li className="flex items-center gap-2 job-number">
                      <strong>Job Number:</strong>
                      <p className="fw-bold">{order.jobNumber}</p>
                    </li>
                  </ul>
                  <ul className="flex mb-3  gap-2">
                    <li className="flex items-center gap-2">
                      <strong>Job Type:</strong> {order.jobType}
                    </li>
                  </ul>
                  <ul className="flex gap-2 mb-3">
                    <li className="flex items-center gap-2">
                      <strong>Date:</strong>{" "}
                      {new Date(order.createdAt).toLocaleDateString("en-GB")}
                    </li>
                  </ul>
                </div>

                <div className="text-xl md:text-2xl list-group">
                  <ul className="flex mb-3 ">
                    <li className="flex gap-2">
                      <strong>Company Name:</strong> {order.companyName}
                    </li>
                  </ul>
                  <ul className="flex gap-2 mb-3">
                    <li className="flex items-center gap-2">
                      <strong>Job Name:</strong> {order.jobName}
                    </li>
                  </ul>
                </div>

                <div className="flex flex-col md:flex-row justify-between mb-3 text-xl md:text-2xl jq-size">
                  <ul className="flex gap-2 mb-3">
                    <li className="flex items-center gap-2 ">
                      <strong>Job Quantity:</strong> {order.jobQuantity}
                    </li>
                  </ul>
                  <ul className="flex gap-2 mb-3 rate">
                    <li className="flex items-center gap-2 ">
                      <strong>Rate:</strong> {order.rate}
                    </li>
                  </ul>
                  <ul className="flex gap-2 mb-3">
                    <li className="flex items-center gap-2">
                      <strong>Size:</strong> {order.size}
                    </li>
                  </ul>
                </div>

                <div className="mt-4 text-xl md:text-2xl">
                  <ul className="mb-3">
                    <li className="flex flex-col gap-1 text-area">
                      <strong>Papers and Colors of Papers:</strong>
                      <pre>{order.papersAndColorsOfPapers}</pre>
                    </li>
                  </ul>
                  <ul className="mb-3">
                    <li className="flex flex-col gap-1 text-area">
                      <strong>Quantity and Size to run on machine:</strong>
                      <pre>{order.quantityAndSizeToRunOnMachine}</pre>
                    </li>
                  </ul>
                </div>

                <div className="mt-4 flex flex-col md:flex-row justify-between text-xl md:text-2xl ink-punching">
                  <ul className="flex gap-2 mb-3">
                    <li className="flex items-center gap-2">
                      <strong>Color of Ink:</strong> {order.colorOfInk}
                    </li>
                  </ul>
                  <ul className="flex gap-2 mb-3">
                    <li className="flex items-center gap-2">
                      <strong>Punching:</strong> {order.punching}
                    </li>
                  </ul>
                </div>

                <div className="flex flex-col md:flex-row justify-between text-xl md:text-2xl numbering-fc">
                  <ul className="flex gap-2 mb-3">
                    <li className="flex items-center gap-2">
                      <strong>Numbering:</strong> {order.numbering}
                    </li>
                  </ul>
                  <ul className="flex gap-2 mb-3">
                    <li className="flex items-center gap-2">
                      <strong>Fixed Copy:</strong> {order.fixedCopy}
                    </li>
                  </ul>
                </div>

                <div className="flex flex-col md:flex-row justify-between text-xl md:text-2xl perf-lam">
                  <ul className="flex gap-2 mb-3">
                    <li className="flex items-center gap-2">
                      <strong>Perforation:</strong> {order.perforation}
                    </li>
                  </ul>
                  <ul className="flex gap-2 mb-3">
                    <li className="flex items-center gap-2">
                      <strong>Lamination:</strong> {order.lamination}
                    </li>
                  </ul>
                </div>

                <div className="text-xl md:text-2xl">
                  <ul className="flex gap-2 mb-3">
                    <li className="flex items-center gap-2">
                      <strong>Type of Binding:</strong> {order.typeOfBinding}
                    </li>
                  </ul>
                </div>

                <div className="text-xl md:text-2xl">
                  <ul className="flex flex-col gap-1">
                    <li>
                      <strong>Special Note:</strong>
                    </li>
                    <li>
                      <pre>{order.specialNote}</pre>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </>
      ) : (
        <p className="text-center">Loading...</p>
      )}
    </div>
  );
};

export default OrderDetails;
