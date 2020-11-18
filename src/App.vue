<template>
  <div id="app" class="container">
    <h2 class="text-center" style="margin-top: 8px">Метод Брауна-Робинсона</h2>
    <Form ref="form" @load="load" @loadData="loadData"></Form>
    <div style="margin: 8px">
      <h3 class="text-center">Платежная матрица</h3>
      <pay-table ref="payMatrix" :row-count="form.APlayerStrategies" :column-count="form.BPlayerStrategies"></pay-table>
    </div>
    <div class="text-center">
      <a-button @click="start">Начать</a-button>
    </div>
    <div v-if="isResult" style="margin-top: 8px">
      <h3 class="text-center">Смешанные стратегии</h3>
      <p>Игрока А: {{AProbabilities}}</p>
      <p>Игрока B: {{BProbabilities}}</p>
      <h3 class="text-center">Оценки</h3>
      <p>Нижняя граница: {{resultTable[resultTable.length-1].Mk}}</p>
      <p>Верхняя граница: {{resultTable[resultTable.length-1].Vk}}</p>
      <p>Количество пройденных итераций {{currentIteration-1}}</p>
      <h3 class="text-center">Таблица с результатами</h3>
      <a-table
              :columns="columns"
              :data-source="resultTable">
      </a-table>
      <div class="text-center">
        <a-button type="primary" class="text-center" style="margin: 8px" @click="save">Сохранить</a-button>
      </div>
    </div>
  </div>
</template>

<script>
import Form from "@/components/Form";
import PayTable from "@/components/PayTable";
import {mapGetters} from "vuex";

export default {
  name: 'App',
  components: {
    Form,
    PayTable
  },
  computed:{
    ...mapGetters('Main', ['form','payMatrix', 'AStrategy', 'BStrategy', 'APlayerGame', 'BPlayerGame', 'AProbabilities',
      'BProbabilities', 'resultTable']),
    formEl(){
      return this.$refs.form;
    },
    file(){
      return this.formEl.$refs.file;
    }
  },
  data(){
    return{
      currentIteration: 1,
      isResult: false,
      initColumns: [
        {
          title: 'k',
          dataIndex: 'k',
        },
        {
          title: 'jk',
          dataIndex: 'jk',
        },
      ],
      columns: []
    }
  },
  methods:{
    start(){
      this.currentIteration = 1;
      this.$refs['payMatrix'].sendMatrixToStore();
      this.$store.commit('Main/INIT');

      while(this.getCondition()){
        let currentAStrat = this.AStrategy;
        let currentBStrat = this.BStrategy;
        this.findNextIteration(currentAStrat, 'A');
        this.findNextIteration(currentBStrat, 'B');
        this.currentIteration++;
      }
      this.printResults();
    },

    getCondition(){
      // eslint-disable-next-line no-debugger
      debugger;
      if(this.form.isIterationResult){
        return this.currentIteration <= this.form.iterationCount;
      }else {
        if(this.currentIteration == 1)
          return true;
        let currentResult = this.resultTable.find(x=> x.k == this.currentIteration-1);
        let average = (+currentResult.Mk + +currentResult.Vk)/2;
        return ((average - (+currentResult.Mk))>this.form.precision && ((+currentResult.Vk) - average)>this.form.precision);
      }
    },

    findNextIteration(index, player){
      let payload = [];
      if(player == 'A'){
        for(let i=0; i<this.payMatrix.length; i++){
          payload.push(this.payMatrix[i][index]);
        }
      }else{
        for(let i=0; i<this.payMatrix[index].length; i++){
          payload.push(this.payMatrix[index][i]);
        }
      }
      this.$store.commit('Main/ADD_VALUE_TO_PLAYER', { payload, player, iteration: this.currentIteration});
      this.$store.commit('Main/ADD_PROBABILITY', {index, player});
    },

    printResults(){
      this.addColumns();
      this.$store.commit('Main/PREPARE_RESULTS', this.currentIteration-1);
      this.isResult = true;
    },

    addColumns(){
      this.columns = this.initColumns;
      for(let i=0; i<this.payMatrix.length; i++){
        this.columns.push({
          title: `g${i+1}`,
          dataIndex: `g${i+1}`
        })
      }
      this.columns.push({
        title: 'Mk',
        dataIndex: 'Mk'
      });
      this.columns.push({
        title: 'Vk',
        dataIndex: 'Vk'
      });
      for(let i=0; i<this.payMatrix[0].length; i++){
        this.columns.push({
          title: `h${i+1}`,
          dataIndex: `h${i+1}`
        })
      }
      this.columns.push({
        title: 'ik',
        dataIndex: 'ik'
      })
    },

    save(){
      // eslint-disable-next-line no-debugger
      debugger;
      let saveData = {form: this.form, payMatrix: this.payMatrix};
      let jsonData = JSON.stringify(saveData);
      this.download(jsonData, 'МБР_Данные.json', 'text/plain');
    },

    download(content, fileName, contentType) {
      let a = document.createElement("a");
      let file = new Blob([content], {type: contentType});
      a.href = URL.createObjectURL(file);
      a.download = fileName;
      a.click();
    },

    load(){
      this.file.click();
    },

    loadData(){
      let file = this.file.files[0];
      let reader = new FileReader();

      reader.readAsText(file);
      let program = this;

      reader.onload = function() {
        let data = JSON.parse(reader.result);
        program.$store.commit('Main/LOAD', data);
      };


      setTimeout(()=> {
        this.$refs['payMatrix'].getMatrixFromStore();
        this.start();
      }, 500);
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.container{
  width: 1200px;
  margin: auto auto;
}

.text-center{
  text-align: center;
}
</style>
