import { createPinia } from 'pinia';
import piniaPersist from 'pinia-plugin-persist';

const store = createPinia().use(piniaPersist);
export { store };
