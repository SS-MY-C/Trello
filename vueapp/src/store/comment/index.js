import * as api from '../../api/axios'

export default {
    namespaced:true,
    state:{

    },

    actions:{
        getComments:async({},params)=>{

            return api.getComments(params)
        },
        postContent:async({},data)=>{

            return api.postContent(data)
        },
    }
}