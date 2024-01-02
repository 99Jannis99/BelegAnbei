import React, { useState, useEffect, useRef } from "react";
import { Text, SafeAreaView, StyleSheet, View, ScrollView, Image, Linking, Platform, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { Icon } from "@rneui/themed";

import { getBrand, getModel, getSystemName, getSystemVersion, getApplicationName, getBuildNumber, getBundleId, getDeviceName, getFirstInstallTime, getLastUpdateTime, getReadableVersion, getVersion } from 'react-native-device-info';

import { appVersion, codeVersion, uiVersion} from "../../shared/AppVersion";
import Header from "../../shared/Header";
import CustomText from "../../shared/CustomText";

/* App Infos */
async function getDeviceInfos() {
    return {
      name: getApplicationName(),
      bundle: getBundleId(),
      device: await getDeviceName(),
      installAt: await getFirstInstallTime(),
      updateAt: await getLastUpdateTime(),
      brand: getBrand(),
      model: getModel(),
      systemVersion: getSystemVersion(),
      systemName: getSystemName()
    };
  }
  
  /* App Version */
  async function getVersionInformation() {
    return {
      version: getVersion(),
      build: getBuildNumber(),
      readable: getReadableVersion()
    };
  }
  
  async function getBundle() {
    return getBundleId();
  }

function AppInfoScreen() {
    const { background } = useSelector((state) => state.colorReducer);
    const { dataSettings, dataTextsnippets } = useSelector((state) => state.dataReducer);
  
    const [deviceData, setDeviceData] = useState({});
    const [versionData, setVersionData] = useState({});
    const [bundle, setBundle] = useState("");
    
    const [sendMethods, setSendMethods] = useState([]);
  
    useEffect(() => {
        const useSettings = JSON.parse(dataSettings);
        console.log('useSettings', typeof useSettings.sendmethods)
      
        const useSnippets = JSON.parse(dataTextsnippets);
        console.log('useSnippets', typeof useSnippets)
      
        let availableMethods = [];
        for(const methodKey in useSettings.sendmethods) {
          if(useSettings.sendmethods[methodKey].enabled) {
            let textName = methodKey;
            textName = (methodKey == 'belegzentrale' ? 'bzupload' : textName);
            textName = (methodKey == 'einkommensteuer' ? 'einkommenssteuer' : textName);
            textName = (methodKey == 'unternehmenonline' ? 'dcal' : textName);
            textName = (methodKey == 'meinesteuern' ? 'mytax' : textName);
      
            let headlineSnippet = useSnippets.filter((snippet) => {
              return snippet.callname === `modul-${textName}-name`
            })[0];
      
            let textSnippet = useSnippets.filter((snippet) => {
              return snippet.callname === `modul-${textName}-text`
            })[0];
      
            availableMethods.push({
              'method'  : methodKey,
              'textName': textName,
              'name'    : headlineSnippet ? headlineSnippet.headline : '---',
              'desc'    : textSnippet ? textSnippet.snippet : '---',
              'data'    : useSettings.sendmethods[methodKey]
            })

            setSendMethods(availableMethods)
          }
        }
    }, [dataSettings, dataTextsnippets]);
  
    useEffect(() => {
      getDeviceInfos().then((result) => {
        console.log('getDeviceInfos', result)
        setDeviceData(result)
      })
      
      getVersionInformation().then((result) => {
        console.log('getVersionInformation', result)
        setVersionData(result)
      })
  
      getBundle().then((result) => {
        console.log('getBundle', result)
        setBundle(result)
      })
    }, []);

    const toAppSettings = () => {
        if (Platform.OS === 'ios') {
            Linking.openURL('app-settings:');
        } else {
            Linking.openSettings();
        }  
    }

    return (
        <SafeAreaView style={[styles.safeView, { backgroundColor: background }]}>
            <Header></Header>
            <ScrollView style={styles.content}>

                <View style={{ justifyContent: "center", alignItems: "center", flexDirection: "row" }}>
                    <Image 
                    style={{ width: 100, height: 100, borderRadius:18 }}
                    source={require("../../../../assets/images/AppIcon.png")}
                    />
                    
                    <View style={{ flex: 1, marginLeft:12 }}>
                        <CustomText fontType="bold" style={{ fontSize: 22 }}>{deviceData.name}</CustomText>
                        <CustomText fontType="light" style={{ fontSize: 12 }}>{bundle}</CustomText>
                    </View>       
                </View>       
               
                <CustomText textType="subheadline" style={{ marginTop: 12 }}>App Version</CustomText>
                <View style={ styles.infoRow }>
                    <CustomText fontType="bold" style={{}}>Installierte Version</CustomText>
                    <CustomText fontType="light" style={{}}>{versionData.readable}</CustomText>
                </View>  
                <View style={ styles.infoRow }>
                    <CustomText fontType="bold" style={{}}>Beleg Anbei für {deviceData.systemName}</CustomText>
                    <CustomText fontType="light" style={{}}>{appVersion}</CustomText>
                </View>      
                <View style={ styles.infoRow }>
                    <CustomText fontType="bold" style={{}}>Code Basis</CustomText>
                    <CustomText fontType="light" style={{}}>{codeVersion}</CustomText>
                </View>      
                <View style={ styles.infoRow }>
                    <CustomText fontType="bold" style={{}}>UI</CustomText>
                    <CustomText fontType="light" style={{}}>{uiVersion}</CustomText>
                </View>      

                <CustomText textType="subheadline" style={{ marginTop: 12 }}>Versand Module</CustomText>
                {
                    sendMethods.map((method, i) => (
                        <View key={i} style={{}}>
                            <CustomText fontType="bold" style={{marginBottom: 4}}>{method.name}</CustomText>
                            <CustomText fontType="light" style={{marginBottom: 8}}>{method.desc}</CustomText>
                        </View>  
                    ))
                }

                <CustomText textType="subheadline" style={{ marginTop: 12 }}>Berechtigungen</CustomText>
                <CustomText fontType="bold" style={{marginBottom: 4}}>Kamera</CustomText>
                <CustomText style={{marginBottom: 8}}>Wird benötigt, um Ihre Belege und Dokumente zu fotografieren. Der Zugriff erfolgt ausschließlich wenn Sie diesen aktiv auslösen.</CustomText>
                
                <CustomText fontType="bold" style={{marginBottom: 4}}>Speicher</CustomText>
                <CustomText style={{marginBottom: 8}}>Wird benötigt, um Ihre Belege und Dokumente zu sichern. Der Zugriff erfolgt ausschließlich wenn Sie diesen aktiv auslösen, z.B. einen neuen Beleg fotografieren.</CustomText>
                
                <CustomText fontType="bold" style={{marginBottom: 4}}>Kontakte</CustomText>
                <CustomText style={{marginBottom: 8}}>Diese Berechtigung wird nur dann aungefordert, wenn Sie einen Ansprechpartner oder Standort zu Ihren Kontakten hinzufügen möchten. Diese Berechtigung ist nicht notwendig für die volle Nutzung der App.</CustomText>

                <TouchableOpacity activeOpacity={1} style={{marginTop: 8, justifyContent: "center", flexDirection: "row", alignItems: "center"}} onPress={toAppSettings}>
                    <Icon
                        name="arrow-right"
                        size={14}
                        style={{aspectRatio: 1 }}
                        allowFontScaling
                        type="font-awesome"
                    />
                    <CustomText fontType="medium" style={styles.button}>
                        Zu den App Einstellungen und Berechtigungen
                    </CustomText>
                </TouchableOpacity>

                <CustomText textType="subheadline" style={{ marginTop: 12 }}>Geräte-Informationen</CustomText>
                <View style={ styles.infoRow }>
                    <CustomText fontType="bold" style={{marginBottom: 4}}>Hersteller</CustomText>
                    <CustomText fontType="light" style={{textTransform: 'capitalize', marginBottom: 4}}>{deviceData.brand}</CustomText>
                </View>    
                <View style={ styles.infoRow }>
                    <CustomText fontType="bold" style={{marginBottom: 4}}>Modell</CustomText>
                    <CustomText fontType="light" style={{marginBottom: 4}}>{deviceData.model}</CustomText>
                </View>    
                <View style={ styles.infoRow }>
                    <CustomText fontType="bold" style={{marginBottom: 4}}>Platform</CustomText>
                    <CustomText fontType="light" style={{marginBottom: 4}}>{deviceData.systemName}</CustomText>
                </View>    
                <View style={ styles.infoRow }>
                    <CustomText fontType="bold" style={{marginBottom: 4}}>{deviceData.systemName} Version</CustomText>
                    <CustomText fontType="light" style={{marginBottom: 4}}>{deviceData.systemVersion}</CustomText>
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
        padding: 12
    },
    infoRow: {
        justifyContent: "space-between", 
        alignItems: "center", 
        flexDirection: "row"
    },
    button: {
        fontSize: 18,
        marginLeft: 6
    }
});


export default AppInfoScreen;
