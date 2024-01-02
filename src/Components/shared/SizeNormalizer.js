import {
  Dimensions,
  PixelRatio 
} from 'react-native'

const { 
  width: SCREEN_WIDTH, 
  height: SCREEN_HEIGHT 
} = Dimensions.get('window');

//const widthBaseScale = SCREEN_WIDTH / 360; // width from Samsung Galaxy S21 FE (Basis Styling, adjusting based on that)
//const heightBaseScale = SCREEN_HEIGHT / 732; // height from Samsung Galaxy S21 FE (Basis Styling, adjusting based on that)

const widthBaseScale = SCREEN_WIDTH / 390; // iPhone 12
const heightBaseScale = SCREEN_HEIGHT / 844; // iPhone 12

function normalize(size, based = 'width') {
    const newSize = (based === 'height') ? 
                    size * heightBaseScale : size * widthBaseScale;
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

//for width  pixel
const widthPixel = (size) => {
    return normalize(size, 'width');
};

//for height  pixel
const heightPixel = (size) => {
    return normalize(size, 'height');
};

//for font  pixel
const fontPixel = (size) => {
    return heightPixel(size);
};

//for Margin and Padding vertical pixel
const pixelSizeVertical = (size) => {
    return heightPixel(size);
};

//for Margin and Padding horizontal pixel
const pixelSizeHorizontal = (size) => {
    return widthPixel(size);
};

export {
    widthPixel,
    heightPixel,
    fontPixel,
    pixelSizeVertical,
    pixelSizeHorizontal
};