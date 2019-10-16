<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
    <div class="right-menu">
      <el-popover placement="bottom" width="280" trigger="click">
        <div>
          <div style="height:175px;background:#2e8cff47;text-align:center;padding-top:20px;">
            <img :src="Logo" style="width:90px;height:90px;border-radius:50%;">
            <h2 style="margin:0">{{ userName }}</h2>
          </div>
          <div style="padding:15px 0;display:flex;text-align:center">
            <div style="width:49%;padding:0 10px;">青海省高等级公路建设管理局</div>
            <div style="width:49%;padding:0 10px;">系统管理员</div>
          </div>
          <hr>
          <div>
            <el-button-group>
              <el-button size="small">修改密码</el-button>
              <el-button size="small">修改信息</el-button>
            </el-button-group>
            <el-button size="small" style="float:right" @click="logout">注销</el-button>
          </div>
        </div>
        <div slot="reference" style="margin-right:20px;cursor:pointer;">
          <img :src="Logo" style="width:40px;height:40px;border-radius:50%;float:left;margin:5px;">{{ userName }}
        </div>
      </el-popover>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import Logo from '@/assets/logo.png'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    return {
      Logo: Logo,
      userName: this.$cookie.get('trueName')
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
