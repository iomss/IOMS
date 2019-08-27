<!-- 备品备件管理-备件调拨页面 -->
<template>
  <el-col>
    <el-row>
      <el-col>
        <el-row class="panel">
          <div class="header">
            <el-button type="primary" size="small" @click="FormVisible = true">调拨申请</el-button>
          </div>
          <div class="header">
            <div class="tools">
              <el-button type="success" size="small" @click="getData('1')">备件库</el-button>
              <el-button type="success" size="small" @click="getData('2')">维修库</el-button>
              <el-button type="success" size="small" @click="getData('3')">报废库</el-button>
            </div>
            <div class="toolsrt">
              <el-form ref="form" :model="formSearch">
                <el-select v-model="formSearch.start" filterable placeholder="管理单位" size="small">
                  <el-option v-for="item in systemData" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
                <el-select v-model="formSearch.end" filterable placeholder="全部库房" size="small">
                  <el-option v-for="item in systemData" :key="item.id" :label="item.nmae" :value="item.id" />
                </el-select>
                <el-select v-model="formSearch.end" filterable placeholder="备件性质" size="small">
                  <el-option v-for="item in systemData" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
                <el-input v-model="formSearch.text" placeholder="模糊搜索" size="small" />
                <el-button type="primary" plain size="small" @click="getData()">查询</el-button>
              </el-form>
            </div>
          </div>
          <el-col class="content">
            <el-table :data="tableData" stripe border style="width: 1500px" @selection-change="handleSelectionChange">
              <el-table-column type="selection" />
              <el-table-column prop="equipment" label="单位">
                <template slot-scope="scope">
                  {{ scope.row.equipment.name }}
                </template>
              </el-table-column>
              <el-table-column label="库房名称" prop="name">
                <template slot-scope="scope">
                  {{ scope.row.system.name }}
                </template>
              </el-table-column>
              <el-table-column prop="remark" label="设备名称" />
              <el-table-column prop="brand" label="品牌" />
              <el-table-column prop="model" label="型号" />
              <el-table-column prop="source" label="备件类型">
                <template slot-scope="scope">
                  {{ scope.row.source==='Automatic'?"自动汇总":"人工修订" }}
                </template>
              </el-table-column>
              <el-table-column prop="remark" label="数量" />
              <el-table-column prop="remark" label="单价" />
              <el-table-column prop="remark" label="总价" />
              <el-table-column prop="remark" label="年份" />
              <el-table-column prop="remark" label="备注" />
            </el-table>
            <!-- 调拨申请 -->
            <el-dialog title="调拨申请" :visible.sync="FormVisible" :close-on-press-escape="false" :close-on-click-modal="false" width="1000px">
              <el-form ref="EditForm" :model="EditForm" :rules="FormRules" label-width="120px">
                <el-form-item label="出库单号" prop="name">
                  <el-input v-model="EditForm.name" placeholder="出库单号" size="small" />
                </el-form-item>
                <el-form-item label="出库类型" prop="name">
                  <el-select v-model="EditForm.systemId" filterable remote :remote-method="remoteMethodsystemId" :loading="loading" placeholder="出库类型" size="small" @focus="remoteMethodsystemId">
                    <el-option v-for="item in systemData" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                </el-form-item>
                <el-form-item label="库房" prop="name">
                  <el-select v-model="EditForm.brandId" filterable remote :remote-method="remoteMethodbrandId" :loading="loading" placeholder="库房" size="small" @focus="remoteMethodbrandId" @change="changeBrand">
                    <el-option v-for="item in brandData" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                </el-form-item>
                <el-form-item label="出库日期" prop="name">
                  <el-select v-model="EditForm.modelId" filterable remote :remote-method="remoteMethodmodelId" :loading="loading" placeholder="出库日期" size="small" @focus="remoteMethodsystemId">
                    <el-option v-for="item in modelData" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                </el-form-item>
                <el-form-item label="单据状态" prop="name">
                  <el-input v-model="EditForm.name" placeholder="单据状态" size="small" />
                </el-form-item>
                <el-form-item label="经办人" prop="name">
                  <el-input v-model="EditForm.name" placeholder="经办人" size="small" />
                </el-form-item>
                <el-form-item label="领用人" prop="name">
                  <el-input v-model="EditForm.name" placeholder="领用人" size="small" />
                </el-form-item>
                <el-form-item label="备注" prop="name" class="form_total">
                  <el-input v-model="EditForm.name" type="textarea" placeholder="备注" size="small" />
                </el-form-item>
              </el-form>
              <div class="header">
                <div class="tools">
                  <el-button type="primary" size="small" @click="addAssets()">选择备件</el-button>
                  <el-button type="primary" size="small" @click="removeEquip()">删除备件</el-button>
                </div>
              </div>
              <el-table :data="tableDatain" stripe border style="width: 1500px" @selection-change="handleSelectionChange">
                <el-table-column type="selection" />
                <el-table-column prop="equipment" label="编码">
                  <template slot-scope="scope">
                    {{ scope.row.equipment.name }}
                  </template>
                </el-table-column>
                <el-table-column label="备件名称" prop="system" />
                <el-table-column prop="source" label="备件分类">
                  <template slot-scope="scope">
                    {{ scope.row.source==='Automatic'?"自动汇总":"人工修订" }}
                  </template>
                </el-table-column>
                <el-table-column prop="brand" label="品牌" />
                <el-table-column prop="model" label="型号" />
                <el-table-column prop="remark" label="单位" />
                <el-table-column prop="model" label="数量" />
              </el-table>
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" size="small" @click="updateData()">确定</el-button>
                <el-button type="primary" plain size="small" @click="FormVisible = false">取消</el-button>
              </span>
            </el-dialog>
            <!--分页-->
            <pagination v-show="totalCount>0" :total="totalCount" :page.sync="formSearch.pageNumber" :limit.sync="formSearch.pageSize" @pagination="getPage" />
            <!--删除-->
            <el-dialog ref="removeData" title="提示" :close-on-press-escape="false" :close-on-click-modal="false" :visible.sync="removeQuestionVisible" width="220px">
              <span>您确定要删除此条数据？</span>
              <span slot="footer" class="dialog-footer">
                <el-button @click="removeQuestionVisible = false">取 消</el-button>
                <el-button type="primary" @click="removeQuestion">确 定</el-button>
              </span>
            </el-dialog>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </el-col>
