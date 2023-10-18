import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useSelector } from "react-redux";
import { RouteProp, ParamListBase } from "@react-navigation/native";

import BeispielScreen from "../Screens/BeispielScreen";
import ChangeImage from "../Screens/ChangeImage";
import DatevTopTaps from "./DatevTopTaps";
import useShouldShowDatevAsMain from "../../helpers/moduleCalculations"; //helpers Funktion

const SettingsTopTaps = () => {
  // Zugreifen auf den colorReducer State aus Redux Store
  const { background, primary } = useSelector((state) => state.colorReducer);

  // Lokaler State, um die Anzeige der Module zu steuern
  const [modules, setModules] = useState({
    standard: true,
    einkommenssteuer: true,
    belegzentrale: true,
    datev: {
      unternehmenonline: true,
      meinesteuern: true,
    },
  });

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await fetch("http://192.168.178.98:5000/api/modules");
        const data = await response.json();
        setModules(data);
      } catch (error) {
        // console.log("Server is not running:", error);
      }
    };

    // Initialer Abruf beim Mounten
    fetchModules();

    // Polling: Alle 10 Sekunden abrufen
    const interval = setInterval(fetchModules, 10000);

    // Bei Unmounting: Interval löschen
    return () => clearInterval(interval);
  }, []);

  // Bedingung, um festzustellen, ob DATEV als Hauptelement im Navigator angezeigt werden soll
  const shouldShowDatevAsMain = useShouldShowDatevAsMain(modules);

  return (
    <View style={styles.Container}>
      <Tab.Navigator
        tabBarPosition="top"
        screenOptions={getScreenOptions(background, primary)}
      >
        {/* Rendern der Tabs basierend auf den Bedingungen im 'modules'-State */}
        {modules.standard &&
          renderTab("StandardSettings", ChangeImage, "Standard")}
        {modules.einkommenssteuer &&
          renderTab(
            "EinkommenssteuerSettings",
            BeispielScreen,
            "Einkommens-\nsteuer"
          )}
        {shouldShowDatevAsMain ? (
          renderTab("DatevSettings", DatevTopTaps, "DATEV")
        ) : (
          <>
            {modules.datev.unternehmenonline &&
              renderTab(
                "UnternehmenOnlineSettings",
                BeispielScreen,
                "Unternehmen Online"
              )}
            {modules.datev.meinesteuern &&
              renderTab(
                "MeineSteuernSettings",
                BeispielScreen,
                "Meine Steuern"
              )}
          </>
        )}
        {modules.belegzentrale &&
          renderTab(
            "BelegzentraleSettings",
            BeispielScreen,
            "Beleg-\nzentrale"
          )}
      </Tab.Navigator>
    </View>
  );
};

// Erstellen eines neuen Top Tab Navigators
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

// zusammenstellen der Tab.Navigator screenoptions
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

// Definieren der Styles für die Komponente
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

export default SettingsTopTaps;
