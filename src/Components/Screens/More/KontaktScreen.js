import React, { Component, useState, useEffect } from "react";
import { Text, View, SafeAreaView, StyleSheet, Alert } from "react-native";
import { useSelector } from "react-redux";
import Header from "../../shared/Header";
import TextSnippet from "../../shared/TextSnippets";
import { Input, Button } from "@rneui/themed";
import { Dropdown } from "react-native-element-dropdown";
import { AntDesign, SimpleLineIcons } from "../../../helpers/icons";
import { DrawerContentScrollView } from "@react-navigation/drawer";

function KontaktScreen() {
  const { background, primary } = useSelector((state) => state.colorReducer);

  const [personData, setPersonData] = useState([]);
  const { dataPersons, dataIdentities } = useSelector((state) => state.dataReducer);
  const [isFocus, setIsFocus] = useState(false);

  useEffect(() => {
    const usePersons = JSON.parse(dataPersons)
    const newPersonData = Array.isArray(usePersons) ? usePersons.filter((person) => {
      if(!person.person_is_person || !person.person_active || !person.person_show.atall) {
        return false;
      }
      return true;
    }).map((person) => {
      return { label: person.person_name + ' -> ' + person.person_id, value: parseInt(person.person_id) }
    }) : [];
    setPersonData(newPersonData);

    const senderData = Array.isArray(dataIdentities) ? dataIdentities.filter((per) => { return per.choosed; }) : {};

    if(senderData[0]) {
      setFormValues({
        "senderName": senderData[0].formData.name ? senderData[0].formData.name : "",
        "senderEmail": senderData[0].formData.email ? senderData[0].formData.email : "",
        "senderPhone": senderData[0].formData.phone ? senderData[0].formData.phone : "",
        "recipient": senderData[0].selectedPerson ? parseInt(senderData[0].selectedPerson) : "",
        "message": ""
      })
    }
  }, [dataPersons]);

  const [formValues, setFormValues] = useState({
    "senderName": "",
    "senderEmail": "",
    "senderPhone": "",
    "recipient": null,
    "message": ""
  });

  const handleChange = (text, key) => {
    const newVals = {
      ...formValues,
      [key]: text
    };
    console.log('formValues', newVals)

    setFormValues(newVals)
  };

  const sendMail = () => {
    console.log('sendMail', formValues)
    let sendMailOK = true;

    if (formValues.senderName.trim() === "") {
      console.log('ERR', "Name fehlt")
      sendMailOK = false;
    }

    if (formValues.senderEmail.trim() === "") {
      console.log('ERR', "E-Mail fehlt.")
      sendMailOK = false;
    }

    if (formValues.senderPhone.trim() === "") {
      console.log('ERR', "Telefon fehlt.")
      sendMailOK = false;
    }

    if (formValues.message.trim() === "") {
      console.log('ERR', "Nachricht fehlt.")
      sendMailOK = false;
    }

    if (formValues.recipient <= 0 || formValues.recipient == null) {
      console.log('ERR', "Empfänger fehlt.")
      sendMailOK = false;
    }

    if(sendMailOK) {
      Alert.alert('Send Mail', JSON.stringify(formValues), [{
        text: 'OK',
        onPress: () => console.log('OK clicked')
      }]);
    } else {
      Alert.alert('ERRORs Plz check', JSON.stringify(formValues), [{
        text: 'OK',
        onPress: () => console.log('OK clicked')
      }]);
    }
  };

  const onFocus = () => setIsFocus(true);
  const onBlur = () => setIsFocus(false);


  return (
    <SafeAreaView style={[styles.moreSafeView, { backgroundColor: background }]}>
      <Header></Header>
      <DrawerContentScrollView>

        <TextSnippet call="more-contact-top" />

        <Input key="senderName" label="Ihr Name" value={formValues.senderName} onChangeText={ (text) => { handleChange(text, "senderName") }} placeholderTextColor="grey" placeholder="Bitte geben Sie Ihren Vor- und Nachnamen ein" leftIcon={<SimpleLineIcons name="home" size={20} color="black" />} />

        <Input
          key="senderEmail"
          label="Ihre E-Mail Adresse"
          value={formValues.senderEmail}
          onChangeText={ (text) => { handleChange(text, "senderEmail") }}
          placeholderTextColor="grey"
          placeholder="Bitte geben Sie Ihre E-Mail Adresse ein"
          leftIcon={<SimpleLineIcons name="home" size={20} color="black" />}
          autoCapitalize="none"
          autoCorrect={false}
          autoCompleteType="email"
        />

        <Input key="senderPhone" label="Ihre Telefonnummer" keyboardType="numeric" value={formValues.senderPhone} onChangeText={ (text) => { handleChange(text, "senderPhone") }} placeholderTextColor="grey" placeholder="Bitte geben Sie Ihre Telefonnummer ein" leftIcon={<SimpleLineIcons name="home" size={20} color="black" />} />

          <Dropdown
            placeholderStyle={{color: "black", fontSize: 15}}
            selectedTextStyle={{color: "black", fontSize: 25}}
            iconStyle={styles.iconStyle}
            data={personData}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Empfänger"
            value={formValues.recipient}
            onFocus={onFocus}
            onBlur={onBlur}
            onChange={(item) => {
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

        <Input
          key="message"
          label="Ihre Nachricht"
          value={formValues.message}
          onChangeText={ (text) => { handleChange(text, "message") }}
          placeholderTextColor="grey"
          placeholder=""
          leftIcon={<SimpleLineIcons name="home" size={20} color="black" />}
          multiline={true}
          numberOfLines={4}
        />

        <Button
          title="Absenden"
          onPress={() => sendMail(true)}
        />
      </DrawerContentScrollView>
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
  }
});

export default KontaktScreen;
