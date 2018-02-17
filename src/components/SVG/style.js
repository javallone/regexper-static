// Styles are in JS instead of CSS so they will be inlined as attributes
// instead of served as a CSS file. This is so styles are included in
// downloaded SVG files.

//const green = '#bada55';
const brown = '#6b6659';
//const tan = '#cbcbba';
const black = '#000';
const white = '#fff';
//const red = '#b3151a';
//const orange = '#fa0';

const fontFamily = 'Arial';
const fontSize = '16px';
const fontSizeSmall = '12px';

const strokeBase = {
  strokeWidth: '2px',
  stroke: black
};

export default {
  image: {
    backgroundColor: white
  },
  connectors: {
    fillOpacity: 0,
    ...strokeBase
  },
  text: {
    fontSize: fontSize,
    fontFamily: fontFamily
  },
  infoText: {
    fontSize: fontSizeSmall,
    fontFamily: fontFamily,
    dominantBaseline: 'text-after-edge'
  },
  pin: {
    fill: brown,
    ...strokeBase
  }
};
