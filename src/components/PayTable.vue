<template>
    <table ref="table" class="table text-center">
        <tr v-for="i in rowCount+1" v-bind:key="i">
            <td v-for="j in columnCount+1" v-bind:key="j" width="50">
                <p v-if="isHeader(i,j)">{{ getHeader(i,j) }}</p>
                <a-input-number width="50px" :defaultValue="0" v-else />
            </td>
        </tr>
    </table>
</template>

<script>
import {mapGetters} from "vuex";

export default {
    props:{
        rowCount: Number,
        columnCount: Number
    },
    computed: {
        ...mapGetters('Main', ['payMatrix'])
    },
    methods:{
        isHeader(i, j){
            if(i == 1 && j != 1 || i != 1 && j == 1 || i== 1 && j == 1){
                return true;
            }
            return false;
        },
        getHeader(i,j){
            if(i == 1 && j != 1){
                return `Страт ${j-1}`;
            }
            if(i != 1 && j == 1){
                return `Страт ${i-1}`;
            }
            return '';
        },
        sendMatrixToStore(){
            let table = this.$refs['table'];
            let payMatrix = [];
            for(let i=1; i<table.rows.length; i++){
                let row = [];
                for(let j=1; j<table.rows[i].cells.length; j++){
                    row.push(+(table.rows[i].cells[j].querySelector('input').value))
                }
                payMatrix.push(row);
            }
            this.$store.commit('Main/SET_PAY_MATRIX', payMatrix);
        },

        getMatrixFromStore(){
            // eslint-disable-next-line no-debugger
            debugger;
            let table = this.$refs['table'];
            for(let i=0; i<this.payMatrix.length; i++){
                for(let j=0; j<this.payMatrix[i].length; j++){
                    table.rows[i+1].cells[j+1].querySelector('input').value = this.payMatrix[i][j];
                }
            }
        }
    }
}
</script>

<style>
.table {
    border-collapse: collapse;
    border-color: black;
}
</style>