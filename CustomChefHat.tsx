
import React from 'react';

interface CustomChefHatProps {
  size?: number;
  className?: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
}

export const CustomChefHat: React.FC<CustomChefHatProps> = ({ 
  size = 24, 
  className = "", 
  stroke = "white"
}) => {
  // Direct link to the user's provided logo image
  const imageUrl = "https://i.postimg.cc/nLrjkD57/Gemini-Generated-Image-svvvh0svvvh0svvv-removebg-preview.png";

  return (
    <div 
      className={className}
      style={{
        width: size,
        height: size,
        display: 'inline-block',
        backgroundColor: stroke === 'none' ? 'transparent' : stroke,
        maskImage: `url(${imageUrl})`,
        maskSize: 'contain',
        maskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskImage: `url(${imageUrl})`,
        WebkitMaskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
      }}
      role="img"
      aria-label="Chef Hat Logo"
    />
  );
};

export default CustomChefHat;
