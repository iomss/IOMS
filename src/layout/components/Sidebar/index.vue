<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <!-- <el-menu :default-active="activeMenu" :collapse="isCollapse" :background-color="variables.menuBg" :text-color="variables.menuText" :unique-opened="false" :active-text-color="variables.menuActiveText" :collapse-transition="false" mode="vertical">
        <sidebar-item v-for="route in permission_routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu> -->

      <el-menu default-active="" class="menu" router :collapse="isCollapse" background-color="#304156" text-color="#fff" active-text-color="#409eff">
        <el-submenu v-for="item in getRouter" :key="item.path" :index="item.path">
          <!-- <i :class="item.meta.icon" />
          <span slot="title">{{ item.meta.title }}</span> -->
          <span slot="title"><i :class="item.meta.icon" style="margin-right:5px;font-size:16px;margin-top:-5px;" />{{ item.meta.title }}</span>
          <el-menu-item v-for="items in item.children" :key="items.path" :index="items.path">
            <span slot="title"><i :class="items.meta.icon" style="margin-right:5px;font-size:16px;margin-top:-5px;" />{{ items.meta.title }}</span>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
// import SidebarItem from './SidebarItem'
// import variables from '@/styles/variables.scss'
import routers from '@/router'

export default {
  components: { Logo },
  data() {
    return {
      routers: routers
    }
  },
  computed: {
    ...mapGetters([
      'permission_routes',
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
        item.meta.hidden ? '' : showRouter.push(item)
      })
      return showRouter
    }
  }
}
</script>

<style lang="sass">

</style>
