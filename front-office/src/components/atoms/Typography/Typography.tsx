import React from 'react';

import clsxm from '@/utils/clsxm';

import { BreakWords, FontIndent, FontWeight, HTMLTag, TextAlign, TextColor, TextDecoration, TextTransform, VariantType } from './interface';

type Shade = '50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
type marginRestriction = 'mx-' | 'my-' | 'ml-' | 'mr-' | 'mt-' | 'mb-' | 'm-';

type Props = {
  children: React.ReactNode;
  variant?: VariantType;
  tag?: HTMLTag;
  align?: TextAlign;
  breakWords?: BreakWords;
  ellipsis?: boolean;
  onClick?: () => void;
  transform?: TextTransform;
  weight?: FontWeight;
  color?: TextColor;
  id?: string;
  indent?: FontIndent;
  customColor?: string;
  withCarriageReturn?: boolean;
  underline?: boolean;
  customColorClass?: `text-${TextColor}-${Shade}`;
  decoration?: TextDecoration;
  italic?: boolean;
  marginClassName?: `${marginRestriction}${number}` | `${marginRestriction}${number} ${marginRestriction}${number}`;
};

export const VARIANT_TO_TAG: Record<VariantType, HTMLTag> = {
  heroTitleXL: 'h1',
  heroTitle: 'h1',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  button: 'h4',
  h5: 'h5',
  small: 'p',
  paragraph: 'p'
};

export const Typography = ({
  children,
  variant,
  tag,
  align,
  breakWords,
  ellipsis = false,
  onClick = () => undefined,
  weight,
  transform,
  color = 'black',
  customColor,
  indent,
  customColorClass,
  withCarriageReturn,
  id,
  underline,
  decoration,
  italic = false,
  marginClassName
}: Props) => {
  const CustomTag = tag ? tag : (variant && VARIANT_TO_TAG[variant]) || 'p';
  const appliedColor = customColor || undefined;

  return (
    <CustomTag
      data-testid="typography"
      style={{ color: appliedColor }}
      className={clsxm(
        'align-left relative',
        marginClassName,
        [
          variant === 'heroTitleXL' && 'text-4xl tracking-wider sm:text-5xl',
          variant === 'heroTitle' && ' leading-[32px] tracking-wider text-4xl',
          variant === 'h1' && 'text-3xl',
          variant === 'h2' && 'text-2xl',
          variant === 'h3' && 'text-xl',
          variant === 'h4' && 'text-lg',
          variant === 'h5' && 'text-base',
          variant === 'paragraph' && 'text-base md:text-base',
          variant === 'small' && 'leading-[10px] text-[11px]',
          variant === 'button' && 'text-sm md:text-base hover:scale-105 ease-in duration-150'
        ],
        [breakWords === 'all' && 'break-all', breakWords === 'words' && 'break-words', breakWords === 'normal' && 'break-normal'],
        ellipsis && 'truncate',
        [
          align === 'left' && 'text-left',
          align === 'center' && 'text-center',
          align === 'right' && 'text-right',
          align === 'justify' && 'text-justify'
        ],
        [transform === 'capitalize' && 'capitalize', transform === 'uppercase' && 'uppercase', transform === 'lowercase' && 'lowercase'],
        [
          weight === 'light' && 'font-light',
          weight === 'semibold' && 'font-medium',
          weight === 'bold' && 'font-bold',
          weight === 'extrabold' && 'font-extrabold'
        ],
        [
          color === 'primary' && 'text-gray-900',
          color === 'secondary' && 'text-secondary-100',
          color === 'tertiary' && 'text-tertiary-100',
          color === 'black' && 'text-gray-900',
          color === 'white' && 'text-white',
          color === 'gray' && 'text-gray-600',
          color === 'lightGray' && 'text-gray-300',
          color === 'darkGray' && 'text-gray-500',
          color === 'gold' && 'text-gold'
        ],
        [indent === 'md' && 'indent-2', indent === 'lg' && 'indent-5', indent === 'xl' && 'indent-11'],
        customColorClass && customColorClass,
        withCarriageReturn && 'whitespace-pre-line',
        underline && 'underline',
        decoration && decoration,
        italic && 'italic'
      )}
      onClick={onClick}
      id={id}
    >
      {children}
    </CustomTag>
  );
};
