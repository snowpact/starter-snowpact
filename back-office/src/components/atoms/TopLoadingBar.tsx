import TopBarProgress from 'react-topbar-progress-indicator';

TopBarProgress.config({
  barColors: {
    '0': '#041173',
    '1.0': '#041173',
  },
  shadowBlur: 5,
});

export const TopLoadingBar = () => {
  return <TopBarProgress />;
};
