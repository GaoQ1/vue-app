<template>
  <div class="login">
    <h3 class="login__header">恒大协同审图系统登录页面</h3>
    <el-form :model="login" class="login__body">
      <el-row>
        <el-col :span="12" :offset="6">
          <el-input v-model="login.email" placeholder="请输入邮箱账号" auto-complete="off"></el-input>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12" :offset="6">
          <el-input type="password" v-model="login.password" placeholder="请输入密码" auto-complete="off"></el-input>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12" :offset="6">
          <el-button type="primary" @click="onSubmit">登录</el-button>
        </el-col>
      </el-row>

    </el-form>
  </div>
</template>

<script>
  import { post } from '@/assets/fetch'
  import Cookies from 'js-cookie'
  export default {
    name: 'login',
    data() {
      return {
        login: {
          email: undefined,
          password: undefined,
          rememberMe: true
        }
      };
    },
    methods: {
      onSubmit() {
        post(`api/coord/login`,{data: this.login}).then(data => {
          Cookies.set('sessionId', data.sessionId)
          this.$router.push({path: '/'})
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../styles/home.scss";
  .login{
    @include e('header'){
      text-align: center;
    };

    @include e('body'){
      text-align: center;
    };
  }
</style>
