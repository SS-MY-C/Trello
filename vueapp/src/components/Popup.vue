<template>
  <div class="popup-container">
    <div @click="open">
        <slot></slot>
    </div>
    <!--弹窗，可用于对话框、弹出式菜单等-->
    <!--弹出式菜单-->
    <div class="popup" v-show="isShow" ref="popup"> 
      <div class="popup-header">
        <span class="popup-title">{{title}}</span>
        <a class="popup-header-close"  ref="close">
          <i class="icon icon-close"></i>
        </a>
      </div>

      <div class="popup-content">
        <slot name="content"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    name:'Popup',
    data() {
        return {
            isShow:false
        }
    },
    props:{
        title:{
            type:String,
            default:'菜单'
        }
    },
    methods: {
        open(){
            this.isShow = true;

            window.addEventListener('click',this.close)

            let $popup = this.$refs.popup;
            this.$nextTick(()=>{
                $popup.style.left = '0px'
                let $popupRect = $popup.getBoundingClientRect();
                
                let left = 0;

                if($popupRect.right > window.innerWidth ){
                    left = -$popupRect.width + this.$el.offsetWidth;
                }
                $popup.style.left = left+'px'
            });

            this.$emit('open')
        },
        close(e){
            if( !e||!e.path.includes(this.$el) || e.path.includes(this.$refs.close) ){
                this.isShow = false;
                this.$emit('close');
                window.removeEventListener('click',this.close)
            }
        }
    },
}
</script>

<style>

</style>