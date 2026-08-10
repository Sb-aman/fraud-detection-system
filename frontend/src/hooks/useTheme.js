import { useLocalStorage } from './useLocalStorage';

export const useTheme = () => {
  const [darkMode, setDarkMode] = useLocalStorage('darkMode', false);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return { darkMode, setDarkMode, toggleDarkMode };
};

export default useTheme;
