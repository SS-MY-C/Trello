<template>
  <div id="board">
    <Header></Header>

    <main v-if="board">
      <h2>
        {{board.name}}
      </h2>
      <!--面板列表容器-->
      <div class="board">
        
        <List v-for="list of lists" :key="list.id" :data="list"
          @dragStart="dragStart"
          @dragMove='dragMove'
          @dragEnd='dragEnd'
        >
        </List>

        <!--无内容列表容器-->
        <div class="list-wrap no-content " :class="{'list-adding':listAdding}">
          <div class="list-add" @click="showListAdding">
            <span class="icon icon-add"></span>
            <span ref="textare">添加另一个列表</span>
          </div>

          <div class="list">
            <div class="list-cards">
              <div class="list-card-add-form">
                <input
                  class="form-field-input" ref="newListName"
                  placeholder="为这张卡片添加标题……"
                />
              </div>
            </div>

            <div class="list-footer">
              <div class="list-add-confirm">
                <button class="btn btn-success" @click="addNewList">添加列表</button>
                <span class="icon icon-close" @click="hideListAdding"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    

    <router-view key="Card"></router-view>

  </div>
</template>

<script>
import Header from '@/components/Header'
import List from '@/components/List'

export default {
  name:'Board',
  components:{
    Header,
    List
  },
  data() {
    return {
      listAdding:false
    }
  },
  computed:{
    board(){
      return this.$store.getters['board/getBoard'](this.$route.params.id);
    },
    lists(){
      return this.$store.getters['list/getLists'](this.$route.params.id);
    }
  },
  created() {
    if(!this.board){
      this.$store.dispatch('board/getBoard',this.$route.params.id);
    }
    if(!this.lists.length){
      this.$store.dispatch('list/getLists',this.$route.params.id)
    }
  },
  updated() {
    
  },
  methods: {
    // 显示添加
    showListAdding(){
      this.listAdding = true;
      this.$nextTick(()=>{
        this.$refs.newListName.focus();
      })
    },
    hideListAdding(){
      this.listAdding =false;
    },
    addNewList(){
      let name = this.$refs.newListName.value;

      if(name.trim() == ''){
        this.$message.warning('不能为空')
        this.$refs.newListName.focus();
      }else{
         try{
           this.$store.dispatch('list/postList',{
             boardId:this.board.id,
             name
           });
           this.$refs.newListName.value = '';
           this.$message.success('提交成功');
           this.listAdding = false;
         }catch(e){
         }
      }
      // this.listAdding = false;
      
    },
    dragStart(e){
      let el = e.component.$el;
      let board = el.parentNode;
      let lists = [...board.querySelectorAll('.list-wrap')]; 
      el._index = lists.findIndex(list=>list == el)
    },
    dragMove(e){
      let el = e.component.$el;
      let board = el.parentNode;
      let lists = [...board.querySelectorAll('.list-wrap')];
      let currentIndex = lists.findIndex(list=>list == el);

      lists.forEach((list,index)=>{
        if(index !== currentIndex){
          let clientRect = list.getBoundingClientRect();
          if(
            e.x >= clientRect.left
            &&
            e.x <= clientRect.right
            &&
            e.y >= clientRect.top
            &&
            e.y <= clientRect.bottom
          ){
            if(currentIndex < index){
              board.insertBefore(el,list.nextElementSibling);
            }else{
              board.insertBefore(el,list);
            }
          }
        }
      })
      
    },
    async dragEnd(e){
      let el = e.component.$el;
      let board = el.parentNode;
      let lists = [...board.querySelectorAll('.list-wrap-content')];

      let currentIndex = lists.findIndex(list => list==el)
      //判断当前元素是否移动
      if(el._index !== currentIndex){
        let newOrder;
        let preOrder = lists[currentIndex - 1] && parseFloat(lists[currentIndex - 1].dataset.order);
        let nextOrder = lists[currentIndex + 1] && parseFloat(lists[currentIndex + 1].dataset.order);
        // console.log(1);
        if(currentIndex == 0){
          newOrder = nextOrder / 2;
        }else if (currentIndex == lists.length -1){
          newOrder = preOrder + 65535;
        }else{
          newOrder = preOrder + (nextOrder - preOrder)/2
        }
        // console.log(newOrder);
        await this.$store.dispatch('list/editList',{
          boardId:this.board.id,
          id:e.component.data.id,
          order:newOrder
        })
      }

    }
  },
};
</script>

<style>
</style>