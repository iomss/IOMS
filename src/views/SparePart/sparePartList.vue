Spare<!-- 库房管理页面 -->
<template>
  <div>
    <el-row>
      <el-col>
        <div class="panel">
          <div class="header">

            <div class="tools">
              <el-button type="success" size="small" @click="adddata()">新增备件名称</el-button>
              <el-button type="primary" size="small" @click="updateSpare()">修改</el-button>
              <el-button type="danger" size="small" @click="deleteSpare()">删除</el-button>
            </div>
            <div class="tools">
              <el-button type="success" size="small" @click="getData()">批量导入</el-button>
              <el-button type="primary" size="small" @click="updateData()">导出数据</el-button>
              <el-button type="primary" plain size="small" @click="deleteData()">下载模板</el-button>
            </div>
            <div class="toolsrt">
              <el-form ref="form" :model="SpareFormSearce" label-width="70px">
                <el-input v-model="SpareFormSearce.text" placeholder="全局搜索" size="small" />
                <el-button type="primary" plain size="small" @click="getData()">查询</el-button>
              </el-form>
            </div>
          </div>
          <div class="content">
            <el-table :data="SpareData" stripe border style="width: 100%" @selection-change="handleSelectionChangeSpare">
              <el-table-column type="selection" width="40" />
              <el-table-column type="number" label="编号">
                <template slot-scope="scope">
                  {{ scope.row.number }}
                </template>
              </el-table-column>
              <el-table-column prop="name" label="名称" />
              <el-table-column prop="consumable" label="易损易耗品">
                <template slot-scope="scope">
                  {{ scope.row.consumable?'是':'否' }}
                </template>
              </el-table-column>
              <el-table-column prop="brand.name" label="品牌" />
              <el-table-column prop="model.name" label="型号" />
              <el-table-column prop="unit" label="计量单位" />
              <el-table-column prop="supplier" label="供应商" />
              <el-table-column prop="safetyStock" label="安全库存" />
              <el-table-column prop="image" label="图片">
                <template slot-scope="scope">
                  <el-image v-show="scope.row.image!==''" :src="url+scope.row.image" style="width:100px;height:100px;" />
                </template>
              </el-table-column>
              <el-table-column prop="createTime" label="创建时间" :formatter="formatterDate" />
            </el-table>
            <pagination v-show="SpareTotalCount>0" :total="SpareTotalCount" :page.sync="SpareFormSearce.pageNumber" :limit.sync="SpareFormSearce.pageSize" @pagination="getSparePage" />

            <el-dialog :title="SpareFormTitle" :visible.sync="SpareFormVisible" :close-on-press-escape="false" :close-on-click-modal="false" width="450px" @close="SpareFormClose">
              <el-form ref="SpareForm" :model="SpareForm" :rules="SpareFormRules" label-width="120px">
                <el-form-item label="名称" prop="name">
                  <el-input v-model="SpareForm.name" placeholder="名称" size="small" />
                </el-form-item>
                <el-form-item label="品牌" prop="brandId">
                  <el-select v-model="SpareForm.brandId" filterable remote :remote-method="remoteMethodbrandId" :loading="loading" placeholder="资产类别" size="small" @focus="remoteMethodbrandId" @change="changeBrand">
                    <el-option v-for="item in brandData" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                </el-form-item>
                <el-form-item label="型号" prop="modelId">
                  <el-select v-model="SpareForm.modelId" filterable remote :remote-method="remoteMethodmodelId" :loading="loading" placeholder="资产类别" size="small" @focus="remoteMethodmodelId">
                    <el-option v-for="item in modelData" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                </el-form-item>
                <el-form-item label="计量单位" prop="unit">
                  <el-input v-model="SpareForm.unit" placeholder="计量单位" size="small" />
                </el-form-item>
                <el-form-item label="供应商" prop="supplier">
                  <el-input v-model="SpareForm.supplier" placeholder="供应商" size="small" />
                </el-form-item>
                <el-form-item label="安全库存" prop="safetyStock">
                  <el-input v-model="SpareForm.safetyStock" type="number" placeholder="安全库存" size="small" />
                </el-form-item>
                <el-form-item label="图像" prop="image">
                  <!-- <Uploadimg v-model="SpareForm.image" :reset="SpareForm.image" @uploadimg="uploadimgdata">aaa</Uploadimg> -->
                  <Uploadimg v-model="SpareForm.image" :message="option" @listenToChildEvent="changeImg" />
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="SpareFormVisible=false">关闭</el-button>
                <el-button type="primary" @click="submitSpare()">提交</el-button>
              </span>
            </el-dialog>

            <el-dialog ref="removeData" title="提示" :close-on-press-escape="false" :close-on-click-modal="false" :visible.sync="SpareDeleteModelVisible" width="220px">
              <span>您确定要删除此条数据？</span>
              <span slot="footer" class="dialog-footer">
                <el-button @click="SpareDeleteModelVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitDeleteSpare">确 定</el-button>
              </span>
            </el-dialog>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import Uploadimg from '@/components/Uploadimg/uploadimg.vue'

