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
              <el-button type="danger" size="small" @click="deleteBrand()">删除</el-button>
            </div>
          </div>
          <div class="content">
            <el-table ref="brandTable" :data="brandData" stripe border style="width: 100%" @selection-change="handleSelectionChangeBrand">
              <el-table-column type="selection" width="40">
                <template slot-scope="scope">
                  <el-radio v-model="brandRadio" :label="scope.row.name" @change.native="getBrandRow(scope.row)">&nbsp;</el-radio>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                  <el-button style="display:block;margin-left:0;margin-bottom:5px;" size="mini" type="primary" @click="updateBrand(scope.row)">编辑</el-button>
                  <el-button style="display:block;margin-left:0;margin-bottom:5px;" size="mini" type="danger" @click="deleteBrand(scope.row)">删除</el-button>
                </template>
              </el-table-column>
              <el-table-column type="index" label="序号" width="100" />
              <el-table-column prop="name" label="品牌名称" width="150" />
            </el-table>
            <pagination v-show="brandTotalCount>0" :total="brandTotalCount" :page.sync="brandFormSearce.pageNumber" :limit.sync="brandFormSearce.pageSize" @pagination="getBrandPage" />

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

            <el-dialog ref="removeData" title="提示" :close-on-press-escape="false" :close-on-click-modal="false" :visible.sync="brandDeleteModelVisible" width="220px">
              <span>您确定要删除此条数据？</span>
              <span slot="footer" class="dialog-footer">
                <el-button @click="brandDeleteModelVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitDeleteBrand">确 定</el-button>
              </span>
            </el-dialog>
          </div>
        </div>
      </el-col>
      <!------------------------------------------------------------------------------------------------------------------------------->
      <el-col :span="12">
        <div class="panel">
          <div class="header">
            <div class="search">
              <el-input v-model="modelFormSearch.text" placeholder="全局查询" size="small" />
              <el-button type="primary" size="small" @click="getModelData()">查询</el-button>
              <el-button type="success" size="small" @click="addModel()">添加</el-button>
              <el-button type="warning" size="small" @click="updateModel()">修改</el-button>
              <el-button type="danger" size="small" @click="deleteModel()">删除</el-button>
            </div>
          </div>
          <div class="content">
            <el-table :data="modelData" stripe border style="width: 100%" @selection-change="handleSelectionChangeModel">
              <el-table-column type="selection" width="40">
                <template slot-scope="scope">
                  <el-radio v-model="modelRadio" :label="scope.row.name" @change.native="getModelRow(scope.row)">&nbsp;</el-radio>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                  <el-button style="display:block;margin-left:0;margin-bottom:5px;" size="mini" type="primary" @click="updateModel(scope.row)">编辑</el-button>
                  <el-button style="display:block;margin-left:0;margin-bottom:5px;" size="mini" type="danger" @click="deleteModel(scope.row)">删除</el-button>
                </template>
              </el-table-column>
              <el-table-column type="index" label="序号" width="100" />
              <el-table-column prop="name" label="型号名称" width="150" />
              <el-table-column prop="brandName" label="品牌" width="150" />
            </el-table>
            <pagination v-show="modelTotalCount>0" :total="modelTotalCount" :page.sync="modelFormSearch.pageNumber" :limit.sync="modelFormSearch.pageSize" @pagination="getModelPage" />

            <el-dialog :title="modelFormTitle" :visible.sync="modelFormVisible" :close-on-press-escape="false" :close-on-click-modal="false" width="450px" @close="modelFormClose">
              <el-form ref="modelForm" :model="modelForm" :rules="modelFormRules" label-width="120px">
                <el-form-item label="型号名称" prop="name">
                  <el-input v-model="modelForm.name" placeholder="型号名称" size="small" />
                </el-form-item>
                <el-form-item label="品牌" prop="brandId">
                  <el-select v-model="modelForm.brandId" filterable remote :remote-method="remoteMethodBrandData" :loading="loading" placeholder="请选择" size="small" @focus="remoteMethodBrandData">
                    <el-option v-for="item in sertchBrandData" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="modelFormVisible=false">关闭</el-button>
                <el-button type="primary" @click="submitModel()">提交</el-button>
              </span>
            </el-dialog>

            <el-dialog ref="removeData" title="提示" :close-on-press-escape="false" :close-on-click-modal="false" :visible.sync="modelDeleteModelVisible" width="220px">
              <span>您确定要删除此条数据？</span>
              <span slot="footer" class="dialog-footer">
                <el-button @click="modelDeleteModelVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitDeleteModel">确 定</el-button>
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
      loading: false,
      brandRadio: '', // 品牌 table 单选按钮
      // 品牌
      brandData: [], // 数据
      brandFormSearce: {
        text: '',
        pageSize: 20,
        pageNumber: 1
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
      brandDeleteModelVisible: false,
      brandDeleteDataId: null,
      multipleSelectionBrand: [],
      /** **************************************************************************************************************************** */
      modelRadio: '', // 型号 table 单选按钮
      // 型号
      sertchBrandData: [],
      modelData: [], // 数据
      modelFormSearch: {
        brandId: undefined,
        text: '',
        pageSize: 20,
        pageNumber: 1
      },
      modelTotalCount: 0, // 总条数
      modelFormTitle: '添加型号',
      modelFormVisible: false,
      modelForm: {
        id: undefined,
        brandId: null,
        name: ''
      },
      modelFormRules: {
        name: {
          required: true,
          message: '型号名称不可为空',
          trigger: 'blur'
        },
        brandId: {
          required: true,
          message: '所属型号不可为空',
          trigger: 'blur'
        }
      },
      modelDeleteModelVisible: false,
      modelDeleteDataId: null,
      multipleSelectionModel: []
    }
  },
  mounted() {
    this.getBrandData()
    this.getModelData()
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
      this.brandFormSearce.pageNumber = val.page
      // 调用获取数据
      this.getBrandData()
    },
    addBrand() {
      // 添加方法
      this.brandFormVisible = true// 显示弹框
      this.brandFormTitle = '添加品牌名称'
      this.brandForm.id = undefined
      this.brandForm.name = ''
    },
    updateBrand(row) {
      this.brandFormTitle = '编辑品牌名称'
      if (row === undefined) {
        if (this.multipleSelectionBrand.length !== 1) {
          this.$message.error('请选择一项品牌数据进行操作')
        } else {
          this.brandFormVisible = true
          this.brandForm.id = this.multipleSelectionBrand[0].id
          this.brandForm.name = this.multipleSelectionBrand[0].name
        }
      } else {
        this.brandFormVisible = true
        this.brandForm.id = row.id
        this.brandForm.name = row.name
      }
    },
    // 品牌表单提交
    submitBrand() {
      this.$refs.brandForm.validate(valid => {
        if (valid) {
          if (this.brandForm.id === undefined) {
            this.$axios.post('/api/Meta/Brand', this.brandForm).then(res => {
              this.getBrandData()
              this.$message.success('品牌添加成功')
              this.brandFormVisible = false
            })
          } else {
            this.$axios.put('/api/Meta/Brand/' + this.brandForm.id, this.brandForm).then(res => {
              this.getBrandData()
              this.$message.success('品牌修改成功')
              this.brandFormVisible = false
            })
          }
        }
      })
    },
    // 品牌表单关闭重置
    brandFormClose() {
      this.$refs.brandForm.resetFields()
    },
    // 删除品牌
    deleteBrand(row) {
      if (row === undefined) {
        if (this.multipleSelectionBrand.length !== 1) {
          this.$message.error('请选择一项品牌数据进行操作')
        } else {
          this.brandDeleteModelVisible = true
          this.brandDeleteDataId = this.multipleSelectionBrand[0].id
        }
      } else {
        this.brandDeleteModelVisible = true
        this.brandDeleteDataId = row.id
      }
    },
    // 提交删除品牌
    submitDeleteBrand() {
      this.$axios.delete('/api/Meta/Brand/' + this.brandDeleteDataId).then(res => {
        this.getBrandData()
        this.$message.success('品牌删除成功')
        this.brandDeleteModelVisible = false
      })
    },
    // 品牌表单多选数据
    handleSelectionChangeBrand(val) {
      this.multipleSelectionBrand = val
    },
    getBrandRow(row) {
      this.multipleSelectionBrand = []
      this.multipleSelectionBrand.push(row)
      this.modelFormSearch.brandId = row.id
      this.getModelData()
    },
    /** ***************************************************************************************************************************************** */
    // 型号
    getModelData() {
      this.$axios.get('/api/Meta/Model', { params: this.modelFormSearch }).then(res => {
        this.modelData = res.data
        this.modelTotalCount = res.totalCount
      })
    },
    // 型号分页
    getModelPage(val) {
      // 展示条数
      this.modelFormSearch.pageSize = val.limit
      // 页码
      this.modelFormSearch.pageNumber = val.page
      // 调用获取数据
      this.getModelData()
    },
    remoteMethodBrandData(query) {
      this.loading = true
      let querytext = ''
      querytext = typeof (query) === 'string' ? query : ''
      this.$axios.get('/api/Meta/Brand?text=' + querytext).then(res => {
        this.loading = false
        this.sertchBrandData = res.data
        if (this.modelFormTitle === '编辑型号名称') {
          let hasbrandData = false
          this.sertchBrandData.forEach(item => { item.id === this.multipleSelectionModel[0].brandId ? hasbrandData = true : '' })
          hasbrandData ? '' : this.sertchBrandData.push({ id: this.multipleSelectionModel[0].brandId, name: this.multipleSelectionModel[0].brandName })
        }
      })
    },
    addModel() {
      // 添加方法
      this.modelFormVisible = true// 显示弹框
      this.modelFormTitle = '添加型号名称'
      this.modelForm.id = undefined
      this.modelForm.name = ''
      this.modelForm.brandId = undefined
    },
    updateModel(row) {
      let hasbrandData = false
      this.sertchBrandData.forEach(item => { item.id === row.brandId ? hasbrandData = true : '' })
      hasbrandData ? '' : this.sertchBrandData.push({ id: row.brandId, name: row.brandName })

      this.multipleSelectionModel = [row]
      this.modelFormTitle = '编辑型号名称'
      if (row === undefined) {
        // 判断当前按选中值是否存在，不存在插入
        if (this.multipleSelectionModel.length !== 1) {
          this.$message.error('请选择一项型号数据进行操作')
        } else {
          this.modelFormVisible = true
          this.modelForm.id = this.multipleSelectionModel[0].id
          this.modelForm.name = this.multipleSelectionModel[0].name
          this.modelForm.brandId = this.multipleSelectionModel[0].brandId
        }
      } else {
        this.modelFormVisible = true
        this.modelForm.id = row.id
        this.modelForm.name = row.name
        this.modelForm.brandId = row.brandId
      }
    },
    // 型号表单提交
    submitModel() {
      this.$refs.modelForm.validate(valid => {
        if (valid) {
          if (this.modelForm.id === undefined) {
            this.$axios.post('/api/Meta/Model', this.modelForm).then(res => {
              this.getModelData()
              this.$message.success('型号添加成功')
              this.modelFormVisible = false
            })
          } else {
            this.$axios.put('/api/Meta/Model/' + this.modelForm.id, this.modelForm).then(res => {
              this.getModelData()
              this.$message.success('型号编辑成功')
              this.modelFormVisible = false
            })
          }
        }
      })
    },
    // 型号表单关闭重置
    modelFormClose() {
      this.$refs.modelForm.resetFields()
    },
    // 删除
    deleteModel(row) {
      if (row === undefined) {
        if (this.multipleSelectionModel.length !== 1) {
          this.$message.error('请选择一项型号数据进行操作')
        } else {
          this.modelDeleteModelVisible = true
          this.modelDeleteDataId = this.multipleSelectionModel[0].id
        }
      } else {
        this.modelDeleteModelVisible = true
        this.modelDeleteDataId = row.id
      }
    },
    // 提交删除品牌
    submitDeleteModel() {
      this.$axios.delete('/api/Meta/Model/' + this.modelDeleteDataId).then(res => {
        this.getModelData()
        this.$message.success('型号删除成功')
        this.modelDeleteModelVisible = false
      })
    },
    // 型号table 多选数据
    handleSelectionChangeModel(val) {
      this.multipleSelectionModel = val
    },
    getModelRow(row) {
      this.multipleSelectionModel = []
      this.multipleSelectionModel.push(row)
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
