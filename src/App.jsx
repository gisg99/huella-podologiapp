import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from './app/theme.jsx';
import { LockProvider } from './app/lock.jsx';
import LockOverlay from './app/LockOverlay.jsx';
import { router } from './app/router.jsx';

export default function App() {
  return (
    <ThemeProvider>
      <LockProvider>
        <RouterProvider router={router} />
        <LockOverlay />
      </LockProvider>
    </ThemeProvider>
  );
}
