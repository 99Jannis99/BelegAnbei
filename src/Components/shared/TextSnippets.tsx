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

  const [useSnippet, setUseSnippet] = useState({});

  useEffect(() => {
    const useSnippets = JSON.parse(dataTextsnippets);

    let neededSnippet = useSnippets.filter((snippet) => {
      return snippet.callname === props.call
    })[0]
    //console.log('------------------- neededSnippet', neededSnippet)

    setUseSnippet(neededSnippet)
  }, []);

  return (
    <View>
      {useSnippet &&
        <View style={ styles.container }>
          {useSnippet.headline &&
            <CustomText textType="headline" style={[customTextStyle, {}]}>{ useSnippet.headline }</CustomText>
          }
          {useSnippet.subheadline &&
            <CustomText textType="subheadline" style={[customTextStyle, {}]}>{ useSnippet.subheadline }</CustomText>
          }
          {useSnippet.snippet &&
            <CustomText fontType="light" style={[customTextStyle, { marginLeft: 2, paddingRight: 1, marginBottom: 18 }]}>{useSnippet.snippet}</CustomText>
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
