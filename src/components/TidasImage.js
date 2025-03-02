import React from 'react';
import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

const TidasImage = ({ filename, width, height, style }) => {
  const { i18n } = useDocusaurusContext();
  const currentLocale = i18n.currentLocale;
  
  // Automatic generation of image paths based on language and filename
  const lightImage = useBaseUrl(`/img/${currentLocale}/${filename}-${currentLocale}.svg`);
  const darkImage = useBaseUrl(`/img/${currentLocale}/${filename}-${currentLocale}-dark.svg`);

  return (
    <ThemedImage
      sources={{
        light: lightImage,
        dark: darkImage,
      }}
      alt={filename}
      style={{
        width: '1000px',  // default
        height: '600px',  // default
        position: 'relative',
        margin: '0 auto',
        ...style,
      }}
    />
  );
};

export default TidasImage;
