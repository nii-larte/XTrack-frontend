import React, { useEffect, useState } from "react";
import { api } from "../api";
import Chart from "chart.js/auto";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./Chart.css";

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [monthlyBudget, setMonthlyBudget] = useState(0);
  const [chartInstance, setChartInstance] = useState(null);
  const [trendChartInstance, setTrendChartInstance] = useState(null);
  const [chartType, setChartType] = useState("pie");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [customFormat, setCustomFormat] = useState("PDF");
  const [currency, setCurrency] = useState("USD");
  const [showCategoryBreakdown, setShowCategoryBreakdown] = useState(false);
  const [barHeight, setBarHeight] = useState(300);
  const [trendHeight, setTrendHeight] = useState(300);
  const [showSumaryCard, setShowSumaryCard] = useState(false);
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

  useEffect(() => {
    fetchExpenses();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [expenses, categoryFilter, startDate, endDate]);

  useEffect(() => {
    if (filteredExpenses.length > 0) {
      renderChart();
      renderTrendChart();
    }
  }, [filteredExpenses, chartType]);

   useEffect(() => {
        fetchBudget();
      }, []);

   useEffect(() => {
      const token = localStorage.getItem("token");
      if (!token) return; 

      api.post("/recurring/run", {}, {
        headers: { Authorization: `Bearer ${token}` }
      }).catch(err => {
        console.error("Failed to run recurring expenses:", err);
      });
    }, []);

    useEffect(() => {
    fetchCurrency();
    }, []);


      const fetchCurrency = async () => {
        try {
          const res = await api.get("/user/currency");
          setCurrency(res.data.currency);
        } catch (err) {
          console.error(err);
        }
      };

      const handleCurrencyChange = async (e) => {
        const selected = e.target.value;
        setCurrency(selected);
        try {
          await api.post("/user/currency", { currency: selected });
        } catch (err) {
          console.error(err);
        }
      };

      const CurrencySelector = () => (
        <select value={currency}  onChange={handleCurrencyChange}>
        <option value="" disabled>-- Select Currency --</option>
        <option value="USD">USD - US Dollar</option>
        <option value="EUR">EUR - Euro</option>
        <option value="GBP">GBP - British Pound</option>
        <option value="NGN">NGN - Nigerian Naira</option>
        <option value="GHS">GHS - Ghana Cedi</option>
        <option value="ZAR">ZAR - South African Rand</option>
        <option value="KES">KES - Kenyan Shilling</option>
        <option value="JPY">JPY - Japanese Yen</option>
        <option value="INR">INR - Indian Rupee</option>
        <option value="CAD">CAD - Canadian Dollar</option>
        <option value="AUD">AUD - Australian Dollar</option>
        <option value="CNY">CNY - Chinese Yuan</option>
        <option value="SAR">SAR - Saudi Riyal</option>
        <option value="AED">AED - Emirati Dirham</option>
        <option value="CHF">CHF - Swiss Franc</option>
        <option value="BRL">BRL - Brazilian Real</option>
        <option value="MXN">MXN - Mexican Peso</option>
        <option value="TRY">TRY - Turkish Lira</option>
        <option value="RUB">RUB - Russian Ruble</option>
        <option value="KRW">KRW - South Korean Won</option>
        <option value="SGD">SGD - Singapore Dollar</option>
        <option value="MYR">MYR - Malaysian Ringgit</option>
        <option value="THB">THB - Thai Baht</option>
        <option value="IDR">IDR - Indonesian Rupiah</option>
        <option value="VND">VND - Vietnamese Dong</option>
        <option value="NZD">NZD - New Zealand Dollar</option>
        <option value="PHP">PHP - Philippine Peso</option>
        <option value="PLN">PLN - Polish Zloty</option>
        <option value="SEK">SEK - Swedish Krona</option>
        <option value="NOK">NOK - Norwegian Krone</option>
        <option value="DKK">DKK - Danish Krone</option>
        <option value="HUF">HUF - Hungarian Forint</option>
        <option value="CZK">CZK - Czech Koruna</option>
        <option value="ILS">ILS - Israeli Shekel</option>
        <option value="EGP">EGP - Egyptian Pound</option>
        <option value="PKR">PKR - Pakistani Rupee</option>
        <option value="BDT">BDT - Bangladeshi Taka</option>
        <option value="LKR">LKR - Sri Lankan Rupee</option>
        <option value="CLP">CLP - Chilean Peso</option>
        <option value="COP">COP - Colombian Peso</option>
        <option value="ARS">ARS - Argentine Peso</option>
        </select>
      );

  const fetchExpenses = async () => {
    try {
        const response = await api.get("/expenses", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
        });
      setExpenses(response.data.expenses);
      console.log("Fetched expenses:", response.data);
    } catch (error) {
      console.error("Failed to fetch expenses:", error);
    }
  };

   const fetchBudget = async () => {
          try {
            const token = localStorage.getItem("token");
            const response = await api.get("/user/budget", {
              headers: { Authorization: `Bearer ${token}` }
            });
            setMonthlyBudget(response.data.monthly_budget);
          } catch (err) {
            console.error("Failed to fetch budget:", err);
          }
        };

    const applyFilters = () => {
    if (!expenses || !Array.isArray(expenses)) return;

    let filtered = [...expenses];
    if (categoryFilter) filtered = filtered.filter(exp => exp.category === categoryFilter);
    if (startDate) filtered = filtered.filter(exp => new Date(exp.date) >= new Date(startDate));
    if (endDate) filtered = filtered.filter(exp => new Date(exp.date) <= new Date(endDate));

    setFilteredExpenses(filtered);
    };

  const renderChart = () => {
    const ctx = document.getElementById("expenseChart")?.getContext("2d");
    if (!ctx) return;

    const categoryTotals = {};
    filteredExpenses.forEach(exp => {
      if (!categoryTotals[exp.category]) categoryTotals[exp.category] = 0;
      categoryTotals[exp.category] += exp.amount;
    });

    const data = {
      labels: Object.keys(categoryTotals),
      datasets: [{
        label: "Expenses",
        data: Object.values(categoryTotals),
        backgroundColor: [
          "#4f46e5", "#f59e0b", "#10b981", "#ef4444",
          "#3b82f6", "#8b5cf6", "#f43f5e", "#22c55e"
        ],
      }]
    };

    if (chartInstance) chartInstance.destroy();

    const newChart = new Chart(ctx, {
      type: chartType,
      data: data,
      options: {
        responsive: true,
        plugins: { legend: { position: "bottom" } },
      }
    });

    setChartInstance(newChart);
  };

  const renderTrendChart = () => {
    const ctx = document.getElementById("trendChart")?.getContext("2d");
    if (!ctx) return;

    const dateTotals = {};
    filteredExpenses.forEach(exp => {
      const date = new Date(exp.date).toISOString().split("T")[0];
      if (!dateTotals[date]) dateTotals[date] = 0;
      dateTotals[date] += exp.amount;
    });

    const sortedDates = Object.keys(dateTotals).sort();
    const totals = sortedDates.map(date => dateTotals[date]);

    if (trendChartInstance) trendChartInstance.destroy();

    const newTrendChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: sortedDates,
        datasets: [{
          label: "Daily Expenses",
          data: totals,
          borderColor: "#3b82f6",
          backgroundColor: "rgba(59,130,246,0.2)",
          fill: true
        }]
      },
      options: { responsive: true }
    });

    setTrendChartInstance(newTrendChart);
  };

  const totalThisMonth = filteredExpenses.reduce((sum, exp) => {
    const now = new Date();
    const expDate = new Date(exp.date);
    return expDate.getMonth() === now.getMonth() && expDate.getFullYear() === now.getFullYear()
      ? sum + exp.amount
      : sum;
  }, 0);

    const totalFiltered = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);

    const categoryTotals = {};
    filteredExpenses.forEach(exp => {
    if (!categoryTotals[exp.category]) categoryTotals[exp.category] = 0;
    categoryTotals[exp.category] += exp.amount;
    });

    const highestCategory = Object.keys(categoryTotals).length
    ? Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0]
    : ["None", 0];

    const uniqueDays = new Set(
    filteredExpenses.map(exp => new Date(exp.date).toISOString().split("T")[0])
    );
    const averageDaily = uniqueDays.size ? totalFiltered / uniqueDays.size : 0;

    const remainingBudget = monthlyBudget - totalThisMonth;

    const budgetUsagePercent = monthlyBudget
    ? Number((totalThisMonth / monthlyBudget) * 100).toFixed(2)
    : 0; 

    const breakdown = Object.keys(categoryTotals).map(cat => {
    const total = categoryTotals[cat];
    const percentage = totalFiltered ? (total / totalFiltered) * 100 : 0;
    const count = filteredExpenses.filter(exp => exp.category === cat).length;

    return { category: cat, total, percentage, count };
    });

    const exportCSV = () => {
        if (filteredExpenses.length === 0) return;

        const rows = [
            ["Category", "Amount", "Date", "Description"],
            ...filteredExpenses.map(exp => [
            exp.category,
            exp.amount,
            exp.date,
            exp.description || ""
            ])
        ];

        const csvContent =
            "data:text/csv;charset=utf-8," +
            rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "expenses_report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const exportPDF = () => {
    if (filteredExpenses.length === 0) return;

    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text(` ${user.name} Expense Report`, 14, 20);

    doc.setFontSize(12);
    let y = 35;

    filteredExpenses.forEach((exp, index) => {
        doc.text(
        `${index + 1}. ${exp.category} - ${currency} ${exp.amount} - ${exp.date} - ${exp.description}`,
        14,
        y
        );
        y += 10;
        if (y > 280) {
        doc.addPage();
        y = 20;
        }
    });

    doc.save("expenses_report.pdf");
    };

    const exportChartAsPNG = (chartId, filename) => {
    const canvas = document.getElementById(chartId);
    if (!canvas) return;

    const image = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = image;
    link.download = filename;
    link.click();
    };

   const emailReport = async () => {
      try {
          const response = await api.post("/reports/full-email", {}, {
              headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`
              }
          });
          alert(response.data.message);
          console.log("Email report response:", response.data);
      } catch (err) {
          console.error("Failed to send full report:", err);
      }
  };

    const generateFullReport = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text(`${user.name} Monthly Expense Report`, 14, 20);

    const total = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
    const topCategory = [...filteredExpenses]
        .reduce((acc, exp) => {
        acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
        return acc;
        }, {});

    const top = Object.entries(topCategory).sort((a, b) => b[1] - a[1])[0];

    let summary = `
    Summary:
    - Total expenses: ${currency} ${total.toFixed(2)}
    - Top category: ${top ? top[0] : "N/A"} (${currency} ${top ? top[1].toFixed(2) : 0})
    `;

    doc.setFontSize(12);
    doc.text(summary, 14, 35);

    autoTable(doc, {
        startY: 60,
        head: [["Category", "Amount", "Date", "Description"]],
        body: filteredExpenses.map(exp => [
        exp.category,
        exp.amount,
        exp.date,
        exp.description || ""
        ])
    });

    const expChart = document.getElementById("expenseChart");
    if (expChart) {
        const imgData = expChart.toDataURL("image/png");
        doc.addPage();
        doc.text(`${user.name} Expense Breakdown Chart`, 14, 20);
        doc.addImage(imgData, "PNG", 15, 30, 180, 120);
    }

    const trendChart = document.getElementById("trendChart");
    if (trendChart) {
        const imgData2 = trendChart.toDataURL("image/png");
        doc.addPage();
        doc.text(`${user.name} Expense Trend Chart`, 14, 20);
        doc.addImage(imgData2, "PNG", 15, 30, 180, 120);
    }

    doc.save("Monthly_Expense_Report.pdf");
    };

        const generateReport = async ({ start_date, end_date, format = "PDF" }) => {
            try {
                const response = await api.post(
                    "/reports/custom",
                    {
                        start_date,
                        end_date,
                        format
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    }
                );

                alert(`Report generated and sent to your email as ${format}`);
                console.log("Custom report response:", response.data);
            } catch (err) {
                console.error("Failed to generate report:", err);
            }
        };

        const handleCustomReport = () => {
            generateReport({
                start_date: customStartDate,
                end_date: customEndDate,
                format: customFormat
            });
        };

      const setAutoReport = async (period) => {
          try {
              const response = await api.post(
                  "/reports/auto",
                  { period },
                  {
                      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                  }
              );

              alert(response.data.message);
              console.log("Set auto-report response:", response.data);
          } catch (err) {
              console.error("Failed to set auto-report:", err);
          }
      };
      const generateAutoReport = (period) => {
          setAutoReport(period);
      }

      const saveBudget = async () => {
        try {
          await api.post("/user/budget",
            { monthly_budget: monthlyBudget },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
              }
            }
          );
          console.log("Budget updated successfully");
        } catch (err) {
          console.error("Failed to update budget:", err);
        }
      };

    const cardStyle = {
    padding: "15px",
    borderRadius: "10px",
    background: "#f3f4f6",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    textAlign: "center"
    };

    const tableCell = {
    padding: "10px",
    borderBottom: "1px solid #ddd",
    textAlign: "left"
    };

    return (
      <div className="dashboard-container">
        <h2> Dashboard</h2>

        <button onClick={() => setShowSumaryCard(prev => !prev)}>
          {showSumaryCard ? "Hide" : "Show"} Summary Cards
        </button>

        {showSumaryCard && (
          <div className="summary-cards">
            <div className="summary-card">
              <h4>Total Expenses</h4>
              <p>{currency} {totalFiltered.toFixed(2)}</p>
            </div>

            <div className="summary-card">
              <h4>Highest Category</h4>
              <p>{highestCategory[0]}: {currency} {highestCategory[1].toFixed(2)}</p>
            </div>

            <div className="summary-card">
              <h4>Avg Daily Spend</h4>
              <p>{currency} {averageDaily.toFixed(2)}</p>
            </div>

            <div className="summary-card">
              <h4>Remaining Budget</h4>
              <p style={{ color: remainingBudget < 0 ? "red" : "green" }}>
                {currency} {remainingBudget.toFixed(2)}
              </p>
            </div>
          </div>
        )}

        <CurrencySelector />

        <div className="filters">
          <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
            <option value="">All Categories</option>
            {[
              "Food", "Transportation", "Bills", "Travel", "Shopping",
              "Entertainment", "Groceries", "Health", "Education", "Utilities",
              "Insurance", "Subscriptions", "Gifts", "Personal Care",
              "Investments", "Taxes", "Charity", "Business", "Others"]
              .map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>

          <label>
            Start Date
          <input type="date"  value={startDate} onChange={e => setStartDate(e.target.value)} />
          </label>
          <label>
            End date
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
          </label>
          <button onClick={applyFilters}>Apply Filters</button>
        </div>

        <div className="chart-type-selector">
          <label>Chart Type: </label>
          <select value={chartType} onChange={e => setChartType(e.target.value)}>
            <option value="pie">Pie</option>
            <option value="doughnut">Doughnut</option>
            <option value="bar">Bar</option>
            <option value="line">Line</option>
            <option value="radar">Radar</option>
          </select>
        </div>

      <h3> {user.name} Expense Chart </h3>
      <input type="range" min="100" max="600" value={barHeight} onChange={e => setBarHeight(Number(e.target.value))} />
      <div style={{ height: `${barHeight}px`, width: "100%" }}>
      <canvas id="expenseChart" style={{ width: "100%", height: "400px" }} /></div>

          <div className="chart-buttons">
            <div><button onClick={exportCSV}>Export CSV</button>
            <button onClick={exportPDF}>Export PDF</button></div>
            <div><button onClick={() => exportChartAsPNG("expenseChart", "expense_chart.png")}>Download Category Chart</button>
            <button onClick={() => exportChartAsPNG("trendChart", "trend_chart.png")}>Download Trend Chart</button></div>
            <button onClick={emailReport}>Send Report to Email</button>
            <button onClick={generateFullReport}>Generate Full Monthly Report</button>
          </div>

      <h3 style={{ marginTop: "40px" }}> {user.name} Expense Trend</h3>
      <input type="range" min="100" max="600" value={trendHeight} onChange={e => setTrendHeight(Number(e.target.value))} />
      <div style={{ height: `${trendHeight}px`, width: "100%" }}>
      <canvas id="trendChart" style={{ width: "100%", height: "300px" }} /></div>

        <div className="budget-section">
          <label>Budget Usage: {budgetUsagePercent} %</label>
          <progress value={totalThisMonth} max={monthlyBudget || 1}></progress>

          <label>Monthly Budget:</label>
          <input type="number" value={monthlyBudget} onChange={e => setMonthlyBudget(Number(e.target.value))} />
          <button onClick={() => saveBudget(monthlyBudget)}>Save Budget</button>
        </div>

        <h3>Category Breakdown</h3>
        <button onClick={() => setShowCategoryBreakdown(prev => !prev)}>
          {showCategoryBreakdown ? "Hide" : "Show"} Category Breakdown
        </button>

        {showCategoryBreakdown && (
          <table className="expense-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Total</th>
                <th>% of Spending</th>
                <th>Entries</th>
              </tr>
            </thead>
            <tbody>
              {breakdown.map((row, index) => (
                <tr key={index}>
                  <td>{row.category}</td>
                  <td>{currency} {row.total.toFixed(2)}</td>
                  <td>{row.percentage.toFixed(1)}%</td>
                  <td>{row.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="auto-report">
          <h3>Automated Report Generator</h3>
          <label>Auto Report:</label>
          <select onChange={e => generateAutoReport(e.target.value)}>
            <option value="" disabled>Select Period</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        <div className="custom-report">
          <h3>Customize Report Generator</h3>
          <label>Custom Period:</label>
          <label>
            Start Date
          <input type="date"  value={customStartDate} onChange={e => setCustomStartDate(e.target.value)} />
          </label>
          <label>
            End date
          <input type="date" value={customEndDate} onChange={e => setCustomEndDate(e.target.value)} />
          </label>
          <select value={customFormat} onChange={e => setCustomFormat(e.target.value)}>
            <option value="PDF">PDF</option>
            <option value="CSV">CSV</option>
          </select>
          <button onClick={handleCustomReport}>Generate</button>
        </div>
      </div>
    );
}

export default Dashboard;

