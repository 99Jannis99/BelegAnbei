import React, { useState, useEffect, Fragment } from "react";
import { NativeModules, SafeAreaView, StyleSheet, TextInput, View, ScrollView, Text, Button, Alert, ActivityIndicator, DeviceEventEmitter, NativeEventEmitter, Platform } from "react-native";
import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Icon } from "@rneui/themed";

import Header from "../../shared/Header";
import CustomText from "../../shared/CustomText";
import CustomHTML from "../../shared/CustomHTML";
import TextSnippet from "../../shared/TextSnippets";

const { DocExchange } = NativeModules;

const customerData = require("../../../../data/customer.json");

function DocExchangeScreen() {
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

    const [IsPinVerified, setIsPinVerified] = useState(false);
    const [UserDocExchangeToken, setUserDocExchangeToken] = useState('');

    async function checkIfPinIsVerified() {
        return await AsyncStorage.getItem('docexchange_pin_verified');
    };

    async function getFetchToken() {
        return await AsyncStorage.getItem('docexchange_fetch_token');
    };

    const [InputPIN, setInputPIN] = useState('');
    const [VerifyingPIN, setVerifyingPIN] = useState(false);

    const sendVerifyPIN = async () => {
        console.log('PIN 2 verify:', InputPIN);

        if(InputPIN.length < 4) {
          Alert.alert('Achtung', 'Der PIN ist zwischen 4 und 6 Stellen lang (z.B. 1234 oder 654321)', [{ text: 'OK' }]);
          return;
        }

        setVerifyingPIN(true);

        fetch('https://apiv5.beleganbei.de/docexchange/verify-pin/', {
          method: 'POST',
          headers: {
            'Accept'        : 'application/json',
            'Content-Type'  : 'multipart/form-data',
          },
          body:JSON.stringify({
            pin: InputPIN,
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
    };

    async function storeFetchToken(token) {
      try {
        await AsyncStorage.setItem('docexchange_fetch_token', token);
        await AsyncStorage.setItem('docexchange_pin_verified', '1');

        setUserDocExchangeToken(token);
        setIsPinVerified(true);
      } catch (e) {
        // saving error
        //
      }
    };

    const [AvailableDocuments, setAvailableDocuments] = useState([]);
    const [LoadingAvailableDocuments, setLoadingAvailableDocuments] = useState(false);

    const loadAvailableDocuments = async (token) => {
      console.log('----> AvailableDocuments', 'token', token);
      console.log('----> AvailableDocuments', 'UserDocExchangeToken', UserDocExchangeToken);
      console.log('----> AvailableDocuments', 'customerData.customer_api_token', customerData.customer_api_token);

      fetch('https://apiv5.beleganbei.de/docexchange/documents/available/', {
        method: 'POST',
        headers: {
          'Accept'        : 'application/json',
          'Content-Type'  : 'multipart/form-data',
        },
        body:JSON.stringify({
          token: UserDocExchangeToken ? UserDocExchangeToken : token,
          customer: customerData.customer_api_token
        })
      }).then((response) => response.json()).then((responseJson) => {
        setLoadingAvailableDocuments(false);

        if(responseJson.success) {
          //console.log('/docexchange/documents/available/ SUCCCESSS', responseJson.success)
          setAvailableDocuments(responseJson.success);
        } else if(responseJson.error) {
          //Alert.alert('Achtung', responseJson.error, [{ text: 'OK' }]);
          console.log('err', responseJson.error)
          return;
        }
      }).catch((error) => {
        setLoadingAvailableDocuments(false);
        console.error(error);
      });
    };

    useEffect(() => {
      checkIfPinIsVerified().then(function(res) {
        console.log('checkIfPinIsVerified', res)
        if(res) {
          setIsPinVerified(true);

          getFetchToken().then(function(res) {
            console.log('getFetchToken', res)
            if(res) {
              setUserDocExchangeToken(res);

            setLoadingAvailableDocuments(true);
            setTimeout(function() {
                console.log('load available')
                setLoadingAvailableDocuments(true);
                loadAvailableDocuments(res);
              }, 500)
            }
          });
        }
      });
    }, []);

    const countUnsignedDocuments = () => {
        return AvailableDocuments.filter((document) => {
            return document.signaturable_document == 1 && document.user_signed_document == 0
        }).length;
    }

    const countUnreadDocuments = () => {
        return AvailableDocuments.filter((document) => {
            return document.document_open_count == 0
        }).length;
    }

    const openDocument = async (document) => {
        console.log('document', JSON.stringify(document, null, 2))

        const formData  = new FormData();
        formData.append('utkn', UserDocExchangeToken); // customer token
        formData.append('atkn', customerData.customer_api_token); // user access token
        formData.append('dtkn', document.document_token);
        console.log('formData', formData)

        const rawResponse = await fetch('https://app-backend.beleganbei.de/api/app-bridge/docexchange/document/details/', {
          method: 'POST',
          headers: {
            'Accept'        : 'application/json'
          },
          body: formData
        });
        const result = await rawResponse.json();
        console.log('DocexchangeOpenDocument result', result);

        if(result.error) {
          Alert.alert('Achtung', result.error, [{ text: 'OK' }]);
          return;
        } else if(result.hasOwnProperty('success')) {
          let data = JSON.stringify(result.success);

          DocExchange.open(data, customerData.customer_api_token, UserDocExchangeToken, customerData.customer_id, 'ABNC-123', '#007EDF', '#defdef', '6', '5.0.0', 'true');
          // DocExchange.open('data', 'apiToken', 'fetchToken', 'cid', 'uuid', 'bgColor', 'textColor', 'int', 'appVersion', 'true');
        } else {

        }
    }

/*
    // Dokumententausch Doc Result
    useEffect(() => {
      const emitter = Platform.OS === 'ios' ? new NativeEventEmitter(NativeModules.DocExchange) : DeviceEventEmitter
      const DOCEXCHANGE_DOCUMENT_RESULT_Listener = emitter.addListener('DOCEXCHANGE_DOCUMENT_RESULT', (e) => {
        console.log("NATIVE_EVENT DOCEXCHANGE_DOCUMENT_RESULT typeof", typeof e);
        console.log("NATIVE_EVENT DOCEXCHANGE_DOCUMENT_RESULT e", e);

        let result = e;

        if(result.code == 200) {
          Alert.alert('Achtung', `Dokument "${result.result.title}" wurde zurück geschickt`, [{ text: 'OK' }]);
        } else {
          let message = result.hasOwnProperty('message') ? result.message : '';
          let title = result.hasOwnProperty('title') ? result.title : '';
          console.log(`Dokument "${title}" -> Error Code: ${result.code} | Message: ${message}`)
          if(result.code != 400) { // KEIN Abbruch
            Alert.alert(title ?? 'Achtung', message ?? `Unbekannter Fehler`, [{ text: 'OK' }]);
          }
        }

        loadAvailableDocuments(UserDocExchangeToken);
      });
      return () => DOCEXCHANGE_DOCUMENT_RESULT_Listener.remove(); // never forget to unsubscribe
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
                <TextSnippet call="more-documents-top" />

                { !IsPinVerified &&
                    <View>
                        <TextSnippet call="more-documents-notverified" />

                        <TextInput
                        disabled={ true }
                        style={styles.input}
                        value={InputPIN}
                        onChangeText={pin => setInputPIN(pin)}
                        keyboardType="numeric"
                        placeholder="Ihr Dokumententausch PIN (4 - 6 stellig)"
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
                }

                { LoadingAvailableDocuments && <ActivityIndicator size={'large'} /> }
                { AvailableDocuments.length == 0 && !LoadingAvailableDocuments &&
                    <View>
                        <CustomText fontType="regular" style={{}}>Keine Dokumente für Sie hinterlegt.</CustomText>
                    </View>
                }

                { AvailableDocuments.length > 0 && !LoadingAvailableDocuments &&
                    <View style={{flexDirection: "column"}}>
                        <CustomText fontType="regular" style={{ textAlign: "center"}}>Es lieg{AvailableDocuments.length > 1 ? 'en' : 't'} {AvailableDocuments.length} Dokument{AvailableDocuments.length > 1 ? 'e' : ''} für Sie vor.</CustomText>

                        { countUnreadDocuments() > 0 &&
                            <CustomText fontType="regular" style={{ textAlign: "center"}}>Ungelesen: {countUnreadDocuments()}</CustomText>
                        }
                        { countUnsignedDocuments() > 0 &&
                            <CustomText fontType="regular" style={{ textAlign: "center"}}>Noch zu unterschreiben: {countUnsignedDocuments()}</CustomText>
                        }

                        <View>
                        { AvailableDocuments.map((document, i) => (
                            <View key={i} style={{flex: 1, flexDirection: "row", marginTop: 12, flexWrap: "wrap"}}>
                                <View style={{flexShrink: 1, flexBasis: 16, marginRight: 10, justifyContent: "flex-start", alignItems: "center"}}>
                                    <Icon name="file-text-o" size={14} style={{ aspectRatio: 1, paddingTop: 6, marginBottom: 6 }} allowFontScaling type="font-awesome" />

                                    { document.pinned == 1 &&
                                        <Icon name="thumb-tack" size={16} style={{ aspectRatio: 1, paddingTop: 6 }} allowFontScaling type="font-awesome" />
                                    }
                                    { document.encrypted == 1 &&
                                        <Icon name="unlock-alt" size={16} style={{ aspectRatio: 1, paddingTop: 4 }} allowFontScaling type="font-awesome" />
                                    }
                                    { document.document_open_count == 0 &&
                                        <Icon name="eye-slash" size={16} style={{ aspectRatio: 1, paddingTop: 4 }} allowFontScaling type="font-awesome" />
                                    }
                                    { document.document_download_count == 1 &&
                                        <Icon name="download" size={16} style={{ aspectRatio: 1, paddingTop: 4 }} allowFontScaling type="font-awesome" />
                                    }
                                </View>

                                <View style={{flex: 1}}>
                                    <CustomText fontType="medium" style={{}}>{document.document_title}</CustomText>
                                    <CustomText fontType="light" style={{ flexShrink: 1, fontSize: 12, marginTop: 4 }}>
                                        <Text>{document.document_added_at} </Text>
                                        { document.document_category_id > 0 &&
                                            <Text> | {document.document_category_id}</Text>
                                        }
                                    </CustomText>
                                    { document.document_text &&
                                        <CustomText fontType="light" style={{marginTop: 4, marginBottom: 4, fontSize: 14}}>{document.document_text}</CustomText>
                                    }

                                    { document.signaturable_document == 1 &&
                                        <View style={{marginTop: 12}}>
                                            { document.user_signed_document == 1 &&
                                                <CustomText fontType="regular" style={{ fontSize: 14}}>Das Dokument wurde am {document.user_signed_document_at} unterschrieben.</CustomText>
                                            }
                                            { document.user_signed_document == 0 &&
                                                <View style={{flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                                                    <Icon name="pencil" size={14} style={{ aspectRatio: 1, marginRight: 4 }} allowFontScaling type="font-awesome" />
                                                    <CustomText fontType="bold" style={{ }}>Bitte unterschreiben</CustomText>
                                                </View>
                                            }
                                        </View>
                                    }
                                </View>

                                <View style={{flexBasis:"100%", marginTop:12, marginBottom:36}}>
                                    <Button
                                    title="Öffnen"
                                    onPress={() => openDocument(document)}
                                    />
                                </View>
                            </View>
                        ))}
                        </View>
                    </View>
                }

                {/* <Text>{JSON.stringify(AvailableDocuments, null, 2)}</Text> */}

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


export default DocExchangeScreen;
