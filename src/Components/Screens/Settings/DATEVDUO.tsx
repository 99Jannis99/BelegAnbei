import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView, Text, NativeModules, NativeEventEmitter, DeviceEventEmitter, Platform, Button } from "react-native";
import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

import CustomText from "../../shared/CustomText";
import TextSnippet from "../../shared/TextSnippets";
import { TouchableOpacity } from "react-native-gesture-handler";

const { DATEV, DATEVDUO, DATEVDMS, ConfigProperties } = NativeModules;

async function startup() {
    DATEV.isInitialized();
    DATEV.isLoggedIn();
    DATEV.isSmartLoginAvailable();
}

/* MOVE TO SHARED */
async function loadDATEVUserData() {
  console.log('loadDATEVUserData');
  let client_id = await ConfigProperties.prop('datev.client_id');
  let sandbox = await ConfigProperties.prop('datev.sandbox');
  if(Platform.OS !== 'ios') {
      sandbox = (sandbox === "true");
  }

  let result = await DATEVDUO.userdata(client_id, sandbox)
  console.log('UserDataButton result', result);
}

const saveDATEVUserData = async (userData: object) => {
  try {
    await AsyncStorage.setItem('DATEV_UserData', JSON.stringify(userData));
  } catch (error) {
    // Error saving data
    console.log('saveDATEVUserData NO error', error);
  }
};

const readDATEVUserData = async () => {
    try {
    const value = await AsyncStorage.getItem('DATEV_UserData');
    if (value !== null) {
      console.log('readDATEVUserData value', value);
      return JSON.parse(value);
    } else {
      console.log('readDATEVUserData NO VALUE');
      loadDATEVUserData();
    }
  } catch (error) {
    // Error retrieving data
    loadDATEVUserData();
  }
};
/* MOVE TO SHARED */

