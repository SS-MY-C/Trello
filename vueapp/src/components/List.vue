<template>
  <div
    class="list-wrap list-wrap-content"
    :class="{ 'list-adding': listAdding }"
    :data-order="data.order"
  >
    <div class="list-placeholder" ref="listPlaceholder"></div>

    <div class="list" ref="list">
      <div class="list-header" ref="listHeader">
        <textarea
          class="form-field-input"
          ref="newBoardListName"
          @mousedown.prevent
          @blur="editListName"
          >{{ data.name }}</textarea
        >
        <div class="extras-menu">
          <Popup  ref="popup">
            <span class="icon icon-more"></span>
            <Popupmenu slot='content' :items="menuItems" @command="execute"></Popupmenu>
          </Popup>
        </div>
      </div>

      <div class="list-cards">
        <Card v-for="card of cards" :key="card.id" :data='card'></Card>
        <div class="list-card-add-form">
          <textarea
            class="form-field-input"
            placeholder="为这张卡片添加标题"
            ref="newListName"
          ></textarea>
        </div>
      </div>

      <div class="list-footer">
        <div class="list-card-add" @click="showListCardAddForm">
          <span class="icon icon-add"></span>
          <span>添加另一张卡片</span>
        </div>
        <div class="list-add-confirm">
          <button class="btn btn-success" @click="addNewCard">添加卡片</button>
          <span class="icon icon-close" @click="hideListCardAddForm"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Card from '@/components/Card.vue'
import Popupmenu from '@/components/Popupmenu.vue'
import Popup from '@/components/Popup.vue'
import {mapState} from 'vuex'
export default {
  name: "List",
  data() {
    return {
      drag: {
        isDown: false,
        isDrag: false,
        downClientX: 0,
        downClientY: 0,
        downElementX: 0,
        downElementY: 0,
      },
      listAdding:false,
      menuItems:[
        {name:'删除列表', command:'deleteList'},
      ]
    };
  },
  components:{
    Card,
    Popupmenu,
    Popup
  },
  props: {
    data: {
      type: Object,
    },
  },
  computed:{
    cards(){
      return this.$store.getters['card/getCards'](this.data.id);
    },
    ...mapState('user',{
      username:state=>state.info.name
    }),
    lists(){
      return this.$store.getters['lists/getLists']
    }
  },
  async created() {
    if(!this.cards.length){
      await this.$store.dispatch('card/getCards',this.data.id);
    }
  },
  mounted() {
    this.$refs.listHeader.addEventListener("mousedown", this.dragDown);
    document.addEventListener("mousemove", this.dragMove);
    document.addEventListener("mouseup", this.dragUp);
  },

  methods: {
    dragDown(e) {
      this.drag.isDown = true;
      this.drag.downClientX = e.clientX;
      this.drag.downClientY = e.clientY;
      let pos = this.$refs.list.getBoundingClientRect();
      this.drag.downElementX = pos.x;
      this.drag.downElementY = pos.y;
    },
    dragMove(e) {
      if (this.drag.isDown) {
        let listElement = this.$refs.list;
        let x = e.clientX - this.drag.downClientX;
        let y = e.clientY - this.drag.downClientY;

        if (x > 10 || y > 10) {
          if (!this.drag.isDrag) {
            this.drag.isDrag = true;

            this.$refs.listPlaceholder.style.height =
              listElement.offsetHeight + "px";

            listElement.style.position = "absolute";
            listElement.style.zIndex = 99999;
            listElement.style.transform = "rotate(5deg)";
            document.body.appendChild(listElement);

            this.$emit("dragStart", {
              component: this,
            });
          }
          listElement.style.left = this.drag.downElementX + x + "px";
          listElement.style.top = this.drag.downElementY + y + "px";

          this.$emit("dragMove", {
            component: this,
            x: e.clientX,
            y: e.clientY,
          });
        }
      }
    },
    dragUp(e) {
      // this.drag.isDown = false
      if (this.drag.isDown) {
        if (this.drag.isDrag) {
          let listElement = this.$refs.list;

          this.$refs.listPlaceholder.style.height = 0 + "px";

          listElement.style.position = "relative";
          listElement.style.zIndex = 0;
          listElement.style.left = 0;
          listElement.style.top = 0;
          listElement.style.transform = "rotate(0deg)";
          this.$el.appendChild(listElement);

          this.$emit("dragEnd", {
            component: this,
          });
        } else {
          if (e.path.includes(this.$refs.newBoardListName)) {
            this.$refs.newBoardListName.select();
          }
        }

        this.drag.isDown = this.drag.isDrag = false;
      }
    },

    async editListName(){
      let {value , innerHTML} = this.$refs.newBoardListName;
      // console.log(val,this.$refs.newBoardListName.innerHTML);
      if(value !== innerHTML){
        await this.$store.dispatch('list/editList',{
          boardId:this.data.boardId,
          id:this.data.id,
          name:value,
          order:this.data.order
        })
      }
    },

    // 添加列表
    showListCardAddForm(e){
      this.listAdding = true;
      this.$nextTick(()=>{
        this.$refs.newListName.focus();
      })
    },
    hideListCardAddForm(){
      this.listAdding = false;
      this.$refs.newListName.value ='';
    },
    addNewCard(){
      
      let {value} = this.$refs.newListName;
      if(value.trim() !== ''){
        try{
            this.$store.dispatch('card/postCard',{
            boardListId:this.data.id,
            name:value
          });
          this.$message.success('添加成功')
          this.listAdding = false;
        }catch(e){

        }
      }else{
        this.$refs.newListName.focus();
        this.$message.warning('输入不能为空');
      }
    },
    execute(command){
      // console.log(command);
      switch(command){
        case 'deleteList':
          this.deleteList();
          break;
        default:
          break;
      }
    },
    
    deleteList(){
      // this.$emit('deleteLi',deleteLi)
      try{
        this.$store.dispatch('list/deleteList',{
          boardId:this.data.boardId,
          id:this.data.id,
          order:this.data.order
        })
        this.$message.success('删除成功')
      }catch(e){}
    }
  },
};
</script>

<style>
</style>