import { useMemo } from "react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useStore } from "../store/useStore";
import { categoryColors } from "../data/mockData";
import { getCategoryBreakdown, groupMonthlyData } from "../utils/finance";

const MotionDiv = motion.div;

const Tip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="tip-box">
      <div className="tip-label">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="tip-row">
          <div className="tip-dot" style={{ background: p.color }} />
          <span className="tip-name">{p.name}</span>
          <span className="tip-val">Rs {p.value?.toLocaleString("en-IN")}</span>
        </div>
      ))}
    </div>
  );
};

const ChartSection = () => {
  const { transactions } = useStore();

  const monthlyData = useMemo(() => {
    // reshape raw transactions into chart-friendly monthly totals
    return groupMonthlyData(transactions)
      .map((d) => ({
        ...d,
        month: new Date(`${d.month}-01`).toLocaleDateString("en-US", { month: "short" }),
      }));
  }, [transactions]);

  // only expenses are used for the category breakdown chart
  const pieData = useMemo(() => getCategoryBreakdown(transactions), [transactions]);

  const colors = pieData.map((d) => categoryColors[d.name] || "#888");

  return (
    <div className="charts-row">
      <MotionDiv
        className="clay"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.38 }}
      >
        <div className="chart-head">
          <h3>Balance Trend</h3>
          <span>Monthly overview</span>
        </div>
        <div className="chart-wrap" style={{ height: 240 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyData}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--text-3)" }} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "var(--text-3)" }}
                tickFormatter={(v) => `Rs ${(v / 1000).toFixed(0)}K`}
                width={60}
              />
              <Tooltip content={<Tip />} />
              <Area type="monotone" dataKey="income" name="Income" stroke="var(--green)" strokeWidth={2} fill="var(--green-soft)" dot={false} />
              <Area type="monotone" dataKey="expenses" name="Expenses" stroke="var(--red)" strokeWidth={2} fill="var(--red-soft)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </MotionDiv>

      <MotionDiv
        className="clay"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.38, delay: 0.06 }}
      >
        <div className="chart-head">
          <h3>Spending Breakdown</h3>
          <span>By category</span>
        </div>
        <div className="chart-wrap" style={{ height: 200 }}>
          {pieData.length === 0 ? (
            <div className="empty-block">
              <p>No expense data</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  strokeWidth={0}
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={colors[i]} />
                  ))}
                </Pie>
                <Tooltip content={<Tip />} />
                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="pie-center-text">
                  Expenses
                </text>
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className="pie-legend">
          {pieData.map((d, i) => (
            <span key={d.name} className="pie-legend-chip">
              <span className="pie-legend-dot" style={{ background: colors[i] }} />
              {d.name}
            </span>
          ))}
        </div>
      </MotionDiv>
    </div>
  );
};

export default ChartSection;
