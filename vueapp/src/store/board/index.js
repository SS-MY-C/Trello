import {getBoards,postBoard,getBoard} from '../../api/axios';

export default {
    namespaced:true,
    state:{
        inited:false,
        boards : null
    },

    getters:{
        getBoard:({boards})=>id=>Array.isArray(boards)?boards.find(board=>board.id==id) : null
    },
    mutations:{
        updateBoards(state,data){
            state.boards = data;
            state.inited = true
        },
        addBoard:(state,data)=>{
            if(state.boards === null){
                state.boards = []
            }
            state.boards = [...state.boards, data]
        }
    },
    actions:{
        getBoards:async({commit})=>{
            try{
                let rs = await getBoards();
                commit('updateBoards',rs.data);
                return rs;
                
            }catch(e){
                throw e
            }
        },

        getBoard:async({commit},id)=>{

            try{
                let rs = await getBoard(id)
                commit('addBoard',rs.data)
                return rs
            }catch(e){
                throw e
            }
        },

        postBoard:async({commit},data)=>{
            try{
                let rs = await postBoard(data);

                commit('addBoard',rs.data)
                return rs
            }catch(e){
                throw e
            }
        },

        
    }

}