<template>

  <el-dialog
    title="青海省高等级公路机电工程应急抢修工程数量及费用审核表"
    :visible.sync="changeActiveVisible"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    center
    destroy-on-close="true"
    width="800px"
    @close="closeDialog"
  >
    <el-form ref="form" :model="form" label-width="110px" size="small" :inline="true" class="demo-form-inline dialog-form-const-add" :disabled="true">

      <el-form-item label="项目名称">
        <el-input v-model="engineering" placeholder="项目名称" style="width:240px" />
      </el-form-item>

      <el-form-item label="抢修单位名称">
        <el-input v-model="repairUnitId" placeholder="抢修单位名称" style="width:240px" />
      </el-form-item>

      <el-form-item label="报修时间">
        <el-col>
          <el-date-picker
            v-model="costDate"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width:240px"
          />
        </el-col>
      </el-form-item>

      <el-form-item label="录入人">
        <el-input v-model="createUser" placeholder="录入人" style="width:240px" />
      </el-form-item>

      <!-- 应急抢修申请表 -->
      <el-form-item label="应急抢修申请表" style="display:block;" class="applicationform-box">
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
          <el-table-column label="序号" type="index" align="center" />
          <el-table-column label="编号" prop="id" align="center" />
          <el-table-column label="报修单位" prop="reportUnit.name" align="center" />
          <el-table-column label="接报单位" prop="receiveUnit.name" align="center" />
          <el-table-column label="报修时间" prop="createTime" align="center" :formatter="formatterDate" />
        </el-table>
      </el-form-item>

      <!-- 工程清单 -->
      <el-form-item label="工程清单" style="display:block;" class="applicationform-box">
        <el-table
          :key="projectTable.tableKey"
          v-loading="projectTable.listLoading"
          :data="projectTable.list"
          border
          fit
          highlight-current-row
          show-summary
          :summary-method="getSummaries"

          style="width: 100%;"
          size="mini"
          class="table-applicationform"
        >
          <el-table-column label="序号" type="index" align="center" />
          <el-table-column label="名称" prop="name" align="center" />
          <el-table-column label="单位" prop="unit" align="center" />
          <el-table-column label="数量" prop="quantity" align="center" />
          <el-table-column label="单价(元)" prop="unitPrice" align="center" />
          <el-table-column label="总价(元)" prop="totalPrice" align="center" />

        </el-table>
      </el-form-item>

      <!-- 附件内容 -->
      <el-form-item label="附件内容" style="display:block;" class="applicationform-box">
        <el-table
          :key="annexTable.tableKey"
          v-loading="annexTable.listLoading"
          :data="annexTable.list"
          border
          fit
          highlight-current-row
          style="width: 100%;"
          size="mini"
          class="table-applicationform"
        >
          <el-table-column label="序号" prop="id" align="center" />
          <el-table-column label="名称" prop="name" align="center" />
          <el-table-column label="上传" prop="createTime" align="center" :formatter="formatterDate" />

        </el-table>
      </el-form-item>

      <!-- 审批信息 -->
      <el-form-item label="审批信息" style="display:block;" class="applicationform-box">

        <el-table
          :key="examineTable.tableKey"
          v-loading="examineTable.listLoading"
          :data="examineTable.list"
          border
          fit
          highlight-current-row
          style="width: 100%;"
          size="mini"
          class="table-applicationform"
        >
          <el-table-column
            prop="emergencyRequisitionId"
            label="审批单位"
            width="180"
          >
            <template slot-scope="scope">
              <a v-if="scope.row.type == 'Normal'" href="javascript:;">普通审批</a>
              <a v-if="scope.row.type == 'SubCenter'" href="javascript:;">分中心审批</a>
              <a v-if="scope.row.type == 'NetCenter'" href="javascript:;">路网中心审批</a>
              <a v-if="scope.row.type == 'Leader'" href="javascript:;">分管领导审批</a>
            </template>
          </el-table-column>
          <el-table-column label="审批意见" prop="reviewComment" align="center" />
          <el-table-column label="审批人" prop="reviewUser.name" align="center" />
          <el-table-column label="审批时间" prop="createTime" align="center" :formatter="formatterDate" />

        </el-table>
      </el-form-item>

    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" size="small" @click="centerDialogVisible = false">导出打印</el-button>
      <el-button size="small" @click="changeActiveVisible = false">取 消</el-button>
    </span>
  </el-dialog>
</template>
<style>
	.dialog-form-const-add{
		height: 500px;
		overflow: auto;
	}
	.dialog-form-const-add .el-input{
		width: 240px;
	}
	.el-item-label label.el-form-item__label{
		width : 100px;
	}
	.el-form-checkbox .el-form-item__label{
		width: 80px;
    display: block;
    float: left;
	}
	.el-form-checkbox .el-form-item__content{
		display: block;
    float: left;
    width: 500px;
	}
	.el-form-small-input-box .el-input{
		width : 30px;
		margin:0px 5px;
	}
  .applicationform-box .el-form-item__content{
    width: 604px
  }
</style>
<script>
export default {
  name: 'CostAdd',
  data: function() {
    return {
      changeActiveVisible: false,

      form: {
        repairBeginTime: '',
        repairEndTime: '',
        totalAmount: '',
        remark: '',
        project: [],
        attachments: []

      },

      applicationTable: {
        listLoading: false,
        list: []
      },

      projectTable: {
        listLoading: false,
        list: []
      },

      examineTable: {
        listLoading: false,
        list: []
      },

      annexTable: {
        listLoading: false,
        list: []
      },

      costDesc: {}
    }
  },
  // 计算属性
  computed: {
    // 项目名称
    engineering: function() {
      return this.costDesc.emergencyRequisition ? this.costDesc.emergencyRequisition.engineering : ''
    },

    // 抢修单位名称
    repairUnitId: function() {
      return this.costDesc.emergencyRequisition ? this.costDesc.emergencyRequisition.repairUnit.name : ''
    },

    // 录入人
    createUser: function() {
      return this.costDesc.emergencyRequisition ? this.costDesc.emergencyRequisition.createUser.name : ''
    },

    // 日期
    costDate: function() {
      return [this.costDesc.repairBeginTime, this.costDesc.repairEndTime]
    }
  },
  methods: {
    init(id) {
      this.id = id

      this.changeActiveVisible = true

      this.costViewDesc(id)
    },
    /**
     * 自定义返回合计
     * @return {[type]} [description]
     */
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总价'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value)) && (index === 5)) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)

          sums[index] = sums[index].toFixed(2)
        } else {
          sums[index] = ''
        }
      })
      return sums
    },

    // 详情数据
    costViewDesc(id) {
      this.$axios.get(`/api/EmergencyWorkCost/${id}`).then(res => {
        this.projectTable.list = res.project
        this.annexTable.list = res.attachments
        this.examineTable.list = res.audits
        this.costDesc = res
        this.applicationTable.list.push(res.emergencyRequisition)
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

    // 关闭回调
    closeDialog() {
      this.applicationTable.list = []
    },

    onSubmit() {

    },
    handleChange() {

    }
  }
}
</script>
