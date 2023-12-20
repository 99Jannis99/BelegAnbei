import React, { Component, useState } from "react";
import { Text, View, SafeAreaView, StyleSheet, ScrollView, Image, TouchableOpacity, useWindowDimensions } from "react-native";
import { useSelector } from "react-redux";
import Header from "../../shared/Header";
import TextSnippet from "../../shared/TextSnippets";
// import { DrawerContentScrollView } from "@react-navigation/drawer";

function AnsprechpartnerScreen() {
  const { background, primary } = useSelector((state) => state.colorReducer);
  const { width } = useWindowDimensions();

  const [overlayOpen, setOverlayOpen] = useState(false);
  const [overlayPerson, setOverlayPerson] = useState({});

  const { dataPersons } = useSelector(
    (state) => state.dataReducer
  );

  const openOverlay = function(person) {
    console.log('openOverlay', person)

    setOverlayOpen(true);
    setOverlayPerson(person);
  }

  const closeOverlay = function() {
    console.log('closeOverlay')

    setOverlayOpen(false);
    setOverlayPerson({});
  }

  let usePersons = JSON.parse(dataPersons)
  usePersons = usePersons.filter((person) => {
    if(person.person_is_person != "1") {
      return false;
    }

    if(person.person_active != "1") {
      return false;
    }

    if(person.person_show.atall != "1") {
      return false;
    }

    return true;
  });
  // console.log('usePersons', usePersons)

  return (
    <SafeAreaView style={[styles.moreSafeView, { backgroundColor: background }]}>
      <Header></Header>
      <ScrollView>
        <TextSnippet call="more-persons-top" />

        {usePersons.map((person, index) => (
          <TouchableOpacity key={ person.person_id } onPress={() => { openOverlay(person) }}>
            {person.person_photo &&
              <Image source={{ uri: person.person_photo }} style={styles.image} />
            }
            <Text>{person.person_name}</Text>
            {person.person_show.email &&
              <Text>{person.person_email}</Text>
            }
            {person.person_show.phone &&
              <Text>{person.person_phone.display}</Text>
            }
          </TouchableOpacity>
        ))}
      </ScrollView>

      {overlayOpen &&
        <TouchableOpacity style={ styles.overlay } onPress={() => { closeOverlay() }}>
          {overlayPerson.person_photo &&
            <Image source={{ uri: overlayPerson.person_photo }} style={styles.image} />
          }
          <Text>{overlayPerson.person_name}</Text>
          {overlayPerson.person_show.email &&
            <Text>{overlayPerson.person_email}</Text>
          }
          {overlayPerson.person_show.fax &&
            <Text>{overlayPerson.person_fax.display}</Text>
          }
          {overlayPerson.person_show.phone &&
            <Text>{overlayPerson.person_phone.display}</Text>
          }
          {overlayPerson.person_show.cell &&
            <Text>{overlayPerson.person_cell.display}</Text>
          }
        </TouchableOpacity>
      }
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  moreSafeView: {
    flex: 1
  },
  moreHeadline: {
    fontSize: 32,
    color: "#fa2000",
    marginTop: 12,
    marginBottom: 12,
    textAlign: "center"
  },
  moreContent: {
    marginTop: 12,
    marginBottom: 12,
    marginLeft: 12,
    marginRight: 12,
    textAlign: "center"
  },
  image: {
    width: 50,
    height: 90, // Höhe anpassen, um Platz für die Buttons zu schaffen
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: "2%",
    width: "96%",
    height: "100%",
    backgroundColor: "#fa2000"
  }
});

export default AnsprechpartnerScreen;
