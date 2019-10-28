<!-- 备品备件管理-出库页面 -->
<template>
  <el-col>
    <el-row>
      <el-col>
        <el-row class="panel">
          <div class="header">
            <div class="tools">
              <el-button type="primary" size="small" @click="outForm()">确认出库</el-button>
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
                  {{ scope.row.reviewStatus ==='Pending'?'未出库':scope.row.reviewStatus ==='Applied'?'已出库':'' }}
                </template>
              </el-table-column>
              <el-table-column prop="code" label="出库单号">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="getInfo(scope.row.id)">{{ scope.row.code }}</el-button>
                </template>
              </el-table-column>
              <el-table-column prop="boundTime" label="出库日期" :formatter="formatterstartDate" />
              <el-table-column prop="spareBoundSubType" label="出库类型">
                <template slot-scope="scope">
                  {{ scope.row.spareBoundSubType=='PurchaseInBound'?'采购出库':scope.row.spareBoundSubType=='SpecialInBound'?'专项出库':scope.row.spareBoundSubType=='Repair'?'维修出库':scope.row.spareBoundSubType=='Scrap'?'报废出库':scope.row.spareBoundSubType=='ReceiveOutBound'?'领用出库':scope.row.spareBoundSubType=='TransferApplication'?'调拨申请单':'' }}
                </template>
              </el-table-column>
              <el-table-column prop="receive" label="领用人" />
              <el-table-column prop="createUser" label="操作人">
                <template slot-scope="scope">
                  {{ scope.row.createUser.name }}
                </template>
              </el-table-column>
              <el-table-column prop="remark" label="备注" />
            </el-table>
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
            <!--出库单详情-->
            <el-dialog title="出库单详情" :visible.sync="infoVisible" width="1000">
              <el-row>
                <el-form v-if="Info!==''" label-width="120px">
                  <el-col :span="8">
                    <el-form-item label="出库单号">
                      {{ Info.code }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="出库单类型">
                      {{ Info.spareBoundSubType=='PurchaseInBound'?'采购出库':Info.spareBoundSubType=='SpecialInBound'?'专项出库':Info.spareBoundSubType=='Repair'?'维修出库':Info.spareBoundSubType=='Scrap'?'报废出库':Info.spareBoundSubType=='ReceiveOutBound'?'领用出库':'调拨申请单' }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="出库库房">
                      {{ Info.spareRepository!==null?Info.spareRepository.name:'' }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="出库日期">
                      {{ Info.boundTime!==null?this.$moment(Info.boundTime).format('YYYY-MM-DD'):'' }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="操作人">
                      {{ Info.opeartor }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="领用人">
                      {{ Info.receive }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="维修单编号">
                      {{ Info.repairOrderCode }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="备注">
                      {{ Info.remark }}
                    </el-form-item>
                  </el-col>
                  <el-table :data="Info.spareStockRecordItems" stripe border style="width: 100%" max-height="580px" @selection-change="handleSelection">
                    <el-table-column type="index" label="序号" width="50" />
                    <el-table-column prop="spare.number" label="编码" />
                    <el-table-column prop="spare.name" label="备件名称" />
                    <el-table-column prop="spare.consumable" label="备件分类">
                      <template slot-scope="scope">
                        {{ scope.row.spare.consumable?'易损易耗':'非易损易耗' }}
                      </template>
                    </el-table-column>
                    <el-table-column prop="spare.brand.name" label="品牌" />
                    <el-table-column prop="spare.model.name" label="型号" />
                    <el-table-column prop="spare.unit" label="单位" />
                    <el-table-column prop="spare.supplier" label="供应商" />
                    <el-table-column prop="unitPrice" label="单价" />
                    <el-table-column prop="quantity" label="数量" />
                    <el-table-column prop="totalPrice" label="总价" />
                    <el-table-column prop="remark" label="备注" />
                  </el-table>
                </el-form>
                <el-col :span="24" style="text-align:center;margin-top:20px;">
                  <el-button size="small" type="primary" @click="infoVisible=false">确 定</el-button>
                  <el-button size="small" @click="infoVisible=false">取 消</el-button>
                </el-col>
              </el-row>
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
        userName: this.$cookie.get('trueName'),
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
        opeartor: this.$cookie.get('trueName'),
        repairOrderCode: '',
        boundTime: '',
        spareStockRecordItems: '',
        spareBoundSubType: '',
        remark: '',
        spareBoundType: 'OutBound'
      },
      WarehouseData: [], // 仓库数据
      tableDataout: [], // 出库表格
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
      },
      infoVisible: false,
      Info: ''
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
      this.getData()
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
            this.$message.error('已出库不可删')
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
    closeSpare() {
      this.$refs.EditForm.resetFields()
      this.FormVisible = false
      this.tableDataout = []
      this.multipleselect = ''
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
    removeSelectSpare() {
      this.multiplefirst.forEach(item => {
        this.tableDataout.splice(this.tableDataout.findIndex(i => i.id === item.id), 1)
      })
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
            this.closeSpare()
          })
        }
      })
    },
    sureData() { // 确认出库
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
            this.closeSpare()
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
      this.getPageselect()
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
    },
    // 单独确认出库
    outForm() {
      if (this.multiple.length !== 1) {
        this.$message.error('请选择一项数据进行操作')
      } else {
        if (this.multiple[0].reviewStatus === 'Pending') {
          this.$axios.post('/api/SpareStockRecord/' + this.multiple[0].id, { reviewStatus: 'Applied', reviewComment: '' }).then(res => {
            this.$message.success('出库成功')
            this.getData()
          })
        } else {
          this.$message.error('已出库')
        }
      }
    },
    // 入库单详情
    getInfo(id) {
      this.$axios.get('/api/SpareStockRecord/' + id).then(res => {
        this.Info = res
        this.infoVisible = true
      })
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
// .el-form-item {
//   width: 33%;
//   display: inline-block;
//   .el-select {
//     width: 100%;
//   }
//   .el-date-editor {
//     width: 100%;
//   }
// }
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
