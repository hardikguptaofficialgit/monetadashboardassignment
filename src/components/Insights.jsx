import { useMemo } from "react";
import { motion } from "framer-motion";
import { useStore } from "../store/useStore";
import { Finance, Interfaces } from "doodle-icons";
import StarIcon from "./StarIcon";
import AppIcon from "./AppIcon";

const MotionDiv = motion.div;

const Insights = () => {
  const { transactions } = useStore();

  const data = useMemo(() => {
    // derive lightweight insights directly from the current transactions
    const expenses = transactions.filter((t) => t.type === "expense");
    const incomes = transactions.filter((t) => t.type === "income");

    const catMap = {};
    expenses.forEach((t) => {
      catMap[t.category] = (catMap[t.category] || 0) + t.amount;
    });
    const catEntries = Object.entries(catMap).sort((a, b) => b[1] - a[1]);
    const topCategory = catEntries[0] || null;

    const monthMap = {};
    transactions.forEach((t) => {
      const m = t.date.slice(0, 7);
      if (!monthMap[m]) monthMap[m] = { income: 0, expenses: 0 };
      if (t.type === "income") monthMap[m].income += t.amount;
      else monthMap[m].expenses += t.amount;
    });

    const months = Object.keys(monthMap).sort();
    const thisMonth = months[months.length - 1];
    const lastMonth = months[months.length - 2];
    const expenseChange =
      thisMonth && lastMonth
        ? (((monthMap[thisMonth].expenses - monthMap[lastMonth].expenses) / monthMap[lastMonth].expenses) * 100).toFixed(1)
        : null;

    const avgExpense = expenses.length ? Math.round(expenses.reduce((s, t) => s + t.amount, 0) / expenses.length) : 0;
    const totalIncome = incomes.reduce((s, t) => s + t.amount, 0);
    const totalExpense = expenses.reduce((s, t) => s + t.amount, 0);
    const savingsRate = totalIncome > 0 ? (((totalIncome - totalExpense) / totalIncome) * 100).toFixed(1) : 0;
    const biggestExpense = expenses.length ? expenses.reduce((max, t) => (t.amount > max.amount ? t : max), expenses[0]) : null;
    const catCount = Object.keys(catMap).length;

    return { topCategory, expenseChange, avgExpense, savingsRate, biggestExpense, catCount };
  }, [transactions]);

  // keep the insight cards declarative so the layout stays easy to extend
  const insights = [
    {
      label: "Top Spending Category",
      value: data.topCategory ? data.topCategory[0] : "N/A",
      sub: data.topCategory ? `Rs ${data.topCategory[1].toLocaleString("en-IN")} total` : "",
      icon: Finance.TrendDown,
      bg: "var(--red-soft)",
      color: "var(--red-ink)",
    },
    {
      label: "Avg. Expense",
      value: `Rs ${data.avgExpense.toLocaleString("en-IN")}`,
      sub: "Per transaction",
      icon: Interfaces.Pie,
      bg: "var(--amber-soft)",
      color: "var(--amber-ink)",
    },
    {
      label: "Savings Rate",
      value: `${data.savingsRate}%`,
      sub: "Of total income",
      icon: Finance.PiggyBank,
      bg: "var(--green-soft)",
      color: "var(--green-ink)",
    },
    {
      label: "Expense Trend",
      value: data.expenseChange !== null ? `${data.expenseChange > 0 ? "+" : ""}${data.expenseChange}%` : "N/A",
      sub: "vs previous month",
      icon: Finance.TrendUpSquare,
      bg: "var(--accent-soft)",
      color: "var(--accent-ink)",
    },
    {
      label: "Biggest Expense",
      value: data.biggestExpense ? `Rs ${data.biggestExpense.amount.toLocaleString("en-IN")}` : "N/A",
      sub: data.biggestExpense ? data.biggestExpense.description : "",
      icon: Interfaces.Zap,
      bg: "var(--red-soft)",
      color: "var(--red-ink)",
    },
    {
      label: "Categories Used",
      value: data.catCount,
      sub: "Spending categories",
      icon: Interfaces.Grid,
      bg: "var(--accent-soft)",
      color: "var(--accent-ink)",
    },
  ];

  return (
    <div className="insights-row">
      {insights.map((ins, i) => (
        <MotionDiv
          key={i}
          className="clay"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ delay: i * 0.04, duration: 0.34 }}
        >
          <div className="insight-head">
            <StarIcon size={40} bg={ins.bg} color={ins.color}>
              <AppIcon icon={ins.icon} size={22} color={ins.color} className="float-icon" />
            </StarIcon>
            <span className="metric-chip">Insight</span>
          </div>
          <p className="insight-label">{ins.label}</p>
          <p className="insight-val">{ins.value}</p>
          {ins.sub && <p className="insight-sub">{ins.sub}</p>}
        </MotionDiv>
      ))}
    </div>
  );
};

export default Insights;
