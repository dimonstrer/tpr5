import Vuex from 'vuex';
import Vue from 'vue';
import Main from './main/index';

Vue.use(Vuex);

let store = new Vuex.Store({
    modules: {
        Main
    }
});

export default store;