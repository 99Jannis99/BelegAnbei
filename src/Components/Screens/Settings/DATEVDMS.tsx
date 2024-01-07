import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView, Text, NativeModules, NativeEventEmitter, DeviceEventEmitter, Platform, Button, Alert, Image, ActivityIndicator, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppLink from 'react-native-app-link';
import { Skeleton } from '@rneui/themed';

import CustomText from "../../shared/CustomText";
import TextSnippet from "../../shared/TextSnippets";
import { FontAwesome5, MaterialCommunityIcons } from "../../../helpers/icons";

import { HideSpinner, ShowSpinner } from '../../../Functions/LoadingSpinner';
import { getSnippetPart } from "../../shared/TextSnippetFunctions";
import Modal from "react-native-modal";

const { DATEV, DATEVDUO, DATEVDMS, ConfigProperties } = NativeModules;

async function startup() {
    DATEV.isInitialized();
    DATEV.isLoggedIn();
    DATEV.isSmartLoginAvailable();
}

/* MOVE TO SHARED */
const saveDATEVUserData = async (userData: object) => {
  try {
    await AsyncStorage.setItem('DATEV_UserData', JSON.stringify(userData));
  } catch (error) {
    // Error saving data
    console.log('saveDATEVUserData NO error', error);
  }
};

async function loadDATEVUserData() {
  console.log('loadDATEVUserData');
  let client_id = await ConfigProperties.prop('datev.client_id');
  let sandbox = await ConfigProperties.prop('datev.sandbox');
  if(Platform.OS !== 'ios') {
      sandbox = (sandbox === "true");
  }

  let result = await DATEVDUO.userdata(client_id, sandbox)
  console.log('loadDATEVUserData result', result);
}

const readDATEVUserData = async () => {
    try {
    const value = await AsyncStorage.getItem('DATEV_UserData');
    if (value !== null) {
      //console.log('readDATEVUserData value', value);
      return JSON.parse(value);
    } else {
      //console.log('readDATEVUserData NO VALUE');
      loadDATEVUserData();
    }
  } catch (error) {
    // Error retrieving data
    loadDATEVUserData();
  }
};

async function loadDATEVClientsData(term, skip, top) {
  console.log('loadDATEVClientsData', term, skip, top);
  let client_id = await ConfigProperties.prop('datev.client_id');
  let sandbox = await ConfigProperties.prop('datev.sandbox');
  if(Platform.OS !== 'ios') {
      sandbox = (sandbox === "true");
  }

  await DATEVDMS.clients(client_id, term, skip, top, sandbox)
}

async function loadDATEVClientTaxYearsData(clientID) {
  console.log('loadDATEVClientTaxYearsData', clientID);
  let client_id = await ConfigProperties.prop('datev.client_id');
  let sandbox = await ConfigProperties.prop('datev.sandbox');
  if(Platform.OS !== 'ios') {
      sandbox = (sandbox === "true");
  }

  await DATEVDMS.clientTaxYears(client_id, clientID, sandbox)
}

async function loadDATEVClientTaxYearFoldersData(clientID, year) {
  console.log('loadDATEVClientTaxYearFoldersData', clientID, year);
  let client_id = await ConfigProperties.prop('datev.client_id');
  let sandbox = await ConfigProperties.prop('datev.sandbox');
  if(Platform.OS !== 'ios') {
      sandbox = (sandbox === "true");
  }

  await DATEVDMS.clientTaxYearFolders(client_id, clientID, year, sandbox)
}

const openDATEVSmartloginAppStore = () => {
  console.log('AppLink.openInStore')
  AppLink.openInStore({
    appName: 'DATEV SmartLogin',
    appStoreId: 943870921,
    appStoreLocale: 'de',
    playStoreId: 'de.datev.smartlogin',
  }).then(() => {
    console.log('AppLink.openInStore OK')
  })
  .catch((err) => {
    console.log('AppLink.openInStore err', err)
    // handle error
  });
}
/* MOVE TO SHARED */

const doLogin = () => {
  DATEV.requestLogin();
}

