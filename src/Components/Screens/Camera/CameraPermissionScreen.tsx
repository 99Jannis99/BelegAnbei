import React from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { request, PERMISSIONS, RESULTS } from "react-native-permissions";

const CameraPermissionScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const data = {
    sections: [
      {
        header: "Willkommen bei der App für den digitalen Belegtransfer",
        content:
          "Die App ermöglicht es Mandanten, fehlende Belege bequem zu übermitteln, die direkt von unserem Onlinebuchungssystem digital weiterverarbeitet werden. Dies gilt für Dokumente, vorhandene Fotos und PDFs. Beachten Sie bitte, dass die über diese App eingesendeten Belege/Fotos zu dimento.com gesendet werden.",
      },
      {
        header: "Impressum",
        content:
          "dimento.com GmbH\nHammer Straße 89, 48153 Münster\nTel.: +49 251 / 3 22 65 44 - 0\nFax: +49 251 / 3 22 65 44 - 99\nInternet: dimento.com\nE-Mail: info@dimento.com\nGeschäftsführer: Dieter Stratmann\nKontakt: d.stratmann@dimento.com\nUmsatzsteuer-ID-Nr. DE275065739\nHRB 13011",
      },
      {
        header: "Nutzungsbedingungen",
        content:
          "Bitte beachten Sie, dass dimento.com und Kanzlei Mustermann (fiktiv) keine Steuerberatungskanzleien sind. Die Nutzung der App erfolgt unter Ausschluss jeglicher Haftung. Die übermittelten Daten sind sicher, jedoch wird keine Haftung für Ausspionieren, Sabotage, Veränderung und Vernichtung übernommen. Die Inhalte der App unterliegen dem Urheberrecht und anderen Schutzgesetzen. Die App speichert Daten, die nicht in unserem Verantwortungsbereich fallen. Erst mit Eingang der übermittelten Daten in unserer Kanzlei übernehmen wir die Verantwortung.",
      },
      {
        header: "Datenschutzerklärung",
        content:
          "Unsere App erfordert Zugriff auf bestimmte Schnittstellen Ihres Geräts wie Kamera, Speicher, Internet und Konten. Die Datenübertragung erfolgt verschlüsselt zum Schutz vor unbefugtem Zugriff. Wir sammeln personenbezogene Daten wie Name, Mandantennummer, E-Mail-Adresse und Telefonnummer nur zu dem Zweck, Ihre eingesendeten Belege zuzuordnen und Push-Nachrichten zu adressieren. Die Datenerhebung erfolgt nur mit Ihrer ausdrücklichen Zustimmung. Sie haben jederzeit das Recht auf Auskunft, Berichtigung, Sperrung oder Löschung Ihrer Daten.",
      },
      {
        header: "Leistung + Nutzen",
      },
      {
        header: "Zusatzmodule",
      },
    ],
  };

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
    return data.sections.map((section, index) => (
      <View key={index}>
        {section.header && <Text style={styles.header}>{section.header}</Text>}
        <Text style={styles.paragraph}>{section.content}</Text>
      </View>
    ));
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
