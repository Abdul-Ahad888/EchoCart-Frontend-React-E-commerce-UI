import React, { useEffect, useState } from "react";

export default function Users() {

  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState("");

    const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken')

    const getAllUsers = () => {
      setLoading(true)

      fetch('https://echo-cart-back-end.vercel.app/api/v1/user/getUsers', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then((res) => {
          if (!res.ok) {
            console.log("Network Responce Error")
          }
          return res.json()
        })
        .then((data) => {
          setUsers(data)
          setLoading(false)
        })
        .catch((err) => {
          console.log(err)
          setLoading(false)
        })
    }

    getAllUsers()
  }, [])



  const isOnline = (lastActive) => {
    if (!lastActive) return false;
    return Date.now() - new Date(lastActive).getTime() < 5 * 60 * 1000;
  };



  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  )



  // Pagination logic
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 8;
  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);


  return (
    <>
      {loading && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ background: "rgba(0,0,0,0.6)", zIndex: "9999" }}
        >
          <div
            className="spinner-border"
            style={{ width: "5rem", height: "5rem", color: "#de7127" }}
            role="status"
          >
            <span className="visually-hidden"></span>
          </div>
        </div>
      )}

      <div className="users-container p-4">
        {/* Top Bar */}
        <div className="users-header d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-semibold mb-0">Users</h5>
          <div className="user-search-box">
            <i className="fas fa-search"></i>
            <input type="text" placeholder="Search users..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1) }} />
          </div>
        </div>

        {/* Table */}
        <div className="table-responsive">
          <table className="table table-borderless table-hover users-table">
            <thead>
              <tr>
                <th className="id-col">ID</th>
                <th className="fullname-col">Full Name</th>
                <th className="status-col">Status</th>
                <th className="role-col">Role</th>
                <th className="email-col">Email</th>
                <th className="registered-col">Registered</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.length > 0 ? (
                currentUsers.map((user, idx) => (
                  <tr key={idx}>
                    <td className="fw-medium id-col">
                      {(idx + 1)}
                    </td>
                    <td className="fw-medium fullname-col">
                      <div className="me-3 user-table-icon fw-bold text-uppercase">
                        {user.username.charAt(0)}
                      </div>
                      <div className="text-capitalize d-inline-block">
                        {user.username}
                      </div>
                    </td>
                    <td className="status-col">
                      <span className="status-wrapper">
                        <span
                          className="status-dot"
                          style={{ backgroundColor: isOnline(user.lastActive) ? "green" : "red" }}>
                        </span>
                        {isOnline(user.lastActive) ? "Online" : "Offline"}
                      </span>
                    </td>
                    <td className="role-col">{user.role}</td>
                    <td className="email-col">{user.email}</td>
                    <td className="registered-col">{new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "2-digit" })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center text-muted">
                    No products found
                  </td>
                </tr>
              )}

            </tbody>
          </table>
        </div>

        {/* Footer with pagination */}
        <div className="users-footer d-flex justify-content-between align-items-center">
          <span className="text-muted small">
            Showing {filteredUsers.length === 0 ? 0 : indexOfFirst + 1} – {Math.min(indexOfLast, filteredUsers.length)} of {filteredUsers.length}
          </span>
          <div className="pagination-controls">
            <button
              className="page-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Prev
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={`page-btn ${currentPage === i + 1 ? "active" : ""}`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="page-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
