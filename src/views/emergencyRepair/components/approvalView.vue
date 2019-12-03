<template>

  <div v-if="changeActiveVisible">
    <el-dialog
      title="
  青海省高等级公路机电工程应急抢修申请表"
      :visible.sync="changeActiveVisible"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      class="e-dialog-applyview"
    >

      <formView ref="formView" v-bind="viewData" @func="getMsgFormSon" />

      <!-- 审核记录 -->
      <div v-if="viewDesc.audits">
        <el-divider>审核信息</el-divider>
        <el-row>
          <el-col :span="24">
            <el-table
              :data="viewDesc.audits"
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
          </el-col>
        </el-row>
      </div>

      <!-- 分中心审核 -->
      <div v-if="viewDesc.emergencyState === 'PendingSubCenter'">
        <el-divider>分中心审核</el-divider>
        <el-form ref="subCenter" :model="subCenter" status-icon size="small" :inline="true" label-width="120px">
          <el-form-item label="分中心审批意见" prop="reviewStatus">
            <el-radio-group v-model="subCenter.reviewStatus">
              <el-radio label="Applied">通过</el-radio>
              <el-radio label="Rejected">不通过</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-row>
            <el-input v-model="subCenter.reviewComment" type="textarea" />
          </el-row>
        </el-form>
      </div>

      <!-- 路网中心审核 -->
      <div v-if="viewDesc.emergencyState === 'PendingNetCenter'">
        <el-divider>路网中心审核</el-divider>
        <el-form ref="leadership" :model="pattern" status-icon size="small" :inline="true" label-width="100px">

          <el-row>
            <el-tooltip class="item" effect="dark" content="对抢修内容、方案、预算、主要材料设备、处理时限等明确意见" placement="right-start">
              <el-form-item label="路网中心意见" prop="reviewStatus">
                <el-radio-group v-model="pattern.reviewStatus">
                  <el-radio label="Applied">通过</el-radio>
                  <el-radio label="Rejected">不通过</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-tooltip>
          </el-row>
          <el-form-item label="抢修单位">
            <el-select v-model="pattern.repairUnitId" placeholder="请选择抢修单位">
              <el-option v-for="item in repairList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="提交给">
            <el-select v-model="pattern.reviewerId" placeholder="请选择上级审批">
              <el-option v-for="item in emergencyList" :key="item.id" :label="item.trueName" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-row>
            <el-input v-model="pattern.reviewComment" type="textarea" />
          </el-row>
        </el-form>
      </div>

      <!-- 分管领导意见 -->
      <div v-if="viewDesc.emergencyState === 'PendingLeader'">
        <el-divider>分管领导意见</el-divider>
        <el-form ref="leadership" :model="leadership" status-icon size="small" :inline="true" label-width="100px">
          <el-tooltip class="item" effect="dark" content="预估费用五万元以上" placement="right-start">
            <el-form-item label="分管领导意见" prop="reviewStatus">
              <el-radio-group v-model="leadership.reviewStatus">
                <el-radio label="Applied">通过</el-radio>
                <el-radio label="Rejected">不通过</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-tooltip>
          <el-row>
            <el-input v-model="leadership.remark" type="textarea" />
          </el-row>
        </el-form>
      </div>

      <div slot="footer" class="dialog-footer" style="text-align: center;display: block;">
        <el-button type="primary" size="small" @click="onSubmit">确定</el-button>
        <el-button type="primary" size="small">导出打印</el-button>
        <el-button type="primary" size="small">上传附件</el-button>
        <el-button size="small" @click="changeActiveVisible = false">取 消</el-button>
      </div>

    </el-dialog>
  </div>
</template>

<style>
	.e-dialog-applyview .el-dialog__body{
		height: 500px;
		overflow-y:scroll;
	}
	.e-dialog-applyview .btn-tool{
		margin-top: 20px;
		text-align: center;
		display: block;
	}
</style>

<script>
import formView from './template/form_view'

export default {
  name: 'ApplyView',
  components: {
    formView
  },
  data: function() {
    return {
      changeActiveVisible: false,

      viewData: {
        id: ''
      },
      // 查询是否 有这三个的权限
      queryRoles: {
        // 应急抢修分中心审批
        EmergencyRequisitionSubCenterReview: false,
        // 应急抢修路网工程师审批
        EmergencyRequisitionNetCenterEngineerReview: false,
        // 应急抢修分管领导审批
        EmergencyRequisitionLeaderReview: false
      },

      // 分中心
      subCenter: {
        reviewStatus: '', // 审核状态
        reviewComment: '' // 审核内容
      },

      // 路网中心
      pattern: {

        repairUnitId: '', // 抢修单位
        reviewerId: '', // 下一个审核的id
        reviewStatus: '', // 审核状态
        reviewComment: '' // 审核内容
      },

      // 分管领导
      leadership: {

        reviewStatus: '', // 审核状态
        remark: '' // 意见
      },

      emergencyAuditType: [], // 审批单位

      repairList: [], // 抢修单位

      emergencyList: [], // 上级列表

      viewDesc: {} // 详情数据
    }
  },
  methods: {
    init(id) {
      this.changeActiveVisible = true
      this.viewData.id = id

      this.setRole()
      this.getEmergencyAuditType()
      this.repairUnit()
      this.emergencyNetCenter()
    },

    /**
     * 设置角色操作权限
     */
    setRole() {
      var rolesData = this.$cookie.get('roles')

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

    // 获取子组件的值
    getMsgFormSon(data) {
      this.viewDesc = data
    },

    // 获取 抢修单位
    repairUnit() {
      this.$axios.get(`/api/Meta/SI`).then(res => {
        this.repairList = res.data
      })
    },

    // 获取 上级审批
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

    // 提交审核
    onSubmit() {
      const currentUserId = this.$cookie.get('id')

      debugger
      // 分中心审核
      if (this.queryRoles.EmergencyRequisitionSubCenterReview && this.viewDesc.emergencyState === 'PendingSubCenter') {
        this.emergencyRequisition(this.subCenter)
        // 路网中心审核
      } else if (this.queryRoles.EmergencyRequisitionNetCenterEngineerReview && this.viewDesc.emergencyState === 'PendingNetCenter' && (this.viewDesc.reviewerId === null || this.viewDesc.reviewerId.toString() === currentUserId)) {
        this.emergencyRequisition(this.pattern)
        // 分管领导意见
      } else if (this.queryRoles.EmergencyRequisitionLeaderReview && this.viewDesc.emergencyState === 'PendingLeader') {
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

      this.$axios.post(`/api/EmergencyRequisition/${this.viewData.id}/Review`, {
        ...data
      }).then(res => {
        this.$message({
          type: 'success',
          message: '审核成功!',
          duration: 3000,
          onClose: function() {
            location.reload()
          }
        })
      })
    }
  }
}
</script>
