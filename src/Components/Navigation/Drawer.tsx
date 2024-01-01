import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, Animated, NativeModules, NativeEventEmitter, DeviceEventEmitter, Platform, Linking } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
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

import { initStatusBar } from '../shared/StatusBar';

const { DATEV, DATEVDUO, DATEVDMS, ConfigProperties } = NativeModules;

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
    setlocalDataSettings(JSON.parse(dataSettings));

    // try to set statusbar color
    if(localDataSettings.hasOwnProperty("colors")) {
      if(localDataSettings.colors.hasOwnProperty("statusbar_hex")) {
        initStatusBar(localDataSettings.colors.statusbar_hex)
      }
    }
  }, [dataSettings]);

  useEffect(() => {
    setLocalDataStyle(JSON.parse(dataStyle));
  }, [dataStyle]);

  useEffect(() => {
    setlocalDataMoreIndex(JSON.parse(dataMoreIndex));
  }, [dataMoreIndex]);

  useEffect(() => {
    if(localDataSettings.hasOwnProperty("colors")) {
      if(localDataSettings.colors.hasOwnProperty("statusbar_hex")) {
        initStatusBar(localDataSettings.colors.statusbar_hex)
      }
    }
  }, [localDataSettings]);

/* DATEV */
  const [IsDATEVAvailable, setIsDATEVAvailable] = useState(false);
  const [IsDATEVLoggedIn, setIsDATEVLoggedIn] = useState(false);
  const [IsDATEVInitialized, setIsDATEVInitialized] = useState(false);
  const [IsDATEVSmartloginAvailable, setIsDATEVSmartloginAvailable] = useState(false);
  const [DATEVUserData, setDATEVUserData] = useState({});
    
  async function isDatevEnabled() {
    let datev_enabled = await ConfigProperties.prop('datev.enabled');
    console.log('getConfigProperty datev_enabled', typeof datev_enabled, datev_enabled);
    if(datev_enabled === "true") {
      console.log("DATEV ENABLED -> INIT")

      setIsDATEVAvailable(true);

      let client_id = await ConfigProperties.prop('datev.client_id');
      console.log('DCAL InitializeButton client_id', client_id);
    
      let client_secret = await ConfigProperties.prop('datev.client_secret');
      console.log('DCAL InitializeButton client_secret', client_secret);
    
      let scopes = await ConfigProperties.prop('datev.scopes');
      console.log('DCAL InitializeButton scopes', scopes);
    
      let redirect_uri = await ConfigProperties.prop('datev.redirect_uri');
      console.log('DCAL InitializeButton redirect_uri', redirect_uri);
    
      let sandbox = await ConfigProperties.prop('datev.sandbox');
      if(Platform.OS !== 'ios') {
          sandbox = (sandbox === "true");
      }
    
      console.log('DCAL InitializeButton sandbox', sandbox, typeof sandbox);
    
      DATEV.initialize(client_id, client_secret, scopes, redirect_uri, sandbox);
    }
  }
  useEffect(() => {
      //setIsDATEVAvailable(true);
      isDatevEnabled()
  }, []);

  async function loadDATEVUserData() {
    console.log('loadDATEVUserData');
    let client_id = await ConfigProperties.prop('datev.client_id');
    let sandbox = await ConfigProperties.prop('datev.sandbox');
    if(Platform.OS !== 'ios') {
        sandbox = (sandbox === "true");
    }

    let result = await DATEVDUO.userdata(client_id, sandbox)
    console.log('UserDataButton result', result);
  }

  // DATEV LOGIN
  useEffect(() => {
    Linking.getInitialURL().then((url) => {
      console.log('DATEV Q Linking.getInitialURL')
      //if(Platform.OS !== 'ios') return;

      if (url) {
        Linking.canOpenURL(url).then((supported) => {
          if (supported) {
             console.log('DATEV Q url', url)

             DATEV.handleURL(url)
          }
        });
      }
    }).catch((err) => {
      console.warn('DATEV Q An error occurred', err);
    });

    const urlListener = Linking.addEventListener('url', (event) => {
      console.log('DATEV A Linking.addEventListener')
      //if(Platform.OS !== 'ios') return;

      Linking.canOpenURL(event.url).then((supported) => {
        if (supported) {
           console.log('DATEV A event.url', event.url)

           DATEV.handleURL(event.url)
        }
      });
    });
    return () => { urlListener.remove() }; // never forget to unsubscribe
  }, []);

  // DATEV_IS_INITIALIZED
  useEffect(() => {
    const emitter = Platform.OS === 'ios' ? new NativeEventEmitter(NativeModules.DATEV) : DeviceEventEmitter
    const DATEV_IS_INITIALIZED_Listener = emitter.addListener('DATEV_IS_INITIALIZED', (e) => {
      console.log("NATIVE_EVENT DATEV_IS_INITIALIZED", e, typeof e);

      if(typeof e != 'boolean') {
        e = (e == "true")
      }

      if(!e) {
        isDatevEnabled()
      }

      // should be initialized
      setIsDATEVInitialized(e);
    });
    return () => DATEV_IS_INITIALIZED_Listener.remove(); // never forget to unsubscribe
  }, []);

  // DATEV_SMARTLOGIN_AVAILABLE
  useEffect(() => {
    const emitter = Platform.OS === 'ios' ? new NativeEventEmitter(NativeModules.DATEV) : DeviceEventEmitter
    const DATEV_SMARTLOGIN_AVAILABLE_Listener = emitter.addListener('DATEV_SMARTLOGIN_AVAILABLE', (e) => {
      console.log("NATIVE_EVENT DATEV_SMARTLOGIN_AVAILABLE", e, typeof e);

      if(typeof e != 'boolean') {
        e = (e == "true")
      }

      // true ES false NO
      setIsDATEVSmartloginAvailable(e);
    });
    return () => DATEV_SMARTLOGIN_AVAILABLE_Listener.remove(); // never forget to unsubscribe
  }, []);


  // DATEV_AuthState_Changed
  useEffect(() => {
    const emitter = Platform.OS === 'ios' ? new NativeEventEmitter(NativeModules.DATEV) : DeviceEventEmitter
    const DATEV_AuthState_Changed_Listener = emitter.addListener('DATEV_AuthState_Changed', (e) => {
      console.log("NATIVE_EVENT DATEV_AuthState_Changed", e, typeof e);

      if(typeof e != 'boolean') {
        e = (e == "true")
      }

      // true ES false NO
      setIsDATEVLoggedIn(e);

      if(e) {
        readDATEVUserData().then((res) => {
            console.log('RRRRRRRRRRRRRRRES', res)
            setDATEVUserData(res);
        })
        //loadDATEVUserData()
      }
    });
    return () => DATEV_AuthState_Changed_Listener.remove(); // never forget to unsubscribe
  }, []);

  // DATEV_AuthState_Error
  useEffect(() => {
    const emitter = Platform.OS === 'ios' ? new NativeEventEmitter(NativeModules.DATEV) : DeviceEventEmitter
    const DATEV_AuthState_Error_Listener = emitter.addListener('DATEV_AuthState_Error', (e) => {
      console.log("NATIVE_EVENT DATEV_AuthState_Error", e, typeof e);

      if(typeof e != 'boolean') {
        e = (e == "true")
      }
      
      // error so logout to be sure
      setIsDATEVLoggedIn(e);
    });
    return () => DATEV_AuthState_Error_Listener.remove(); // never forget to unsubscribe
  }, []);

  const saveDATEVUserData = async (userData: object) => {
    try {
      await AsyncStorage.setItem('DATEV_UserData', JSON.stringify(userData));
    } catch (error) {
      // Error saving data
      console.log('saveDATEVUserData NO error', error);
    }
  };

  const readDATEVUserData = async () => {
    try {
      const value = await AsyncStorage.getItem('DATEV_UserData');
      if (value !== null) {
        // We have data!!
        console.log('readDATEVUserData value', value);

        return JSON.parse(value);
      } else {
        console.log('readDATEVUserData NO VALUE');
        loadDATEVUserData();
      }
    } catch (error) {
      // Error retrieving data
      loadDATEVUserData();
    }
  };

  // DATEV_DATA_USERDATA
  useEffect(() => {
    const emitter = Platform.OS === 'ios' ? new NativeEventEmitter(NativeModules.DATEVDUO) : DeviceEventEmitter
    const DATEV_DATA_USERDATA_Listener = emitter.addListener('DATEV_DATA_USERDATA', (e) => {
      console.log("NATIVE_EVENT DATEV_DATA_USERDATA", e, typeof e);
      let result = JSON.parse(e);

      if(result.code == 201) {
        const resultData:object = Platform.OS === 'ios' ? result.data : JSON.parse(result.data)

        saveDATEVUserData(resultData);
        setDATEVUserData(resultData);
      } else {
        console.log('Error -> ' + result.code)
      }
    });
    return () => DATEV_DATA_USERDATA_Listener.remove(); // never forget to unsubscribe
  }, []);
