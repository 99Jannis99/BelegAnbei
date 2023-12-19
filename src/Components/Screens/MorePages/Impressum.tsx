import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, useWindowDimensions } from "react-native";
import { useSelector } from "react-redux";
import RenderHtml from "react-native-render-html";

function Impressum() {
  const { dataMorePages, dataStyle } = useSelector(
    (state) => state.dataReducer
  );

  const [localDataMorePages, setLocalDataMorePages] = useState(null);
  const [localDataStyle, setLocalDataStyle] = useState({});

  const { width } = useWindowDimensions();

  useEffect(() => {
    setLocalDataMorePages(JSON.parse(dataMorePages));
    console.log("dataMorePages: ", dataMorePages);
  }, [dataMorePages]);

  useEffect(() => {
    setLocalDataStyle(JSON.parse(dataStyle));
  }, [dataStyle]);
  return (
    <View>
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
    </View>
  );
}

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

export default Impressum;
