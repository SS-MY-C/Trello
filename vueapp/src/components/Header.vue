<template>
  <header>
      <div class="left">
        <router-link :to="{name:'Home'}" class="btn btn-icon"
          >
          <i class="icon icon-home"></i>
        </router-link>
        <router-link :to="{name:'Board'}" href="" class="btn btn-icon">
          <i class="icon icon-board">
            <span class="txt">看板</span>
          </i>
        </router-link>
      </div>
      <a href="" class="logo"></a>
      <div class="right">
        <a href="" class="btn btn-icon"
          >
          <i class="icon icon-add"></i>
        </a>
        <Popup :title='username' ref="popup">
          <button class="avatar">
            <span>{{username[0].toUpperCase()}}</span>
          </button>
          <Popupmenu slot='content' :items="menuItems" @command="execute"></Popupmenu>
        </Popup>
      </div>
    </header>
</template>

<script>
import Popup from './Popup';
import Popupmenu from './Popupmenu.vue';
import {mapState} from 'vuex';
export default {
  name:'Header',
  data() {
    return {
      menuItems:[
        {name:'退出', command:'logout'},
        {name:'123',command:'123'},
        {separator:"true"},
        {name:'456',command:'30'}
      ]
    }
  },
  components:{
    Popup,
    Popupmenu
  },
  computed:{
    ...mapState('user',{
      username:state=>state.info.name
    })
  },
  methods: {
    execute(command){
      // console.log(command);
      switch(command){
        case 'logout':
          this.logout();
          break;
        default:
          break;
      }
    },
    logout(){
      this.$store.dispatch('user/logout');

      this.$router.push({name:'Login'});
      // this.$refs.popup.close()
    }
  },
}
</script>

<style>

</style>