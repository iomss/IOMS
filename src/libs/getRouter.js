import { asyncRoutes } from '@/router'

const router = {
  getrouer() {
    asyncRoutes.forEach(element => {
      console.log(element)
    })
  }
}

export default router
