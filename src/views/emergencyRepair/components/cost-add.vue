<template>

  <div class="djalog-box">
    <el-dialog
      title="青海省高等级公路机电工程应急抢修工程数量及费用审核表"
      :visible.sync="changeActiveVisible"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      center
      width="800px"
    >
      <el-form ref="form" :model="form" label-width="110px" size="small" :inline="true" class="demo-form-inline dialog-form-const-add">

        <el-form-item label="项目名称">
          <el-input v-model="form.name" placeholder="项目名称" style="width:240px" />
        </el-form-item>

        <el-form-item label="抢修单位名称">
          <el-input v-model="form.name" placeholder="抢修单位名称" style="width:240px" />
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

          <el-button type="primary" icon="el-icon-plus" size="mini" class="btn-xs" @click="openApplyPage" />
          <el-button type="danger" size="mini" icon="el-icon-delete" class="btn-xs" />

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
            <el-table-column type="selection" width="80" align="center" />
            <el-table-column label="序号" prop="id" width="50" align="center" />
            <el-table-column label="编号" prop="number" align="center" />
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
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-change="handleChange"
            :file-list="form.fileList"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">大小不能超过500kb</div>
          </el-upload>
        </el-form-item>

        <el-form-item label="抢修单位意见" style="display:block;" class="applicationform-box">
          <el-input v-model="form.desc" type="textarea" />
          <div>提示：时间、地点、预算书、数量、抢修技术方案、主要材料设备、实际完成情况</div>
        </el-form-item>

      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="centerDialogVisible = false">提交审核</el-button>
        <el-button type="primary" size="small" @click="onSubmit">导出打印</el-button>
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
        list: []
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

    onSubmit() {

    },

    handleChange() {

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

    getTemplateRow(data) {
      console.log(data)
    }
  }
}
</script>
