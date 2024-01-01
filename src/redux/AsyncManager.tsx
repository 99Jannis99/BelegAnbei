import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeColors = async (colors) => {
  try {
    await AsyncStorage.setItem("@colors", JSON.stringify(colors));
  } catch (e) {
    // Speichern des Fehlers
    console.error("Error in storeColors", e);
  }
};

export const loadColors = async () => {
  try {
    const value = await AsyncStorage.getItem("@colors");
    if (value !== null) {
      // Werte wurden gefunden, return als Objekt
      return JSON.parse(value);
    }
  } catch (e) {
    // Lesefehler
    console.error(e);
  }

  // Rückgabe eines Standard-Farbschemas, falls beim Laden ein Fehler auftritt oder keine Werte gefunden wurden
  return {
    background: "rgb(255, 255, 255)",
    primary: "rgb(0, 0, 0)",
  };
};

export const storeImages = async (image) => {
  try {
    await AsyncStorage.setItem("@image", JSON.stringify(image));
  } catch (e) {
    console.error("Error in storeImages", e);
  }
};

export const loadImages = async () => {
  try {
    const value = await AsyncStorage.getItem("@image");
    if (value !== null) {
      return JSON.parse(value);
    }
  } catch (e) {
    console.error(e);
  }

  return {
    welcomeImage: "", // Standardwert oder Placeholder-Image in base64
    logoImage: "",
    iconImage: ""
  };
};

export const storeData = async (data) => {
  try {
    for (const [key, value] of Object.entries(data)) {
      await AsyncStorage.setItem(`@${key}`, JSON.stringify(value));
    }
  } catch (e) {
    console.error("Error in storeData", e);
  }
};

export const loadData = async () => {
  const defaultData = {
    dataUpdate: {},
    dataCustomer: {},
    dataSettings: {},
    dataLocations: {},
    dataPersons: {},
    dataMoreIndex: {},
    dataMorePages: {},
    dataMoreFAQs: {},
    dataTextsnippets: {},
    dataAppointments: {},
    dataMoreDownloads: {},
    dataMoreVideos: {},
    dataNews: {},
    dataMandates: {},
    dataBelegcategories: {},
    dataStyle: {},
    dataDocuments: {},
    navPage:"StandardDocuments",
    dataIdentities:[],
  };
  try {
    for (const key in defaultData) {
      const value = await AsyncStorage.getItem(`@${key}`);
      if (value !== null) {
        defaultData[key] = JSON.parse(value);
      }
    }
    return defaultData;
  } catch (e) {
    console.error("Error in loadData", e);
    return defaultData; // Wenn es einen Fehler gibt, geben Sie die Standardwerte zurück
  }
};

export const storeDate = async (timestamp) => {
  try {
    await AsyncStorage.setItem("@timestamp", JSON.stringify(timestamp));
  } catch (e) {
    console.error("Error in storeDate", e);
  }
};

export const loadDate = async () => {
  try {
    const value = await AsyncStorage.getItem("@timestamp");
    if (value !== null) {
      return JSON.parse(value); // Gibt den gespeicherten Timestamp zurück
    }
  } catch (e) {
    console.error("Error in loadDate", e);
  }

  return "refresh"; // Rückgabe von "refresh" als Standardwert
};

export const storeDatev = async (data) => {
  try {
    for (const [key, value] of Object.entries(data)) {
      if (Array.isArray(value)) {
        // Es ist ein Array, also fortfahren mit dem Speichern
        await AsyncStorage.setItem(`@${key}`, JSON.stringify(value));
      }
    }
  } catch (e) {
    console.error("Error in storeData", e);
  }
};

export const loadDatev = async () => {
  const defaultDatev = {
    datevClient: [],
  };
  try {
    for (const key in defaultDatev) {
      const value = await AsyncStorage.getItem(`@${key}`);
      if (value !== null) {
        defaultDatev[key] = JSON.parse(value);
      }
    }
    return defaultDatev;
  } catch (e) {
    console.error("Error in loadDatev", e);
    return defaultDatev; // Wenn es einen Fehler gibt, geben Sie die Standardwerte zurück
  }
};
