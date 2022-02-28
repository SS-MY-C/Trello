<template>
  <div id="home">
    <Header></Header>
    <main>
      <h2>
        <span class="icon icon-board"></span>
        我的看板
      </h2>
      <ul class="board-items">
        <router-link :to="{name:'Board' , params:{id:board.id}}" class="board-item" v-for="board of boards" :key="board.id" tag="li">
            <span class="title">{{board.name}}</span>
            <!-- <ExtrasMenu @click="popupMenu"></ExtrasMenu> -->
        </router-link>

        <li class="board-item create-new-board">
          <textarea
            class="title form-field-input"
            placeholder="创建新看板"
            ref="newBoardName"
            @blur="postBoard"
          ></textarea>
        </li>
      </ul>
    </main>
  </div>
</template>

<script>
import Header from '@/components/Header';
import ExtrasMenu from '@/components/ExtrasMenu';
import {mapState} from 'vuex';
export default {
  name:"Home",
  components:{
    Header,
    ExtrasMenu
  },
  computed:{
      ...mapState('board',{
        boards:state=>state.boards,
        inited:state=>state.inited
      })
  },
  created() {
    if(!this.inited){
      this.$store.dispatch('board/getBoards')
    }
  },
  methods: {
    postBoard(){
      let val = this.$refs.newBoardName.value;
      if(val.trim()!==""){
        try{
          this.$store.dispatch('board/postBoard',{
            name:val
          })
          this.$message.success('面板创建成功');
          this.$refs.newBoardName.value=''
        }catch{}
      }

    },
  },
};
</script>

<style>
</style>