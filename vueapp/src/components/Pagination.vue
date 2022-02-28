<template>
  <div class="pagination">
        <span v-if="firstShowPage > 1" @click="gotoPage(1)">首页</span>
        <span @click="gotoPage(page-1)">上一页</span>
        <span @click="drawPage">...</span>
        <span v-for="showPage of showPages" 
        :class="{'current-page':showPage == page}"
        @click="gotoPage(showPage)"
        >
            {{showPage}}
        </span>
        <span @click="upPage">...</span>
        <span @click="gotoPage(page+1)">下一页</span>
        <span v-if="lastShowPage < this.pages" @click="gotoPage(pages)">尾页</span>
      
    </div>
</template>

<script>
export default {
    name:'Pagination',
    props:{
        pages:{
            type:Number,
            default:1
        },
        page:{
            type:Number,
            default:1
        }
    },
    data(){
        return{
            showPagesNumber : 5
        }
    },
    computed:{
        showPages(){
            let arr = [this.page];
            let prePage = this.page;
            let nextPage = this.page;
            let count = this.showPagesNumber - 1;
            while(count>0){
                if(prePage>1 && count>0){
                    // let a = prePage - 1;z
                    arr.unshift(--prePage);
                    count--
                }
                if(nextPage<this.pages && count>0){
                    arr.push(++nextPage);
                    count--;
                }
                if(prePage<=1 && nextPage>=this.pages) break;
            }
            return arr
        },
        firstShowPage(){
            return this.showPages[0]
        },
        lastShowPage(){
            return this.showPages[this.showPages.length - 1]
        }
    },
    methods: {
        gotoPage(n){
            n = Math.max(1,n);
            n = Math.min(n,this.pages);
            if(n!==this.page){
                this.$emit('changePage',n)
            }
        },
        drawPage(){
            let a = this.page-(this.showPagesNumber-1)>1?this.page-(this.showPagesNumber-1):1
            this.gotoPage(a)
        },
        upPage(){
            let a = this.page+(this.showPagesNumber-1)<this.pages?this.page+(this.showPagesNumber-1):this.pages-1
            this.gotoPage(a)
        }
        
    },
}
</script>

<style>

</style>