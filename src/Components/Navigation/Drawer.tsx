import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, Animated } from "react-native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerContent,
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
import { Icon } from '@rneui/themed';

import originalCustomer from "../../../data/customer.json";
import BottomTaps from "./BottomTaps";
import { navFontFamily, navFontSize } from "../../../data/CustomerConstants";
import CustomText from '../shared/CustomText'
import { getBuildNumber, getReadableVersion, getApplicationName, getBundleId, isTablet  } from 'react-native-device-info';

import PushSettingsScreen from "../Screens/MorePages/PushSettingsScreen";
import PushArchiveScreen from "../Screens/MorePages/PushArchiveScreen";
import NotFoundScreen from "../Screens/MorePages/NotFoundScreen";
import TextScreen from "../Screens/MorePages/TextScreen";
import AnsprechpartnerScreen from "../Screens/MorePages/AnsprechpartnerScreen";
import LocationScreen from "../Screens/MorePages/LocationScreen";
import LocationsScreen from "../Screens/MorePages/LocationsScreen";
import AppInfoScreen from "../Screens/MorePages/AppInfoScreen";
import FAQScreen from "../Screens/MorePages/FAQScreen";
import NewsScreen from "../Screens/MorePages/NewsScreen";
import KontaktScreen from "../Screens/MorePages/KontaktScreen";
import DownloadsScreen from "../Screens/MorePages/DownloadsScreen";
import VideosScreen from "../Screens/MorePages/VideosScreen";
import VideoScreen from "../Screens/MorePages/VideoScreen";
import AppointmentsScreen from "../Screens/MorePages/AppointmentsScreen";
import DocExchangeScreen from "../Screens/MorePages/DocExchangeScreen";
import BelegArchivScreen from "../Screens/MorePages/BelegArchivScreen";
import ChatScreen from "../Screens/MorePages/ChatScreen";
import AppCleanScreen from "../Screens/MorePages/AppCleanScreen";
import NotesScreen from "../Screens/MorePages/NotesScreen";
import FormulareScreen from "../Screens/MorePages/FormulareScreen";
import DebugScreen from "../Screens/MorePages/DebugScreen";
import CalculatorsScreen from "../Screens/MorePages/CalculatorsScreen";

const ProgressBar = (props: { percent: any; }) => {
  return (
    <View style={{height: 4, backgroundColor: '#eee', borderRadius: 4, margin: 0}}>
      <Animated.View style={{width: props.percent, height: 4, backgroundColor: '#d8d8d8', borderRadius: 10, }} />
    </View>
  );
};

async function getAppInformation() {
  return {
    name: getApplicationName(),
    build: getBuildNumber(),
    readable: getReadableVersion(),
    bundle: getBundleId()
  };
}

async function isTabletDevice() {
  const isTabletDevice:Boolean = await isTablet();
  console.log('isTabletDevice', isTabletDevice); 
  return isTabletDevice;
}

