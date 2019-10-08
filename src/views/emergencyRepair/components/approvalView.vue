<template>

  <el-dialog
    title="
青海省高等级公路机电工程应急抢修申请表"
    :visible.sync="changeActiveVisible"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    class="e-dialog-applyview"
  >

    <formView ref="formView" />

    <!-- 审核记录 -->
    <el-divider>审核信息</el-divider>
    <el-row>
      <el-col :span="24">
        <el-table
          :data="tableData"
          border
          size="mini"
          style="width: 100%"
        >
          <el-table-column
            prop="company"
            label="审批单位"
            width="180"
          />
          <el-table-column
            prop="content"
            label="审批意见"
            width="180"
          />
          <el-table-column
            prop="username"
            label="审批人"
          />

          <el-table-column
            prop="createTime"
            label="审批时间"
          />
        </el-table>
      </el-col>
    </el-row>

    <!-- 分中心审核 -->
    <el-divider>分中心审核</el-divider>
    <el-form ref="subCenterForm" :model="subCenterForm" status-icon size="small" :inline="true" label-width="120px">
      <el-form-item label="分中心审批意见" prop="resource">
        <el-radio-group v-model="subCenterForm.resource">
          <el-radio label="通过" />
          <el-radio label="不通过" />
        </el-radio-group>
      </el-form-item>
      <el-row>
        <el-input v-model="subCenterForm.desc" type="textarea" />
      </el-row>
    </el-form>

    <!-- 路网中心审核 -->
    <el-divider>路网中心审核</el-divider>
    <el-form ref="subCenterForm" :model="luwangCenterForm" status-icon size="small" :inline="true" label-width="100px">

      <el-row>
        <el-tooltip class="item" effect="dark" content="对抢修内容、方案、预算、主要材料设备、处理时限等明确意见" placement="right-start">
          <el-form-item label="路网中心意见" prop="resource">
            <el-radio-group v-model="luwangCenterForm.resource">
              <el-radio label="通过" />
              <el-radio label="不通过" />
            </el-radio-group>
          </el-form-item>
        </el-tooltip>
      </el-row>

      <el-form-item label="抢修单位">
        <el-select v-model="luwangCenterForm.region" placeholder="请选择接报单位">
          <el-option label="区域一" value="shanghai" />
          <el-option label="区域二" value="beijing" />
        </el-select>
      </el-form-item>
      <el-form-item label="提交给">
        <el-select v-model="luwangCenterForm.region" placeholder="请选择接报单位">
          <el-option label="区域一" value="shanghai" />
          <el-option label="区域二" value="beijing" />
        </el-select>
      </el-form-item>
      <el-row>
        <el-input v-model="luwangCenterForm.desc" type="textarea" />
      </el-row>
    </el-form>

    <!-- 分管领导意见 -->
    <el-divider>分管领导意见</el-divider>
    <el-form ref="subCenterForm" :model="subCenterForm" status-icon size="small" :inline="true" label-width="100px">
      <el-tooltip class="item" effect="dark" content="预估费用五万元以上" placement="right-start">
        <el-form-item label="分管领导意见" prop="resource">
          <el-radio-group v-model="subCenterForm.resource">
            <el-radio label="通过" />
            <el-radio label="不通过" />
          </el-radio-group>
        </el-form-item>
      </el-tooltip>
      <el-row>
        <el-input v-model="subCenterForm.desc" type="textarea" />
      </el-row>
    </el-form>

    <el-row class="btn-tool">
      <el-button type="primary" size="small" @click="onSubmit">导出打印</el-button>
      <el-button type="primary" size="small" @click="onSubmit">上传附件</el-button>
    </el-row>

  </el-dialog>
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

      tableData: [{
        company: '路网中心',
        content: '维修内容属实，***方案合理，要求3日内完成',
        username: '工程师姓名',
        createTime: '2019-09-11 13:00'
      }],

      subCenterForm: {
        resource: '',
        desc: ''
      },

      luwangCenterForm: {
        resource: '',
        region: '',
        desc: ''
      }
    }
  },
  methods: {
    init() {
      this.changeActiveVisible = true
    },

    onSubmit() {

    },
    handleChange() {

    }
  }
}
</script>
