import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Finance, Interfaces, Misc } from "doodle-icons";
import AppIcon from "./AppIcon";
import { formatCurrency, getDashboardStats, getRecentTransactions } from "../utils/finance";

const MotionArticle = motion.article;
const MotionDiv = motion.div;

const ActionCenter = ({ transactions }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const stats = getDashboardStats(transactions);
  const latest = getRecentTransactions(transactions, 1)[0];
  const expenseCount = transactions.filter((item) => item.type === "expense").length;
  const topCategoryShare = stats.expenses > 0 && stats.topCategory ? (stats.topCategory.value / stats.expenses) * 100 : 0;

  // estimate how long the current balance can cover recent monthly spend
  const avgRunway = stats.avgMonthlyExpense > 0 ? Math.max(stats.balance, 0) / stats.avgMonthlyExpense : 0;

  // these cards add quick narrative signals above the charts
  const cards = [
    {
      title: "Cash Runway",
      value: avgRunway > 0 ? `${avgRunway.toFixed(1)} months` : "Stable",
      copy: "Balance versus average monthly spend.",
      icon: Misc.Rocket,
      tone: "accent",
      details: [
        { label: "Balance", value: formatCurrency(stats.balance) },
        { label: "Avg. monthly expense", value: formatCurrency(Math.round(stats.avgMonthlyExpense || 0)) },
      ],
    },
    {
      title: "Expense Pulse",
      value: formatCurrency(Math.round(stats.avgExpense)),
      copy: "Average expense transaction value.",
      icon: Finance.TrendDown,
      tone: "red",
      details: [
        { label: "Transactions", value: expenseCount },
        { label: "Monthly spend", value: formatCurrency(Math.round(stats.avgMonthlyExpense || 0)) },
      ],
    },
    {
      title: "Focus Category",
      value: stats.topCategory ? stats.topCategory.name : "Balanced",
      copy: stats.topCategory ? `${formatCurrency(stats.topCategory.value)} spent so far.` : "No clear hotspot found.",
      icon: Interfaces.Target,
      tone: "amber",
      details: [
        { label: "Share of spend", value: `${Math.round(topCategoryShare)}%` },
        { label: "Status", value: stats.topCategory ? "Watch closely" : "Evenly spread" },
      ],
    },
    {
      title: "Latest Move",
      value: latest ? latest.category : "No data",
      copy: latest ? `${latest.type === "income" ? "+" : "-"}${formatCurrency(latest.amount)} on ${latest.date}.` : "Waiting for activity.",
      icon: latest?.type === "income" ? Finance.TrendUp : Interfaces.Zap,
      tone: latest?.type === "income" ? "green" : "accent",
      details: [
        { label: "Type", value: latest ? latest.type : "Pending" },
        { label: "Description", value: latest ? latest.description : "Waiting for activity" },
      ],
    },
  ];

  return (
    <section className="action-center-wrap">
      <button
        className={`clay action-center-toggle ${isExpanded ? "expanded" : ""}`}
        onClick={() => setIsExpanded((current) => !current)}
        type="button"
        aria-expanded={isExpanded}
        aria-label={`${isExpanded ? "Collapse" : "Expand"} live signal section`}
      >
        <div className="action-center-toggle-copy">
          <span className={`metric-chip metric-chip-button ${isExpanded ? "active" : ""}`}>Live signal</span>
          <div>
            <p className="action-center-heading">Financial pulse</p>
            
          </div>
        </div>

        <div className="action-center-toggle-side">
          <span className="action-center-count">{cards.length} signals</span>
          <motion.span
            className="action-center-chevron"
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.22 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </motion.span>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <MotionDiv
            className="action-center"
            initial={{ opacity: 0, height: 0, y: -6 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
          >
            {cards.map((card, index) => (
              <MotionArticle
                key={card.title}
                className={`clay action-card tone-${card.tone}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.05, duration: 0.38 }}
              >
                <div className="action-card-top">
                  <p className="action-card-kicker">{card.title}</p>
                  <AppIcon icon={card.icon} size={20} className="float-icon" />
                </div>
                <p className="action-card-value">{card.value}</p>
                <p className="action-card-copy">{card.copy}</p>
                <div className="action-card-expand">
                  {card.details.map((detail) => (
                    <div className="action-detail-row" key={detail.label}>
                      <span className="action-detail-label">{detail.label}</span>
                      <span className="action-detail-value">{detail.value}</span>
                    </div>
                  ))}
                </div>
              </MotionArticle>
            ))}
          </MotionDiv>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ActionCenter;
