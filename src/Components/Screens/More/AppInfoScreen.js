import React, { Component, useEffect, useState } from "react";
import { Text, View, SafeAreaView, StyleSheet, ScrollView } from "react-native";
import { useSelector } from "react-redux";
import Header from "../../shared/Header";

import { getApiLevel, getApplicationName, getBuildNumber, getBundleId, getUniqueId, getDeviceName, getDeviceToken, getFirstInstallTime, getFreeDiskStorage, getLastUpdateTime, isPinOrFingerprintSet, getReadableVersion, getVersion } from 'react-native-device-info';

/* App Infos */
async function getDeviceInfos() {
  return {
    name: getApplicationName(),
    bundle: getBundleId(),
    device: await getDeviceName(),
    androidApiLevel: await getApiLevel(),
    version: getReadableVersion(),
    //iosToken: await getDeviceToken(),
    uniqueId: await getUniqueId(),
    installAt: await getFirstInstallTime(),
    updateAt: await getLastUpdateTime(),
    verifikation: await isPinOrFingerprintSet(),
    freeSpace: await getFreeDiskStorage()
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
  const { background, primary } = useSelector((state) => state.colorReducer);

  const { dataSettings } = useSelector((state) => state.dataReducer );

  const { dataTextsnippets } = useSelector((state) => state.dataReducer);
  const useSnippets = JSON.parse(dataTextsnippets);

  const useSettings = JSON.parse(dataSettings);
  console.log('useSettings', typeof useSettings.sendmethods)

  const availableMethods = [];
  for(methodKey in useSettings.sendmethods) {
    if(useSettings.sendmethods[methodKey].enabled) {
      textName = methodKey;
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
        'method': methodKey,
        'textName': textName,
        'name'  : headlineSnippet ? headlineSnippet.headline : '---',
        'desc'  : textSnippet ? textSnippet.snippet : '---',
        'data'  : useSettings.sendmethods[methodKey]
      })
    }
  }
  //  const availableMethods = useSettings.sendmethods.filter(() => {
  //  return true;
  //});
  
  const [deviceData, setDeviceData] = useState({});
  const [versionData, setVersionData] = useState({});
  const [bundle, setBundle] = useState("");

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

  return (
    <SafeAreaView style={[styles.moreSafeView, { backgroundColor: background }]}>
      <Header></Header>
      <ScrollView>
        <View>
          <Text style={[styles.moreHeadline, { color: primary }]}>AppInfoScreen</Text>
        </View>
        <View style={styles.moreContent}>
            <Text>{JSON.stringify(versionData, null, 2)}</Text>
            <Text>{JSON.stringify(deviceData, null, 2)}</Text>
            <Text>{JSON.stringify(bundle, null, 2)}</Text>
            <Text>{JSON.stringify(availableMethods, null, 2)}</Text>
        </View>
      </ScrollView>
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

export default AppInfoScreen;
