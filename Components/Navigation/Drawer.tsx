import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { Entypo, SimpleLineIcons } from "../../helpers/icons";
import { useSelector } from "react-redux";

import BottomTaps from "./BottomTaps";

import BeispielScreen from "../Screens/BeispielScreen";

import { createDrawerNavigator } from "@react-navigation/drawer";

const DrawerComponent = () => {
  const { background, primary } = useSelector((state) => state.colorReducer);
  const Drawer = createDrawerNavigator();
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: {
          backgroundColor: background,
        },
        drawerActiveBackgroundColor: primary,
        drawerInactiveTintColor: "grey",
        drawerActiveTintColor: "white",
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
              color={focused ? "white" : "grey"}
            />
          ),
        }}
        component={BottomTaps}
      />
      <Drawer.Screen
        name="BeispielScreen"
        options={{
          headerShown: false,
          drawerIcon: ({ focused, size }) => (
            <Entypo
              name="windows-store"
              size={size}
              color={focused ? "white" : "grey"}
            />
          ),
        }}
        component={BeispielScreen}
      />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  screenOptions: {
    drawerStyle: {
      backgroundColor: "#1b1b1b",
    },
    drawerActiveBackgroundColor: "#48ac98",
    drawerInactiveTintColor: "grey",
    drawerActiveTintColor: "white",
  },
});

export default DrawerComponent;
