<template>
  <div class="login-container">

    <div v-if="showForm==='login'">
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" label-position="left">
        <div class="title-container">
          <h3 class="title">{{ showForm==='login'?'用户登录': showForm==='register'?'用户注册':'找回密码' }}</h3>
        </div>
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入用户名" prefix-icon="fa fa-user" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" placeholder="请输入密码" type="password" prefix-icon="fa fa-key" />
        </el-form-item>
        <el-button type="primary" style="width:100%;" @click="login">登 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 录</el-button>
        <div class="tips">
          <el-button v-if="showForm!=='forget'" class="reset-button" type="text" @click="showForm='forget'">
            忘记密码
          </el-button>
          <el-button v-if="showForm!=='register'" class="register-button" type="text" @click="showForm='register'">
            注册账户
          </el-button>
          <el-button v-if="showForm!=='login'" class="register-button" type="text" @click="showForm='login'">
            已有账号，登录
          </el-button>
        </div>
      </el-form>
    </div>
    <div v-if="showForm==='register'">
      <el-form ref="registerForm" :model="registerForm" :rules="registeroginRules" class="login-form" label-position="left">
        <div class="title-container">
          <h3 class="title">{{ showForm==='login'?'用户登录': showForm==='register'?'用户注册':'找回密码' }}</h3>
        </div>
        <el-form-item prop="name">
          <el-input v-model="registerForm.name" placeholder="请输入名称" prefix-icon="fa fa-user" />
        </el-form-item>
        <el-form-item prop="username">
          <el-input v-model="registerForm.username" placeholder="请输入用户名" prefix-icon="fa fa-user" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="registerForm.password" placeholder="请输入密码" type="password" prefix-icon="fa fa-key" />
        </el-form-item>
        <el-form-item prop="contact">
          <el-input v-model="registerForm.contact" placeholder="请输入联系人" prefix-icon="fa fa-user" />
        </el-form-item>
        <el-form-item prop="contactNumber">
          <el-input v-model="registerForm.contactNumber" placeholder="请输入联系方式" prefix-icon="fa fa-user" />
        </el-form-item>
        <el-button type="primary" style="width:100%;" @click="register">注 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 册</el-button>
        <div class="tips">
          <el-button v-if="showForm!=='forget'" class="reset-button" type="text" @click="showForm='forget'">
            忘记密码
          </el-button>
          <el-button v-if="showForm!=='register'" class="register-button" type="text" @click="showForm='register'">
            注册账户
          </el-button>
          <el-button v-if="showForm!=='login'" class="register-button" type="text" @click="showForm='login'">
            已有账号，登录
          </el-button>
        </div>
      </el-form>
    </div>

  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        grant_type: 'password',
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, message: '用户名不可为空', trigger: 'blur' }],
        password: [{ required: true, message: '密码不可为空', trigger: 'blur' }]
      },
      registerForm: {
        name: '',
        username: '',
        password: '',
        contact: '',
        contactNumber: ''
      },
      registeroginRules: {
        name: [{ required: true, message: '名称不可为空', trigger: 'blur' }],
        username: [{ required: true, message: '用户名不可为空', trigger: 'blur' }],
        password: [{ required: true, message: '密码不可为空', trigger: 'blur' }],
        contact: [{ required: true, message: '联系人不可为空', trigger: 'blur' }],
        contactNumber: [{ required: true, message: '联系人联系方式不可为空', trigger: 'blur' }]

      },
      showForm: 'login'
    }
  },
  watch: {

  },

  mounted() {
  },

  methods: {

    login() {
      const _this = this
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.$ajax({
            type: 'POST',
            url: process.env.VUE_APP_API + '/oauth/token',
            data: this.loginForm,
            success: (res) => {
              _this.$message.success('登录成功')
              // cookie 中写入相关登录凭证
              for (const item in res) {
                _this.$cookie.set(item, res[item])
              }
              _this.$cookie.set('tokenSetTime', new Date().getTime())
              // 获取用户数据
              _this.$axios.get('/api/Account/LoginInfo').then(res => {
                // cookie 中写入相关用户数据
                for (const item in res) {
                  _this.$cookie.set(item, res[item])
                }
                const roles = []
                res.claims.forEach(item => {
                  roles.push(item.key)
                })
                roles.push('show')
                _this.$cookie.set('roles', roles.toString())
                _this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              })
            },
            error: (err) => {
              this.$message.error(err.responseJSON.error_description)
            }
          })
        } else {
          return false
        }
      })
    },
    register() {
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          this.$axios.post('/api/Account', this.registerForm).then(res => {
            if (res.success) {
              this.$message.success('用户注册成功，返回登录')
              this.showForm = 'login'
            }
          })
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
