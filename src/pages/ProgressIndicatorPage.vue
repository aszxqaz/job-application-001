<script setup lang="ts">
import { reactive, useTemplateRef } from "vue";
import ProgressIndicator from "../components/ProgressIndicator/ProgressIndicator.vue";

const progressIndicator = useTemplateRef("progress-indicator");

const state = reactive({
  minFD: 100,
  maxFD: 500,
  minPI: 1,
  maxPI: 15,
  generate: "none",
  type: "dashboard" as "dashboard" | "standard",
  pathMultiplier: 80,
  duration: 2000,
});

async function start() {
  progressIndicator.value?.reset();
  function randomRange(from: number, to: number) {
    return Math.random() * (to - from) + from;
  }
  let val = 0;
  const minFD = +state.minFD;
  const maxFD = +state.maxFD;
  const minPI = +state.minPI;
  const maxPI = +state.maxPI;
  while (val < 1) {
    const ms = randomRange(minFD, maxFD);
    console.log(ms);
    await new Promise((resolve) => setTimeout(() => resolve(null), ms));
    val += randomRange(minPI, maxPI) / 100;
    if (val > 0.4) {
      if (state.generate == "warning") {
        progressIndicator.value?.warning();
        return;
      } else if (state.generate == "error") {
        progressIndicator.value?.error();
        return;
      }
    }
    progressIndicator.value?.forward(val);
  }
}
</script>

<template>
  <div class="progress-indicator-page">
    <div class="progress-indicator">
      <ProgressIndicator
        ref="progress-indicator"
        :duration="state.duration"
        :is-dashboard="state.type == 'dashboard'"
        :path-multiplier="state.pathMultiplier / 100"
      />
    </div>
    <div class="start">
      <div>Status: {{ progressIndicator?.status }}</div>
      <button @click="start()">Start</button>
    </div>
    <div>
      <fieldset>
        <legend>Async task properties</legend>
        <div class="controls">
          <label class="label">
            Min async delay, ms
            <input
              type="range"
              min="0"
              :max="state.maxFD"
              v-model="state.minFD"
            />
          </label>
          <div>{{ state.minFD }}</div>
          <label class="label">
            Max async delay, ms
            <input
              type="range"
              :min="state.minFD"
              max="1000"
              v-model="state.maxFD"
            />
          </label>
          <div>{{ state.maxFD }}</div>
          <label class="label">
            Min async increment, %
            <input
              type="range"
              min="1"
              :max="state.maxPI"
              v-model="state.minPI"
            />
          </label>
          <div>{{ state.minPI }}</div>
          <label class="label">
            Max async increment, %
            <input
              type="range"
              :min="state.minPI"
              max="100"
              v-model="state.maxPI"
            />
          </label>
          <div>{{ state.maxPI }}</div>
        </div>
        <div class="radio-grid">
          <input
            type="radio"
            id="generate-error"
            value="error"
            v-model="state.generate"
          />
          <label for="generate-error">Generate error</label>
          <input
            type="radio"
            id="generate-warning"
            value="warning"
            v-model="state.generate"
          />
          <label for="generate-warning">Generate warning</label>
          <input
            type="radio"
            id="generate-none"
            value="none"
            v-model="state.generate"
          />
          <label for="generate-none">Generate none</label>
        </div>
      </fieldset>
      <fieldset>
        <legend>Progress bar</legend>
        <div class="radio-grid">
          <input
            type="radio"
            id="type-dashboard"
            value="dashboard"
            v-model="state.type"
          />
          <label for="type-dashboard">Dashboard</label>
          <input
            type="radio"
            id="type-standard"
            value="standard"
            v-model="state.type"
          />
          <label for="type-standard">Standard</label>
        </div>
        <div class="controls">
          <label class="label">
            Full circle animation duration
            <input
              type="range"
              min="1000"
              max="5000"
              v-model="state.duration"
            />
          </label>
          <div>{{ state.duration }}</div>
        </div>
        <div class="controls" v-if="state.type == 'dashboard'">
          <label class="label">
            Path multiplier
            <input
              type="range"
              min="60"
              max="95"
              v-model="state.pathMultiplier"
            />
          </label>
          <div>{{ state.pathMultiplier }}</div>
        </div>
      </fieldset>
    </div>
  </div>
</template>

<style scoped>
.progress-indicator-page {
  margin-inline: auto;
  max-width: 600px;
}

.progress-indicator {
  max-width: 200px;
  margin-inline: auto;
}

.start {
  display: grid;
  gap: 0.5rem;
  margin-block: 1rem;
  text-align: center;
  margin-inline: auto;
  max-width: 10rem;
}

.group {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.label {
  display: flex;
  flex-direction: column;
}

.controls {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr max-content;
  gap: 0.5rem;
  align-items: center;
}

.radio-grid {
  display: grid;
  grid-template-columns: max-content 1fr;
  row-gap: 0.5rem;
  margin-bottom: 0.5rem;
}

fieldset {
  margin-bottom: 0.5rem;
}
</style>
