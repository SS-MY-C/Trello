import Vue from 'vue';
import Message from './Message.vue';

const MessageClass = Vue.extend(Message);
let instances = [];
//工厂函数
function FacMessage(data){
    data = data || {};
    if(typeof data == 'string'){
        data={
            message:data
        }
    }
    
    data.onClose = function(){
        FacMessage.close(instance)
    }

    let instance = new MessageClass({
        data
    })
    // instance.$mount();
    // document.body.appendChild(instance.$el)

    // let offset = data.offset || 40;
    // let offsetTop = offset;
    // instances.forEach(item=>{
    //     offsetTop += item.$el.offsetHeight + 20
    // })
    // instance.$el.style.top = offsetTop + 'px';
    // // offsetTop = offset;
    // instances.push(instance);
    
    instances.push(instance)
    let offset = data.offset || 40;
    let offsetTop = offset
    instance.$mount();
    
    document.body.appendChild(instance.$el)
    for(let i=0;i<instances.length;i++){
        offsetTop = (instance.$el.offsetHeight + 20)*(i) + 40
        instances[i].$el.style.top = offsetTop +  'px'
        console.log(instance.$el.offsetHeight);
    }
    
}
FacMessage.close = function(instance){
    let removeHeight = instance.$el.offsetHeight + 20;
    let index = instances.findIndex(item=>item == instance);
    instances = instances.filter(item=>item!==instance);
    for(let i=index;i<instances.length;i++){
        instances[i].$el.style.top = parseFloat(instances[i].$el.style.top) - removeHeight + 'px';
    }
}
let typesuccess = ['info','success','error','warning'];
typesuccess.forEach(type=>{
    FacMessage[type] = function(data){
        if(typeof data == 'string'){
            data={
                message:data
            }
        };
        return FacMessage({
            ...data,
            type
        });
    }
})
export default FacMessage;