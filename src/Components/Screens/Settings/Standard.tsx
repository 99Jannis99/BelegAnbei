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
import {
  chooseIdentity,
  addIdentity,
  toggleActiveIndex,
  collapseAllIdentities,
} from "../../../Functions/StandardSettings/IdentityManagement";

import TextSnippet from "../../shared/TextSnippets";

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
  const dispatch = useDispatch();

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
  const { width, height } = Dimensions.get("window");
  const [isFocus, setIsFocus] = useState(false);
  const { form_settings, multiple_locations, multiple_persons } = settings;

  const {
    dataSettings,
    dataLocations,
    dataPersons,
    dataStyle,
    dataTextsnippets,
    dataIdentities,
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
            (loc) => loc.location_has_people || loc.location_has_only_people
          )
          .map((loc) => ({
            label: loc.location_display_name,
            value: loc.location_id,
          }))
      : [];
    setLocationData(newLocationData);

    const newPersonData = Array.isArray(newPersons)
      ? newPersons
          .filter(
            (person) =>
              person.location_id === selectedLocation &&
              (person.person_for_send === "both" ||
                person.person_for_send === "standard")
          )
          .map((per) => ({ label: per.person_name, value: per.person_id }))
      : [];
    setPersonData(newPersonData);
  }, [dataSettings, dataLocations, dataPersons, selectedLocation]);

  useEffect(() => {
    setLocalDataStyle(JSON.parse(dataStyle));
    setLocalTextsnippets(JSON.parse(dataTextsnippets));
  }, [dataStyle, dataTextsnippets]);

  useEffect(() => {}, []);

  useEffect(() => {
    setIdentities(dataIdentities);
    dataIdentities[0].formData.name
      ? collapseAllIdentities(identities, setActiveIndex, dispatch, false)
      : null;
  }, [dataIdentities]);

  useEffect(() => {
    if (!Array.isArray(locations) || locations.length === 0) {
      return;
    }
    const filteredLocations = locations.filter(
      (loc) => loc.location_has_persons === "1"
    );

    if (
      multiple_locations.enabled === false &&
      filteredLocations.length === 1
    ) {
      setSelectedLocation(filteredLocations[0].location_id);
    }
  }, [locations, multiple_locations]);

  const deleteActiveIdentity = () => {
    const identityToBeDeleted = identities[activeIndex];

    // Überprüfen, ob die zu löschende Identität ausgewählt (choosed) ist
    const wasChosen = identityToBeDeleted && identityToBeDeleted.choosed;

    // Entfernen der aktuellen Identität
    const updatedIdentities = identities.filter(
      (_, idx) => idx !== activeIndex
    );

    // Setze die letzte Identität als ausgewählt, wenn die zu löschende Identität ausgewählt war
    if (wasChosen && updatedIdentities.length > 0) {
      updatedIdentities[updatedIdentities.length - 1].choosed = true;
    }

    setIdentities(updatedIdentities);

    // Einklappen des Formulars
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

    const newIdentities = identities.map((identity, idx) => {
      if (idx === index) {
        // Aktualisieren der Daten für die aktuelle Identität
        const updatedIdentity = {
          ...identity,
          formData: {
            ...identity.formData,
            [name]: formattedValue,
          },
        };

        // Setze 'choosed' auf true, wenn es sich um die erste Identität handelt
        // und sie zum ersten Mal ausgefüllt wird
        if (index === 0 && !identity.choosed) {
          updatedIdentity.choosed = true;
        }

        return updatedIdentity;
      }
      return identity;
    });

    setIdentities(newIdentities);
  };

  const setSelectedLocationForIdentity = (index, location) => {
    setSelectedLocation(location); // Aktualisiert die selectedLocation State-Variable
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
          onPress={() => chooseIdentity(identities, dispatch, index)}
        >
          <View style={styles.collapsedTextView}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: width - 100,
              }}
            >
              <Text style={styles.collapsedText}>
                {identity.formData.name || "Neue Identität"}
              </Text>
              {identity.choosed && (
                <>
                  <Text style={styles.collapsedText}>
                    {"#" + identity.formData.manno || "Mandantennummer"}
                  </Text>
                </>
              )}
            </View>
            <Text style={styles.collapsedText}>
              {identity.formData.email || "Email"}
            </Text>
            {identity.choosed && (
              <>
                <Text style={styles.collapsedText}>
                  {identity.formData.phone || "Telefonnummer"}
                </Text>
                <Text style={styles.collapsedText}>
                  {persons.find((p) => p.person_id === identity.selectedPerson)
                    ?.person_name || "Sachbearbeiter"}
                </Text>
              </>
            )}
          </View>
          <SimpleLineIcons
            name="pencil"
            size={20}
            color="black"
            onPress={() =>
              toggleActiveIndex(activeIndex, index, setActiveIndex)
            }
          />
        </TouchableOpacity>
      );
    }

    if (!form_settings) {
      return null;
    }

    return Object.entries(form_settings).map(([key, value]) => {
      if (key === "location" || key === "person" || !value.available) {
        return null;
      }

      const handleChange = (text) => {
        handleInputChange(index, key, text);
      };

      let errorMessage = "";
      if (value.mandatory && !identity.formData[key]) {
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
    if (index !== activeIndex) {
      return null;
    }

    if (!form_settings || !locations) {
      return null;
    }

    if (!form_settings || !Array.isArray(data) || data.length === 0) {
      return null;
    }

    const setting = form_settings[key];
    if (
      key === "location" &&
      (multiple_locations.enabled !== true ||
        locations.filter(
          (loc) => loc.location_has_people || loc.location_has_only_people
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
    return identities.every((identity, index) => {
      // Prüfen, ob die allgemeinen Felder ausgefüllt sind
      const isCommonFieldsValid =
        identity.formData.name &&
        identity.formData.manno &&
        identity.formData.phone &&
        identity.formData.email &&
        identity.selectedPerson;

      // Zusätzliche Validierung für E-Mail und Mannnummer
      const isEmailValid = identity.formData.email
        ? isValidEmail(identity.formData.email)
        : true;
      const isMannnummerValid = identity.formData.manno
        ? isValidMannnummer(identity.formData.manno)
        : true;

      // Prüfen, ob das Location Dropdown gerendert werden sollte
      const filteredLocations = locations.filter(
        (loc) => loc.location_has_people || loc.location_has_only_people
      );

      const isLocationDropdownVisible =
        multiple_locations.enabled || filteredLocations.length > 1;
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

      // Gültigkeitsprüfung unter Berücksichtigung der Location-Auswahl
      return isLocationDropdownVisible
        ? isCommonFieldsValid &&
            isLocationSelected &&
            isEmailValid &&
            isMannnummerValid
        : isCommonFieldsValid && isEmailValid && isMannnummerValid;
    });
  };

  const handleStandardCameraSelect = () => {
    const newDataSettings = { ...settings, default_camera_mode: "standard" };
    dispatch({
      type: "SET_DATA_SETTINGS",
      payload: JSON.stringify(newDataSettings),
    });
  };

  const handleDocscanCameraSelect = () => {
    const newDataSettings = { ...settings, default_camera_mode: "docscan" };
    dispatch({
      type: "SET_DATA_SETTINGS",
      payload: JSON.stringify(newDataSettings),
    });
  };

  return (
    localDataStyle && (
      <ScrollView
        style={{ backgroundColor: localDataStyle.body_background_color }}
      >
        <TextSnippet call="app-settings-top" />

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

        {/* <View style={styles.gridContainer}>{createGrid(50, 20)}</View> */}
        {settings && locations && persons && (
          <>
            {identities.map((identity, index) => (
              <View key={index} style={styles.container}>
                {renderSettingsFields(identity, index)}
                {multiple_locations.enabled &&
                  renderDropdown(
                    "location",
                    locationData,
                    identity.selectedLocation,
                    (location) =>
                      setSelectedLocationForIdentity(index, location),
                    styles.dropdownFirst,
                    index
                  )}

                {(!multiple_locations.enabled || identity.selectedLocation) &&
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
            <>
              {activeIndex !== null && (
                <>
                  <Button
                    buttonStyle={{
                      backgroundColor:
                        localDataStyle.bottom_toolbar_background_color,
                      borderRadius: 10,
                    }}
                    containerStyle={{
                      margin: 10,
                    }}
                    titleStyle={{
                      color: localDataStyle.bottom_toolbar_icon_color,
                    }}
                    disabled={!areAllFieldsValid()}
                    title="Sichern (einklappen)"
                    onPress={() => {
                      collapseAllIdentities(
                        identities,
                        setActiveIndex,
                        dispatch,
                        true
                      );
                    }}
                  />
                  {identities.length > 1 && (
                    <Button
                      buttonStyle={{
                        backgroundColor: "red", // oder eine andere auffällige Farbe
                        borderRadius: 10,
                      }}
                      containerStyle={{
                        margin: 10,
                      }}
                      titleStyle={{
                        color: "white", // Farbe für den Text im Button
                      }}
                      title="Abbrechen (löschen)"
                      onPress={deleteActiveIdentity}
                    />
                  )}
                </>
              )}
              {multiple_persons.enabled ? (
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
                  onPress={() =>
                    addIdentity(identities, setActiveIndex, setIdentities)
                  }
                />
              ) : null}
              <View style={styles.cameraTypeContainer}>
                <SimpleLineIcons
                  style={[
                    styles.cameraTypeIcon,
                    { backgroundColor: localDataStyle.body_background_color },
                  ]}
                  name="camera"
                  size={20}
                  color="black"
                />
                <View
                  style={[
                    styles.cameraTypeContent,
                    { backgroundColor: localDataStyle.body_background_color },
                  ]}
                >
                  <Text
                    style={[
                      styles.cameraTypeHeader,
                      { color: localDataStyle.body_font_color },
                    ]}
                  >
                    Kamera Typ
                  </Text>
                  <View style={styles.cameraTypeButtonContainer}>
                    <TouchableOpacity
                      style={[
                        styles.cameraTypeButton,
                        {
                          backgroundColor:
                            settings.default_camera_mode == "standard"
                              ? localDataStyle.bottom_toolbar_background_active_color
                              : localDataStyle.bottom_toolbar_icon_color,
                        },
                      ]}
                      onPress={handleStandardCameraSelect}
                    >
                      <Text
                        style={[
                          styles.cameraTypeButtonText,
                          { color: localDataStyle.body_font_color },
                        ]}
                      >
                        Standard Kamera
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.cameraTypeButton,
                        {
                          backgroundColor:
                            settings.default_camera_mode == "docscan"
                              ? localDataStyle.bottom_toolbar_background_active_color
                              : localDataStyle.bottom_toolbar_icon_color,
                        },
                      ]}
                      onPress={handleDocscanCameraSelect}
                    >
                      <Text
                        style={[
                          styles.cameraTypeButtonText,
                          { color: localDataStyle.body_font_color },
                        ]}
                      >
                        Beleg Kamera
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <Text
                    style={[
                      styles.cameraTypeText,
                      { color: localDataStyle.body_font_color },
                    ]}
                  >
                    Die "Belege Kamera" unterstützt Sie beim Fotografieren Ihrer
                    Belege. Mehr Informationen erhalten Sie unter Hilfe
                  </Text>
                </View>
              </View>
            </>
          </>
        )}
      </ScrollView>
    )
  );
}

export default StandardSettings;

const styles = StyleSheet.create({
  container: {
    borderColor: "black",
    marginHorizontal: 10,
    marginBottom: 10,
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
    top: -11.5,
    left: 0,
    width: Dimensions.get("window").width,
    height: Dimensions.get("screen").height,
    zIndex: 1000,
  },
  collapsedContainer: {
    padding: 10,
    borderRadius: 15,
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
  cameraTypeContainer: {
    margin: 10,
  },
  cameraTypeIcon: {
    width: "auto",
    position: "absolute",
    padding: 10,
    borderColor: "#575757",
    borderWidth: 1,
    borderRadius: 15,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomColor: "white",
    backgroundColor: "white",
    borderBottomWidth: 0,
    zIndex: 5,
  },
  cameraTypeContent: {
    top: 40.5,
    marginBottom: 41,
    borderColor: "#575757",
    borderWidth: 1,
    borderRadius: 15,
    padding: 10,
    borderTopLeftRadius: 0,
    alignItems: "center",
  },
  cameraTypeHeader: { fontSize: 20, textAlign: "center" },
  cameraTypeButtonContainer: {
    marginVertical: 10,
    flexDirection: "row",
    borderColor: "#575757",
    borderWidth: 1,
    borderRadius: 15,
  },
  cameraTypeButton: { padding: 5, width: 120, borderRadius: 15 },
  cameraTypeButtonText: { textAlign: "center" },
  cameraTypeText: {},
});
