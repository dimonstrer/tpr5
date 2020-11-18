export default {
    namespaced: true,
    state: {
        form: {
            APlayerStrategies: null,
            BPlayerStrategies: null,
            isIterationResult: false,
            precision: 0,
            iterationCount: 0
        },
        payMatrix: [],
        APlayerGame: [],
        BPlayerGame: [],
        AStrategy: 0,
        BStrategy: 0,
        AProbabilities: [],
        BProbabilities: [],
        resultTable: []
    },

    getters: {
        form: state=>state.form,
        APlayerGame: state => state.APlayerGame,
        BPlayerGame: state => state.BPlayerGame,
        AStrategy: state => state.AStrategy,
        BStrategy: state => state.BStrategy,
        AProbabilities: state => state.AProbabilities,
        BProbabilities: state => state.BProbabilities,
        payMatrix: state => state.payMatrix,
        resultTable: state => state.resultTable
    },

    mutations: {
        SET_PAY_MATRIX(state, payload){
            state.payMatrix = payload;
        },
        INIT(state){
            state.APlayerGame = [];
            state.BPlayerGame = [];
            state.AStrategy = 0;
            state.BStrategy = 0;
            state.AProbabilities = [];
            state.BProbabilities = [];
            state.resultTable = [];

            for(let i=0; i<state.payMatrix.length; i++){
                state.APlayerGame.push(0);
                state.AProbabilities.push(0);
            }
            for(let i=0; i<state.payMatrix[0].length; i++){
                state.BPlayerGame.push(0);
                state.BProbabilities.push(0);
            }
        },
        ADD_VALUE_TO_PLAYER(state, {payload, player, iteration}){
            let currentGame = [];
            if(player == 'A') {
                let result = {
                    k: iteration
                };

                for (let i = 0; i < state.APlayerGame.length; i++) {
                    state.APlayerGame[i] += payload[i];
                    result[`g${i+1}`] = state.APlayerGame[i];
                }

                currentGame = [...state.APlayerGame];
                currentGame.map(x=> (x/iteration).toFixed(4));
                let Mk = Math.min(...currentGame);
                let jk = currentGame.indexOf(Mk);
                state.BStrategy = jk;

                result.Mk = (Mk/iteration).toFixed(4);
                result.jk = jk+1;
                state.resultTable.push(result);

            }else{
                let result = state.resultTable.find(x=>x.k == iteration);
                for (let i = 0; i < state.BPlayerGame.length; i++) {
                    state.BPlayerGame[i] += payload[i];
                    result[`h${i+1}`] = state.BPlayerGame[i];
                }
                currentGame = [...state.BPlayerGame];
                currentGame.map(x=> (x/iteration).toFixed(4));
                let Vk = Math.max(...currentGame);
                let ik = currentGame.indexOf(Vk);
                state.AStrategy = ik;

                result.Vk = (Vk/iteration).toFixed(4);
                result.ik = ik+1;
            }
        },
        ADD_PROBABILITY(state, {index, player}){
            if(player == 'A'){
                state.AProbabilities[index]++;
            }else{
                state.BProbabilities[index]++;
            }
        },
        PREPARE_RESULTS(state, iteration){
            state.AProbabilities = state.AProbabilities.map(x=>(x/iteration).toFixed(4));
            state.BProbabilities = state.BProbabilities.map(x=>(x/iteration).toFixed(4));
        },
        LOAD(state, {form, payMatrix}){
            state.form = form;
            state.payMatrix = payMatrix;
        }
    },

    actions: {
    }
};
