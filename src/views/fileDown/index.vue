<template>
  <div>
    <el-table ref="brandTable" :data="fileData" stripe border style="width: 100%">
      <el-table-column type="index" label="序号" />
      <el-table-column label="操作">
        <template slot-scope="{row}">
          <el-button size="mini" type="danger" @click="deleteFile(row.id)">删除</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="state" label="状态">
        <template slot-scope="{row}">
          {{ row.state === 'Pending' ? '等待执行' : row.state === 'Excute' ? '执行中' : row.state === 'Success' ? '成功' : row.state === 'Faild' ? '失败' : '' }}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="文件名称">
        <template slot-scope="{row}">
          <el-link :type="row.attachment !== null ?'primary':''" :href="row.attachment !== null ? url+row.attachment.path : '#'" target="_bank">{{ row.name }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="操作类型">
        <template slot-scope="{row}">
          {{ row.type === 'Import' ? '导入' : row.type === 'Export' ? '导出' : '' }}
        </template>
      </el-table-column>
      <el-table-column prop="createUser.name" label="创建人" width="150" />
      <el-table-column prop="createTime" label="创建时间" width="200" :formatter="formatterDate" />
      <el-table-column prop="message" label="信息" />
    </el-table>
    <pagination v-show="totalCount>0" :total="totalCount" :page.sync="formSearch.pageNumber" :limit.sync="formSearch.pageSize" @pagination="getPage" />
  </div>
</template>

<script>
import pagination from '@/components/Pagination/index.vue'
export default {
  name: 'FileDownindex',
  components: {
    pagination
  },
  data() {
    return {
      url: process.env.VUE_APP_API,
      fileData: [],
      formSearch: {
        currentUser: true,
        pageNumber: 0,
        pageSize: 20
      },
      totalCount: 0,
      file: '123'
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    // 时间格式化
    formatterDate(row, column, cellValue) {
      if (cellValue !== null) {
        return this.$moment(cellValue).format('YYYY-MM-DD HH:mm:ss')
      } else {
        return cellValue
      }
    },
    getData() {
      this.$axios.get('/api/FileProcess', { params: this.formSearch }).then(res => {
        this.fileData = res.data
        this.totalCount = res.totalCount
      })
    },
    getPage(val) {
      // 展示条数
      this.formSearch.pageSize = val.limit
      // 页码
      this.formSearch.pageNumber = val.page
      // 调用获取数据
      this.getData()
    },
    deleteFile(id) {
      this.$axios.delete('/api/FileProcess/' + id).then(res => {
        this.$message.success('文件已删除')
        this.getData()
      })
    }
  }
}
</script>

<style>
</style>
