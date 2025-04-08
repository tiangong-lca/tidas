import React from 'react';
import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

/**
 * TidasImage component for displaying localized images with dark/light mode support
 * 
 * @param {string} filename - Image filename (with or without extension)
 * @param {string} [width] - Optional width override
 * @param {string} [height] - Optional height override 
 * @param {object} [style] - Optional additional styles
 * 
 * @example
 * // For SVG images (default):
 * <TidasImage filename="TIDAS" />
 * 
 * @example  
 * // For PNG images:
 * <TidasImage filename="TIDAS.png" />
 * 
 * @example
 * // With custom size:
 * <TidasImage filename="diagram.png" width="800px" height="400px" />
 */
const TidasImage = ({ filename, width, height, style }) => {
  const { i18n } = useDocusaurusContext();
  const currentLocale = i18n.currentLocale;
  
  // Extract base filename and extension
  const [baseName, ext] = filename.split('.');
  const extension = ext || 'svg'; // default to svg if no extension provided
  
  // Generate image paths
  const lightImage = useBaseUrl(`/img/${currentLocale}/${baseName}-${currentLocale}.${extension}`);
  const darkImage = useBaseUrl(`/img/${currentLocale}/${baseName}-${currentLocale}-dark.${extension}`);

  const sources = {
    light: lightImage,
    dark: darkImage
  };

  return (
    <ThemedImage
      sources={sources}
      alt={filename}
      style={{
        width: '1000px',  // default
        height: 'auto',  // default
        display:'block',
        margin: '0 auto',
        ...style,
      }}
    />
  );
};

export default TidasImage;
