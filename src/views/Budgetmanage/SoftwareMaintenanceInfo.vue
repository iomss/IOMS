<!-- 软件维护单价详情 -->
<template>
  <div>
    <el-row>
      <el-col>
        <div class="panel">
          <div class="header">
            <div class="toolsrt">
              <el-form ref="form" :model="formSearch" label-width="80px">
                <el-form-item label="软件类别" prop="name">
                  <el-input v-model="formSearch.name" placeholder="软件类别" size="small" />
                </el-form-item>
                <el-form-item label="维护级别" prop="year">
                  <el-input v-model="formSearch.year" placeholder="维护级别" size="small" />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" plain size="small" @click="getData()">查询</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <div class="content">
            <el-table :data="tableData" stripe border style="width: 1200px">
              <el-table-column type="selection" />
              <el-table-column prop="catelog" label="定额编目" />
              <el-table-column prop="workName" label="软件类别 " />
              <el-table-column prop="更换部件" label="工作名称 " />
              <el-table-column prop="level" label="维护级别" />
              <el-table-column prop="year" label="年份" />
              <el-table-column prop="unitPrice" label="维护单价(元)" />
            </el-table>
            <!--分页-->
            <pagination v-show="totalCount>0" :total="totalCount" :page.sync="formSearch.pageNumber" :limit.sync="formSearch.pageSize" @pagination="getPage" />
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import pagination from '@/components/Pagination'
export default {
  components: {
    pagination
  },
  data() {
    return {
      tableData: [],
      totalCount: 0, // 数据总条数
      formSearch: {
        code: '', // 版本编号
        year: '' // 年度
      }
    }
  },
  computed: {},
  mounted() {
    this.getData()
  },
  methods: {
    formatterDate(row, column, cellValue) {
      if (cellValue !== null) {
        return this.$moment(cellValue).format('YYYY-MM-DD HH:mm:ss')
      } else {
        return cellValue
      }
    },
    getData() {
      this.$axios.get('/api/UnitPrice', { params: this.formSearch }).then(res => {
        this.tableData = res.data
        this.totalCount = res.totalCount
      })
    },
    getPage(val) { // page事件
      // 展示条数
      this.formSearch.pageSize = val.limit
      // 页码
      this.formSearch.pageNumber = val.page
      // 调用获取数据
      this.getData()
    }
  }
}
</script>
<style lang='scss' scoped>
.header {
  width: 100%;
}

.tools {
  margin: 10px 0px;
  width: 29%;
  display: inline-block;
}
.toolsrt {
  width: 100%;
  .el-form-item {
    display: inline-block;
  }
}

.content {
  .el-table th,
  .el-table td {
    padding: 5px;
  }
}
</style>
