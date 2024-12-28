import Color from 'tinycolor2';

export const convertToAlpha = (color, alphas, format, valueParder) => {
  const parseColor = Color(color);
  return valueParder(parseColor.setAlpha(alphas)[format]()).toUpperCase();
}

export const isSize = ({ attributes }) =>
  (attributes.category === 'size' ||
    attributes.category === 'layout' ||
    attributes.category === 'spacing') &&
  attributes.type !== 'percent'

export const transforms = [
  {
    name: 'custom/name/snake',
    type: 'name',
    transform: (token, options) => [options.prefix].concat(token.path).join('_')
  }, {
    name: 'custom/size/pxToRem',
    type: 'value',
    filter: isSize,
    transform: ({value, attributes}) =>
      value.includes('%') || value.includes('auto') || attributes.type === 'columns' ? value : `${value / 16}rem`
  }, {
    name: 'custom/text/size',
    type: 'value',
    filter: ({ attributes }) => attributes.category === 'font' && attributes.type === 'size',
    transform: ({value}) => `clamp( ${(value * 0.75) / 16}rem, 1.25vw, ${value / 16}rem)`
  }, {
    name: 'custom/shadow',
    type: 'value',
    filter: ({ attributes }) => attributes.category === 'shadow',
    transform: ({value}) =>  value.split(' ').map((v) => `${v / 16}rem`).join(' ')
  }, {
    name: 'custom/size/percent',
    type: 'value',
    filter: ({ attributes }) => isSize && attributes.type === 'percent',
    transform: ({ value }) => value / 100
  }, {
    name: 'custom/motion/times',
    type: 'value',
    filter: ({ attributes }) =>  attributes.category === 'motion' && (attributes.type === 'time' || attributes.type === 'delay'),
    transform: ({ value }) => `${value}ms`
  }, {
    name: 'custom/motion/easing',
    type: 'value',
    filter: ({ attributes }) =>  attributes.category === 'motion' && attributes.type === 'easing',
    transform: ({ value }) => `cubic-bezier(${value})`
  }, {
    name: 'custom/motion/repeat',
    type: 'value',
    filter: ({ attributes }) =>  attributes.category === 'motion' && attributes.type === 'repeat',
    transform: ({ value }) => value !== '-1' ? value : 'infinite'
  }, {
    name: 'custom/opacity',
    type: 'value',
    filter: ({ attributes }) =>  attributes.category === 'opacity',
    transform: ({ value }) => value !== '0' && value !== '1' ? (value / 100).toFixed(2) : value
  }, {
    name: 'custom/text',
    type: 'value',
    filter: ({ attributes }) =>  attributes.category === 'font' && attributes.type === 'family' ,
    transform: ({ value }) => `"${value}"`
  }
];

export const defaultTransforms = ['attribute/cti', 'custom/name/snake', 'custom/opacity'];

export const transformGroups = [
  {
    name: 'customStatic',
    transforms: [...defaultTransforms, 'size/px', 'color/css']
  }, {
    name: 'customJs',
    transforms: [...defaultTransforms, 'custom/size/pxToRem', 'color/hex']
  }, {
    name: 'customCss',
    transforms: [
      ...defaultTransforms,
      'time/seconds',
      'custom/size/pxToRem',
      'custom/text/size',
      'custom/shadow',
      'custom/motion/times',
      'custom/motion/easing',
      'custom/motion/repeat',
      'custom/text'
    ]
  }
];