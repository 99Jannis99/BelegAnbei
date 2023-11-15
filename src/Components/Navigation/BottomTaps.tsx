import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { SimpleLineIcons } from "../../helpers/icons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useSelector } from "react-redux";

import Welcome from "../Screens/Welcome";
import SettingsTopTaps from "../Navigation/SettingsTopTaps";
import DocumentsTopTaps from "../Navigation/DocumentsTopTaps";
import Camera from "../Screens/Camera/Camera";
import Header from "../shared/Header";
import CameraStackNavigation from "./CameraStack";

const BottomTaps = () => {
  const { background, primary } = useSelector((state) => state.colorReducer);
  const [currentTab, setCurrentTab] = useState("Welcome");
  const Tab = createMaterialTopTabNavigator();

  const getIcon = (name, focused) => (
    <SimpleLineIcons
      name={name}
      size={22.5}
      color={focused ? primary : "grey"}
    />
  );

  return (
    <View style={styles.Container}>
      {currentTab !== "Camera" && <Header />}

      <Tab.Navigator
        tabBarPosition="bottom"
        screenOptions={{
          tabBarShowLabel: false,
          headerShown: false,
          swipeEnabled: false,
          tabBarStyle: {
            backgroundColor: background,
            elevation: 0,
            height: 60,
            borderTopWidth: 1,
            borderTopColor: background,
          },
          tabBarIndicatorStyle: {
            position: "absolute",
            top: 0,
            height: 2,
            backgroundColor: primary,
          },
        }}
      >
        <Tab.Screen
          name="Welcome"
          component={Welcome}
          options={{ tabBarIcon: ({ focused }) => getIcon("home", focused) }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsTopTaps}
          options={{
            tabBarIcon: ({ focused }) => getIcon("settings", focused),
          }}
        />
          <Tab.Screen
          name="Camera"
          component={CameraStackNavigation}
          options={({ route, navigation }) => {
            const focused = navigation.isFocused();
            return {
              tabBarIcon: ({ focused }) => getIcon("camera", focused),
              tabBarStyle: focused
                ? { height: 0, overflow: "hidden" }
                : {
                    backgroundColor: background,
                    elevation: 0,
                    height: 60,
                    borderTopWidth: 1,
                    borderTopColor: background,
                  },
            };
          }}
          listeners={({ navigation }) => ({
            focus: () => {
              setCurrentTab("Camera");
              navigation.setOptions({ tabBarVisible: false });
            },
            blur: () => {
              setCurrentTab("Welcome");
              navigation.setOptions({ tabBarVisible: true });
            },
          })}
        />
        <Tab.Screen
          name="Documents"
          component={DocumentsTopTaps}
          options={{ tabBarIcon: ({ focused }) => getIcon("docs", focused) }}
        />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  Container: {
    flex: 1,
  },
});

export default BottomTaps;
