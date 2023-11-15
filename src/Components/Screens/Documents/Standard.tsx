import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Text,
  Dimensions,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { SimpleLineIcons } from "../../../helpers/icons";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");
const numColumns = 3;
const imageWidth = width / numColumns;
const imageHeight = (imageWidth * 16) / 9;
const margin = imageWidth * 0.04;

const StandardDocuments = () => {
  const { dataDocuments } = useSelector((state) => state.dataReducer);
  const [imagePaths, setImagePaths] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    if (dataDocuments) {
      const groupIDs = Object.keys(dataDocuments);
      const groups = groupIDs.map((groupID) => ({ groupID }));
      setImagePaths(groups);
      setIsDataLoaded(groupIDs.length > 0);
    } else {
      setIsDataLoaded(false);
    }
  }, [dataDocuments]);

  const viewGroup = (groupID) => {
    const groupData = dataDocuments[groupID];
    if (groupData && groupData.images) {
      const imageUris = groupData.images.map(
        (image) =>
          `file:///data/user/0/com.meinprojekt/files/documents/${image}.jpg`
      );
      navigation.navigate("StandardGroupeImages", {
        images: imageUris,
        groupID,
      });
    }
  };

  const deleteGroup = (groupID) => {
    const updatedDocuments = { ...dataDocuments };
    delete updatedDocuments[groupID];
    dispatch({ type: "SET_DATA_DOCUMENTS", payload: updatedDocuments });
  };

  const renderItem = ({ item }) => {
    const groupData = dataDocuments[item.groupID];
    if (groupData && groupData.images && groupData.images.length > 0) {
      const firstImageUri = `file:///data/user/0/com.meinprojekt/files/documents/${groupData.images[0]}.jpg`;

      return (
        <TouchableOpacity onPress={() => viewGroup(item.groupID)}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: firstImageUri }} style={styles.image} />
            {groupData.images.length > 1 && (
              <View style={styles.imageCountContainer}>
                <Text style={styles.imageCountText}>
                  {groupData.images.length}
                </Text>
              </View>
            )}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.iconButton}>
                <SimpleLineIcons name="like" size={20} color="black" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <SimpleLineIcons name="question" size={20} color="black" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => deleteGroup(item.groupID)}
              >
                <SimpleLineIcons name="trash" size={20} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      );
    } else {
      return (
        <View style={styles.imageContainer}>
          <Text>Bild nicht verfügbar</Text>
        </View>
      );
    }
  };

  if (!isDataLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Lädt...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={imagePaths}
        renderItem={renderItem}
        keyExtractor={(item) => item.groupID}
        numColumns={numColumns}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  imageContainer: {
    width: imageWidth - margin,
    height: imageHeight - margin,
    marginHorizontal: margin / 2,
    marginVertical: margin / 2,
    alignItems: "center",
    justifyContent: "center",
    position: "relative", // Damit die Zähl-View absolut positioniert werden kann
  },
  imageCountContainer: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 6,
    padding: 5,
  },
  imageCountText: {
    color: "white",
    fontSize: 14,
  },
});

export default StandardDocuments;
