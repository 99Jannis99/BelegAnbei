import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Input, ButtonGroup, Button } from "@rneui/themed";
import { Dropdown } from "react-native-element-dropdown";
import RenderHtml from "react-native-render-html";
import { AntDesign, SimpleLineIcons } from "../../../helpers/icons";
import { useSelector, useDispatch } from "react-redux";

function StandardSettings() {
  // Zustandsvariablen für ausgewählte Werte
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [localDataStyle, setLocalDataStyle] = useState(null);
  const [localTextsnippets, setLocalTextsnippets] = useState(null);
  const [settings, setSettings] = useState([]);
  const [locations, setLocations] = useState([]);
  const [persons, setPersons] = useState([]);
  const [locationData, setLocationData] = useState([1, 2, 3]);
  const [personData, setPersonData] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [identities, setIdentities] = useState([
    {
      selectedLocation: null,
      selectedPerson: null,
      formData: {
        name: "",
        manno: "",
        phone: "",
        email: "",
      },
    },
  ]);
  const [formData, setFormData] = useState({
    name: "",
    manno: "",
    phone: "",
    email: "",
    selectedLocation: "",
    selectedPerson: "",
  });

  const {
    dataSettings,
    dataLocations,
    dataPersons,
    dataStyle,
    dataTextsnippets,
  } = useSelector((state) => state.dataReducer);

  useEffect(() => {
    const newSettings = JSON.parse(dataSettings);
    const newLocations = JSON.parse(dataLocations);
    const newPersons = JSON.parse(dataPersons);

    setSettings(newSettings);
    setLocations(newLocations);
    setPersons(newPersons);

    const newLocationData = Array.isArray(newLocations)
      ? newLocations
          .filter(
            (loc) =>
              loc.location_has_persons === "1" ||
              loc.location_has_only_persons === "1"
          )
          .map((loc) => ({
            label: loc.location_display_name,
            value: loc.location_id,
          }))
      : [];

    // console.log("Filtered Locations for Dropdown: ", newLocationData);

    setLocationData(newLocationData);

    const newPersonData = Array.isArray(newPersons)
      ? newPersons
          .filter((person) => person.location_id === selectedLocation)
          .map((per) => ({ label: per.person_name, value: per.person_id }))
      : [];

    setPersonData(newPersonData);
    // console.log(
    //   "\n\nnewPersons: ",
    //   newPersons,
    //   "\nnewLocations: ",
    //   dataLocations
    // );
    // console.log(
    //   "\n\nnewLocationData: ",
    //   newLocationData,
    //   "\nnewPersonData: ",
    //   newPersonData
    // );
  }, [dataSettings, dataLocations, dataPersons, selectedLocation]);

  useEffect(() => {
    setLocalDataStyle(JSON.parse(dataStyle));
    // console.log("dataStyle: ", dataStyle);
    setLocalTextsnippets(JSON.parse(dataTextsnippets));
    // console.log("dataTextsnippets: ", dataTextsnippets);
  }, [dataStyle, dataTextsnippets]);

  useEffect(() => {
    // console.log("newIdentities: ", identities, "\n\n");
  }, [identities]);

  const { width, height } = Dimensions.get("window");

  const [isFocus, setIsFocus] = useState(false);

  const { app_settings, multiple_locations } = settings;

  // Funktion zum Auswählen einer Identität
  const chooseIdentity = (index) => {
    console.log("chooseIdentity")
    const updatedIdentities = identities.map((identity, idx) => ({
      ...identity,
      choosed: idx === index,
    }));
    setIdentities(updatedIdentities);
    console.log("updatedIdentities: ", updatedIdentities);
  };

  const addIdentity = () => {
    const newIndex = identities.length;
    const updatedIdentities = [
      ...identities.map((identity) => ({ ...identity, choosed: false })),
      {
        selectedLocation: null,
        selectedPerson: null,
        choosed: true, // Neu hinzugefügte Identität ist automatisch ausgewählt
        formData: {
          name: "",
          manno: "",
          phone: "",
          email: "",
        },
      },
    ];

    setActiveIndex(newIndex);
    setIdentities(updatedIdentities);
  };

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

  const toggleActiveIndex = (index) => {
    if (activeIndex === index) {
      setActiveIndex(null); // Einklappen, wenn es bereits aktiv ist
    } else {
      setActiveIndex(index); // Andernfalls aktivieren
    }
  };

  const collapseAllIdentities = () => {
    setActiveIndex(null);
  };

  const handleInputChange = (index, name, value) => {
    let formattedValue = value;

    // Formatierung für Telefonnummer
    if (name === "phone") {
      formattedValue = formatPhoneNumber(
        value,
        identities[index].formData.phone
      );
    }

    const newIdentities = [...identities];
    newIdentities[index].formData[name] = formattedValue;
    setIdentities(newIdentities);
  };

  const setSelectedLocationForIdentity = (index, location) => {
    setIdentities(
      identities.map((identity, idx) => {
        if (idx === index) {
          return { ...identity, selectedLocation: location };
        }
        return identity;
      })
    );
  };

  const setSelectedPersonForIdentity = (index, person) => {
    setIdentities(
      identities.map((identity, idx) => {
        if (idx === index) {
          return { ...identity, selectedPerson: person };
        }
        return identity;
      })
    );
  };

  const renderSettingsFields = (identity, index) => {
    const backgroundColor = identity.choosed
      ? localDataStyle.bottom_toolbar_background_active_color
      : "transparent"; // oder eine andere Standardfarbe

    if (index !== activeIndex) {
      return (
        <TouchableOpacity
          key={index}
          style={[styles.collapsedContainer, { backgroundColor }]}
          onPress={() => chooseIdentity(index)}
        >
          <View style={styles.collapsedTextView}>
            <Text style={styles.collapsedText}>
              {identity.formData.name || "Neue Identität"}
            </Text>
            <Text style={styles.collapsedText}>
              {identity.formData.email || "Email"}
            </Text>
          </View>
          <SimpleLineIcons
            name="pencil"
            size={20}
            color="black"
            onPress={() => toggleActiveIndex(index)}
          />
        </TouchableOpacity>
      );
    }

    if (!app_settings) {
      return null;
    }

    return Object.entries(app_settings).map(([key, value]) => {
      if (key === "location" || key === "person" || value.available !== "1") {
        return null;
      }

      const handleChange = (text) => {
        handleInputChange(index, key, text);
      };

      let errorMessage = "";
      if (value.mandatory === "1" && !identity.formData[key]) {
        errorMessage = value.validation_info;
      } else if (
        key === "email" &&
        identity.formData[key] &&
        !isValidEmail(identity.formData[key])
      ) {
        errorMessage = "Ungültige E-Mail-Adresse";
      } else if (
        key === "manno" &&
        identity.formData[key] &&
        !isValidMannnummer(identity.formData[key])
      ) {
        errorMessage = "Mannnummer muss mindestens 4 Zahlen enthalten";
      }

      return (
        <Input
          key={key}
          placeholder={value.placeholder_text}
          onChangeText={handleChange}
          value={identity.formData[key]}
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

  const formatPhoneNumber = (phone, previousPhone) => {
    // Entfernt alles außer Zahlen
    const cleaned = phone.replace(/\D/g, "");

    // Überprüfen, ob der Benutzer löscht
    if (previousPhone && phone.length < previousPhone.length) {
      // Rückgabe ohne erneutes Einfügen von Klammern oder Bindestrichen
      return cleaned;
    }

    // Prüft die Länge und formatiert entsprechend
    const match = cleaned.match(/^(\d{1,3})(\d{1,3})?(\d{1,4})?$/);
    if (match) {
      const intlCode = match[1] ? `(${match[1]}) ` : "";
      const num1 = match[2] ? `${match[2]}` : "";
      const num2 = match[3] ? `-${match[3]}` : "";
      return `${intlCode}${num1}${num2}`;
    }
    return phone;
  };

  // Funktionen, um den Fokus-Zustand zu verwalten
  const onFocus = () => setIsFocus(true);
  const onBlur = () => setIsFocus(false);

  // UI für jedes Dropdown
  const renderDropdown = (key, data, value, onChange, dropdown, index) => {
    // console.log("keyTOp: ", key);
    if (index !== activeIndex) {
      // console.log(
      //   `Dropdown nicht gerendert: Nicht aktives Formular (Index: ${index})`
      // );
      return null;
    }

    if (!app_settings || !locations) {
      // console.log(
      //   `Dropdown nicht gerendert: app_settings oder locations nicht geladen`
      // );
      return null;
    }

    if (!app_settings || !Array.isArray(data) || data.length === 0) {
      // console.log(
      //   `Dropdown nicht gerendert: Keine Daten vorhanden: `,
      //   app_settings,
      //   "data: ",
      //   data,
      //   "locationdata: ",
      //   locationData,
      //   `key:  ${key}`
      // );
      return null;
    }

    const setting = app_settings[key];
    if (
      key === "location" &&
      (multiple_locations !== "1" ||
        locations.filter(
          (loc) =>
            loc.location_has_persons === "1" ||
            loc.location_has_only_persons === "0"
        ).length <= 1)
    ) {
      // console.log(
      //   `Dropdown nicht gerendert: Location Dropdown nicht benötigt (key: ${key})`
      // );
      return null;
    }

    // console.log(`Dropdown gerendert: ${key} Dropdown (Index: ${index})`);

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
  const htmlSource = useMemo(() => {
    // Stellen Sie sicher, dass localTextsnippets ein Array ist und durchsuchen Sie es
    if (Array.isArray(localTextsnippets)) {
      return {
        html:
          localTextsnippets.find(
            (snippet) => snippet.callname === "app-settings-top"
          )?.snippet || "<p>Snippet nicht gefunden.</p>",
      };
    }
    // Rückgabe eines Standardwertes, wenn localTextsnippets kein Array ist
    return { html: "<p>Snippet nicht gefunden.</p>" };
  }, [localTextsnippets]);

  const tagStyles = useMemo(
    () => ({
      p: {
        textAlign: "center",
        marginHorizontal: 50,
        // Weitere CSS-Styles hier hinzufügen
      },
    }),
    []
  );

  const areAllFieldsValid = () => {
    // console.log(
    //   "\n\nÜberprüfung beginnt - komplette Identitäten: ",
    //   identities
    // );

    return identities.every((identity, index) => {
      // Log-Ausgaben für einzelne Felder in formData
      // console.log(`Identität ${index} - Name: `, identity.formData.name);
      // console.log(`Identität ${index} - Mannnummer: `, identity.formData.manno);
      // console.log(`Identität ${index} - Telefon: `, identity.formData.phone);
      // console.log(`Identität ${index} - Email: `, identity.formData.email);
      // console.log(
      //   `Identität ${index} - Ausgewählte Person: `,
      //   identity.selectedPerson
      // );

      // Prüfen, ob die allgemeinen Felder ausgefüllt sind
      const isCommonFieldsValid =
        identity.formData.name &&
        identity.formData.manno &&
        identity.formData.phone &&
        identity.formData.email &&
        identity.selectedPerson;

      // console.log(
      //   `Überprüfung der allgemeinen Felder - Identität ${index}: `,
      //   isCommonFieldsValid
      // );

      // Prüfen, ob das Location Dropdown gerendert werden sollte
      const filteredLocations = locations.filter(
        (loc) =>
          loc.location_has_persons === "1" ||
          loc.location_has_only_persons === "1"
      );

      const isLocationDropdownVisible =
        multiple_locations === "1" || filteredLocations.length > 1;
      // console.log(
      //   `Location Dropdown sichtbar - Identität ${index}: `,
      //   isLocationDropdownVisible
      // );

      // Automatische Auswahl der Location, wenn nur eine verfügbar ist
      if (
        !isLocationDropdownVisible &&
        filteredLocations.length === 1 &&
        !identity.selectedLocation
      ) {
        setIdentities(
          identities.map((id, idx) => {
            if (idx === index) {
              return {
                ...id,
                selectedLocation: filteredLocations[0].location_id,
              };
            }
            return id;
          })
        );
      }

      const isLocationSelected = !!identity.selectedLocation;
      // console.log(
      //   `Location ausgewählt - Identität ${index}: `,
      //   isLocationSelected
      // );

      // Gültigkeitsprüfung unter Berücksichtigung der Location-Auswahl
      return isLocationDropdownVisible
        ? isCommonFieldsValid && isLocationSelected
        : isCommonFieldsValid;
    });
  };

  return (
    <ScrollView>
      {/* Überprüfen, ob die erforderlichen Daten geladen sind, bevor die Komponenten gerendert werden */}
      {Array.isArray(localTextsnippets) && (
        <View style={{ flex: 1, padding: 10 }}>
          <RenderHtml
            contentWidth={Dimensions.get("window").width}
            source={htmlSource}
            tagsStyles={tagStyles}
          />
        </View>
      )}

      {settings && locations && persons && (
        <>
          {identities.map((identity, index) => (
            <View key={index} style={styles.container}>
              {renderSettingsFields(identity, index)}

              {/* {console.log(
                `Index: ${index}, Multiple Locations: ${multiple_locations}`
              )} */}

              {multiple_locations === "1" &&
                renderDropdown(
                  "location",
                  locationData,
                  identity.selectedLocation,
                  (location) => setSelectedLocationForIdentity(index, location),
                  styles.dropdownFirst,
                  index
                )}

              {(multiple_locations === "0" || identity.selectedLocation) &&
                renderDropdown(
                  "person",
                  personData,
                  identity.selectedPerson,
                  (person) => setSelectedPersonForIdentity(index, person),
                  styles.dropdown,
                  index
                )}
            </View>
          ))}
          {localDataStyle && (
            <>
              {activeIndex !== null && (
                <Button
                  buttonStyle={{
                    backgroundColor:
                      localDataStyle.bottom_toolbar_background_color, // Hintergrundfarbe des Buttons
                    borderRadius: 10, // Eckenradius des Buttons
                  }}
                  containerStyle={{
                    margin: 10, // Abstand um den Button herum
                  }}
                  titleStyle={{
                    color: localDataStyle.bottom_toolbar_icon_color,
                  }}
                  disabled={!areAllFieldsValid()}
                  title="Sichern (einklappen)"
                  onPress={collapseAllIdentities}
                />
              )}
              <Button
                buttonStyle={{
                  backgroundColor:
                    localDataStyle.bottom_toolbar_background_color, // Hintergrundfarbe des Buttons
                  borderRadius: 10, // Eckenradius des Buttons
                }}
                containerStyle={{
                  margin: 10, // Abstand um den Button herum
                }}
                titleStyle={{
                  color: localDataStyle.bottom_toolbar_icon_color,
                }}
                title="Weitere Identität hinzufügen"
                onPress={addIdentity}
              />
            </>
          )}
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
    marginTop: 10,
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
  collapsedContainer: {
    height: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  collapsedTextView: {},
  collapsedText: {
    color: "black",
    fontSize: 15,
  },
  button: {
    margin: 5,
    backgroundColor: "red",
  },
});
