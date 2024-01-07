import React, { useState, useEffect, Fragment } from "react";
import { Dimensions, NativeModules, SafeAreaView, StyleSheet, TextInput, View, ScrollView, Text, Button, Alert, ActivityIndicator, DeviceEventEmitter, NativeEventEmitter, Platform } from "react-native";
import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Icon } from "@rneui/themed";

import Header from "../../shared/Header";
import CustomText from "../../shared/CustomText";
import CustomHTML from "../../shared/CustomHTML";
import TextSnippet from "../../shared/TextSnippets";

const { PDFViewer } = NativeModules;

import { getUniqueId } from 'react-native-device-info';

const customerData = require("../../../../data/customer.json");

function FormulareScreen({ route }) {
    const { background } = useSelector((state) => state.colorReducer);

    /* iOS SafeArea */
      const { dataStyle, dataSettings } = useSelector((state) => state.dataReducer);
      // top
      const [localSettings, setLocalSettings] = useState({});
      useEffect(() => {
        setLocalSettings(JSON.parse(dataSettings));
      }, [dataSettings]);
      // bottom
      const [localDataStyle, setLocalDataStyle] = useState({});
      useEffect(() => {
        setLocalDataStyle(JSON.parse(dataStyle));
      }, [dataStyle]);
    /* iOS SafeArea */

    const { dataIdentities, dataMandates } = useSelector((state) => state.dataReducer);

    const [AvailableFormulare, setAvailableFormulare] = useState([]);
    useEffect(() => {
      let useMandates = JSON.parse(dataMandates)
      setAvailableFormulare(useMandates);
    }, [dataMandates]);

    const [VerifyPinCode, setVerifyPinCode] = useState("");

    const [VerifyToken, setVerifyToken] = useState("");
    const [VerifyPhone, setVerifyPhone] = useState("");
    const [VerifyEmail, setVerifyEmail] = useState("");
    const [VerifyLocationId, setVerifyLocationId] = useState("");

    useEffect(() => {
      const senderData = Array.isArray(dataIdentities) ? dataIdentities.filter((per) => { return per.choosed; }) : [];

      if(senderData[0]) {
        const phone = senderData[0].formData.phone ? senderData[0].formData.phone : "";
        const email = senderData[0].formData.phone ? senderData[0].formData.email : "";
        const location_id = senderData[0].selectedLocation ? senderData[0].selectedLocation : 0;

        setVerifyPhone(phone);
        setVerifyEmail(email);
        setVerifyLocationId(location_id);
      }
    }, [dataIdentities]);

    useEffect(() => {
      getUniqueId().then((uniqueId) => {
        setVerifyToken(uniqueId);
      });
    }, []);

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

    const requestVerifyPIN = async () => {
      console.log('requestVerifyPIN:', {
        phone_token	    : VerifyToken,
        phone		        : VerifyPhone,
        email			      : VerifyEmail,
        api_token		    : customerData.customer_api_token,
        location_id		  : VerifyLocationId,
        verfication_for : 'mandates'
      });

      setVerifyingPIN(true);

      fetch('https://app-backend.beleganbei.de/api/app-bridge/vollmachten/request/verifikation/', {
        method: 'POST',
        headers: {
          'Accept'        : 'application/json',
          'Content-Type'  : 'multipart/form-data',
        },
        body:JSON.stringify({
          phone_token	      : VerifyToken,
          phone		          : VerifyPhone,
          email			        : VerifyEmail,
          api_token		      : customerData.customer_api_token,
          location_id		    : VerifyLocationId,
          verfication_for   : 'mandates',
          verification_type: 'email'
      })
      }).then((response) => response.json()).then((responseJson) => {
          setVerifyingPIN(false);
          console.log('/vollmachten/request/verifikation/ RESULT', responseJson)

          if(responseJson.success) {
            console.log('/vollmachten/request/verifikation/ SUCCCESSS', JSON.stringify(responseJson.success, null, 2))
            Alert.alert('Achtung', `Der PIN wurde an "${VerifyEmail}" gesendet. Bitte prüfen Sie ggf. auch den SPAM Ordner.`, [{ text: 'OK' }]);

          } else if(responseJson.error) {
            Alert.alert('Achtung', responseJson.error, [{ text: 'OK' }]);

            return;
          } else{

          }
      }).catch((error) => {
        console.error(error);
        setVerifyingPIN(false);
      });
    };

    const sendVerifyPIN = async () => {
      console.log('requestVerifyPIN:', {
        phone_token	    : VerifyToken,
        phone		        : VerifyPhone,
        email			      : VerifyEmail,
        api_token		    : customerData.customer_api_token,
        location_id		  : VerifyLocationId,
        verfication_for : 'mandates'
      });

      setVerifyingPIN(true);

      fetch('https://app-backend.beleganbei.de/api/app-bridge/vollmachten/confirm/verifikation/', {
        method: 'POST',
        headers: {
          'Accept'        : 'application/json',
          'Content-Type'  : 'multipart/form-data',
        },
        body:JSON.stringify({
          pin_code          : VerifyPinCode,
          phone_token	      : VerifyToken,
          phone		          : VerifyPhone,
          email			        : VerifyEmail,
          api_token		      : customerData.customer_api_token,
          location_id		    : VerifyLocationId,
          verfication_for   : 'mandates',
          verification_type: 'email'
      })
      }).then((response) => response.json()).then((responseJson) => {
          setVerifyingPIN(false);
          console.log('/vollmachten/confirm/verifikation/ RESULT', responseJson)

          if(responseJson.success) {
            console.log('/vollmachten/confirm/verifikation/ SUCCCESSS', JSON.stringify(responseJson.success, null, 2))
            Alert.alert('Achtung', `Der PIN wurde erfolgreich verifiziert.`, [{ text: 'OK' }]);

            saveIsVerified();
          } else if(responseJson.error) {
            Alert.alert('Achtung', responseJson.error, [{ text: 'OK' }]);

            return;
          } else{

          }
      }).catch((error) => {
        console.error(error);
        setVerifyingPIN(false);
      });
    };

    const [OpenedFormular, setOpenedFormular] = useState(false);
    const openFormular = (formularData) => {
      console.log('openFormular', formularData)

      setOpenedFormular(formularData);
    }

    const openExamplePDF = (formularData) => {
      console.log('openExamplePDF', formularData)

      let pdfSource = 'https://app-backend.beleganbei.de/api/app-bridge/vollmachten/vollmacht/example/' + customerData.customer_api_token + '/' + formularData.mandate_token + '-example.pdf';
      let bgColor = "#007EDF";
      let textColor = "#FFFFFF";

      console.log('ShowPDF pdfSource', pdfSource, typeof pdfSource);
      console.log('ShowPDF bgColor', bgColor, typeof bgColor);
      console.log('ShowPDF textColor', textColor, typeof textColor);

      PDFViewer.show(pdfSource, bgColor, textColor);
    }

    /*useEffect(() => {
      // Formular Preview handed in
      const emitter = Platform.OS === 'ios' ? new NativeEventEmitter(NativeModules.Formulare) : DeviceEventEmitter
      const FORMULAR_HANDED_IN_Listener = emitter.addListener('FORMULAR_HANDED_IN', (e) => {
        console.log("NATIVE_EVENT FORMULAR_HANDED_IN", e);

        let result = e;

        if(result.code == 200) {
          console.log('Eingesendet!')
        } else {
          console.log('Abbruch!')
        }
      });
      return () => FORMULAR_HANDED_IN_Listener.remove(); // never forget to unsubscribe
    }, []);
    */

    return (
      <Fragment>
        {localSettings.colors &&
          <SafeAreaView style={{ flex: 0, backgroundColor: localSettings.colors.statusbar_hex }} />
        }
        <SafeAreaView style={[styles.safeView, { backgroundColor: localDataStyle.bottom_toolbar_background_color }]}>
            <Header></Header>
            <ScrollView style={[styles.content, { backgroundColor: background }]}>
                {!IsVerified &&
                    <View style={{marginTop: 12}}>
                        <TextSnippet call="more-mandates-top" />
                        <TextSnippet call="more-mandates-unverified-top" />
                        <View style={{marginBottom: 12}}>
                            <TextInput
                            disabled={ true }
                            style={styles.input}
                            value={VerifyEmail}
                            onChangeText={pin => setVerifyEmail(pin)}
                            placeholder="Ihre E-Mail Adresse"
                            autoCapitalize="none"
                            autoCorrect={false}
                            placeholderTextColor="#333"
                            editable={VerifyingPIN ? false : true}
                            selectTextOnFocus={VerifyingPIN ? false : true}
                            />
                            <Button
                                title="Persönlichen PIN Code anfordern"
                                onPress={requestVerifyPIN}
                                disabled={VerifyingPIN ? true : false}
                            />
                        </View>

                        <TextSnippet call="more-mandates-unverified-pininput" />
                        <View>
                            <TextInput
                            disabled={ true }
                            style={styles.input}
                            value={VerifyPinCode}
                            onChangeText={pin => setVerifyPinCode(pin)}
                            placeholder="Ihr persönlicher PIN Code"
                            keyboardType="numeric"
                            autoCorrect={false}
                            placeholderTextColor="#333"
                            editable={VerifyingPIN ? false : true}
                            selectTextOnFocus={VerifyingPIN ? false : true}
                            />
                            <Button
                                title="PIN verifizieren"
                                onPress={sendVerifyPIN}
                                disabled={VerifyingPIN ? true : false}
                            />
                        </View>
                    </View>
                }

                {IsVerified && !OpenedFormular.mandate_id &&
                    <View>
                        <TextSnippet call="more-mandates-verified-top" />
                        <TextSnippet call="more-mandates-available-headline" />
                        { AvailableFormulare.map((formular, i) => (
                          <View key={i} style={{flex: 1, flexDirection: "row", marginTop: 12, flexWrap: "wrap"}}>
                            <CustomText textType="subheadline" style={{}}>{formular.mandate_name}</CustomText>
                            <CustomHTML htmlContent={formular.mandate_description_short} style={{}}></CustomHTML>

                            <View style={{flexBasis:"100%", marginTop:12, marginBottom:36, flexDirection: "column"}}>
                                <Button
                                title="Öffnen und ausfüllen"
                                onPress={() => openFormular(formular)}
                                />
                                <Button
                                title="Beispiel"
                                onPress={() => openExamplePDF(formular)}
                                />
                            </View>
                          </View>
                          ))
                        }
                        <Text>{JSON.stringify(AvailableFormulare, null, 2)}</Text>
                    </View>
                }

                {IsVerified && OpenedFormular.mandate_id &&
                  <View>
                    <TextSnippet call="more-mandates-form-headline" />
                    <CustomText textType="headline" style={{}}>{OpenedFormular.mandate_name}</CustomText>
                    <CustomHTML htmlContent={OpenedFormular.mandate_description_short} style={{}}></CustomHTML>
                    <View style={{flexBasis:"100%", marginTop:12, marginBottom:36}}>
                        <Button
                        title="Beispiel"
                        onPress={() => openExamplePDF(OpenedFormular)}
                        />
                    </View>
                    <View style={{flexBasis:"100%", marginTop:12, marginBottom:36}}>
                        <Button
                        title="Abbrechen"
                        onPress={() => setOpenedFormular(false)}
                        />
                    </View>


                    { OpenedFormular.mandate_fields.map((field, i) => (
                        <View key={i}>
                          <Text>
                          {field.field_type} => {field.field_label}
                          </Text>
                        </View>
                      ))
                    }

                    {/* <Text>{JSON.stringify(OpenedFormular, null, 2)}</Text> */}
                  </View>
                }

                {/* Bottom Spacer */}
                <Text> </Text>
            </ScrollView>
          </SafeAreaView>
        </Fragment>
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
