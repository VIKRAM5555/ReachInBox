import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from "@mui/material";
import {
  Add as AddIcon,
  Category as CategoryIcon,
  FilterList as FilterListIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";
import ApexCharts from "react-apexcharts";
import { CSVLink } from "react-csv";

const App = () => {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [sortBy, setSortBy] = useState("");
  const [filterByCategory, setFilterByCategory] = useState("");
  const [categories, setCategories] = useState(["Food", "Travel", "Shopping"]);
  const [expenses, setExpenses] = useState([]);
  const [filteredAndSortedExpenses, setFilteredAndSortedExpenses] = useState(
    []
  );

  useEffect(() => {
    // Simulate fetching data from an API
    const fetchedExpenses = [
      {
        amount: 50,
        category: "Food",
        date: "2024-08-01",
        description: "Lunch",
      },
      {
        amount: 20,
        category: "Travel",
        date: "2024-08-02",
        description: "Taxi",
      },
      {
        amount: 100,
        category: "Shopping",
        date: "2024-08-03",
        description: "Groceries",
      },
    ];
    setExpenses(fetchedExpenses);
    setFilteredAndSortedExpenses(fetchedExpenses);
    setTotalExpenses(
      fetchedExpenses.reduce((total, exp) => total + exp.amount, 0)
    );
  }, []);

  useEffect(() => {
    let sortedExpenses = [...expenses];
    if (sortBy === "amount") {
      sortedExpenses.sort((a, b) => a.amount - b.amount);
    } else if (sortBy === "date") {
      sortedExpenses.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortBy === "category") {
      sortedExpenses.sort((a, b) => a.category.localeCompare(b.category));
    }
    const filteredExpenses = filterByCategory
      ? sortedExpenses.filter((exp) => exp.category === filterByCategory)
      : sortedExpenses;
    setFilteredAndSortedExpenses(filteredExpenses);
  }, [expenses, sortBy, filterByCategory]);

  const handleAddExpense = (e) => {
    e.preventDefault();
    const newExpense = { amount: Number(amount), category, date, description };
    const updatedExpenses = [...expenses, newExpense];
    setExpenses(updatedExpenses);
    setTotalExpenses(
      updatedExpenses.reduce((total, exp) => total + exp.amount, 0)
    );
    setAmount("");
    setCategory("");
    setDate("");
    setDescription("");
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    setCategories([...categories, newCategory]);
    setNewCategory("");
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterByCategory(e.target.value);
  };

  const getChartData = () => {
    const labels = filteredAndSortedExpenses.map((exp) => exp.date);
    return {
      lineChart: {
        options: {
          chart: { id: "line-chart" },
          xaxis: { categories: labels },
        },
        series: [
          {
            name: "Expenses",
            data: filteredAndSortedExpenses.map((exp) => exp.amount),
          },
        ],
      },
      pieChart: {
        options: { labels: categories },
        series: categories.map((cat) =>
          filteredAndSortedExpenses
            .filter((exp) => exp.category === cat)
            .reduce((total, exp) => total + exp.amount, 0)
        ),
      },
    };
  };

  const { lineChart, pieChart } = getChartData();

  const cardStyle = {
    borderRadius: "10px",
    padding: "10px",
    margin: "10px",
    position: "relative",
    marginBottom: "20px",
  };

  const iconStyle = {
    position: "absolute",
    top: "10px",
    right: "10px",
  };

  const formFieldStyle = {
    marginBottom: "10px",
  };

  const selectStyle = {
    borderRadius: "5px",
  };

  const menuItemStyle = {
    padding: "10px",
  };

  const buttonStyle = {
    marginTop: "10px",
    backgroundColor: "#3f51b5",
    color: "#fff",
    borderRadius: "5px",
    padding: "10px 20px",
  };

  const tableHeaderStyle = {
    backgroundColor: "#3f51b5",
    color: "#fff",
  };

  const tableRowStyle = {
    backgroundColor: "#f5f5f5",
    margin: "10px 0",
    padding: "10px",
    borderRadius: "8px",
  };

  const exportButtonStyle = {
    position: "absolute",
    top: "10px",
    right: "10px",
    backgroundColor: "#3f51b5",
    color: "#fff",
    borderRadius: "5px",
    padding: "5px 10px",
    fontSize: "12px",
  };

  const exportToCSV = () => {
    const headers = [
      { label: "Amount", key: "amount" },
      { label: "Category", key: "category" },
      { label: "Date", key: "date" },
      { label: "Description", key: "description" },
    ];
    return (
      <CSVLink
        data={filteredAndSortedExpenses}
        headers={headers}
        filename={"expenses.csv"}
        className="btn btn-primary"
        style={exportButtonStyle}
      >
        <DownloadIcon fontSize="small" /> Export to CSV
      </CSVLink>
    );
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "20px",
        padding: "20px",
      }}
    >
      {/* Add Expense Card */}
      <Card style={{ ...cardStyle, backgroundColor: "#e3f2fd" }}>
        <IconButton style={iconStyle}>
          <AddIcon />
        </IconButton>
        <CardContent>
          <Typography variant="h5" style={{ marginBottom: "10px" }}>
            Add Expense
          </Typography>
          <form onSubmit={handleAddExpense}>
            <TextField
              label="Amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              fullWidth
              style={formFieldStyle}
            />
            <FormControl fullWidth style={formFieldStyle}>
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={selectStyle}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat} style={menuItemStyle}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
              style={formFieldStyle}
            />
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              style={formFieldStyle}
            />
            <Button type="submit" style={buttonStyle}>
              Add Expense
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Add Category Card */}
      <Card style={{ ...cardStyle, backgroundColor: "#e8f5e9" }}>
        <IconButton style={iconStyle}>
          <CategoryIcon />
        </IconButton>
        <CardContent>
          <Typography variant="h5" style={{ marginBottom: "10px" }}>
            Add Category
          </Typography>
          <form onSubmit={handleAddCategory}>
            <TextField
              label="New Category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              fullWidth
              style={formFieldStyle}
            />
            <Button type="submit" style={buttonStyle}>
              Add Category
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Line Chart Card */}
      <Card style={{ ...cardStyle, backgroundColor: "#fce4ec" }}>
        <CardContent>
          <Typography variant="h5" style={{ marginBottom: "10px" }}>
            Line Chart
          </Typography>
          <ApexCharts
            options={lineChart.options}
            series={lineChart.series}
            type="line"
            height={300}
          />
        </CardContent>
      </Card>

      {/* Pie Chart Card */}
      <Card
        style={{ ...cardStyle, backgroundColor: "#f3e5f5", width: "350px" }}
      >
        <CardContent>
          <Typography variant="h5" style={{ marginBottom: "10px" }}>
            Pie Chart
          </Typography>
          <ApexCharts
            options={pieChart.options}
            series={pieChart.series}
            type="pie"
            height={500}
          />
        </CardContent>
      </Card>

      {/* Expense Table Card */}
      <Card style={{ ...cardStyle, backgroundColor: "#fff9c4" }}>
        <CardContent>
          <Typography variant="h5" style={{ marginBottom: "10px" }}>
            Expenses
            {exportToCSV()}
          </Typography>
          <FormControl fullWidth style={formFieldStyle}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              onChange={handleSortChange}
              style={selectStyle}
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="amount">Amount</MenuItem>
              <MenuItem value="date">Date</MenuItem>
              <MenuItem value="category">Category</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth style={formFieldStyle}>
            <InputLabel>Filter By Category</InputLabel>
            <Select
              value={filterByCategory}
              onChange={handleFilterChange}
              style={selectStyle}
            >
              <MenuItem value="">All</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat} style={menuItemStyle}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TableContainer
            component={Paper}
            style={{ maxHeight: 400, overflowX: "auto" }}
          >
            <Table>
              <TableHead>
                <TableRow style={tableHeaderStyle}>
                  <TableCell>Amount</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAndSortedExpenses.map((exp, index) => (
                  <TableRow key={index} style={tableRowStyle}>
                    <TableCell>{exp.amount}</TableCell>
                    <TableCell>{exp.category}</TableCell>
                    <TableCell>{exp.date}</TableCell>
                    <TableCell>{exp.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default App;
