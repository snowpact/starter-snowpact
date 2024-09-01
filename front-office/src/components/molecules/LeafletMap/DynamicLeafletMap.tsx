import dynamic from 'next/dynamic';

import type { LeafletMapProps } from './LeafletMap';

const LeafletMap = dynamic(() => import('./LeafletMap'), {
  ssr: false
});

export const DynamicLeafletMap = (props: LeafletMapProps) => {
  return <LeafletMap {...props} />;
};
