import React, { useState, useEffect } from "react";
import { View, ScrollView, Text, StyleSheet, Dimensions } from "react-native";
import { Input, ButtonGroup } from "@rneui/themed";
import { Dropdown } from "react-native-element-dropdown";
import { AntDesign, SimpleLineIcons } from "../../../helpers/icons";
import { useSelector, useDispatch } from "react-redux";

function StandardSettings() {
  // Zustandsvariablen für ausgewählte Werte
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [settings, setSettings] = useState([]);
  const [locations, setLocations] = useState([]);
  const [persons, setPersons] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    manno: "",
    phone: "",
    email: "",
    location: "",
    person: "",
  });

  const { dataSettings, dataLocations, dataPersons, dataStyle } = useSelector(
    (state) => state.dataReducer
  );

  useEffect(() => {
    setSettings(JSON.parse(dataSettings));
    setLocations(JSON.parse(dataLocations));
    setPersons(JSON.parse(dataPersons));
  }, [dataSettings, dataLocations, dataPersons]);

  const { width, height } = Dimensions.get("window");

  const [isFocus, setIsFocus] = useState(false);

  const { app_settings, multiple_locations } = settings;

  useEffect(() => {
    if (!Array.isArray(locations) || locations.length === 0) {
      // Array ist entweder nicht vorhanden oder leer
      return;
    }
    const filteredLocations = locations.filter(
      (loc) => loc.location_has_persons === "1"
    );

    // console.log("filteredLocations: ", filteredLocations); // Zum Überprüfen der gefilterten Standorte

    if (multiple_locations === "0" && filteredLocations.length === 1) {
      setSelectedLocation(filteredLocations[0].location_id);
    }
  }, [locations, multiple_locations]);

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const renderSettingsFields = () => {
    if (!app_settings) {
      return null; // Render nichts, wenn app_settings noch nicht geladen ist
    }

    return Object.entries(app_settings).map(([key, value]) => {
      if (key === "location" || key === "person" || value.available !== "1") {
        return null;
      }

      const handleChange = (text) => {
        if (key === "phone") {
          text = formatPhoneNumber(text);
        }
        handleInputChange(key, text);
      };

      let errorMessage = "";
      if (value.mandatory === "1" && !formData[key]) {
        errorMessage = value.validation_info;
      } else if (
        key === "email" &&
        formData[key] &&
        !isValidEmail(formData[key])
      ) {
        errorMessage = "Ungültige E-Mail-Adresse";
      } else if (
        key === "manno" &&
        formData[key] &&
        !isValidMannnummer(formData[key])
      ) {
        errorMessage = "Mannnummer muss mindestens 4 Zahlen enthalten";
      }

      return (
        <Input
          key={key}
          placeholder={value.placeholder_text}
          onChangeText={handleChange}
          value={formData[key]}
          errorMessage={errorMessage}
          placeholderTextColor="grey"
          leftIcon={<SimpleLineIcons name="user" size={20} color="black" />}
          inputStyle={{ color: "black", fontSize: 15 }}
          keyboardType={
            key === "phone" || key === "manno" ? "numeric" : "default"
          }
        />
      );
    });
  };

  // Hilfsfunktionen
  const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const isValidMannnummer = (manno) => {
    return /^\d{4,}$/.test(manno); // Überprüft, ob mindestens 4 Zahlen vorhanden sind
  };

  const formatPhoneNumber = (phone) => {
    // Fügen Sie hier Ihre Logik zur Formatierung der Telefonnummer hinzu
    // Beispiel: formatiert eine Nummer zu einer Struktur wie 123-456-7890
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
  };

  // Standorte und Personen für Dropdowns vorbereiten
  const locationData = Array.isArray(locations)
    ? locations
        .filter((loc) => {
          return (
            loc.location_has_persons === "1" ||
            loc.location_has_only_persons === "1"
          );
        })
        .map((loc) => ({
          label: loc.location_display_name,
          value: loc.location_id,
        }))
    : [];

  const personData = Array.isArray(persons)
    ? persons
        .filter((person) => person.location_id === selectedLocation)
        .map((per) => ({
          label: per.person_name,
          value: per.person_id,
        }))
    : [];

  // Funktionen, um den Fokus-Zustand zu verwalten
  const onFocus = () => setIsFocus(true);
  const onBlur = () => setIsFocus(false);

  // UI für jedes Dropdown
  const renderDropdown = (key, data, value, onChange, dropdown) => {
    if (!app_settings || !locations) {
      return null; // Render nichts, wenn app_settings oder locations noch nicht geladen sind
    }
    if (!app_settings || !Array.isArray(data) || data.length === 0) {
      return null; // Kein Dropdown rendern, wenn keine Daten vorhanden sind
    }
    const setting = app_settings[key];
    // console.log("key: ", key, "value ", value, "data: ", data);
    // Wenn key "location" ist, überprüfen ob das Dropdown angezeigt werden soll
    if (
      key === "location" &&
      (multiple_locations !== "1" ||
        locations.filter(
          (loc) =>
            loc.location_has_persons === "1" ||
            loc.location_has_only_persons === "0"
        ).length <= 1)
    ) {
      return null;
    }

    return (
      <View style={styles.DropdownContainer}>
        <Dropdown
          style={[styles.dropdownFirst, dropdown]}
          placeholderStyle={[
            styles.placeholderStyle,
            !value && { color: "grey", fontSize: 15 },
          ]}
          selectedTextStyle={[
            styles.selectedTextStyle,
            value && { color: "black", fontSize: 15 },
          ]}
          iconStyle={styles.iconStyle}
          data={data}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!value ? setting.placeholder_text : "..."}
          value={value}
          onFocus={onFocus}
          onBlur={onBlur}
          onChange={(item) => {
            onChange(item.value);
            setIsFocus(false);
          }}
          renderLeftIcon={() => (
            <SimpleLineIcons
              style={styles.icon}
              color="black"
              name="user"
              size={20}
            />
          )}
        />
      </View>
    );
  };

  const createGrid = (columnSpacing, rowSpacing) => {
    let gridElements = [];

    // Berechnen der Anzahl der Spalten und Zeilen basierend auf dem Abstand
    const numColumns = Math.floor(width / columnSpacing);
    const numRows = Math.floor(height / rowSpacing);

    // Erstellen der Spalten
    for (let i = 0; i < numColumns; i++) {
      gridElements.push(
        <View
          key={`column-${i}`}
          style={{
            borderColor: "rgba(0,0,0,0.2)",
            borderWidth: 1,
            height: height,
            width: 1,
            position: "absolute",
            left: columnSpacing * i,
          }}
        />
      );
    }

    // Erstellen der Zeilen
    for (let j = 0; j < numRows; j++) {
      gridElements.push(
        <View
          key={`row-${j}`}
          style={{
            borderColor: "rgba(0,0,0,0.2)",
            borderWidth: 1,
            width: width,
            height: 1,
            position: "absolute",
            top: rowSpacing * j,
          }}
        />
      );
    }

    return gridElements;
  };

  // Verwendung der Funktion mit benutzerdefinierten Abständen
  // Beispiel: createGrid(50, 50) für ein Raster mit 50px Abstand

  return (
    <ScrollView>
      {/* Überprüfen, ob die erforderlichen Daten geladen sind, bevor die Komponenten gerendert werden */}
      {settings && locations && persons && (
        <>
          <View style={styles.container}>{renderSettingsFields()}</View>
          <View style={styles.container}>
            {multiple_locations === "1" &&
              renderDropdown(
                "location",
                locationData,
                selectedLocation,
                setSelectedLocation
              )}
            {(multiple_locations === "0" || selectedLocation) &&
              renderDropdown(
                "person",
                personData,
                selectedPerson,
                setSelectedPerson,
                multiple_locations === "1" && styles.dropdown
              )}
          </View>
        </>
      )}
    </ScrollView>
  );
}

export default StandardSettings;

const styles = StyleSheet.create({
  // ... Ihre Stildefinitionen
  container: {
    borderColor: "black",
    // borderWidth: 1,
    marginHorizontal: 10,
    marginBottom: 5,
    borderRadius: 15,
  },
  dropdownFirst: {
    margin: 5,
    marginTop: 2,
    borderBottomWidth: 1,
    paddingBottom: 7,
    borderColor: "grey",
  },
  dropdown: {
    margin: 5,
    marginTop: 28,
    borderBottomWidth: 1,
    paddingBottom: 7,
    borderColor: "grey",
  },
  label: {
    margin: 5,
    marginBottom: 0,
  },
  icon: {
    marginRight: 8,
    marginLeft: 5,
  },
  gridContainer: {
    position: "absolute",
    pointerEvents: "none",
    top: -28,
    left: 0,
    width: Dimensions.get("window").width,
    height: Dimensions.get("screen").height,
    zIndex: 1000, // Stellen Sie sicher, dass das Gitter über allen anderen Elementen liegt
  },
});
