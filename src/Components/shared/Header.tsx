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
  Text
} from "react-native";
import { Feather, MaterialCommunityIcons, MaterialIcons } from "../../helpers/icons";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";

// Definition der Header-Komponente
const Header = () => {
  const [localDataSettings, setlocalDataSettings] = useState({});
  const [localDataStyle, setLocalDataStyle] = useState({});

  const { dataSettings, dataStyle } = useSelector((state) => state.dataReducer);
  const { logoImage, lastUpdated } = useSelector((state) => state.imageReducer);

  // useEffect(() => {
  //   setlocalDataSettings(JSON.parse(dataSettings));
  // }, [dataSettings]);

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

  {/* First Tour */}
  const [activeElementMeasure, setActiveElementMeasure] = useState({});
  const getElementPosition = (named, event) => {
    //console.log('Component named: ',  named)
    let useElement = null;

    if(named == 'MenuIcon') {
      useElement = MenuIcon;
    }

    if(useElement != null) {
      useElement.measure( (fx, fy, width, height, px, py) => {
        setActiveElementMeasure({
          width: width,
          height: height,
          x: px,
          y: py
        });

        //console.log('Component width is: ' + width)
        //console.log('Component height is: ' + height)
        //console.log('X offset to page: ' + px)
        //console.log('Y offset to page: ' + py)
      })
    }
  }
  {/* First Tour */}

  // Rendering der Header-Komponente
  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: localDataStyle.top_toolbar_background_color },
      ]}
    >
      {/* Wir verwenden eine View-Komponente, um das MenuIcon zu umschließen. */}
      {/* First Tour */}
      <View style={{ width: iconContainerWidth }}
        onLayout={(event) => { getElementPosition('MenuIcon', event) }}
        ref={view => { MenuIcon = view; }}
      >
        {/* Das eigentliche Icon, welches beim Drücken das Drawer-Menü öffnet. */}
        <MaterialIcons
          name={'menu-open'}
          size={34}
          color={localDataStyle.top_toolbar_icon_color}
          onPress={() => navigation.openDrawer()}
        />
      </View>

      {/* Logo in der Mitte des Headers */}
      <TouchableOpacity onPress={() => navigation.navigate("Home")}>
        <Image
          source={{ uri: `${logoImage}?t=${lastUpdated}` }}
          style={styles.logo}
        />
      </TouchableOpacity>

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
        {/*<TouchableOpacity onPress={() => console.log("Info Icon pressed")}>
          <FontAwesome5
            name={'info-circle'} light
            size={24}
            //style={{ aspectRatio: 1 }}
            //allowFontScaling
            color={localDataStyle.top_toolbar_icon_color}
          />
        </TouchableOpacity> */}

        {/* Icon für Telefon, führt openfunc aus beim Drücken */}
        <TouchableOpacity onPress={() => console.log("Info Icon pressed")}>
          <MaterialCommunityIcons
            name={'phone-in-talk'}
            size={30}
            color={localDataStyle.top_toolbar_icon_color}
          />
        </TouchableOpacity>
      </View>

      {/* First Tour
      <View style={{position: "absolute", flex:1, alignItems: "center", justifyContent: "center", height:activeElementMeasure.height, left: activeElementMeasure.x, top: activeElementMeasure.y, backgroundColor: "#fa2000", padding: 6}}><Text>HALLOOOOOO</Text></View>
       First Tour */}
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
    height: 60,
    paddingHorizontal: 20,
  },
  logo: {
    width: 140,
    height: 60, // Anpassung der Höhe und Breite des Logos
    resizeMode: "contain",
  },
  iconsContainer: {
    flexDirection: "row",
    gap: 20,
  },
});

// Exportieren der Header-Komponente als Standard-Export
export default Header;
