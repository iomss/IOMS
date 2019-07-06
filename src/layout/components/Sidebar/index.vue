<template>
  <div class="has-logo">
    <logo v-if="true" :collapse="true" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <!-- <el-menu :default-active="activeMenu" :collapse="isCollapse" :background-color="variables.menuBg" :text-color="variables.menuText" :unique-opened="false" :active-text-color="variables.menuActiveText" :collapse-transition="false" mode="vertical">
        <sidebar-item v-for="route in permission_routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu> -->
    </el-scrollbar>
  </div>
</template>

<script>
import Logo from './Logo'
// import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'
import { router } from '@/libs/getRouter'

export default {
  components: { Logo },
  data() {
    return {
      router
    }
  },
  computed: {
    variables() {
      return variables
    }
  }
}
</script>
