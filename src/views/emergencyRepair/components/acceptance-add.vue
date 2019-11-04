<template>
  <div class="djalog-box">
    <el-dialog
      v-loading="loading"
      title="青海省高等级公路机电工程数量确认及质量验收确认表"
      element-loading-text="正在提交中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"

      :visible.sync="changeActiveVisible"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      center
      width="800px"
    >
      <el-form ref="form" :model="form" label-width="110px" size="small" :inline="true" class="demo-form-inline dialog-form-const-add">

        <el-form-item label="施工日期">
          <el-col>
            <el-date-picker
              v-model="form.date"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width:240px"
            />
          </el-col>
        </el-form-item>

        <el-form-item label="录入人">
          <el-input v-model="form.name" placeholder="录入人" style="width:240px" />
        </el-form-item>

        <!-- 应急抢修申请表 -->
        <el-form-item label="应急抢修申请表" style="display:block;" class="applicationform-box">

          <el-button type="primary" icon="el-icon-plus" size="mini" class="btn-xs" @click="openApplyPage" />
          <el-button type="danger" size="mini" icon="el-icon-delete" class="btn-xs" @click="delApply" />

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
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="80" align="center" />

            <el-table-column label="序号" prop="id" width="50" align="center" />
            <el-table-column label="编号" prop="number" align="center" />
            <el-table-column label="报修单位" prop="name" align="center" />
            <el-table-column label="接报单位" prop="company_2" align="center" />
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
            <el-table-column type="selection" width="80" align="center" />

            <el-table-column label="序号" type="index" align="center" width="50" />
            <el-table-column label="名称" prop="name" align="center" />
            <el-table-column label="单位" prop="unit" align="center" />
            <el-table-column label="数量" prop="quantity" align="center" />
            <el-table-column label="单价(元)" prop="unitPrice" align="center" />
            <el-table-column label="总价(元)" prop="totalPrice" align="center" />

          </el-table>
        </el-form-item>

        <el-form-item label="附件" style="display:block;">
          <el-upload
            class="upload-demo"
            action="/"
            :http-request="upload"
            :file-list="form.fileList"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>

        <el-form-item label="抢修工程数量核实意见" style="display:block;" class="applicationform-box">
          <el-input v-model="form.remark" type="textarea" />
        </el-form-item>

        <el-form-item label="维修单位自评意见" style="display:block;" class="applicationform-box">
          <el-input v-model="form.reviewComment" type="textarea" />
        </el-form-item>

      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="onSubmit(1)">提交审核</el-button>
        <el-button type="primary" size="small" @click="onSubmit(2)">暂存</el-button>
        <el-button size="small" @click="changeActiveVisible = false">取 消</el-button>

      </span>

    </el-dialog>
    <costAddApply v-if="applyVisible" ref="applyView" @func="getEmergencyRepairData" />
  </div>

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
import costAddApply from './cost-add-apply'

