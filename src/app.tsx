import { Outlet } from 'react-router-dom';

import { Header } from './shared/components/common/header';
import { BoxBordersSwitch } from './shared/components/dev/box-borders-switch';
import { TailwindIndicator } from './shared/components/dev/tailwindIndicator';
import { Toaster } from './shared/components/ui/sonner';
import { useTheme } from './shared/store/theme.store';

export const App = () => {
  useTheme();

  return (
    <>
      <Header />
      <Outlet />
      <TailwindIndicator />
      <BoxBordersSwitch />
      <Toaster expand />
    </>
  );
};
