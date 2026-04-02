import { motion } from "framer-motion";
import { Interfaces } from "doodle-icons";
import AppIcon from "./AppIcon";
import { formatCurrency, getCategoryBreakdown, getDashboardStats } from "../utils/finance";

const MotionSection = motion.section;
const MotionSpan = motion.span;

const budgetHints = {
  Rent: 0.3,
  Food: 0.12,
  Shopping: 0.1,
  Transport: 0.08,
  Utilities: 0.08,
  Entertainment: 0.06,
  Health: 0.07,
  Education: 0.08,
};

const BudgetPlanner = ({ transactions }) => {
  const stats = getDashboardStats(transactions);
  const categories = getCategoryBreakdown(transactions).slice(0, 5);

  return (
    <MotionSection
      className="clay planner-card"
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4 }}
    >
      <div className="chart-head">
        <div>
          <h3>Budget Planner</h3>
          <span>Top categories against smart target ranges</span>
        </div>
        <AppIcon icon={Interfaces.Pie} size={18} className="float-icon" />
      </div>

      <div className="planner-list">
        {categories.map((category) => {
          // fall back to a small default target when a category has no custom hint
          const target = Math.round(stats.income * (budgetHints[category.name] || 0.07));
          const progress = target > 0 ? Math.min((category.value / target) * 100, 100) : 0;
          const over = target > 0 && category.value > target;

          return (
            <div key={category.name} className="planner-item">
              <div className="planner-row">
                <div className="planner-copy">
                  <strong>{category.name}</strong>
                  <span>
                    {formatCurrency(category.value)} spent
                    {target > 0 ? ` / ${formatCurrency(target)} target` : ""}
                  </span>
                </div>
                <div className={`planner-status ${over ? "over" : "ok"}`}>
                  <AppIcon icon={over ? Interfaces.Caution : Interfaces.Tick2} size={13} />
                  {over ? "Over target" : "On track"}
                </div>
              </div>
              <div className="planner-bar">
                <MotionSpan
                  initial={{ width: 0 }}
                  whileInView={{ width: `${Math.max(progress, 10)}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55 }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </MotionSection>
  );
};

export default BudgetPlanner;
