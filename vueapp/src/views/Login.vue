<template>
  <div id=register-login>
      <a href="/" class="logo"></a>
      <div class="section-wrapper">
        <div class="account-form">
          <h1>登录到 Trello</h1>
          <form action="" id="register-form" method="POST" @submit.prevent="loginSubmit">
            <div>
              <label>
                <input 
                v-model="user.name"
                class="form-field" 
                autofocus="autofocus"
                placeholder="输入用户名"
                />
              </label>
            </div>
            <div>
              <label>
                <input v-model="user.password" type="password" class="form-field" 
                autofocus="autofocus"
                placeholder="输入密码"
                />
              </label>
            </div>
            <div>
              <input type="submit" class="btn btn-success" value="登录"/>
              <span class="signin-signup-separator">或者</span>
              <input type="button" class="btn" value="注册" name="" id="" />
            </div>
          </form>
        </div>
      </div>
  </div>
</template>

<script>
export default {
  name:'Login',
  data(){
    return {
      user:{
        name:'',
        password:''
      }
    }
  },
  methods: {
    async loginSubmit(){
      if(this.user.name.trim() == '' || this.user.password.trim() == ''){
        return this.$message({
          message:'用户名和密码不能为空',
          type:'error',
          duration:2000
        })
        // return alert('用户名和密码不能为空');
      }

      try{
        await this.$store.dispatch('user/login',{ ...this.user });
        this.$router.push({name:"Home"});

      }catch(e){

      }
    }
  },
}
</script>

<style>

</style>