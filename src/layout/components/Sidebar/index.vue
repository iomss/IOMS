<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu :default-active="getActiveMenu" class="el-menu-vertical-demo menu" router :collapse="isCollapse" background-color="#304156" text-color="#fff" active-text-color="#409eff">
        <el-submenu v-for="(item,index) in getRouter" :key="index" :index="item.meta.fullPath" :class="isCollapse? 'menu_shrink':''">
          <template slot="title">
            <i :class="item.meta.icon" />
            <span slot="title">{{ item.meta.title }}</span>
          </template>
          <el-menu-item v-for="(items,indexs) in item.children" :key="indexs" :index="items.meta.fullPath">
            <i :class="items.meta.icon" />
            <span slot="title">{{ items.meta.title }}</span>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import routers from '@/router'
export default {
  components: { Logo },
  data() {
    return {
      routers: routers,
      roles: this.$cookie.get('roles')
    }
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    isCollapse() {
      return !this.sidebar.opened
    },
    getRouter() {
      const showRouter = []
      this.routers.forEach(item => {
        item.meta.hidden ? '' : item.children ? item.children = item.children.filter(x => !x.meta.hidden && this.roles.includes(x.meta.roles)) : ''
        item.meta.hidden ? '' : showRouter.push(item)
      })
      return showRouter.filter(item => item.children.length !== 0)
    },
    getActiveMenu() {
      return this.$route.meta.fullPath
    }
  }
}
</script>

<style lang="scss">
/*导航菜单收缩状态*/
.menu_shrink {
  .el-submenu__title {
    font-size: 18px;
    text-align: center;
  }
}
</style>
