<!-- 备品备件管理-出库页面 -->
<template>
  <el-col>
    <el-row>
      <el-col>
        <el-row class="panel">
          <div class="header">
            <div class="tools">
              <el-button type="success" size="small" @click="FormVisible = true">新建出库单</el-button>
              <!-- <el-button type="primary" size="small" @click="updateData()">修改</el-button> -->
              <el-button type="danger" size="small" @click="deleteData()">删除</el-button>
            </div>
            <div class="toolsrt">
              <el-form ref="form" :model="formSearch" label-width="70px">
                <el-input v-model="formSearch.text" placeholder="全局搜索" size="small" />
                <el-button type="primary" plain size="small" @click="getData()">查询</el-button>
              </el-form>
            </div>
          </div>
          <el-col class="content">
            <el-table :data="tableData" stripe border style="width: 1500px" @selection-change="handlechange">
              <el-table-column type="selection" />
              <el-table-column prop="confirmed " label="单据状态">
                <template slot-scope="scope">
                  {{ scope.row.confirmed?'已入库':'未入库' }}
                </template>
              </el-table-column>
              <el-table-column prop="code" label="入库单号" />
              <el-table-column prop="boundTime" label="入库日期" :formatter="formatterstartDate" />
              <el-table-column prop="spareBoundSubType" label="入库类型">
                <template slot-scope="scope">
                  {{ scope.row.spareBoundSubType=='PurchaseInBound'?'采购入库':scope.row.spareBoundSubType=='SpecialInBound'?'专项入库':scope.row.spareBoundSubType=='Repair'?'维修出入库':scope.row.spareBoundSubType=='Scrap'?'报废出入库':scope.row.spareBoundSubType=='ReceiveOutBound'?'领用出库':'调拨申请单' }}
                </template>
              </el-table-column>
              <el-table-column prop="createUser" label="操作人">
                <template slot-scope="scope">
                  {{ scope.row.createUser.name }}
                </template>
              </el-table-column>
              <el-table-column prop="remark" label="备注" />
            </el-table>
            <!-- 新增备件出库 -->
            <el-dialog title="新增备件出库单" :visible.sync="FormVisible" :close-on-press-escape="false" :close-on-click-modal="false" width="1000px">
              <el-form ref="EditForm" :model="EditForm" :rules="FormRules" label-width="120px">
                <el-form-item label="出库类型" prop="spareBoundSubType">
                  <el-select v-model="EditForm.spareBoundSubType" filterable placeholder="入库单类型" size="small">
                    <el-option key="PurchaseInBound" label="采购入库" value="PurchaseInBound" />
                    <el-option key="SpecialInBound" label="专项入库" value="SpecialInBound" />
                    <el-option key="Repair" label="维修出入库" value="Repair" />
                    <el-option key="Scrap" label="报废出入库" value="Scrap" />
                    <el-option key="ReceiveOutBound" label="领用出库" value="ReceiveOutBound" />
                    <el-option key="TransferApplication" label="调拨申请单" value="TransferApplication" />
                  </el-select>
                </el-form-item>
                <el-form-item label="库房" prop="spareRepositoryId">
                  <el-select v-model="EditForm.spareRepositoryId" filterable remote :remote-method="remoteMethodWarehouse" :loading="loading" placeholder="入库库房" size="small" @focus="remoteMethodWarehouse">
                    <el-option v-for="item in WarehouseData" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                </el-form-item>
                <el-form-item label="出库日期" prop="boundTime">
                  <el-date-picker v-model="EditForm.boundTime" type="date" placeholder="入库日期" />
                </el-form-item>
                <el-form-item label="经办人" prop="name">
                  <el-input v-model="EditForm.name" placeholder="经办人" size="small" />
                </el-form-item>
                <el-form-item label="领用人" prop="name">
                  <el-input v-model="EditForm.name" placeholder="领用人" size="small" />
                </el-form-item>
                <el-form-item label="维修单编号" prop="repairOrderCode">
                  <el-input v-model="EditForm.repairOrderCode" placeholder="操作人" size="small" />
                </el-form-item>
                <el-form-item label="备注" prop="remark" class="form_total">
                  <el-input v-model="EditForm.remark" type="textarea" placeholder="备注" size="small" />
                </el-form-item>
              </el-form>
              <div class="header">
                <div class="tools">
                  <el-button type="primary" size="small" @click="addAssets()">选择备件</el-button>
                  <el-button type="primary" size="small" @click="removeEquip()">删除备件</el-button>
                </div>
              </div>
              <el-table :data="tableDataout" stripe border style="width: 1500px" @selection-change="handlefirstchange">
                <el-table-column type="selection" />
                <el-table-column prop="number" label="编码" />
                <el-table-column prop="name" label="备件名称" />
                <el-table-column prop="consumable" label="备件分类">
                  <template slot-scope="scope">
                    {{ scope.row.consumable?"易损易耗品":"非易损易耗品" }}
                  </template>
                </el-table-column>
                <el-table-column prop="brand" label="品牌">
                  <template slot-scope="scope">
                    {{ scope.row.brand.name }}
                  </template>
                </el-table-column>
                <el-table-column prop="model" label="型号">
                  <template slot-scope="scope">
                    {{ scope.row.model.name }}
                  </template>
                </el-table-column>
                <el-table-column prop="remark" label="单价">
                  <template scope="scope">
                    <el-input v-model="scope.row.unitPrice" size="small" placeholder="请输入内容" />
                  </template>
                </el-table-column>
                <el-table-column prop="model" label="数量">
                  <template scope="scope">
                    <el-input v-model="scope.row.quantity" size="small" placeholder="请输入内容" />
                  </template>
                </el-table-column>
                <el-table-column prop="remark" label="总金额">
                  <template slot-scope="scope">
                    {{ scope.row.unitPrice !==undefined && scope.row.quantity!==undefined ? scope.row.unitPrice*scope.row.quantity:'' }}
                  </template>
                </el-table-column>
              </el-table>
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" size="small" @click="unsureDate()">暂存</el-button>
                <el-button type="success" size="small" @click="sureData()">确认出库</el-button>
                <el-button type="primary" plain size="small" @click="FormVisible = false">取消</el-button>
              </span>
            </el-dialog>
            <!-- 选择备件 -->
            <el-dialog title="选择备件" :visible.sync="Visible" :close-on-press-escape="false" :close-on-click-modal="false" width="1000px">
              <div class="toolsrt">
                <el-form ref="form" :model="formSearchselect" label-width="70px">
                  <el-input v-model="formSearchselect.text" placeholder="全局搜索" size="small" />
                  <el-button type="primary" plain size="small" @click="getDataselect()">查询</el-button>
                </el-form>
              </div>
              <el-table :data="tableDataselect" stripe border style="width: 1500px" @selection-change="handleSelection">
                <el-table-column type="selection" />
                <el-table-column prop="number" label="编码" />
                <el-table-column prop="name" label="备件名称" />
                <el-table-column prop="consumable" label="备件分类">
                  <template slot-scope="scope">
                    {{ scope.row.consumable?"易损易耗品":"非易损易耗品" }}
                  </template>
                </el-table-column>
                <el-table-column prop="brand" label="品牌">
                  <template slot-scope="scope">
                    {{ scope.row.brand.name }}
                  </template>
                </el-table-column>
                <el-table-column prop="model" label="型号">
                  <template slot-scope="scope">
                    {{ scope.row.model.name }}
                  </template>
                </el-table-column>
                <el-table-column prop="unit" label="单位" />
                <el-table-column prop="supplier" label="供应商" />
              </el-table>
              <!--分页-->
              <pagination v-show="totalCountselect>0" :total="totalCountselect" :page.sync="formSearchselect.pageNumber" :limit.sync="formSearchselect.pageSize" @pagination="getPageselect" />
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" size="small" @click="updateselect()">选择</el-button>
                <el-button type="primary" plain size="small" @click="Visible = false">取消</el-button>
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
      dangqianUser: {
        userName: this.$cookie.get('userName'),
        id: this.$cookie.get('id')
      },
      formSearch: {
        text: '', // 搜索文本
        pageSize: 10, // 展示条数
        pageNumber: 1, // 页码
        spareBoundType: 'OutBound'
      },
      formSearchselect: {
        text: '', // 搜索文本
        pageSize: 10, // 展示条数
        pageNumber: 1// 页码
      },
      totalCountselect: 0,
      totalCount: 0, // 数据总条数
      multiple: '',
      multiplefirst: '',
      multipleselect: '',
      removeQuestionVisible: false, // 删除弹框
      tableData: [],
      tableDataselect: [],
      removeData: [],
      FormVisible: false, // 编辑弹框
      Visible: false,
      EditForm: {
        opeartor: this.$cookie.get('userName'),
        repairOrderCode: '',
        boundTime: '',
        spareStockRecordItems: '',
        spareBoundSubType: '',
        remark: '',
        spareBoundType: 'OutBound'
      },
      WarehouseData: [], // 仓库数据
      tableDataout: [], // 入库表格
      WarehouseSearch: {// 品牌分页
        pageNumber: 1,
        pageSize: 50,
        pageCount: ''
      },
      FormRules: {
        spareBoundSubType: {
          required: true,
          message: '出库单类型不可为空',
          trigger: 'blur'
        },
        spareRepositoryId: {
          required: true,
          message: '出库库房不可为空',
          trigger: 'blur'
        },
        boundTime: {
          required: true,
          message: '出库日期不可为空',
          trigger: 'blur'
        }
      }
    }
  },
  computed: {},
  mounted() {
    this.getData()
  },
  methods: {
    //* ******************************************************************************公用代码**************************************************************** *//
    // 投用时间日期时间格式化
    formatterstartDate(row, column, cellValue) {
      if (cellValue !== null) {
        return this.$moment(cellValue).format('YYYY-MM-DD')
      } else {
        return cellValue
      }
    },

    //* ******************************************************************************页面列表**************************************************************** *//
    getData() {
      this.$axios.get('/api/SpareStockRecord/', { params: this.formSearch }).then(res => {
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
    updateData(row) {
      if (row === undefined) {
        if (this.multiple.length !== 1) {
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
        if (this.multiple.length !== 1) {
          this.$message.error('请选择一项数据进行操作')
        } else {
          if (this.multiple[0].confirmed) {
            this.$message.error('已入库不可删')
          } else {
            this.removeData.id = this.multiple[0].id
            this.removeQuestionVisible = true
          }
        }
      } else {
        this.removeQuestionVisible = true
      }
    },
    removeQuestion() { // 删除
      const _this = this
      this.$axios.delete('/api/SpareStockRecord/' + this.removeData.id).then(response => {
        _this.$message.success('删除成功')
        _this.removeQuestionVisible = false
        this.getData()
      })
    },
    handlechange(val) {
      this.multiple = val
    },
    //* ******************************************************************一级弹框********************************************************************************* *//
    getWarehouseData() {
      this.$axios.get('/api/SpareRepository/', { params: this.WarehouseSearch }).then(res => {
        this.WarehouseData = this.WarehouseData.concat(res.data)
      })
    },
    // /远程搜索数据
    remoteMethodWarehouse(query) {
      this.loading = true
      let querytext = ''
      querytext = typeof (query) === 'string' ? query : ''
      this.$axios.get('/api/SpareRepository?text=' + querytext).then(res => {
        this.loading = false
        this.WarehouseData = res.data
      })
    },
    addAssets() {
      this.Visible = true
      this.getDataselect()
    },
    handlefirstchange(val) {
      this.multiplefirst = val
    },
    unsureDate() { // 暂存
      const spareStockRecordItems = []
      this.tableDataout.forEach(item => spareStockRecordItems.push({
        spareId: item.id,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.quantity * item.unitPrice
      }))
      this.EditForm.spareStockRecordItems = spareStockRecordItems
      this.$refs.EditForm.validate(valid => {
        if (valid) {
          this.$axios.post('/api/SpareStockRecord', this.EditForm).then(res => {
            this.getData()
            this.$message.success('出库单暂存')
            this.FormVisible = false
          })
        }
      })
    },
    sureData() { // 确认入库
      const spareStockRecordItems = []
      this.tableDataout.forEach(item => spareStockRecordItems.push({
        spareId: item.id,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.quantity * item.unitPrice
      }))
      this.EditForm.spareStockRecordItems = spareStockRecordItems
      this.$refs.EditForm.validate(valid => {
        if (valid) {
          this.$axios.post('/api/SpareStockRecord/CreateAndSubmit', this.EditForm).then(res => {
            this.getData()
            this.$message.success('确认出库成功')
            this.FormVisible = false
          })
        }
      })
    },
    //* ******************************************************************************二级弹框******************************************************************** *//
    getDataselect() {
      this.$axios.get('/api/Spare/', { params: this.formSearchselect }).then(res => {
        this.tableDataselect = res.data
        this.totalCountselect = res.totalCount
      })
    },
    getPageselect(val) {
      // 展示条数
      this.formSearchselect.pageSize = val.limit
      // 页码
      this.formSearchselect.pageNumber = val.page
      // 调用获取数据
      this.$axios.get('/api/EquipmentList/', { params: this.formSearchselect }).then(res => {
        this.tableDataselect = res.data
      })
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
    handleSelection(val) {
      this.multipleselect = val
    },
    updateselect() { // 二级弹框点选择
      this.Visible = false
      // 数据插入一级弹框表格
      this.tableDataout = this.tableDataout.concat(this.multipleselect)
      // this.EditForm.spareStockRecordItems=this.multipleselect
      console.log(this.tableDataout)
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
  margin-bottom: 20px;
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
