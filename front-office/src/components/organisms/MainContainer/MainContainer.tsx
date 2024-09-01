import clsx from 'clsx';

interface MainContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const MainContainer = ({ children, className }: MainContainerProps) => {
  return <div className={clsx('px-5 md:px-40 xl:px-62', className)}>{children}</div>;
};
