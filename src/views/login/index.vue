<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" label-position="left">
      <div class="title-container">
        <h3 class="title">用户登录</h3>
      </div>
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" placeholder="请输入用户名" prefix-icon="fa fa-user" />
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="loginForm.password" placeholder="请输入密码" :type="passwordType" prefix-icon="fa fa-key" />
      </el-form-item>

      <el-button type="primary" style="width:100%;" @click="login">登 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 录</el-button>

      <div class="tips">
        <el-button class="reset-button" type="text">
          忘记密码
        </el-button>
        <el-button class="register-button" type="text">
          注册账户
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script>

export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: 'admin',
        password: '111111'
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur' }],
        password: [{ required: true, trigger: 'blur' }]
      },
      passwordType: 'password'
    }
  },
  watch: {

  },

  mounted() {
  },

  methods: {

    login() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.$axios.post('/api/login').then(res => {
            console.log(res)
            this.$cookie.set('accessToken', res.data.token)
            this.$cookie.set('roles', res.data.roles)
            this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }

  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 40px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .title-container {
    position: relative;
    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .tips {
    font-size: 14px;
    color: #fff;
    text-align: right;
    padding-top: 10px;
    .reset-button {
      color: red;
      margin-left: 15px;
    }
  }
}
</style>
