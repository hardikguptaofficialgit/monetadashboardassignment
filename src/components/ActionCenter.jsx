import { motion } from "framer-motion";
import { Finance, Interfaces, Misc } from "doodle-icons";
import AppIcon from "./AppIcon";
import { formatCurrency, getDashboardStats, getRecentTransactions } from "../utils/finance";

const MotionArticle = motion.article;

const ActionCenter = ({ transactions }) => {
  const stats = getDashboardStats(transactions);
  const latest = getRecentTransactions(transactions, 1)[0];

  // estimate how long the current balance can cover recent monthly spend
  const avgRunway = stats.avgMonthlyExpense > 0 ? Math.max(stats.balance, 0) / stats.avgMonthlyExpense : 0;

  // these cards add quick narrative signals above the charts
  const cards = [
    {
      title: "Cash Runway",
      value: avgRunway > 0 ? `${avgRunway.toFixed(1)} months` : "Stable",
      copy: "Estimated from current balance versus average monthly spend.",
      icon: Misc.Rocket,
      tone: "accent",
    },
    {
      title: "Expense Pulse",
      value: formatCurrency(Math.round(stats.avgExpense)),
      copy: "Average amount per expense transaction in the current dataset.",
      icon: Finance.TrendDown,
      tone: "red",
    },
    {
      title: "Focus Category",
      value: stats.topCategory ? stats.topCategory.name : "Balanced",
      copy: stats.topCategory ? `${formatCurrency(stats.topCategory.value)} spent here so far.` : "No overspend hotspot found.",
      icon: Interfaces.Target,
      tone: "amber",
    },
    {
      title: "Latest Move",
      value: latest ? latest.category : "No data",
      copy: latest ? `${latest.type === "income" ? "+" : "-"}${formatCurrency(latest.amount)} on ${latest.date}.` : "Add transactions to unlock more signals.",
      icon: latest?.type === "income" ? Finance.TrendUp : Interfaces.Zap,
      tone: latest?.type === "income" ? "green" : "accent",
    },
  ];

  return (
    <section className="action-center">
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
            <span className="metric-chip">Live signal</span>
            <AppIcon icon={card.icon} size={20} className="float-icon" />
          </div>
          <p className="action-card-title">{card.title}</p>
          <p className="action-card-value">{card.value}</p>
          <p className="action-card-copy">{card.copy}</p>
        </MotionArticle>
      ))}
    </section>
  );
};

export default ActionCenter;
