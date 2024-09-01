import Image from 'next/image';
import React from 'react';

export interface Props {
  title: string;
  description: string;
  descriptionSecond?: string;
  icon: React.ReactNode;
}

export const ContactInfo: React.FC<Props> = ({ title, description, descriptionSecond, icon }) => {
  return (
    <div className="flex space-x-2 max-w-xl">
      <div className="flex">{icon}</div>
      <div>
        <h4 className="text-lg font-semibold text-black">{title}</h4>
        <p className="text-base font-normal text-gray-600">{description}</p>
        {descriptionSecond && <p className="text-base font-normal mt-2 text-gray-600">{descriptionSecond}</p>}
      </div>
    </div>
  );
};
