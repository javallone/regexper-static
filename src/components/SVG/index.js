import React from 'react';

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

const renderChildren = children => {
  if (!children || children.length === 0) {
    return;
  }

  return children.length === 1 ?
    renderImage(children[0]) :
    children.map((node, i) => renderImage(node, { key: i }));
};

const renderImage = (node, extraProps = {}) => {
  if (typeof node === 'string') {
    return node;
  }

  const { type, props, children } = node;

  return React.createElement(nodeTypes[type], { ...extraProps, ...props }, renderChildren(children));
};

export default renderImage;
