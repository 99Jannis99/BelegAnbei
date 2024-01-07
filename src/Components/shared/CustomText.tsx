import React, { useState, useEffect, FunctionComponent } from "react";
import {
  StyleSheet,
  Text,
  TextStyle
} from 'react-native'
import { useSelector, useDispatch } from "react-redux";

import { textFontFamily, textFontSize, headlineFontFamily, headlineFontSize, subHeadlineFontFamily, subheadlineFontSize } from "../../../data/CustomerConstants";

import { fontPixel } from "../shared/SizeNormalizer";

type CustomTextProps = {
    children?: any
    style?: TextStyle | TextStyle[]
    fontType?: 'regular' | 'bold' | 'light' | 'medium' | 'italic'
    textType?: 'headline' | 'subheadline' | 'text'
}

const CustomText: FunctionComponent<CustomTextProps> = ({ children, fontType, textType, style }) => {
    const { dataStyle } = useSelector((state) => state.dataReducer);
    const [localDataStyle, setLocalDataStyle] = useState({});

    useEffect(() => {
      setLocalDataStyle(JSON.parse(dataStyle));
    }, [dataStyle]);

    let textStyle: {}
    switch (fontType) {
        case 'regular':
            textStyle = styles.regular
        break
        case 'bold':
            textStyle = styles.bold
        break
        case 'light':
            textStyle = styles.light
        break
        case 'medium':
            textStyle = styles.medium
        break
        case 'italic':
            textStyle = styles.italic
        break
        default:
            textStyle = styles.regular
        break
    }

    const passedStyles = Array.isArray(style) ? Object.assign({}, ...style) : style

    switch (textType) {
        case 'headline':
            passedStyles.fontSize = fontPixel(headlineFontSize);
            textStyle = styles.headline

            if(!passedStyles.color) {
              passedStyles.color = localDataStyle.body_headline_color
            }
            if(!passedStyles.marginBottom && !passedStyles.margin) {
                passedStyles.marginBottom = 6;
            }
        break
        case 'subheadline':
            passedStyles.fontSize = fontPixel(subheadlineFontSize);
            textStyle = styles.subheadline

            if(!passedStyles.color) {
              passedStyles.color = localDataStyle.body_headline_color
            }
            if(!passedStyles.marginBottom && !passedStyles.margin) {
                passedStyles.marginBottom = 6;
            }
        break
        case 'text':
        default:
            if(!passedStyles.color) {
              passedStyles.color = localDataStyle.body_headline_color
            }
            if(!passedStyles.fontSize) {
                passedStyles.fontSize = fontPixel(textFontSize);
            }
        break
    }
    if(!passedStyles.textAlign) {
        passedStyles.textAlign = "left";
    }

    return (
        <Text style={[textStyle, { ...passedStyles } ]}>
            {children}
        </Text>
    )
}

const styles = StyleSheet.create({
    regular: {
        fontFamily: textFontFamily + '-Regular'
    },
    medium: {
        fontFamily: textFontFamily + '-Medium'
    },
    bold: {
        fontFamily: textFontFamily + '-Bold'
    },
    light: {
        fontFamily: textFontFamily + '-Light'
    },
    italic: {
        fontFamily: textFontFamily + '-Italic'
    },
    headline: {
        fontFamily: headlineFontFamily + '-Bold'
    },
    subheadline: {
        fontFamily: subHeadlineFontFamily + '-Medium'
    }
})

export default CustomText
