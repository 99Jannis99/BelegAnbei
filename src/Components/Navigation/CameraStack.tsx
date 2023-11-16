import React, { useState, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Camera from "../Screens/Camera/Camera";
import CameraPermission from "../Screens/Camera/CameraPermissionScreen";
import { useSelector } from "react-redux";

const Stack = createStackNavigator();

const CameraStackNavigation = () => {
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const { dataMorePages } = useSelector((state) => state.dataReducer);

  useEffect(() => {
    const checkCameraPermission = async () => {
      const permission = await AsyncStorage.getItem("cameraPermissionGranted");
      if (permission === "true") {
        setHasCameraPermission(true);
      }
    };

    checkCameraPermission();
  }, []);

  useEffect(() => {
    console.log(dataMorePages);
  }, [dataMorePages]);

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
