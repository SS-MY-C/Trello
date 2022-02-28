<template>
  <router-link :to="{name:'Card',params:{listId:data.boardListId,cardId:data.id}}" class="list-card" v-if="data" @oncontextmenu="rightMenudeleteCard">
    <div
      v-if="data.coverPath"
      class="list-card-cover"
      :style="'background-image: url(' + data.coverPath + ');'"
    ></div>
    <div class="list-card-title">{{ data.name }}</div>
    <div class="list-card-badges">
      <div class="badge" v-if="data.description">
        <span class="icon icon-description"></span>
      </div>
      <div class="badge" v-if="data.commentCount">
        <span class="icon icon-comment"></span>
        <span class="text">{{ data.commentCount }}</span>
      </div>
      <div
        class="badge"
        v-if="Array.isArray(data.attachments) && data.attachments.length"
      >
        <span class="icon icon-attachment"></span>
        <span class="text">{{ data.attachments.length }}</span>
      </div>
    </div>
  </router-link>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
    },
  },
  methods: {
    rightMenudeleteCard(){
      console.log(1);
    }
  },
};
</script>

<style>
</style>