import React, { useState, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Camera from "../Screens/Camera/Camera";
import CameraPermission from "../Screens/Camera/CameraPermissionScreen";
const Stack = createStackNavigator();

const CameraStackNavigation = () => {
  const [hasCameraPermission, setHasCameraPermission] = useState(false);

  useEffect(() => {
    const checkCameraPermission = async () => {
      const permission = await AsyncStorage.getItem("cameraPermissionGranted");
      if (permission === "true") {
        setHasCameraPermission(true);
      }
    };

    checkCameraPermission();
  }, []);

  return (
    <Stack.Navigator>
      {!hasCameraPermission ? (
        <>
          <Stack.Screen name="CameraPermission" component={CameraPermission} />
          <Stack.Screen name="CameraStandard" component={Camera} />
        </>
      ) : (
        <Stack.Screen name="CameraStandard" component={Camera} />
      )}
    </Stack.Navigator>
  );
};

export default CameraStackNavigation;
