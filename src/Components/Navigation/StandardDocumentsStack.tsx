import React, { useState, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Standard from "../Screens/Documents/Standard";
import StandardGroupeImages from "../Screens/Documents/StandardGroupImages";

const Stack = createStackNavigator();

const StandardDocumentsStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Standard"
        component={Standard}
        options={{ headerShown: false }} // Header für Standard ausblenden
      />
      <Stack.Screen
        name="StandardGroupeImages"
        component={StandardGroupeImages}
        options={{
          title: "Belegunterseite", // Titel für StandardGroupImages
          headerBackTitleVisible: false, // Text des Zurück-Buttons ausblenden
        }}
      />
    </Stack.Navigator>
  );
};

export default StandardDocumentsStack;
