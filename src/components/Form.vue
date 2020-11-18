<template>
    <a-form-model layout="inline" :model="form" @submit.native.prevent="simulate">
        <a-form-model-item label="Кол-во стратегий игрока А">
            <a-input-number :min="1" v-model="form.APlayerStrategies"></a-input-number>
        </a-form-model-item>

        <a-form-model-item label="Кол-во стратегий игрока B">
            <a-input-number :min="1" v-model="form.BPlayerStrategies"></a-input-number>
        </a-form-model-item>

        <a-form-model-item label="Завершение">
            <a-switch
                    checked-children="Итерации"
                    un-checked-children="Точность"
                    v-model="form.isIterationResult"
            ></a-switch>
        </a-form-model-item>

        <a-form-model-item v-if="form.isIterationResult" label="Кол-во итераций">
            <a-input-number :min="1" v-model="form.iterationCount"></a-input-number>
        </a-form-model-item>

        <a-form-model-item v-else label="Точность">
            <a-input-number :min="0" :step="0.01" v-model="form.precision"></a-input-number>
        </a-form-model-item>
        <a-form-model-item>
            <a-button @click="$emit('load')">Загрузить</a-button>
            <input type="file" hidden ref="file" @change="$emit('loadData')"/>
        </a-form-model-item>
    </a-form-model>
</template>

<script>
import {mapGetters} from "vuex";

export default {
    data(){
        return {
        }
    },
    methods:{
        simulate(){

        }
    },
    computed: {
        ...mapGetters('Main', ['form'])
    }
}
</script>