/* DATEV */

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
              marginBottom: 12,
              paddingBottom: 18,
              borderBottomColor: "#ffffff",
              borderBottomWidth: 1
            }}
            activeOpacity={1}
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
          {IsDATEVAvailable && 
            <View
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
            >
  
              <Image
                //style={{ width: useImageWidth, height: useImageWidth, padding: 12, marginLeft: 0, marginRight: 0, marginTop: 18, marginBottom: 12, padding: 0 }}
                style={{ 
                  width: 36, 
                  height: 36, 
                  padding: 18,
                  marginLeft: 6,
                  flexShrink: 1,
                  borderRadius: 9,
                  marginRight: 18
                }}
                source={require("../../../assets/images/datev_duo.png")}
              />
              { !IsDATEVInitialized && 
                <View>
                  <CustomText fontType="light" style={{}}>DATEV ist nicht initialisiert</CustomText>
                  <TouchableOpacity onPress={() => { isDatevEnabled() }}>
                    <CustomText fontType="bold" style={{}}>Jetzt initialisieren</CustomText>
                  </TouchableOpacity>
                </View>
              }
              { IsDATEVInitialized && IsDATEVSmartloginAvailable && !IsDATEVLoggedIn && 
                <View>
                  <CustomText fontType="light" style={{}}>Sie sind nicht angemeldet.</CustomText>
                  <TouchableOpacity onPress={() => { DATEV.requestLogin() }}>
                    <CustomText fontType="bold" style={{}}>Jetzt anmelden</CustomText>
                  </TouchableOpacity>
                </View>
              }
              { IsDATEVInitialized && !IsDATEVSmartloginAvailable && !IsDATEVLoggedIn && 
                <View>
                  <CustomText fontType="light" style={{ fontSize: 14 }}>DATEV SMartlogin App ist nicht installiert. Bitte gehen Sie i den AppStore und installieren diese nach, um sich anmelden zu können</CustomText>
                  <TouchableOpacity onPress={() => { console.log('dl smartlogin') }}>
                    <CustomText fontType="bold" style={{}}>Zur App</CustomText>
                  </TouchableOpacity>
                </View>
              }
              { IsDATEVInitialized && IsDATEVSmartloginAvailable && IsDATEVLoggedIn && 
                <TouchableOpacity activeOpacity={1} onPress={() => props.navigation.navigate("UnternehmenOnlineSettings")}>
                  <View style={{ flexDirection: "column", flex: 1 }}>
                    <CustomText fontType="bold" style={{ fontSize: 14 }}>{DATEVUserData.name}{"\n"}<CustomText fontType="light" style={{ fontSize: 14 }}>{DATEVUserData.email}</CustomText></CustomText>
                  </View>
                  {/* <Text>{JSON.stringify(DATEVUserData, null, 2)}</Text> */}
                </TouchableOpacity>
              }
            </View>
            }
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
        drawerType: "front",
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
