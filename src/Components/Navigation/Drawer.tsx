import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useSelector } from "react-redux";
import { SimpleLineIcons, Entypo } from "../../helpers/icons";
import {
  useDownloadJSON,
  useLoadAndStoreData,
  useDownloadImage,
} from "../../Functions/dataUpdater";
import { loadDate, storeDate } from "../../redux/AsyncManager";
import LottieView from "lottie-react-native";

import originalCustomer from "../../../data/customer.json";
import BottomTaps from "./BottomTaps";
import BeispielScreen from "../Screens/BeispielScreen";

const DrawerComponent = () => {
  const [areDataLoaded, setDataLoaded] = useState(false);
  const [localDataSettings, setlocalDataSettings] = useState({});
  const [localDataMoreIndex, setlocalDataMoreIndex] = useState([]);

  const [localDataStyle, setLocalDataStyle] = useState({});

  const { dataSettings, dataStyle, dataMoreIndex } = useSelector(
    (state) => state.dataReducer
  );

  const downloadJSONFile = useDownloadJSON();
  const loadAndStoreData = useLoadAndStoreData();
  const downloadImage = useDownloadImage();

  useEffect(() => {
    setLocalDataStyle(JSON.parse(dataStyle));
    console.log(dataStyle);
  }, [dataStyle]);
  useEffect(() => {
    setlocalDataMoreIndex(JSON.parse(dataMoreIndex));
    // console.log(JSON.parse(dataMoreIndex));
  }, [dataMoreIndex]);

  const fetchData = async () => {
    try {
      const customerData = require("../../../data/customer.json");
      let count = 0;
      const filenames = [
        "update.json",
        "customer.json",
        "settings.json",
        "locations.json",
        "persons.json",
        "more.index.json",
        "more.pages.json",
        "more.faqs.json",
        "textsnippets.json",
        "appointments.json",
        "more.downloads.json",
        "more.videos.json",
        "news.json",
        "mandates.json",
        "belegcategories.json",
        "style.json",
      ];
      const imageNames = ["homeImg.jpg", "header.png"];

      for (let filename of filenames) {
        await downloadJSONFile(customerData.customer_api_token, filename);
        count = count + 1;
      }
      for (let imageName of imageNames) {
        await downloadImage(customerData.customer_api_token, imageName);
        count = count + 1;
      }
      if (count === filenames.length + imageNames.length) {
        setDataLoaded(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Fehler in fetchData:", error);
      return false; // Fehler bei der Ausführung
    }
  };

  useEffect(() => {
    const setDataFromStorage = async () => {
      try {
        const lastUpdateDate = await loadDate();

        // POST-Anfrage
        const response = await fetch(
          "https://app-backend.beleganbei.de/api/app-sync/check/content/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              token: originalCustomer.customer_api_token,
              last: lastUpdateDate,
            }),
          }
        );
        const responseData = await response.json();
        if (responseData.success.update) {
          const fetchDataSuccess = await fetchData();
          if (fetchDataSuccess) {
            storeDate(responseData.success.should);
          }
        } else {
          const loadAndStoreSuccess = await loadAndStoreData();
          if (loadAndStoreSuccess) {
            setDataLoaded(true);
          }
        }
      } catch (error) {
        console.error("Failed to load data in Drawer.tsx:", error);
      }
    };
    setDataFromStorage();
  }, []);

  useEffect(() => {
    setlocalDataSettings(JSON.parse(dataSettings));
  }, [dataSettings]);

  const Drawer = createDrawerNavigator();

  const getIcon = (iconName, size, focused, color) => {
    // Icon Auswahl basierend auf iconName
    // switch (iconName) {
    //   case "location-arrow":
    //     return <Entypo name={iconName} size={size} color={color} />;
    //   // Fügen Sie hier weitere Fälle für unterschiedliche Icons hinzu
    //   default:
    //     return <SimpleLineIcons name={iconName} size={size} color={color} />;
    // }
    return (
      <SimpleLineIcons
        name={"menu"}
        size={size}
        color={
          focused
            ? localDataStyle.bottom_toolbar_belege_count_active_background_color
            : localDataStyle.bottom_toolbar_icon_color
        }
      />
    );
  };

  const createDrawerScreens = () => {
    if (!Array.isArray(localDataMoreIndex)) {
      return null;
    }

    return localDataMoreIndex.map((screenGroup, index) => {
      return screenGroup.blocks.map((block, blockIndex) => {
        if (block.active === "1") {
          return (
            <Drawer.Screen
              key={`${index}-${blockIndex}`}
              name={block.label}
              component={BeispielScreen} // Ersetzen Sie dies durch Ihre entsprechende Komponente
              options={{
                headerShown: false,
                drawerIcon: ({ focused, size }) =>
                  getIcon(
                    block.icon,
                    size,
                    focused,
                    localDataSettings.textcolor_hex
                  ),
              }}
            />
          );
        }
      });
    });
  };

  if (!areDataLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <LottieView
          style={{ width: 200, height: 200 }}
          source={require("../../../assets/animations/flyer.json")}
          autoPlay
          loop
          speed={2}
        />
      </View>
    );
  }

  return (
    // <Drawer.Navigator
    //   screenOptions={{
    //     drawerStyle: {
    //       backgroundColor: localDataStyle,
    //     },
    //     drawerActiveBackgroundColor: localDataSettings.statusbar_hex,
    //     drawerInactiveTintColor: "grey",
    //     drawerActiveTintColor: localDataSettings.textcolor_hex,
    //   }}
    // >
    //   <Drawer.Screen
    //     name="Home"
    //     options={{
    //       headerShown: false,
    //       drawerIcon: ({ focused, size }) => (
    //         <SimpleLineIcons
    //           name="home"
    //           size={size}
    //           color={focused ? localDataSettings.textcolor_hex : "grey"}
    //         />
    //       ),
    //     }}
    //     component={BottomTaps}
    //   />
    //   <Drawer.Screen
    //     name="BeispielScreen"
    //     options={{
    //       headerShown: false,
    //       drawerIcon: ({ focused, size }) => (
    //         <Entypo
    //           name="windows-store"
    //           size={size}
    //           color={focused ? localDataSettings.textcolor_hex : "grey"}
    //         />
    //       ),
    //     }}
    //     component={BeispielScreen}
    //   />
    // </Drawer.Navigator>
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: {
          backgroundColor: localDataStyle.bottom_toolbar_background_color,
        },
        drawerActiveBackgroundColor:
          localDataStyle.bottom_toolbar_belege_count_active_color,
        drawerInactiveTintColor: localDataStyle.bottom_toolbar_icon_color,
        drawerActiveTintColor:
          localDataStyle.bottom_toolbar_belege_count_active_background_color,
      }}
    >
      <Drawer.Screen
        name="Home"
        options={{
          headerShown: false,
          drawerIcon: ({ focused, size }) => (
            <SimpleLineIcons
              name="home"
              size={size}
              color={focused ? localDataSettings.textcolor_hex : "grey"}
            />
          ),
        }}
        component={BottomTaps}
      />
      {createDrawerScreens()}
    </Drawer.Navigator>
  );
};

export default DrawerComponent;
