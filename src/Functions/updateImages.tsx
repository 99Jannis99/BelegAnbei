import { useDispatch } from "react-redux";
import RNFetchBlob from "rn-fetch-blob";
import { Alert, PermissionsAndroid, Platform, Linking } from "react-native";

import { setWelcomeImage, setLogoImage } from "../redux/actions";

export const useDownloadFile = () => {
  const dispatch = useDispatch();

  const checkPermission = async () => {
    // Für iOS zurückkehren
    if (Platform.OS === "ios") {
      return true;
    }

    // Überprüfen, ob die Berechtigung bereits erteilt wurde
    const currentPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
    );

    console.log("currentPermission: ", currentPermission);
    if (currentPermission) {
      return true;
    }

    // Wenn nicht, dann die Berechtigung anfordern
    try {
      // const granted = await PermissionsAndroid.request(
      //   PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      //   {
      //     title: "Storage Permission Required",
      //     message: "This a pp needs access to your storage to download photos",
      //   }
      // );

      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      ]);
      console.log(granted);
      if (
        granted[PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE] ===
        "never_ask_again"
      ) {
        Alert.alert(
          "Permission required!",
          "To download photos, please grant storage permission from app settings.",
          [
            {
              text: "Open Settings",
              onPress: () => {
                // Dies öffnet die App-Einstellungen, so dass der Benutzer die Berechtigung manuell aktivieren kann
                Linking.openSettings();
              },
            },
            {
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
          ]
        );
        return false;
      } else if (granted === PermissionsAndroid.RESULTS.GRANTED) {
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
  };

  const downloadFile = async (url, image) => {
    // filename-Parameter entfernt
    // const isPermissionGranted = await checkPermission();

    // if (!isPermissionGranted) {
    //   return;
    // }

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
