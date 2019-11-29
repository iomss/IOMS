<template>

  <el-dialog
    title="考核查询"
    :visible.sync="projectVisible"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    width="70%"
    center
    @close="closeDialog"
  >
    <el-form :inline="true" :model="formData" class="demo-form-inline" size="small">

      <!-- 应急抢修申请表 -->
      <el-table
        :key="applicationTable.tableKey"
        v-loading="applicationTable.listLoading"
        :data="applicationTable.list"
        border
        fit
        highlight-current-row
        style="width: 100%;"
        size="mini"
        class="table-applicationform"
      >
        <el-table-column label="序号" prop="id" align="center" />
        <el-table-column label="单位名称" prop="position.name" align="center" width="130" />
        <el-table-column label="工单总量" prop="orderCount" align="center" />
        <el-table-column label="按时派单总量" prop="timelyDispatchCount" align="center" width="100" />
        <el-table-column label="派单及时率%" prop="timelyDispatchRate" align="center" width="100" :formatter="formatterPercentage" />
        <el-table-column label="按时验收总量" prop="timelyCheckCount" align="center" width="100" />
        <el-table-column label="验收及时率%" prop="timelyCheckRate" align="center" width="100" :formatter="formatterPercentage" />
        <el-table-column label="已审核工单总量" prop="reviewCount" align="center" width="120" />
        <el-table-column label="工单合格率%" prop="reviewPassRate" align="center" width="100" :formatter="formatterPercentage" />
        <el-table-column label="上级评分(主观分)" prop="superiorScore" align="center" width="120" />
        <el-table-column label="总分(加权平均)" prop="score" align="center" width="120" />
        <el-table-column label="备注" prop="remark" align="center" width="150" />
      </el-table>
      <pagination v-show="applicationTable.total>0" :total="applicationTable.total" :page.sync="formData.pageNumber" :limit.sync="formData.pageSize" @pagination="getList" />
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button type="primary" size="small" @click="onSubmit('form')">导出</el-button>
      <el-button size="small" @click="projectVisible = false">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import pagination from '@/components/Pagination'
export default {
  name: 'ExaminationQuery',
  components: {
    pagination
  },
  data() {
    return {
      projectVisible: false,
      formData: {
        date: '',
        pageNumber: 1,
        pageSize: 10,
        export: false

      },
      applicationTable: {
        listLoading: false,
        list: [],
        total: 0
      },
      postData: {}
    }
  },
  methods: {
    init(data) {
      this.projectVisible = true
      this.postData = data
      this.getList(data)
    },
    // 获取权重详情
    getList(data) {
      this.applicationTable.listLoading = true
      this.$axios.get(`/api/InternalAssessment?export=${this.formData.export}&pageNumber=${this.formData.pageNumber}&pageSize=${this.formData.pageSize}&positionId=${data.positionId}&beginDate=${data.beginDate}&endDate=${data.endDate}`).then(res => {
        this.applicationTable.listLoading = false

        if (!this.formData.export) {
          this.applicationTable.list = res.data
          this.applicationTable.total = res.totalCount
        } else {
          this.$message.success('导出任务添加成功')
        }
      })
    },
    onSubmit(data) {
      this.formData.export = true
      this.getList(this.postData)
    },
    // 显示百分比
    formatterPercentage(row, column, cellValue) {
      if (cellValue !== null) {
        return cellValue * 100 + '%'
      } else {
        return ''
      }
    },
    // 关闭回调 并且执行父组件方法
    closeDialog() {
      this.$parent.closeDialog()
    }
  }
}
</script>
