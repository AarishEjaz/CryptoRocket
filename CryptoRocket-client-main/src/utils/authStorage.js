const safeGetStorageItem = (key, defaultValue = null) => {
  try {
    const value = sessionStorage.getItem(key) || localStorage.getItem(key);

    if (!value || value === "undefined" || value === "null") {
      return defaultValue;
    }

    return JSON.parse(value);
  } catch (e) {
    console.error(`Error accessing ${key}:`, e);
    return defaultValue;
  }
};

export const saveCurrentUser = (userId) => {
  if (!userId) {
    console.error("User ID is undefined, cannot save.");
    return;
  }
  try {
    sessionStorage.setItem("currentUser", JSON.stringify(userId));
  } catch (e) {
    console.error("Error saving current user:", e);
  }
};


export const saveToken = (userId, token, role, data) => {
  // console.log({ userId, token, role, data })
  const currentTokens = safeGetStorageItem("authTokens", {});
  currentTokens[userId] = { token, role };
  try {
    localStorage.setItem("authTokens", JSON.stringify(currentTokens));
  } catch (e) {
    console.error("Error saving token:", e);
  }
  saveCurrentUser(userId);
};

export const getToken = (userId) => {
  const currentTokens = safeGetStorageItem("authTokens");
  return currentTokens ? currentTokens[userId] : null;
};

export const getCurrentUser = () => {
  const currentUser = safeGetStorageItem("currentUser");
  return currentUser ? getToken(currentUser) : null;
};

export const removeToken = (userId) => {
  const currentTokens = safeGetStorageItem("authTokens", {});
  sessionStorage.removeItem("currentUser");
  if (currentTokens && currentTokens[userId]) {
    delete currentTokens[userId];
    try {
      localStorage.setItem("authTokens", JSON.stringify(currentTokens));
    } catch (e) {
      console.error("Error removing token:", e);
    }
  }
};
