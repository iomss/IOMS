<template>

  <div class="djalog-box">
    <el-dialog
      title="青海省高等级公路机电工程应急抢修工程数量及费用申请表"
      :visible.sync="changeActiveVisible"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      center
      width="800px"
      @close="closeDialog"
    >
      <el-form ref="form" :model="form" label-width="110px" size="small" :inline="true" class="demo-form-inline dialog-form-const-add">

        <el-form-item label="项目名称">
          <el-input v-model="engineering" placeholder="项目名称" :disabled="true" style="width:240px" />
        </el-form-item>

        <el-form-item label="抢修单位名称">
          <el-input v-model="repairUnitId" placeholder="抢修单位名称" :disabled="true" style="width:240px" />
        </el-form-item>

        <el-form-item label="施工日期">
          <el-col>
            <el-date-picker
              v-model="date"
              type="daterange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width:240px"
            />
          </el-col>
        </el-form-item>

        <el-form-item label="录入人">
          <el-input v-model="createUser" placeholder="录入人" :disabled="true" style="width:240px" />
        </el-form-item>

        <!-- 应急抢修申请表 -->
        <el-form-item label="应急抢修申请表" style="display:block;" class="applicationform-box">

          <el-button type="primary" icon="el-icon-plus" size="mini" class="btn-xs" @click="openApplyPage" />
          <el-button type="danger" size="mini" icon="el-icon-delete" class="btn-xs" @click="applicationDel" />

          <el-table
            :key="applicationTable.tableKey"
            v-loading="applicationTable.listLoading"
            :data="applicationTable.list"
            border
            fit
            style="width: 100%;"
            size="mini"
            class="table-applicationform"
          >
            <el-table-column label="选择" width="50" align="center">
              <template scope="scope">
                <el-radio v-model="form.emergencyRequisitionId" class="radio" :label="scope.row.id" @change.native="getTemplateRow(scope.$index,scope.row)">&nbsp;</el-radio>
              </template>
            </el-table-column>
            <el-table-column label="序号" type="index" width="50" align="center" />
            <el-table-column label="编号" prop="id" align="center" />
            <el-table-column label="报修单位" prop="reportUnit.name" align="center" />
            <el-table-column label="接报单位" prop="receiveUnit.name" align="center" />
            <el-table-column label="报修时间" prop="createTime" align="center" :formatter="formatterDate" />
          </el-table>
        </el-form-item>

        <!-- 工程清单 -->
        <el-form-item label="工程清单" style="display:block;" class="applicationform-box">

          <el-button type="primary" icon="el-icon-plus" size="mini" class="btn-xs" @click="openProjectPage" />
          <el-button type="danger" size="mini" icon="el-icon-delete" class="btn-xs" @click="delAndleSelection" />

          <el-table
            :key="projectTable.tableKey"
            v-loading="projectTable.listLoading"
            :data="projectTable.list"
            border
            fit
            show-summary
            :summary-method="getSummaries"
            style="width: 100%;"
            size="mini"
            class="table-applicationform"
            @selection-change="handleSelectionChange"
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
            :file-list="uploadList"
            :before-remove="beforeRemove"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">大小不能超过500kb</div>
          </el-upload>
        </el-form-item>

        <el-form-item label="抢修单位意见" style="display:block;" class="applicationform-box">
          <el-input v-model="form.remark" type="textarea" />
          <div>提示：时间、地点、预算书、数量、抢修技术方案、主要材料设备、实际完成情况</div>
        </el-form-item>

      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="onSubmit(1)">提交审核</el-button>
        <el-button type="primary" size="small" @click="onSubmit(2)">暂存</el-button>
        <el-button size="small" @click="changeActiveVisible = false">取 消</el-button>

      </span>

    </el-dialog>

    <costAddApply v-if="applyVisible" ref="applyView" @func="getMsgFormSon" />
    <costAddProject v-if="projectVisible" ref="projectView" @func="getCostAddProject" />
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
import costAddProject from './cost-add-project'

