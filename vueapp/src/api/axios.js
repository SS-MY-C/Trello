import axios from 'axios';
import Message from '../components/Message/Message.js'
axios.defaults.baseURL = '/api';
//拦截器
axios.interceptors.request.use(configs=>{
    try{
        let data = JSON.parse(localStorage.getItem('user'));
        if(data.authorization){
            configs.headers.common.authorization = data.authorization;
        }
    }catch(e){}

    return configs
})
axios.interceptors.response.use(response=>{
    return response
},error=>{
    // console.dir(error);
    let {message , errDetails} = error.response.data
    if(errDetails){
        message += ',' + errDetails;
    }
    Message.error(message)

    throw error;
})

//注册
export const register = data=>{
    return axios({
        method:'post',
        url:'/user/register',
        data
    })
}

//登录
export const login = data =>{
    return axios({
        method:'post',
        url:'/user/login',
        data
    })
}

//面板
export const getBoards = ()=>{
    return axios({
        url:'/board'
    })
}

//提交新面板
export const postBoard = data=>{
    return axios({
        method:'post',
        url:'/board',
        data
    })
}

//获取一个看板
export const getBoard = id=>{
    return axios({
        url:'/board/'+id,
    })
}

// 获取指定面板下的列表集合
export const getLists = boardId =>{
    return axios({
        url:'/list',
        params:{
            boardId
        }
    })
}

export const postList =data =>{
    return axios({
        method:'post',
        url:'/list',
        data
    })
};
//更新列表信息
export const putList = data => {
    return axios({
        method: 'put',
        url: '/list/' + data.id,
        data: {
            boardId: data.boardId,
            name: data.name,
            order: data.order
        }
    })
};

export const deleteList = data =>{
    return axios({
        method:'delete',
        url:'/list/' + data.id,
        data:{
            boardId: data.boardId,
            order: data.order
        }
    })
}

export const getCards = boardListId =>{
    return axios({
        url:'/card',
        params:{
            boardListId
        }
    })
}
// 添加一张卡片
export const postCard = data=>{
    return axios({
        method:'post',
        url:'/card',
        data
    })
}
// 修改指定卡片
export const putCard = data=>{
    return axios({
        method:'put',
        url:'/card/'+data.id,
        data:{
            boardListId: data.boardListId,
            name: data.name,
            order: data.order,
            description:data.description
        }
    })
}

export const uploadAttachment = data =>{
    let fd = new FormData();
    fd.append('boardListCardId',data.boardListCardId);
    fd.append('attachment',data.file);

    return axios({
        method:'post',
        url:'/card/attachment',
        data:fd
    })
}
// 删除附件
export const removeAttachment = data =>{
    return axios({
        method:'delete',
        url:'/card/attachment/' + data.id
    })
}
// 设置封面
export const setCover = data =>{
    return axios({
        method:'put',
        url:'/card/attachment/cover/' + data.id
    })
}
// 移除封面
export const removeCover = data =>{
    return axios({
        method:'delete',
        url:'/card/attachment/cover/' + data.attachmentId
    })
}

export const getComments = params =>{
    return axios({
        url:'/comment',
        params
    })
}


export const postContent = data =>{
    return axios({
        method:'post',
        url:'comment',
        data
    })
}