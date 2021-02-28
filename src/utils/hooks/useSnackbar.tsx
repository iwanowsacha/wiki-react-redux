import { useState, useEffect } from 'react';

export default function useSnacbkbar(
  shouldCloseAutomatically: boolean
): [boolean, () => void] {
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);

  function toggleSnackbar() {
    setIsSnackbarOpen(!isSnackbarOpen);
  }

  useEffect(() => {
    if (isSnackbarOpen && shouldCloseAutomatically) {
      setTimeout(() => {
        setIsSnackbarOpen(false);
      }, 1000);
    }
  }, [isSnackbarOpen]);

  return [isSnackbarOpen, toggleSnackbar];
}
