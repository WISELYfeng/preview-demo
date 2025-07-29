export const runtimeConfig = {
  APP_ORIGIN: null,
  PRIVATE_KEY: null,
  SHOW_LOG: null
};

export async function loadConfig() {
  const version = Date.now();
  const mainPath = import.meta.env.VITE_MAIN_PATH;
  const fetchUrl = import.meta.env.MODE === 'production' ? `${mainPath}/config.json?v=${version}` : `/config.json?v=${version}`;
  const res = await fetch(fetchUrl);
  const json = await res.json();
  Object.assign(runtimeConfig, json);
  return runtimeConfig;
}
