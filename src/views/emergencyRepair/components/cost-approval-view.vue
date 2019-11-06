<template>

  <el-dialog
    title="青海省高等级公路机电工程应急抢修工程数量及费用审核表"
    :visible.sync="changeActiveVisible"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    center
    width="800px"
    @close="closeDialog"
  >

    <el-row class="dialog-form-const-add">
      <el-form ref="form" :model="form" label-width="110px" size="small" :inline="true" class="demo-form-inline " :disabled="true">

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
            <el-table-column label="上传时间" prop="createTime" align="center" :formatter="formatterDate" />

          </el-table>
        </el-form-item>

        <el-form-item label="抢修单位意见" style="display:block;" class="applicationform-box">
          <el-input v-model="costDesc.remark" type="textarea" />
          <div>提示：时间、地点、预算书、数量、抢修技术方案、主要材料设备、实际完成情况</div>
        </el-form-item>

        <!-- 审核记录 -->
        <el-form-item v-if="costDesc.audits" label="审核信息" style="display:block;" class="applicationform-box">
          <el-table
            :data="costDesc.audits"
            border
            size="mini"
            style="width: 100%"
          >
            <el-table-column
              prop="type"
              label="审批单位"
              width="180"
              :formatter="convertUnitType"
            />
            <el-table-column
              prop="reviewComment"
              label="审批意见"
              width="180"
            />
            <el-table-column
              prop="reviewUser.name"
              label="审批人"
            />

            <el-table-column
              prop="createTime"
              label="审批时间"
              :formatter="formatterDate"
            />
          </el-table>
        </el-form-item>

      </el-form>

      <el-form ref="form" :model="examine" label-width="110px" size="small" :inline="true">

        <el-form-item v-if="costDesc.emergencyState === 'Pending'" label="收费站/隧道所意见" class="applicationform-box">

          <template>
            <el-radio-group v-model="examine.reviewStatus">
              <el-radio label="Applied">通过</el-radio>
              <el-radio label="Rejected">不通过</el-radio>
            </el-radio-group>
          </template>

          <el-input v-model="examine.reviewComment" type="textarea" />
          <div>提示：工程方案、数量、质量、主要材料设备的核实情况</div>
        </el-form-item>

        <el-form-item v-if="costDesc.emergencyState === 'PendingSubCenter'" label="分中心意见" class="applicationform-box">

          <template>
            <el-radio-group v-model="subCenter.reviewStatus">
              <el-radio label="Applied">通过</el-radio>
              <el-radio label="Rejected">不通过</el-radio>
            </el-radio-group>
          </template>

          <el-input v-model="subCenter.reviewComment" type="textarea" />
          <div>提示：工程方案、数量、质量、主要材料设备的核实情况</div>
        </el-form-item>

        <el-form-item v-if="costDesc.emergencyState === 'PendingNetCenter'" label="路网中心意见" class="applicationform-box">

          <template>
            <el-radio-group v-model="pattern.reviewStatus">
              <el-radio label="Applied">通过</el-radio>
              <el-radio label="Rejected">不通过</el-radio>
            </el-radio-group>
            <span style="font-weight: 600;margin-left: 10px;">提交给：</span>
            <el-select v-model="pattern.reviewerId" placeholder="请选择上级审批">
              <el-option v-for="item in emergencyList" :key="item.id" :label="item.trueName" :value="item.id" />
            </el-select>
          </template>

          <el-input v-model="pattern.reviewComment" type="textarea" style="margin-top: 10px;" />
          <div>提示：工程方案、数量、质量、主要材料设备的核实情况</div>
        </el-form-item>

        <el-form-item v-if="costDesc.emergencyState === 'PendingLeader'" label="分管领导意见" class="applicationform-box">

          <template>
            <el-radio-group v-model="leadership.reviewStatus">
              <el-radio label="Applied">通过</el-radio>
              <el-radio label="Rejected">不通过</el-radio>
            </el-radio-group>
          </template>

          <el-input v-model="leadership.remark" type="textarea" />
          <div>提示：预算费用五万元以上</div>
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
  name: 'CostApprovalView',
  data: function() {
    return {
      changeActiveVisible: false,
      acceptanceId: 0,

      emergencyAuditType: [],
      emergencyList: [],

      form: {
        repairBeginTime: '',
        repairEndTime: '',
        totalAmount: '',
        remark: '',
        project: [],
        attachments: []
      },

      approval_form: {
        status: 1,
        desc: ''
      },

      applicationTable: {
        listLoading: false,
        list: []
      },

      projectTable: {
        listLoading: false,
        list: []
      },

      annexTable: {
        listLoading: false,
        list: []
      },

      costDesc: {
        emergencyState: ''
      },

      // 查询是否 有这三个的权限
      queryRoles: {
        EmergencyRequisitionReview: false,
        EmergencyRequisitionSubCenterReview: false,
        EmergencyRequisitionNetCenterEngineerReview: false,
        EmergencyRequisitionLeaderReview: false
      },

      // 收费站
      examine: {
        reviewStatus: '', // 审核状态
        reviewComment: '' // 审核内容
      },

      // 分中心
      subCenter: {
        reviewStatus: '', // 审核状态
        reviewComment: '' // 审核内容
      },

      // 路网中心
      pattern: {
        reviewStatus: '', // 审核状态
        reviewComment: '' // 审核内容
      },

      // 分管领导
      leadership: {
        reviewStatus: '', // 审核状态
        remark: '' // 意见
      }
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
      this.costDesc.emergencyState = ''

      this.setRole()
      this.getEmergencyAuditType()
      this.emergencyNetCenter()
      this.costViewDesc(id)
    },
    /**
     * 设置角色操作权限
     */
    setRole() {
      var rolesData = this.$cookie.get('roles')

      if (rolesData.indexOf('EmergencyRequisitionReview') !== -1) {
        this.queryRoles.EmergencyRequisitionReview = true
      }

      if (rolesData.indexOf('EmergencyRequisitionSubCenterReview') !== -1) {
        this.queryRoles.EmergencyRequisitionSubCenterReview = true
      }

      if (rolesData.indexOf('EmergencyRequisitionNetCenterEngineerReview') !== -1) {
        this.queryRoles.EmergencyRequisitionNetCenterEngineerReview = true
      }

      if (rolesData.indexOf('EmergencyRequisitionLeaderReview') !== -1) {
        this.queryRoles.EmergencyRequisitionLeaderReview = true
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
        this.costDesc = res
        this.applicationTable.list.push(res.emergencyRequisition)
      })
    },

    /**
     * 获取 上级审批
     * @return {[type]} [description]
     */
    emergencyNetCenter() {
      this.$axios.get(`/api/User?emergencyNetCenter=${true}`).then(res => {
        this.emergencyList = res.data
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

    // 提交审核
    onSubmit() {
      const currentUserId = this.$cookie.get('id')

      // 收费站
      if (this.costDesc.emergencyState === 'Pending' && this.queryRoles.EmergencyRequisitionReview) {
        this.emergencyRequisition(this.examine)
        // 分中心审核
      } else if (this.queryRoles.EmergencyRequisitionSubCenterReview) {
        this.emergencyRequisition(this.subCenter)
        // 路网中心审核
      } else if (this.queryRoles.EmergencyRequisitionNetCenterEngineerReview && this.viewDesc.emergencyState === 'PendingNetCenter' && (this.reviewerId.toString() === '' || this.reviewerId.toString() === currentUserId.toString())) {
        this.emergencyRequisition(this.pattern)
        // 分管领导意见
      } else if (this.queryRoles.EmergencyRequisitionLeaderReview) {
        this.emergencyRequisition(this.leadership)
      } else {
        this.$message.error('没有权限操作')
      }
    },

    // 提交审核
    emergencyRequisition(data) {
      this.$message({
        type: 'success',
        message: '正在提交，请稍等。。。',
        center: true,
        duration: 1000
      })
      this.$axios.post(`/api/EmergencyWorkCost/${this.id}/Review`, {
        emergencyRequisitionId: this.costDesc.emergencyRequisitionId,
        emergencyWorkCostId: this.id,
        ...data
      }).then(res => {
        this.$message({
          type: 'success',
          message: '审核成功!',
          duration: 2000,
          onClose: function() {
            location.reload()
          }
        })
      })
    }
  }
}
</script>
