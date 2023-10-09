import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeColors = async (colors) => {
  try {
    await AsyncStorage.setItem('@colors', JSON.stringify(colors));
  } catch (e) {
    // Speichern des Fehlers
    console.error("Error in storeColors",e);
  }
};

export const loadColors = async () => {
    try {
      const value = await AsyncStorage.getItem('@colors');
      if(value !== null) {
        // Werte wurden gefunden, return als Objekt
        return JSON.parse(value);
      }
    } catch(e) {
      // Lesefehler
      console.error(e);
    }
  
    // Rückgabe eines Standard-Farbschemas, falls beim Laden ein Fehler auftritt oder keine Werte gefunden wurden
    return {
      background: 'rgb(255,0,0)',
      primary: 'rgb(0,255,0)',
    };
  };
  