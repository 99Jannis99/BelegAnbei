import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Text, useWindowDimensions } from "react-native";
import { useSelector } from "react-redux";
import RenderHtml from "react-native-render-html";

const TextSnippet = (props) => {
  const [textSnippets, setTextSnippets] = useState([]);
  const { dataTextsnippets } = useSelector((state) => state.dataReducer);
  const { width } = useWindowDimensions();

  const useSnippets = JSON.parse(dataTextsnippets);

  let neededSnippet = useSnippets.filter((snippet) => {
    return snippet.callname === props.call
  })[0]
  console.log('------------------- neededSnippet', neededSnippet)

  return (
      <View>
      {neededSnippet &&
        <TouchableOpacity style={ styles.container }>
          {neededSnippet.headline &&
            <Text style={ styles.headline }>{ neededSnippet.headline }</Text>
          }
          {neededSnippet.snippet &&
            <RenderHtml baseStyle={ styles.text } contentWidth={width} source={{ html: neededSnippet.snippet }} />
          }
        </TouchableOpacity>
      }
      </View>
  );
};

// Styling-Objekt für die Header-Komponente
const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    color: "#ffffff"
  },
  headline: {
    fontSize: 28
  },
  text: {
    marginBottom: 12,
    fontSize: 18
  },
});

// Exportieren der Header-Komponente als Standard-Export
export default TextSnippet;
