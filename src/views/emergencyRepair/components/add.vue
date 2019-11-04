<template>

  <el-dialog
    title="青海省高等级公路机电工程应急抢修申请表"
    :visible.sync="changeActiveVisible"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    top="10px"
    @close="closeDialog"
  >
    <el-form ref="form" :model="form" label-width="80px" size="small" :inline="true" class="demo-form-inline dialog-form-add">

      <el-form-item label="报修单位" prop="reportUnitId">
        <el-select v-model="form.reportUnitId" filterable placeholder="请选择报修单位" size="small">
          <el-option v-for="item in warrantyList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>

      <el-form-item label="报修时间" prop="reportTime">
        <el-col>
          <el-date-picker v-model="form.reportTime" type="date" placeholder="选择日期" style="width: 100%;" />
        </el-col>
      </el-form-item>

      <el-form-item label="报修人" prop="reporter">
        <el-input v-model="form.reporter" placeholder="报修人" style="min-width:194px;" />
      </el-form-item>

      <el-form-item label="报修电话" prop="reporterContact">
        <el-input v-model="form.reporterContact" placeholder="报修电话" style="min-width:209px;" />
      </el-form-item>

      <el-form-item label="接报单位" prop="receiveUnitId">
        <el-select v-model="form.receiveUnitId" placeholder="请选择接报单位">
          <el-option v-for="item in receivingList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>

      <el-form-item label="接报时间" prop="receiveTime">
        <el-col>
          <el-date-picker v-model="form.receiveTime" type="date" placeholder="选择日期" style="width: 100%;" />
        </el-col>
      </el-form-item>

      <el-form-item label="接报人" prop="receiver">
        <el-input v-model="form.receiver" placeholder="接报人" />
      </el-form-item>

      <el-form-item label="紧急情况" prop="isEmergency">
        <el-radio-group v-model="form.isEmergency">
          <el-radio :label="true">紧急</el-radio>
          <el-radio :label="false">一般</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="抢修范围" class="el-form-checkbox" prop="power">
        <el-checkbox v-model="form.power" label="供配电系统" />
        <el-checkbox v-model="form.includeSurveillance" label="监控系统" />
        <el-checkbox v-model="form.includeToll" label="收费系统" />
        <el-checkbox v-model="form.includeCommunication" label="通信系统" />
        <el-checkbox v-model="form.includeTunnel" label="隧道设备" />
        <el-checkbox v-model="includeOther" label="其他" @change="handleCheckAllChange" />
      </el-form-item>

      <el-form-item label="抢修依据" class="el-form-checkbox" prop="basisParagraphContent">
        <el-row :gutter="20">
          <el-col><a href="">《青海省高等级公路机电工程应急抢修管理办法（试行）》</a></el-col>
          <el-col class="el-form-small-input-box">
            第<el-input v-model="form.basisChapter" class="basis" prop="basisChapter" />章<el-input v-model="form.basisArticle" class="basis" />条 第<el-input v-model="form.basisParagraph" class="basis" />款：
            <el-input v-model="form.basisParagraphContent" style="width:190px;" />
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item label="工程名称" prop="engineering">
        <el-input v-model="form.engineering" placeholder="请输入工程名称" />
      </el-form-item>

      <el-form-item label="具体位置" prop="positionDetail">
        <el-input v-model="form.positionDetail" placeholder="请输入具体位置" />
      </el-form-item>

      <el-form-item label="事件经过" style="display:block;" size="medium" prop="eventProcess">
        <el-input v-model="form.eventProcess" type="textarea" style="width:482px;" />
      </el-form-item>

      <el-form-item label="影响程度" style="display:block;" prop="influence">
        <el-input v-model="form.influence" style="width:482px;" />
      </el-form-item>

      <el-form-item label="抢修内容" style="display:block;" prop="repairDescription">
        <el-input v-model="form.repairDescription" type="textarea" style="width:482px;" />
      </el-form-item>

      <el-form-item label="费用估算" prop="costEstimate">
        <el-input v-model="form.costEstimate" placeholder="费用估算" style="width:80px;" /> （万元）
      </el-form-item>

      <el-form-item label="材料设备" prop="maonMaterialEquipment">
        <el-input v-model="form.maonMaterialEquipment" placeholder="接报人" style="width:100px;" />（品牌，型号）
      </el-form-item>

      <el-form-item label="附件" style="display:block;" prop="uploadList">
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

    </el-form>

    <div slot="footer" class="dialog-footer" style="text-align: center;display: block;">
      <el-button size="small" type="primary" @click="onSubmit('form',2)">提交审核</el-button>
      <el-button size="small" type="primary" @click="onSubmit('form',1)">暂 存</el-button>
      <el-button size="small" @click="changeActiveVisible = false">取 消</el-button>
    </div>
  </el-dialog>
