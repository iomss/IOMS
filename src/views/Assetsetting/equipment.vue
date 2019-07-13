<!-- 设备页面 -->
<template>
  <div>
    <el-row>
      <el-col>
        <div class="panel">
          <div class="header">
            <div class="search">
              <el-input v-model="equipmentFormSearch.text" placeholder="全局查询" size="small" />
              <el-button type="primary" size="small" @click="getData()">查询</el-button>
              <el-button type="success" size="small" @click="adddata()">添加</el-button>
              <el-button type="warning" size="small" @click="updatedata()">修改</el-button>
              <el-button type="danger" size="small" @click="deletdata()">删除</el-button>
            </div>
          </div>
          <div class="content">
            <el-table :data="equipmentData" stripe border style="width: 100%" @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="40" />
              <el-table-column prop="id" label="序号" />
              <el-table-column prop="name" label="设备名称" />
            </el-table>
            <pagination v-show="equipmentTotalCount>0" :total="equipmentTotalCount" :page.sync="equipmentFormSearch.pageNumber" :limit.sync="equipmentFormSearch.pageSize" @pagination="getequipmentPage" />

            <el-dialog :title="equipmentFormTitle" :visible.sync="equipmentFormVisible" :close-on-press-escape="false" :close-on-click-modal="false" width="450px" @close="equipmentFormClose">
              <el-form ref="equipmentForm" :model="equipmentForm" :rules="equipmentFormRules" label-width="120px">
                <el-form-item label="设备" prop="name">
                  <el-input v-model="equipmentForm.name" placeholder="设备" size="small" />
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="equipmentFormVisible=false">关闭</el-button>
                <el-button type="primary" @click="submitData()">提交</el-button>
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
      equipmentData: [], // 数据
      equipmentFormSearch: {
        text: '',
        pageSize: 20,
        pageNumber: 1
      },
      equipmentTotalCount: 0,
      equipmentFormTitle: '',
      equipmentFormVisible: false,
      equipmentForm: {
        id: undefined,
        name: ''
      },
      equipmentFormRules: {
        name: {
          required: true,
          message: '设备名称不可为空',
          trigger: 'blur'
        }
      },
      // //////////////////////////
      removeData: null, // 当前表单所选删除行
      tableData: [], // 全部数据
      removeQuestionVisible: false, // 删除弹框隐藏
      searchMessage: '', // 全局搜索的值
      multipleSelection: '', // 当前表单所选行val
      changeActiveVisible: false, // 添加弹出框隐藏
      title: '添加设备' // 弹框标题

    }
  },
  computed: {},
  mounted() {
    this.getData()
  },
  methods: {
    // 获取数据
    getData() {
      this.$axios.get('/api/Meta/equipment', { params: this.equipmentFormSearch }).then(res => {
        this.equipmentData = res.data
        this.equipmentTotalCount = res.totalCount
      })
    },
    // 分页
    getequipmentPage(val) {
      // 展示条数
      this.equipmentFormSearch.pageSize = val.limit
      // 页码
      this.equipmentFormSearch.pageNumber = val.page
      // 调用获取数据
      this.getData()
    },
    // 添加
    adddata() {
      this.equipmentFormVisible = true// 显示弹框
      this.equipmentFormTitle = '添加设备'
    },
    // 提交表单
    submitData() {
      // 添加弹出框点确认方法
      this.$refs.equipmentForm.validate(valid => {
        if (valid) {
          this.$axios.post('/', this.equipmentForm).then(res => {
            this.getBrandData()
            this.equipmentFormVisible = false
          })
        }
      })
    },
    // 表单关闭重置
    equipmentFormClose() {
      this.$refs.equipmentForm.resetFields()
    },
    // ///////////////////////////////

    updatedata() {
      // 修改方法
      if (this.multipleSelection === '') {
        this.$message.error('请至少选择一条数据')
      } else {
        this.title = '编辑设备'
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
