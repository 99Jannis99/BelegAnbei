// Importieren der notwendigen Module und Komponenten aus React, React Native und anderen Bibliotheken
import React from "react";
import { View, StyleSheet } from "react-native"; // Grundlegende Komponenten für die UI
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs"; // Navigation-Komponente für Tabs

// Importieren zusätzlicher Bildschirmkomponenten
import BeispielScreen from "../Screens/BeispielScreen";

// Komponente für die unteren Tabs
const SettingsTopTaps = () => {
  const Tab = createMaterialTopTabNavigator(); // Erstellen eines Tab-Navigators

  // Render-Methode der Komponente
  return (
    // Haupt-View-Komponente
    <View style={styles.Container}>
      {/* Tab-Navigator-Komponente, die mehrere Bildschirme als Tabs anzeigt */}
      <Tab.Navigator
        tabBarPosition="top" // Position der Tab-Leiste
        screenOptions={styles.NavigatorScreenOptions} // Styling-Optionen für den Navigator
      >
        {/* Definieren der einzelnen Tabs mit zugehörigen Bildschirmkomponenten und Icons */}
        <Tab.Screen
          name="StandardSettings" // Name des Tabs
          component={BeispielScreen} // Komponente, die im Tab angezeigt wird
          options={{ tabBarLabel: "Standard" }}
        />

        {/* Weitere Tabs ... */}
        <Tab.Screen
          name="EinkommenssteuerSettings"
          component={BeispielScreen}
          options={{ tabBarLabel: "Einkommens-\nsteuer" }}
        />
        <Tab.Screen
          name="DatevSettings"
          component={BeispielScreen}
          options={{ tabBarLabel: "DATEV" }}
        />
        <Tab.Screen
          name="BelegzentraleSettings"
          component={BeispielScreen}
          options={{ tabBarLabel: "Beleg-\nzentrale" }}
        />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  NavigatorScreenOptions: {
    tabBarShowLabel: true,
    headerShown: false,
    swipeEnabled: true,
    tabBarStyle: {
      backgroundColor: "#121212",
      elevation: 0,
      height: 60,
      borderTopWidth: 0,
      borderTopColor: "#1b1b1b",
    },
    tabBarIndicatorStyle: {
      position: "absolute",
      bottom: 0,
      height: 2,
      backgroundColor: "#48ac98",
    },
    tabBarActiveTintColor: "#48ac98", // Farbe des aktiven Tab-Labels
    tabBarInactiveTintColor: "grey", // Farbe des inaktiven Tab-Labels
    tabBarLabelStyle: {
      textTransform: "none", // Verhindert die Umwandlung des Texts in Großbuchstaben
      fontSize: 12, // Setzen Sie die gewünschte Schriftgröße
    },
  },

  Container: {
    height: "100%",
  },
});

// Exportieren der Komponente für die Verwendung in anderen Dateien
export default SettingsTopTaps;
