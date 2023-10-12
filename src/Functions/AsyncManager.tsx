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
  };
};
