// StandardGroupImages.tsx
import React from "react";
import {
  View,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
  Dimensions,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { SimpleLineIcons } from "../../../helpers/icons";

const { width } = Dimensions.get("window");
const numColumns = 3;
const imageWidth = width / numColumns;
const imageHeight = (imageWidth * 16) / 9;
const margin = imageWidth * 0.04;

const GroupImagesScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { dataDocuments } = useSelector((state) => state.dataReducer);
  const { images, groupID } = route.params;

  const deleteImage = (imageIndex) => {
    // Erstellen einer Kopie des aktuellen Gruppenobjekts
    const groupData = { ...dataDocuments[groupID] };

    // Überprüfen, ob die Gruppe existiert und Bilder enthält
    if (groupData && groupData.images) {
      // Entfernen des Bildes an der angegebenen Position
      groupData.images.splice(imageIndex, 1);

      // Aktualisieren des Redux-Stores mit dem geänderten Gruppenobjekt
      dispatch({
        type: "SET_DATA_DOCUMENTS",
        payload: {
          ...dataDocuments,
          [groupID]: groupData,
        },
      });

      // Navigieren Sie zurück, wenn die Gruppe leer ist
      if (groupData.images.length === 0) {
        navigation.goBack();
      }
    }
  };

  const renderItem = ({ item, index }) => {
    return (
      <View style={styles.imageContainer}>
        <Image source={{ uri: item }} style={styles.image} />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.iconButton}>
            <SimpleLineIcons name="like" size={20} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <SimpleLineIcons name="question" size={20} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => deleteImage(index)}
          >
            <SimpleLineIcons name="trash" size={20} color="red" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <FlatList
      data={images}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      numColumns={numColumns}
      contentContainerStyle={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  list: {
    justifyContent: "center",
  },
  imageContainer: {
    width: imageWidth - margin,
    height: imageHeight - margin + 50, // Zusätzliche Höhe für den Button-Container
    marginHorizontal: margin / 2,
    marginVertical: margin / 2,
    alignItems: "center", // Zentrieren der Kinder horizontal
    justifyContent: "center", // Zentrieren der Kinder vertikal
    backgroundColor: "white",
    position: "relative", // Damit die Buttons absolut positioniert werden können
  },
  image: {
    width: "100%",
    height: "90%", // Höhe anpassen, um Platz für die Buttons zu schaffen
  },
  buttonContainer: {
    position: "absolute",
    bottom: 5,
    width: "95%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    margin: 0,
    padding: 2,
    borderRadius: 13,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  // iconButton: {
  //   alignItems: "center",
  //   justifyContent: "center",
  //   padding: 2,
  // },
});

export default GroupImagesScreen;
