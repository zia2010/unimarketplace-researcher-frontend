import React from 'react';

interface HeadingProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

const Heading: React.FC<HeadingProps> = ({ children, style }) => {
  return (
    <h1
      style={{
        fontFamily: 'Space Grotesk',
        color: '#041B4B',
        fontSize: '36px',
        fontWeight: 'bold',
        marginBottom: 0,
        ...style,
      }}
    >
      {children}
    </h1>
  );
};

export default Heading;
