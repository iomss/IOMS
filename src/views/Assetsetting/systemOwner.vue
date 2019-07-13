<!-- 所属系统页面 -->
<template>
  <div>
    <el-row>
      <el-col>
        <div class="panel">
          <div class="header">
            <div class="search">
              <el-input v-model="searchMessage" placeholder="全局查询" size="small" />
              <el-button type="primary" size="small" @click="searchdata()">查询</el-button>
              <el-button type="success" size="small" @click="adddata()">添加</el-button>
              <el-button type="warning" size="small" @click="updatedata()">修改</el-button>
              <el-button type="danger" size="small" @click="deletdata()">删除</el-button>
            </div>
          </div>
          <div class="content">
            <el-table :data="systemData" stripe border style="width: 100%" @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="40" />
              <el-table-column prop="id" label="序号" />
              <el-table-column prop="name" label="所属系统" />
              <el-table-column prop="parentId" label="上级系统" />
            </el-table>

            <pagination v-show="systemTotalCount>0" :total="systemTotalCount" :page.sync="systemFormSearch.pageNumber" :limit.sync="systemFormSearch.pageSize" @pagination="getSystemPage" />

            <el-dialog :title="systemFormTitle" :visible.sync="systemFormVisible" :close-on-press-escape="false" :close-on-click-modal="false" width="450px" @close="systemFormClose">
              <el-form ref="systemForm" :model="systemForm" :rules="systemFormRules" label-width="120px">
                <el-form-item label="所属系统" prop="name">
                  <el-input v-model="systemForm.name" placeholder="所属系统" size="small" />
                </el-form-item>
                <el-form-item label="上级系统" prop="parentId">
                  <el-input v-model="systemForm.parentId" placeholder="上级系统" size="small" />
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="systemFormVisible=false">关闭</el-button>
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
      systemData: [], // 全部数据
      systemFormSearch: {
        text: '',
        pageSize: 20,
        pageNumber: 1
      },
      systemTotalCount: 0,
      systemFormTitle: '',
      systemFormVisible: false,
      systemForm: {
        id: undefined,
        parentId: null,
        name: ''
      },
      systemFormRules: {
        name: {
          required: true,
          message: '所属系统不可为空',
          trigger: 'blur'
        }
      },
      // /////////////////////////////////////
      removeData: null, // 当前表单所选删除行
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
  },
  methods: {
    getData() {
      this.$axios.get('/api/Meta/System').then(res => {
        this.systemData = res.data
        this.systemTotalCount = res.totalCount
      })
    },
    // 分页
    getSystemPage(val) {
      // 展示条数
      this.systemFormSearch.pageSize = val.limit
      // 页码
      this.systemFormSearch.pageNumber = val.page
      // 调用获取数据
      this.getData()
    },
    adddata() {
      // 添加方法
      this.systemFormVisible = true// 显示弹框
      this.systemFormTitle = '添加所属系统'
    },
    submitData() {
      // 添加弹出框点确认方法
      this.$refs.systemForm.validate(valid => {
        if (valid) {
          this.$axios.post('/', this.systemForm).then(res => {
            this.systemData()
            this.systemFormVisible = false
          })
        }
      })
    },
    // 型号表单关闭重置
    systemFormClose() {
      this.$refs.systemForm.resetFields()
    },
    // //////////////////////////////////////////////////
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
