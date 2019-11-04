<template>

  <div v-if="changeActiveVisible">

    <el-dialog
      title="青海省高等级公路机电工程应急抢修申请表"
      :visible.sync="changeActiveVisible"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      class="e-dialog-applyview"
    >

      <formView ref="formView" v-bind="viewData" @func="getMsgFormSon" />

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
            <el-table-column label="审批意见" prop="reviewComment" width="180">
              <template slot-scope="scope">
                <a href="javascript:;">{{ scope.row.reviewComment !== null ? scope.row.reviewComment : scope.row.remark }}</a>
              </template>
            </el-table-column>
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

      <div slot="footer" class="dialog-footer" style="text-align: center;display: block;">
        <el-button size="small" @click="changeActiveVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="onSubmit">导出打印</el-button>
        <el-button type="primary" size="small" @click="onSubmit">上传附件</el-button>
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

      viewDesc: {} // 详情数据

    }
  },
  methods: {
    init(id) {
      this.changeActiveVisible = true
      this.viewData.id = id
    },

    // 日期时间格式化
    formatterDate(row, column, cellValue) {
      if (cellValue !== null) {
        return this.$moment(cellValue).format('YYYY-MM-DD')
      } else {
        return cellValue
      }
    },

    onSubmit() {

    },
    handleChange() {

    },
    // 获取子组件的值
    getMsgFormSon(data) {
      this.viewDesc = data
    }
  }
}
</script>
