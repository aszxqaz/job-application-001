<script lang="ts" setup>
import {
  ArcElement,
  Chart as ChartJS,
  Legend,
  type ChartOptions,
} from "chart.js";
import { computed } from "vue";
import { Pie } from "vue-chartjs";
import PieChartInput from "./components/PieChartInput.vue";
import { usePieChart, type PieItem } from "./hooks/usePieChart";

ChartJS.register(ArcElement, Legend);

const initialPies = [
  {
    name: "Сектор-1",
    value: 100,
    color: "#FF6384",
  },
  {
    name: "Сектор-2",
    value: 200,
    color: "#FFCD56",
  },
  {
    name: "Сектор-3",
    value: 300,
    color: "#4BC0C0",
  },
] as PieItem[];

const { state, addPie, removePie, total } = usePieChart(initialPies);

const chartData = computed(() => ({
  labels: state.pies.map((p) => p.name),
  datasets: [
    {
      backgroundColor: state.pies.map((p) => p.color),
      data: state.pies.map((p) => p.value),
    },
  ],
}));

const chartOptions: ChartOptions<"pie"> = {
  animation: false,
  responsive: true,
  maintainAspectRatio: false,
  spacing: 0,
  plugins: {
    legend: {
      position: "bottom",
      align: "center",
      labels: {
        padding: 30,
        usePointStyle: true,
        pointStyleWidth: 14,
        boxHeight: 10,
        boxWidth: 10,
        pointStyle: "circle",
        font: {
          size: 15,
          family: "Inter, sans-serif",
        },
      },
    },
  },
};
</script>

<template>
  <div class="row">
    <div class="panel col">
      <PieChartInput
        class="pie-chart-input"
        v-for="pie in state.pies"
        v-model:color="pie.color"
        v-model:value="pie.value"
        v-model:name="pie.name"
        :percent="`${((pie.value / total) * 100).toFixed(0)}%`"
        @remove="removePie(pie)"
      />
      <button class="btn" @click="addPie">Добавить сектор</button>
    </div>
    <div class="chart">
      <Pie :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<style scoped>
.chart {
  pointer-events: none;
  aspect-ratio: 1;
  max-width: 500px;
  margin-inline: auto;
}

.pie-chart-input:not(:first-child) {
  margin-top: 5px;
}

.panel {
  width: 100%;
  max-width: 540px;
  margin-inline: auto;
}

.row {
  display: flex;
  align-items: flex-start;
  column-gap: 90px;
  row-gap: 32px;

  @media (max-width: 1280px) {
    flex-direction: column;
  }

  > * {
    flex: 1;
  }
}

.btn {
  margin-top: 30px;
  width: 100%;
  padding-block: 20px;
  background-color: #1b84ff;
  color: white;
  border: none;
  border-radius: 10px;
}
</style>
