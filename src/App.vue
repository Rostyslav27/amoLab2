
<template>
  <main class="container main">
    <section class="main__student-info">
      <StudentInfo class="student-info__info" /> 
    </section>
    <section class="main__content">
      <Card :title="'Ввід даних'" :active="true">
        <ArrayField class="main__array" v-for="(array, i) in arrays" :length="i * 1000" :title="'Масив ' + (i + 1)" v-model="arrays[i]"/>
        <div class="main__options">
          <div>
            Діапазон чисел: <input class="main__range" type="text" v-model="arrayLeftString"> - <input class="main__range" type="text" v-model="arrayRightString">
          </div>
          <Button text="Випадкові значення" @click="generateRandomArrays()" />
          <Button text="Випадкові відсортовані значення" @click="generateRandomArrays(true)" />
          <Button text="Випадкові зворотньо відсортовані значення" @click="generateRandomArrays(false)" />
          <Download file-name="lab2.json" :data="JSON.stringify(arrays)" />
          <Upload @upload="handleUpload" />
        </div>
      </Card> 
      <Card :title="'Результати'" :active="true">
        <Button class="main__result-btn" text="Згенерувати результат" @click="generateResults" />
        <div v-if="chartData.labels.length" class="main__plots">
          <p class="main__plot-title">Отриманий результат:</p>
          <Line class="main__plot" :data="chartData" :options="chartOptions" />
          <p class="main__plot-title">Очікуваний результат:</p>
          <Line class="main__plot" :data="expectedChartData" :options="expectedChartOptions" />
        </div>
      </Card>   
    </section>
  </main>
  
</template>

<script setup lang="ts">
  import { ref, computed, watch } from 'vue';
  import StudentInfo from './components/StudentInfo.vue';
  import Card from './components/Card.vue';
  import Button from './components/Button.vue';
  import ArrayField from './components/ArrayField.vue';
  import Download from './components/Download.vue';
  import Upload from './components/Upload.vue';
  import { shakerSort } from './algoritms/shaker-sort';
  import {Chart as ChartJS,CategoryScale,LinearScale,PointElement,LineElement,Title,Tooltip} from 'chart.js'
  import { Line } from 'vue-chartjs'
  ChartJS.register(CategoryScale,LinearScale,PointElement,LineElement, Title,Tooltip,)


  const arrays = ref<number[][]>([[],[],[],[],[],[],[],[],[],[]]);

  const chartData = ref({
    labels: [] as number[],
    datasets: [{ data: [] as number[] }]
  });

  const expectedChartData = ref({
    labels: [] as number[],
    datasets: [{ data: [] as number[] }]
  });

  const tempChartData = {
    labels: [] as number[],
    datasets: [{ data: [] as number[], label: 'Час(мс)' }]
  };

  for (let i = 0; i < 10; i++) {
    tempChartData.labels.push(1000 + i * 1000);
    tempChartData.datasets[0].data.push((1000 + i * 1000)**2)
  }

  expectedChartData.value = tempChartData;

  const chartOptions = ref({
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Кількість Елемнтів',
        }
      },
      y: {
        title: {
          display: true,
          text: 'Час(мс)'
        },
      }
    }
  });

  const expectedChartOptions = ref({
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'n',
        }
      },
      y: {
        title: {
          display: true,
          text: 'O(n2)'
        },
      }
    }
  });

  const arrayLeftString = ref<string>('-10000');
  const arrayRightString = ref<string>('10000');

  const arrayLeft = computed<number>(() => +arrayLeftString.value);
  const arrayRight = computed<number>(() => +arrayRightString.value);

  watch(arrayLeftString, () => {
    arrayLeftString.value = (arrayLeftString.value[0] === '-' ? '-' : '') + arrayLeftString.value.replace(/[^0-9.]/g, '');
    if (!arrayLeftString.value.length) {
      arrayLeftString.value = '0';
    }

    if (+arrayLeftString.value >= +arrayRightString.value) {
      arrayRightString.value = String(+arrayLeftString.value + 1);
    }
  });

  watch(arrayRightString, () => {
    arrayLeftString.value = (arrayLeftString.value[0] === '-' ? '-' : '') + arrayLeftString.value.replace(/[^0-9.]/g, '');
    if (!arrayRightString.value.length) {
      arrayRightString.value = '0';
    }

    if (+arrayLeftString.value >= +arrayRightString.value) {
      arrayLeftString.value = String(+arrayRightString.value - 1);
    }
  });

  const getRandomFloat = (min:number, max:number, decimals:number):number => {
    const str:string = (Math.random() * (max - min) + min).toFixed(decimals);
    return parseFloat(str);
  };

  const generateRandomArrays = (sorted?:boolean):void => {
    const newArrays:number[][] = [];
    for (let i = 0; i < arrays.value.length; i ++) {
      const arrayLenght:number = 1000 + i * 1000;
      const newArray:number[] = [];  

      for (let j = 0; j < arrayLenght; j++) {
        newArray.push(getRandomFloat(arrayLeft.value, arrayRight.value, 2))
      }

      if (sorted === undefined) {
        newArrays.push(newArray); 
      } else if (sorted === true) {
        newArrays.push(shakerSort(newArray)); 
      } else if (sorted === false) {
        newArrays.push(shakerSort(newArray, true)); 
      }

    }

    arrays.value = newArrays;
  };

  const generateResults = ():void => {
    if (!arrays.value.some(arr => !arr.length)) {
      const chartTempData = {
        labels: [] as number[],
        datasets: [{ data: [] as number[], label: 'Час(мс)' }]
      };

      for (let i = 0; i < arrays.value.length; i++) {
        const arrCopy:number[] = [...arrays.value[i]];
        const startTime = Date.now();
        shakerSort(arrCopy);
        const time = Date.now() - startTime;
        chartTempData.labels.push(arrCopy.length);
        chartTempData.datasets[0].data.push(time);
      }

      chartData.value = chartTempData;
    } else {
      alert('Введіть дані')
    }
  };

  const handleUpload = (e:string):void => {
    try {
      const result:number[][] = JSON.parse(e);
      if (result.length && !result.some(el => !el.length)) {
        arrays.value = result;
      }
    } catch(err) {
      alert('Помилка при читанні файлу');
    }
  }

</script>

<style lang="scss">

  * {
    box-sizing: border-box;
  }

  body {  
    margin: 0;
    padding: 0;
    font-family: Arial, Helvetica, sans-serif;
    // background-color: #9a9a9a;
    
    &::-webkit-scrollbar {
      width: 8px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #c4c4c4;
    }
  }

  .container {
    width: 100%;
    max-width: 1240px;
    padding: 20px;
    margin: 0 auto;
  }

  .main {

    &__student-info {
      margin-bottom: 50px;
      display: flex;
    }

    &__plots {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    &__plot-title {
      font-weight: 600;
      font-size: 20px;
      margin-top: 70px;
      margin-bottom: 0;
    }

    &__plot {
      max-height: 500px;
      margin: 30px auto;
      width: 70%;
    }

    &__content {
      display: flex;
      flex-direction: column;
    }

    &__array {
      margin-bottom: 10px;
    }

    &__options {
      margin-top: 20px;
      display: flex;
      gap: 20px;
      align-items: center;
      flex-wrap: wrap;
    }

    &__range {
      max-width: 70px;
    }

    &__result-btn {
      margin: 0 auto;
      font-size: 20px !important;
    }
  }
</style>
