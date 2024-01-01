import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, useWindowDimensions } from "react-native";
import { useSelector } from "react-redux";
import RenderHtml from "react-native-render-html";

import CustomText from './CustomText'

const TextSnippet = (props) => {
  const [textSnippets, setTextSnippets] = useState([]);
  const { dataTextsnippets } = useSelector((state) => state.dataReducer);
  const { width } = useWindowDimensions();
  const { container, customTextStyle } = styles

  const useSnippets = JSON.parse(dataTextsnippets);

  let neededSnippet = useSnippets.filter((snippet) => {
    return snippet.callname === props.call
  })[0]
  // console.log('------------------- neededSnippet', neededSnippet)

  return (
    <View>
      {neededSnippet && 
        <View style={ styles.container }>
          {neededSnippet.headline &&
            <CustomText textType="headline" style={[customTextStyle, {}]}>{ neededSnippet.headline }</CustomText>
          }
          {neededSnippet.subheadline &&
            <CustomText textType="subheadline" style={[customTextStyle, {}]}>{ neededSnippet.subheadline }</CustomText>
          }
          {neededSnippet.snippet &&
            <CustomText fontType="light" style={[customTextStyle, { marginLeft: 2, paddingRight: 1, marginBottom: 18 }]}>{neededSnippet.snippet}</CustomText>
          }
        </View>
    }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column"
  }
});

// Exportieren der Header-Komponente als Standard-Export
export default TextSnippet;
