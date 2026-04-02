import { useMemo } from "react";
import { useStore } from "../store/useStore";
import { allCategories } from "../data/mockData";
import { Interfaces } from "doodle-icons";
import AppIcon from "./AppIcon";

const formatCurrency = (value) => {
  const abs = Math.abs(value);
  if (abs >= 100000) return `Rs ${(value / 1000).toFixed(1)}K`;
  return `Rs ${value.toLocaleString("en-IN")}`;
};

const groupLabelMap = {
  none: "Ungrouped",
  month: "Month",
  category: "Category",
  type: "Type",
};

const TransactionTable = () => {
  const {
    transactions,
    filterType,
    setFilterType,
    filterCategory,
    setFilterCategory,
    filterMonth,
    setFilterMonth,
    groupBy,
    setGroupBy,
    searchQuery,
    setSearchQuery,
    sortField,
    sortDirection,
    setSortField,
    getFilteredTransactions,
    role,
    openModal,
    deleteTransaction,
  } = useStore();

  const filtered = getFilteredTransactions();
  const availableMonths = useMemo(
    // build month options from the transactions already loaded in state
    () => [...new Set(transactions.map((item) => item.date.slice(0, 7)))].sort().reverse(),
    [transactions]
  );

  const grouped = useMemo(() => {
    if (groupBy === "none") {
      return [{ key: "all", label: "All transactions", rows: filtered }];
    }

    // group rows so the table can switch between flat and sectioned views
    const map = new Map();

    filtered.forEach((item) => {
      const rawKey =
        groupBy === "month"
          ? item.date.slice(0, 7)
          : groupBy === "category"
            ? item.category
            : item.type;

      if (!map.has(rawKey)) {
        map.set(rawKey, []);
      }

      map.get(rawKey).push(item);
    });

    return [...map.entries()].map(([key, rows]) => ({
      key,
      label:
        groupBy === "month"
          ? new Date(`${key}-01`).toLocaleDateString("en-US", { month: "long", year: "numeric" })
          : key[0].toUpperCase() + key.slice(1),
      rows,
      total: rows.reduce((sum, item) => sum + (item.type === "income" ? item.amount : -item.amount), 0),
    }));
  }, [filtered, groupBy]);

  const sortArrow = (field) => <span className={`sort-arrow ${sortField === field ? "on" : ""}`}>{sortField === field ? (sortDirection === "asc" ? "\u2191" : "\u2193") : "\u2195"}</span>;

  const fmtDate = (d) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <div className="clay">
      <div className="txn-toolbar">
        <div>
          <h3>Transactions</h3>
          <p style={{ marginTop: 2 }}>{filtered.length} total records</p>
        </div>
        <div className="txn-controls">
          <div className="search-input">
            <AppIcon icon={Interfaces.Search} size={14} color="var(--icon-muted)" opacity={0.8} />
            <input placeholder="Search transactions" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>

          <select className="select-clay" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="all">All types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <select className="select-clay" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="all">All categories</option>
            {allCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select className="select-clay" value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)}>
            <option value="all">All months</option>
            {availableMonths.map((month) => (
              <option key={month} value={month}>
                {new Date(`${month}-01`).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
              </option>
            ))}
          </select>

          <select className="select-clay" value={groupBy} onChange={(e) => setGroupBy(e.target.value)}>
            {Object.entries(groupLabelMap).map(([value, label]) => (
              <option key={value} value={value}>
                Group: {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="tbl-wrap">
        {filtered.length === 0 ? (
          <div className="empty-block">
            <AppIcon icon={Interfaces.FolderEmpty} size={48} color="var(--icon-muted)" opacity={0.72} />
            <h4>No transactions found</h4>
            <p>Try changing your filters or search query</p>
          </div>
        ) : (
          grouped.map((group) => (
            <div key={group.key} className="txn-group">
              {groupBy !== "none" && (
                <div className="txn-group-head">
                  <div>
                    <h4>{group.label}</h4>
                    <p>{group.rows.length} transaction{group.rows.length !== 1 ? "s" : ""}</p>
                  </div>
                  <span className={`txn-group-total ${group.total >= 0 ? "positive" : "negative"}`}>
                    {group.total >= 0 ? "+" : "-"}{formatCurrency(Math.abs(group.total))}
                  </span>
                </div>
              )}

              <table className="tbl">
                <thead>
                  <tr>
                    <th onClick={() => setSortField("date")}>Date {sortArrow("date")}</th>
                    <th>Description</th>
                    <th onClick={() => setSortField("category")}>Category {sortArrow("category")}</th>
                    <th>Type</th>
                    <th onClick={() => setSortField("amount")}>Amount {sortArrow("amount")}</th>
                    {role === "admin" && <th>Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {group.rows.map((t) => (
                    <tr key={t.id}>
                      <td className="date-cell">{fmtDate(t.date)}</td>
                      <td className="desc-cell">{t.description || "-"}</td>
                      <td>
                        <span className="badge-cat">{t.category}</span>
                      </td>
                      <td>
                        <span className={`badge-type ${t.type}`}>{t.type}</span>
                      </td>
                      <td className={`amt ${t.type}`}>
                        {t.type === "income" ? "+" : "-"}Rs {t.amount.toLocaleString("en-IN")}
                      </td>
                      {role === "admin" && (
                        <td>
                          <div className="row-actions">
                            {/* admin actions stay hidden for viewer mode */}
                            <button type="button" className="act-btn" onClick={() => openModal(t)} aria-label={`Edit ${t.description || t.category}`}>
                              <AppIcon icon={Interfaces.Pencil2} size={14} />
                            </button>
                            <button
                              type="button"
                              className="act-btn del"
                              onClick={() => deleteTransaction(t.id)}
                              aria-label={`Delete ${t.description || t.category}`}
                            >
                              <AppIcon icon={Interfaces.Delete} size={14} />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
        )}
      </div>

      <div style={{ marginTop: 12, fontSize: 12, color: "var(--text-3)" }}>
        Showing {filtered.length} transaction{filtered.length !== 1 ? "s" : ""} with {groupLabelMap[groupBy].toLowerCase()} view
      </div>
    </div>
  );
};

export default TransactionTable;
