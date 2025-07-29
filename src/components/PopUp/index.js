import { createApp, h, ref } from 'vue';
import PopUp from './PopUp.vue';

export function popupService(options = {}) {
  return new Promise(resolve => {
    const show = ref(true);
    const app = createApp({
      setup() {
        const onConfirm = () => {
          resolve(true);
          close();
        };

        const close = () => {
          show.value = false;
          resolve(false);
        };

        return () =>
          h(
            PopUp,
            {
              show: show.value,
              title: options.title || '标题',
              isVertical: options.isVertical ?? true,
              confirmText: options.confirmText || '确定',
              'onUpdate:show': val => {
                if (!val) {
                  close();
                  cleanup();
                  resolve(false); // 用户手动关闭
                }
              },
              onConfirm: onConfirm
            },
            {
              content: () => (options.content ? h(options.content) : null)
            }
          );
      }
    });

    const container = document.createElement('div');
    document.body.appendChild(container);
    app.mount(container);

    // 自动延迟(延迟卸载，避免动画未结束)
    function cleanup() {
      setTimeout(() => {
        app.unmount();
        container.remove();
      }, 300);
    }
  });
}
