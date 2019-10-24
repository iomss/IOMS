<template>

  <el-dialog
    title="青海省高等级公路机电工程应急抢修申请表"
    :visible.sync="changeActiveVisible"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    class="e-dialog-applyview"
  >

    <formView ref="formView" />

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

    <div slot="footer" class="dialog-footer" style="text-align: center;display: block;">
      <el-button size="small" @click="changeActiveVisible = false">取 消</el-button>
      <el-button type="primary" size="small" @click="onSubmit">导出打印</el-button>
      <el-button type="primary" size="small" @click="onSubmit">上传附件</el-button>
    </div>
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
      }]
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
