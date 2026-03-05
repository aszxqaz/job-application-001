<script lang="ts" setup>
import { onUnmounted, reactive, watch } from "vue";
import ProgressIndicator from "./components/ProgressIndicatorView.vue";
import { useRafTicker } from "./hooks/useRafTicker";

export type ProgressbarStatus = "in-progress" | "success" | "warning" | "error";

const props = withDefaults(
  defineProps<{
    duration?: number;
    isDashboard?: boolean;
    pathMultiplier?: number;
    inProgressColor?: string;
    successColor?: string;
    errorColor?: string;
    warningColor?: string;
  }>(),
  {
    duration: 2000,
    isDashboard: false,
    pathMultiplier: 0.8,
    inProgressColor: "#6f3bff",
    successColor: "#0bd16e",
    warningColor: "#e5ae4e",
    errorColor: "#ff3d4d",
  },
);

const state = reactive<{
  status: ProgressbarStatus;
  progress: number;
}>({
  status: "in-progress",
  progress: 0,
});

const ticker = useRafTicker(props.duration, () => {
  state.status = "success";
});

watch(
  () => props.duration,
  (duration) => {
    ticker.setDuration(duration);
  },
);

defineExpose({
  reset() {
    state.status = "in-progress";
    state.progress = 0;
    ticker.reset();
  },
  forward(progress: number) {
    if (state.status != "in-progress") {
      throw new Error(`not in progress: status ${state.status}`);
    }
    ticker.push(progress);
  },
  error() {
    if (state.status != "in-progress") {
      throw new Error(`not in progress: status ${state.status}`);
    }
    state.status = "error";
  },
  warning() {
    if (state.status != "in-progress") {
      throw new Error(`not in progress: status ${state.status}`);
    }
    state.status = "warning";
  },
  get status() {
    return state.status;
  },
});

onUnmounted(() => {
  ticker.clear();
});
</script>

<template>
  <ProgressIndicator
    :progress="ticker.progress.value"
    :state="state.status"
    :isDashboard="isDashboard"
    :pathMultiplier="pathMultiplier"
    :in-progress-color="inProgressColor"
    :error-color="errorColor"
    :success-color="successColor"
    :warning-color="warningColor"
  />
</template>

<style scoped></style>
