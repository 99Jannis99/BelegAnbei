import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Camera, CameraType } from "react-native-camera-kit";
import { useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";

import useCameraActions from "../../../Functions/cameraActions";

const CameraModule = () => {
  const { handleCapture, scanDocument, cameraRef } = useCameraActions();
  const { dataSettings } = useSelector((state) => state.dataReducer);

  const [cameraMode, setCameraMode] = useState("");

  useEffect(() => {
    setCameraMode(JSON.parse(dataSettings).default_camera_mode);
    // setCameraMode("standard");
  }, [dataSettings]);

  useFocusEffect(
    React.useCallback(() => {
      if (cameraMode === "docscan") {
       scanDocument();
      }
    }, [cameraMode])
  );

  return (
    <View style={styles.container}>
      {cameraMode === "standard" && (
        <>
          <Camera
            style={styles.camera}
            ref={cameraRef}
            cameraType={CameraType.back}
          />
          <TouchableOpacity
            style={styles.captureButtonContainer}
            onPress={handleCapture}
          >
            <View style={styles.captureButton} />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  captureButtonContainer: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 35,
    backgroundColor: "white",
  },
  captureButton: {
    width: "100%",
    height: "100%",
    borderRadius: 35,
  },
});

export default CameraModule;
