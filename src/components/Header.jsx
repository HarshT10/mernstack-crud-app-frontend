import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [jobNumberSearch, setJobNumberSearch] = useState("");
  const navigate = useNavigate();
  const { currentUser, logout, isAdmin, isSystemAdmin } = useAuth();

  const handleGeneralSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate("/orders?search=" + encodeURIComponent(searchTerm));
    } else {
      navigate("/orders");
    }
    setSearchTerm("");
  };

  const handleJobNumberSearch = (e) => {
    e.preventDefault();
    if (jobNumberSearch.trim()) {
      navigate("/orders?jobNumber=" + encodeURIComponent(jobNumberSearch));
    } else {
      navigate("/orders");
    }
    setJobNumberSearch("");
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
        <div className="container">
          <Link to="/" className="navbar-brand">
            <h2>MERN Crud App</h2>
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarTogglerDemo02"
            aria-controls="navbarTogglerDemo02"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {currentUser ? (
            <>
              <div
                className="collapse gap-4 navbar-collapse"
                id="navbarTogglerDemo02"
              >
                <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                  <li className="nav-item">
                    <Link to="/" className="nav-link text-black">
                      All Job Cards
                    </Link>
                  </li>

                  {isAdmin && (
                    <>
                      <li className="nav-item">
                        <Link to="/orders/new" className="nav-link text-black">
                          New Job Card
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link
                          to="/companies/add"
                          className="nav-link text-black"
                        >
                          Add Company
                        </Link>
                      </li>
                    </>
                  )}

                  {isSystemAdmin && (
                    <>
                      <li className="nav-item">
                        <Link
                          to="/manage/users"
                          className="nav-link text-black"
                        >
                          Manage Users
                        </Link>
                      </li>
                    </>
                  )}

                  {isAdmin && !isSystemAdmin && (
                    <>
                      <li className="nav-item">
                        <Link
                          to="/manage/staff"
                          className="nav-link text-black"
                        >
                          Manage Staff
                        </Link>
                      </li>
                    </>
                  )}
                </ul>

                <div className="d-flex flex-column flex-md-row gap-2 visible">
                  <form
                    className="d-flex"
                    role="search"
                    onSubmit={handleGeneralSearch}
                  >
                    <input
                      className="form-control me-2"
                      type="search"
                      placeholder="Company, Status"
                      aria-label="Search by name or status"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="btn btn-primary" type="submit">
                      Search
                    </button>
                  </form>

                  <form
                    className="d-flex"
                    role="search"
                    onSubmit={handleJobNumberSearch}
                  >
                    <input
                      className="form-control me-2"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="Job Number"
                      aria-label="Search by job number"
                      value={jobNumberSearch}
                      onChange={(e) => {
                        if (/^\d*$/.test(e.target.value)) {
                          setJobNumberSearch(e.target.value);
                        }
                      }}
                    />
                    <button className="btn btn-primary" type="submit">
                      Search
                    </button>
                  </form>
                </div>

                <div className="my-3 ms-0 md:ms-4 flex items-center justify-center gap-2 visible">
                  <span>{currentUser.username}</span>
                  <button onClick={handleLogout} className="btn btn-danger">
                    Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <Link to="/login" className="btn btn-outline-primary">
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
