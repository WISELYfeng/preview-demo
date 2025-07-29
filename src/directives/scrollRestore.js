export default {
  mounted(el, binding) {
    const key = binding.value;
    // 检查是否有保存的滚动位置
    const savedPosition = sessionStorage.getItem(key);
    if (savedPosition) {
      el.scrollTo(0, parseInt(savedPosition, 10));
    }
    const saveScrollPosition = () => {
      sessionStorage.setItem(key, el.scrollTop);
    };
    el._saveScrollPosition = saveScrollPosition;
    // 监听滚动事件以便保存位置
    el.addEventListener('scroll', saveScrollPosition);
    // 使用 IntersectionObserver 监听元素是否可见
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // 元素进入视口
          const savedPosition = sessionStorage.getItem(key);
          if (savedPosition) {
            el.scrollTo(0, parseInt(savedPosition, 10));
          }
        }
      });
    });
    // 观察元素
    observer.observe(el);
    el._observer = observer;
  },
  beforeUnmount(el) {
    const saveScrollPosition = el._saveScrollPosition;
    if (saveScrollPosition) {
      saveScrollPosition();
    }
    el.removeEventListener('scroll', saveScrollPosition);
    const observer = el._observer;
    if (observer) {
      observer.disconnect();
    }
  }
};
