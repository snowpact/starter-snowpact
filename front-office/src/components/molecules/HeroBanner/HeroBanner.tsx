import React from 'react';

import { Typography } from '@/components/atoms/Typography';

export interface Props {
  title: string;
}

export const HeroBanner: React.FC<Props> = ({ title }) => {
  return (
    <div className="h-[230px] md:mt-0 mt-16 md:h-[320px] px-5 text-center items-center flex justify-center rounded-b-xl w-full bg-black/40">
      <Typography variant="heroTitleXL">{title}</Typography>
    </div>
  );
};
