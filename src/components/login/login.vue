<template>
  <el-form :model="loginForm" :rules="rules" ref="loginForm" label-position="left" label-width="0px"
           class="login-container">
    <h3 class="title">系统登录</h3>
    <el-form-item prop="account">
      <el-input type="text" v-model="loginForm.account" auto-complete="off" placeholder='账号'></el-input>
    </el-form-item>
    <el-form-item prop="checkPass">
      <el-input type="password" v-model="loginForm.checkPass" auto-complete="off" placeholder='密码'></el-input>
    </el-form-item>
    <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit" :loading='logining'>登录
      </el-button>
      <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
    </el-form-item>
  </el-form>
</template>

<script>
  // import { requestLogin } from '../../api/api';
  // import api from 'src/api';
  // import NProgress from 'nprogress'
  // import { post } from 'src/api/api';

  export default {
    data() {
      return {
        logining: false,
        loginForm: {
          account: 'admin',
          checkPass: 'zlzk.157'
        },
        rules: {
          account: [
            {required: true, message: '请输入账号', trigger: 'blur'}
            // { validator: validaePass }
          ],
          checkPass: [
            {required: true, message: '请输入密码', trigger: 'blur'}
            // { validator: validaePass2 }
          ]
        },
        checked: true
      };
    },
    methods: {
      handleReset() {
        this.$refs.loginForm.resetFields();
      },
      handleSubmit(ev) {
       // var _this = this;
        this.$refs.loginForm.validate(async(valid) => {
          if (valid) {
            this.logining = true;
            var loginParams = {username: this.loginForm.account, password: this.loginForm.checkPass};
            let data = await this.$api.post(loginParams, 'login');
            this.logining = false;
            if (!data) {
              return;
            }
            let user = data;
            user.avatar = 'https://raw.githubusercontent.com/taylorchen709/markdown-images/master/vueadmin/user.png';
            sessionStorage.setItem('user', JSON.stringify(user));
            sessionStorage.setItem('sessionId', user.sessionId);
            this.$router.push({name: 'UserList'});

            /* this.logining = true;
            var loginParams = {username: this.loginForm.account, password: this.loginForm.checkPass};
            let res = post(loginParams, 'login');
            this.logining = false;
            console.log('@@@@@@@@@@@@@@@@');
            console.log(res); */
            /* this.$api.post(loginParams, 'login').then(response => {
              this.logining = false;
              this.$api.proccess(response, function() {
                let user = response.data.data;
                user.avatar = 'https://raw.githubusercontent.com/taylorchen709/markdown-images/master/vueadmin/user.png';
                sessionStorage.setItem('user', JSON.stringify(user));
                sessionStorage.setItem('sessionId', user.sessionId);
                _this.$router.push({name: 'UserList'});
              });
            }); */
          } else {
            return false;
          }
        });
      }
    }
  };

</script>

<style lang="scss" scoped>
  .login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    }
    .remember {
      margin: 0px 0px 35px 0px;
    }
  }
</style>