export default {
  name: 'CostAdd',
  components: {
    costAddApply,
    costAddProject
  },
  data: function() {
    return {
      changeActiveVisible: false,

      applyVisible: false,
      projectVisible: false,

      date: [],

      form: {
        repairBeginTime: '',
        repairEndTime: '',
        totalAmount: '',
        remark: '',
        emergencyRequisitionId: '',
        submit: false,
        project: [],
        attachments: []
      },

      uploadList: [], // 展示的上传的文件

      applicationTable: {
        listLoading: false,
        list: []
      },

      projectTable: {
        listLoading: false,
        list: []
      },

      applyDesc: {}

    }
  },
  // 计算属性
  computed: {

    // 项目名称
    engineering: function() {
      return this.applyDesc.engineering ? this.applyDesc.engineering : ''
    },

    // 抢修单位名称
    repairUnitId: function() {
      return this.applyDesc.repairUnit ? this.applyDesc.repairUnit.name : ''
    },

    // 录入人
    createUser: function() {
      return this.applyDesc.createUser ? this.applyDesc.createUser.name : ''
    }
  },
  methods: {
    init(type, id) {
      this.changeActiveVisible = true

      this.costAddType = type

      this.costAddDescId = id

      if (type === 2) {
        this.addDesc(id)
      }
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

      this.form.totalAmount = sums[6]

      return sums
    },

    /**
     * 上传文件
     * @return {[type]} [description]
     */
    upload(file) {
      const formdata = new FormData()
      formdata.append('path', file.file)

      this.$axios.post('/api/File/Attachment', formdata, { headers: { 'Content-Type': 'multipart/form-data' }}).then(res => {
        this.uploadList.push(res.content)
        this.form.attachments.push(res.content.id)
      })
    },

    // 移除
    beforeRemove(file, fileList) {
      // 判断 如果没有上传成功 就本地删除
      if (file.percentage === '0') {
        return true
      }

      this.$confirm(`确定移除 ${file.name}？`).then(_ => {
        this.$axios.delete(`/api/File/Attachment/${file.id}`).then(res => {
          this.$message('删除成功')

          this.uploadList.splice(this.uploadList.findIndex(item => item.id === file.id), 1)

          this.form.attachments.splice(this.form.attachments.findIndex(item => item === file.id), 1)
        })
      }).catch(_ => {})

      return false
    },

    onSubmit(type) {
      if (this.date.length === 0) {
        this.$message.error('请选择日期')
        return
      }

      if (this.form.emergencyRequisitionId === '') {
        this.$message.error('请选择应急抢修申请表')
        return
      }

      if (this.projectTable.list.length === 0) {
        this.$message.error('请添加工程清单')
        return
      }

      if (this.form.remark === '') {
        this.$message.error('请输入抢修单位意见')
        return
      }

      // 提交审核
      if (type === 1) {
        this.form.submit = true

      // 暂存
      } else if (type === 2) {
        this.form.submit = false
      }

      this.form.repairBeginTime = this.date[0]
      this.form.repairEndTime = this.date[1]
      this.form.project = this.projectTable.list

      this.$message({
        type: 'success',
        message: '正在提交，请稍等。。。',
        center: true,
        duration: 1000
      })

      // 添加
      if (this.costAddType === 1) {
        this.addEmergency()

      // 修改
      } else {
        this.modifyEmergency()
      }
    },

    // 添加
    addEmergency() {
      this.$axios.post('/api/EmergencyWorkCost', this.form).then(res => {
        this.$message({
          type: 'success',
          message: '提交成功!',
          duration: 2000,
          onClose: function() {
            location.reload()
          }
        })
      })
    },

    // 修改
    modifyEmergency() {
      this.$axios.put(`/api/EmergencyWorkCost/${this.costAddDescId}`, this.form).then(res => {
        this.$message({
          type: 'success',
          message: '修改成功!',
          duration: 2000,
          onClose: function() {
            location.reload()
          }
        })
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
     *
     * @return {[type]} [description]
     */
    openProjectPage() {
      this.projectVisible = true
      this.$nextTick(() => {
        this.$refs.projectView.init()
      })
    },

    // 获取应急抢修申请表传来的值
    getMsgFormSon(data) {
      if (data) {
        this.applyVisible = false
        this.applicationTable.list = data
      }
    },
    // 获取工程清单表传来的值
    getCostAddProject(data) {
      if (data) {
        this.projectVisible = false
        this.projectTable.list.push(data)
      }
    },

    // 选中工程清单
    handleSelectionChange(val) {
      this.selectedProject = val
    },

    // 删除工程清单
    delAndleSelection() {
      this.projectTable.list.forEach((v, k) => {
        this.selectedProject.forEach((j, i) => {
          if (v.name === j.name) {
            this.projectTable.list.splice(k, 1)
          }
        })
      })
    },

    // 选中申请单
    getTemplateRow(index, row) {
      if (row) {
        this.applyDesc = row
      }
    },

    // 获取 暂存数据
    addDesc(id) {
      this.$axios.get(`/api/EmergencyWorkCost/${id}`, this.form).then(res => {
        this.uploadList = res.attachments
        this.projectTable.list = res.project
        this.applyDesc = res.emergencyRequisition
        this.applicationTable.list.push(res.emergencyRequisition)
        this.date = [res.emergencyRequisition.reportTime, res.emergencyRequisition.receiveTime]

        this.form = res
        this.form.attachments = res.attachments.map(item => { return item.id })
      })
    },

    // 关闭回调 并且执行父组件方法
    closeDialog() {
      this.$parent.closeDialog()
    },

    // 申请单删除
    applicationDel() {
      if (!this.applyDesc.id) {
        this.$message.error('请选择申请单')
        return
      }

      this.applicationTable.list.splice(this.applicationTable.list.findIndex(item => item.id === this.applyDesc.id), 1)
    }
  }
}
</script>
