<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
    <div class="right-menu">

      <el-popover placement="bottom" width="280" trigger="click">
        <div>
          <div style="height:175px;background:#2e8cff47;text-align:center;padding-top:40px;">
            <img :src="Logo" style="width:90px;height:90px;border-radius:50%;">
            <div style="text-align:center">
              <a href="javascript:void(0)" @click="changeUpdate()">版本:1.1.0.1</a>
            </div>  <!-- <h2 style="margin:0">{{ userName }}</h2> -->
          </div>
          <div style="padding:15px 0;display:flex;text-align:center">
            <div style="width:49%;padding:0 10px;">{{ userUnit.name }}</div>
            <div style="width:49%;padding:0 10px;">{{ userName }}</div>
          </div>
          <hr>
          <div>
            <el-button-group>
              <el-button size="small" @click="changePW()">修改密码</el-button>
              <el-button size="small" @click="changeUserInfo()">修改信息</el-button>
            </el-button-group>
            <el-button size="small" style="float:right" @click="logout">注销</el-button>
          </div>
        </div>
        <div slot="reference" style="margin-right:20px;cursor:pointer;">
          <img :src="Logo" style="width:40px;height:40px;border-radius:50%;float:left;margin:5px;">{{ userName }}
        </div>
      </el-popover>
    </div>
    <el-dialog title="修改信息" :visible.sync="changeUserFormVisible" :close-on-press-escape="false" :close-on-click-modal="false" width="450px" @close="changeUserFormClose">
      <el-form ref="UserForm" :model="UserForm" :rules="UserFormRules" label-width="120px">
        <el-form-item label="登录账号" prop="userName">
          <el-input v-model="UserForm.userName" disabled placeholder="登录账号" userze="small" />
        </el-form-item>
        <el-form-item label="用户名称" prop="trueName">
          <el-input v-model="UserForm.trueName" placeholder="用户名称" userze="small" />
        </el-form-item>
        <el-form-item prop="contactNumber" label="联系电话">
          <el-input v-model="UserForm.contactNumber" placeholder="联系电话" size="small" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="" @click="changeUserFormVisible=false">关闭</el-button>
        <el-button type="primary" @click="submit()">提交</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改密码" :visible.sync="changePassWordVisibale" :close-on-press-escape="false" :close-on-click-modal="false" width="450px">
      <el-form ref="changePassWord" :model="changePassWord" :rules="changePassWordRules" label-width="120px">
        <el-form-item prop="oldPassword" label="旧密码">
          <el-input v-model="changePassWord.oldPassword" placeholder="旧密码" size="small" />
        </el-form-item>
        <el-form-item prop="newPassword" label="新密码">
          <el-input v-model="changePassWord.newPassword" type="password" placeholder="新密码" size="small" />
        </el-form-item>
        <el-form-item prop="confirmPassword" label="确认密码">
          <el-input v-model="changePassWord.confirmPassword" type="password" placeholder="确认密码" size="small" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="" @click="changePassWordVisibale=false">关闭</el-button>
        <el-button type="primary" @click="submitChangePassWord()">提交</el-button>
      </span>
    </el-dialog>
    <el-dialog title="版本更新内容" :visible.sync="changeUpdateVisibale" :close-on-press-escape="false" :close-on-click-modal="false" width="450px">
      <span style="white-space:pre-wrap;" class="dialog-footer">
        本次更新内容：
        添加版本号及版本更新内容。
        <el-button type="" @click="changeUpdateVisibale=false">关闭</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import Logo from '@/assets/logo_qh.png'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    const validateNewPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        const regNum = new RegExp(/^\d*$/)
        const regStr = new RegExp(/^[a-z\d]*$/i)
        if (regNum.test(value) && regStr.test(value)) {
          callback(new Error('密码格式不正确，必须同时包含数字和字母'))
        } else {
          callback()
        }
      }
    }
    const validateConfirmPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码密码'))
      } else if (value !== this.changePassWord.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      Logo: Logo,
      userName: this.$cookie.get('trueName'),
      userUnit: JSON.parse(this.$cookie.get('unit')),
      changeUserFormVisible: false,
      UserForm: {
        trueName: this.$cookie.get('trueName'),
        userName: '',
        contactNumber: ''
      },
      UserFormRules: {
        userName: {
          required: true,
          message: '用户名不可为空',
          trigger: 'blur'
        },
        contactNumber: {
          required: true,
          message: '联系方式不可为空',
          trigger: 'blur'
        }
      },
      changePassWordVisibale: false,
      changeUpdateVisibale: false,
      changePassWord: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      changePassWordRules: {
        oldPassword: {
          required: true,
          message: '旧密码不可为空',
          trigger: 'blur'
        },
        newPassword: [
          {
            required: true,
            message: '请输入新密码',
            trigger: 'blur'
          },
          { min: 6, message: '密码长度不可少于6位', trigger: 'blur' },
          { validator: validateNewPass, trigger: 'blur' }
        ],
        confirmPassword: [
          {
            required: true,
            message: '请再次输入密码',
            trigger: 'blur'
          },
          { validator: validateConfirmPassword, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device'
    ])
  },
  methods: {
    changeUserInfo() {
      this.changeUserFormVisible = true
      this.UserForm.userName = this.$cookie.get('userName')
      this.UserForm.contactNumber = this.$cookie.get('contactNumber')
    },
    changeUserFormClose() {
      this.$refs.UserForm.resetFields()
    },
    submit() {
      this.$refs.UserForm.validate(valid => {
        if (valid) {
          this.$axios.put('/api/Account', this.UserForm).then(res => {
            this.$message.success('修改成功')
            this.$cookie.set('userName', res.userName)
            this.$cookie.set('contactNumber', res.contactNumber)
            this.changeUserFormVisible = false
          })
        }
      })
    },
    changePW() {
      this.changePassWordVisibale = true
    },
    changeUpdate() {
      this.changeUpdateVisibale = true
    },
    submitChangePassWord() {
      this.$refs.changePassWord.validate(valid => {
        if (valid) {
          this.$axios.post('/api/Account/UpdatePassword', this.changePassWord).then(res => {
            this.$message.success('密码修改成功,需重新登录。')
            this.logout()
          })
        }
      })
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    logout() {
      this.$store.dispatch('tagsView/delAllViews')
      document.cookie.match(/[^ =;]+(?=\=)/g).forEach(item => {
        this.$cookie.remove(item.replace('ioms-', ''))
      })
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    width: 195px;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
