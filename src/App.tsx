import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';

import { BoxBordersSwitch } from './shared/components/dev/box-borders-switch';
import { TailwindIndicator } from './shared/components/dev/tailwindIndicator';

export const App = () => {
  return (
    <>
      <Outlet />
      <TailwindIndicator />
      <BoxBordersSwitch />
      <Toaster expand />
    </>
  );
};

export default App;
