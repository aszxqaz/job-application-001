<script lang="ts" setup>
import { computed, type ComputedRef, type StyleValue } from "vue";
import CheckIcon from "./icons/CheckIcon.vue";
import CrossIcon from "./icons/CrossIcon.vue";
import WarningIcon from "./icons/WarningIcon.vue";

type Props = {
  progress: number;
  inProgressColor: string;
  successColor: string;
  errorColor: string;
  warningColor: string;
  isDashboard: boolean;
  pathMultiplier: number;
  state: "in-progress" | "success" | "warning" | "error";
};

const props = defineProps<Props>();

const RADIUS = 47;
const FULLCIRC = Math.ceil(2 * Math.PI * RADIUS);

const donePercentFractional = computed(() => `${props.progress * 100}%`);
const donePercentInt = computed(() => `${Math.trunc(props.progress * 100)}%`);
const leftPercent = computed(() => `${(1 - props.progress) * 100}%`);

const pathMultiplier = computed(() =>
  props.isDashboard ? props.pathMultiplier : 1,
);
const circumference = computed(
  () => Math.ceil(2 * Math.PI * 47) * pathMultiplier.value,
);
const filledDashArray = computed(
  () => FULLCIRC * props.progress * pathMultiplier.value,
);
const emptyDashArray = computed(
  () => FULLCIRC * (1 - props.progress * pathMultiplier.value),
);

const color = computed(() => {
  switch (props.state) {
    case "warning":
      return props.warningColor;
    case "error":
      return props.errorColor;
    case "in-progress":
    case "success":
      return props.successColor;
  }
});

const circleStyle: ComputedRef<StyleValue> = computed(() => {
  if (props.state == "error" || props.state == "warning") {
    return {
      transition: "stroke 0.5s 0.2s linear",
      stroke: color.value,
    };
  }
  return {
    stroke: `color-mix(in srgb, ${props.successColor} ${donePercentFractional.value}, ${props.inProgressColor} ${leftPercent.value})`,
  };
});

const frontDashOffset = computed(() =>
  props.isDashboard ? 0 : circumference.value / 4,
);

const angle = computed(() => (1 - pathMultiplier.value) * Math.PI);

const indicatorStyle: ComputedRef<StyleValue> = computed(() => {
  if (props.isDashboard) {
    return {
      transform: `rotateZ(${angle.value + Math.PI / 2}rad)`,
    };
  }
  return {};
});

const wrapperMargin = computed(() => `-${(1 - Math.cos(angle.value)) * 50}%`);
</script>

<template>
  <div
    class="progress-indicator-view"
    :style="{
      marginBottom: wrapperMargin,
    }"
  >
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      :style="indicatorStyle"
    >
      <circle
        :r="RADIUS"
        cx="50"
        cy="50"
        fill="transparent"
        stroke="#e6e6e6"
        stroke-width="4"
        stroke-linecap="round"
        :stroke-dasharray="circumference"
      />
      <circle
        v-if="props.progress > 0"
        ref="circleRef"
        class="circle"
        :class="{ warning: state == 'warning', error: state == 'error' }"
        cx="50"
        cy="50"
        fill="none"
        :r="RADIUS"
        stroke-width="4"
        stroke-linecap="round"
        :stroke-dashoffset="frontDashOffset"
        :stroke-dasharray="filledDashArray + ' ' + emptyDashArray"
        :style="circleStyle"
      />
    </svg>
    <div v-if="state == 'in-progress'" class="percentage center">
      {{ donePercentInt }}
    </div>
    <div class="center">
      <Transition name="scale-fade">
        <CheckIcon v-if="state == 'success'" class="icon" :style="{ color }" />
        <WarningIcon
          v-else-if="state == 'warning'"
          class="icon"
          :style="{ color }"
        />
        <CrossIcon
          v-else-if="state == 'error'"
          class="icon"
          :style="{ color }"
        />
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.progress-indicator-view {
  position: relative;
  z-index: -1;
}

.center {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.percentage {
  color: rgb(97, 98, 102);
  font-size: 1.75rem;
}

.icon {
  width: 30px;
  height: 30px;
}

.scale-fade-enter-from {
  opacity: 0;
  transform: scale(0);
}

.scale-fade-enter-active {
  transition:
    opacity 0.2s linear,
    transform 0.4s cubic-bezier(1, -1.28, 0.29, 2.5);
}

.scale-fade-enter-to {
  opacity: 1;
  transform: scale(1);
}

.scale-fade-leave-from {
  opacity: 0;
}
</style>