const doLogout = () => {
  Alert.alert('Abmeldung', 'Möchten Sie Ihre Verbindung von der DATEV jetzt lösen?', [
    {
      text: 'Nein, abbrechen',
      onPress: () => console.log('Cancel Pressed'),
      style: 'cancel',
    },
    {text: 'Ja', onPress: () => DATEV.requestLogout()}
  ]);
}

const maxDATEVClientsPerCall = 5;

function DATEVDMSScreen() {
    const { background } = useSelector((state) => state.colorReducer);

    const { dataStyle, dataSettings, dataTextsnippets } = useSelector(
      (state) => state.dataReducer
    );

    /* iOS SafeArea */
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

    const [DATEVClientsManageModal, setDATEVClientsManageModal] = useState(false);
    const openManageClientsModal = () => {
      console.log('openManageClientsModal')
      setDATEVClientsTop(maxDATEVClientsPerCall)
      loadClients('', 1, 0, DATEVClientsTop)
      setDATEVClientsManageModal(true)
    };

    const closeManageClientsModal = () => {
      console.log('closeManageClientsModal')
      setDATEVClientsTop(maxDATEVClientsPerCall)
      setDATEVClientsManageModal(false)
    };

    const loadClients = async (term, page, skip, top) => {
      loadDATEVClientsData(term, skip, top);
      setDATEVClientsSearchPage(page)
      setDATEVClientsSearchLoading(true)
    };

    const loadClientTaxYearsData = async (clientID) => {
      setDATEVClientTaxYearsLoading(clientID)
      loadDATEVClientTaxYearsData(clientID);
    };

    const loadClientTaxYearFoldersData = async (clientID, year) => {
      setDATEVClientTaxYearsLoading(clientID)
      loadDATEVClientTaxYearFoldersData(clientID, year);
    };

    const [IsDATEVLoggedIn, setIsDATEVLoggedIn] = useState(false);
    const [IsDATEVInitialized, setIsDATEVInitialized] = useState(false);
    const [IsDATEVSmartloginAvailable, setIsDATEVSmartloginAvailable] = useState(false);
    const [DATEVUserData, setDATEVUserData] = useState({});

    const [DATEVClientsSearch, setDATEVClientsSearch] = useState([]);
    const [DATEVClientsSearchPage, setDATEVClientsSearchPage] = useState(1);
    const [DATEVClientsSearchLoading, setDATEVClientsSearchLoading] = useState(false);
    const [DATEVClientsSearchPages, setDATEVClientsSearchPages] = useState([]);

    const [DATEVClientsData, setDATEVClientsData] = useState([]);

    const [DATEVClientsError, setDATEVClientsError] = useState({});
    const [DATEVClientsTotal, setDATEVClientsTotal] = useState(0);
    const [DATEVClientsSkip, setDATEVClientsSkip] = useState(0);
    const [DATEVClientsTop, setDATEVClientsTop] = useState(maxDATEVClientsPerCall);

    const [DATEVClientTaxYearsLoading, setDATEVClientTaxYearsLoading] = useState("");

    const [IsClientManageModalOpended, setIsClientManageModalOpended] = useState(false);
    const [ClientManageModalClient, setClientManageModalClient] = useState({});

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
        //console.log("NATIVE_EVENT !!DATEVDUO!! DATEV_SMARTLOGIN_AVAILABLE", e, typeof e);

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
        //console.log("NATIVE_EVENT !!DATEVDUO!! DATEV_AuthState_Changed", e, typeof e);

        if(typeof e != 'boolean') {
          e = (e == "true")
        }

        // true ES false NO
        setIsDATEVLoggedIn(e);

        if(e) {
          readDATEVUserData().then((res) => {
            //console.log('RRRRRRRRRRRRRRRES', res)
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
        //console.log("NATIVE_EVENT !!DATEVDUO!! DATEV_AuthState_Error", e, typeof e);

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
        //console.log("NATIVE_EVENT !!DATEVDUO!! DATEV_DATA_USERDATA", e, typeof e);
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

    // DATEV_DMS_CLIENTS
    useEffect(() => {
      try { DATEV_DMS_CLIENTS_Listener.remove() } catch(e) {}
      const emitter = Platform.OS === 'ios' ? new NativeEventEmitter(NativeModules.DATEVDMS) : DeviceEventEmitter
      const DATEV_DMS_CLIENTS_Listener = emitter.addListener('DATEV_DMS_CLIENTS', (e) => {
        //console.log("NATIVE_EVENT !!DATEVDUO!! DATEV_DMS_CLIENTS", e, typeof e);
        setDATEVClientsError({}); // reset

        setTimeout(() => {
          setDATEVClientsSearchLoading(false)
        }, 750);

        let result = JSON.parse(e);
        console.log("NATIVE_EVENT !!DATEV_DMS_CLIENTS!! result", JSON.stringify(result.data, null, 2));

        if(result.code == 201) {
          const resultData:object = Platform.OS === 'ios' ? result.data : JSON.parse(result.data)

          //saveDATEVUserData(resultData);

          setDATEVClientsTotal(resultData.total)
          if(DATEVClientsData.length == 0) {
            setDATEVClientsData(resultData.items)
          }
          setDATEVClientsSearch(resultData.items)

          let pageCount = Math.ceil(result.data.total/DATEVClientsTop);
          console.log('DATEV_DMS_CLIENTS pageCount', pageCount)
          let pages = [];

          for(let i=1;i<=pageCount;i++) {
            pages.push({
              page: i,
              skip: ((i-1)*DATEVClientsTop),
              top: DATEVClientsTop
            })
          }

          setDATEVClientsSearchPages(pages)
        } else {
          setDATEVClientsError(result.data);
          console.log('DATEV_DMS_CLIENTS httpCode -> ' + result.data.httpCode)
          console.log('DATEV_DMS_CLIENTS httpMessage -> ' + result.data.httpMessage)
          console.log('DATEV_DMS_CLIENTS detail -> ' + result.data.detail)
          console.log('DATEV_DMS_CLIENTS moreInformation -> ' + result.data.moreInformation)
        }
      });
      return () => DATEV_DMS_CLIENTS_Listener.remove(); // never forget to unsubscribe
    }, [DATEVClientsData]);

    const assignTaxYears = (clientID, years) => {
      console.log("assignTaxYears", clientID, JSON.stringify(years, null, 2));
      let newDataSet = DATEVClientsData.map((client) => {
        if(client.client_id == clientID) {
          client.tax_years = {
            available: years.tax_years.map((year) => {
              return {
                year: year,
                folders: []
              }
            }),
            additional: years.addable_tax_years
          }

          let date = new Date();
          let currentYear = date.getFullYear();

          let hasCurrentYear = client.tax_years.available.filter((year) => {
            return year.year == currentYear
          })[0];

          console.log("CHECK hasCurrentYear", currentYear);
          if(hasCurrentYear) {
            console.log("CHECK hasCurrentYear OK", hasCurrentYear);
            if(hasCurrentYear.folders.length == 0) {
              console.log("CHECK hasCurrentYear LOAD", client.client_id, currentYear);
              loadClientTaxYearFoldersData(client.client_id, currentYear)
            }
          }
        }

        return client;
      })

      setDATEVClientsData(newDataSet);
    }

    // DATEV_DMS_CLIENT_TAX_YEARS
    useEffect(() => {
      try { DATEV_DMS_CLIENT_TAX_YEARS_Listener.remove() } catch(e) {}
      const emitter = Platform.OS === 'ios' ? new NativeEventEmitter(NativeModules.DATEVDMS) : DeviceEventEmitter
      const DATEV_DMS_CLIENT_TAX_YEARS_Listener = emitter.addListener('DATEV_DMS_CLIENT_TAX_YEARS', (e) => {
        //console.log("NATIVE_EVENT !!DATEVDUO!! DATEV_DMS_CLIENT_TAX_YEARS", e, typeof e);

        let result = JSON.parse(e);
        //console.log("NATIVE_EVENT !!DATEV_DMS_CLIENT_TAX_YEARS!! result", JSON.stringify(result.data, null, 2));

        setTimeout(() => {
          setDATEVClientTaxYearsLoading("")
        }, 750);

        if(result.code == 201) {
          const resultData:object = Platform.OS === 'ios' ? result.data : JSON.parse(result.data)

          //console.log("NATIVE_EVENT !!DATEV_DMS_CLIENT_TAX_YEARS!! DATEVClientsData", JSON.stringify(DATEVClientsData, null, 2));


          setTimeout(() => {
            assignTaxYears(resultData.client, resultData.years);
          }, 500)

          setTimeout(() => {
            //autoLoadClientsDocumentTypes(newDataSet)
          }, 500)
        }
      });
      return () => DATEV_DMS_CLIENT_TAX_YEARS_Listener.remove(); // never forget to unsubscribe
    }, [DATEVClientsData]);

    const assignTaxYearFolders = (clientID, year, folders) => {
      console.log("assignTaxYears", clientID, year, JSON.stringify(folders, null, 2));

      let newDataSet = DATEVClientsData.map((client) => {
        console.log("assignTaxYears", client.client_id, '==', clientID);
        if(client.client_id == clientID) {
          client.tax_years.available = client.tax_years.available.map((yr) => {
            console.log("assignTaxYears", yr.year, '==', year);
            if(yr.year == year) {
              yr.folders = folders
            }
            return yr
          })
        }

        return client;
      })

      setDATEVClientsData(newDataSet)
    }

    // DATEV_DMS_CLIENT_TAX_YEAR_FOLDERS
    useEffect(() => {
      try { DATEV_DMS_CLIENT_TAX_YEAR_FOLDERS_Listener.remove() } catch(e) {}
      const emitter = Platform.OS === 'ios' ? new NativeEventEmitter(NativeModules.DATEVDMS) : DeviceEventEmitter
      const DATEV_DMS_CLIENT_TAX_YEAR_FOLDERS_Listener = emitter.addListener('DATEV_DMS_CLIENT_TAX_YEAR_FOLDERS', (e) => {
        //console.log("NATIVE_EVENT !!DATEVDUO!! DATEV_DMS_CLIENT_TAX_YEAR_FOLDERS", e, typeof e);

        let result = JSON.parse(e);
        console.log("NATIVE_EVENT !!DATEV_DMS_CLIENT_TAX_YEAR_FOLDERS!! result", JSON.stringify(result.data, null, 2));

        setTimeout(() => {
          setDATEVClientTaxYearsLoading("")
        }, 750);

        if(result.code == 201) {
          const resultData:object = Platform.OS === 'ios' ? result.data : JSON.parse(result.data)

          //console.log("NATIVE_EVENT !!DATEV_DMS_CLIENT_TAX_YEAR_FOLDERS!! DATEVClientsData", JSON.stringify(DATEVClientsData, null, 2));

          assignTaxYearFolders(resultData.client, resultData.year, resultData.folders);

          setTimeout(() => {
            //autoLoadClientsDocumentTypes(newDataSet)
          }, 500)
        }
      });
      return () => DATEV_DMS_CLIENT_TAX_YEAR_FOLDERS_Listener.remove(); // never forget to unsubscribe
    }, [DATEVClientsData]);

    const isClientSelected = (client) => {
      //console.log('isClientSelected', client)

      try {
        let res = DATEVClientsData.filter((clnt) => {
          return clnt.client_id === client.client_id
        })[0];

        return res ? true : false;
      } catch(e) {
        console.log('err', e)
        return false;
      }
    }

    const deSelectDATEVClient = (client) => {
      //console.log('deSelectDATEVClient', client)

      try {
        let newClients = DATEVClientsData.filter((clnt) => {
          return clnt.client_id !== client.client_id
        });

        setDATEVClientsData(newClients)
      } catch(e) {
        console.log('err', e)
      }
    }

    const selectDATEVClient = (client) => {
      //console.log('selectDATEVClient', client)

      try {
        setDATEVClientsData(DATEVClientsData => [...DATEVClientsData, client]);
        //setDATEVClientsData(DATEVClientsData)
      } catch(e) {
        console.log('err', e)
      }
    }
    //setDATEVClientsData([])

    const joinDATEVClientTaxYears = (tax_years) => {
      return tax_years.available.map((tax_year) => {
        return tax_year.year;
      }).join(", ");
    };

    const openManageClientModal = (client) => {
      console.log('openManageClientModal')
      setIsClientManageModalOpended(true)
      setClientManageModalClient(client);
    }

    const closeClientManageModal = () => {
      console.log('closeClientManageModal')
      setClientManageModalClient({})
      setIsClientManageModalOpended(false)
    };

    const joinStr = (arr) => {
      return arr.join(", ")
    }

    return (
        <ScrollView style={[styles.safeView, { backgroundColor: background}]}>
            {!IsDATEVLoggedIn &&
              <View style={styles.content}>
                  <TextSnippet call="app-mytaxsettings-top-logout" />
                  <Button title="Jetzt bei der DATEV anmelden" onPress={() => doLogin() }></Button>
              </View>
            }

            {!IsDATEVSmartloginAvailable &&
              <View style={styles.content}>
                <CustomText fontType="italic" style={{ textAlign: "center", marginBottom: 10}}>{getSnippetPart('snippet', 'app-mytaxsettings-smartloginmissing', dataTextsnippets)}</CustomText>
                <Button title={Platform.OS == 'ios' ? 'Zum AppStore' : 'Zum PlayStore'} onPress={() => { openDATEVSmartloginAppStore() }}></Button>
              </View>
            }

            {IsDATEVLoggedIn &&
              <View style={styles.content}>
                <TextSnippet call="app-mytaxsettings-top-login" />
                <View style={{flexDirection: "row", marginBottom: 8}}>
                  <CustomText fontType="bold" style={{flexShrink: 1}}>Name</CustomText>
                  <CustomText fontType="regular" style={{flexGrow: 1, textAlign: "right"}}>{DATEVUserData.name}</CustomText>
                </View>
                <View style={{flexDirection: "row", marginBottom: 12}}>
                  <CustomText fontType="bold" style={{flexShrink: 1}}>E-Mail</CustomText>
                  <CustomText fontType="regular" style={{flexGrow: 1, textAlign: "right"}}>{DATEVUserData.email}</CustomText>
                </View>
                <Button style={{}} title="Abmelden" onPress={() => doLogout() }></Button>
              </View>
            }

            {IsDATEVLoggedIn &&
              <View style={styles.content}>
                <View style={{flexDirection: "row", alignItems: "center", marginBottom: 12, borderBottomColor: "#DDDDDD", borderBottomWidth: 1}}>
                  <CustomText textType="subheadline" style={{flexGrow: 1}}>Konten ({DATEVClientsData.length})</CustomText>
                  <TouchableOpacity style={{flexShrink: 1}} onPress={() => openManageClientsModal() }><CustomText fontType="regular" style={{}}>verwalten ({DATEVClientsTotal})</CustomText></TouchableOpacity>
                </View>
                { DATEVClientsError.httpCode &&
                  <View style={{marginBottom: 12}}>
                    <CustomText textType="bold" style={{color: "#fa2000", textAlign: "center"}}>{DATEVClientsError.title}</CustomText>
                    <CustomText textType="bold" style={{color: "#fa2000", textAlign: "center"}}>{DATEVClientsError.detail}</CustomText>
                  </View>
                }
                { DATEVClientsData.length == 0 &&
                  <View style={{flex: 1, flexDirection: "column"}}>
                    <CustomText textType="regular" style={{textAlign: "center"}}>Es wurden noch keine Konten geladen</CustomText>
                    <View style={{marginTop: 10}}>
                      <Button style={{}} title="Konten laden" onPress={() => loadClients('', 1, 0, 3) }></Button>
                    </View>
                  </View>
                }

                { DATEVClientsData.length > 0 &&
                  <View>
                    {DATEVClientsData.length > 0 &&
                      <View>
                        {DATEVClientsData.map((client, i) => (
                          <View key={i} style={{marginBottom: 24}}>
                            <View style={{flexDirection: "row", alignItems: "center"}}>
                              {DATEVClientTaxYearsLoading == client.client_id &&
                                <FontAwesome5
                                  name={'spinner'}
                                  size={18}
                                  color={localDataStyle.top_toolbar_icon_color}
                                  onPress={() => navigation.openDrawer()}
                                />
                              }
                              {DATEVClientTaxYearsLoading != client.client_id &&
                                <MaterialCommunityIcons
                                  name={'account-box'}
                                  size={18}
                                  color={localDataStyle.top_toolbar_icon_color}
                                  onPress={() => navigation.openDrawer()}
                                />
                              }
                              <CustomText fontType="bold" style={{flexGrow:1, marginLeft: 8}}>{client.client_name}</CustomText>
                              {client.tax_years &&
                                <TouchableOpacity style={{flexShrink: 1}} onPress={() => openManageClientModal(client) }><CustomText fontType="regular" style={{}}>Details</CustomText></TouchableOpacity>
                              }
                            </View>
                            {!client.tax_years &&
                              <View>
                                <Button style={{}} title="Veranlagungsjahre laden" onPress={() => loadClientTaxYearsData(client.client_id) }></Button>
                              </View>
                            }
                            {client.tax_years && client.tax_years.available.length == 0 &&
                              <View>
                                <CustomText fontType="medium" style={{}}>Es wurden keine Veranlagungsjahre gefunden</CustomText>
                                <Button style={{}} title="Veranlagungsjahre (erneut) laden" onPress={() => loadClientTaxYearsData(client.client_id) }></Button>
                              </View>
                            }
                            {client.tax_years && client.tax_years.available.length > 0 &&
                              <View style={{marginTop: 12}}>
                                {client.tax_years.available.map((tax_year, yearIndex) => (
                                  <View key={yearIndex} style={{marginBottom: 2, flexDirection: "row", alignItems: "center"}}>
                                    <CustomText fontType="medium" style={{flexShrink: 1}}>{tax_year.year}</CustomText>
                                    {!tax_year.folders.id &&
                                      <CustomText fontType="light" style={{marginLeft: 6, fontSize: 16, flex: 1}}>Keine Ordner für {tax_year.year} geladen</CustomText>
                                    }
                                    {tax_year.folders.id &&
                                      <CustomText fontType="light" style={{marginLeft: 6, fontSize: 16, flex: 1}}>{tax_year.folders.name}: {tax_year.folders.sub_folders.length} Ordner</CustomText>
                                    }

                                    {!tax_year.folders.id &&
                                      <TouchableOpacity style={{flexShrink: 1, textAlign: "right" }} onPress={() => loadClientTaxYearFoldersData(client.client_id, tax_year.year) }><CustomText fontType="bold" style={{ fontSize: 16 }}>Laden</CustomText></TouchableOpacity>
                                    }
                                    {tax_year.folders.id &&
                                      <TouchableOpacity style={{flexShrink: 1, textAlign: "right" }} onPress={() => loadClientTaxYearFoldersData(client.client_id, tax_year.year) }><CustomText fontType="bold" style={{ fontSize: 16 }}>Aktualisieren</CustomText></TouchableOpacity>
                                    }
                                  </View>
                                ))}
                                {/*<Text>{JSON.stringify(client.tax_years, null, 2)}</Text>*/}
                              </View>
                            }
                          </View>
                        ))}
                        {/*<View style={{marginTop: 10}}>
                          <Button style={{}} title={getDATEVClientsManageButtonLabel(DATEVClientsTotal)} onPress={() => openManageClientsModal() }></Button>
                        </View>*/}
                        <View style={{marginTop: 10}}>
                          <Button style={{}} title="Konten laden" onPress={() => loadClients('', 1, DATEVClientsSkip, DATEVClientsTop) }></Button>
                        </View>
                        <View style={{marginTop: 10}}>
                          <Button style={{}} title="Konten reset" onPress={() => setDATEVClientsData([]) }></Button>
                        </View>
                      </View>
                    }
                  </View>
                }
              </View>
            }

            {/*<Text>{JSON.stringify(DATEVClientsData, null, 2)}</Text>*/}


            {/* <Text>{JSON.stringify(downloads, null, 2)}</Text> */}

            {/* Bottom Spacer */}
            <Text> </Text>

            <Modal
              isVisible={ClientManageModalClient.client_id}
              onBackButtonPress={closeClientManageModal}
              onBackdropPress={closeClientManageModal}
              style={ styles.manageClientsModal }
            >
              <View style={ styles.manageClientsModalView }>
                <ScrollView style={ styles.manageClientsModalScrollView }>
                  <View style={{flexDirection: "row", alignItems: "center", marginBottom: 12, paddingBottom: 8, borderBottomColor: "#DDDDDD", borderBottomWidth: 1}}>
                    <MaterialCommunityIcons
                      name={'account-box'}
                      size={21}
                      color={localDataStyle.top_toolbar_icon_color}
                      onPress={() => navigation.openDrawer()}
                    />
                    <CustomText textType="headline" style={{flexGrow:1, marginLeft: 8, marginBottom: 1}}>{ClientManageModalClient.client_name}</CustomText>
                  </View>

                  {ClientManageModalClient.tax_years &&
                    <View>
                      {ClientManageModalClient.tax_years.available && ClientManageModalClient.tax_years.available.map((tax_year, i) => (
                        <View style={{marginBottom: 12}}>
                          <CustomText textType="subheadline" style={{ }}>{tax_year.year}</CustomText>
                          {!tax_year.folders.id &&
                            <CustomText textType="light" style={{ }}>Keine Ordner für {tax_year.year}</CustomText>
                          }
                          {tax_year.folders.id &&
                            <View style={{marginBottom: 12}}>
                              <CustomText textType="bold" style={{ }}>{tax_year.folders.name}</CustomText>
                              {tax_year.folders.sub_folders && tax_year.folders.sub_folders.map((subFolder, subFolderIndex) => (
                                <View>
                                  <CustomText textType="bold" style={{ }}>{subFolder.name}</CustomText>

                                  {subFolder.sub_folders && subFolder.sub_folders.length > 0 &&
                                    <View style={{marginBottom: 12}}>
                                      {subFolder.sub_folders && subFolder.sub_folders.map((subSubFolder, subSubFolderIndex) => (
                                        <View>
                                          <CustomText textType="bold" style={{ marginLeft: 12 }}>{subSubFolder.name}</CustomText>
                                        </View>
                                      ))}
                                    </View>
                                  }

                                </View>
                              ))}
                            </View>
                          }
                        </View>
                      ))}
                      {ClientManageModalClient.tax_years.additional && ClientManageModalClient.tax_years.additional.length > 0 &&
                        <View style={{marginTop: 12}}>
                          <CustomText fontType="bold" style={{ }}>Verfügbare, nicht freigeschaltete Veranlagungsjahre</CustomText>
                          <CustomText textType="light" style={{ marginTop: 6}}>{joinStr(ClientManageModalClient.tax_years.additional)}</CustomText>
                        </View>
                      }
                    </View>
                  }
                  <Text> </Text>
                  <Text> </Text>
                  <Text> </Text>
                  {/*<Text>{JSON.stringify(ClientManageModalClient, null, 2)}</Text>*/}
                </ScrollView>

                {localSettings.colors &&
                  <TouchableOpacity onPress={closeClientManageModal} style={[styles.manageClientsModalSave, {backgroundColor: localSettings.colors.background_hex}] }>
                    <CustomText textType="subheadline" style={{ color: localSettings.colors.textcolor_hex}}>übernehmen</CustomText>
                  </TouchableOpacity>
                }
              </View>
            </Modal>

            <Modal
              isVisible={DATEVClientsManageModal}
              onBackButtonPress={closeManageClientsModal}
              onBackdropPress={closeManageClientsModal}
              style={ styles.manageClientsModal }
            >
              <View style={ styles.manageClientsModalView }>
                <ScrollView style={ styles.manageClientsModalScrollView }>
                  <View>
                    <View style={{flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                      { DATEVClientsSearchLoading && <ActivityIndicator size={'small'} /> }
                      <CustomText textType="subheadline" style={{paddingLeft: 10}}>
                        Meine Steuern Konten
                      </CustomText>
                    </View>
                    <CustomText fontType="light" style={{fontSize: 16}}>Es wurden insgesamt {DATEVClientsTotal} Konten gefunden. Es werden {DATEVClientsTop} pro Seite angezeigt.</CustomText>

                    <View style={{flex: 1, marginTop: 12}}>
                      {DATEVClientsSearch.map((client, i) => (
                        <View key={i} style={{flex: 1, flexDirection: "row", marginBottom: 12, alignItems: "center"}}>
                          {DATEVClientsSearchLoading &&
                            <Skeleton abination={'wave'} width="100%" height={25} />
                          }
                          {!DATEVClientsSearchLoading &&
                            <View style={{flexGrow: 1}}>
                              <CustomText fontType="regular" style={{flexShrink: 1, marginRight: 8}}>{client.client_name}</CustomText>
                              <CustomText fontType="light" style={{ fontSize: 14}}>{client.client_id}</CustomText>
                            </View>
                          }
                          {isClientSelected(client) &&
                            <TouchableOpacity onPress={() => { deSelectDATEVClient(client); }}>
                              <CustomText fontType="light" style={{flexShrink: 1, marginLeft: 6}}>abwählen</CustomText>
                            </TouchableOpacity>
                          }
                          {!isClientSelected(client) &&
                            <TouchableOpacity onPress={() => { selectDATEVClient(client); }}>
                              <CustomText fontType="light" style={{flexShrink: 1, marginLeft: 6}}>übernehmen</CustomText>
                            </TouchableOpacity>
                          }
                        </View>
                      ))}
                    </View>

                    {/*<Text>{DATEVClientsSearchPage}</Text>
                    <Text>{JSON.stringify(DATEVClientsSearchPages, null, 2)}</Text>
                    <Text>{DATEVClientsTotal}</Text>
                    <Text>{maxDATEVClientsPerCall}</Text>*/}
                  </View>
                  {/*<Text>DATEVClientsSearch</Text>
                  <Text>{JSON.stringify(DATEVClientsSearch, null, 2)}</Text>
                  <Text>{"\n"}DATEVClientsData</Text>
                  <Text>{JSON.stringify(DATEVClientsData, null, 2)}</Text>*/}
                </ScrollView>

                <View style={{flexDirection: "row", flexWrap: "wrap", justifyContent: "space-around", alignItems: "center", marginBottom: 6}}>
                  { DATEVClientsSearchPages.length > 1 && DATEVClientsSearchPages.map((page, i) => (
                    <View key={i} style={{flex: 1}}>
                      {DATEVClientsSearchPage == page.page &&
                        <TouchableOpacity onPress={() => loadClients('', page.page, page.skip, DATEVClientsTop)} style={{borderRadius: 4, backgroundColor: localSettings.colors.background_hex, justifyContent: "center", alignItems: "center", marginTop: 12}}>
                          <CustomText style={{color: localSettings.colors.textcolor_hex}} fontType="bold">{page.page}</CustomText>
                        </TouchableOpacity>
                      }
                      {DATEVClientsSearchPage != page.page &&
                        <TouchableOpacity onPress={() => loadClients('', page.page, page.skip, DATEVClientsTop)} style={{borderRadius: 4, backgroundColor: localSettings.colors.textcolor_hex, justifyContent: "center", alignItems: "center", color: localSettings.colors.background_hex, padding: 12}}>
                          <CustomText style={{}} fontType="medium">{page.page}</CustomText>
                        </TouchableOpacity>
                      }
                    </View>
                  ))}
                </View>

                {localSettings.colors &&
                  <TouchableOpacity onPress={closeManageClientsModal} style={[styles.manageClientsModalSave, {backgroundColor: localSettings.colors.background_hex}] }>
                    <CustomText textType="subheadline" style={{ color: localSettings.colors.textcolor_hex}}>übernehmen</CustomText>
                  </TouchableOpacity>
                }
              </View>
            </Modal>

        </ScrollView>
    );
}

/*

app-dcalsettings-smartloginmissing
app-dcalsettings-top-logout
*/


const styles = StyleSheet.create({
    safeView: {
      flex: 1,
      paddingTop: 12
    },
    content: {
      padding: 12
    },
    list: {
      flexDirection: "row"
    },
    listKey: {

    },
    listValue: {
      flex: 1,
      textAlign: "right"
    },
    manageClientsModal: {
      position: "relative",
      marginTop: 60,
      marginBottom: 40
    },
    manageClientsModalView: {
      flex: 1,
      backgroundColor: "#FFFFFF",
      borderRadius: 12
    },
    manageClientsModalScrollView: {
      flex: 1,
      flexDirection: "column",
      padding: 12
    },
    manageClientsModalSave: {
      flexShrink:1,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      borderBottomRightRadius: 12,
      borderBottomLeftRadius: 12,
      padding: 6,
      paddingTop: 12
    }
});


export default DATEVDMSScreen;
