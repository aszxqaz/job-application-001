import { ref } from "vue";

export function useRafTicker(duration = 2000, onFinish?: () => void) {
  const progress = ref(0.0);
  let targetValue = 0.0;
  let lastTimestamp = 0;
  let rafId = 0;
  let isRunning = false;

  function loop(timestamp: number) {
    if (progress.value >= targetValue) {
      lastTimestamp = 0;
      isRunning = false;
      return;
    }
    if (lastTimestamp) {
      const delta = timestamp - lastTimestamp;
      progress.value += delta / duration;
      progress.value = Math.min(progress.value, 1);
      if (progress.value == 1) {
        onFinish?.();
        return;
      }
    }
    lastTimestamp = timestamp;
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(loop);
  }

  function setDuration(value: number) {
    duration = value;
  }

  function push(value: number) {
    targetValue = Math.min(Math.max(value, 0), 1);
    if (progress.value < targetValue && !isRunning) {
      isRunning = true;
      rafId = requestAnimationFrame(loop);
    }
  }

  function clear() {
    cancelAnimationFrame(rafId);
  }

  function reset() {
    clear();
    progress.value = 0;
    targetValue = 0.0;
    lastTimestamp = 0;
    rafId = 0;
    isRunning = false;
  }

  return {
    progress,
    clear,
    push,
    reset,
    setDuration,
  };
}