</template>
<script>
import pagination from '@/components/Pagination'
export default {
  components: {
    pagination
  },
  data() {
    return {
      loading: false, // 远程搜索
      formSearch: {
        text: '', // 搜索文本
        pageSize: 10, // 展示条数
        pageNumber: 1// 页码
      },
      totalCount: 0, // 数据总条数
      multipleSelection: '', // 表单选中行
      removeQuestionVisible: false, // 删除弹框
      tableData: [],
      removeData: [],
      systemData: [],
      sourceData: [],
      FormVisible: false, // 编辑弹框
      EditForm: {// 编辑表单数据
        modelId: '',
        brandId: '',
        name: ''
      },
      brandData: [], // 品牌数据
      modelData: [], // 型号数据
      tableDatain: [], // 入库表格
      sourcepage: {// 匹配度分页
        pageNumber: 1,
        pageSize: 999999,
        pageCount: ''
      },
      systempage: {// 所属系统分页
        pageNumber: 1,
        pageSize: 999999,
        pageCount: ''
      },
      brandpage: {// 品牌分页
        pageNumber: 1,
        pageSize: 50,
        pageCount: ''
      },
      modelpage: {// 型号分页
        pageNumber: 1,
        pageSize: 50,
        brandId: undefined,
        pageCount: ''
      },
      FormRules: {
        name: {
          required: true,
          message: '设备名称不可为空',
          trigger: 'blur'
        },
        brandId: {
          required: true,
          message: '定额编目不可为空',
          trigger: 'blur'
        }
      }
    }
  },
  computed: {},
  mounted() {
    this.getData()
    this.getsystemData()
    this.getsourceData()
    this.getbrandData()
    this.getmodelData()
  },
  methods: {
    uploadresultImg(e) {
      console.log(e)
      this.EditForm.resultImg = e
    },
    getbrandData() {
      // 获取品牌
      this.$axios.get('/api/Meta/Brand?pageSize=' + this.brandpage.pageSize + '&pageNumber=' + this.brandpage.pageNumber).then(res => {
        this.brandData = this.brandData.concat(res.data)
      })
    },
    changeBrand() {
      this.formData.modelId = ''
      this.modelpage.brandId = this.formData.brandId
      this.$axios.get('/api/Meta/Model?brandId=' + this.formData.brandId).then(res => {
        this.modelData = res.data
      })
    },
    getmodelData() {
      // 获取型号
      this.$axios.get('/api/Meta/Model', { params: this.modelpage }).then(res => {
        this.modelData = this.modelData.concat(res.data)
      })
    },
    remoteMethodbrandId(query) {
      this.loading = true
      let querytext = ''
      querytext = typeof (query) === 'string' ? query : ''
      this.$axios.get('/api/Meta/Brand?text=' + querytext).then(res => {
        this.loading = false
        this.brandData = res.data
      })
    },
    remoteMethodmodelId(query) {
      this.loading = true
      let querytext = ''
      querytext = typeof (query) === 'string' ? query : ''
      this.$axios.get('/api/Meta/Model?brandId=' + this.formData.brandId + '&text=' + querytext).then(res => {
        this.loading = false
        this.modelData = res.data
      })
    },
    getData() {
      this.$axios.get('/api/MatchEquipment/', { params: this.formSearch }).then(res => {
        this.tableData = res.data
        this.totalCount = res.totalCount
      })
    },
    getPage(val) { // page事件
      // 展示条数
      this.formSearch.pageSize = val.limit
      // 页码
      this.formSearch.pageNumber = val.page
      // 调用获取数据
      this.$axios.get('/api/EquipmentList/', { params: this.formSearch }).then(res => {
        this.tableData = res.data
      })
    },
    getsystemData() {
      // 获取所属系统
      this.$axios.get('/api/Meta/System?pageSize=' + this.systempage.pageSize + '&pageNumber=' + this.systempage.pageNumber).then(res => {
        this.systemData = this.systemData.concat(res.data)
      })
    },
    getsourceData() {
      // 获取匹配度
      this.$axios.get('/api/Meta/Source?pageSize=' + this.sourcepage.pageSize + '&pageNumber=' + this.sourcepage.pageNumber).then(res => {
        this.sourceData = this.sourceData.concat(res.data)
      })
    },
    remoteMethodsystemId(query) {
      this.loading = true
      let querytext = ''
      querytext = typeof (query) === 'string' ? query : ''
      this.$axios.get('/api/Meta/System?text=' + querytext).then(res => {
        this.loading = false
        this.systemData = res.data
      })
    },
    remoteMethodsourceId(query) {
      this.loading = true
      let querytext = ''
      querytext = typeof (query) === 'string' ? query : ''
      this.$axios.get('/api/Meta/source?text=' + querytext).then(res => {
        this.loading = false
        this.sourceData = res.data
      })
    },
    updateData(row) {
      if (row === undefined) {
        if (this.multipleSelection.length !== 1) {
          this.$message.error('请选择一项数据进行操作')
        } else {
          this.FormVisible = true
        }
      } else {
        this.FormVisible = true
      }
    },
    deleteData(row) {
      if (row === undefined) {
        if (this.multipleSelection.length !== 1) {
          this.$message.error('请选择一项数据进行操作')
        } else {
          this.removeQuestionVisible = true
        }
      } else {
        this.removeQuestionVisible = true
      }
    },
    submitData() {
      this.$refs.EditForm.validate(valid => {
        if (valid) {
          this.$axios.put('/api/Meta/Brand/' + this.EditForm.id, this.EditForm).then(res => {
            this.getData()
            this.$message.success('修改成功')
            this.FormVisible = false
          })
        }
      })
    },
    // 删除
    removeQuestion() {
      const _this = this
      this.$axios.delete('/api/Assets/?Id=' + this.removeData.id).then(response => {
        _this.$message.success('删除成功')
        _this.removeQuestionVisible = false
        this.getData()
      })
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
}

.tools {
  margin: 10px 0px;
  width: 400px;
  display: inline-block;
}
.toolsrt {
  width: 60%;
  display: inline-block;
  .el-input {
    width: 200px;
  }
}
.el-form-item {
  width: 33%;
  display: inline-block;
  .el-select {
    width: 100%;
  }
  .el-date-editor {
    width: 100%;
  }
}
.form_total {
  width: 100%;
  text-align: center;
}
.dialog-footer {
  display: block;
  width: 100%;
  text-align: center;
}
.content {
  .el-table th,
  .el-table td {
    padding: 5px;
  }
}
</style>
