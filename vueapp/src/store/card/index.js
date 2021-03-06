import * as api from '../../api/axios'
export default {
    namespaced:true,
    state:{
        cards:[]
    },

    getters:{
        getCards:({cards})=>BoardListId=>cards.filter(card=>card.boardListId == BoardListId),
        getCard:({cards})=>cardId=>cards.find(card=>card.id == cardId)
    },

    mutations:{
        updateCards:(state,datas)=>{
            state.cards = [...state.cards,...datas];
        },
        addCard: (state, data) => {
            state.cards = [...state.cards, data];
        },
        updateCard:(state,data)=>{
            state.cards = state.cards.map(card=>{
                if(card.id == data.id){
                    return [...state.card, ...data];
                }
                return card;
            }) 
        },
        addAttachment:(state,data)=>{
            state.cards = state.cards.map(card=>{
                if(card.id == data.boardListCardId){
                    return {
                        ...card,
                        attachments:[...card.attachments,data]
                    }
                }
                return card;
            })
        },
        removeAttachment:(state,data)=>{
            state.cards = state.cards.map(card=>{
                if(card.id == data.cardId){
                    return {
                        ...card,
                        attachments:card.attachments.filter(attachment=>attachment.id !== data.id)
                    }
                }
                return card;
            })
        },
        setCover:(state,data)=>{
            state.cards = state.cards.map(card=>{
                if(card.id == data.cardId){
                    return{
                        ...card,
                        attachments:card.attachments.map(attachment=>{
                            if(attachment.id == data.id){
                                return {
                                    ...attachment,
                                    isCover:true
                                }
                            }else{
                                return {
                                    ...attachment,
                                    isCover:false
                                }
                            }
                        })
                    }
                }
                return card;
            })
        },
        removeCover:(state,data)=>{
            state.cards = state.cards.map(card=>{
                if(card.id == data.cardId){
                    return{
                        ...card,
                        attachments:card.attachments.map(attachment=>{
                            return {
                                ...attachment,
                                isCover:false
                            }
                        })
                    }
                }
                return card;
            })
        }
    },

    actions:{
        getCards:async({commit},boardListId)=>{
            try{
                let rs = await api.getCards(boardListId);
                commit('updateCards',rs.data);
                return rs;
            }catch(e){
                throw e
            }
        },
        postCard:async({commit}, data)=>{
            try{
                let rs = await api.postCard(data);
                commit('addCard', rs.data);
                return rs;
            }catch(e){
                throw e;
            }
        },
        editCard:async ({commit},data)=>{
            try{
                let rs = await api.putCard(data);
                commit('updateCard',data);
                
                return rs;

            }catch(e){
                throw e
            }
        },
        uploadAttachment:async({commit},data)=>{
            try{
                let rs = await api.uploadAttachment(data);
                commit('addAttachment',rs.data);

                return rs;
            }catch(e){
                throw e
            }
        },

        setCover:async({commit},data)=>{
            try{
                let rs = await api.setCover(data);
                commit('setCover',data);

                return rs;
            }catch(e){
                throw e
            }
        },
        removeCover:async({commit},data)=>{
            try{
                let rs = await api.removeCover(data);
                commit('removeCover',data);

                return rs;
            }catch(e){
                throw e
            }
        },
        removeAttachment:async({commit},data)=>{
            try{
                let rs = await api.removeAttachment(data);
                commit('removeAttachment',data);

                return rs;
            }catch(e){
                throw e
            }
        },
    }


}