</template>
<style>
	.dialog-form-add{
		height: 500px;
		overflow: auto;
	}
	.el-input{
		width: 194px;
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
  .basis .el-input__inner{

    padding: 0px;
    text-align: center;
  }
</style>
<script>
export default {
  name: 'Add',
  data: function() {
    return {
      changeActiveVisible: false,

      form: {
        reportUnitId: '',
        reportTime: '',
        reporter: '',
        reporterContact: '',
        receiveUnitId: '',
        receiveTime: '',
        receiver: '',
        isEmergency: false,
        power: false,
        includeSurveillance: false,
        includeToll: false,
        includeCommunication: false,
        includeTunnel: false,
        includeOther: '',
        basisChapter: '',
        basisArticle: '',
        basisParagraph: '',
        basisParagraphContent: '',
        engineering: '',
        positionDetail: '',
        eventProcess: '',
        influence: '',
        repairDescription: '',
        costEstimate: '',
        maonMaterialEquipment: '',

        attachments: [],
        submit: false

      },

      includeOther: false,

      uploadList: [], // 展示的上传的文件

      warrantyList: [], // 保修单位

      receivingList: [], // 接报单位

      addType: '', // 当前打开的是什么类型

      addDescId: '' // 详情id

    }
  },
  methods: {
    init(type, id) {
      this.changeActiveVisible = true

      this.addType = type

      this.addDescId = id

      // 获取 暂存数据
      if (type === 2) {
        this.addDesc(id)
      }

      this.warrantyUnit()

      this.receivingUnit()
    },

    // 自定义上传方法
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
      this.$confirm(`确定移除 ${file.name}？`).then(_ => {
        this.$axios.delete(`/api/File/Attachment/${file.id}`).then(res => {
          this.$message('删除成功')

          this.uploadList.splice(this.uploadList.findIndex(item => item.id === file.id), 1)

          this.form.attachments.splice(this.form.attachments.findIndex(item => item === file.id), 1)
        })
      }).catch(_ => {})

      return false
    },

    // 抢修范围
    handleCheckAllChange(value) {
      if (value) {
        this.form.includeOther = '其他'
      } else {
        this.form.includeOther = ''
      }
    },

    // 获取 保修单位
    warrantyUnit() {
      this.$axios.get(`/api/Tree/Position/All?startLevel=${2}&endLevel=${4}`).then(res => {
        this.warrantyList = res
      })
    },

    // 获取 接报单位
    receivingUnit() {
      this.$axios.get(`/api/Tree/Position/All?startLevel=${2}&endLevel=${3}`).then(res => {
        this.receivingList = res
      })
    },

    onSubmit(formName, type) {
      // 暂存
      if (type === 1) {
        this.form.submit = false

      // 提交审核
      } else if (type === 2) {
        this.form.submit = true
      }

      this.$message({
        type: 'success',
        message: '正在提交，请稍等。。。',
        center: true,
        duration: 1000
      })

      // 添加
      if (this.addType === 1) {
        this.addEmergency()

      // 修改
      } else {
        this.modifyEmergency()
      }
    },

    // 添加
    addEmergency() {
      this.$axios.post('/api/EmergencyRequisition', this.form).then(res => {
        this.$message({
          type: 'success',
          message: '添加成功!',
          duration: 2000,
          onClose: function() {
            location.reload()
          }
        })
      })
    },

    // 修改
    modifyEmergency() {
      this.$axios.put(`/api/EmergencyRequisition/${this.addDescId}`, this.form).then(res => {
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

    // 获取 暂存数据
    addDesc(id) {
      this.$axios.get(`/api/EmergencyRequisition/${id}`, this.form).then(res => {
        this.uploadList = res.attachments
        this.form = res
        this.form.attachments = res.attachments.map(item => { return item.id })
      })
    },

    // 关闭回调 并且执行父组件方法
    closeDialog() {
      this.$parent.closeDialog()
    }
  }
}
</script>
