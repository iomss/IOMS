<template>

  <el-dialog
    title="青海省高等级公路机电工程应急抢修工程数量及费用审核表"
    :visible.sync="changeActiveVisible"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    center
    width="800px"
  >

    <el-row class="dialog-form-const-add">
      <el-form ref="form" :model="form" label-width="110px" size="small" :inline="true" class="demo-form-inline ">

        <el-form-item label="报修时间">
          <el-col>
            <el-date-picker
              v-model="form.date"
              type="daterange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width:240px"
              disabled
            />
          </el-col>
        </el-form-item>

        <el-form-item label="录入人">
          <el-input v-model="form.name" disabled placeholder="录入人" style="width:240px" />
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

            <el-table-column label="序号" type="index" show-overflow-tooltip align="center" />
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
            <el-table-column label="序号" type="index" show-overflow-tooltip align="center" />
            <el-table-column label="名称" prop="name" align="center" />
            <el-table-column label="上传时间" prop="createTime" align="center" :formatter="formatterDate" />
            <el-table-column
              fixed="right"
              label="操作"
              width="120"
            >
              <template slot-scope="scope">
                <el-link target="_blank" :href="url + scope.row.path" :underline="false" style="margin-left:15px">
                  <el-button size="small" type="text">下载</el-button>
                </el-link>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>

        <!-- 抢修工程数量核实意见 -->
        <el-form-item label="抢修工程数量核实意见" style="display:block;" class="applicationform-box">
          <el-input v-model="desc.remark" disabled type="textarea" />
        </el-form-item>

        <!-- 维修单位自评意见 -->
        <el-form-item label="维修单位自评意见" style="display:block;" class="applicationform-box">
          <el-input v-model="desc.reviewComment" disabled type="textarea" />
        </el-form-item>
      </el-form>

      <el-form ref="approval_form" :model="approval_form" label-width="110px" size="small" :inline="true">

        <el-divider content-position="center">抢修工程数量核实意见</el-divider>
        <el-table
          :key="examineTable.tableKey"
          v-loading="examineTable.listLoading"
          :data="examineTable.list"
          border
          fit
          highlight-current-row
          style="width: 100%; margin-bottom: 30px;"
          size="mini"
          class="table-applicationform"
        >
          <el-table-column label="审批单位" prop="type" align="center" :formatter="convertUnitType" />
          <el-table-column label="审批意见" prop="remark" align="center" />
          <el-table-column label="审批人" prop="reviewUser.name" align="center" />
          <el-table-column label="审批时间" prop="createTime" align="center" :formatter="formatterDate" />
        </el-table>
        <el-form-item v-if="approval_form.emergencyState === 'PendingSubCenter'" label="分中心/隧道所意见" class="applicationform-box">
          <el-input v-model="approval_form.remark" type="textarea" />
          <div>提示：工程方案、数量、质量、主要材料设备的核实情况</div>
        </el-form-item>
        <el-form-item v-if="approval_form.emergencyState === 'PendingNetCenter'" label="路网中心意见" class="applicationform-box">
          <template>
            <el-radio v-model="approval_form.reviewStatus" label="Applied">通过</el-radio>
            <el-radio v-model="approval_form.reviewStatus" label="Rejected">不通过</el-radio>
          </template>
          <el-input v-model="approval_form.remark" type="textarea" />
          <div>提示：工程方案、数量、质量、主要材料设备的核实情况</div>
        </el-form-item>

        <el-divider content-position="center">工程质量验收意见</el-divider>
        <el-table
          :key="examineTable.tableKey"
          v-loading="examineTable.listLoading"
          :data="examineTable.list"
          border
          fit
          highlight-current-row
          style="width: 100%; margin-bottom: 30px;"
          size="mini"
          class="table-applicationform"
        >
          <el-table-column label="审批单位" prop="type" align="center" :formatter="convertUnitType" />
          <el-table-column label="审批意见" prop="reviewComment" align="center" />
          <el-table-column label="审批人" prop="reviewUser.name" align="center" />
          <el-table-column label="审批时间" prop="createTime" align="center" :formatter="formatterDate" />
        </el-table>

        <el-form-item v-if="approval_form.emergencyState === 'PendingSubCenter' " label="分中心/隧道所意见" class="applicationform-box">
          <template>
            <el-radio v-model="approval_form.reviewStatus" label="Applied">通过</el-radio>
            <el-radio v-model="approval_form.reviewStatus" label="Rejected">不通过</el-radio>
          </template>

          <el-input v-model="approval_form.reviewComment" type="textarea" />
          <div>提示：工程方案、数量、质量、主要材料设备的核实情况</div>
        </el-form-item>
      </el-form>

    </el-row>

    <span slot="footer" class="dialog-footer">
      <el-button type="primary" size="small" @click="onSubmit">确 定</el-button>
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
  name: 'AcceptanceAapproval',
  data: function() {
    return {
      changeActiveVisible: false,
      acceptanceId: 0,

      emergencyAuditType: [],

      form: {
        name: '',
        projectName: '',
        repairUnitName: '',
        date: '',

        fileList: []
      },

      approval_form: {
        // 抢修单位编号
        repairUnitId: '',

        // 申请单Id
        emergencyRequisitionId: '',

        // 费用审核单
        emergencyWorkCostId: '',

        // 验收单
        emergencyAcceptanceId: '',

        // 下一个审核的用户
        reviewerId: '',

        // 审核结果
        reviewStatus: 'Pending',

        // 流程状态，根据此状态来决定显示审批的内容
        emergencyState: '',

        remark: '',
        reviewComment: ''
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

      roleView: {
        EmergencyRequisitionSubCenterReview: false,
        emergencyRequisitionNetCenterEngineerReview: false
      },

      desc: {},

      url: process.env.VUE_APP_API
    }
  },

  methods: {
    init(id) {
      this.changeActiveVisible = true
      this.acceptanceId = id

      this.setRole()
      this.getEmergencyAuditType()
      this.getAcceptanceDataDesc()
    },

    /**
     * 设置角色操作权限
     */
    setRole() {
      var rolesData = this.$cookie.get('roles')

      if (rolesData.indexOf('EmergencyRequisitionSubCenterReview') !== -1) {
        this.roleView.emergencyRequisitionSubCenterReview = true
      }

      if (rolesData.indexOf('EmergencyRequisitionNetCenterEngineerReview') !== -1) {
        this.roleView.emergencyRequisitionNetCenterEngineerReview = true
      }
    },

    /**
     * 获取验收申请单详细内容
     * @return {[type]} [description]
     */
    getAcceptanceDataDesc() {
      this.applicationTable.listLoading = true
      this.projectTable.listLoading = true
      this.annexTable.listLoading = true

      this.applicationTable.list = []
      this.annexTable.list = []
      this.projectTable.list = []
      this.examineTable.list = []

      this.approval_form.emergencyState = ''
      this.approval_form.remark = ''
      this.approval_form.reviewComment = ''

      this.$axios.get('/api/EmergencyAcceptance/' + this.acceptanceId).then(res => {
        this.form.date = [this.$moment(res.repairBeginTime).format('YYYY-MM-DD'), this.$moment(res.repairEndTime).format('YYYY-MM-DD')]
        this.form.name = res.createUser.name
        this.form.projectName = res.emergencyRequisition.basisParagraphContent
        this.form.repairUnitName = res.emergencyRequisition.repairUnit.name
        this.desc = res

        this.approval_form.repairUnitId = res.emergencyRequisition.repairUnitId
        this.approval_form.emergencyRequisitionId = res.emergencyRequisitionId
        this.approval_form.emergencyWorkCostId = res.emergencyWorkCost.id
        this.approval_form.emergencyAcceptanceId = res.audits.length > 0 ? res.audits[0].emergencyAcceptanceId : ''
        this.approval_form.reviewerId = res.audits.length > 0 ? res.audits[0].reviewUserId : ''
        this.approval_form.emergencyState = res.emergencyState

        // 申请单
        this.applicationTable.listLoading = false
        this.applicationTable.list.push(res.emergencyRequisition)

        // 附件
        this.annexTable.listLoading = false
        this.annexTable.list = res.attachments

        // 工程清单
        this.projectTable.listLoading = false
        this.projectTable.list = res.emergencyWorkCost.project

        // 审批意见
        this.examineTable.listLoading = false
        this.examineTable.list = res.audits
        // this.form.rateScore = res.rateScore
      })
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
    // 日期时间格式化
    formatterDate(row, column, cellValue) {
      if (cellValue !== null) {
        return this.$moment(cellValue).format('YYYY-MM-DD')
      } else {
        return cellValue
      }
    },

    /**
     * 转换单位类型
     * @return {[type]} [description]
     */
    convertUnitType(row, column, cellValue) {
      for (var i = 0, len = this.emergencyAuditType.length; i < len; i++) {
        if (this.emergencyAuditType[i]['key'] === cellValue) {
          cellValue = this.emergencyAuditType[i]['description']
        }
      }
      return cellValue
    },
    /**
     * 获取应急抢修审核类型
     * @return {[type]} [description]
     */
    getEmergencyAuditType() {
      this.$axios.get('/api/Enum/EmergencyAuditType/').then(res => {
        this.emergencyAuditType = res
      })
    },

    /**
     * 提交审核
     * @return {[type]} [description]
     */
    onSubmit() {
      if (!this.roleView.emergencyRequisitionSubCenterReview && !this.roleView.emergencyRequisitionNetCenterEngineerReview) {
        this.$message.error('您没有权限操作')
        return
      }

      this.$axios.post('/api/EmergencyAcceptance/' + this.acceptanceId + '/Review', this.approval_form).then(res => {
        this.changeActiveVisible = false
        this.$emit('func')
      })
    }
  }
}
</script>
