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

async function loadDATEVClientsData(skip, top) {
  console.log('loadDATEVClientsData', skip, top);
  let client_id = await ConfigProperties.prop('datev.client_id');
  let sandbox = await ConfigProperties.prop('datev.sandbox');
  if(Platform.OS !== 'ios') {
      sandbox = (sandbox === "true");
  }

  await DATEVDUO.clients(client_id, skip, top, sandbox)
}

async function loadDATEVClientDocumentTypesData(clientID) {
  console.log('loadDATEVClientDocumentTypesData', clientID);
  let client_id = await ConfigProperties.prop('datev.client_id');
  let sandbox = await ConfigProperties.prop('datev.sandbox');
  if(Platform.OS !== 'ios') {
      sandbox = (sandbox === "true");
  }

  await DATEVDUO.clientDocumentTypes(client_id, clientID, sandbox)
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

const maxDATEVClientsPerCall = 2;

const getDATEVClientsManageButtonLabel = (total) => {
  return "Konten ("+total+") verwalten";
}

function DATEVDUOScreen() {
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
      loadClients(1, 0, DATEVClientsTop)
      setDATEVClientsManageModal(true)
    };

    const closeManageClientsModal = () => {
      console.log('closeManageClientsModal')
      setDATEVClientsTop(maxDATEVClientsPerCall)
      setDATEVClientsManageModal(false)
    };

    const loadClients = async (page, skip, top) => {
      loadDATEVClientsData(skip, top);
      setDATEVClientsSearchPage(page)
      setDATEVClientsSearchLoading(true)
    };

    const loadClientDocumentTypesData = async (clientID) => {
      setDATEVClientDocumentTypesLoading(clientID)
      loadDATEVClientDocumentTypesData(clientID);
    };

    const joinDATEVClientCategories = (categories) => {
      return categories.map((category) => {
        return category.name;
      }).join(", ");
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

    const [DATEVClientDocumentTypesLoading, setDATEVClientDocumentTypesLoading] = useState("");

    const [DATEVClientsDocumentTypesAutoload, setDATEVClientsDocumentTypesAutoload] = useState(false);

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

    // DATEV_DUO_CLIENTS
    useEffect(() => {
      try { DATEV_DUO_CLIENTS_Listener.remove() } catch(e) {}
      const emitter = Platform.OS === 'ios' ? new NativeEventEmitter(NativeModules.DATEVDUO) : DeviceEventEmitter
      const DATEV_DUO_CLIENTS_Listener = emitter.addListener('DATEV_DUO_CLIENTS', (e) => {
        console.log("NATIVE_EVENT !!DATEVDUO!! DATEV_DUO_CLIENTS", e, typeof e);
        setDATEVClientsError({}); // reset

        setTimeout(() => {
          setDATEVClientsSearchLoading(false)
        }, 750);

        let result = JSON.parse(e);
        //console.log("NATIVE_EVENT !!DATEV_DUO_CLIENTS!! result", JSON.stringify(result.data, null, 2));

        if(result.code == 201) {
          const resultData:object = Platform.OS === 'ios' ? result.data : JSON.parse(result.data)

          //saveDATEVUserData(resultData);

          setDATEVClientsTotal(resultData.total)
          if(DATEVClientsData.length == 0) {
            setDATEVClientsData(resultData.items)
            //autoLoadClientsDocumentTypes(resultData.items)
          }
          setDATEVClientsSearch(resultData.items)

          let pageCount = Math.ceil(result.data.total/DATEVClientsTop);
          console.log('DATEV_DUO_CLIENTS pageCount', pageCount)
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
          console.log('DATEV_DUO_CLIENTS httpCode -> ' + result.data.httpCode)
          console.log('DATEV_DUO_CLIENTS httpMessage -> ' + result.data.httpMessage)
          console.log('DATEV_DUO_CLIENTS detail -> ' + result.data.detail)
          console.log('DATEV_DUO_CLIENTS moreInformation -> ' + result.data.moreInformation)
        }
      });
      return () => DATEV_DUO_CLIENTS_Listener.remove(); // never forget to unsubscribe
    }, [DATEVClientsData]);

    // DATEV_DUO_CLIENT_DOCUMENT_TYPES
    useEffect(() => {
      try { DATEV_DUO_CLIENT_DOCUMENT_TYPES_Listener.remove() } catch(e) {}
      const emitter = Platform.OS === 'ios' ? new NativeEventEmitter(NativeModules.DATEVDUO) : DeviceEventEmitter
      const DATEV_DUO_CLIENT_DOCUMENT_TYPES_Listener = emitter.addListener('DATEV_DUO_CLIENT_DOCUMENT_TYPES', (e) => {
        console.log("NATIVE_EVENT !!DATEVDUO!! DATEV_DUO_CLIENTS", e, typeof e);

        let result = JSON.parse(e);
        //console.log("NATIVE_EVENT !!DATEV_DUO_CLIENT_DOCUMENT_TYPES!! result", JSON.stringify(result.data, null, 2));

        setTimeout(() => {
          setDATEVClientDocumentTypesLoading("")
        }, 750);

        if(result.code == 201) {
          const resultData:object = Platform.OS === 'ios' ? result.data : JSON.parse(result.data)

          let newDataSet = DATEVClientsData.map((client) => {
            if(client.id == resultData.client) {
              client.categories = resultData.items;
            }

            return client;
          })

          setDATEVClientsData(newDataSet)

          setTimeout(() => {
            autoLoadClientsDocumentTypes(newDataSet)
          }, 500)
        }
      });
      return () => DATEV_DUO_CLIENT_DOCUMENT_TYPES_Listener.remove(); // never forget to unsubscribe
    }, [DATEVClientsData]);

    /*useEffect(() => {
      if(IsDATEVLoggedIn && DATEVClientsData.length == 0) {
        console.log('######## loadClients()')

        setTimeout(() => {
          loadClients(1, 0, 3)
        }, 1200)
      }
    }, []);*/

    const isClientSelected = (client) => {
      //console.log('isClientSelected', client)

      try {
        let res = DATEVClientsData.filter((clnt) => {
          return clnt.id === client.id
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
          return clnt.id !== client.id
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

    const autoLoadClientsDocumentTypes = (clients) => {
      let checkClientMissCategories = clients.filter((client) => {
        return !client.categories;
      })[0];

      if(checkClientMissCategories) {
        console.log('AAAAAAAAUTOLOADDDDDDDDDDDD checkClientMissCategories', checkClientMissCategories.id)
        loadDATEVClientDocumentTypesData(checkClientMissCategories.id)
      }
    }

    return (
        <ScrollView style={[styles.safeView, { backgroundColor: background}]}>
            {!IsDATEVLoggedIn &&
              <View style={styles.content}>
                  <TextSnippet call="app-dcalsettings-top-logout" />
                  <Button title="Jetzt bei der DATEV anmelden" onPress={() => doLogin() }></Button>
              </View>
            }

            {!IsDATEVSmartloginAvailable &&
              <View style={styles.content}>
                <CustomText fontType="italic" style={{ textAlign: "center", marginBottom: 10}}>{getSnippetPart('snippet', 'app-dcalsettings-smartloginmissing', dataTextsnippets)}</CustomText>
                <Button title={Platform.OS == 'ios' ? 'Zum AppStore' : 'Zum PlayStore'} onPress={() => { openDATEVSmartloginAppStore() }}></Button>
              </View>
            }

            {IsDATEVLoggedIn &&
              <View style={styles.content}>
                <TextSnippet call="app-dcalsettings-top-login" />
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
                  <CustomText textType="subheadline" style={{flexGrow: 1}}>DUO Konten ({DATEVClientsData.length})</CustomText>
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
                      <Button style={{}} title="Konten laden" onPress={() => loadClients(1, 0, 3) }></Button>
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
                            {DATEVClientDocumentTypesLoading == client.id &&
                              <FontAwesome5
                                name={'spinner'}
                                size={18}
                                color={localDataStyle.top_toolbar_icon_color}
                                onPress={() => navigation.openDrawer()}
                              />
                            }
                            {DATEVClientDocumentTypesLoading != client.id &&
                              <MaterialCommunityIcons
                                name={'account-box'}
                                size={18}
                                color={localDataStyle.top_toolbar_icon_color}
                                onPress={() => navigation.openDrawer()}
                              />
                            }
                              <CustomText fontType="bold" style={{marginLeft: 8}}>{client.name}</CustomText>
                            </View>
                            {!client.categories && DATEVClientDocumentTypesLoading != client.id &&
                              <View>
                                <Button style={{}} title="Ordner laden" onPress={() => loadClientDocumentTypesData(client.id) }></Button>
                              </View>
                            }
                            {client.categories && client.categories.length == 0 && DATEVClientDocumentTypesLoading != client.id &&
                              <View>
                                <CustomText fontType="medium" style={{}}>Es wurden keine Ordner gefunden</CustomText>
                                <Button style={{}} title="Ordner (erneut) laden" onPress={() => loadClientDocumentTypesData(client.id) }></Button>
                              </View>
                            }
                            {client.categories && client.categories.length > 0 &&
                              <View>
                                <CustomText fontType="light" style={{}}>{joinDATEVClientCategories(client.categories)}</CustomText>
                                <Button style={{}} title="Ordner aktualisieren" onPress={() => loadClientDocumentTypesData(client.id) }></Button>
                              </View>
                            }
                          </View>
                        ))}
                        {/*<View style={{marginTop: 10}}>
                          <Button style={{}} title={getDATEVClientsManageButtonLabel(DATEVClientsTotal)} onPress={() => openManageClientsModal() }></Button>
                        </View>*/}
                        <View style={{marginTop: 10}}>
                          <Button style={{}} title="Konten laden" onPress={() => loadClients(1, DATEVClientsSkip, DATEVClientsTop) }></Button>
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
                        DUO Konten
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
                              <CustomText fontType="regular" style={{flexShrink: 1, marginRight: 8}}>{client.name}</CustomText>
                              <CustomText fontType="light" style={{ fontSize: 14}}>{client.id}</CustomText>
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
                        <TouchableOpacity onPress={() => loadClients(page.page, page.skip, DATEVClientsTop)} style={{borderRadius: 4, backgroundColor: localSettings.colors.background_hex, justifyContent: "center", alignItems: "center", marginTop: 12}}>
                          <CustomText style={{color: localSettings.colors.textcolor_hex}} fontType="bold">{page.page}</CustomText>
                        </TouchableOpacity>
                      }
                      {DATEVClientsSearchPage != page.page &&
                        <TouchableOpacity onPress={() => loadClients(page.page, page.skip, DATEVClientsTop)} style={{borderRadius: 4, backgroundColor: localSettings.colors.textcolor_hex, justifyContent: "center", alignItems: "center", color: localSettings.colors.background_hex, padding: 12}}>
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


export default DATEVDUOScreen;
