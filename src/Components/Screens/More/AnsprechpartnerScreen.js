import React, { Component, useState } from "react";
import { Text, View, SafeAreaView, StyleSheet, ScrollView, Image, TouchableOpacity, useWindowDimensions } from "react-native";
import { useSelector } from "react-redux";
import Header from "../../shared/Header";
import TextSnippet from "../../shared/TextSnippets";
import { ListItem, Avatar, Card, Button, Icon, Overlay } from "@rneui/themed";

function AnsprechpartnerScreen() {
  const { background, primary } = useSelector((state) => state.colorReducer);
  const { width } = useWindowDimensions();

  const [overlayOpen, setOverlayOpen] = useState(false);
  const [overlayPerson, setOverlayPerson] = useState({});

  const { dataPersons } = useSelector(
    (state) => state.dataReducer
  );

  const openOverlay = function(person) {
    console.log('openOverlay', person.person_name)

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
         <View>
          {
            usePersons.map((person, i) => (
              <ListItem key={i} bottomDivider onPress={() => { openOverlay(person) }}>
                {person.person_photo &&
                    <Avatar rounded source={{uri: person.person_photo }} />
                }
                <ListItem.Content>
                  <ListItem.Title>{person.person_name}</ListItem.Title>
                  {person.person_show.phone &&
                    <ListItem.Subtitle>{person.person_phone.display}</ListItem.Subtitle>
                  }
            </ListItem.Content>
              </ListItem>
            ))
          }
        </View>
      </ScrollView>

      <Overlay isVisible={overlayOpen} onBackdropPress={closeOverlay}>
        <Card>
          {overlayPerson.person_photo &&
            <Card.Image source={{ uri: overlayPerson.person_photo }} />
          }            
          <Card.Title>{overlayPerson.person_name}</Card.Title>
          {overlayPerson.person_position_title && 
            <Text>{overlayPerson.person_position_title}</Text>
          }
          <Card.Divider />
          <ScrollView>
            {overlayPerson.person_email && overlayPerson.person_show.email && 
              <Text>Email {overlayPerson.person_email}</Text>
            }
            <Card.Divider />
            {overlayPerson.person_text && 
              <Text>{overlayPerson.person_text}</Text>
            }
          </ScrollView>
        </Card>
      </Overlay>
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
