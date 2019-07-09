import { asyncRoutes } from '@/router'

const router = {
  getrouer(router, roles) {
    console.log(asyncRoutes)
    const showRouter = []
    router.forEach(item => {
      item.meta.hidden ? '' : item.children ? (item.children = item.children.filter(x => !x.meta.hidden && roles.includes(x.meta.roles))) : ''
      item.meta.hidden ? '' : showRouter.push(item)
    })
    return showRouter.filter(item => item.children.length !== 0)
  }
}

export default router
