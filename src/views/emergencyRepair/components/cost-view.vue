<template>

  <el-dialog
    title="青海省高等级公路机电工程应急抢修工程数量及费用审核表"
    :visible.sync="changeActiveVisible"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    center
    width="800px"
  >
    <el-form ref="form" :model="form" label-width="110px" size="small" :inline="true" class="demo-form-inline dialog-form-const-add" :disabled="true">

      <el-form-item label="项目名称">
        <el-select v-model="form.region" placeholder="请选择报修单位" style="width:240px">
          <el-option label="区域一" value="shanghai" />
          <el-option label="区域二" value="beijing" />
        </el-select>
      </el-form-item>

      <el-form-item label="抢修单位名称">
        <el-select v-model="form.region" placeholder="请选择报修单位" style="width:240px">
          <el-option label="区域一" value="shanghai" />
          <el-option label="区域二" value="beijing" />
        </el-select>
      </el-form-item>

      <el-form-item label="报修时间">
        <el-col>
          <el-date-picker
            v-model="form.date1"
            type="daterange"
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
          <el-table-column label="序号" prop="id" sortable="custom" align="center" />
          <el-table-column label="编号" prop="number" align="center" />
          <el-table-column label="报修单位" prop="name" align="center" />
          <el-table-column label="接报单位" prop="company_2" align="center" />
          <el-table-column label="报修时间" prop="createTime" align="center" />
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
          style="width: 100%;"
          size="mini"
          class="table-applicationform"
        >
          <el-table-column label="序号" prop="id" sortable="custom" align="center" />
          <el-table-column label="名称" prop="name" align="center" />
          <el-table-column label="单位" prop="unit" align="center" />
          <el-table-column label="数量" prop="number" align="center" />
          <el-table-column label="单价(元)" prop="price" align="center" />
          <el-table-column label="总价(元)" prop="total" align="center" />

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
          <el-table-column label="序号" prop="id" sortable="custom" align="center" />
          <el-table-column label="名称" prop="number" align="center" />
          <el-table-column label="上传" prop="createTime" align="center" />

        </el-table>
      </el-form-item>

      <!-- 审批信息 -->
      <el-form-item label="审批信息" style="display:block;" class="applicationform-box">

        <el-table
          :key="examineTable.tableKey"
          v-loading="examineTable.listLoading"
          :data="examineTable.list"
          border
          fit
          highlight-current-row
          style="width: 100%;"
          size="mini"
          class="table-applicationform"
        >
          <el-table-column label="审批单位" prop="name" align="center" />
          <el-table-column label="审批意见" prop="company_2" align="center" />
          <el-table-column label="审批人" prop="createTime" align="center" />
          <el-table-column label="审批时间" prop="createTime" align="center" />

        </el-table>
      </el-form-item>

    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" size="small" @click="centerDialogVisible = false">确 定</el-button>
      <el-button size="small" @click="centerDialogVisible = false">取 消</el-button>
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
  name: 'CostAdd',
  data: function() {
    return {
      changeActiveVisible: false,

      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: '',
        type: '',
        resource: '',
        desc: '',

        fileList: [{
          name: 'food.jpeg',
          url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        }, {
          name: 'food2.jpeg',
          url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        }]

      },

      applicationTable: {
        listLoading: false,
        list: [{
          id: 1,
          number: 2220912,
          name: '家堡东收费站',
          company_2: '韵家口分中心',
          createTime: '2019-10-02'
        }]
      },

      projectTable: {
        listLoading: false,
        list: [{
          id: 1,
          name: '高杆200W LED投光灯',
          unit: '盏',
          number: 20,
          price: 10,
          total: 200
        }, {
          id: 2,
          name: '人工费',
          unit: '人',
          number: 8,
          price: 200,
          total: 1200
        }]
      },

      examineTable: {
        listLoading: false,
        list: []
      },

      annexTable: {
        listLoading: false,
        list: []
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
