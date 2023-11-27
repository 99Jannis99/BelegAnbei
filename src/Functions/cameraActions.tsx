import { useState, useRef, useEffect } from "react";
import { Camera } from "react-native-camera-kit";
import DocumentScanner from "react-native-document-scanner-plugin";
import RNFileSystem from "react-native-fs";
import { useDispatch, useSelector } from "react-redux";
import uuid from "react-native-uuid"; // Für die Generierung von zufälligen IDs
import { useNavigation } from "@react-navigation/native";

const useCameraActions = () => {
  const { dataDocuments, navPage } = useSelector((state) => state.dataReducer);
  const navigation = useNavigation();

  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const cameraRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(navPage);
  }, [navPage]);

  const ensureDocumentsFolderExists = async () => {
    const documentsPath = `${RNFileSystem.DocumentDirectoryPath}/documents`;
    const folderExists = await RNFileSystem.exists(documentsPath);
    if (!folderExists) {
      await RNFileSystem.mkdir(documentsPath);
    }
  };

  const saveBase64ToFile = async (base64: string): Promise<string> => {
    await ensureDocumentsFolderExists();

    const randomFileName = `${uuid.v4()}`; // Erzeugt eine zufällige UUID als Dateinamen
    const newPath = `${RNFileSystem.DocumentDirectoryPath}/documents/${randomFileName}.jpg`;

    try {
      await RNFileSystem.writeFile(newPath, base64, "base64");
      return newPath;
    } catch (error) {
      console.error("Error while saving base64 to file:", error);
      throw error;
    }
  };

  const addToRedux = (groupID, fileNames) => {
    const newDocumentData = {
      ...dataDocuments,
      [groupID]: {
        images: fileNames,
        groupID: groupID,
      },
    };
    dispatch({ type: "ADD_DATA_DOCUMENTS", payload: newDocumentData });
    navigation.navigate(navPage);
  };

  const convertUriToBase64 = async (uri: string) => {
    try {
      const base64String = await RNFileSystem.readFile(uri, "base64");
      return base64String;
    } catch (error) {
      console.error("Error while converting URI to base64:", error);
    }
  };

  const handleCapture = async () => {
    try {
      const captureResult = await cameraRef.current.capture();
      // Überprüfen Sie, ob das Aufnahmergebnis eine gültige URI hat
      if (captureResult && captureResult.uri) {
        const base64String = await convertUriToBase64(captureResult.uri);
        if (base64String) {
          const savedPath = await saveBase64ToFile(base64String);
          const fileName = savedPath.split("/").pop().replace(".jpg", ""); // Extrahiert den Dateinamen ohne Erweiterung
          addToRedux(fileName); // Hier rufen wir die aktualisierte Funktion auf
        } else {
          console.error("Failed to convert URI to Base64 string");
        }
      } else {
        console.error("Capture result is undefined or does not contain a URI");
      }
    } catch (error) {
      console.error("Error while capturing photo:", error);
    }
  };

  const scanDocument = async () => {
    try {
      const scanResult = await DocumentScanner.scanDocument({
        croppedImageQuality: 100,
        responseType: "imageFilePath",
      });

      if (scanResult.scannedImages && scanResult.scannedImages.length > 0) {
        const groupID = uuid.v4(); // Erzeugt eine zufällige UUID für die Bildgruppe
        let fileNames = [];

        for (const uri of scanResult.scannedImages) {
          const base64String = await convertUriToBase64(uri);
          if (base64String) {
            const savedPath = await saveBase64ToFile(base64String);
            const fileName = savedPath.split("/").pop().replace(".jpg", "");
            fileNames.push(fileName);
          }
        }

        if (fileNames.length > 0) {
          addToRedux(groupID, fileNames);
        } else {
          console.error("Failed to process scanned images");
        }
      } else {
        console.error(
          "Scanned images are empty or the scan result is not in the expected format"
        );
      }
    } catch (error) {
      console.error("Error while scanning document:", error);
    }
  };

  return { imageBase64, scanDocument, handleCapture, cameraRef };
};

export default useCameraActions;
