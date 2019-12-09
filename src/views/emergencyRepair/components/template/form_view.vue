<template>
  <el-form ref="form" :model="form" label-width="80px" size="small" :inline="true" class="demo-form-inline">

    <el-row>
      <el-col :span="12">
        <el-form-item label="报修单位">
          {{ reportUnitName }}
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="报修时间">
          {{ form.reportTime }}
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="12">
        <el-form-item label="报修人">
          {{ form.reporter }}
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="报修电话">
          {{ form.reporterContact }}
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="12">
        <el-form-item label="接报单位">
          {{ receiveUnittName }}
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="接报时间">
          {{ form.receiveTime }}
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="12">
        <el-form-item label="接报人">
          {{ form.receiver }}
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="紧急情况">
          <el-radio-group v-model="form.isEmergency">
            <el-radio :label="true">紧急</el-radio>
            <el-radio :label="false">一般</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
        <el-form-item label="抢修范围" class="el-form-checkbox">
          <el-checkbox v-model="form.power" label="供配电系统" />
          <el-checkbox v-model="form.includeSurveillance" label="监控系统" />
          <el-checkbox v-model="form.includeToll" label="收费系统" />
          <el-checkbox v-model="form.includeCommunication" label="通信系统" />
          <el-checkbox v-model="form.includeTunnel" label="隧道设备" />
          <el-checkbox v-model="includeOther" label="其他" />
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item label="抢修依据" class="el-form-checkbox">
      <el-row :gutter="20">
        <el-col><a href="">《青海省高等级公路机电工程应急抢修管理办法（试行）》</a></el-col>
        <el-col class="el-form-small-input-box">
          第 {{ form.basisChapter }} 章 {{ form.basisArticle }} 条 第{{ form.basisParagraph }}款：{{ form.basisParagraphContent }}
        </el-col>
      </el-row>
    </el-form-item>

    <el-row>
      <el-col :span="24">
        <el-form-item label="报修内容">
          <el-row>1,工程名称: {{ form.engineering }}</el-row>
          <el-row>2,具体位置: {{ form.positionDetail }}</el-row>
          <el-row>3,事件经过: {{ form.eventProcess }}</el-row>
          <el-row>4,影响程度: {{ form.influence }}</el-row>
          <el-row>5,抢修内容: {{ form.repairDescription }}</el-row>
          <el-row>6,费用估算: {{ form.costEstimate }}万</el-row>
          <el-row>7,主要材料设备: {{ form.maonMaterialEquipment }}</el-row>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
        <el-form-item label="附件" style="display:block;">
          <a v-for="item in form.attachments" :key="item.id" :download="item.name" :href="url + item.path" style="color:blue;display: block;" target="_blank">{{ item.name }}</a>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>

</template>
<style>
/*	.dialog-form-add{
		height: 400px;
		overflow: auto;
	}*/
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
</style>
<script>
export default {
  name: 'FormView',
  props: {
    id: Number
  },
  data: function() {
    return {

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
        maonMaterialEquipment: ''
      },
      attachments: [],
      uploadList: [],
      url: process.env.VUE_APP_API
    }
  },
  computed: {

    reportUnitName: function() {
      return this.form.reportUnit ? this.form.reportUnit.name : ''
    },

    receiveUnittName: function() {
      return this.form.receiveUnit ? this.form.receiveUnit.name : ''
    },

    includeOther: function() {
      if (this.form.includeOther === '其他') {
        return true
      } else {
        return false
      }
    }
  },
  mounted() {
    this.applyViewDesc(this.id)
  },
  methods: {

    // 获取详情数据
    applyViewDesc(id) {
      this.$axios.get('/api/EmergencyRequisition/' + id).then(res => {
        res.reportTime = this.formatterDate(res.reportTime)
        res.receiveTime = this.formatterDate(res.receiveTime)
        this.uploadList = res.attachments
        this.form = res

        // 给 父组件传值
        this.$emit('func', res)
      })
    },

    // 点击上传的文件
    preview(file) {
      const a = document.createElement('a')
      const event = new MouseEvent('click')
      a.download = file.name
      a.href = this.url + file.path
      a.dispatchEvent(event)
    },
    // 日期时间格式化
    formatterDate(cellValue) {
      if (cellValue !== null) {
        return this.$moment(cellValue).format('YYYY-MM-DD')
      } else {
        return cellValue
      }
    },

    onSubmit() {

    }
  }
}
</script>
