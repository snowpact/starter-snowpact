import localFont from 'next/font/local';

export const ebrimaRegular = localFont({ src: '../../../asset/font/ebrima-regular.ttf' });
export const ebrimaBold = localFont({ src: '../../../asset/font/ebrima-bold.ttf' });

export const FontInitializer = () => {
  return (
    <style jsx global>{`
      h1,
      h2 {
        font-family: ${ebrimaBold.style.fontFamily};
      }
      a,
      p,
      h3 {
        font-family: ${ebrimaRegular.style.fontFamily};
      }
    `}</style>
  );
};