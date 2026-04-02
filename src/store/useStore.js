import { create } from "zustand";
import { persist } from "zustand/middleware";
import { roleTransactions } from "../data/mockData";
import { mockApi } from "../services/mockApi";

const cloneTransactions = (items) => items.map((item) => ({ ...item }));

const getInitialDatasets = () => ({
  admin: cloneTransactions(roleTransactions.admin),
  viewer: cloneTransactions(roleTransactions.viewer),
});

const getValidPage = (page) => (["dashboard", "transactions", "insights"].includes(page) ? page : "dashboard");

export const useStore = create(
  persist(
    (set, get) => ({
      datasets: getInitialDatasets(),
      transactions: cloneTransactions(roleTransactions.admin),
      isSyncing: false,
      syncError: "",
      initialized: false,

      role: "admin",
      setRole: (role) =>
        set((state) => ({
          role,
          transactions: cloneTransactions(state.datasets[role]),
          filterType: "all",
          filterCategory: "all",
          filterMonth: "all",
          groupBy: "none",
          searchQuery: "",
          modalOpen: false,
          editingTransaction: null,
        })),

      filterType: "all",
      filterCategory: "all",
      filterMonth: "all",
      groupBy: "none",
      searchQuery: "",
      sortField: "date",
      sortDirection: "desc",

      setFilterType: (filterType) => set({ filterType }),
      setFilterCategory: (filterCategory) => set({ filterCategory }),
      setFilterMonth: (filterMonth) => set({ filterMonth }),
      setGroupBy: (groupBy) => set({ groupBy }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setSortField: (field) => {
        const state = get();
        if (state.sortField === field) {
          set({ sortDirection: state.sortDirection === "asc" ? "desc" : "asc" });
        } else {
          set({ sortField: field, sortDirection: "asc" });
        }
      },

      theme: "light",
      toggleTheme: () => set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),

      activePage: "dashboard",
      setActivePage: (activePage) => set({ activePage }),

      initializeApp: async () => {
        const state = get();
        if (state.initialized) return;

        // pull the latest mock data once when the app boots
        set({ isSyncing: true, syncError: "" });

        try {
          const datasets = await mockApi.fetchDatasets();
          const activeRole = get().role;

          set({
            datasets,
            transactions: cloneTransactions(datasets[activeRole] || []),
            isSyncing: false,
            initialized: true,
          });
        } catch {
          set({
            isSyncing: false,
            syncError: "Mock API sync failed. Using local data instead.",
            initialized: true,
          });
        }
      },

      resetMockData: async () => {
        set({ isSyncing: true, syncError: "" });

        try {
          const datasets = await mockApi.resetDatasets();
          const activeRole = get().role;

          set({
            datasets,
            transactions: cloneTransactions(datasets[activeRole] || []),
            isSyncing: false,
          });
        } catch {
          set({
            isSyncing: false,
            syncError: "Could not reset mock data.",
          });
        }
      },

      addTransaction: (txn) =>
        set((state) => {
          if (state.role !== "admin") return state;
          const nextTransaction = { ...txn, id: Date.now() };
          const nextAdmin = [...state.datasets.admin, nextTransaction];
          const nextDatasets = { ...state.datasets, admin: nextAdmin };
          void mockApi.saveDatasets(nextDatasets).catch(() => {
            set({ syncError: "Mock API save failed. Local changes are still available." });
          });
          return {
            datasets: nextDatasets,
            transactions: cloneTransactions(nextAdmin),
          };
        }),

      editTransaction: (id, updatedFields) =>
        set((state) => {
          if (state.role !== "admin") return state;
          const nextAdmin = state.datasets.admin.map((t) => (t.id === id ? { ...t, ...updatedFields } : t));
          const nextDatasets = { ...state.datasets, admin: nextAdmin };
          void mockApi.saveDatasets(nextDatasets).catch(() => {
            set({ syncError: "Mock API save failed. Local changes are still available." });
          });
          return {
            datasets: nextDatasets,
            transactions: cloneTransactions(nextAdmin),
          };
        }),

      deleteTransaction: (id) =>
        set((state) => {
          if (state.role !== "admin") return state;
          const nextAdmin = state.datasets.admin.filter((t) => t.id !== id);
          const nextDatasets = { ...state.datasets, admin: nextAdmin };
          void mockApi.saveDatasets(nextDatasets).catch(() => {
            set({ syncError: "Mock API save failed. Local changes are still available." });
          });
          return {
            datasets: nextDatasets,
            transactions: cloneTransactions(nextAdmin),
          };
        }),

      getFilteredTransactions: () => {
        const state = get();
        let result = [...state.transactions];

        // apply the active table filters before sorting
        if (state.filterType !== "all") {
          result = result.filter((t) => t.type === state.filterType);
        }

        if (state.filterCategory !== "all") {
          result = result.filter((t) => t.category === state.filterCategory);
        }

        if (state.filterMonth !== "all") {
          result = result.filter((t) => t.date.slice(0, 7) === state.filterMonth);
        }

        if (state.searchQuery.trim()) {
          const q = state.searchQuery.toLowerCase();
          result = result.filter(
            (t) =>
              t.description?.toLowerCase().includes(q) ||
              t.category.toLowerCase().includes(q) ||
              t.date.includes(q) ||
              String(t.amount).includes(q)
          );
        }

        result.sort((a, b) => {
          let cmp = 0;
          if (state.sortField === "date") cmp = a.date.localeCompare(b.date);
          else if (state.sortField === "amount") cmp = a.amount - b.amount;
          else if (state.sortField === "category") cmp = a.category.localeCompare(b.category);
          return state.sortDirection === "asc" ? cmp : -cmp;
        });

        return result;
      },

      modalOpen: false,
      editingTransaction: null,
      openModal: (txn = null) =>
        set((state) => {
          if (state.role !== "admin") return state;
          return { modalOpen: true, editingTransaction: txn };
        }),
      closeModal: () => set({ modalOpen: false, editingTransaction: null }),
    }),
    {
      name: "finance-dashboard-storage",
      partialize: (state) => ({
        datasets: state.datasets,
        theme: state.theme,
        role: state.role,
        activePage: state.activePage,
        filterType: state.filterType,
        filterCategory: state.filterCategory,
        filterMonth: state.filterMonth,
        groupBy: state.groupBy,
        searchQuery: state.searchQuery,
        sortField: state.sortField,
        sortDirection: state.sortDirection,
      }),
      merge: (persistedState, currentState) => {
        const typedState = persistedState || {};
        const datasets = {
          ...getInitialDatasets(),
          ...(typedState.datasets || {}),
        };
        const role = typedState.role || currentState.role;
        // rebuild the visible transaction list from the restored role
        return {
          ...currentState,
          ...typedState,
          datasets,
          role,
          activePage: getValidPage(typedState.activePage),
          transactions: cloneTransactions(datasets[role]),
          initialized: false,
        };
      },
    }
  )
);
