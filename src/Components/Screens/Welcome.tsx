import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  ScrollView,
  Image,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import RenderHtml from "react-native-render-html";
import { use } from "i18next";
import { Button } from "react-native";

const Welcome = () => {
  const dispatch = useDispatch();
  const { dataCustomer, dataSettings, dataMorePages, dataStyle } = useSelector(
    (state) => state.dataReducer
  );

  const { datevClient } = useSelector((state) => state.datevReducer);

  const [localDataSettings, setlocalDataSettings] = useState({});
  const [localDataMorePages, setLocalDataMorePages] = useState(null);
  const [localDataStyle, setLocalDataStyle] = useState({});

  const updateDatev = (newClients) => {
    dispatch({ type: "SET_DATEV_CLIENT", payload: newClients });
  };

  const { width } = useWindowDimensions();

  // console.log("dataSettings: ", JSON.parse(dataSettings).statusbar_hex);
  const { welcomeImage, lastUpdated } = useSelector(
    (state) => state.imageReducer
  );

  useEffect(() => {
    setlocalDataSettings(JSON.parse(dataSettings));
  }, [dataSettings]);

  useEffect(() => {
    setLocalDataMorePages(JSON.parse(dataMorePages));
  }, [dataMorePages]);

  useEffect(() => {
    setLocalDataStyle(JSON.parse(dataStyle));
  }, [dataStyle]);

  useEffect(() => {
    console.log("datevClient: ", datevClient);
  }, [datevClient]);

  return (
    <ScrollView
      style={[
        styles.container,
        {
          backgroundColor: localDataStyle.body_background_color,
          // backgroundColor: localDataStyle.body_font_color
        },
      ]}
    >
      <Image
        source={{ uri: `${welcomeImage}?t=${lastUpdated}` }}
        style={styles.image}
      />

      {/* Textkomponenten */}
      {localDataMorePages && (
        <View style={styles.content}>
          <Text
            style={[
              styles.header,
              {
                color: localDataStyle.body_headline_color,
                fontFamily: localDataStyle.body_font_family,
              },
            ]}
          >
            {localDataMorePages.find((item) => item.callname === "home")
              ?.headline || ""}
          </Text>
          <RenderHtml
            contentWidth={width}
            source={{
              html:
                localDataMorePages.find((item) => item.callname === "home")
                  ?.content || "",
            }}
          />
        </View>
      )}
      <Button
        title="updateClient"
        onPress={()=>updateDatev(["Sahra", "Navin", "Bernd"])}
      ></Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  content: {
    padding: 20,
  },
  image: {
    width: "100%", // Bildbreite nimmt den gesamten verfügbaren Platz ein
    height: 200, // Höhe des Bildes
    resizeMode: "cover", // Bild wird beschnitten, um die Größe zu füllen, ohne das Seitenverhältnis zu verzerren
  },
  headline: {
    paddingVertical: 10, // Innenabstand um den Text
    paddingHorizontal: 20,
    fontSize: 20, // Schriftgröße des Textes
    color: "#48ac98",
  },
  text: {
    paddingVertical: 10, // Innenabstand um den Text
    paddingHorizontal: 20,
    fontSize: 16, // Schriftgröße des Textes
  },
  header: {
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 10,
    marginBottom: 5,
    color: "black",
  },
});

export default Welcome;
