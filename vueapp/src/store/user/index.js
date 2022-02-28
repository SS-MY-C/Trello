import { register ,login} from "../../api/axios"

export default {
    namespaced:true,
    state: {
        info:null
    },
    mutations: {
        initUserInfo:state=>{
            let data = JSON.parse(localStorage.getItem('user'));
            state.info = data;
        },
        updateUserInfo:(state,data)=>{
            state.info = data;
            // console.log(data);
            localStorage.setItem('user',JSON.stringify(data));
        },
        removeUserInfo(state,data){
            state.info = null;
            localStorage.removeItem('user')
        }
    },
    actions: {
        register:({},data)=>{
            return register(data)
        },

        login:async ({commit},data)=>{
            try{
                let rs =await login(data);
                commit('updateUserInfo',{
                    id:rs.data.id,
                    name:rs.data.name,
                    authorization:rs.headers.authorization
                });
                return rs;
            }catch(e){
                throw e
            }

        },
        logout:async ({commit})=>{
            commit('removeUserInfo')
        }
    }
}