
const createNoopStorage = () => ({
  getItem: (_key: string): Promise<string | null> =>
    Promise.resolve(null),

  setItem: (_key: string, value: string): Promise<string> =>
    Promise.resolve(value),

  removeItem: (_key: string): Promise<void> =>
    Promise.resolve(),
});

const createLocalStorage = () => ({
  getItem: (key: string): Promise<string | null> =>
    Promise.resolve(window.localStorage.getItem(key)),

  setItem: (key: string, value: string): Promise<string> => {
    window.localStorage.setItem(key, value);
    return Promise.resolve(value);
  },

  removeItem: (key: string): Promise<void> => {
    window.localStorage.removeItem(key);
    return Promise.resolve();
  },
});

const storage =
  typeof window !== "undefined"
    ? createLocalStorage()
    : createNoopStorage();

export default storage;
