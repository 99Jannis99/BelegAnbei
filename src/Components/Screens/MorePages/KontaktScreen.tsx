import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView, StyleSheet, View, ScrollView, Text, Alert } from "react-native";
import { useSelector } from "react-redux";
import { Input, Button } from "@rneui/themed";
import { Dropdown  } from 'react-native-element-dropdown';
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";

import Header from "../../shared/Header";
import TextSnippet from "../../shared/TextSnippets";
import { textFontFamily, textFontSize } from "../../../../data/CustomerConstants";

function KontaktScreen({ route }) {
    const ref = useRef(null);

    const { background, primary } = useSelector((state) => state.colorReducer);

    const { dataPersons, dataIdentities } = useSelector((state) => state.dataReducer);

    const [personsData, setPersonsData] = useState([]);
    const [formValues, setFormValues] = useState({
      "senderName": "",
      "senderEmail": "",
      "senderPhone": "",
      "recipient": 0,
      "message": ""
    });

    useEffect(() => {
        const usePersons = JSON.parse(dataPersons)
        const newPersonData = Array.isArray(usePersons) ? usePersons.filter((person) => {
            if(!person.person_is_person || !person.person_active || !person.person_show.atall) {
                return false;
            }
            return true;
        }).map((person) => {
            return { label: `Nachricht an: ${person.person_name}`, value: parseInt(person.person_id) }
        }) : [];
        setPersonsData(newPersonData);

        const senderData = Array.isArray(dataIdentities) ? dataIdentities.filter((per) => { return per.choosed; }) : {};

        if(senderData[0]) {
            setFormValues({
            "senderName": senderData[0].formData.name ? senderData[0].formData.name : "",
            "senderEmail": senderData[0].formData.email ? senderData[0].formData.email : "",
            "senderPhone": senderData[0].formData.phone ? senderData[0].formData.phone : "",
            "recipient": senderData[0].selectedPerson ? parseInt(senderData[0].selectedPerson) : 0,
            "message": ""
            })
        }
    }, [dataPersons]);

    const [isFocus, setIsFocus] = useState(false);
    const onFocus = () => setIsFocus(true);
    const onBlur = () => setIsFocus(false);

    const handleChange = (text, key) => {
        const newVals = {
            ...formValues,
            [key]: text
        };

        setFormValues(newVals)
    };



    const sendMail = () => {
        console.log('sendMail', formValues)
        let sendMailOK = true;

        let errorMessages = [];
    
        if (formValues.senderName.trim() === "") {
          console.log('ERR', "Name fehlt")
          sendMailOK = false;
          errorMessages.push('Bitte geben Sie Ihren Namen ein')
        }
    
        if (formValues.senderEmail.trim() === "") {
          console.log('ERR', "E-Mail fehlt.")
          sendMailOK = false;
          errorMessages.push('Bitte geben Sie Ihre E-Mail Adresse ein')
        }
    
        if (formValues.senderPhone.trim() === "") {
          console.log('ERR', "Telefon fehlt.")
          sendMailOK = false;
          errorMessages.push('Bitte geben Sie Ihre Telefonnummer ein')
        }
    
        if (formValues.message.trim() === "") {
          console.log('ERR', "Nachricht fehlt.")
          sendMailOK = false;
          errorMessages.push('Bitte geben Sie eine Nachricht ein')
        }
    
        if (formValues.recipient <= 0 || formValues.recipient == null) {
          console.log('ERR', "Empfänger fehlt.")
          sendMailOK = false;
          errorMessages.push('Bitte wählen Sie einen Empfänger')
        }
    
        if(sendMailOK) {
          Alert.alert('Send Mail', JSON.stringify(formValues), [{
            text: 'OK',
            onPress: () => console.log('OK clicked')
          }]);
        } else {
          Alert.alert('Bitte korrigieren', errorMessages.join("\n"), [{
            text: 'OK',
            onPress: () => console.log('OK clicked')
          }]);
        }
      };

    return (
        <SafeAreaView style={[styles.safeView, { backgroundColor: background }]}>
            <Header></Header>
            <ScrollView style={styles.content}>
                <View style={styles.contentView}>
                    <TextSnippet call="more-contact-top" />
                </View>
  
                <Text style={{paddingLeft: 12, fontSize: textFontSize, fontWeight: 'bold', color: primary}}>Ihr Name</Text>
                <Input 
                    key="senderName" 
                    value={formValues.senderName} 
                    onChangeText={ (text) => { handleChange(text, "senderName") }} 
                />

                <Text style={{paddingLeft: 12, fontSize: textFontSize, fontWeight: 'bold', color: primary}}>Ihre E-Mail Adresse</Text>
                <Input
                    key="senderEmail"
                    value={formValues.senderEmail}
                    onChangeText={ (text) => { handleChange(text, "senderEmail") }}
                    placeholder=""
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoCompleteType="email"
                />
                
                <Text style={{paddingLeft: 12, fontSize: textFontSize, fontWeight: 'bold', color: primary}}>Ihre Telefonnummer</Text>
                <Input 
                    key="senderPhone" 
                    keyboardType="numeric" 
                    value={formValues.senderPhone} 
                    onChangeText={ (text) => { handleChange(text, "senderPhone") }} 
                    placeholder="" 
                />

                <Text style={{paddingLeft: 12, fontSize: textFontSize, fontWeight: 'bold', color: primary}}>Wem möchten Sie die Nachricht schicken?</Text>
                <Dropdown 
                    inside
                    ref={ref}
                    style={styles.dropdown}
                    placeholderStyle={{fontSize: textFontSize, color: "#c1c1c1"}}
                    selectedTextStyle={{fontSize: textFontSize, color: primary}}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    backgroundColor={'rgba(0,0,0,0.2)'}
                    search
                    maxHeight={300}
                    minHeight={100}
                    data={personsData}
                    labelField="label"
                    valueField="value"
                    placeholder="Bitte Empfänger auswählen"
                    searchPlaceholder="Suchen / Filtern..."
                    value={formValues.recipient}
                    onChange={(item) => {
                        handleChange(item.value, "recipient")
                        setIsFocus(false);
                    }}
                    selectedStyle={styles.selectedStyle}
                />

                <Text style={{paddingLeft: 12, marginTop: 12, fontSize: textFontSize, fontWeight: 'bold', color: primary}}>Ihre Nachricht an uns</Text>
                <Input
                    key="message"
                    value={formValues.message}
                    onChangeText={ (text) => { handleChange(text, "message") }}
                    placeholderTextColor="#c1c1c1" 
                    multiline={true}
                    numberOfLines={6}
                />
                 
                {/* <Text>{JSON.stringify(formValues, null, 2)}</Text> */}
        
                <View style={styles.contentView}>
                    <Button
                    title="Absenden"
                    onPress={() => sendMail(true)}
                    />
                </View>

                <Text> </Text>
                <Text> </Text>
            </ScrollView>
        </SafeAreaView>
    );
}



const styles = StyleSheet.create({
    safeView: {
        flex: 1
    },
    content: {

    },
    contentView: {
        padding: 12
    },
    dropdown: {
        marginLeft: 12,
        marginRight: 12,
        fontSize: 20
    },
    placeholderStyle: {
        fontSize: 20,
        color: "#c1c1c1"
    
    },
    selectedTextStyle: {
        fontSize: 20
    
    },
    iconStyle: {
    
    },
    inputSearchStyle: {
    height: 40,
    },
    selectedStyle: {
    borderRadius: 12,
    }
});


export default KontaktScreen;
