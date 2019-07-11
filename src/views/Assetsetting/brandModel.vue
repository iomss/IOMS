<!-- 品牌型号页面 -->
<template>
  <div>
    <el-row>
      <el-col :span="12">
        <div class="panel">
          <div class="header">
            <div class="search">
              <el-input v-model="brandFormSearce.text" placeholder="全局查询" size="small" />
              <el-button type="primary" size="small" @click="getBrandData()">查询</el-button>
              <el-button type="success" size="small" @click="addBrand()">添加</el-button>
              <el-button type="warning" size="small" @click="updateBrand()">修改</el-button>
              <el-button type="danger" size="small" @click="deletBrand()">删除</el-button>
            </div>
          </div>
          <div class="content">
            <el-table :data="brandData" stripe border style="width: 100%" @selection-change="handleSelectionChangeBrand">
              <el-table-column type="selection" width="40" />
              <el-table-column prop="id" label="序号" width="100" />
              <el-table-column prop="name" label="品牌名称" width="150" />
            </el-table>
            <pagination v-show="brandTotalCount>0" :total="brandTotalCount" :page.sync="brandFormSearce.pageIndex" :limit.sync="brandFormSearce.pageSize" @pagination="getBrandPage" />

            <el-dialog :title="brandFormTitle" :visible.sync="brandFormVisible" :close-on-press-escape="false" :close-on-click-modal="false" width="450px" @close="brandFormClose">
              <el-form ref="brandForm" :model="brandForm" :rules="brandFormRules" label-width="120px">
                <el-form-item label="品牌名称" prop="name">
                  <el-input v-model="brandForm.name" placeholder="品牌名称" size="small" />
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="brandFormVisible=false">关闭</el-button>
                <el-button type="primary" @click="submitBrand()">提交</el-button>
              </span>
            </el-dialog>

            <el-dialog ref="removeData" title="提示" :close-on-press-escape="false" :close-on-click-modal="false" :visible.sync="removeQuestionVisibleBrand" width="220px">
              <span>您确定要删除此条数据？</span>
              <span slot="footer" class="dialog-footer">
                <el-button @click="removeQuestionVisibleBrand = false">取 消</el-button>
                <el-button type="primary" @click="removeQuestionBrand">确 定</el-button>
              </span>
            </el-dialog>

          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="panel">
          <div class="header">
            <div class="search">
              <el-input v-model="metaModelFormSearch.text" placeholder="全局查询" size="small" />
              <el-button type="primary" size="small" @click="getMetaModelData()">查询</el-button>
              <el-button type="success" size="small" @click="addMetaModel()">添加</el-button>
              <el-button type="warning" size="small" @click="updateModel()">修改</el-button>
              <el-button type="danger" size="small" @click="deletModel()">删除</el-button>
            </div>
          </div>
          <div class="content">
            <el-table :data="metaModelData" stripe border style="width: 100%" @selection-change="handleSelectionChangeModel">
              <el-table-column type="selection" width="40" />
              <el-table-column prop="id" label="序号" width="100" />
              <el-table-column prop="name" label="型号名称" width="150" />
            </el-table>
            <pagination v-show="metaModelTotalCount>0" :total="metaModelTotalCount" :page.sync="metaModelFormSearch.pageIndex" :limit.sync="metaModelFormSearch.pageSize" @pagination="getMetaModelPage" />

            <el-dialog :title="metaModelFormTitle" :visible.sync="metaModelFormVisible" :close-on-press-escape="false" :close-on-click-modal="false" width="450px" @close="metaModelFormClose">
              <el-form ref="metaModelForm" :model="metaModelForm" :rules="metaModelFormRules" label-width="120px">
                <el-form-item label="型号名称" prop="name">
                  <el-input v-model="metaModelForm.name" placeholder="型号名称" size="small" />
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="metaModelFormVisible=false">关闭</el-button>
                <el-button type="primary" @click="submitMetaModel()">提交</el-button>
              </span>
            </el-dialog>

            <el-dialog ref="removeData" title="提示" :close-on-press-escape="false" :close-on-click-modal="false" :visible.sync="removeQuestionVisibleModel" width="220px">
              <span>您确定要删除此条数据？</span>
              <span slot="footer" class="dialog-footer">
                <el-button @click="removeQuestionVisibleModel = false">取 消</el-button>
                <el-button type="primary" @click="removeQuestionModel">确 定</el-button>
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
      // 品牌
      brandData: [], // 数据
      brandFormSearce: {
        text: '',
        pageSize: 20,
        pageIndex: 1
      },
      brandTotalCount: 0, // 总条数
      brandFormTitle: '添加品牌', // 表单表头
      brandFormVisible: false,
      brandForm: {
        id: undefined,
        name: ''
      },
      brandFormRules: {
        name: {
          required: true,
          message: '品牌名称不可为空',
          trigger: 'blur'
        }
      },
      // 型号
      metaModelData: [], // 数据
      metaModelFormSearch: {
        text: '',
        pageSize: 20,
        pageIndex: 1
      },
      metaModelTotalCount: 0, // 总条数
      metaModelFormTitle: '添加型号',
      metaModelFormVisible: false,
      metaModelForm: {
        id: undefined,
        brandId: null,
        name: ''
      },
      metaModelFormRules: {
        name: {
          required: true,
          message: '型号名称不可为空',
          trigger: 'blur'
        }
      },
      // ///////////////////////////////////////////////
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
      // tableDataBrand: [], // 全部数据
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
  mounted() {
    this.getBrandData()
    this.getMetaModelData()
  },
  methods: {
    // 品牌
    // 获取品牌信息
    getBrandData() {
      this.$axios.get('/api/Meta/Brand', { params: this.brandFormSearce }).then(res => {
        this.brandData = res.data
        this.brandTotalCount = res.totalCount
      })
    },
    // 品牌分页
    getBrandPage(val) {
      // 展示条数
      this.brandFormSearce.pageSize = val.limit
      // 页码
      this.brandFormSearce.pageIndex = val.page
      // 调用获取数据
      this.getBrandData()
    },
    addBrand() {
      // 添加方法
      this.brandFormVisible = true// 显示弹框
      this.brandFormTitle = '添加品牌名称'
    },
    // 品牌表单提交
    submitBrand() {
      this.$refs.brandForm.validate(valid => {
        if (valid) {
          this.$axios.post('/', this.brandForm).then(res => {
            this.getBrandData()
            this.brandFormVisible = false
          })
        }
      })
    },
    // 品牌表单关闭重置
    brandFormClose() {
      this.$refs.brandForm.resetFields()
    },
    // 型号
    getMetaModelData() {
      this.$axios.get('/api/Meta/Model', { params: this.metaModelFormSearch }).then(res => {
        this.metaModelData = res.data
        this.metaModelTotalCount = res.totalCount
      })
    },
    // 型号分页
    getMetaModelPage(val) {
      // 展示条数
      this.metaModelFormSearch.pageSize = val.limit
      // 页码
      this.metaModelFormSearch.pageIndex = val.page
      // 调用获取数据
      this.getMetaModelData()
    },
    addMetaModel() {
      // 添加方法
      this.metaModelFormVisible = true// 显示弹框
      this.metaModelFormTitle = '添加型号名称'
    },
    // 型号表单提交
    submitMetaModel() {
      this.$refs.metaModelForm.validate(valid => {
        if (valid) {
          this.$axios.post('/', this.metaModelForm).then(res => {
            this.getBrandData()
            this.metaModelFormVisible = false
          })
        }
      })
    },
    // 型号表单关闭重置
    metaModelFormClose() {
      this.$refs.metaModelForm.resetFields()
    },
    // ////////////////////////////////
    getListBrand() { // 品牌切换page方法
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
    getListModel() { // 型号切换page方法

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
