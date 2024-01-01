import React, { useState, useEffect, FunctionComponent } from "react";
import {
  StyleSheet,
  Text,
  TextStyle,
  useWindowDimensions
} from 'react-native'
import { useSelector, useDispatch } from "react-redux";

import RenderHtml, { defaultSystemFonts } from "react-native-render-html";
import { textFontSize, textFontFamily } from "../../../data/CustomerConstants";
const systemFonts = [...defaultSystemFonts, textFontFamily + '-Regular', textFontFamily + '-Bold'];

type CustomHTMLProps = {
    children?: any
    style?: TextStyle | TextStyle[]
    htmlContent?: String | ""
}

const MemoizedRenderHtml = React.memo(RenderHtml);

const CustomHTML: FunctionComponent<CustomHTMLProps> = ({ children, htmlContent, style }) => {
    const { dataStyle } = useSelector((state) => state.dataReducer);
    const [localDataStyle, setLocalDataStyle] = useState({});

    useEffect(() => {
      setLocalDataStyle(JSON.parse(dataStyle));
    }, [dataStyle]);

    let textStyle: {}
    
    const { width } = useWindowDimensions();
    const passedStyles = Array.isArray(style) ? Object.assign({}, ...style) : style

    
    return (
    <MemoizedRenderHtml
        contentWidth={width}
        baseStyle={{ fontSize: textFontSize, fontFamily: textFontFamily + '-Regular', color: localDataStyle.body_font_color }}
        tagsStyles={{ 
          p: {padding: 0, paddingBottom: 8, margin: 0, fontSize: textFontSize, fontFamily: textFontFamily + '-Regular'}
        }}
        classesStyles={{ 
          "bold": {fontFamily: textFontFamily + '-Bold'} 
        }}
        systemFonts={systemFonts}
        source={{
          html: htmlContent
        }}
      />
    )
}

const styles = StyleSheet.create({
   
})

export default CustomHTML