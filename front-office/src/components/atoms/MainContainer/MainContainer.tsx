import clsxm from '../../../../utils/clsxm';

interface MainContainerProps {
  children: React.ReactNode;
  className?: string;
  spaceY?: boolean;
}

export const MainContainer = ({ children, className, spaceY = true }: MainContainerProps) => {
  return <div className={clsxm('px-5 md:px-40 xl:px-62', spaceY && 'space-y-10', className)}>{children}</div>;
};