import pagination from '@/components/Pagination/index.vue'

export default {
  components: {
    Uploadimg,
    pagination
  },
  data() {
    return {
      url: process.env.VUE_APP_API,
      // 上传讲义配置
      option: {
        fileList: [], // 已上传文件列表  格式 {name:sdf,url:src}
        listType: 'picture-card', // 列表展示类型
        limit: 1, // 允许上传数量
        messageErrorFormat: '上传文件格式不正确', // 文件格式错误提示
        messageErrorNumber: '最多允许上传1个文件', // 文件个数超出
        messageSuccess: '上传成功', // 文件上传成功提示
        accept: '' // 文件允许类型格式
      },
      // ////////////////////////////////////////////////////////////////////////////////////
      loading: false, // 远程搜索
      brandData: [], // 品牌数据
      modelData: [], // 型号数据
      SupplierData: [], // 供应商数据
      SpareData: [], // 数据
      SpareFormSearce: {
        text: '',
        pageSize: 20,
        pageNumber: 1
      },
      SpareTotalCount: 0, // 总条数
      SpareFormTitle: '添加备品备件', // 表单表头
      SpareFormVisible: false,
      SpareForm: {
        id: undefined,
        name: '',
        brandId: null, // 品牌
        modelId: null, // 型号
        unit: '', // 计量单位
        supplier: null, // 供应商
        safetyStock: '', // 安全库存
        image: ''// 图像
      },
      SpareFormRules: {
        name: {
          required: true,
          message: '名称不可为空',
          trigger: 'blur'
        },
        brandId: {
          required: true,
          message: '所属品牌不可为空',
          trigger: 'blur'
        },
        modelId: {
          required: true,
          message: '所属型号不可为空',
          trigger: 'blur'
        },
        unit: {
          required: true,
          message: '计量单位不可为空',
          trigger: 'blur'
        },
        supplier: {
          required: true,
          message: '供应商不可为空',
          trigger: 'blur'
        },
        safetyStock: {
          required: true,
          message: '安全库存不可为空',
          trigger: 'blur'
        }
      },
      SpareDeleteModelVisible: false,
      SpareDeleteDataId: null,
      multipleSelectionpSpare: []
    }
  },
  computed: {},
  mounted() {
    this.getData()
    this.getbrandData()
    this.getmodelData()
  },
  methods: {
    changeImg(data) {
      this.SpareForm.image = data
    },
    // 时间格式化
    formatterDate(row, column, cellValue) {
      if (cellValue !== null) {
        return this.$moment(cellValue).format('YYYY-MM-DD HH:mm:ss')
      } else {
        return cellValue
      }
    },
    // 获取数据
    getData() {
      this.$axios.get('/api/Spare', { params: this.SpareFormSearce }).then(res => {
        this.SpareData = res.data
        this.SpareTotalCount = res.totalCount
      })
    },
    // 分页
    getSparePage(val) {
      // 展示条数
      this.SpareFormSearce.pageSize = val.limit
      // 页码
      this.SpareFormSearce.pageNumber = val.page
      // 调用获取数据
      this.getData()
    },
    getbrandData() {
      // 获取品牌
      this.$axios.get('/api/Meta/Brand').then(res => {
        this.brandData = res.data
      })
    },
    // 品牌远程过滤
    remoteMethodbrandId(query) {
      this.loading = true
      let querytext = ''
      querytext = typeof (query) === 'string' ? query : ''
      this.$axios.get('/api/Meta/Brand?text=' + querytext).then(res => {
        this.loading = false
        this.brandData = res.data
      })
    },
    changeBrand() {
      this.SpareForm.modelId = ''
      this.$axios.get('/api/Meta/Model?brandId=' + this.SpareForm.brandId).then(res => {
        this.modelData = res.data
      })
    },
    getmodelData() {
      // 获取型号
      this.$axios.get('/api/Meta/Model').then(res => {
        this.modelData = res.data
      })
    },
    // 型号远程过滤
    remoteMethodmodelId(query) {
      this.loading = true
      let querytext = ''
      querytext = typeof (query) === 'string' ? query : ''
      this.$axios.get('/api/Meta/Model?brandId=' + this.SpareForm.brandId + '&text=' + querytext).then(res => {
        this.loading = false
        this.modelData = res.data
      })
    },
    // 表单关闭重置
    SpareFormClose() {
      this.$refs.SpareForm.resetFields()
    },
    // 添加
    adddata() {
      this.SpareFormVisible = true// 显示弹框
      this.SpareFormTitle = '添加备品备件'
      this.SpareForm.id = undefined
      this.SpareForm.name = ''
      this.SpareForm.brandId = null
      this.SpareForm.modelId = null
      this.SpareForm.unit = ''
      this.SpareForm.supplier = null
      this.SpareForm.safetyStock = ''
      this.SpareForm.image = ''
      this.option.fileList = []
    },
    // 编辑
    updateSpare(row) {
      if (row === undefined) {
        this.SpareFormTitle = '编辑'
        if (this.multipleSelectionpSpare.length !== 1) {
          this.$message.error('请选择一项数据进行操作')
        } else {
          const multipleBrand = [...[this.multipleSelectionpSpare[0].brand], ...this.brandData]
          this.brandData = multipleBrand.reduce((all, next) => all.some((item) => item['id'] === next['id']) ? all : [...all, next], [])
          const multipleModel = [...[this.multipleSelectionpSpare[0].model], ...this.modelData]
          this.modelData = multipleModel.reduce((all, next) => all.some((item) => item['id'] === next['id']) ? all : [...all, next], [])
          this.SpareFormVisible = true
          this.SpareForm.id = this.multipleSelectionpSpare[0].id
          this.SpareForm.name = this.multipleSelectionpSpare[0].name
          this.SpareForm.brandId = this.multipleSelectionpSpare[0].brandId
          this.SpareForm.modelId = this.multipleSelectionpSpare[0].modelId
          this.SpareForm.unit = this.multipleSelectionpSpare[0].unit
          this.SpareForm.supplier = this.multipleSelectionpSpare[0].supplier
          this.SpareForm.safetyStock = this.multipleSelectionpSpare[0].safetyStock
          this.SpareForm.image = this.multipleSelectionpSpare[0].image
          if (this.multipleSelectionpSpare[0].image !== '') {
            this.option.fileList = [{ url: this.url + this.multipleSelectionpSpare[0].image }]
          }
        }
      } else {
        const brand = [...[this.multipleSelectionpSpare[0].brand], ...this.brandData]
        this.brandData = brand.reduce((all, next) => all.some((item) => item['id'] === next['id']) ? all : [...all, next], [])
        const model = [...[this.multipleSelectionpSpare[0].model], ...this.modelData]
        this.modelData = model.reduce((all, next) => all.some((item) => item['id'] === next['id']) ? all : [...all, next], [])
        this.SpareFormVisible = true
        this.SpareForm.id = row.id
        this.SpareForm.name = row.name
        this.SpareForm.brandId = row.brandId
        this.SpareForm.modelId = row.modelId
        this.SpareForm.unit = row.unit
        this.SpareForm.supplier = row.supplier
        this.SpareForm.safetyStock = row.safetyStock
        this.SpareForm.image = row.image
        if (row.image !== '') {
          this.option.fileList = [{ url: this.url + row.image }]
        }
      }
    },
    // 表单提交
    submitSpare() {
      this.$refs.SpareForm.validate(valid => {
        if (valid) {
          if (this.SpareForm.id === undefined) {
            this.$axios.post('/api/Spare', this.SpareForm).then(res => {
              this.getData()
              this.$message.success('添加成功')
              this.SpareFormVisible = false
            })
          } else {
            this.$axios.put('/api/Spare/' + this.SpareForm.id, this.SpareForm).then(res => {
              this.getData()
              this.$message.success('修改成功')
              this.SpareFormVisible = false
            })
          }
        }
      })
    },
    // 删除
    deleteSpare(row) {
      if (row === undefined) {
        if (this.multipleSelectionpSpare.length !== 1) {
          this.$message.error('请选择一项数据进行操作')
        } else {
          this.SpareDeleteModelVisible = true
          this.SpareDeleteDataId = this.multipleSelectionpSpare[0].id
        }
      } else {
        this.SpareDeleteModelVisible = true
        this.SpareDeleteDataId = row.id
      }
    },
    // 提交删除
    submitDeleteSpare() {
      this.$axios.delete('/api/Spare/' + this.SpareDeleteDataId).then(res => {
        this.getData()
        this.$message.success('删除成功')
        this.SpareDeleteModelVisible = false
      })
    },
    // 表单多选数据
    handleSelectionChangeSpare(val) {
      this.multipleSelectionpSpare = val
    }
  }
}
</script>
<style lang='scss' scoped>
.header {
  width: 100%;
}

.tools {
  margin: 10px 0px;
  width: 400px;
  display: inline-block;
}
.toolsrt {
  width: 30%;
  display: inline-block;
  .el-input {
    width: 200px;
  }
}
.content {
  .el-table th,
  .el-table td {
    padding: 5px;
  }
}
</style>
