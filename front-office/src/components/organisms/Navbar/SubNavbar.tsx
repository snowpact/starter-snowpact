import React, { forwardRef } from 'react';
import Image from 'next/image';

export interface SubNavbarItem {
  title: string;
  description?: string;
  href: string;
  imageUrl?: string;
}

interface Props {
  items: SubNavbarItem[];
}

export const SubNavbar = forwardRef<HTMLDivElement, Props>(({ items }, ref) => {
  return (
    <div
      ref={ref}
      className="hidden md:flex animate-fade-down animate-duration-300 absolute top-20 left-0 right-0 border-gray-200 shadow-md bg-gray-50 md:bg-white border-y z-50"
    >
      <ul className="max-w-screen-xl px-4 py-5 mx-auto justify-items-center text-gray-900 md:px-6 flex flex-row gap-10">
        {items.map((item, index) => (
          <li key={index}>
            <a
              href={item.href}
              className="py-3 border px-14 rounded-lg border-gray-200/80 hover:bg-gray-100 hover:cursor-pointer flex flex-col place-items-center"
            >
              {item.imageUrl && <Image src={item.imageUrl} alt={item.title} width={158} height={40} className="mb-3" />}
              <div className="px-3">
                <div className="font-semibold">{item.title}</div>
                {item.description && <span className="text-sm text-gray-500">{item.description}</span>}
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
});

SubNavbar.displayName = 'SubNavbar';
