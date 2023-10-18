import { useDispatch } from "react-redux";
import RNFetchBlob from "rn-fetch-blob";
import RNFileSystem from "react-native-fs";

export const useDownloadJSON = () => {
  const dispatch = useDispatch();

  const downloadJSONFile = async (token: string, filename: string) => {
    try {
      const url = `http://app-backend.beleganbei.de/api/app-sync/files/${token}/${filename}`;
      const res = await RNFetchBlob.fetch("GET", url);
      let status = res.info().status;

      if (status === 200) {
        const directoryPath = `${RNFileSystem.DocumentDirectoryPath}/json`;

        await RNFileSystem.mkdir(directoryPath);

        const path = `${directoryPath}/${filename}`;
        await RNFileSystem.writeFile(path, res.data, "utf8");

        // Überprüfen, ob Datei existiert (optional)
        const fileExists = await RNFileSystem.exists(path);
        console.log(
          `File ${filename} exists:`,
          fileExists,
          " under ",
          `file://${path}`
        );

        // TODO: Je nach Bedarf die erhaltenen Daten in den Redux-State speichern
      } else {
        console.log(`Failed to download file: ${res.text()}`);
        throw new Error("Failed to download file");
      }
    } catch (error) {
      console.error(`Download of ${filename} failed:`, error);
      throw error;
    }
  };

  return downloadJSONFile;
};
