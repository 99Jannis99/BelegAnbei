import React, { Component, useState, useEffect } from "react";
import { Text, View, SafeAreaView, StyleSheet, TextInput, Button, Alert } from "react-native";
import { useSelector } from "react-redux";
import Header from "../../shared/Header";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import AsyncStorage from "@react-native-async-storage/async-storage";

const customerData = require("../../../../data/customer.json");

const onChangeText = (val) => {
  console.log('onChangeText', val)
}

const setText = (val) => {
  console.log('setText', val)
}

function DocExchangeScreen() {
  const { background, primary } = useSelector((state) => state.colorReducer);

  const [IsPinVerified, setIsPinVerified] = useState(false);
  const [UserDocExchangeToken, setUserDocExchangeToken] = useState('');

  const [AvailableDocuments, setAvailableDocuments] = useState([]);
  const [LoadingAvailableDocuments, setLoadingAvailableDocuments] = useState(false);

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

  const removePINVerification = async () => {
    console.log('removePINVerification');
    try {
      await AsyncStorage.removeItem('docexchange_fetch_token');
      await AsyncStorage.removeItem('docexchange_pin_verified');

      setUserDocExchangeToken('');
      setIsPinVerified(false);
    } catch (e) {
      // saving error
    }
  };

  const loadAvailableDocuments = async (token) => {
    console.log('----> AvailableDocuments', 'token', token);
    console.log('----> AvailableDocuments', 'UserDocExchangeToken', UserDocExchangeToken);
    console.log('----> AvailableDocuments', 'customerData.customer_api_token', customerData.customer_api_token);

    setLoadingAvailableDocuments(true);

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

  async function checkIfPinIsVerified() {
    return await AsyncStorage.getItem('docexchange_pin_verified');
  };

  async function getFetchToken() {
    return await AsyncStorage.getItem('docexchange_fetch_token');
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

            setTimeout(function() {
              console.log('load available')
              loadAvailableDocuments(res);
            }, 500)
          }
        });
      }
    });
  }, [IsPinVerified]);

  return (
    <SafeAreaView style={[styles.moreSafeView, { backgroundColor: background }]}>
      <Header></Header>
      <DrawerContentScrollView>

        <View>
          <Text style={[styles.moreHeadline, { color: primary }]}>DocExchange</Text>
        </View>

        {LoadingAvailableDocuments &&
          <View>
            <Text>lade Documents</Text>
          </View>
        }

        { IsPinVerified &&
          <View style={styles.moreContent}>
            <Text>JA PIN</Text>
            <Button
              title="PIN entfernen"
              onPress={removePINVerification}
             />
             <Text>{JSON.stringify(AvailableDocuments, null, 2)}</Text>
          </View>
        }

        { !IsPinVerified &&
          <View style={styles.moreContent}>
            <Text>Bitte geben Sie Ihren PIN ein. Diesen haben Sie von Ihrer Kanzlei erhalten.</Text>

            <TextInput
            disabled={ true }
              style={styles.input}
              value={InputPIN}
              onChangeText={pin => setInputPIN(pin)}
              keyboardType="numeric"
              placeholder="Ihr Dokumententausch PIN (4 - 6 stellig)"
              placeholderTextColor="#fa2000"
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
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    textAlign: "center"
  }
});

export default DocExchangeScreen;
