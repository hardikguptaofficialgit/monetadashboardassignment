import { motion } from "framer-motion";
import { Finance } from "doodle-icons";
import StarIcon from "./StarIcon";
import AppIcon from "./AppIcon";
import { formatCurrency } from "../utils/finance";

const MotionDiv = motion.div;

const iconCfg = {
  balance: { icon: Finance.Wallet, bg: "var(--accent-soft)", color: "var(--accent-ink)" },
  income: { icon: Finance.TrendUp, bg: "var(--green-soft)", color: "var(--green-ink)" },
  expense: { icon: Finance.TrendDown, bg: "var(--red-soft)", color: "var(--red-ink)" },
  savings: { icon: Finance.PiggyBank, bg: "var(--amber-soft)", color: "var(--amber-ink)" },
};

const SummaryCard = ({ title, amount, type = "balance", trend, trendLabel }) => {
  // pick icon colors from the metric type so cards stay consistent
  const cfg = iconCfg[type] || iconCfg.balance;

  return (
    <MotionDiv
      className="clay stat-card"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.35 }}
    >
      <div style={{ position: "relative", zIndex: 1 }}>
        <div className="stat-card-head">
          <StarIcon size={44} bg={cfg.bg} color={cfg.color}>
            <AppIcon icon={cfg.icon} size={24} color={cfg.color} className="float-icon" />
          </StarIcon>
          <span className="metric-chip">{type}</span>
        </div>
        <p className="stat-label">{title}</p>
        <p className="stat-value">{type === "savings" ? `${amount}%` : formatCurrency(amount)}</p>
        {trend !== undefined && (
          <span className={`stat-trend ${trend >= 0 ? "up" : "down"}`}>
            {trend >= 0 ? "Up" : "Down"} {Math.abs(trend)}% {trendLabel || "vs last month"}
          </span>
        )}
      </div>
    </MotionDiv>
  );
};

export default SummaryCard;
