<!-- 设备种类页面 -->
<template>
  <div>
    <el-row>
      <el-col>
        <div class="panel">
          <div class="header">
            <div class="search">
              <el-input v-model="tableDataSearch.text" placeholder="全局查询" size="small" />
              <el-button type="primary" size="small" @click="getData()">查询</el-button>
              <el-button type="success" size="small" @click="adddata()">添加</el-button>
              <el-button type="warning" size="small" @click="updatedata()">修改</el-button>
              <el-button type="danger" size="small" @click="deletdata()">删除</el-button>
            </div>
          </div>
          <!--表格-->
          <div class="content">
            <el-table :data="tableData" stripe border style="width: 100%" @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="40" />
              <el-table-column prop="id" label="序号" />
              <el-table-column prop="name" label="设备种类" />
            </el-table>
            <!--分页-->
            <pagination v-show="totalCount>0" :total="totalCount" :page.sync="formSearch.pageSize" :limit.sync="formSearch.pageIndex" @pagination="getPage" />
            <!--添加、修改-->
            <el-dialog :title="title" :visible.sync="equipmentTypeFormVisible" :close-on-press-escape="false" :close-on-click-modal="false" width="450px" @close="equipmentTypeFormClose">
              <el-form ref="equipmentTypeForm" :model="equipmentTypeForm" :rules="equipmentTypeFormRules" label-width="120px">
                <el-form-item label="设备种类" prop="name">
                  <el-input v-model="equipmentTypeForm.name" placeholder="设备种类" size="small" />
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="equipmentTypeFormVisible=false">关闭</el-button>
                <el-button type="primary" @click="subimtequipmentTypeForm()">提交</el-button>
              </span>
            </el-dialog>

            <!--删除-->
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
import Pagination from '@/components/Pagination'
export default {
  components: {
    Pagination
  },
  data() {
    return {
      tableData: [], // 全部数据
      tableDataSearch: {
        text: '', // 搜索文本
        pageSize: 20, // 展示条数
        pageIndex: 1// 页码
      },
      totalCount: 0, // 数据总条数
      equipmentTypeFormVisible: false,
      // 设备种类添加编辑
      equipmentTypeForm: {
        id: undefined, // id 添加时为 undefined
        name: ''// 名称
      },
      equipmentTypeFormRules: {
        name: [
          {
            required: true,
            message: '设备类型名称不可为空',
            trigger: 'blur'
          }
        ]
      },
      title: '添加设备种类', // 弹框标题

      removeData: null, // 当前表单所选删除行
      removeQuestionVisible: false, // 删除弹框隐藏
      searchMessage: '', // 全局搜索的值
      multipleSelection: '', // 当前表单所选行val
      changeActiveVisible: false, // 添加弹出框隐藏
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
    // 获取数据
    getData() {
      // 搜索框内容不为空 页码跳转至第一页
      if (this.tableDataSearch.text !== '') {
        this.tableDataSearch.pageIndex = 1
      }
      this.$axios.get('/api/Meta/PositionType', { params: this.tableDataSearch }).then(res => {
        this.tableData = res.data
        this.totalCount = res.totalCount
      })
    },
    // 分页
    getPage(val) {
      // 展示条数
      this.tableDataSearch.pageSize = val.limit
      // 页码
      this.tableDataSearch.pageIndex = val.page
      // 调用获取数据
      this.getData()
    },
    adddata() {
      // 添加方法
      this.equipmentTypeFormVisible = true// 显示弹框
      this.title = '添加设备种类'
    },
    // 添加、编辑设备种类表单提交方法
    subimtequipmentTypeForm() {
      this.$refs.equipmentTypeForm.validate(valid => {
        if (valid) {
          this.$axios.post('/', this.equipmentTypeForm).then(res => {
            this.getData()
            this.removeQuestionVisible = false
          })
        }
      })
    },
    // 添加、编辑设备种类表单关闭重置
    equipmentTypeFormClose() {
      this.$refs.equipmentTypeForm.resetFields()
    },

    updatedata() {
      // 修改方法
      if (this.multipleSelection === '') {
        this.$message.error('请至少选择一条数据')
      } else {
        this.title = '编辑设备种类'
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
