import { useMemo } from "react";
import { useStore } from "../store/useStore";
import SummaryCard from "../components/SummaryCard";
import ChartSection from "../components/ChartSection";
import TransactionTable from "../components/TransactionTable";
import Insights from "../components/Insights";
import ExportButton from "../components/ExportButton";
import ActionCenter from "../components/ActionCenter";
import BudgetPlanner from "../components/BudgetPlanner";
import { getDashboardStats } from "../utils/finance";

const Dashboard = () => {
  const { transactions, activePage, role, openModal, isSyncing, syncError, resetMockData } = useStore();

  // build the top-level dashboard numbers from the current dataset
  const stats = useMemo(() => getDashboardStats(transactions), [transactions]);

  // only admins get the quick action for adding new records
  const quickAction = role === "admin"
    ? (
        <button className="btn btn-accent" onClick={() => openModal()} type="button">
          New transaction
        </button>
      )
    : null;

  return (
    <>
      {activePage === "dashboard" && (
        <div key="dashboard">
          <div className="page-head">
            <div>
              <h2 className="clip-text">Dashboard</h2>
            </div>
            <div className="head-actions">
              {quickAction}
              <button className="btn btn-outline" onClick={() => resetMockData()} type="button">
                Reset mock data
              </button>
              <ExportButton />
            </div>
          </div>

          {(isSyncing || syncError) && (
            <div className={`status-banner ${syncError ? "status-banner-error" : ""}`}>
              {isSyncing ? "Syncing with mock API..." : syncError}
            </div>
          )}

          <div className="stat-grid">
            <SummaryCard title="Total Balance" amount={stats.balance} type="balance" trend={8.2} />
            <SummaryCard title="Income" amount={stats.income} type="income" trend={stats.incomeTrend} />
            <SummaryCard title="Expenses" amount={stats.expenses} type="expense" trend={stats.expenseTrend} />
            <SummaryCard title="Savings Rate" amount={stats.savingsRate} type="savings" trendLabel="of income saved" />
          </div>

          <ActionCenter transactions={transactions} />
          <ChartSection />
          <BudgetPlanner transactions={transactions} />
          <Insights />
        </div>
      )}

      {activePage === "transactions" && (
        <div key="transactions">
          <div className="page-head">
            <div>
              <h2 className="clip-text">Transactions</h2>
            </div>
            <div className="head-actions">
              {quickAction}
              <button className="btn btn-outline" onClick={() => resetMockData()} type="button">
                Reset mock data
              </button>
              <ExportButton />
            </div>
          </div>

          {(isSyncing || syncError) && (
            <div className={`status-banner ${syncError ? "status-banner-error" : ""}`}>
              {isSyncing ? "Syncing with mock API..." : syncError}
            </div>
          )}

          <div className="stat-grid" style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>
            <SummaryCard title="Total Income" amount={stats.income} type="income" />
            <SummaryCard title="Total Expenses" amount={stats.expenses} type="expense" />
            <SummaryCard title="Net Balance" amount={stats.balance} type="balance" />
          </div>

          <TransactionTable />
        </div>
      )}

      {activePage === "insights" && (
        <div key="insights">
          <div className="page-head">
            <div>
              <h2 className="clip-text">Insights</h2>
            </div>
          </div>

          <Insights />
          <ChartSection />
          <BudgetPlanner transactions={transactions} />
        </div>
      )}
    </>
  );
};

export default Dashboard;
