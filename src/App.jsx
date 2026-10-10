import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from './app/theme.jsx';
import { router } from './app/router.jsx';

export default function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
