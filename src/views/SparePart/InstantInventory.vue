<!-- 备品备件管理-备件调拨页面 -->
<template>
  <el-col>
    <el-row>
      <el-col>
        <el-row class="panel">
          <div class="header">
            <div class="tooltotal">
              <el-button size="small" type="primary" @click="FormVisiblein = true">备件入库</el-button>
              <el-button size="small" type="primary" @click="FormVisibleout = true">备件出库</el-button>
              <el-button size="small" type="primary" @click="updateData()">修改</el-button>
              <el-button size="small" type="danger" @click="deleteData()">删除</el-button>
              <el-button size="small" type="primary" plain @click="outputData()">导出</el-button>
            </div>
            <div class="tools">
              <el-button type="primary" plain size="small" @click="formSearch.type='spare';getData()">备件库</el-button>
              <el-button type="primary" plain size="small" @click="formSearch.type='repair';getData()">维修库</el-button>
              <el-button type="primary" plain size="small" @click="formSearch.type='scrap';getData()">报废库</el-button>
            </div>
            <div class="toolsrt">
              <el-form ref="form" :model="formSearch">
                <el-select v-model="formSearch.spareRepositoryId" filterable remote :remote-method="remoteMethodSpareRepository" :loading="loading" clearable placeholder="全部库房" size="small" @focus="remoteMethodSpareRepository">
                  <el-option v-for="item in spareRepositoryData" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
                <el-select v-model="formSearch.consumable" clearable="" placeholder="备件性质" size="small">
                  <el-option key="1" label="非易损易耗" value="false" />
                  <el-option key="2" label="易损易耗" value="true" />
                </el-select>
                <el-input v-model="formSearch.text" placeholder="模糊搜索" size="small" />
                <el-button type="primary" plain size="small" @click="getData()">查询</el-button>
              </el-form>
            </div>
          </div>
          <el-col class="content">
            <el-table :data="tableData" stripe border style="width: 1500px" @selection-change="handleSelectionChange">
              <el-table-column type="selection" />
              <el-table-column prop="unit.name" label="管理单位" />
              <el-table-column label="库房名称" prop="name">
                <template slot-scope="scope">
                  {{ scope.row.spareRepository.name }}
                </template>
              </el-table-column>
              <el-table-column prop="remark" label="设备名称" />
              <el-table-column prop="brand.name" label="品牌" />
              <el-table-column prop="model.name" label="型号" />
              <el-table-column prop="source" label="备件类型">
                <template slot-scope="scope">
                  {{ scope.row.consumable ?"易损易耗":"非易损易耗" }}
                </template>
              </el-table-column>
              <el-table-column prop="quantity" label="数量" />
              <el-table-column prop="unitPrice" label="单价" />
              <el-table-column prop="totalPrice" label="总价" />
              <el-table-column prop="year" label="入库年份" />
              <el-table-column prop="comment" label="备注" />
            </el-table>
            <!-- 新增备件入库 -->
            <el-dialog title="新增备件入库单" :visible.sync="FormVisiblein" :close-on-press-escape="false" :close-on-click-modal="false" width="1000px">
              <el-form ref="EditFormin" :model="EditFormin" :rules="FormRulesin" label-width="120px">
                <el-form-item label="入库单号">
                  <el-input value="系统自动生成" disabled placeholder="入库单号" size="small" />
                </el-form-item>
                <el-form-item label="入库单类型" prop="spardBoundSubType">
                  <el-select v-model="EditFormin.spardBoundSubType" filterable remote placeholder="入库单类型" size="small">
                    <el-option v-for="(item,index) in spardBoundSubType" :key="index" :label="item.name" :value="item.value" />
                  </el-select>
                </el-form-item>
                <el-form-item label="入库库房" prop="spareRepositoryId">
                  <el-select v-model="EditFormin.spareRepositoryId" filterable remote :remote-method="remoteMethodSpareRepository" :loading="loading" clearable placeholder="入库库房" size="small" @focus="remoteMethodSpareRepository">
                    <el-option v-for="item in spareRepositoryData" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                </el-form-item>
                <el-form-item label="库存类型" prop="spareStockType">
                  <el-select v-model="EditFormin.spareStockType" filterable remote placeholder="入库单类型" size="small">
                    <el-option v-for="(item,index) in spareStockType" :key="index" :label="item.name" :value="item.value" />
                  </el-select>
                </el-form-item>
                <el-form-item label="日期" prop="boundTime">
                  <el-date-picker v-model="EditFormin.boundTime" type="date" placeholder="选择日期" />
                </el-form-item>
                <el-form-item label="经办人">
                  <el-input value="系统自动生成" disabled placeholder="经办人" size="small" />
                </el-form-item>
                <el-form-item label="备注" prop="name" class="form_total">
                  <el-input v-model="EditFormin.name" type="textarea" placeholder="备注" size="small" />
                </el-form-item>
              </el-form>
              <el-divider />
              <div class="header">
                <div class="tools">
                  <el-button type="primary" size="small" @click="selectSpareVisible=true">选择备件</el-button>
                  <el-button type="primary" size="small" @click="removeEquip()">删除备件</el-button>
                </div>
              </div>
              <el-table :data="selectSpareData" stripe border style="width: 100%" @selection-change="handleSelectionChange">
                <el-table-column type="selection" />
                <el-table-column prop="number" label="编码" />
                <el-table-column prop="name" label="备件名称" />
                <el-table-column prop="consumable" label="备件分类">
                  <template slot-scope="scope">
                    {{ scope.row.consumable?'易损易耗':'非易损易耗' }}
                  </template>
                </el-table-column>
                <el-table-column prop="brand.name" label="品牌" />
                <el-table-column prop="model.name" label="型号" />
                <el-table-column prop="unit" label="单位" />
                <el-table-column prop="supplier" label="供应商" />
                <el-table-column prop="unitPrice" label="单价">
                  <template scope="scope">
                    <el-input v-model="scope.row.unitPrice" size="small" placeholder="请输入内容" />
                  </template>
                </el-table-column>
                <el-table-column prop="quantity" label="数量">
                  <template scope="scope">
                    <el-input v-model="scope.row.quantity" size="small" placeholder="请输入内容" />
                  </template>
                </el-table-column>
                <el-table-column prop="totalPrice" label="总价">
                  <template slot-scope="scope">
                    {{ scope.row.unitPrice !==undefined && scope.row.quantity!==undefined ? scope.row.unitPrice*scope.row.quantity:'' }}
                  </template>
                </el-table-column>
              </el-table>
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" size="small" @click="createData()">暂存</el-button>
                <el-button type="success" size="small" @click="deleteData()">确认入库</el-button>
                <el-button type="primary" plain size="small" @click="FormVisiblein = false">取消</el-button>
              </span>
            </el-dialog>
            <!-- 新增出库单 -->
            <el-dialog title="新增出库单" :visible.sync="FormVisibleout" :close-on-press-escape="false" :close-on-click-modal="false" width="1000px">
              <el-form ref="EditFormout" :model="EditFormout" :rules="FormRulesout" label-width="120px">
                <el-form-item label="出库单号" prop="name">
                  <el-input v-model="EditFormout.name" placeholder="出库单号" size="small" />
                </el-form-item>
                <el-form-item label="出库类型" prop="name">
                  <el-select v-model="EditFormout.systemId" filterable remote :remote-method="remoteMethodsystemId" :loading="loading" placeholder="出库类型" size="small" @focus="remoteMethodsystemId">
                    <el-option v-for="item in systemData" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                </el-form-item>
                <el-form-item label="库房" prop="name">
                  <el-select v-model="EditFormout.brandId" filterable remote :remote-method="remoteMethodbrandId" :loading="loading" placeholder="库房" size="small" @focus="remoteMethodbrandId" @change="changeBrand">
                    <el-option v-for="item in brandData" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                </el-form-item>
                <el-form-item label="出库日期" prop="name">
                  <el-select v-model="EditFormout.modelId" filterable remote :remote-method="remoteMethodmodelId" :loading="loading" placeholder="出库日期" size="small" @focus="remoteMethodsystemId">
                    <el-option v-for="item in modelData" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                </el-form-item>
                <el-form-item label="单据状态" prop="name">
                  <el-input v-model="EditFormout.name" placeholder="单据状态" size="small" />
                </el-form-item>
                <el-form-item label="经办人" prop="name">
                  <el-input v-model="EditFormout.name" placeholder="经办人" size="small" />
                </el-form-item>
                <el-form-item label="领用人" prop="name">
                  <el-input v-model="EditFormout.name" placeholder="领用人" size="small" />
                </el-form-item>
                <el-form-item label="备注" prop="name" class="form_total">
                  <el-input v-model="EditFormout.name" type="textarea" placeholder="备注" size="small" />
                </el-form-item>
              </el-form>
              <div class="header">
                <div class="tools">
                  <el-button type="primary" size="small" @click="addAssets()">选择备件</el-button>
                  <el-button type="primary" size="small" @click="removeEquip()">删除备件</el-button>
                </div>
              </div>
              <el-table :data="multipleSpareSelection" stripe border style="width: 100%" @selection-change="handleSelectionChange">
                <el-table-column type="selection" />
                <el-table-column prop="number" label="编码" />
                <el-table-column prop="name" label="备件名称" />
                <el-table-column prop="consumable" label="备件分类">
                  <template slot-scope="scope">
                    {{ scope.row.consumable?'易损易耗':'非易损易耗' }}
                  </template>
                </el-table-column>
                <el-table-column prop="brand.name" label="品牌" />
                <el-table-column prop="model.name" label="型号" />
                <el-table-column prop="unit" label="单位" />
                <el-table-column prop="supplier" label="供应商" />
                <el-table-column prop="supplier" label="单价" />
                <el-table-column prop="supplier" label="数量" />
                <el-table-column prop="supplier" label="总价" />
              </el-table>
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" size="small" @click="updateData()">暂存</el-button>
                <el-button type="primary" size="small" @click="updateData()">确认出库</el-button>
                <el-button type="primary" plain size="small" @click="FormVisibleout = false">取消</el-button>
              </span>
            </el-dialog>
            <el-dialog width="40%" title="选择入库备件" :visible.sync="selectSpareVisible" append-to-body>
              <el-table :data="spareData" stripe border @selection-change="handleSelectionSpareChange">
                <el-table-column type="selection" />
                <el-table-column prop="number" label="编码" />
                <el-table-column prop="name" label="备件名称" />
                <el-table-column prop="consumable" label="备件分类">
                  <template slot-scope="scope">
                    {{ scope.row.consumable?'易损易耗':'非易损易耗' }}
                  </template>
                </el-table-column>
                <el-table-column prop="brand.name" label="品牌" />
                <el-table-column prop="model.name" label="型号" />
                <el-table-column prop="unit" label="单位" />
                <el-table-column prop="supplier" label="供应商" />
              </el-table>
              <pagination v-show="spareDataTotalCount>0" :total="spareDataTotalCount" :page.sync="spareDataFormSearch.pageNumber" :limit.sync="spareDataFormSearch.pageSize" @pagination="getSpareDataPage" />
              <div style="text-align:center">
                <el-button size="small" type="primary" @click="selectData()">确 定</el-button>
                <el-button size="small" @click="multipleSpareSelection='';selectSpareVisible = false">取 消</el-button>
              </div>
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
        type: '', // 库存类型
        spareRepositoryId: null, // 库房
        consumable: null, // 易损易耗
        pageSize: 10, // 展示条数
        pageNumber: 1// 页码
      },
      totalCount: 0, // 数据总条数
      tableData: [], // 列表数据
      spareRepositoryData: [], // 库房数据
      SpareData: [], // 备件数据
      spardBoundSubType: [
        {
          value: 'PurchaseInBound',
          name: '采购入库'
        },
        {
          value: 'SpecialInBound',
          name: '专项入库'
        },
        {
          value: 'Repair',
          name: '维修入库'
        },
        {
          value: 'Scrap',
          name: '报废入库'
        },
        {
          value: 'ReceiveOutBound',
          name: '领用出库'
        },
        {
          value: 'TransferApplication',
          name: '调拨申请单'
        }
      ],
      spareStockType: [
        {
          value: 'Spare',
          name: '备用'
        },
        {
          value: 'Repair',
          name: '维修'
        },
        {
          value: 'Scrap',
          name: '报废'
        }
      ],
      FormVisiblein: false, // 编辑弹框
      EditFormin: {// 编辑表单数据
        opeartor: '', // 经办人
        receive: '', // 领用人（出库）
        repairOrderCode: '', // 维修单编号
        boundTime: '', // 时间
        spareBoundType: 'InBound', // 类型 【InBound:入库，OutBound:出库,ScrapBound 调拨】
        spardBoundSubType: 'PurchaseInBound', // 子类型【PurchaseInBound：进货、采购, SpecialInBound：特别、专项, Repair：维修, Scrap：报废, ReceiveOutBound：接收出货】
        spareStockType: 'Spare', // 库存类型【Spare：备用, Repair：维修, Scrap：报废】
        spareRepositoryId: null, // 仓库
        spareStockRecordItems: []// 备件
      },
      FormRulesin: {
        spardBoundSubType: [
          {
            required: true,
            message: '入库单类型不可为空',
            trigger: 'change'
          }
        ],
        spareRepositoryId: [
          {
            required: true,
            message: '入库库房不可为空',
            trigger: 'change'
          }
        ],
        spareStockType: [
          {
            required: true,
            message: '库存类型不可为空',
            trigger: 'change'
          }
        ],
        boundTime: [
          {
            required: true,
            message: '日期不可为空',
            trigger: 'blur'
          }
        ]
      },
      selectSpareVisible: false,
      spareData: [], // 备件数据
      spareDataFormSearch: {
        text: '',
        pageNumber: 1,
        pageSize: 10
      },
      spareDataTotalCount: 0,
      selectSpareData: [],
      multipleSpareSelection: '', // 选择备件选中数据

      multipleSelection: '', // 表单选中行
      removeQuestionVisible: false, // 删除弹框
      removeData: [],
      systemData: [],
      sourceData: [],
      FormVisibleout: false, // 编辑弹框
      EditFormout: {
        modelId: '',
        brandId: '',
        name: ''
      },
      brandData: [], // 品牌数据
      modelData: [], // 型号数据
      tableDatain: [], // 入库表格
      tableDataout: [], // 出库表格
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

      FormRulesout: {
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
    this.getData()// 获取即时库存数据
    this.getSpare()// 获取备件数据
    this.getsystemData()
    this.getsourceData()
    this.getbrandData()
    this.getmodelData()
  },
  methods: {
    // 获取即时库存数据
    getData() {
      this.$axios.get('/api/SpareStock/', { params: this.formSearch }).then(res => {
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
    // 库房数据
    remoteMethodSpareRepository(query) {
      this.loading = true
      let querytext = ''
      querytext = typeof (query) === 'string' ? query : ''
      this.$axios.get('/api/SpareRepository?text=' + querytext).then(res => {
        this.loading = false
        this.spareRepositoryData = res.data
      })
    },
    // 备件
    getSpare() {
      this.$axios.get('/api/Spare', { params: this.spareDataFormSearch }).then(res => {
        this.spareData = res.data
        this.spareDataTotalCount = res.totalCount
      })
    },
    getSpareDataPage(val) {
      this.spareDataFormSearch.pageSize = val.limit
      this.spareDataFormSearch.pageNumber = val.page
      this.getSpare()
    },
    handleSelectionSpareChange(val) {
      this.multipleSpareSelection = val
    },
    // 选择备件
    selectData() {
      this.selectSpareData = this.multipleSpareSelection
      this.selectSpareVisible = false
    },

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
    createData() {
      const spareStockRecordItems = []
      this.selectSpareData.forEach(item => spareStockRecordItems.push({
        spareId: item.id,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.quantity * item.unitPrice
      }))
      this.EditFormin.spareStockRecordItems = spareStockRecordItems
      this.$refs.EditFormin.validate(valid => {
        if (valid) {
          this.$axios.post('/api/SpareStockRecord', this.EditFormin).then(res => {
            this.getData()
            this.$message.success('入库单暂存')
            this.FormVisiblein = false
          })
        }
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
    outputData(row) { // 导出
      if (row === undefined) {
        if (this.multipleSelection.length !== 1) {
          this.$message.error('请选择一项数据进行操作')
        } else {
          // ajax
        }
      } else {
        // ajax
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
