import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const colorTheme = {
  blue: {
    primary: '#1646D9',
    secundary: '#5CA1FF',
  },
  red: {
    primary: '#CC0000',
    secundary: '#FF4C4C',
  },
  yellow: {
    primary: '#ffbf00',
    secundary: '#FFFF00',
  },
  orange: {
    primary: '#ff7700',
    secundary: '#ff8c00',
  },
  black: {
    primary: '#111111',
    secundary: '#333333',
  },
  green: {
    primary: '#008000',
    secundary: '#00b400',
  },
  purple: {
    primary: '#4b0082',
    secundary: '#9a009a',
  },
}

export const COLORS = (theme) => {
  return {
    primary: colorTheme[theme].primary,
    secundary: colorTheme[theme].secundary,

    black: '#000000',
    white: '#FFFFFF',
    background: '#FFFFFF' 
  }
}

export const SIZES = {
  base: 10,
  width,
  height
}

const theme = { COLORS, SIZES };

export default theme;