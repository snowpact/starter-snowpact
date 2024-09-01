import { Typography } from '@/components/atoms/Typography';

export interface Props {
  title: string;
  description?: string;
}

export const TextBlock: React.FC<Props> = ({ title, description }) => {
  return (
    <div className="max-w-2xl mx-auto text-center mt-24 mb-10">
      <Typography variant="heroTitleXL">{title}</Typography>
      {description && (
        <Typography variant="paragraph" color="darkGray" marginClassName="mt-2">
          {description}
        </Typography>
      )}
    </div>
  );
};
