import { Typography } from '@/components/atoms/Typography';

export interface Props {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export const Section: React.FC<Props> = ({ title, description, children, className }) => {
  return (
    <section className={className}>
      {title && (
        <div className="max-w-2xl mx-auto text-center mt-24 mb-10">
          <Typography variant="heroTitleXL">{title}</Typography>
          {description && (
            <Typography variant="paragraph" color="darkGray" marginClassName="mt-2">
              {description}
            </Typography>
          )}
        </div>
      )}
      {children}
    </section>
  );
};