function DATEVDUOScreen() {
    const { background } = useSelector((state) => state.colorReducer);

    const [IsDATEVLoggedIn, setIsDATEVLoggedIn] = useState(false);
    const [IsDATEVInitialized, setIsDATEVInitialized] = useState(false);
    const [IsDATEVSmartloginAvailable, setIsDATEVSmartloginAvailable] = useState(false);
    const [DATEVUserData, setDATEVUserData] = useState({});

    useEffect(() => {
        startup()
    }, []);

    // DATEV_IS_INITIALIZED
    useEffect(() => {
      const emitter = Platform.OS === 'ios' ? new NativeEventEmitter(NativeModules.DATEV) : DeviceEventEmitter
      const DATEV_IS_INITIALIZED_Listener = emitter.addListener('DATEV_IS_INITIALIZED', (e) => {
        console.log("NATIVE_EVENT DATEV_IS_INITIALIZED", e, typeof e);
  
        if(typeof e != 'boolean') {
          e = (e == "true")
        }
  
        // should be initialized
        setIsDATEVInitialized(e);
      });
      return () => DATEV_IS_INITIALIZED_Listener.remove(); // never forget to unsubscribe
    }, []);

    // DATEV_SMARTLOGIN_AVAILABLE
    useEffect(() => {
      const emitter = Platform.OS === 'ios' ? new NativeEventEmitter(NativeModules.DATEV) : DeviceEventEmitter
      const DATEV_SMARTLOGIN_AVAILABLE_Listener = emitter.addListener('DATEV_SMARTLOGIN_AVAILABLE', (e) => {
        console.log("NATIVE_EVENT !!DATEVDUO!! DATEV_SMARTLOGIN_AVAILABLE", e, typeof e);
  
        if(typeof e != 'boolean') {
          e = (e == "true")
        }
  
        // true ES false NO
        setIsDATEVSmartloginAvailable(e);
      });
      return () => DATEV_SMARTLOGIN_AVAILABLE_Listener.remove(); // never forget to unsubscribe
    }, []);
  
  
    // DATEV_AuthState_Changed
    useEffect(() => {
      const emitter = Platform.OS === 'ios' ? new NativeEventEmitter(NativeModules.DATEV) : DeviceEventEmitter
      const DATEV_AuthState_Changed_Listener = emitter.addListener('DATEV_AuthState_Changed', (e) => {
        console.log("NATIVE_EVENT !!DATEVDUO!! DATEV_AuthState_Changed", e, typeof e);
  
        if(typeof e != 'boolean') {
          e = (e == "true")
        }
  
        // true ES false NO
        setIsDATEVLoggedIn(e);

        if(e) {
            readDATEVUserData().then((res) => {
                console.log('RRRRRRRRRRRRRRRES', res)
                setDATEVUserData(res);
            })
        }
      });
      return () => DATEV_AuthState_Changed_Listener.remove(); // never forget to unsubscribe
    }, []);
  
    // DATEV_AuthState_Error
    useEffect(() => {
      const emitter = Platform.OS === 'ios' ? new NativeEventEmitter(NativeModules.DATEV) : DeviceEventEmitter
      const DATEV_AuthState_Error_Listener = emitter.addListener('DATEV_AuthState_Error', (e) => {
        console.log("NATIVE_EVENT !!DATEVDUO!! DATEV_AuthState_Error", e, typeof e);
  
        if(typeof e != 'boolean') {
          e = (e == "true")
        }
        
        // error so logout to be sure
        setIsDATEVLoggedIn(e);
      });
      return () => DATEV_AuthState_Error_Listener.remove(); // never forget to unsubscribe
    }, []);
  
    // DATEV_DATA_USERDATA
    useEffect(() => {
      const emitter = Platform.OS === 'ios' ? new NativeEventEmitter(NativeModules.DATEVDUO) : DeviceEventEmitter
      const DATEV_DATA_USERDATA_Listener = emitter.addListener('DATEV_DATA_USERDATA', (e) => {
        console.log("NATIVE_EVENT !!DATEVDUO!! DATEV_DATA_USERDATA", e, typeof e);
        let result = JSON.parse(e);
  
        if(result.code == 201) {
            const resultData:object = Platform.OS === 'ios' ? result.data : JSON.parse(result.data)
    
            saveDATEVUserData(resultData);
            setDATEVUserData(resultData);
          } else {
            console.log('Error -> ' + result.code)
          }
      });
      return () => DATEV_DATA_USERDATA_Listener.remove(); // never forget to unsubscribe
    }, []);

    return (
        <ScrollView>
            <View style={styles.contentView}>
                <TextSnippet call="app-dcalsettings-top-login" />
            </View>

            <Text>{JSON.stringify(DATEVUserData, null, 2)}</Text>

            
            <View style={styles.contentView}>
                <CustomText textType="headline" style={{}}>Initialized: {IsDATEVInitialized ? 'JA': 'NEIN'}</CustomText>
                <CustomText textType="headline" style={{}}>Smartlogin: {IsDATEVSmartloginAvailable ? 'JA': 'NEIN'}</CustomText>
                <CustomText textType="headline" style={{}}>Logged in: {IsDATEVLoggedIn ? 'JA': 'NEIN'}</CustomText>
            </View>


            <View style={styles.contentView}>
                { IsDATEVLoggedIn && 
                    <Button title="Abmelden" onPress={() => DATEV.requestLogout()}>
                        <CustomText fontType="bold" style={{}}></CustomText>
                    </Button>
                }
                { !IsDATEVLoggedIn && 
                    <Button title="Anmelden" onPress={() => DATEV.requestLogin()}>
                        
                    </Button>
                }
            </View>
            
            {/* <Text>{JSON.stringify(downloads, null, 2)}</Text> */}

            {/* Bottom Spacer */}
            <Text> </Text>
        </ScrollView>
    );
}

/*

app-dcalsettings-smartloginmissing
app-dcalsettings-top-logout
*/


const styles = StyleSheet.create({
    safeView: {
        flex: 1
    },
    content: {
    },
    contentView: {
        padding: 12
    }
});


export default DATEVDUOScreen;
