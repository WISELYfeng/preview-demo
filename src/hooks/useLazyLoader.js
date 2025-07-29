import { ref } from 'vue';
import 'intersection-observer';
import { useIntersectionObserver } from '@vueuse/core';

export function useLazyLoader(callback) {
  const el = ref(null);
  const loaded = ref(false);

  useIntersectionObserver(el, ([{ isIntersecting }]) => {
    if (isIntersecting && !loaded.value) {
      loaded.value = true;
      callback();
    }
  });

  return { el, loaded };
}
