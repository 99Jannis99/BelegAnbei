import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import { useSelector } from "react-redux";
import { SimpleLineIcons, Entypo } from "../../helpers/icons";
import {
  useDownloadJSON,
  useLoadAndStoreData,
  useDownloadImage,
  useLoadAndStoreDatev,
} from "../../Functions/dataUpdater";
import { loadDate, storeDate } from "../../redux/AsyncManager";
import LottieView from "lottie-react-native";

import originalCustomer from "../../../data/customer.json";
import BottomTaps from "./BottomTaps";

import LocationScreen from "../Screens/More/LocationScreen";
import LocationsScreen from "../Screens/More/LocationsScreen";
import BelegArchivScreen from "../Screens/More/BelegArchivScreen";
import TextScreen from "../Screens/More/TextScreen";
import DocExchangeScreen from "../Screens/More/DocExchangeScreen";
import DownloadsScreen from "../Screens/More/DownloadsScreen";
import NewsScreen from "../Screens/More/NewsScreen";
import AnsprechpartnerScreen from "../Screens/More/AnsprechpartnerScreen";
import AppointmentsScreen from "../Screens/More/AppointmentsScreen";
import NotesScreen from "../Screens/More/NotesScreen";
import FAQScreen from "../Screens/More/FAQScreen";
import KontaktScreen from "../Screens/More/KontaktScreen";
import FormulareScreen from "../Screens/More/FormulareScreen";
import VideosScreen from "../Screens/More/VideosScreen";
import VideoScreen from "../Screens/More/VideoScreen";
import AppCleanScreen from "../Screens/More/AppCleanScreen";
import AppInfoScreen from "../Screens/More/AppInfoScreen";
import ChatScreen from "../Screens/More/ChatScreen";
import NotFoundScreen from "../Screens/More/NotFoundScreen";


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
  const loadAndStoreDatev = useLoadAndStoreDatev();
  const downloadImage = useDownloadImage();

  useEffect(() => {
    setLocalDataStyle(JSON.parse(dataStyle));
    // console.log(dataStyle);
  }, [dataStyle]);

  useEffect(() => {
    setlocalDataMoreIndex(JSON.parse(dataMoreIndex));
  //  console.log("dataMoreIndex: ", dataMoreIndex);
  }, [dataMoreIndex]);

  //console.log('localDataMoreIndex', localDataMoreIndex)

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
          const loadAndStoreSuccess = await loadAndStoreData() && await loadAndStoreDatev();
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

  const CustomDrawerContent = (props) => {
    return (
      <DrawerContentScrollView {...props}>
        {/* Home DrawerItem - Sie können dieses Muster für andere statische Links wiederholen */}
        <View
          style={{
            marginHorizontal: 5,
            borderRadius: 15,
            backgroundColor:
              props.state.routeNames[props.state.index] === "Home"
                ? localDataStyle.bottom_toolbar_belege_count_active_color
                : localDataStyle.bottom_toolbar_background_color,
          }}
        >
          <DrawerItem
            label="Home"
            onPress={() => props.navigation.navigate("Home")}
            icon={({ focused, size }) => (
              <SimpleLineIcons
                name="home"
                size={size}
                color={
                  focused
                    ? localDataStyle.bottom_toolbar_belege_count_active_background_color
                    : localDataStyle.bottom_toolbar_icon_color
                }
              />
            )}
            labelStyle={{
              color:
                props.state.routeNames[props.state.index] === "Home"
                  ? localDataStyle.bottom_toolbar_belege_count_active_background_color
                  : localDataStyle.bottom_toolbar_icon_color,
            }}
          />
        </View>

        {/* Restliche DrawerItems aus Ihrem Array */}
        {localDataMoreIndex.map((group, index) => (
          <View
            style={{
              borderColor: "white",
              borderWidth: 1,
              margin: 5,
              borderRadius: 15,
            }}
            key={`group-${index}`}
          >
            {/* <Text style={{ fontWeight: "bold", padding: 10 }}>
              {group.title}
            </Text> */}
            {group.items.map((item, itemIndex) => {
              if (item.active === "1") {
                return (
                  <View
                    key={`${index}-${itemIndex}`}
                    style={{
                      borderRadius: 15,
                      backgroundColor:
                        props.state.routeNames[props.state.index] ===
                        item.label
                          ? localDataStyle.bottom_toolbar_belege_count_active_color
                          : localDataStyle.bottom_toolbar_background_color,
                    }}
                  >
                    <DrawerItem
                      label={item.label}
                      onPress={() => props.navigation.navigate(item.label)}
                      icon={({ focused, size }) => (
                        <SimpleLineIcons
                          name="home"
                          size={size}
                          color={
                            focused
                              ? localDataStyle.bottom_toolbar_belege_count_active_background_color
                              : localDataStyle.bottom_toolbar_icon_color
                          }
                        />
                      )}
                      labelStyle={{
                        color:
                          props.state.routeNames[props.state.index] ===
                          item.label
                            ? localDataStyle.bottom_toolbar_belege_count_active_background_color
                            : localDataStyle.bottom_toolbar_icon_color,
                      }}
                    />
                  </View>
                );
              }
              return null;
            })}
          </View>
        ))}
      </DrawerContentScrollView>
    );
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
    //       backgroundColor: localDataStyle.bottom_toolbar_background_color,
    //     },
    //     drawerActiveBackgroundColor:
    //       localDataStyle.bottom_toolbar_belege_count_active_color,
    //     drawerInactiveTintColor: localDataStyle.bottom_toolbar_icon_color,
    //     drawerActiveTintColor:
    //       localDataStyle.bottom_toolbar_belege_count_active_background_color,
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
    //   {createDrawerScreens()}
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
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        key={`Home`}
        name={"Home"}
        component={BottomTaps}
        options={{
          headerShown: false,
          drawerIcon: ({ focused, size }) => (
            <SimpleLineIcons
              name="home"
              size={size}
              color={
                focused
                  ? localDataStyle.bottom_toolbar_belege_count_active_background_color
                  : localDataStyle.bottom_toolbar_icon_color
              }
            />
          ),
        }}
      />
      {localDataMoreIndex.map((group, index) =>
        group.items.map((item, itemIndex) => (
          <Drawer.Screen
            key={`${index}-${itemIndex}`}
            name={item.label}
            component={moreContentSwitcher(item.type)}
            initialParams={ item }
            options={{
              headerShown: false,
              drawerIcon: ({ focused, size }) => (
                <SimpleLineIcons
                  name="home"
                  size={size}
                  color={
                    focused
                      ? localDataStyle.bottom_toolbar_belege_count_active_background_color
                      : localDataStyle.bottom_toolbar_icon_color
                  }
                />
              ),
            }}
          />
        ))
      )}
    </Drawer.Navigator>
  );
};

const moreContentSwitcher = (type) => {
  switch(type) {
    case 'map-location':
      return LocationScreen
    break;
    case 'locations':
      return LocationsScreen
    break;
    case 'stats':
      return BelegArchivScreen
    break;
    case 'text':
      return TextScreen
    break;
    case 'documents':
      return DocExchangeScreen
    break;
    case 'downloads':
      return DownloadsScreen
    break;
    case 'news':
      return NewsScreen
    break;
    case 'persons':
      return AnsprechpartnerScreen
    break;
    case 'appointments':
      return AppointmentsScreen
    break;
    case 'notiz':
      return NotesScreen
    break;
    case 'help':
      return FAQScreen
    break;
    case 'contact':
      return KontaktScreen
    break;
case 'x':
  return PushSettingsScreen
break;
case 'x':
  return PushMessagesScreen
break;
    case 'mandates':
      return FormulareScreen
    break;
    case 'videos':
      return VideosScreen
    break;
    case 'video':
      return VideoScreen
    break;
    case 'cleanup':
      return AppCleanScreen
    break;
    case 'app-info':
      return AppInfoScreen
    break;
    case 'chat':
      return ChatScreen
    break;
    default:
      return NotFoundScreen
  }
}

export default DrawerComponent;
