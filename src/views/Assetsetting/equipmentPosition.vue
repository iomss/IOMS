<!-- 设备位置页面 -->
<template>
  <div>
    <el-row>
      <el-col>
        <div class="panel">
          <div class="header">
            <div class="search">
              <el-input v-model="positionFormSearce.text" placeholder="全局查询" size="small" />
              <el-button type="primary" size="small" @click="getData()">查询</el-button>
              <el-button type="success" size="small" @click="adddata()">添加</el-button>
              <el-button type="warning" size="small" @click="updatedata()">修改</el-button>
              <el-button type="danger" size="small" @click="deletdata()">删除</el-button>
            </div>
          </div>
          <div class="content">
            <el-table :data="positionData" stripe border style="width: 100%" @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="40" />
              <el-table-column prop="id" label="序号" />
              <el-table-column prop="name" label="设备位置" />
              <el-table-column prop="" label="上级位置" />
              <el-table-column prop="" label="位置类型" />
            </el-table>
            <pagination v-show="positionTotalCount>0" :total="positionTotalCount" :page.sync="positionFormSearce.pageIndex" :limit.sync="positionFormSearce.pageSize" @pagination="getpositionPage" />

            <el-dialog :title="positionFormTitle" :visible.sync="positionFormVisible" :close-on-press-escape="false" :close-on-click-modal="false" width="450px" @close="positionFormClose">
              <el-form ref="positionForm" :model="positionForm" :rules="positionFormRules" label-width="120px">
                <el-form-item label="设备位置" prop="name">
                  <el-input v-model="positionForm.name" placeholder="设备位置" size="small" />
                </el-form-item>
                <el-form-item label="上级位置">
                  <el-input v-model="formSearch.type" placeholder="上级位置" size="small" />
                </el-form-item>
                <el-form-item label="位置类型">
                  <el-input v-model="formSearch.type" placeholder="位置类型" size="small" />
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="positionFormVisible=false">关闭</el-button>
                <el-button type="primary" @click="submitData()">提交更改</el-button>
              </span>
            </el-dialog>

            <el-dialog ref="removeData" title="提示" :close-on-press-escape="false" :close-on-click-modal="false" :visible.sync="removeQuestionVisible" width="220px">
              <span>您确定要删除此条数据？</span>
              <span slot="footer" class="dialog-footer">
                <el-button @click="removeQuestionVisible = false">取 消</el-button>
                <el-button type="primary" @click="removeQuestion">确 定</el-button>
              </span>
            </el-dialog>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import pagination from '@/components/Pagination/index.vue'
export default {
  components: {
    pagination
  },
  data() {
    return {
      positionData: [], // 数据
      positionFormSearce: {
        text: '',
        pageSize: 20,
        pageIndex: 1
      },
      positionTotalCount: 0, // 总条数
      positionFormTitle: '添加设备集成商', // 表单表头
      positionFormVisible: false,
      positionForm: {
        id: undefined,
        name: ''
      },
      positionFormRules: {
        name: {
          required: true,
          message: '位置名称不可为空',
          trigger: 'blur'
        }
      },
      // /////////////////////////////////////
      removeData: null, // 当前表单所选删除行
      tableData: [], // 全部数据
      removeQuestionVisible: false, // 删除弹框隐藏
      searchMessage: '', // 全局搜索的值
      multipleSelection: '', // 当前表单所选行val
      changeActiveVisible: false, // 添加弹出框隐藏
      title: '添加所属系统', // 弹框标题
      formSearch: {// 弹框表单数据
        type: ''
      }
    }
  },
  computed: {},
  mounted() {
    this.getData()
    // this.getOptionsYears()
  },
  methods: {
    // 获取数据
    getData() {
      this.$axios.get('/api/Meta/Position', { params: this.positionFormSearce }).then(res => {
        this.positionData = res.data
        this.positionTotalCount = res.totalCount
      })
    },
    // 分页
    getpositionPage(val) {
      // 展示条数
      this.positionFormSearce.pageSize = val.limit
      // 页码
      this.positionFormSearce.pageIndex = val.page
      // 调用获取数据
      this.getData()
    },
    // 添加
    adddata() {
      this.positionFormVisible = true// 显示弹框
      this.positionFormTitle = '添加位置类型'
    },
    // 提交表单
    submitData() {
      // 添加弹出框点确认方法
      this.$refs.positionForm.validate(valid => {
        if (valid) {
          this.$axios.post('/', this.positionForm).then(res => {
            this.getpositionData()
            this.positionFormVisible = false
          })
        }
      })
    },
    // 表单关闭重置
    positionFormClose() {
      this.$refs.positionForm.resetFields()
    },
    // ////////////////////////////////
    searchdata() {
      // 全局查询方法
    },

    createData() {
      // 添加弹出框点确认方法
      this.changeActiveVisible = false
      // ajax
    },
    updatedata() {
      // 修改方法
      if (this.multipleSelection === '') {
        this.$message.error('请至少选择一条数据')
      } else {
        this.title = '编辑所属系统'
        this.changeActiveVisible = true// 显示弹框
      }
    },
    deletdata(row) {
      if (this.multipleSelection === '') {
        this.$message.error('请至少选择一条数据')
      } else {
        this.removeData = row
        this.removeQuestionVisible = true
      }
    },
    // 删除试题
    removeQuestion() {
      // let _this = this
      // this.$ajax.delete('/api/services/app/Question/DeleteClozeQuestion?Id=' + this.removeData.id).then(response => {
      //   if (response.data.success) {
      //     let index = _this.tableData.indexOf(_this.removeData)
      //     _this.tableData.splice(index, 1)
      //     _this.$message.success('删除成功')
      //     _this.removeQuestionVisible = false
      //   } else {
      //     _this.$message.error(response.data.error.message)
      //   }
      // })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    }
  }
}
</script>
<style lang='scss' scoped>
.header {
  width: 100%;
  .search {
    margin: 10px 0px;
    .el-input {
      display: inline-block;
      width: 200px;
      margin-right: 20px;
    }
  }
}
.content {
  .el-table th,
  .el-table td {
    padding: 5px;
  }
}
</style>
