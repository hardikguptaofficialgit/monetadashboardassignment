import { roleTransactions } from "../data/mockData";

const STORAGE_KEY = "finance-dashboard-mock-api";
const NETWORK_DELAY = 260;

const clone = (value) => JSON.parse(JSON.stringify(value));

// mimic a small network delay so loading states feel realistic
const wait = (ms) => new Promise((resolve) => {
  window.setTimeout(resolve, ms);
});

const getDefaultDatasets = () => ({
  admin: clone(roleTransactions.admin),
  viewer: clone(roleTransactions.viewer),
});

const readStorage = () => {
  // fall back to seeded data when storage is empty or invalid
  const fallback = getDefaultDatasets();

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;

    const parsed = JSON.parse(raw);
    return {
      ...fallback,
      ...parsed,
    };
  } catch {
    return fallback;
  }
};

const writeStorage = async (datasets) => {
  // keep the fake api async so the store can handle sync states
  await wait(NETWORK_DELAY);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(clone(datasets)));
  return clone(datasets);
};

export const mockApi = {
  async fetchDatasets() {
    await wait(NETWORK_DELAY);
    return clone(readStorage());
  },

  async saveDatasets(datasets) {
    return writeStorage(datasets);
  },

  async resetDatasets() {
    const defaults = getDefaultDatasets();
    return writeStorage(defaults);
  },
};