const DrawerComponent = () => {
  const [areDataLoaded, setDataLoaded] = useState(false);
  const [localDataSettings, setlocalDataSettings] = useState({});
  const [localDataMoreIndex, setlocalDataMoreIndex] = useState([]);

  const [localDataStyle, setLocalDataStyle] = useState({});

  const [updateProgress, setUpdateProgress] = useState({
    'needed'  : false,
    'total'   : 0,
    'done'    : 0,
    'percent' : 0
  });

  const { dataSettings, dataStyle, dataMoreIndex } = useSelector(
    (state) => state.dataReducer
  );

  const [appInformation, setappInformation] = useState({});
  useEffect(() => {
    getAppInformation().then((result) => {
      setappInformation(result)
    })
  }, []);

  const [deviceIsTablet, setdeviceIsTablet] = useState(false);
  useEffect(() => {
    const isTabletDevice = isTablet();
    setdeviceIsTablet(isTabletDevice)
    console.log('deviceIsTablet', deviceIsTablet)
  }, [deviceIsTablet]);
  

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
        "formulare.json",
        "belegcategories.json",
        "style.json",
      ];
      const imageNames = ["homeImg.jpg", "header.png", "onload.png"];

      updateProgress.total = (filenames.length + imageNames.length);
      updateProgress.total = (filenames.length);
      updateProgress.done = 0;
      setUpdateProgress(updateProgress);

      for (let filename of filenames) {
        await downloadJSONFile(customerData.customer_api_token, filename);
        count = count + 1;

        updateProgress.done = count;
        var percent = (updateProgress.done/updateProgress.total*100);
        percent = percent > 100 ? 100 : percent;
        updateProgress.percent = parseInt(percent.toFixed(0));
        setUpdateProgress(updateProgress);
      }

      for (let imageName of imageNames) {
        await downloadImage(customerData.customer_api_token, imageName);
        count = count + 1;

        updateProgress.done = count;
        var percent = (updateProgress.done/updateProgress.total*100);
        percent = percent > 100 ? 100 : percent;
        updateProgress.percent = parseInt(percent.toFixed(0));
        setUpdateProgress(updateProgress);
      }

      if (count === filenames.length + imageNames.length) {
setDataLoaded(true);
console.log('PROCEED FROM UPDATE NEEDED AND DONE')
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

          updateProgress.needed = true;
          setUpdateProgress(updateProgress);

          const fetchDataSuccess = await fetchData();
          if (fetchDataSuccess) {
            storeDate(responseData.success.should);
          }
        } else {
          const loadAndStoreSuccess = await loadAndStoreData() && await loadAndStoreDatev();
          if (loadAndStoreSuccess) {
setDataLoaded(true);
console.log('PROCEED FROM NO UPDATE NOT NEEDED')
          } 
        }
      } catch (error) {
        //console.error("Failed to load data in Drawer.tsx:", error);

        // proceed anyways
        const loadAndStoreSuccess = await loadAndStoreData() && await loadAndStoreDatev();
        if (loadAndStoreSuccess) {
setDataLoaded(true);
console.log('PROCEED FROM ERROR')
        }
      }
    };
    setDataFromStorage();
  }, []);

  useEffect(() => {
    setlocalDataSettings(JSON.parse(dataSettings));
  }, [dataSettings]);

  const Drawer = createDrawerNavigator();

