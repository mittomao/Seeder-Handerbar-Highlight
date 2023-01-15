import inArray from './helpers/inArray';
import and from './helpers/and';
import getJsonContext from './helpers/getJsonContext';
import getFile from './helpers/getFile';
import link from './helpers/link';
import mergeJson from './helpers/mergeJson';
import is from './helpers/is';
import isnt from './helpers/isnt';
import gt from './helpers/gt';
import lt from './helpers/lt';
import length from './helpers/length';
import json from './helpers/json';
import getImagePath from './helpers/getImagePath';
import getActiveIndex from './helpers/getActiveItem';
import getValign from './helpers/getValign';
import getAlign from './helpers/getAlign';
import getBackground from './helpers/getBackground';
import getMediaTextImageTheme from './helpers/getMediaTextImageTheme';
import getFullWidthBannerContentTheme from './helpers/getFullWidthBannerContentTheme';
import getDirection from './helpers/getDirection';
import getLayoutSpacing from './helpers/getLayoutSpacing';
import varToObject from './helpers/varToObject';
import forLoop from './helpers/forLoop';
import reorder from './helpers/reorder';
import or from './helpers/or';
import stringify from './helpers/stringify';
import loadData from './decorators/load-data';
import loadJson from './decorators/load-json';

export default {
  helpers: {
    inArray,
    and,
    getJsonContext,
    getFile,
    link,
    mergeJson,
    is,
    or,
    isnt,
    json,
    varToObject,
    gt,
    lt,
    length,
    getActiveIndex,
    getImagePath,
    getValign,
    getAlign,
    getBackground,
    getMediaTextImageTheme,
    getFullWidthBannerContentTheme,
    getDirection,
    forLoop,
    getLayoutSpacing,
    reorder,
    stringify,
  },
  decorators: {
    loadData,
    loadJson,
  },
};
