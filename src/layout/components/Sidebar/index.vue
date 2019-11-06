<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu :default-active="getActiveMenu" class="el-menu-vertical-demo menu" router :collapse="isCollapse" background-color="#304156" text-color="#fff" active-text-color="#409eff">
        <el-menu-item v-show="roles.includes('PlatformOverview')" index="/">
          <i class="fa fa-map" />
          <span slot="title"><a :href="url">运维平台概览展示</a></span>
        </el-menu-item>
        <el-submenu v-for="(item,index) in routers" v-show="!item.meta.hidden && isShowParentMenu(item.children)" :key="index" :index="item.meta.fullPath" :class="isCollapse? 'menu_shrink':''">
          <template slot="title">
            <i :class="item.meta.icon" />
            <span slot="title">{{ item.meta.title }}</span>
          </template>
          <el-menu-item v-for="(items,indexs) in item.children" v-show="!items.meta.hidden && roles.includes(items.meta.roles)===true" :key="indexs" :index="items.meta.fullPath">
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
      url: process.env.VUE_APP_WEBURL,
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
    getActiveMenu() {
      return this.$route.meta.fullPath
    }
  },
  methods: {
    isShowParentMenu(routerChildren) {
      const isShowMenu = routerChildren.filter(x => !x.meta.hidden && this.roles.includes(x.meta.roles))
      return isShowMenu.length > 0
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
