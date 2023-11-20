import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  ScrollView,
  Image,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { useSelector } from "react-redux";
import RenderHtml from "react-native-render-html";
import { use } from "i18next";

const Welcome = () => {
  const { dataCustomer, dataSettings, dataMorePages, dataStyle } = useSelector(
    (state) => state.dataReducer
  );
  const [localDataSettings, setlocalDataSettings] = useState({});
  const [localDataMorePages, setLocalDataMorePages] = useState(null);
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
    console.log(dataStyle)
  }, [dataStyle]);

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: localDataSettings.background_hex },
      ]}
    >
      <Image
        source={{ uri: `${welcomeImage}?t=${lastUpdated}` }}
        style={styles.image}
      />

      {/* Textkomponenten */}
      {localDataMorePages && (
        <View style={styles.content}>
          <Text style={styles.header}>
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

      {/* <Text
        style={[styles.headline, { color: localDataSettings.textcolor_hex }]}
      >
        {JSON.parse(dataCustomer).customer_name} !!
      </Text>
      <Text style={[styles.text, { color: localDataSettings.textcolor_hex }]}>
        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
        eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
        voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet
        clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit
        amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
        nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat,
        sed diam voluptua. At vero eos et accusam et justo duo dolores et ea
        rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem
        ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing
        elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna
        aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo
        dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus
        est Lorem ipsum dolor sit amet. ersetzen.
      </Text>
      <Text style={[styles.text, { color: localDataSettings.textcolor_hex }]}>
        Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse
        molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero
        eros et accumsan et iusto odio dignissim qui blandit praesent luptatum
        zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum
        dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh
        euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.
      </Text>
      <Text style={[styles.text, { color: localDataSettings.textcolor_hex }]}>
        Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper
        suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem
        vel eum iriure dolor in hendrerit in vulputate velit esse molestie
        consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et
        accumsan et iusto odio dignissim qui blandit praesent luptatum zzril
        delenit augue duis dolore te feugait nulla facilisi.
      </Text>
      <Text style={[styles.text, { color: localDataSettings.textcolor_hex }]}>
        Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet
        doming id quod mazim placerat facer possim assum. Lorem ipsum dolor sit
        amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod
        tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad
        minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis
        nisl ut aliquip ex ea commodo consequat.
      </Text> */}
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
