import React from 'react';

import { TextCard, TextCardItem } from './TextCard';

type TextCardsVariant = 'blanc' | 'primary' | 'auto';
export interface TextCardProps {
  items: TextCardItem[];
  variant?: TextCardsVariant;
}

const getTextCardsVariant = (variant: TextCardsVariant, index: number) => {
  if (variant === 'auto') {
    return index === 1 ? 'primary' : 'blanc';
  } else {
    return variant;
  }
};

export const TextCards: React.FC<TextCardProps> = ({ items, variant = 'auto' }) => {
  return (
    <div className=" mb-4 flex place-content-center md:flex-row flex-col border border-gold/70 rounded-lg overflow-auto">
      {items.map((item, index) => {
        return (
          <TextCard
            key={item.title}
            title={item.title}
            link={item.link}
            description={item.description}
            variant={getTextCardsVariant(variant, index)}
          />
        );
      })}
    </div>
  );
};
