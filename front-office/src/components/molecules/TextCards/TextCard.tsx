import Link from 'next/link';
import React from 'react';

import { Typography } from '@/components/atoms/Typography';

export interface TextCardItem {
  title: string;
  description?: string;
  link?: string;
  variant?: 'blanc' | 'primary';
}

export const TextCard = ({ title, description, link, variant = 'blanc' }: TextCardItem) => {
  const createMarkup = (html: string) => ({ __html: html });
  return (
    <div className="flex-1 ">
      {variant === 'blanc' && (
        <div className="leading-[26px] bg-white px-5 pb-5 pt-10 md:min-h-[500px]">
          <Typography weight="extrabold" variant="h1" tag="h3" align="center">
            {title}
          </Typography>
          {description && (
            <Typography marginClassName="my-10">
              <span dangerouslySetInnerHTML={createMarkup(description)} />
            </Typography>
          )}
          {link && (
            <Link href={link}>
              <Typography underline color="primary">
                En savoir plus
              </Typography>
            </Link>
          )}
        </div>
      )}
      {variant === 'primary' && (
        <div className="leading-[26px] bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] to-gold from-gold/10 px-5 pb-5 pt-10 h-full">
          <Typography weight="extrabold" variant="h1" tag="h3" color="white" align="center">
            {title}
          </Typography>
          {description && (
            <Typography marginClassName="my-10" color="white">
              <span dangerouslySetInnerHTML={createMarkup(description)} />
            </Typography>
          )}

          {link && (
            <Link href={link}>
              <Typography color="white" underline>
                En savoir plus
              </Typography>
            </Link>
          )}
        </div>
      )}
    </div>
  );
};