/*   const getIcon = (iconName, size, focused, color) => {
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
  }; */

  const CustomDrawerContent = (props) => {
    const { iconImage, lastUpdated } = useSelector((state) => state.imageReducer);

    return (
        <DrawerContentScrollView {...props}>
          {/* Home DrawerItem - Sie können dieses Muster für andere statische Links wiederholen */}
          <TouchableOpacity
            style={{
              //backgroundColor: localDataStyle.top_toolbar_background_color,
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
              padding: 8,
              marginBottom: 18,
              paddingBottom: 18,
              borderBottomColor: "#ffffff",
              borderBottomWidth: 1
            }}
            onPress={() => props.navigation.navigate("Home")}
          >

            <Image
              //style={{ width: useImageWidth, height: useImageWidth, padding: 12, marginLeft: 0, marginRight: 0, marginTop: 18, marginBottom: 12, padding: 0 }}
              style={{ 
                width: 36, 
                height: 36, 
                padding: 18,
                marginLeft: 6,
                flexShrink: 1,
                borderRadius: 9
              }}
              source={{
                uri: `${iconImage}?t=${lastUpdated}`
              }}
            />
            <CustomText textType="text" style={{ paddingLeft: 18, marginRight: 48, flexGrow: 1, color: "#FFFFFF" }}>{ originalCustomer.customer_name }</CustomText>
          </TouchableOpacity>
  {/*         <View
            style={{
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
                <Icon
                  name="heartbeat"
                  type="font-awesome"
                  color={
                    focused
                      ? localDataStyle.bottom_toolbar_icon_active_color
                      : localDataStyle.bottom_toolbar_icon_color
                  }
                />
              )}
              labelStyle={{
                fontFamily: navFontFamily,
                fontSize: navFontSize,
                color:
                  props.state.routeNames[props.state.index] === "Home"
                    ? localDataStyle.bottom_toolbar_belege_count_active_background_color
                    : localDataStyle.bottom_toolbar_icon_color,
              }}
            />
          </View> */}

          {/* Restliche DrawerItems aus Ihrem Array */}
          {localDataMoreIndex.map((group, index) => (
            <View
              style={{
                //borderColor: "white",
                //borderWidth: 1,
                //margin: 1,
                //borderRadius: 15,
                marginBottom: 20
              }}
              key={`group-${index}`}
            >
              {/* <Text style={{ fontWeight: "bold", padding: 10 }}>
                {group.title}
              </Text> */}
              {group.items.map((item, itemIndex) => {
                  return (
                    <View
                      key={`${index}-${itemIndex}`}
                      style={{
                        //borderRadius: 15,
                        backgroundColor:
                          props.state.routeNames[props.state.index] ===
                          item.label
                            ? localDataStyle.bottom_toolbar_background_active_color
                            : localDataStyle.bottom_toolbar_background_color,
                      }}
                    >
                      <DrawerItem
                        label={item.label}
                        onPress={() => props.navigation.navigate(item.label)}
                        icon={({ focused, size }) => (
                          <Icon
                            name={ item.icon }
                            size={navFontSize}
                            style={{ aspectRatio: 1 }}
                            allowFontScaling
                            type="font-awesome"
                            color={
                              focused
                                ? localDataStyle.bottom_toolbar_icon_active_color
                                : localDataStyle.bottom_toolbar_icon_color
                            }
                          />
                        )}
                        labelStyle={{
                          fontFamily: navFontFamily,
                          fontSize: navFontSize,
                          color:
                            props.state.routeNames[props.state.index] ===
                            item.label
                              ? localDataStyle.bottom_toolbar_icon_active_color
                              : localDataStyle.bottom_toolbar_icon_color,
                        }}
                      />
                    </View>
                  );
                return null;
              })}
            </View>
          ))}
        </DrawerContentScrollView>
    );
  };

  if (!areDataLoaded) {

    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center",backgroundColor: localDataStyle.top_toolbar_background_color }}>
        <Image 
          style={{ width: 200, height: 200, borderRadius:30 }}
          source={require("../../../assets/images/AppIcon.png")}
        />
        
        <CustomText fontType="bold" style={ {marginTop:40} }>{appInformation.name}</CustomText>
        <CustomText fontType="medium" style={{}}>v.{appInformation.readable}</CustomText>

        <LottieView
          style={{ width: 250, height: 120 }}
          source={require("../../../assets/animations/LoadingDots.json")}
          autoPlay
          loop
          speed={1}
        />

        <View>
          <ProgressBar percent={ updateProgress.percent }></ProgressBar>
        </View>
        
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
        //drawerType: (deviceIsTablet ? "permanent" : "slide"),
        drawerType: "slide",
        drawerStyle: {
          backgroundColor: localDataStyle.bottom_toolbar_background_color,
          //width: "100%"
        },
        drawerActiveBackgroundColor: localDataStyle.bottom_toolbar_belege_count_active_color,
        drawerInactiveTintColor: localDataStyle.bottom_toolbar_icon_color,
        drawerActiveTintColor: localDataStyle.bottom_toolbar_belege_count_active_background_color
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
  //console.log('moreContentSwitcher type', type)

  switch(type) {
    case 'push-settings':
      return PushSettingsScreen
    break;
    case 'push-archive':
      return PushArchiveScreen
    break;
    case 'calculators':
      return CalculatorsScreen
    break;
    case 'debug':
      return DebugScreen
    break;
    case 'formulare':
      //case 'mandates':
        return FormulareScreen
      break;
    case 'notiz':
      return NotesScreen
    break;
    case 'cleanup':
      return AppCleanScreen
    break;
    case 'chat':
      return ChatScreen
    break;
    case 'stats':
      return BelegArchivScreen
    break;
    case 'persons':
      return AnsprechpartnerScreen
    break; 
    case 'locations':
      return LocationsScreen
    break;
    case 'map-location':
      return LocationScreen
    break;
    case 'documents':
      return DocExchangeScreen
    break;
    case 'text':
      return TextScreen
    break;
    case 'app-info':
      return AppInfoScreen
    break;
    case 'help':
      return FAQScreen
    break;
    case 'appointments':
      return AppointmentsScreen
    break;
    case 'news':
      return NewsScreen
    break;
    case 'contact':
      return KontaktScreen
    break;
    case 'downloads':
      return DownloadsScreen
    break;
    case 'videos':
      return VideosScreen
    break;
    case 'video':
      return VideoScreen
    break;
    default:
      return NotFoundScreen
  }
}

export default DrawerComponent;
