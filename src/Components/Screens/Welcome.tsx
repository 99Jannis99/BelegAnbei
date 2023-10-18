import React, { useState, useEffect } from "react";
import { Text, View, ScrollView, Image, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { readCustomerJson } from "../../Functions/readJsonData";

const Welcome = () => {
  const { background, primary } = useSelector((state) => state.colorReducer);
  const { welcomeImage, lastUpdated } = useSelector(
    (state) => state.imageReducer
  );

  const [customerData, setCustomerData] = useState({});

  const isBackgroundDark = () => {
    const rgbPattern = /^rgb\(\d{1,3},\s*\d{1,3},\s*\d{1,3}\)$/;
    if (rgbPattern.test(background)) {
      const [r, g, b] = background.match(/\d+/g).map(Number);
      const avg = (r + g + b) / 3;
      return avg < 128;
    } else {
      return false;
    }
  };

  const fetchCustomerData = async () => {
    try {
      const customerData = await readCustomerJson();
      setCustomerData(customerData) ;
    } catch (error) {
      console.error("Fehler beim Abrufen der Kundendaten:", error);
    }
  };

  fetchCustomerData();

  return (
    <ScrollView style={[styles.container, { backgroundColor: background }]}>
      <Image
        source={{ uri: `${welcomeImage}?t=${lastUpdated}` }}
        style={styles.image}
      />

      {/* Textkomponenten */}

      <Text style={[styles.headline, { color: primary }]}>
        {customerData.customer_name} !!
      </Text>
      <Text
        style={[styles.text, { color: isBackgroundDark() ? "white" : "black" }]}
      >
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
      <Text
        style={[styles.text, { color: isBackgroundDark() ? "white" : "black" }]}
      >
        Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse
        molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero
        eros et accumsan et iusto odio dignissim qui blandit praesent luptatum
        zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum
        dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh
        euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.
      </Text>
      <Text
        style={[styles.text, { color: isBackgroundDark() ? "white" : "black" }]}
      >
        Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper
        suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem
        vel eum iriure dolor in hendrerit in vulputate velit esse molestie
        consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et
        accumsan et iusto odio dignissim qui blandit praesent luptatum zzril
        delenit augue duis dolore te feugait nulla facilisi.
      </Text>
      <Text
        style={[styles.text, { color: isBackgroundDark() ? "white" : "black" }]}
      >
        Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet
        doming id quod mazim placerat facer possim assum. Lorem ipsum dolor sit
        amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod
        tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad
        minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis
        nisl ut aliquip ex ea commodo consequat.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
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
});

export default Welcome;
