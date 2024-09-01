import { Typography } from '@/components/atoms/Typography';
import clsxm from '../../../../utils/clsxm';
import Image, { StaticImageData } from 'next/image';

export interface Feature {
  name: string;
  description: string;
  imageSrc: string | StaticImageData;
}

export interface Props {
  features: Feature[];
}

export const FeatureCard: React.FC<Props> = ({ features }) => {
  return (
    <div className="mx-auto max-w-2xl lg:max-w-7xl ">
      <div className="space-y-16">
        {features.map((feature, featureIdx) => (
          <div key={feature.name} className="flex flex-col-reverse lg:grid lg:grid-cols-12 lg:items-center lg:gap-x-8">
            <div
              className={clsxm(
                featureIdx % 2 === 0 ? 'lg:col-start-1' : 'lg:col-start-8 xl:col-start-9',
                'mt-6 lg:col-span-5 lg:row-start-1 lg:mt-0 xl:col-span-4'
              )}
            >
              <Typography variant="h2">{feature.name}</Typography>
              <Typography color="gray" marginClassName="mt-10">
                {feature.description}
              </Typography>
            </div>
            <div
              className={clsxm(
                featureIdx % 2 === 0 ? 'lg:col-start-6 xl:col-start-5' : 'lg:col-start-1',
                'flex-auto lg:col-span-7 lg:row-start-1 xl:col-span-8'
              )}
            >
              <div className="aspect-h-2 aspect-w-4 overflow-hidden rounded-lg bg-gray-100">
                <Image width={300} height={100} src={feature.imageSrc} alt={feature.name} className="object-cover object-center" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
