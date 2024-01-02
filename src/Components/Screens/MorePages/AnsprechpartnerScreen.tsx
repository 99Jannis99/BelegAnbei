import React, { useState, useEffect } from "react";
import { ActivityIndicator, Text, View, SafeAreaView, StyleSheet, TouchableOpacity, ScrollView, Linking } from "react-native";
import { useSelector } from "react-redux";

import TextSnippet from "../../shared/TextSnippets";
import Header from "../../shared/Header";
import { ListItem, Avatar, Icon } from "@rneui/themed";
import { BackgroundImage, Image } from "@rneui/base";
import Modal from "react-native-modal";
import CustomText from "../../shared/CustomText";
import { textFontFamily, textFontSize } from "../../../../data/CustomerConstants";
import Contacts from "react-native-contacts";

function AnsprechpartnerScreen() {
    const { background } = useSelector((state) => state.colorReducer);
    const {
        dataSettings,
        dataLocations,
        dataPersons
    } = useSelector((state) => state.dataReducer);

    const [settings, setSettings] = useState([]);

    const [localDataPersons, setLocalDataPersons] = useState([]);
    const [locations, setLocations] = useState([]);

    const [selectedDetailPerson, setSelectedDetailPerson] = useState(0);

    useEffect(() => {
        setTimeout(() => {
            const newSettings = JSON.parse(dataSettings);
            const newLocations = JSON.parse(dataLocations);
        
            setSettings(newSettings);
            setLocations(newLocations);
        })

        setTimeout(() => {
            let persons = JSON.parse(dataPersons);
            persons = persons.filter(function(person) {
                return person.person_show.atall && person.person_is_person && person.person_active
            });
        
            setLocalDataPersons(persons);
        }, 250)
    }, [dataPersons]);

    const Item = ({person}) => (
        <View style={styles.item}>
            <ListItem key={person.person_id} bottomDivider onPress={() => {  }}>
                {person.person_photo &&
                    <Avatar rounded source={{uri: person.person_photo }} />
                }
                <ListItem.Content>
                    <ListItem.Title>{person.person_name}</ListItem.Title>
                    {person.person_show.phone &&
                        <ListItem.Subtitle>{person.person_phone.display}</ListItem.Subtitle>
                    }
                </ListItem.Content>
            </ListItem>
        </View>
    );

    const personModal = (personID: React.SetStateAction<number>) => {

        try {
            let persons = localDataPersons.map((person) => {
                if(!person.location) {
                    person.location = locations.filter((location) => {
                        return location.location_id == person.location_id
                    })[0];
                }
                return person;
            });
            setLocalDataPersons(persons);
        } catch(e) {
            //
        }

       setSelectedDetailPerson(personID)
    };

    const toggleModal = () => {
        setSelectedDetailPerson(0)
    };
    
    const saveToContacts = () => {
        console.log('saveToContacts', selectedDetailPerson)

        execToContacts();
    };

    const execToContacts = () => {
        console.log('execToContacts', selectedDetailPerson)

        try {
            let person = localDataPersons.filter((person) => {
                return person.person_id == selectedDetailPerson
            })[0];

            if(person) {
                console.log('person ADD --> EXECUTE TODO', person.person_name)
            }
        } catch(e) {
            console.log('person ADD --> NOT FOUND', selectedDetailPerson)
        }
    };
    
    return (
        <SafeAreaView style={[styles.moreSafeView, { backgroundColor: background }]}>
            <Header></Header>

            {/* <View style={styles.moreContent}>
                <TextSnippet call="more-persons-top" />
                <FlatList
                    data={localDataPersons}
                    renderItem={({item}) => <Item person={item} />}
                    keyExtractor={item => item.person_id}
                />
            </View> */}

            <ScrollView>
                <View style={styles.moreContent}>
                    <TextSnippet call="more-persons-top" />
                    { localDataPersons.length == 0 && <ActivityIndicator size={'large'} /> }

                    <View>
                    {
                        localDataPersons.map((person, i) => (
                        <ListItem key={i} bottomDivider onPress={() => personModal(settings.ansprechpartner.enabled ? person.person_id : 0)}>
                            {/* ListView */}
                            {person.person_photo &&
                                <Avatar rounded source={{uri: person.person_photo }} />
                            }
                            <ListItem.Content>
                                <ListItem.Title style={{fontWeight: "bold"}}>{person.person_name}</ListItem.Title>
                                {person.person_show.phone && person.person_phone.display && 
                                    <ListItem.Subtitle style={{marginTop: 4}}>{person.person_phone.display}</ListItem.Subtitle>
                                }
                            </ListItem.Content>
                            {/* DetailView */}
                            <Modal 
                                isVisible={person.person_id === selectedDetailPerson}
                                onBackButtonPress={toggleModal}
                                onBackdropPress={toggleModal}
                                style={ styles.detailModal }
                            >
                                <View style={ styles.detailModalView }>
                                    {person.person_photo && 
                                        <View style={{borderTopRightRadius: 12, height: 420, borderTopLeftRadius: 12, overflow: "hidden", borderWidth: 1, borderColor: "#FFFFFF", }}>
                                            <BackgroundImage style={ styles.detailModalViewImage } resizeMode="cover" source={{ uri: person.person_photo }}></BackgroundImage>
                                        </View>
                                    }
                                    <View style={[styles.detailModalClose, {backgroundColor: settings.colors.background_hex}] }>
                                        <Image 
                                        onPress={toggleModal} 
                                        style={ {width:36, height: 36} }
                                        source={require("../../../../assets/images/icon_cancel.png")}
                                        />
                                    </View>
                                    {settings.add_to_phone.person && 
                                        <View style={[styles.detailModalSave, {backgroundColor: settings.colors.background_hex}] }>
                                            <Image 
                                            onPress={saveToContacts} 
                                            style={ {width:30, height: 30} }
                                            source={require("../../../../assets/images/icon_save.png")}
                                            />
                                        </View>
                                    }
                                    <ScrollView style={ styles.detailModalScrollView }>
                                        <CustomText textType="headline" style={{}}>{person.person_name}</CustomText>
                                        {person.person_position_title && 
                                            <CustomText style={{marginBottom: 12}}>{person.person_position_title}</CustomText>
                                        }
                                        {person.person_email && person.person_show.email && 
                                            <View style={ styles.detailModalViewRow }>
                                                <Icon
                                                    name="envelope"
                                                    size={textFontSize}
                                                    style={[styles.detailModalViewRowIcon, { aspectRatio: 1 }]}
                                                    allowFontScaling
                                                    type="font-awesome"
                                                />
                                                
                                                <TouchableOpacity style={styles.detailModalViewRowText} onPress={() => Linking.openURL(`mailto:${person.person_email}`)}>
                                                    <CustomText style={{fontSize: textFontSize}}>{person.person_email}</CustomText>
                                                </TouchableOpacity>
                                            </View>
                                        }
                                        {person.person_phone.dial && person.person_show.phone && 
                                            <View style={ styles.detailModalViewRow }>
                                                <Icon
                                                    name="phone"
                                                    size={textFontSize}
                                                    style={[styles.detailModalViewRowIcon, { aspectRatio: 1 }]}
                                                    allowFontScaling
                                                    type="font-awesome"
                                                />
                                                
                                                <TouchableOpacity style={ styles.detailModalViewRowText } onPress={() => Linking.openURL(`tel:${person.person_phone.dial}`)}>
                                                    <CustomText style={{fontSize: textFontSize}}>{person.person_phone.display}</CustomText>
                                                </TouchableOpacity>
                                            </View>
                                        }
                                        {person.person_fax.dial && person.person_show.fax && 
                                            <View style={ styles.detailModalViewRow }>
                                                <Icon
                                                    name="fax"
                                                    size={textFontSize}
                                                    style={[styles.detailModalViewRowIcon, { aspectRatio: 1 }]}
                                                    allowFontScaling
                                                    type="font-awesome"
                                                />
                                                <CustomText style={[styles.detailModalViewRowText, {fontSize: textFontSize}]}>{person.person_fax.display}</CustomText>
                                            </View>
                                        }
                                        {person.person_cell.dial && person.person_show.cell && 
                                            <View style={ styles.detailModalViewRow }>
                                                <Icon
                                                    name="mobile"
                                                    size={textFontSize}
                                                    style={[styles.detailModalViewRowIcon, { aspectRatio: 1 }]}
                                                    allowFontScaling
                                                    type="font-awesome"
                                                />
                                                
                                                <TouchableOpacity style={ styles.detailModalViewRowText } onPress={() => Linking.openURL(`tel:${person.person_cell.dial}`)}>
                                                    <CustomText style={{fontSize: textFontSize}}>{person.person_cell.display}</CustomText>
                                                </TouchableOpacity>
                                            </View>
                                        }
                                       
                                        {person.location && 
                                            <View style={ styles.detailModalViewRow }>
                                                <Icon
                                                    name="home"
                                                    size={textFontSize}
                                                    style={[styles.detailModalViewRowIcon, { aspectRatio: 1 }]} 
                                                    color="#ffffff"
                                                    allowFontScaling
                                                    type="font-awesome"
                                                />
                                                <View style={ styles.detailModalViewCol }>
                                                    <CustomText style={[styles.detailModalViewColText, {fontSize: textFontSize}]}>
                                                        {person.location.location_display_name}
                                                        {"\n"}
                                                        {person.location.location_address}
                                                        {"\n"}
                                                        {person.location.location_zip} {person.location.location_city}
                                                    </CustomText>
                                                </View>
                                            </View>
                                        }
                           

                                        <CustomText style={{}}>{person.person_text}</CustomText>
                                        <Text style={{}}> </Text>
                                        <Text style={{}}> </Text>
                                    </ScrollView>
                                </View>
                            </Modal>
                            </ListItem>
                        ))
                    }
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    moreSafeView: {
        flex: 1
    },
    moreContent: {
        marginTop: 12,
        marginBottom: 12,
        marginLeft: 12,
        marginRight: 12,
        textAlign: "center"
    },
    detailModal: {
      position: "relative"
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
      top: 400,
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
        marginBottom: 12
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
        flexShrink: 1,
        padding: 0,
        margin: 0
    },
    detailModalViewRowText: {
        flexGrow: 1,
        flex: 1,
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
        flex: 1,
        justifyContent: 'center',
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

export default AnsprechpartnerScreen;
