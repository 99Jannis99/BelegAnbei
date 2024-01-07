import React, { useState, useEffect, useRef, Fragment } from "react";
import { ActivityIndicator, Text, View, SafeAreaView, StyleSheet, ScrollView, Dimensions } from "react-native";
import { useSelector } from "react-redux";
import { ListItem, Avatar, Icon } from "@rneui/themed";

import TextSnippet from "../../shared/TextSnippets";
import Header from "../../shared/Header";

import Modal from "react-native-modal";
import MapView, {Marker, AnimatedRegion} from 'react-native-maps';
import { Image } from "@rneui/base";
import CustomText from "../../shared/CustomText";
import { textFontFamily, textFontSize } from "../../../../data/CustomerConstants";
import Contacts from "react-native-contacts";
import { widthPixel, heightPixel, fontPixel, pixelSizeVertical, pixelSizeHorizontal } from "../../shared/SizeNormalizer";

const {width, height} = Dimensions.get('window');

function LocationsScreen() {
    const { background } = useSelector((state) => state.colorReducer);

    /* iOS SafeArea */
      const { dataStyle } = useSelector((state) => state.dataReducer);
      // top
      // already in code
      // bottom
      const [localDataStyle, setLocalDataStyle] = useState({});
      useEffect(() => {
        setLocalDataStyle(JSON.parse(dataStyle));
      }, [dataStyle]);
    /* iOS SafeArea */

    const width = Dimensions.get('window').width;

    const mapRef = useRef(null);

    const {
        dataSettings,
        dataLocations
    } = useSelector((state) => state.dataReducer);

    const [settings, setSettings] = useState([]);
    const [locations, setLocations] = useState([]);

    const [centerCoords, setCenterCoords] = useState({});


    useEffect(() => {
        setTimeout(() => {
            const newSettings = JSON.parse(dataSettings);
            let newLocations = JSON.parse(dataLocations);
            newLocations = newLocations.filter(function(location) {
                return !location.location_has_only_people && !location.manno_triggered
            });

            setSettings(newSettings);
            setLocations(newLocations);
        }, 500)

    }, [dataSettings, dataLocations]);

    useEffect(() => {
        setTimeout(() => {
            let lats = locations.map((location) => {
                return location.location_lat;
            });

            let lons = locations.map((location) => {
                return location.location_lon;
            });

            let markerKeys = locations.map((location) => {
                return location.location_callname;
            });

            let averageLng = (Math.max(...lons) + Math.min(...lons)) / 2;
            averageLng = isNaN(averageLng) ? 0 : averageLng;
            let averageLat = (Math.max(...lats) + Math.min(...lats)) / 2;
            averageLat = isNaN(averageLat) ? 0 : averageLat;

            setCenterCoords({
                latitude: averageLat,
                longitude: averageLng,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            })

            mapRef?.current?.animateToRegion({
                latitude: averageLat,
                longitude: averageLng,
                latitudeDelta: 2,
                longitudeDelta: 4,
            }, 1000);

            mapRef?.current?.fitToSuppliedMarkers(markerKeys, {
                edgePadding: { top: 70, right: 70, bottom: 70, left: 70 },
            });
        }, 100)
    }, [locations]);


    const [selectedDetailLocation, setSelectedDetailLocation] = useState(0);

    const locationModal = (locationID: React.SetStateAction<number>) => {
        setSelectedDetailLocation(locationID)
    };

    const toggleModal = () => {
        setSelectedDetailLocation(0)
    };

    return (
      <Fragment>
        {settings.colors &&
          <SafeAreaView style={{ flex: 0, backgroundColor: settings.colors.statusbar_hex }} />
        }
        <SafeAreaView style={[styles.safeView, { backgroundColor: localDataStyle.bottom_toolbar_background_color }]}>
          <Header></Header>
          <MapView style={{width: width, height: width}} ref={mapRef} initialRegion={{
            latitude: 0,
            longitude:0,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}>
            {locations.map((location, i) => (
              <Marker.Animated
                key={location.location_callname}
                id={location.location_callname}
                title={location.location_display_name}
                coordinate={{
                  latitude: parseFloat(location.location_lat),
                  longitude: parseFloat(location.location_lon)
                }} />
              ))}
          </MapView>

          <ScrollView style={[styles.content, { backgroundColor: background }]}>
            <TextSnippet call="more-locations-top" />
            { locations.length == 0 && <ActivityIndicator size={'large'} /> }

            {
              locations.map((location, i) => (
                  <ListItem key={i} bottomDivider onPress={() => locationModal(settings.multiple_locations.enabled ? location.location_id : 0)}>
                      {location.location_logo &&
                          <Avatar rounded source={{uri: location.location_logo }} />
                      }
                      <ListItem.Content>
                          <ListItem.Title>{location.location_display_name}</ListItem.Title>
                          <ListItem.Subtitle>
                          {location.location_address}
                          {"\n"}
                          {location.location_zip} {location.location_city}
                          </ListItem.Subtitle>
                      </ListItem.Content>

                      <Modal
                      isVisible={location.location_id === selectedDetailLocation}
                      onBackButtonPress={toggleModal}
                      onBackdropPress={toggleModal}
                      style={ styles.detailModal }
                      >
                          <View style={ styles.detailModalView }>
                              {/* {location.location_logo &&
                               <Image style={ styles.detailModalViewImage } resizeMode="contain" source={{ uri: location.location_logo }}></Image>
                              } */}

                              <View style={{borderTopRightRadius: 12, borderTopLeftRadius: 12, overflow: "hidden", borderWidth: 1, borderColor: "#FFFFFF", }}>
                                  <MapView style={{width: "100%", borderRadius: 12, height: width}}
                                      initialRegion={{
                                          latitude: parseFloat(location.location_lat),
                                          longitude: parseFloat(location.location_lon),
                                          latitudeDelta: 0.0922,
                                          longitudeDelta: 0.0421,
                                      }}
                                  >
                                      <Marker.Animated
                                          key={location.location_id}
                                          title={location.location_display_name}
                                          coordinate={{
                                              latitude: parseFloat(location.location_lat),
                                              longitude: parseFloat(location.location_lon)
                                          }}
                                      />
                                  </MapView>
                              </View>
                              <View style={[styles.detailModalClose, {backgroundColor: settings.colors.background_hex}] }>
                                  <Image
                                  onPress={toggleModal}
                                  style={ {width:36, height: 36} }
                                  source={require("../../../../assets/images/icon_cancel.png")}
                                  />
                              </View>
                              {settings.add_to_phone.location &&
                                  <View style={[styles.detailModalSave, {backgroundColor: settings.colors.background_hex}] }>
                                      <Image
                                      style={ {width:30, height: 30} }
                                      source={require("../../../../assets/images/icon_save.png")}
                                      />
                                  </View>
                              }
                              <ScrollView style={ styles.detailModalScrollView }>
                                  <CustomText textType="headline" style={{}}>{location.location_display_name}</CustomText>

                                  <View style={ styles.detailModalViewCol }>
                                      <CustomText style={[styles.detailModalViewColText, {fontSize: fontPixel(textFontSize)}]}>
                                          {location.location_address}
                                          {"\n"}
                                          {location.location_zip} {location.location_city}
                                      </CustomText>
                                  </View>

                                  {location.location_email &&
                                  <View style={ styles.detailModalViewRow }>
                                      <Icon
                                          name="envelope"
                                          size={fontPixel(textFontSize)}
                                          style={[styles.detailModalViewRowIcon, { aspectRatio: 1 }]}
                                          allowFontScaling
                                          type="font-awesome"
                                      />
                                      <CustomText style={[styles.detailModalViewRowText, {fontSize: fontPixel(textFontSize)}]}>{location.location_email}</CustomText>
                                  </View>
                                  }

                                  {location.location_web &&
                                  <View style={ styles.detailModalViewRow }>
                                      <Icon
                                          name="link"
                                          size={fontPixel(textFontSize)}
                                          style={[styles.detailModalViewRowIcon, { aspectRatio: 1 }]}
                                          allowFontScaling
                                          type="font-awesome"
                                      />
                                      <CustomText style={[styles.detailModalViewRowText, {fontSize: fontPixel(textFontSize)}]}>{location.location_web}</CustomText>
                                  </View>
                                  }

                                  {location.location_phone.dial &&
                                      <View style={ styles.detailModalViewRow }>
                                          <Icon
                                              name="phone"
                                              size={fontPixel(textFontSize)}
                                              style={[styles.detailModalViewRowIcon, { aspectRatio: 1 }]}
                                              allowFontScaling
                                              type="font-awesome"
                                          />
                                          <CustomText style={[styles.detailModalViewRowText, {fontSize: fontPixel(textFontSize)}]}>{location.location_phone.display}</CustomText>
                                      </View>
                                  }
                                  {location.location_fax.dial &&
                                      <View style={ styles.detailModalViewRow }>
                                          <Icon
                                              name="fax"
                                              size={fontPixel(textFontSize)}
                                              style={[styles.detailModalViewRowIcon, { aspectRatio: 1 }]}
                                              allowFontScaling
                                              type="font-awesome"
                                          />
                                          <CustomText style={[styles.detailModalViewRowText, {fontSize: fontPixel(textFontSize)}]}>{location.location_fax.display}</CustomText>
                                      </View>
                                  }
                                  {location.location_cell.dial &&
                                      <View style={ styles.detailModalViewRow }>
                                          <Icon
                                              name="mobile"
                                              size={fontPixel(textFontSize)}
                                              style={[styles.detailModalViewRowIcon, { aspectRatio: 1 }]}
                                              allowFontScaling
                                              type="font-awesome"
                                          />
                                          <CustomText style={[styles.detailModalViewRowText, {fontSize: fontPixel(textFontSize)}]}>{location.location_cell.display}</CustomText>
                                      </View>
                                  }

                              </ScrollView>
                          </View>
                      </Modal>
                  </ListItem>
              ))
            }

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
        flex: 1,
        padding: 12
    },
    moreContent: {
        marginTop: 12,
        marginBottom: 12,
        marginLeft: 12,
        marginRight: 12,
        textAlign: "center"
    },
    detailModal: {
      position: "relative",
      marginTop: 50
    },
    detailModalClose: {
      position: "absolute",
      right: 12,
      top: 12,
      width: 42,
      height: 42,
      backgroundColor: "#333333",
      borderRadius: 21,
      borderColor: "#FA2000",
      justifyContent: "center",
      alignItems: "center"
    },
    detailModalSave: {
      position: "absolute",
      right: 12,
      top: 340,
      width: 42,
      height: 42,
      backgroundColor: "#333333",
      borderRadius: 21,
      borderColor: "#FA2000",
      justifyContent: "center",
      alignItems: "center"
    },
    detailModalView: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        borderRadius: 12
    },
    detailModalViewRow: {
        flex: 1,
        flexBasis: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 12,
        marginBottom: 12,
    },
    detailModalViewCol: {
        flex: 1,
        flexBasis: "100%",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        gap: 12,
        marginBottom: 12
    },
    detailModalViewRowIcon: {

    },
    detailModalViewRowText: {
        flexGrow: 1,
        paddingRight: 18,
        textAlign: "left",
    },
    detailModalViewColText: {
        flexBasis: "100%",
        textAlign: "left"
    },
    detailModalScrollView: {
        padding: 12,
        paddingBottom: 0,
    },
    detailModalViewImage: {
        width: "100%",
        height: 72,
        borderRadius: 12,
        borderBottomLeftRadius:0,
        borderBottomRightRadius:0
    },
    detailModalButton2 : {
        flex: 1,
    },
    detailModalButton : {
        borderBottomLeftRadius:12,
        borderBottomRightRadius:12,
        textAlign: "center",
        fontSize: 24
    }
});


export default LocationsScreen;
