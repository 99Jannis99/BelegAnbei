import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { request, PERMISSIONS, RESULTS } from "react-native-permissions";
import RenderHtml from "react-native-render-html";
import { useSelector } from "react-redux";

const CameraPermissionScreen = ({ navigation }) => {
  const { dataMorePages } = useSelector((state) => state.dataReducer);
  const [data, setData] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    setData(JSON.parse(dataMorePages));
  }, [dataMorePages]);

  const handleAccept = async () => {
    request(PERMISSIONS.ANDROID.CAMERA)
      .then((result) => {
        switch (result) {
          case RESULTS.GRANTED:
            console.log("Die Berechtigung für die Kamera wurde erteilt.");
            AsyncStorage.setItem("cameraPermissionGranted", "true");
            // Alternativ können Sie hier eine Redux-Aktion dispatchen
            // dispatch(setCameraPermission(true));
            navigation.navigate("CameraStandard");
            break;
          case RESULTS.DENIED:
            console.log(
              "Die Berechtigung für die Kamera wurde verweigert, ist aber anfragbar."
            );
            break;
          case RESULTS.BLOCKED:
            console.log(
              "Die Berechtigung für die Kamera wurde dauerhaft verweigert."
            );
            Alert.alert(
              "Berechtigung verweigert",
              "Bitte erlauben Sie den Zugriff auf die Kamera in Ihren Einstellungen.",
              [{ text: "OK" }]
            );
            break;
        }
      })
      .catch((error) => {
        console.warn("Fehler bei der Berechtigungsanfrage:", error);
      });
  };
  const renderSections = () => {
    const { width } = useWindowDimensions();
    if (Array.isArray(data)) {
      return data.map((item, index) => (
        <View key={index}>
          {item.headline && <Text style={styles.header}>{item.headline}</Text>}
          <RenderHtml contentWidth={width} source={{ html: item.content }} />
        </View>
      ));
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {renderSections()}
        <Button title="Annehmen" onPress={handleAccept} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {},
  content: {
    // justifyContent: "center",
    // alignItems: "center",
    padding: 20,
  },
  header: {
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 10,
    marginBottom: 5,
    color: "black",
  },
  paragraph: {
    fontSize: 14,
    textAlign: "justify",
    marginBottom: 10,
    color: "black",
  },
  button: {
    marginBottom: 120,
    height: 100,
  },
});

export default CameraPermissionScreen;
