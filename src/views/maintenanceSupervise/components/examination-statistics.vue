<template>

  <el-dialog
    title="新建考核单"
    :visible.sync="projectVisible"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    width="70%"
    append-to-body
    center
    @close="closeDialog"
  >
    <el-form :inline="true" :model="formData" class="demo-form-inline" size="small">
      <el-form-item label="考核时间">
        <el-col :span="24">
          <el-date-picker
            v-model="formData.date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
          />
        </el-col>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">统计</el-button>
      </el-form-item>

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
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="small"
              class="btn-xs"
              type="primary"
              @click="handleView(scope.$index, scope.row)"
            ><i class="el-icon-document" /></el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="applicationTable.total>0" :total="applicationTable.total" :page.sync="formData.pageNumber" :limit.sync="formData.pageSize" @pagination="getList" />
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="projectVisible = false">取 消</el-button>
    </span>

    <update v-if="addVisible" ref="update" :stati-close-dialog="statiCloseDialog" />
  </el-dialog>
</template>

<script>
import update from './examination-update'
import pagination from '@/components/Pagination'

export default {
  name: 'ExaminationStatistics',
  components: {
    pagination,
    update
  },
  data() {
    return {
      projectVisible: false,
      addVisible: false,
      formData: {
        date: '',
        beginDate: '',
        endDate: '',
        pageSize: 10,
        pageNumber: 1
      },
      applicationTable: {
        listLoading: false,
        list: [],

        total: 0
      }
    }
  },
  methods: {
    init() {
      this.projectVisible = true
    },
    // 获取权重详情
    getList() {
      this.applicationTable.listLoading = true
      this.$axios.post(`/api/InternalAssessment`, this.formData).then(res => {
        this.applicationTable.list = res.data
        this.applicationTable.total = res.totalCount
        this.applicationTable.listLoading = false
      })
    },
    // 日期时间格式化
    formatterDate(row, column, cellValue) {
      if (cellValue !== null) {
        return this.$moment(cellValue).format('YYYY-MM-DD')
      } else {
        return cellValue
      }
    },
    onSubmit(data) {
      this.formData.beginDate = this.formData.date.length !== 0 ? this.formatterDate(1, 1, this.formData.date[0]) : ''
      this.formData.endDate = this.formData.date.length !== 0 ? this.formatterDate(1, 1, this.formData.date[1]) : ''

      this.getList()
    },
    handleView(index, row) {
      this.addVisible = true
      this.$nextTick(() => {
        this.$refs.update.init(row.id)
      })
    },
    // 显示百分比
    formatterPercentage(row, column, cellValue) {
      if (cellValue !== null) {
        return (cellValue * 100).toFixed(2) + '%'
      } else {
        return ''
      }
    },
    // 执行 子组件关闭
    statiCloseDialog() {
      this.addVisible = false
      this.getList()
    },
    // 关闭回调 并且执行父组件方法
    closeDialog() {
      this.$parent.closeDialog()
    }
  }
}
</script>
