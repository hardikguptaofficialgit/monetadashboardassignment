import { useState } from "react";
import { useStore } from "../store/useStore";
import { allCategories } from "../data/mockData";

const createInitialForm = (editingTransaction) => ({
  date: editingTransaction?.date || new Date().toISOString().slice(0, 10),
  amount: editingTransaction ? String(editingTransaction.amount) : "",
  category: editingTransaction?.category || "Food",
  type: editingTransaction?.type || "expense",
  description: editingTransaction?.description || "",
});

const TransactionForm = ({ editingTransaction, closeModal, addTransaction, editTransaction }) => {
  // start with the current row values when editing
  const [form, setForm] = useState(() => createInitialForm(editingTransaction));

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      date: form.date,
      amount: Number(form.amount),
      category: form.category,
      type: form.type,
      description: form.description,
    };

    if (!payload.amount || !payload.date) return;

    // reuse the same form for both create and edit flows
    if (editingTransaction) {
      editTransaction(editingTransaction.id, payload);
    } else {
      addTransaction(payload);
    }

    closeModal();
  };

  const set = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  return (
    <form className="modal-box glass" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
      <div className="modal-top">
        <h3>{editingTransaction ? "Edit Transaction" : "New Transaction"}</h3>
        <button type="button" className="modal-x" onClick={closeModal}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="field">
        <label>Description</label>
        <input value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="What was this for?" />
      </div>

      <div className="field-row">
        <div className="field">
          <label>Amount (Rs)</label>
          <input type="number" min="1" value={form.amount} onChange={(e) => set("amount", e.target.value)} placeholder="0" required />
        </div>
        <div className="field">
          <label>Date</label>
          <input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} required />
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label>Type</label>
          <select value={form.type} onChange={(e) => set("type", e.target.value)}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>
        <div className="field">
          <label>Category</label>
          <select value={form.category} onChange={(e) => set("category", e.target.value)}>
            {allCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="modal-foot">
        <button type="button" className="btn btn-outline" onClick={closeModal}>
          Cancel
        </button>
        <button type="submit" className="btn btn-accent">
          {editingTransaction ? "Save Changes" : "Add Transaction"}
        </button>
      </div>
    </form>
  );
};

const TransactionModal = () => {
  const { modalOpen, editingTransaction, closeModal, addTransaction, editTransaction } = useStore();

  if (!modalOpen) return null;

  return (
    <div className="modal-bg" onClick={closeModal}>
      <TransactionForm
        key={editingTransaction?.id || "new"}
        editingTransaction={editingTransaction}
        closeModal={closeModal}
        addTransaction={addTransaction}
        editTransaction={editTransaction}
      />
    </div>
  );
};

export default TransactionModal;
