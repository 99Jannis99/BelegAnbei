import React, { useState, useEffect } from "react";
import { Dimensions, NativeModules, SafeAreaView, StyleSheet, TextInput, View, ScrollView, Text, Button, Alert, ActivityIndicator, DeviceEventEmitter, NativeEventEmitter, Platform } from "react-native";
import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Icon } from "@rneui/themed";

import Header from "../../shared/Header";
import CustomText from "../../shared/CustomText";
import CustomHTML from "../../shared/CustomHTML";
import TextSnippet from "../../shared/TextSnippets";

const customerData = require("../../../../data/customer.json");

function FormulareScreen({ route }) {
    const { background } = useSelector((state) => state.colorReducer);
    console.log('route', route.params)

    const [personData, setPersonData] = useState([]);
    const { dataIdentities } = useSelector((state) => state.dataReducer);
    
    const [VerifyData, setVerifyData] = useState({
        phone_token	    : '',
        phone		    : '',
        email			: '',
        api_token		: customerData.customer_api_token,
        location_id		: 0,
        verfication_for : 'mandates'  
    });
  
    useEffect(() => {
      const senderData = Array.isArray(dataIdentities) ? dataIdentities.filter((per) => { return per.choosed; }) : [];
  
      if(senderData[0]) {
        VerifyData.phone = senderData[0].formData.phone ? senderData[0].formData.phone : "";
        VerifyData.email = senderData[0].formData.phone ? senderData[0].formData.email : "";
        VerifyData.location_id = senderData[0].selectedLocation ? senderData[0].selectedLocation : 0;

        setVerifyData(VerifyData);
      }
    }, [dataIdentities]);

    const [IsVerified, setIsVerified] = useState(false);
    const [UserEmail, setUserEmail] = useState('');
    const [VerifyingPIN, setVerifyingPIN] = useState(false);
    
    async function checkIfIsVerified() {
        try {
            let result = await AsyncStorage.getItem('formulare_verified');
            if(result && result != null) {
            console.log('storeIsVerified result', result)
            setIsVerified(true);
            }
          } catch (e) {
            console.log('storeIsVerified ERR', e)
          }
    };

    async function saveIsVerified() {
      try {
        await AsyncStorage.setItem('formulare_verified', 'true');
        setIsVerified(true);
      } catch (e) {
        console.log('saveIsVerified ERR', e)
      }
    };
    
    async function removeIsVerified() {
      try {
        await AsyncStorage.removeItem('formulare_verified');
        setIsVerified(false);
      } catch (e) {
        console.log('removeIsVerified ERR', e)
      }
    };

    useEffect(() => {
        checkIfIsVerified()
    }, []);

    const sendVerifyPIN = async () => {
        console.log('E-Mail 2 verify:', UserEmail);
        console.log('E-Mail 2 verify:', VerifyData);

        VerifyData.email = UserEmail;

        setVerifyData(VerifyData)

        //setVerifyingPIN(true);
    
        /*fetch('https://apiv5.beleganbei.de/docexchange/verify-pin/', {
          method: 'POST',
          headers: {
            'Accept'        : 'application/json',
            'Content-Type'  : 'multipart/form-data',
          },
          body:JSON.stringify({
            pin: UserEmail,
            customer: customerData.customer_api_token
          })
        }).then((response) => response.json()).then((responseJson) => {
            setVerifyingPIN(false);
    
            if(responseJson.success) {
              console.log('/docexchange/verify-pin/ SUCCCESSS', responseJson.success)
              storeFetchToken(responseJson.success)
            } else if(responseJson.error) {
              Alert.alert('Achtung', responseJson.error, [{ text: 'OK' }]);
    
              return;
            }
        }).catch((error) => {
          console.error(error);
          setVerifyingPIN(false);
        });
        */
    };

    return (
        <SafeAreaView style={[styles.safeView, { backgroundColor: background }]}>
            <Header></Header>
            <ScrollView style={styles.content}>
                <TextSnippet call="more-mandates-top" />
                {!IsVerified && 
                    <View>
                        <TextSnippet call="more-mandates-unverified-top" />
                        <View>
                            <TextInput 
                            disabled={ true }
                            style={styles.input}
                            value={VerifyData.email}
                            onChangeText={pin => setUserEmail(pin)}
                            placeholder="Ihre E-Mail Adresse"
                            autoCapitalize="none"
                            autoCorrect={false}
                            placeholderTextColor="#333"
                            editable={VerifyingPIN ? false : true}
                            selectTextOnFocus={VerifyingPIN ? false : true}
                            />
                            <Button
                                title="E-Mail Adresse bestätigen" 
                                onPress={sendVerifyPIN}
                                disabled={VerifyingPIN ? true : false}
                            />
                        </View>
                        <Text>{JSON.stringify(VerifyData, null, 2)}</Text>
                    </View>
                }
                
                {IsVerified && 
                    <View>
                        <TextSnippet call="more-mandates-verified-top" />
                    </View>
                }
                
                {/* Bottom Spacer */}
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
        padding: 12
    },
    input: {
        textAlign: "center",
        backgroundColor: "#eee",
        color: "#333"
    }
});


export default FormulareScreen;
