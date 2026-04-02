export const formatCurrency = (value = 0) => {
  const numeric = Number(value || 0);
  const abs = Math.abs(numeric);

  if (abs >= 100000) {
    return `Rs ${(numeric / 1000).toFixed(1)}K`;
  }

  return `Rs ${numeric.toLocaleString("en-IN")}`;
};

export const groupMonthlyData = (transactions) => {
  // merge raw rows into monthly income and expense totals
  const monthMap = {};

  transactions.forEach((transaction) => {
    const month = transaction.date.slice(0, 7);

    if (!monthMap[month]) {
      monthMap[month] = { month, income: 0, expenses: 0 };
    }

    if (transaction.type === "income") {
      monthMap[month].income += transaction.amount;
    } else {
      monthMap[month].expenses += transaction.amount;
    }
  });

  return Object.values(monthMap).sort((a, b) => a.month.localeCompare(b.month));
};

export const getCategoryBreakdown = (transactions) => {
  // summarize expense categories for charts and planner views
  const categoryMap = {};

  transactions
    .filter((transaction) => transaction.type === "expense")
    .forEach((transaction) => {
      categoryMap[transaction.category] = (categoryMap[transaction.category] || 0) + transaction.amount;
    });

  return Object.entries(categoryMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
};

export const getDashboardStats = (transactions) => {
  // centralize the main finance calculations used across the ui
  const monthly = groupMonthlyData(transactions);
  const income = transactions.filter((item) => item.type === "income").reduce((sum, item) => sum + item.amount, 0);
  const expenses = transactions.filter((item) => item.type === "expense").reduce((sum, item) => sum + item.amount, 0);

  const currentMonth = monthly[monthly.length - 1];
  const previousMonth = monthly[monthly.length - 2];

  const incomeTrend =
    currentMonth && previousMonth && previousMonth.income > 0
      ? Number((((currentMonth.income - previousMonth.income) / previousMonth.income) * 100).toFixed(1))
      : 0;

  const expenseTrend =
    currentMonth && previousMonth && previousMonth.expenses > 0
      ? Number((((currentMonth.expenses - previousMonth.expenses) / previousMonth.expenses) * 100).toFixed(1))
      : 0;

  const savingsRate = income > 0 ? Number((((income - expenses) / income) * 100).toFixed(1)) : 0;
  const avgMonthlyExpense = monthly.length ? expenses / monthly.length : 0;
  const avgExpense = transactions.filter((item) => item.type === "expense").length
    ? expenses / transactions.filter((item) => item.type === "expense").length
    : 0;
  const topCategory = getCategoryBreakdown(transactions)[0] || null;

  return {
    income,
    expenses,
    balance: income - expenses,
    savingsRate,
    incomeTrend,
    expenseTrend,
    monthly,
    currentMonth,
    previousMonth,
    avgMonthlyExpense,
    avgExpense,
    topCategory,
  };
};

export const getRecentTransactions = (transactions, limit = 5) =>
  // sort newest first before taking the requested number of rows
  [...transactions]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit);
