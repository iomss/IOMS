<!-- 备品备件管理-即时库存页面 -->
<template>
  <el-col>
    <el-row>
      <el-col>
        <el-row class="panel">
          <div class="header">
            <div class="tooltotal">
              <el-button size="small" type="primary" @click="form('InBound')">备件入库</el-button>
              <el-button size="small" type="primary" @click="form('OutBound')">备件出库</el-button>
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
            <el-table :data="tableData" stripe border style="width: 1500px" @selection-change="handleSelectionTableDataChange">
              <el-table-column type="selection" />
              <el-table-column prop="unit.name" label="管理单位" />
              <el-table-column label="库房名称" prop="spareRepository.name" />
              <el-table-column prop="spare.name" label="设备名称" />
              <el-table-column prop="spare.brand.name" label="品牌" />
              <el-table-column prop="spare.model.name" label="型号" />
              <el-table-column prop="source" label="备件类型">
                <template slot-scope="scope">
                  {{ scope.row.consumable ?"易损易耗":"非易损易耗" }}
                </template>
              </el-table-column>
              <el-table-column prop="quantity" label="数量" />
              <el-table-column prop="unitPrice" label="单价" />
              <el-table-column prop="totalPrice" label="总价" />
              <el-table-column prop="year" label="入库年份" />
              <el-table-column prop="remark" label="备注" />
            </el-table>
            <!-- 新增备件入库 -->
            <el-dialog :title="formTitle" :visible.sync="FormVisiblein" :close-on-press-escape="false" :show-close="false" :close-on-click-modal="false" width="1000px">
              <el-form ref="EditFormin" :model="EditFormin" :rules="FormRulesin" label-width="120px">
                <el-form-item :label="EditFormin.spareBoundType==='InBound'?'入库单号':'出库单号'">
                  <el-input value="系统自动生成" disabled :placeholder="EditFormin.spareBoundType==='InBound'?'入库单号':'出库单号'" size="small" />
                </el-form-item>
                <el-form-item :label="EditFormin.spareBoundType==='InBound'?'入库类型':'出库类型'" prop="spardBoundSubType">
                  <el-select v-model="EditFormin.spardBoundSubType" filterable remote :placeholder="EditFormin.spareBoundType==='InBound'?'入库类型':'出库类型'" size="small">
                    <el-option v-for="(item,index) in spardBoundSubType" :key="index" :label="item.name" :value="item.value" />
                  </el-select>
                </el-form-item>
                <el-form-item :label="EditFormin.spareBoundType==='InBound'?'入库库房':'出库库房'" prop="spareRepositoryId">
                  <el-select v-model="EditFormin.spareRepositoryId" filterable remote :remote-method="remoteMethodSpareRepository" :loading="loading" clearable placeholder="入库库房" size="small" @focus="remoteMethodSpareRepository">
                    <el-option v-for="item in spareRepositoryData" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                </el-form-item>
                <el-form-item label="库存类型" prop="spareStockType">
                  <el-select v-model="EditFormin.spareStockType" filterable remote placeholder="库存类型" size="small">
                    <el-option v-for="(item,index) in spareStockType" :key="index" :label="item.name" :value="item.value" />
                  </el-select>
                </el-form-item>
                <el-form-item label="日期" prop="boundTime">
                  <el-date-picker v-model="EditFormin.boundTime" type="date" placeholder="选择日期" />
                </el-form-item>
                <el-form-item label="经办人">
                  <el-input value="系统自动生成" disabled placeholder="经办人" size="small" />
                </el-form-item>
                <el-form-item v-show="EditFormin.spareBoundType!=='InBound'" label="领用人">
                  <el-input v-model="EditFormin.receive" :disabled="!EditFormin.spareBoundType==='InBound'" placeholder="领用人" size="small" />
                </el-form-item>
                <el-form-item label="备注" prop="name" class="form_total">
                  <el-input v-model="EditFormin.name" type="textarea" placeholder="备注" size="small" />
                </el-form-item>
              </el-form>
              <el-divider />
              <div class="header">
                <div class="tools">
                  <el-button type="primary" size="small" @click="selectSpareVisible=true;getSpare()">选择备件</el-button>
                  <el-button type="primary" size="small" @click="removeSelectSpare({spareData:selectSpareData,selectData:SelectSpareDataSelect})">删除备件</el-button>
                </div>
              </div>
              <el-table :data="selectSpareData" stripe border style="width: 100%" @selection-change="handleSelectSpareData">
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
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.unitPrice" size="small" placeholder="请输入内容" />
                  </template>
                </el-table-column>
                <el-table-column prop="quantity" label="数量">
                  <template slot-scope="scope">
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
                <el-button type="primary" size="small" @click="createData()">{{ EditFormin.spareBoundType==='InBound'?'暂存':'出库' }}</el-button>
                <el-button type="success" size="small" @click="createandSubmitData()">{{ EditFormin.spareBoundType==='InBound'?'确认入库':'确认出库' }}</el-button>
                <el-button type="primary" plain size="small" @click="closeSpare()">取消</el-button>
              </span>
            </el-dialog>
            <!--选择备件-->
            <el-dialog width="40%" title="选择备件" :visible.sync="selectSpareVisible" append-to-body>
              <el-row style="text-align:right;">
                <el-input v-model="spareDataFormSearch.text" placeholder="输入搜索内容" size="small" style="width:200px;" />
                <el-button type="success" size="small" @click="getSpare()">查询</el-button>
              </el-row>
              <el-divider style="margin:15px 0 !important；" />
              <el-table ref="spareData" :data="spareData" stripe border @selection-change="handleSelectionSpareChange">
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
                <el-button size="small" type="primary" @click="selectSpareDataEvent()">确 定</el-button>
                <el-button size="small" @click="multipleSpareSelection='';selectSpareVisible = false">取 消</el-button>
              </div>
            </el-dialog>
            <!--分页-->
            <pagination v-show="totalCount>0" :total="totalCount" :page.sync="formSearch.pageNumber" :limit.sync="formSearch.pageSize" @pagination="getPage" />
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
      // 主 table 库存相关 start//
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
      multipleSelectionTableData: '', // 表单选中行（主table）
      // 主 table 库存相关 end//

      spareRepositoryData: [], // 库房数据
      SpareData: [], // 备件数据
      // ******************* 入库表单 start **************//
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
          name: '维修出入库'
        },
        {
          value: 'Scrap',
          name: '报废出入库'
        },
        {
          value: 'ReceiveOutBound',
          name: '领用出库'
        },
        {
          value: 'TransferApplication',
          name: '调拨申请单'
        }
      ], // 入库单类型
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
      ], // 库存类型
      FormVisiblein: false, // 编辑弹框
      formTitle: '', // 表单title
      EditFormin: {
        opeartor: '', // 经办人
        receive: '', // 领用人（出库）
        repairOrderCode: '', // 维修单编号
        boundTime: '', // 时间
        spareBoundType: '', // 类型 【InBound:入库，OutBound:出库,ScrapBound 调拨】
        spardBoundSubType: '', // 子类型【PurchaseInBound：进货、采购, SpecialInBound：特别、专项, Repair：维修, Scrap：报废, ReceiveOutBound：接收出货】
        spareStockType: '', // 库存类型【Spare：备用, Repair：维修, Scrap：报废】
        spareRepositoryId: null, // 仓库
        spareStockRecordItems: [] // 备件
      }, // 入库表单
      FormRulesin: {
        spardBoundSubType: [
          {
            required: true,
            message: '单类型不可为空',
            trigger: 'change'
          }
        ],
        spareRepositoryId: [
          {
            required: true,
            message: '库房不可为空',
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
      }, // 入库表单验证
      selectSpareData: [], // 入库单table 数据
      SelectSpareDataSelect: '', // 入库单table选中数据

      spareData: [], // 备件数据
      selectSpareVisible: false, // 选择备件弹窗显示隐藏
      spareDataFormSearch: {
        text: '',
        pageNumber: 1,
        pageSize: 10
      }, // 备件搜索
      spareDataTotalCount: 0, // 备件总条数
      multipleSpareSelection: '' // 选择备件选中数据（备件table选中）
      //* *************** 入库表单 end********************* //

    }
  },
  computed: {},
  mounted() {
    this.getData()// 获取即时库存数据
    this.getSpare()// 获取备件数据
  },
  methods: {
    form(type) {
      this.FormVisiblein = true
      this.EditFormin.spareBoundType = type
      this.EditFormin.receive = ''
      this.formTitle = type === 'InBound' ? '新增备件入库单' : '新增备件出库单'
    },
    /** **********主table form 相关方法 start***************/
    // 获取即时库存数据
    getData() {
      this.$axios.get('/api/SpareStock/', { params: this.formSearch }).then(res => {
        this.tableData = res.data
        this.totalCount = res.totalCount
      })
    },
    // 主table选择事件
    handleSelectionTableDataChange(val) {
      this.multipleSelectionTableData = val
    },
    // 入库单分页
    getPage(val) { // page事件
      // 展示条数
      this.formSearch.pageSize = val.limit
      // 页码
      this.formSearch.pageNumber = val.page
      // 调用获取数据
      this.getData()
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
    /** **********主table form 相关方法 end***************/

    /** **********入库table form 相关方法 start***************/
    // 入库单table 选中事件
    handleSelectSpareData(val) {
      this.SelectSpareDataSelect = val
    },
    // 获取备件备件
    getSpare() {
      this.$axios.get('/api/Spare', { params: this.spareDataFormSearch }).then(res => {
        this.spareData = res.data
        this.spareDataTotalCount = res.totalCount
      })
    },
    // 备件分页
    getSpareDataPage(val) {
      this.spareDataFormSearch.pageSize = val.limit
      this.spareDataFormSearch.pageNumber = val.page
      this.getSpare()
    },
    // 备件选中事件
    handleSelectionSpareChange(val) {
      this.multipleSpareSelection = val
    },
    // 选择备件
    selectSpareDataEvent() {
      if (this.multipleSpareSelection) {
        const newArray = []
        this.multipleSpareSelection.forEach(i => {
          let hasData = false
          this.selectSpareData.forEach(item => { item.id === i.id ? hasData = true : '' })
          hasData ? '' : newArray.push(i)
        })
        this.selectSpareData = Array.prototype.concat.apply(this.selectSpareData, newArray)
      }

      this.selectSpareVisible = false
      this.$refs.spareData.clearSelection()
    },
    // 关闭入库单
    closeSpare() {
      this.$refs.EditFormin.resetFields()
      this.FormVisiblein = false
      this.selectSpareData = []
      this.multipleSpareSelection = []
    },
    // 删除选中备件 (选中备件数据，从选中备件数据中选中的数据)
    removeSelectSpare({ spareData = [], selectData = [] }) {
      selectData.forEach(item => {
        spareData.splice(spareData.findIndex(i => i.id === item.id), 1)
      })
    },

    // 入库单暂存
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
            this.$message.success(this.EditFormin.spareBoundType === 'InBound' ? '入库单暂存成功' : '出库成功')
            this.FormVisiblein = false
            this.closeSpare()
          })
        }
      })
    },
    // 入库单确认入库（添加并确认入库）
    createandSubmitData() {
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
          this.$axios.post('/api/SpareStockRecord/CreateAndSubmit', this.EditFormin).then(res => {
            this.getData()
            this.$message.success('入库单确认入库成功')
            this.FormVisiblein = false
            this.closeSpare()
          })
        }
      })
    },
    /** **********入库table form 相关方法 end***************/

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
