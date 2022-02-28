import * as api from '../../api/axios'

export default {
    namespaced:true,
    state:{
        lists:[]
    },

    getters:{
        getLists:({lists})=>boardId=>lists.filter(list=>list.boardId == boardId),
        getList:({lists})=>listId=>lists.find(list=>list.id == listId)
    },

    mutations:{
        updateLists:(state,data)=>{
            state.lists = [...state.lists,...data]
        },

        addList:(state,data)=>{
            state.lists = [...state.lists,data];
        },
        updateList:(state,data)=>{
            state.lists = state.lists.map(list=>{
                if(list.id == data.id){
                    return {...list, ...data};
                }
                return list;
            }) 
        },
        deleteList:(state,data)=>{
            state.lists = state.lists.filter(list=>list.id !== data.id) 
        }
    },

    actions:{
        getLists:async({commit},boardId)=>{
            try{
                let rs = await api.getLists(boardId);
                commit('updateLists',rs.data)

                return rs;
            }catch(e){
                throw e
            }
        },

        postList:async({commit},data)=>{
            try{
                let rs = await api.postList(data);
                commit('addList',rs.data);
                return rs;
            }catch(e){
                throw e;
            }
        },

        editList:async ({commit},data)=>{
            try{
                let rs = await api.putList(data);
                commit('updateList',data);
                
                return rs;

            }catch(e){
                throw e
            }
        },
        deleteList:async ({commit},data)=>{
            try{
                let rs = await api.deleteList(data);
                commit('deleteList',data);
                return rs
            }catch(e){
                throw e
            }
        }
    }
}