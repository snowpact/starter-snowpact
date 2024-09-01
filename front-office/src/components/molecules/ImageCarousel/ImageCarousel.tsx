import Image, { StaticImageData } from 'next/image';
import React, { useState } from 'react';

import clsxm from '@/utils/clsxm';

interface ImageCarouselProps {
  images: string[] | StaticImageData[];
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleImageClick = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="w-full px-5 md:px-0">
      <div className="relative w-full md:h-[550px] h-[250px]">
        {images.map((src, index) => (
          <div
            key={index}
            className={clsxm(
              'absolute md:mt-20 mt-8 inset-0 transition-opacity duration-500 flex justify-center',
              currentIndex === index ? 'opacity-100' : 'opacity-0'
            )}
          >
            <Image src={src} alt={`Image ${index + 1}`} width={800} height={550} className=" object-contain rounded-lg" />
          </div>
        ))}
      </div>
      <div className="flex justify-center md:mt-4">
        {images.map((_, index) => (
          <button
            key={`carousel-${index}`}
            className={`w-4 h-4 mx-2 rounded-sm ${currentIndex === index ? 'bg-gold outline outline-offset-2 outline-gray-300/50' : 'bg-gray-300'}`}
            onClick={() => handleImageClick(index)}
          />
        ))}
      </div>
    </div>
  );
};
