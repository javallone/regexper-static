// Styles are in JS instead of CSS so they will be inlined as attributes
// instead of served as a CSS file. This is so styles are included in
// downloaded SVG files.

const green = '#bada55';
const brown = '#6b6659';
const tan = '#cbcbba';
const black = '#000';
const grey = '#908c83';
const white = '#fff';
const blue = '#dae9e5';

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
  textQuote: {
    fill: grey
  },
  infoText: {
    fontSize: fontSizeSmall,
    fontFamily: fontFamily,
    dominantBaseline: 'text-after-edge'
  },
  pin: {
    fill: brown,
    ...strokeBase
  },
  literalBox: {
    fill: blue,
    strokeWidth: '1px',
    stroke: black
  },
  escapeBox: {
    fill: green,
    strokeWidth: '1px',
    stroke: black
  },
  charClassBox: {
    fill: tan
  },
  captureBox: {
    fillOpacity: 0,
    ...strokeBase,
    stroke: grey,
    strokeDasharray: '6,2'
  },
  anchorBox: {
    fill: brown
  },
  anchorText: {
    fill: white
  }
};
