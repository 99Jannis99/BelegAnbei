import { useDispatch } from "react-redux";
import RNFetchBlob from "rn-fetch-blob";
import RNFileSystem from "react-native-fs";

import {
  setDataUpdate,
  setDataCustomer,
  setDataSettings,
  setDataLocations,
  setDataPersons,
  setDataMoreIndex,
  setDataMorePages,
  setDataMoreFAQs,
  setDataTextsnippets,
  setDataAppointments,
  setDataMoreDownloads,
  setDataMoreVideos,
  setDataNews,
  setDataMandates,
  setDataBelegcategories,
  setDataStyle,
  setDataDocuments,
  setWelcomeImage,
  setIconImage,
  setLogoImage,
  setDatevClient,
  setNavPage,
  setDataIdentities,
} from "../redux/actions";

export const useDownloadJSON = () => {
  const dispatch = useDispatch();

  const downloadJSONFile = async (token: string, filename: string) => {
    try {
      const url = `https://apiv5.beleganbei.de/${token}/${filename}`;
      console.log('url', url)

      const res = await RNFetchBlob.fetch("GET", url);
      let status = res.info().status;

      if (status === 200) {
        switch (filename) {
          case "update.json":
            dispatch(setDataUpdate(res.data));
            // console.log("update"," :",res.data);
            break;
          case "customer.json":
            dispatch(setDataCustomer(res.data));
            // console.log("customer"," :",res.data);
            break;
          case "settings.json":
            dispatch(setDataSettings(res.data));
            // console.log("settings"," :",res.data);
            break;
          case "locations.json":
            dispatch(setDataLocations(res.data));
            // console.log("c"," :",res.data);
            break;
          case "persons.json":
            dispatch(setDataPersons(res.data));
            // console.log("persons"," :",res.data);
            break;
          case "more.index.json":
            dispatch(setDataMoreIndex(res.data));
            // console.log("more.index"," :",res.data);
            break;
          case "more.pages.json":
            dispatch(setDataMorePages(res.data));
            // console.log("more.pages"," :",res.data);
            break;
          case "more.faqs.json":
            dispatch(setDataMoreFAQs(res.data));
            // console.log("more.faqs"," :",res.data);
            break;
          case "textsnippets.json":
            dispatch(setDataTextsnippets(res.data));
            // console.log("textsnippets"," :",res.data);
            break;
          case "appointments.json":
            dispatch(setDataAppointments(res.data));
            // console.log("appointments"," :",res.data);
            break;
          case "more.downloads.json":
            dispatch(setDataMoreDownloads(res.data));
            // console.log("more.downloads"," :",res.data);
            break;
          case "more.videos.json":
            dispatch(setDataMoreVideos(res.data));
            // console.log("more.videos"," :",res.data);
            break;
          case "news.json":
            dispatch(setDataNews(res.data));
            // console.log("news"," :",res.data);
            break;
          case "mandates.json":
          case "formulare.json":
            dispatch(setDataMandates(res.data));
            // console.log("mandates"," :",res.data);
            break;
          case "belegcategories.json":
            dispatch(setDataBelegcategories(res.data));
            // console.log("belegcategories"," :",res.data);
            break;
          case "style.json":
            dispatch(setDataStyle(res.data));
            // console.log("belegcategories"," :",res.data);
            break;
          default:
            break;
        }
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

export const useDownloadImage = () => {
  const dispatch = useDispatch();

  const downloadImage = async (token: string, imageName: string) => {
    try {
      console.log("ImageURL: ", `http://app-backend.beleganbei.de/api/app-sync/files/${token}/${imageName}`);

      // Verwenden Sie RNFetchBlob direkt zum Herunterladen und Speichern der Datei
      const res = await RNFetchBlob.config({
        fileCache: true,
        path: `${RNFetchBlob.fs.dirs.DocumentDir}/${imageName}`,
      }).fetch(
        "GET",
        `http://app-backend.beleganbei.de/api/app-sync/files/${token}/${imageName}`
      );

      if (res.info().status === 200) {
        console.log("File saved to:", res.path());

        const fileExists = await RNFileSystem.exists(res.path());
        console.log("File exists:", fileExists);

        // Da die Datei bereits gespeichert ist, müssen wir sie nicht noch einmal lesen
        // const fileContent = await RNFileSystem.readFile(res.path(), "base64");
        // console.log(`File content von ${res.path()}:`, fileContent);

        switch (imageName) {
          case "homeImg.jpg":
            dispatch(setWelcomeImage(`file://${res.path()}`));
            break;
          case "header.png":
            dispatch(setLogoImage(`file://${res.path()}`));
            break;
          case "icon.png":
            dispatch(setLogoImage(`file://${res.path()}`));
            break;
          default:
            break;
        }
      } else {
        console.log(`Failed to download Image: ${res.text()}`);
        throw new Error("Failed to download Image");
      }
    } catch (error) {
      console.error("Download Image failed:", error);
      throw error;
    }
  };

  return downloadImage;
};

import { loadData, loadDatev } from "../redux/AsyncManager";

export const useLoadAndStoreData = () => {
  const dispatch = useDispatch();

  const loadAndStoreData = async () => {
    try {
      // Laden Sie die Daten aus dem AsyncStore
      const data = await loadData();

      // Überprüfen Sie jedes Datenobjekt und speichern Sie es im Redux-Store
      for (const [key, value] of Object.entries(data)) {
        switch (key) {
          case "dataUpdate":
            dispatch(setDataUpdate(value));
            break;
          case "dataCustomer":
            dispatch(setDataCustomer(value));
            break;
          case "dataSettings":
            dispatch(setDataSettings(value));
            break;
          case "dataLocations":
            dispatch(setDataLocations(value));
            break;
          case "dataPersons":
            dispatch(setDataPersons(value));
            break;
          case "dataMoreIndex":
            dispatch(setDataMoreIndex(value));
            break;
          case "dataMorePages":
            dispatch(setDataMorePages(value));
            break;
          case "dataMoreFAQs":
            dispatch(setDataMoreFAQs(value));
            break;
          case "dataTextsnippets":
            dispatch(setDataTextsnippets(value));
            break;
          case "dataAppointments":
            dispatch(setDataAppointments(value));
            break;
          case "dataMoreDownloads":
            dispatch(setDataMoreDownloads(value));
            break;
          case "dataMoreVideos":
            dispatch(setDataMoreVideos(value));
            break;
          case "dataNews":
            dispatch(setDataNews(value));
            break;
          case "dataMandates":
            dispatch(setDataMandates(value));
            break;
          case "dataBelegcategories":
            dispatch(setDataBelegcategories(value));
            break;
          case "dataStyle":
            dispatch(setDataStyle(value));
            break;
          case "dataDocuments":
            dispatch(setDataDocuments(value));
            break;
          case "navPage":
            dispatch(setNavPage(value));
            break;
            case "dataIdentities":
              dispatch(setDataIdentities(value));
              break;
          default:
            console.warn(`Unbekannter Schlüssel beim Laden der Daten: ${key}`);
            break;
        }
      }
      return true; // Erfolgreiche Ausführung
    } catch (error) {
      console.error("Error in loadAndStoreData", error);
      return false; // Fehler bei der Ausführung
    }
  };

  return loadAndStoreData;
};

export const useLoadAndStoreDatev = () => {
  const dispatch = useDispatch();

  const loadAndStoreDatev = async () => {
    try {
      // Laden Sie die Daten aus dem AsyncStore
      const data = await loadDatev();
      // Überprüfen Sie jedes Datenobjekt und speichern Sie es im Redux-Store
      for (const [key, value] of Object.entries(data)) {
        switch (key) {
          case "datevClient":
            dispatch(setDatevClient(value));
            break;
          default:
            console.warn(`Unbekannter Schlüssel beim Laden der Daten: ${key}`);
            break;
        }
      }
      return true; // Erfolgreiche Ausführung
    } catch (error) {
      console.error("Error in loadAndStoreData", error);
      return false; // Fehler bei der Ausführung
    }
  };

  return loadAndStoreDatev;
};