export default {
  name: 'AcceptancAdd',
  components: {
    costAddApply
  },
  data: function() {
    return {
      loading: false,
      changeActiveVisible: false,

      applyVisible: false,
      projectVisible: false,
      acceptanceId: 0,
      isEdit: false,

      form: {
        emergencyRequisitionId: 0,
        remark: '',
        reviewComment: '',
        repairBeginTime: '',
        repairEndTime: '',
        attachments: [],
        submit: false,

        name: '',
        region: '',
        date: [],
        fileList: []
      },

      applicationTable: {
        listLoading: false,
        list: [],
        multipleSelection: []
      },

      projectTable: {
        listLoading: false,
        list: []
      }
    }
  },
  methods: {
    init() {
      this.changeActiveVisible = true
      this.isEdit = false

      this.form.name = this.$cookie.get('trueName')
    },
    /**
     * 初始化编辑内容
     * @return {[type]} [description]
     */
    initEdit(id) {
      this.acceptanceId = id
      this.changeActiveVisible = true
      this.isEdit = true

      this.getAcceptanceDataDesc()
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
        if (!values.every(value => isNaN(value)) && (index === 6)) {
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
    /**
     * 提交申请单
     * @param  {[type]} type [description]
     * @return {[type]}      [description]
     */
    onSubmit(type) {
      if (type === 1) {
        this.form.submit = true
      } else {
        this.form.submit = false
      }

      if (this.applicationTable.list.length <= 0) {
        this.$message.error('请先选择一个申请单')
        return
      }

      if (this.form.date.length >= 1) {
        this.form.repairBeginTime = this.$utils.formatTime(this.form.date[0], 'Y-M-D')
        this.form.repairEndTime = this.$utils.formatTime(this.form.date[1], 'Y-M-D')
      }

      this.loading = true

      if (this.isEdit) {
        this.handlerUpdateData()
      } else {
        this.handlerSaveData()
      }
    },
    /**
     * 更新数据
     * @return {[type]} [description]
     */
    handlerUpdateData() {
      this.$axios.put('api/EmergencyAcceptance/' + this.acceptanceId, this.form).then(res => {
        this.changeActiveVisible = false
        this.loading = false
        this.$emit('func')
      }).catch(res => {
        this.loading = false
        this.$message.error(res.message || '保存失败')
      })
    },

    /**
     * 保存数据
     * @return {[type]} [description]
     */
    handlerSaveData() {
      this.$axios.post('api/EmergencyAcceptance/', this.form).then(res => {
        this.changeActiveVisible = false
        this.loading = false
        this.$emit('func')
      }).catch(res => {
        this.loading = false
        this.$message.error(res.message || '保存失败')
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

    /**
     * 上传文件
     * @return {[type]} [description]
     */
    upload(file) {
      const formdata = new FormData()
      formdata.append('path', file.file)

      this.$axios.post('/api/File/Attachment', formdata, { headers: { 'Content-Type': 'multipart/form-data' }}).then(res => {
        this.form.attachments.push(res.content.id)
        // console.log(res)
      })
    },
    /**
     * 获取验收申请单详细内容
     * @return {[type]} [description]
     */
    getAcceptanceDataDesc() {
      this.applicationTable.listLoading = true
      this.projectTable.listLoading = true

      this.applicationTable.list = []
      this.projectTable.list = []
      this.$axios.get('/api/EmergencyAcceptance/' + this.acceptanceId).then(res => {
        this.form.date = [this.$moment(res.repairBeginTime).format('YYYY-MM-DD'), this.$moment(res.repairEndTime).format('YYYY-MM-DD')]
        this.form.name = res.createUser.name
        this.form.fileList = res.attachments

        this.form.remark = res.remark
        this.form.reviewComment = res.reviewComment

        // 项目信息
        this.applicationTable.listLoading = false
        this.applicationTable.list.push(res.emergencyRequisition)

        // 工程清单
        this.projectTable.listLoading = false
        this.projectTable.list = res.emergencyWorkCost.project
      })
    },
    /**
     * 打开应急抢修表清单
     * @return {[type]} [description]
     */
    openApplyPage() {
      this.applyVisible = true
      this.$nextTick(() => {
        this.$refs.applyView.init()
      })
    },

    /**
     * 获取应急抢修申请
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    getEmergencyRepairData(data) {
      if (data) {
        this.applyVisible = false
        this.applicationTable.list = data
        this.getRushRepairUnitData(data[0].id)
      }
    },

    /**
     * 获取抢修单位数量
     * @param  {[type]} id [description]
     * @return {[type]}    [description]
     */
    getRushRepairUnitData(id) {
      if (!id) return

      this.$axios.get('api/EmergencyRequisition/' + id).then(res => {
        if (res && res.emergencyWorkCost && res.emergencyWorkCost.project) {
          this.projectTable.list = res.emergencyWorkCost.project

          const strBeginTime = res.emergencyWorkCost.repairBeginTime.split('T')[0]
          const strEndTime = res.emergencyWorkCost.repairEndTime.split('T')[0]

          this.form.date = [new Date(strBeginTime.replace(/-/g, '/')), new Date(strEndTime.replace(/-/g, '/'))]
          this.form.emergencyRequisitionId = res.emergencyWorkCost.emergencyRequisitionId
          this.form.repairBeginTime = res.emergencyWorkCost.repairBeginTime
          this.form.repairEndTime = res.emergencyWorkCost.repairEndTime
        }
      })
    },

    /**
     * 删除表单
     * @return {[type]} [description]
     */
    delApply() {
      if (this.applicationTable.multipleSelection.length <= 0) {
        this.$message.error('请先选择一条表格')
        return
      }

      this.applicationTable.list = []
      this.projectTable.list = []
    },

    /**
     * 处理表格选择
     * @param  {[type]} val [description]
     * @return {[type]}     [description]
     */
    handleSelectionChange(val) {
      this.applicationTable.multipleSelection = val
    }

  }
}
</script>
