<template>
  <div>
    <div class="comment-post">
      <div class="avatar">
        <span>{{ user.name[0].toUpperCase() }}</span>
      </div>
      <div class="comment-content-box editing">
        <textarea
          class="comment-content-input"
          placeholder="添加评论……"
          ref="content"
        ></textarea>
        <button class="btn btn-edit" @click="postNewContent">保存</button>
      </div>
    </div>

    <ul class="comments" v-if="comments.rows">
      <li class="comment" v-for="comment of comments.rows" :key="comment.id">
        <div class="avatar">
          <span>{{ comment.user.name[0].toUpperCase() }}</span>
        </div>
        <div class="description">
          <div class="header">
            <strong>{{ comment.user.name }}</strong>
            <span> at </span>
            <i>{{ comment.createdAt | dateTime }}</i>
          </div>
          <div class="content">{{ comment.content }}</div>
        </div>
      </li>
    </ul>

    <div class="comment-pagination">
        <Pagination :pages="comments.pages" :page="comments.page"
        @changePage='changePage'
        ></Pagination>
    </div>
  </div>
</template>

<script>
import dateTime from "@/filters/dateTime";
import Pagination from "@/components/Pagination.vue"
export default {
  name: "Comment",
  filters: {
    dateTime,
  },
  components:{
      Pagination
  },
  props: {
    card: {
      type: Object,
      require: true,
    },
  },
  data() {
    return {
      comments: {},
    };
  },
  computed: {
    user() {
      return this.$store.state.user.info;
    },
  },

  async created() {
    await this.getComments();
  },
  methods: {
      async changePage(page){
          await this.getComments(page)
      },

    async getComments(page = 1) {
      try {
        let rs = await this.$store.dispatch("comment/getComments", {
          boardListCardId: this.card.id,
          page,
        });
        this.comments = rs.data;
      } catch (e) {}
    },

    async postNewContent() {
      let value = this.$refs.content.value;

      try {
        if (value.trim() !== "") {
          let rs = await this.$store.dispatch("comment/postContent", {
            boardListCardId: this.card.id,
            content: value,
          });
        } else {
          this.$refs.content.focus();
        }
        await this.getComments();
        this.$message.success("成功");
        this.$refs.content.value = "";
      } catch (e) {}
    },
  },
};
</script>

<style>
</style>