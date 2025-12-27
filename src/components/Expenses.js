import React, { useEffect, useState } from "react";
import { api } from "../api";
import { Link, useNavigate } from "react-router-dom";
import "./Expenses.css";

function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [message, setMessage] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
      const [user, setUser] = useState({});
    const token = localStorage.getItem("token");
    useEffect(() => {
      if (token) {
        const fetchUser = async () => {
          try {
            const res = await api.get("/user/profile");
            setUser(res.data);
          } catch (err) {
            console.error(err);
          }
        };
        fetchUser();
      }
    }, [token]);

  const navigate = useNavigate();

  useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedCategory, startDate, endDate]);

  useEffect(() => {
    fetchExpenses();
  }, [page, perPage, searchQuery, selectedCategory, startDate, endDate]);

  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const params = new URLSearchParams({
        page,
        per_page: perPage,
        search: searchQuery || "",
        category: selectedCategory || "",
        start_date: startDate || "",
        end_date: endDate || "",
      });

      const response = await api.get(`/expenses?${params.toString()}`);
      setExpenses(response.data.expenses);
      setTotalPages(response.data.pages);
    } catch (error) {
      setMessage("Failed to load expenses.");
      console.error(error);
    }
  };

  const deleteExpense = async (id) => {
    if (!window.confirm("Are you sure? This action cannot be undone.")) return;

    try {
      await api.delete(`/expenses/${id}`);
      fetchExpenses();
    } catch (error) {
      console.error(error);
    }
  };

  const filteredExpenses = expenses.filter((exp) => {
    const matchesSearch =
      exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory
      ? exp.category === selectedCategory
      : true;

    const matchesStartDate = startDate
      ? new Date(exp.date) >= new Date(startDate)
      : true;

    const matchesEndDate = endDate
      ? new Date(exp.date) <= new Date(endDate)
      : true;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesStartDate &&
      matchesEndDate
    );
  });

  return (
    <div className="expenses-container">
      <h2 className="page-title">{user.name} Expenses</h2>
      

      {message && <p className="form-message">{message}</p>}

      <div className="filters">
        <input
          className="form-input"
          type="text"
          placeholder="Search by title or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <select
          className="form-input"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
        <option value="">All Categories</option>
        <option value="Food">Food</option>
        <option value="Transportation">Transportation</option>
        <option value="Bills">Bills</option>
        <option value="Travel">Travel</option>
        <option value="Shopping">Shopping</option>
        <option value="Entertainment">Entertainment</option>
        <option value="Groceries">Groceries</option>
        <option value="Health">Health</option>
        <option value="Education">Education</option>
        <option value="Utilities">Utilities</option>
        <option value="Insurance">Insurance</option>
        <option value="Subscriptions">Subscriptions</option>
        <option value="Gifts">Gifts</option>
        <option value="Personal Care">Personal Care</option>
        <option value="Investments">Investments</option>
        <option value="Taxes">Taxes</option>
        <option value="Charity">Charity</option>
        <option value="Business">Business</option>
        <option value="Others">Others</option>
        </select>

        <div><label>Start Date
        <input
          className="form-input"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        /></label></div>

        <div>
        <label>End Date
        <input
          className="form-input"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        /></label></div>
      </div>

      {filteredExpenses.length === 0 ? (
        <div className="empty-state">
          <p>No expenses found.</p>
          <Link to="/add-expense" className="primary-link">
            Add Expense
          </Link>
        </div>
      ) : (
        filteredExpenses.map((expense) => (
          <div key={expense.id} className="expense-card">
            <div className="expense-header">
              <h3>{expense.title}</h3>
              <span className="expense-amount">
                {expense.currency} {expense.amount}
              </span>
            </div>

            <p>Date: {new Date(expense.date).toLocaleDateString()}</p>
            <p>Category: {expense.category}</p>
            {expense.description && (
              <p>Description: {expense.description}</p>
            )}

            <div className="expense-actions">
              <button
                className="danger-button-expense"
                onClick={() => deleteExpense(expense.id)}
              >
                Delete
              </button>
              <button
                className="secondary-button"
                onClick={() => navigate(`/expenses/edit/${expense.id}`)}
              >
                Edit
              </button>
            </div>
          </div>
        ))
      )}

      <div className="pagination">
        <button
          className="secondary-button"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          className="secondary-button"
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>

        <div className="per-page">
          <span>Items per page:</span>
          <select
            className="form-input"
            value={perPage}
            onChange={(e) => {
              setPerPage(Number(e.target.value));
              setPage(1);
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default Expenses;
