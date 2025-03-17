// Function to get data from session storage
export const getSessionStorageData = (keyName: string) => {
  try {
    const savedItem = sessionStorage.getItem(keyName);
    // Check if the saved item looks like a JSON object or not
    if (savedItem && (savedItem.startsWith("{") || savedItem.startsWith("["))) {
      return JSON.parse(savedItem);
    }
    return savedItem;
  } catch (error) {
    console.error(`Error parsing sessionStorage item '${keyName}':`, error);
    return null;
  }
};

// Function to save data to session storage
export const saveSessionStorageData = (keyName: string, value: any) => {
  try {
    if (typeof value === "object") {
      sessionStorage.setItem(keyName, JSON.stringify(value));
    } else {
      sessionStorage.setItem(keyName, value);
    }
  } catch (error) {
    console.error(`Error saving sessionStorage item '${keyName}':`, error);
  }
};

// Function to delete data from session storage
export const deleteSessionStorageData = (keyName: string) => {
  try {
    sessionStorage.removeItem(keyName);
  } catch (error) {
    console.error(`Error removing sessionStorage item '${keyName}':`, error);
  }
};

// Function to update data in session storage
export const updateSessionStorageData = (keyName: string, updateVal: any) => {
  try {
    const getItem = sessionStorage.getItem(keyName);
    if (!getItem) {
      console.warn(`Item with key '${keyName}' not found!`);
      return;
    }
    if (typeof updateVal === "object") {
      sessionStorage.setItem(keyName, JSON.stringify(updateVal));
    } else {
      sessionStorage.setItem(keyName, updateVal);
    }
  } catch (error) {
    console.error(`Error updating sessionStorage item '${keyName}':`, error);
  }
};
