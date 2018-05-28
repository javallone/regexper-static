import React from 'react';
import PropTypes from 'prop-types';

import Box from './Box';
import HorizontalLayout from './HorizontalLayout';
import Image from './Image';
import Loop from './Loop';
import Pin from './Pin';
import Text from './Text';
import VerticalLayout from './VerticalLayout';

const nodeTypes = {
  Box,
  HorizontalLayout,
  Image,
  Loop,
  Pin,
  Text,
  VerticalLayout
};

const render = (data, extraProps) => {
  if (typeof data === 'string') {
    return data;
  }

  const { type, props } = data;
  const children = (data.children || []).map(
    (data, key) => render(data, { key }));

  return React.createElement(
    nodeTypes[type] || type,
    { ...extraProps, ...props },
    children.length === 1 ? children[0] : children);
};

const SVG = React.forwardRef(({ data }, ref) => render(data, { ref }));

SVG.propTypes = {
  data: PropTypes.shape({
    type: PropTypes.oneOf(Object.keys(nodeTypes)).isRequired,
    props: PropTypes.object,
    children: PropTypes.array
  }).isRequired
};

export default SVG;
