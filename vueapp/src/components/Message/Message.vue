<template>
  <transition name="message-fade">
    <div
      :class="['message', 'message-' + type, center ? 'is-center' : '']"
      :style="{ top: offset + 'px' }"
      v-if="!isShow"
    >
      <p class="message-content">提示信息：{{ message }}</p>
      <i class="icon icon-close"></i>
    </div>
  </transition>
</template>

<script>
export default {
  name: "Message",

  data() {
    return {
      message: "这是默认信息",
      type: "success",
      center: true,
      offset: 40,
      isShow:false,
      duration:1000,
      timer:null,
      onClose:null
    };
  },

  mounted() {
    let timer = setTimeout(()=>{
      if(!this.isShow){
        this.close();
      }
    },this.duration)
  },

  methods: {
    close(){
      this.isShow = true;
      if(typeof this.onClose == 'function'){
        this.onClose(this)
      }
    },
  },
};
</script>

<style>
</style>