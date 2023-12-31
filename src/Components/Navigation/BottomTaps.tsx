import React, { useState, useEffect, Fragment } from "react";
import { View, StyleSheet, TouchableHighlight, SafeAreaView } from "react-native";
import { MaterialIcons, Feather, FontAwesome5, MaterialCommunityIcons } from "../../helpers/icons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useSelector } from "react-redux";

import Welcome from "../Screens/Welcome";
import SettingsTopTaps from "../Navigation/SettingsTopTaps";
import DocumentsTopTaps from "../Navigation/DocumentsTopTaps";
import CameraStackNavigation from "./CameraStack";
import Header from "../shared/Header";

const BottomTaps = () => {
  const { background } = useSelector((state) => state.colorReducer);
  const { dataStyle, dataSettings } = useSelector((state) => state.dataReducer);

  const [localSettings, setLocalSettings] = useState({});
  useEffect(() => {
    setLocalSettings(JSON.parse(dataSettings));
    //console.log('localSettings xxx', localSettings)
  }, [dataSettings]);

  const [localDataStyle, setLocalDataStyle] = useState({});
  const [pressedIndex, setPressedIndex] = useState(null);

  const Tab = createMaterialTopTabNavigator();

  useEffect(() => {
    setLocalDataStyle(JSON.parse(dataStyle));
    //console.log('localDataStyle', localDataStyle)
    console.log('localDataStyle xxx', JSON.stringify(localDataStyle, null, 2))
    console.log('localDataStyle xxx', localDataStyle.bottom_toolbar_background_color)
  }, [dataStyle]);

  const getIcon = (routeName, focused) => {
    let iconName;

    // Zuordnung der Routennamen zu den Icon-Namen
    switch (routeName) {
      case "welcome":
        iconName = "home"; // Ersetzen Sie 'home' mit dem tatsächlichen Icon-Namen für 'Welcome'
        break;
      case "settings":
        iconName = "user-cog"; // Ersetzen Sie 'settings' mit dem tatsächlichen Icon-Namen für 'Settings'

        break;
      case "camera":
        iconName = "add-a-photo"; // Ersetzen Sie 'camera' mit dem tatsächlichen Icon-Namen für 'Camera'
        return (<MaterialIcons name={iconName} size={30} color={ focused ? localDataStyle.bottom_toolbar_icon_active_color : localDataStyle.bottom_toolbar_icon_color }/>);
        break;
      case "documents":
        iconName = "file-document-multiple-outline"; // Ersetzen Sie 'docs' mit dem tatsächlichen Icon-Namen für 'Documents'
        return (<MaterialCommunityIcons name={iconName} size={26} color={ focused ? localDataStyle.bottom_toolbar_icon_active_color : localDataStyle.bottom_toolbar_icon_color }/>);
        break;
      default:
        iconName = "gallery_thumbnail"; // Ein Standard-Icon, falls kein passendes gefunden wird
    }

    return (
      <FontAwesome5
        name={iconName}
        size={26}
        color={
          focused
            ? localDataStyle.bottom_toolbar_icon_active_color
            : localDataStyle.bottom_toolbar_icon_color
        }
      />
    );
  };

  const CustomTabBar = ({ state, descriptors, navigation }) => {
    return (
      <View style={{ flexDirection: "row", height: 60 }}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;

          const onPress = () => {
            navigation.navigate(route.name);
          };

          return (
            <TouchableHighlight
              key={route.key}
              underlayColor={
                localDataStyle.bottom_toolbar_background_active_color
              }
              onPress={onPress}
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: isFocused
                  ? localDataStyle.bottom_toolbar_background_active_color
                  : localDataStyle.bottom_toolbar_background_color,
              }}
            >
              {getIcon(route.name.toLowerCase(), isFocused)}
            </TouchableHighlight>
          );
        })}
      </View>
    );
  };

  return (
    <Fragment>
      {localSettings.colors &&
        <SafeAreaView style={{ flex: 0, backgroundColor: localSettings.colors.statusbar_hex }} />
      }
      <SafeAreaView style={{flex: 1, backgroundColor: localDataStyle.bottom_toolbar_background_active_color }}>
        <Header />

        <Tab.Navigator
          tabBarPosition="bottom"
          tabBar={(props) => <CustomTabBar {...props} />}
          screenOptions={{
            tabBarShowLabel: false,
            headerShown: false,
            swipeEnabled: false,
          }}
        >
          <Tab.Screen name="Welcome" component={Welcome} />
          <Tab.Screen name="Settings" component={SettingsTopTaps} />
          <Tab.Screen name="Camera" component={CameraStackNavigation} />
          <Tab.Screen name="Documents" component={DocumentsTopTaps} />
        </Tab.Navigator>
      </SafeAreaView>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  Container: {
    flex: 1,
  },
});

export default BottomTaps;
