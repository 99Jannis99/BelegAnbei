import RNFS from 'react-native-fs';

// Pfad zur customer.json Datei
const customerJsonPath = `${RNFS.DocumentDirectoryPath}/json/customer.json`;

export const readCustomerJson = async () => {
  try {
    // Überprüfen, ob die Datei existiert
    const fileExists = await RNFS.exists(customerJsonPath);
    if (!fileExists) {
      throw new Error('customer.json existiert nicht.');
    }

    // Dateiinhalt lesen
    const fileContent = await RNFS.readFile(customerJsonPath, 'utf8');
    
    // Den Inhalt als JSON parsen
    const jsonData = JSON.parse(fileContent);
    return jsonData;
  } catch (error) {
    console.error('Fehler beim Lesen der customer.json:', error);
    throw error;
  }
};
