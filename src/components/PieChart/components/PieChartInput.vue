<script lang="ts" setup>
import { Vue3ColorPicker } from "@cyhnkckali/vue3-color-picker";
import "@cyhnkckali/vue3-color-picker/dist/style.css";
import { onClickOutside } from "@vueuse/core";
import { ref, useTemplateRef } from "vue";

const emit = defineEmits<{
  (e: "remove"): void;
}>();

const color = defineModel<string>("color");
const percent = defineModel<string>("percent");
const value = defineModel<number>("value");
const name = defineModel<string>("name");

function onValueChange(input: string) {
  if (/^(?!0*(\.0{1,2})?$)\d+(\.\d{1,2})?$/.test(input)) {
    value.value = +input;
  }
}

let pickerOpened = ref(false);
const editMode = ref(false);

const colorPickerRef = useTemplateRef("color-picker");

onClickOutside(
  //@ts-ignore
  colorPickerRef,
  () => (pickerOpened.value = false),
);
</script>

<template>
  <div class="pie-chart-input" :class="{ editable: editMode }">
    <div
      class="layout__name bordered bordered--right"
      :class="{ editable: editMode }"
    >
      <input
        v-if="editMode"
        v-model="name"
        class="input"
        type="text"
        placeholder="Сектор-1"
      />
      <div class="label" v-else>
        {{ name }}
      </div>
    </div>
    <div class="layout__percent percent">
      <input
        v-if="editMode"
        class="input input--percent"
        type="text"
        placeholder="200"
        :value="value"
        @input="onValueChange(($event.target as HTMLInputElement).value)"
      />
      <div class="label" v-else>
        {{ percent }}
      </div>
    </div>
    <div
      class="layout__picker color-picker bordered bordered--left"
      :class="{ divided: !editMode }"
    >
      <div
        class="circle"
        :style="{ backgroundColor: color }"
        v-on:click="pickerOpened = !pickerOpened"
      ></div>
      <Vue3ColorPicker
        v-if="pickerOpened"
        ref="color-picker"
        class="picker"
        v-model="color"
        mode="solid"
        :showColorList="false"
        :showEyeDrop="false"
        :show-alpha="false"
        type="RGBA"
      />
    </div>
    <div class="layout__controls controls">
      <button
        class="icon-button icon-button--edit"
        @click="editMode = !editMode"
      ></button>
      <button
        class="icon-button icon-button--remove"
        @click="emit('remove')"
      ></button>
    </div>
  </div>
</template>

<style scoped>
.pie-chart-input {
  position: relative;

  display: grid;
  grid-template-columns: 4fr 2fr 7fr max-content;
  align-items: center;

  padding-right: 20px;
  height: 60px;
  background-color: rgb(219 223 233 / 0.2);
  border-radius: 10px;

  @media (max-width: 450px) {
    grid-template-columns: 4fr 2fr 4fr max-content;
  }
}

.layout__name {
  padding-left: 20px;
}

.pie-chart-input.editable .layout__name {
  padding-left: 11px;
  padding-right: 4px;
}

.pie-chart-input.editable .layout__percent {
  padding-inline: 4px;
}

.percent {
  justify-self: center;
}

.picker {
  position: absolute;
  z-index: 1;
  left: 0;
  top: 0;
}

.label {
  user-select: none;
}

.input {
  width: 100%;
  border: 1px solid rgb(0 0 0 / 0.2);
  border-radius: 4px;
  color: #252f4a;
  outline: none;
  padding: 4px 8px;
}

.input--percent {
  text-align: center;
}

.color-picker {
  padding-left: 25px;
}

.controls {
  flex-shrink: 0;
  display: flex;
  gap: 20px;
}

.circle {
  width: 20px;
  height: 20px;
  border-radius: 50%;
}

.icon-button {
  width: 24px;
  height: 24px;
  border: none;
  background-color: #99a1b7;
  mask-repeat: no-repeat;
  mask-position: center;
  mask-size: 24px 24px;
  cursor: pointer;
}

.icon-button:hover,
.icon-button:hover {
  background-color: #252f4a;
}

.icon-button--edit {
  mask-image: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12.2178 5.94399L14.0953 4.09796C15.1323 3.07843 16.8135 3.07843 17.8504 4.09796L19.7279 5.94399C20.7648 6.96352 20.7648 8.61651 19.7279 9.63604L17.8504 11.4821M12.2178 5.94399L4.56463 13.4688C4.1365 13.8897 3.86755 14.4419 3.80237 15.0338L3.34134 19.2201C3.24381 20.1057 4.05713 20.8251 4.9425 20.6363L8.77269 19.82C9.27079 19.7138 9.72729 19.4689 10.0877 19.1146L17.8504 11.4821M12.2178 5.94399L17.8504 11.4821M15.0341 20.4932H20.6667' stroke='%2399A1B7' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E%0A");
}

.icon-button--remove {
  mask-image: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M16 6.5L15.4558 3.86754C15.1836 3.05086 14.4193 2.5 13.5585 2.5H10.4415C9.58066 2.5 8.81638 3.05086 8.54415 3.86754L8 6.5M6 7.3V8C6 8 6 10.0552 6 11.0823V17.5C6 19.7091 7.79086 21.5 10 21.5H14C16.2091 21.5 18 19.7091 18 17.5V11.0823C18 10.0552 18 8 18 8V7.3M3.75 6.5H20.25' stroke='%2399A1B7' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E%0A");
}

.pie-chart-input:not(.editable) {
  .bordered {
    position: relative;

    &::before {
      content: "";
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 1px;
      height: 16px;
      background-color: #dbdfe9;
    }
  }

  .bordered--left {
    &::before {
      left: 0;
    }
  }

  .bordered--right {
    &::before {
      right: 0;
    }
  }
}
</style>
