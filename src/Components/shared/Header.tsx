// Importieren von erforderlichen Modulen und Komponenten aus React, React Native und anderen Bibliotheken
import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  NativeModules,
  DeviceEventEmitter,
} from "react-native";
import { SimpleLineIcons } from "../../helpers/icons";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";

// Definition der Header-Komponente
const Header = () => {
  const [localDataSettings, setlocalDataSettings] = useState({});
  const [localDataStyle, setLocalDataStyle] = useState({});

  const { dataSettings, dataStyle } = useSelector((state) => state.dataReducer);
  const { logoImage, lastUpdated } = useSelector((state) => state.imageReducer);

  useEffect(() => {
    setlocalDataSettings(JSON.parse(dataSettings));
  }, [dataSettings]);

  useEffect(() => {
    setLocalDataStyle(JSON.parse(dataStyle));
  }, [dataStyle]);

  // Wir definieren einen Zustand namens iconContainerWidth mit einem Anfangswert von 0.
  // Dieser Zustand wird dazu verwendet, die Breite des MenuIcon-Containers zu kontrollieren.
  const [iconContainerWidth, setIconContainerWidth] = useState(0);

  // Verwenden des Navigation-Hooks, um auf Navigationsfunktionen zuzugreifen
  const navigation = useNavigation();

  // useEffect-Hook, um einen Event Listener hinzuzufügen und zu entfernen
  useEffect(() => {
    // Hinzufügen eines Event Listeners auf das "ActivityResult"-Event
    const resultListener = DeviceEventEmitter.addListener(
      "ActivityResult",
      (data) => {
        console.log("Activity zurückgegebene Daten: ", data.result); // Logging der empfangenen Daten
      }
    );

    // Rückgabefunktion, die beim Bereinigen der Komponente aufgerufen wird
    return () => {
      resultListener.remove(); // Entfernen des Event Listeners
    };
  }, []);

  // Zugriff auf die NativeModules, um eine native Funktion zu öffnen
  var openActivity = NativeModules.OpenActivity;

  // Funktion zum Aufrufen der nativen Funktion
  const openfunc = () => {
    openActivity.open("name");
  };

  // Rendering der Header-Komponente
  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: localDataStyle.top_toolbar_background_color},
      ]}
    >
      {/* Wir verwenden eine View-Komponente, um das MenuIcon zu umschließen. */}
      <View style={{ width: iconContainerWidth }}>
        {/* Das eigentliche Icon, welches beim Drücken das Drawer-Menü öffnet. */}
        <SimpleLineIcons
          name="menu"
          size={26}
          color={localDataStyle.top_toolbar_icon_color}
          onPress={() => navigation.openDrawer()} // Beim Drücken wird die Drawer-Navigation geöffnet.
        />
      </View>

      {/* Logo in der Mitte des Headers */}
      <Image
        source={{ uri: `${logoImage}?t=${lastUpdated}` }}
        style={styles.logo}
      />

      {/* Hier haben wir eine View-Komponente, die den Container für die Icons auf der rechten Seite darstellt. */}
      <View
        style={styles.iconsContainer}
        // Wir verwenden die onLayout-Prop, um die Breite des Containers zu messen, sobald er gelayoutet ist.
        onLayout={(event) => {
          // event.nativeEvent.layout enthält Informationen über die Position und Größe der View.
          // Wir extrahieren die width-Property daraus.
          const { width } = event.nativeEvent.layout;

          // Wir aktualisieren den Zustand iconContainerWidth mit der gemessenen Breite.
          setIconContainerWidth(width);
        }}
      >
        {/* Icon für Informationen */}
        <TouchableOpacity onPress={() => console.log("Info Icon pressed")}>
          <SimpleLineIcons
            color={localDataStyle.top_toolbar_icon_color}
            name="info"
            size={24}
          />
        </TouchableOpacity>

        {/* Icon für Telefon, führt openfunc aus beim Drücken */}
        <TouchableOpacity onPress={() => openfunc()}>
          <SimpleLineIcons
            color={localDataStyle.top_toolbar_icon_color}
            name="phone"
            size={24}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// Styling-Objekt für die Header-Komponente
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#121212",
    height: 50,
    paddingHorizontal: 20,
  },
  logo: {
    width: 100,
    height: 50, // Anpassung der Höhe und Breite des Logos
    resizeMode: "contain",
  },
  iconsContainer: {
    flexDirection: "row",
    gap: 20,
  },
});

// Exportieren der Header-Komponente als Standard-Export
export default Header;
