<!-- 品牌型号页面 -->
<template>
  <div>
    <el-row>
      <el-col :span="12">
        <div class="panel">
          <div class="header">
            <div class="search">
              <el-input v-model="searchMessageBrand" placeholder="全局查询" size="small" />
              <el-button type="primary" size="small" @click="searchBrand()">查询</el-button>
              <el-button type="success" size="small" @click="addBrand()">添加</el-button>
              <el-button type="warning" size="small" @click="updateBrand()">修改</el-button>
              <el-button type="danger" size="small" @click="deletBrand()">删除</el-button>
            </div>
          </div>
          <div class="content">
            <el-table :data="tableDataBrand" stripe border style="width: 100%" @selection-change="handleSelectionChangeBrand">
              <el-table-column type="selection" width="40" />
              <el-table-column prop="id" label="序号" width="100" />
              <el-table-column prop="name" label="品牌名称" width="150" />
            </el-table>
            <pagination v-show="totalBrand>0" :total="totalBrand" :page.sync="pageBrand" @pagination="getListBrand" />
            <el-dialog ref="removeData" title="提示" :close-on-press-escape="false" :close-on-click-modal="false" :visible.sync="removeQuestionVisibleBrand" width="220px">
              <span>您确定要删除此条数据？</span>
              <span slot="footer" class="dialog-footer">
                <el-button @click="removeQuestionVisibleBrand = false">取 消</el-button>
                <el-button type="primary" @click="removeQuestionBrand">确 定</el-button>
              </span>
            </el-dialog>
            <el-dialog :title="titleBrand" :visible.sync="changeActiveVisibleBrand" :close-on-press-escape="false" :close-on-click-modal="false" width="450px">
              <el-form ref="form" :model="formSearchBrand" label-width="120px">
                <el-form-item label="品牌名称">
                  <el-input v-model="formSearchBrand.type" placeholder="品牌名称" size="small" />
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="changeActiveVisibleBrand=false">关闭</el-button>
                <el-button type="primary" @click="createBrand()">提交更改</el-button>
              </span>
            </el-dialog>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="panel">
          <div class="header">
            <div class="search">
              <el-input v-model="searchMessageModel" placeholder="全局查询" size="small" />
              <el-button type="primary" size="small" @click="searchModel()">查询</el-button>
              <el-button type="success" size="small" @click="addModel()">添加</el-button>
              <el-button type="warning" size="small" @click="updateModel()">修改</el-button>
              <el-button type="danger" size="small" @click="deletModel()">删除</el-button>
            </div>
          </div>
          <div class="content">
            <el-table :data="tableDataModel" stripe border style="width: 100%" @selection-change="handleSelectionChangeModel">
              <el-table-column type="selection" width="40" />
              <el-table-column prop="id" label="序号" width="100" />
              <el-table-column prop="name" label="型号名称" width="150" />
            </el-table>
            <pagination v-show="totalModel>0" :total="totalModel" :page.sync="pageBrand" @pagination="getListModel" />
            <el-dialog ref="removeData" title="提示" :close-on-press-escape="false" :close-on-click-modal="false" :visible.sync="removeQuestionVisibleModel" width="220px">
              <span>您确定要删除此条数据？</span>
              <span slot="footer" class="dialog-footer">
                <el-button @click="removeQuestionVisibleModel = false">取 消</el-button>
                <el-button type="primary" @click="removeQuestionModel">确 定</el-button>
              </span>
            </el-dialog>
            <el-dialog :title="titleModel" :visible.sync="changeActiveVisibleModel" :close-on-press-escape="false" :close-on-click-modal="false" width="450px">
              <el-form ref="form" :model="formSearchModel" label-width="120px">
                <el-form-item label="型号名称">
                  <el-input v-model="formSearchModel.type" placeholder="型号名称" size="small" />
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="changeActiveVisibleModel=false">关闭</el-button>
                <el-button type="primary" @click="createModel()">提交更改</el-button>
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
      // Model数据
      removeDataModel: null, // 当前表单所选删除行
      tableDataModel: [], // 全部数据
      removeQuestionVisibleModel: false, // 删除弹框隐藏
      searchMessageModel: '', // 全局搜索的值
      multipleSelectionModel: '', // 当前表单所选行val
      changeActiveVisibleModel: false, // 添加弹出框隐藏
      titleModel: '添加型号名称', // 型号弹框标题
      formSearchModel: {// 弹框表单数据
        id: '',
        name: ''
      },
      totalBrand: 0, // 品牌总数量
      pageBrand: 1, // 品牌第几页
      // brand数据
      removeDataBrand: null, // 当前表单所选删除行
      tableDataBrand: [], // 全部数据
      removeQuestionVisibleBrand: false, // 删除弹框隐藏
      searchMessageBrand: '', // 全局搜索的值
      multipleSelectionBrand: '', // 当前表单所选行val
      changeActiveVisibleBrand: false, // 添加弹出框隐藏
      titleBrand: '添加品牌名称', // 品牌弹框标题
      formSearchBrand: {// 弹框表单数据
        id: '',
        name: ''
      },
      totalModel: 0, // 型号总数量
      pageModel: 1 // 型号第几页
    }
  },
  computed: {},
  mounted() {
    this.GetDataBrand()
    this.GetDataModel()
    // this.getOptionsYears()
  },
  methods: {
    GetDataBrand() {
      this.$axios.get('/api/Meta/Brand').then(response => {
        this.tableDataBrand = response.data
        this.totalBrand = response.totalCount
        this.pageBrand = response.pageCount
      })
    },
    getListBrand() { // 品牌切换page方法

    },
    searchBrand() {
      // 全局查询方法
    },
    addBrand() {
      // 添加方法
      this.changeActiveVisibleBrand = true// 显示弹框
      this.titleBrand = '添加品牌名称'
    },
    createBrand() {
      // 添加弹出框点确认方法
      this.changeActiveVisibleBrand = false
      // ajax
    },
    updateBrand() {
      // 修改方法
      if (this.multipleSelectionBrand === '') {
        this.$message.error('请选择一条数据')
      } else if (this.multipleSelectionBrand.length !== 1) {
        this.$message.error('请选择一条数据')
      } else {
        this.titleBrand = '编辑品牌名称'
        this.changeActiveVisibleBrand = true// 显示弹框
        this.formSearchBrand = this.multipleSelectionBrand[0]
      }
    },
    deletBrand(row) {
      if (this.multipleSelectionBrand === '') {
        this.$message.error('请至少选择一条数据')
      } else {
        this.removeDataBrand = row
        this.removeQuestionVisibleBrand = true
      }
    },
    // 删除试题
    removeQuestionBrand() {
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
    handleSelectionChangeBrand(val) {
      this.multipleSelectionBrand = val
      console.log(val[0])
    },
    //
    // Model所有方法
    //
    GetDataModel() {
      this.$axios.get('/api/Meta/Model').then(response => {
        this.tableDataModel = response.data
        this.totalModel = response.totalCount
        this.pageModel = response.pageCount
      })
    },
    getListModel() { // 型号切换page方法

    },
    searchModel() {
      // 全局查询方法
    },
    addModel() {
      // 添加方法
      this.changeActiveVisibleModel = true// 显示弹框
      this.titleModel = '添加型号名称'
    },
    createModel() {
      // 添加弹出框点确认方法
      this.changeActiveVisibleModel = false
      // ajax
    },
    updateModel() {
      // 修改方法
      if (this.multipleSelectionModel === '') {
        this.$message.error('请选择一条数据')
      } else if (this.multipleSelectionModel.length !== 1) {
        this.$message.error('请选择一条数据')
      } else {
        this.titleModel = '编辑品牌名称'
        this.changeActiveVisibleModel = true// 显示弹框
        this.formSearchModel = this.multipleSelectionModel[0]
      }
    },
    deletModel(row) {
      if (this.multipleSelectionModel === '') {
        this.$message.error('请至少选择一条数据')
      } else {
        this.removeDataModel = row
        this.removeQuestionVisibleModel = true
      }
    },
    // 删除试题
    removeQuestionModel() {
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
    handleSelectionChangeModel(val) {
      this.multipleSelectionModel = val
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
