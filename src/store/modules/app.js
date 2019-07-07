import cookie from '@/libs/cookies' // libs/cookies‘

const state = {
  // 导航侧边栏
  sidebar: {
    opened: cookie.get('sidebarStatus') ? !!+cookie.get('sidebarStatus') : true, // 是否展开  true|false
    withoutAnimation: false // 侧边栏收缩展开动画效果 true|false
  },
  device: 'desktop' // 设备
}

const mutations = {
  // store 方法
  TOGGLE_SIDEBAR: state => {
    // 切换sidebar 状态
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      cookie.set('sidebarStatus', 1)
    } else {
      cookie.set('sidebarStatus', 0)
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    // 关闭sidebar
    cookie.set('sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (state, device) => {
    // 切换设备
    state.device = device
  }
}

const actions = {
  // 行为改变store 数据时调用的方法
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
