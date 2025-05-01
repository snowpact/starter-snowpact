import React, { useState } from 'react';

import { Input } from '@/components/shadcn/input';

export interface SearchBarProps {
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  placeholder?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function SearchBar({ onChange, value, placeholder, leftIcon, rightIcon }: SearchBarProps) {
  const [showFilters, setShowFilters] = useState(false);

  const handleRightIconClick = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="relative lg:min-w-[331px] min-w-[220px]">
      <div className="flex relative">
        <Input
          data-testid="data-table-search-bar"
          type="text"
          onChange={onChange}
          value={value}
          placeholder={placeholder}
        />
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">{leftIcon}</div>
        )}
        {rightIcon && (
          <div
            className="absolute inset-y-0 right-0 flex items-center pr-3"
            onClick={handleRightIconClick}
          >
            {rightIcon}
          </div>
        )}
      </div>
    </div>
  );
}
