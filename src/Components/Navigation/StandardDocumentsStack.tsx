import React, { useState, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Standard from "../Screens/Documents/Standard";
import StandardGroupeImages from "../Screens/Documents/StandardGroupImages";

const Stack = createStackNavigator();

const StandardDocumentsStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Standard" component={Standard} />
      <Stack.Screen
        name="StandardGroupeImages"
        component={StandardGroupeImages}
      />
    </Stack.Navigator>
  );
};

export default StandardDocumentsStack;
