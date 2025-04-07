import { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [jobNameSearch, setJobNameSearch] = useState("");
  const ordersPerPage = 30;

  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get("search") || "";
  const jobNumberTerm = searchParams.get("jobNumber") || "";
  const jobNameTerm = searchParams.get("jobName") || "";
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const page = Number(searchParams.get("page")) || 1;
    setCurrentPage(page);

    const fetchOrders = async () => {
      try {
        setLoading(true);
        let apiUrl = `${API_BASE_URL}/orders?page=${page}&limit=${ordersPerPage}`;

        if (jobNumberTerm) {
          apiUrl += `&jobNumber=${encodeURIComponent(jobNumberTerm)}`;
        } else if (searchTerm) {
          apiUrl += `&search=${encodeURIComponent(searchTerm)}`;
          if (jobNameTerm) {
            apiUrl += `&jobName=${encodeURIComponent(jobNameTerm)}`;
          }
        }

        const response = await fetch(apiUrl, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`Network response was not ok ${response.statusText}`);
        }

        const data = await response.json();
        setOrders(data.orders);
        setTotalPages(Math.ceil(data.totalOrders / ordersPerPage));
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [searchParams, API_BASE_URL, searchTerm, jobNumberTerm, jobNameTerm]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    const newParams = { page };

    if (jobNumberTerm) {
      newParams.jobNumber = jobNumberTerm;
    } else {
      newParams.search = searchTerm;
      if (jobNameTerm) {
        newParams.jobName = jobNameTerm;
      }
    }

    setSearchParams(newParams);
    navigate(`?${new URLSearchParams(newParams).toString()}`);
  };

  const handleJobNameSearch = (e) => {
    e.preventDefault();
    if (jobNameSearch.trim()) {
      const newParams = {
        search: searchTerm,
        jobName: jobNameSearch,
      };
      setSearchParams(newParams);
      navigate(
        `?search=${encodeURIComponent(searchTerm)}&jobName=${encodeURIComponent(
          jobNameSearch
        )}`
      );
    }
  };

  return (
    <div className="container overflow-auto py-5">
      {searchTerm &&
        !jobNumberTerm &&
        !["Pending", "Completed"].includes(searchTerm) && (
          <form className="mb-3 d-flex" onSubmit={handleJobNameSearch}>
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search Job Name"
              value={jobNameSearch}
              onChange={(e) => setJobNameSearch(e.target.value)}
            />
            <button className="btn btn-outline-secondary" type="submit">
              Search
            </button>
          </form>
        )}

      {(searchTerm || jobNumberTerm) && (
        <h4 className="search-results-title">
          Showing results for:{" "}
          <strong>
            {jobNumberTerm
              ? `Job Number: ${jobNumberTerm}`
              : jobNameTerm
              ? `${searchTerm} > ${jobNameTerm}`
              : searchTerm}
          </strong>
        </h4>
      )}

      {loading ? (
        <div className="d-flex justify-content-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Job No.</th>
              <th>Date</th>
              <th>Company Name</th>
              <th>Job Name</th>
              <th>Job Quantity</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order._id} className="order-row">
                  <td>
                    <Link to={`/orders/${order._id}`} className="row-link">
                      {order.jobNumber}
                    </Link>
                  </td>
                  <td>
                    <Link to={`/orders/${order._id}`} className="row-link">
                      {new Date(order.createdAt).toLocaleDateString("en-GB")}
                    </Link>
                  </td>
                  <td>
                    <Link to={`/orders/${order._id}`} className="row-link">
                      {order.companyName}
                    </Link>
                  </td>
                  <td>
                    <Link to={`/orders/${order._id}`} className="row-link">
                      {order.jobName}
                    </Link>
                  </td>
                  <td>
                    <Link to={`/orders/${order._id}`} className="row-link">
                      {order.jobQuantity}
                    </Link>
                  </td>
                  <td>
                    <Link to={`/orders/${order._id}`} className="row-link">
                      {order.status}
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      <div className="pagination-controls d-flex gap-2 justify-content-center mt-3">
        <button
          className="btn btn-primary"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            className={`btn btn-primary ${
              currentPage === index + 1 ? "active" : ""
            }`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
        <button
          className="btn btn-primary"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Orders;
