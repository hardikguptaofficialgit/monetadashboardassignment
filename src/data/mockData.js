// admin data includes full editing access in the demo
const adminTransactions = [
  { id: 1, date: "2026-01-03", amount: 75000, category: "Salary", type: "income", description: "Monthly salary" },
  { id: 2, date: "2026-01-05", amount: 1200, category: "Food", type: "expense", description: "Grocery shopping" },
  { id: 3, date: "2026-01-08", amount: 3500, category: "Shopping", type: "expense", description: "Winter jacket" },
  { id: 4, date: "2026-01-12", amount: 15000, category: "Rent", type: "expense", description: "Monthly rent" },
  { id: 5, date: "2026-01-15", amount: 800, category: "Transport", type: "expense", description: "Metro pass" },
  { id: 6, date: "2026-01-18", amount: 5000, category: "Freelance", type: "income", description: "Logo design project" },
  { id: 7, date: "2026-01-22", amount: 2200, category: "Utilities", type: "expense", description: "Electricity bill" },
  { id: 8, date: "2026-01-25", amount: 1800, category: "Entertainment", type: "expense", description: "Concert tickets" },
  { id: 9, date: "2026-02-01", amount: 75000, category: "Salary", type: "income", description: "Monthly salary" },
  { id: 10, date: "2026-02-03", amount: 950, category: "Food", type: "expense", description: "Restaurant dinner" },
  { id: 11, date: "2026-02-07", amount: 4500, category: "Health", type: "expense", description: "Doctor visit + meds" },
  { id: 12, date: "2026-02-10", amount: 15000, category: "Rent", type: "expense", description: "Monthly rent" },
  { id: 13, date: "2026-02-14", amount: 2500, category: "Shopping", type: "expense", description: "Valentine gift" },
  { id: 14, date: "2026-02-17", amount: 12000, category: "Freelance", type: "income", description: "Web dev project" },
  { id: 15, date: "2026-02-20", amount: 600, category: "Transport", type: "expense", description: "Cab rides" },
  { id: 16, date: "2026-02-24", amount: 1500, category: "Entertainment", type: "expense", description: "OTT subscriptions" },
  { id: 17, date: "2026-03-01", amount: 75000, category: "Salary", type: "income", description: "Monthly salary" },
  { id: 18, date: "2026-03-04", amount: 1400, category: "Food", type: "expense", description: "Weekly groceries" },
  { id: 19, date: "2026-03-06", amount: 8000, category: "Shopping", type: "expense", description: "New headphones" },
  { id: 20, date: "2026-03-10", amount: 15000, category: "Rent", type: "expense", description: "Monthly rent" },
  { id: 21, date: "2026-03-13", amount: 3000, category: "Education", type: "expense", description: "Online course" },
  { id: 22, date: "2026-03-15", amount: 8000, category: "Freelance", type: "income", description: "UI/UX consultation" },
  { id: 23, date: "2026-03-18", amount: 1200, category: "Transport", type: "expense", description: "Train tickets" },
  { id: 24, date: "2026-03-21", amount: 2000, category: "Utilities", type: "expense", description: "Internet + phone bill" },
  { id: 25, date: "2026-03-25", amount: 700, category: "Food", type: "expense", description: "Coffee & snacks" },
  { id: 26, date: "2026-03-28", amount: 20000, category: "Investment", type: "income", description: "Mutual fund returns" },
  { id: 27, date: "2026-03-30", amount: 5000, category: "Health", type: "expense", description: "Gym membership" },
  { id: 28, date: "2026-04-01", amount: 75000, category: "Salary", type: "income", description: "Monthly salary" },
  { id: 29, date: "2026-04-02", amount: 900, category: "Food", type: "expense", description: "Lunch orders" },
];

// viewer data is a separate read-only dataset for role switching
const viewerTransactions = [
  { id: 101, date: "2026-02-01", amount: 42000, category: "Salary", type: "income", description: "Primary income" },
  { id: 102, date: "2026-02-06", amount: 2300, category: "Food", type: "expense", description: "Weekly groceries" },
  { id: 103, date: "2026-02-10", amount: 13000, category: "Rent", type: "expense", description: "Shared apartment rent" },
  { id: 104, date: "2026-02-18", amount: 900, category: "Transport", type: "expense", description: "Metro recharge" },
  { id: 105, date: "2026-03-01", amount: 42000, category: "Salary", type: "income", description: "Primary income" },
  { id: 106, date: "2026-03-07", amount: 1800, category: "Food", type: "expense", description: "Dining and groceries" },
  { id: 107, date: "2026-03-12", amount: 2400, category: "Utilities", type: "expense", description: "Internet + electricity" },
  { id: 108, date: "2026-03-22", amount: 1200, category: "Entertainment", type: "expense", description: "Cinema + streaming" },
  { id: 109, date: "2026-04-01", amount: 42000, category: "Salary", type: "income", description: "Primary income" },
  { id: 110, date: "2026-04-02", amount: 1600, category: "Food", type: "expense", description: "Lunch and pantry restock" },
];

export const roleTransactions = {
  admin: adminTransactions,
  viewer: viewerTransactions,
};

export const transactions = adminTransactions;

export const categoryColors = {
  Salary: "#72e3ad",
  Freelance: "#9cc7ff",
  Investment: "#f2c572",
  Food: "#ff9f6e",
  Shopping: "#f17f9d",
  Rent: "#f06d43",
  Transport: "#69b8ff",
  Utilities: "#8f8cff",
  Entertainment: "#ffb347",
  Health: "#66d1c1",
  Education: "#d3a6ff",
};

export const allCategories = [
  "Salary",
  "Freelance",
  "Investment",
  "Food",
  "Shopping",
  "Rent",
  "Transport",
  "Utilities",
  "Entertainment",
  "Health",
  "Education",
];
