import { computed, reactive } from "vue";

export type PieItem = {
  name: string;
  value: number;
  color: string;
};

export function usePieChart(initial: PieItem[] = []) {
  const state = reactive<{ pies: PieItem[] }>({
    pies: initial,
  });

  const total = computed(() => state.pies.reduce((t, a) => t + a.value, 0));

  function removePie(pie: PieItem) {
    console.log(`removing pie`);
    state.pies = state.pies.filter((p) => p != pie);
  }

  function addPie() {
    state.pies.push({
      name: `Сектор-${state.pies.length + 1}`,
      value: 100,
      color: randomColor(),
    });
  }

  return {
    state,
    total,
    removePie,
    addPie,
  };
}

function randomColor() {
  let randomNumber = Math.floor(Math.random() * 16777215);
  let hexColor = randomNumber.toString(16);
  let fullHexCode = hexColor.padStart(6, "0");
  return `#${fullHexCode.toUpperCase()}`;
}
