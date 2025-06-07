const themeStorageKey = 'odyspace-theme';

const getThemePreference = () => {
  return localStorage.getItem(themeStorageKey) || 'core';
};

const theme = {
  value: getThemePreference(),
};

const applyTheme = () => {
  const root = document.documentElement;
  const themes = ['core', 'hades', 'poseidon', 'zeus'];
  themes.forEach(t => root.classList.remove(`odyspace-theme-${t}`));
  root.classList.add(`odyspace-theme-${theme.value}`);

  const select = document.querySelector('#theme-select');
  if (select) select.value = theme.value;
};

const setPreference = () => {
  localStorage.setItem(themeStorageKey, theme.value);
  applyTheme();
};

const onChange = (e) => {
  theme.value = e.target.value;
  setPreference();
};

export function onLoadThemeSelector() {
  applyTheme();
  document.querySelector('#theme-select')?.addEventListener('change', onChange);
}
