import { useDispatch } from "react-redux";
import RNFetchBlob from "rn-fetch-blob";
import { Alert, PermissionsAndroid, Platform } from "react-native";

import { setWelcomeImage, setLogoImage } from "../redux/actions";

export const useDownloadFile = () => {
  const dispatch = useDispatch();

  const checkPermission = async () => {
    if (Platform.OS === "ios") {
      // Auf iOS sind normalerweise keine Berechtigungen für Dateidownloads erforderlich.
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: "Storage Permission Required",
            message: "This app needs access to your storage to download photos",
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("Storage permission granted.");
          return true;
        } else {
          Alert.alert("Permission Denied!", "Storage permission not granted");
          return false;
        }
      } catch (error) {
        console.error(error);
        return false;
      }
    }
    return true;
  };

  const downloadFile = async (url, image) => {
    // filename-Parameter entfernt
    const isPermissionGranted = await checkPermission();

    if (!isPermissionGranted) {
      return;
    }

    return RNFetchBlob.fetch("GET", url)
      .then((res) => {
        let status = res.info().status;

        if (status === 200) {
          // the conversion is done in native code
          let base64Str = res.base64();

          switch (image) {
            case "welcomeImage":
              dispatch(setWelcomeImage(base64Str)); // Dispatch Base64-String statt Pfad
              break;
            case "logoImage":
              dispatch(setLogoImage(base64Str)); // Dispatch Base64-String statt Pfad
              break;
            default:
              break;
          }
        } else {
          console.log(`Failed to download file: ${res.text()}`);
          throw new Error("Failed to download file");
        }
      })
      .catch((error) => {
        console.error("Download failed:", error);
        throw error;
      });
  };

  return downloadFile;
};
