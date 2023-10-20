import { useDispatch } from "react-redux";
import RNFetchBlob from "rn-fetch-blob";
import { Alert, PermissionsAndroid, Platform, Linking } from "react-native";

import { setWelcomeImage, setLogoImage } from "../redux/actions";

var RNFileSystem = require("react-native-fs");

export const useDownloadFile = () => {
  const dispatch = useDispatch();

  const downloadFile = async (url, image) => {
    try {
      const res = await RNFetchBlob.fetch("GET", url);
      let status = res.info().status;

      if (status === 200) {
        const directoryPath = RNFileSystem.DocumentDirectoryPath ;

        // const directoryPath = "/Android/data/com.meinprojekt/cache";

        console.log("directoryPath: ", directoryPath);

        const path = `${directoryPath}/${image}.jpg`;
        await RNFileSystem.writeFile(path, res.data, "base64");

        // console.log("res.data:", res.data);

        const fileExists = await RNFileSystem.exists(path);
        console.log("File exists:", fileExists);

        const fileContent = await RNFileSystem.readFile(path, "base64");
        // console.log(`File content von ${path}:`, fileContent);

        switch (image) {
          case "welcomeImage":
            dispatch(
              setWelcomeImage(
                `file://${RNFileSystem.DocumentDirectoryPath}/welcomeImage.jpg`
              )
            );
            break;
          case "logoImage":
            dispatch(
              setLogoImage(
                `file://${RNFileSystem.DocumentDirectoryPath}/logoImage.jpg`
              )
            );
            break;
          default:
            break;
        }
      } else {
        console.log(`Failed to download file: ${res.text()}`);
        throw new Error("Failed to download file");
      }
    } catch (error) {
      console.error("Download failed:", error);
      throw error;
    }
  };

  return downloadFile;
};
