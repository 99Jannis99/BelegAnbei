import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useSelector } from "react-redux";
import { RouteProp, ParamListBase } from "@react-navigation/native";

import BeispielScreen from "../Screens/BeispielScreen";
import DatevTopTaps from "./DatevTopTaps";
import useShouldShowDatevAsMain from "../../helpers/moduleCalculations";

const DocumentsTopTaps = () => {
  const { background, primary } = useSelector((state) => state.colorReducer);

  const [modules, setModules] = useState({
    standard: true,
    einkommenssteuer: true,
    belegzentrale: true,
    datev: {
      unternehmenonline: true,
      meinesteuern: true,
    },
  });

  const shouldShowDatevAsMain = useShouldShowDatevAsMain(modules);

  return (
    <View style={styles.Container}>
      <Tab.Navigator
        tabBarPosition="top"
        screenOptions={getScreenOptions(background, primary)}
      >
        {modules.standard &&
          renderTab("StandardDocuments", BeispielScreen, "Standard")}
        {modules.einkommenssteuer &&
          renderTab(
            "EinkommenssteuerDocuments",
            BeispielScreen,
            "Einkommens-\nsteuer"
          )}
        {shouldShowDatevAsMain ? (
          renderTab("DatevDocuments", DatevTopTaps, "DATEV")
        ) : (
          <>
            {modules.datev.unternehmenonline &&
              renderTab(
                "UnternehmenOnlineDocuments",
                BeispielScreen,
                "Unternehmen Online"
              )}
            {modules.datev.meinesteuern &&
              renderTab(
                "MeineSteuernDocuments",
                BeispielScreen,
                "Meine Steuern"
              )}
          </>
        )}
        {modules.belegzentrale &&
          renderTab(
            "BelegzentraleDocuments",
            BeispielScreen,
            "Beleg-\nzentrale"
          )}
      </Tab.Navigator>
    </View>
  );
};

const Tab = createMaterialTopTabNavigator();
const renderTab = (
  name: string,
  component:
    | React.ComponentType<{}>
    | React.ComponentType<{
        route: RouteProp<ParamListBase, any>;
        navigation: any;
      }>,
  label: string
) => (
  <Tab.Screen
    name={name}
    component={component}
    options={{ tabBarLabel: label }}
  />
);

const getScreenOptions = (background: any, primary: any) => ({
  ...styles.Navigator,
  tabBarStyle: {
    ...styles.Navigator.tabBarStyle,
    backgroundColor: background,
    borderTopColor: background,
  },
  tabBarIndicatorStyle: {
    ...styles.Navigator.tabBarIndicatorStyle,
    backgroundColor: primary,
  },
  tabBarActiveTintColor: primary,
});

const styles = StyleSheet.create({
  Container: {
    height: "100%",
  },
  Navigator: {
    tabBarShowLabel: true,
    headerShown: false,
    swipeEnabled: true,
    tabBarStyle: {
      elevation: 0,
      height: 60,
      borderTopWidth: 0,
    },
    tabBarIndicatorStyle: {
      position: "absolute",
      bottom: 0,
      height: 2,
    },
    tabBarInactiveTintColor: "grey",
    tabBarLabelStyle: {
      textTransform: "none",
      fontSize: 12,
    },
  },
});

export default DocumentsTopTaps;
