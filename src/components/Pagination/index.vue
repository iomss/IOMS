<!--分页-->
<template>
  <div class="pagination-container">
    <el-pagination :background="background" :current-page.sync="currentPage" :page-size.sync="pageSize" :layout="layout" :page-sizes="pageSizes" :total="total" v-bind="$attrs" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
  </div>
</template>

<script>
// import { scrollTo } from '@/utils/scroll-to'

export default {
  name: 'Pagination',
  props: {
    // 总条数
    total: {
      required: true,
      type: Number
    },
    // 页码
    page: {
      type: Number,
      default: 1
    },
    // 条数
    limit: {
      type: Number,
      default: 20
    },
    // 每页条数选项
    pageSizes: {
      type: Array,
      default() {
        return [10, 20, 30, 50]
      }
    },
    // 启用功能
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    },
    // 背景
    background: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    // 页码
    currentPage: {
      get() {
        return this.page
      },
      set(val) {
        this.$emit('update:page', val)
      }
    },
    // 条数
    pageSize: {
      get() {
        return this.limit
      },
      set(val) {
        this.$emit('update:limit', val)
      }
    }
  },
  methods: {
    // 页码改变
    handleSizeChange(val) {
      this.$emit('pagination', { page: this.currentPage, limit: val })
    },
    // 展示条数改变
    handleCurrentChange(val) {
      this.$emit('pagination', { page: 1, limit: this.pageSize })
    }
  }
}
</script>

<style scoped>
.pagination-container {
  background: #fff;
  padding: 32px 16px;
  text-align: center;
}
.pagination-container.hidden {
  display: none;
}
</style>
