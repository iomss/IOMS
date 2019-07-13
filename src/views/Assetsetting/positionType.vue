<!-- 位置类型页面 -->
<template>
  <div>
    <el-row>
      <el-col>
        <div class="panel">
          <div class="header">
            <div class="search">
              <el-input v-model="positionTypeFormSearce.text" placeholder="全局查询" size="small" />
              <el-button type="primary" size="small" @click="getData()">查询</el-button>
              <el-button type="success" size="small" @click="adddata()">添加</el-button>
              <el-button type="warning" size="small" @click="updatedata()">修改</el-button>
              <el-button type="danger" size="small" @click="deletdata()">删除</el-button>
            </div>
          </div>
          <div class="content">
            <el-table :data="positionTypeData" stripe border style="width: 100%" @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="40" />
              <el-table-column prop="id" label="序号" />
              <el-table-column prop="name" label="位置类型名称" />
            </el-table>
            <pagination v-show="positionTypeTotalCount>0" :total="positionTypeTotalCount" :page.sync="positionTypeFormSearce.pageNumber" :limit.sync="positionTypeFormSearce.pageSize" @pagination="getpositionTypePage" />

            <el-dialog :title="positionTypeFormTitle" :visible.sync="positionTypeFormVisible" :close-on-press-escape="false" :close-on-click-modal="false" width="450px" @close="positionTypeFormClose">
              <el-form ref="positionTypeForm" :model="positionTypeForm" :rules="positionTypeFormRules" label-width="120px">
                <el-form-item label="位置类型" prop="name">
                  <el-input v-model="positionTypeForm.name" placeholder="位置类型" size="small" />
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="positionTypeFormVisible=false">关闭</el-button>
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
      positionTypeData: [], // 数据
      positionTypeFormSearce: {
        text: '',
        pageSize: 20,
        pageNumber: 1
      },
      positionTypeTotalCount: 0, // 总条数
      positionTypeFormTitle: '添加设备集成商', // 表单表头
      positionTypeFormVisible: false,
      positionTypeForm: {
        id: undefined,
        name: ''
      },
      positionTypeFormRules: {
        name: {
          required: true,
          message: '位置类型不可为空',
          trigger: 'blur'
        }
      },
      // /////////////////////////
      removeData: null, // 当前表单所选删除行
      tableData: [], // 全部数据
      removeQuestionVisible: false, // 删除弹框隐藏
      searchMessage: '', // 全局搜索的值
      multipleSelection: '', // 当前表单所选行val
      changeActiveVisible: false, // 添加弹出框隐藏
      title: '添加位置类型', // 弹框标题
      formSearch: {// 弹框表单数据
        type: ''
      }
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    // 获取数据
    getData() {
      this.$axios.get('/api/Meta/PositionType', { params: this.positionTypeFormSearce }).then(res => {
        this.positionTypeData = res.data
        this.positionTypeTotalCount = res.totalCount
      })
    },
    // 分页
    getpositionTypePage(val) {
      // 展示条数
      this.positionTypeFormSearce.pageSize = val.limit
      // 页码
      this.positionTypeFormSearce.pageNumber = val.page
      // 调用获取数据
      this.getData()
    },
    // 添加
    adddata() {
      this.positionTypeFormVisible = true// 显示弹框
      this.positionTypeFormTitle = '添加位置类型'
    },
    // 提交表单
    submitData() {
      // 添加弹出框点确认方法
      this.$refs.positionTypeForm.validate(valid => {
        if (valid) {
          this.$axios.post('/', this.positionTypeForm).then(res => {
            this.getpositionTypeData()
            this.positionTypeFormVisible = false
          })
        }
      })
    },
    // 表单关闭重置
    positionTypeFormClose() {
      this.$refs.positionTypeForm.resetFields()
    },
    // ////////////////////////////////////////////

    updatedata() {
      // 修改方法
      if (this.multipleSelection === '') {
        this.$message.error('请至少选择一条数据')
      } else {
        this.title = '编辑位置类型'
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
