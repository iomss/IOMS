<!-- 备品备件管理-备件调拨页面 -->
<template>
  <el-col>
    <el-row>
      <el-col>
        <el-row class="panel">
          <div class="header">
            <div class="tools">
              <el-button type="primary" size="small" @click="allocation()">调拨申请</el-button>
              <!-- <el-button type="success" size="small" @click="formSearch.type='spare';getData()">备件库</el-button>
              <el-button type="success" size="small" @click="formSearch.type='repair';getData()">维修库</el-button>
              <el-button type="success" size="small" @click="formSearch.type='scrap';getData()">报废库</el-button> -->
            </div>
            <div class="toolsrt">
              <el-form ref="form" :inline="true" :model="formSearch">
                <el-form-item style="margin-bottom:-20px;">
                  <treeselect v-model="formSearch.unitId" :normalizer="normalizer" :options="UnitData" :load-options="loadOptions" placeholder="管理单位" no-results-text="未找到相关数据">
                    <div slot="value-label" slot-scope="{ node }">{{ node.raw.crumbsName }}</div>
                  </treeselect>
                </el-form-item>
                <el-form-item>
                  <el-form-item>
                    <el-select v-model="formSearch.spareRepositoryId" filterable remote :remote-method="getKufang" :loading="loading" clearable placeholder="库房" size="small" no-match-text="没有找到相关库房" @focus="getKufang">
                      <el-option v-for="item in SpareRepositoryData" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
                  </el-form-item>
                </el-form-item>
                <el-form-item>
                  <el-select v-model="formSearch.consumable" clearable placeholder="备件性质" size="small">
                    <el-option key="1" label="非易损易耗" value="false" />
                    <el-option key="2" label="易损易耗" value="true" />
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-input v-model="formSearch.text" clearable placeholder="设备名称" size="small" />
                </el-form-item>
                <el-button type="primary" plain size="small" @click="getData()">查询</el-button>
              </el-form>
            </div>
          </div>
          <el-col class="content">
            <el-table :data="tableData" stripe border @selection-change="handleSelectionSpare">
              <el-table-column type="selection" />
              <el-table-column prop="unit.name" label="管理单位" />
              <el-table-column label="库房名称" prop="spareRepository.name" />
              <el-table-column prop="spare.name" label="设备名称" />
              <el-table-column prop="spare.brand.name" label="品牌" />
              <el-table-column prop="spare.model.name" label="型号" />
              <el-table-column prop="source" label="备件类型">
                <template slot-scope="scope">
                  {{ scope.row.spare.consumable ?"易损易耗":"非易损易耗" }}
                </template>
              </el-table-column>
              <el-table-column prop="quantity" label="数量" />
              <el-table-column prop="unitPrice" label="单价" />
              <el-table-column prop="totalPrice" label="总价" />
              <el-table-column prop="year" label="入库年份" />
              <el-table-column prop="comment" label="备注" />
            </el-table>
            <!--分页-->
            <pagination v-show="totalCount>0" :total="totalCount" :page.sync="formSearch.pageNumber" :limit.sync="formSearch.pageSize" @pagination="getPage" />
          </el-col>
          <el-dialog ref="allocation" title="调拨申请" :close-on-press-escape="false" :close-on-click-modal="false" :visible.sync="allocationVisibale" width="1300px" @close="closeAllocatio">
            <el-form ref="allocationForm" :model="allocationForm" :rules="allocationFormRules" label-width="120px">
              <el-form-item label="调拨单号">
                <el-input value="系统自动生成" disabled />
              </el-form-item>
              <el-form-item label="调拨前单位">
                <el-input :value="beforeUnitName" disabled />
              </el-form-item>
              <el-form-item label="调拨前库房">
                <el-input :value="beforeSparRepository" disabled />
              </el-form-item>
              <el-form-item label="调拨日期" prop="boundTime">
                <el-date-picker v-model="allocationForm.boundTime" type="date" placeholder="选择日期" />
              </el-form-item>
              <el-form-item label="调拨后单位" style="margin-bottom:-20px;">
                <el-input :value="afterUnitName" disabled />
              </el-form-item>
              <el-form-item label="调拨后库房" prop="spareRepositoryId">
                <el-select v-model="allocationForm.spareRepositoryId" filterable remote :remote-method="getKufangdiaobo" :loading="loading" placeholder="库房" size="small" no-match-text="没有找到相关库房" @focus="getKufangdiaobo">
                  <el-option v-for="item in SpareRepositoryDatadiaobo" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="经办人">
                <el-input :value="allocationForm.opeartor" disabled />
              </el-form-item>
              <el-form-item label="备注" prop="remark" class="form_total">
                <el-input v-model="allocationForm.remark" type="textarea" placeholder="备注" size="small" />
              </el-form-item>
            </el-form>
            <el-divider />
            <div class="header">
              <div class="tools">
                <el-button type="primary" size="small" @click="removeSelectSpare({spareData:multipleSpareDatadiaobo,selectData:handleSelectionData})">删除备件</el-button>
              </div>
            </div>
            <el-table :data="multipleSpareDatadiaobo" stripe border style="width: 100%" height="600" @selection-change="handleSelection">
              <el-table-column type="selection" />
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
              <el-table-column label="库存">
                <template slot-scope="scope">
                  {{ scope.row.quantity }}
                </template>
              </el-table-column>
              <el-table-column prop="allocationQuantity" label="数量">
                <template slot-scope="scope">
                  <el-input-number v-model="scope.row.allocationQuantity" controls-position="right" type="number" :min="1" size="small" placeholder="请输入内容" style="width:100%;" />
                </template>
              </el-table-column>
              <el-table-column prop="remark" label="备注">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.remark " size="small" placeholder="请输入内容" />
                </template>
              </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
              <el-button @click="closeAllocatio()">取 消</el-button>
              <el-button type="primary" @click="submitAllocation()">确 定</el-button>
            </span>
          </el-dialog>
        </el-row>
      </el-col>
    </el-row>
  </el-col>
</template>
<script>
import { Treeselect, LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
import pagination from '@/components/Pagination'
// 节流
const simulateAsyncOperation = fn => {
  setTimeout(fn, 500)
}
export default {
  components: {
    pagination,
    Treeselect
  },
  data() {
    return {
      // 树结构
      normalizer(node) {
        return {
          id: node.id,
          label: node.name,
          children: node.children
        }
      },
      loading: false, // 远程搜索
      UnitData: [], // 管理单位数据
      SpareRepositoryData: [], // 库房数据
      SpareRepositoryDatadiaobo: [],
      formSearch: {
        text: '', // 搜索文本
        type: '', // 库存类型（备件、维修、报废）
        unitId: null, // 管理单位
        allunit: true, // 查询所有单位的
        spareRepositoryId: null, // 库房
        consumable: null, // 备件性质
        pageSize: 10, // 展示条数
        pageNumber: 1// 页码
      }, // 搜索表单
      totalCount: 0, // 数据总条数
      tableData: [], // 库存数据
      multipleSpareData: [], // 选中库存数据
      multipleSpareDatadiaobo: [],
      afterUnitName: JSON.parse(this.$cookie.get('unit')).name, // 调拨后库房名称（当前单位）
      beforeUnitName: '', // 备件单位
      beforeSparRepository: '', // 备件库房
      allocationForm: {
        fromUnitId: null, // 原单位
        fromRepositoryId: null, // 原仓库
        boundTime: '', // 时间
        spareBoundType: 'TransferApplication', // 出入库类型
        spareBoundSubType: 'TransferApplication', // 出入库子类型
        opeartor: this.$cookie.get('trueName'), // 经办人（系统自动生成）
        remark: '', // 备注
        unitId: JSON.parse(this.$cookie.get('unit')).id, // 单位（调拨去）
        spareRepositoryId: null, // 仓库（调拨去）
        spareStockRecordItems: [
          //   {
          //     stockId: 0, // 库存id
          //     quantity: 0, // 数量
          //     unitPrice: 0, // 单价
          //     totalPrice: 0, // 总价
          //     remark: 'string'// 备注
          //   }
        ]
      },
      allocationFormRules: {
        boundTime: {
          required: true,
          message: '调拨日期不可为空',
          trigger: 'change'
        },
        // unitId: {
        //   required: true,
        //   message: '调拨后单位不可为空',
        //   trigger: 'change'
        // },
        spareRepositoryId: {
          required: true,
          message: '调拨后库房不可为空',
          trigger: 'change'
        }
      },
      allocationVisibale: false, // 调拨申请显示隐藏
      handleSelectionData: []// 弹框中选中数据
    }
  },
  computed: {},
  mounted() {
    this.getData()
    this.getUnitData()
    // this.getSpareRepositoryData()
    this.getKufang()
    this.getKufangdiaobo()
  },
  methods: {
    // treeSelect 加载
    loadOptions({ action, parentNode, callback }) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        switch (parentNode.id) {
          case 'success': {
            simulateAsyncOperation(() => {
              parentNode.children = [
                {
                  id: 'child',
                  label: 'Child option'
                }
              ]
              callback()
            })
            break
          }
          case 'no-children': {
            simulateAsyncOperation(() => {
              parentNode.children = []
              callback()
            })
            break
          }
          case 'failure': {
            simulateAsyncOperation(() => {
              callback(new Error('Failed to load options: network error.'))
            })
            break
          }
          default: /* empty */
        }
      }
    },
    // 获取库存数据
    getData() {
      this.$axios.get('/api/SpareStock', { params: this.formSearch }).then(res => {
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
    // 获取单位数据
    getUnitData() {
      this.$axios.get('/api/Tree/Unit').then(res => {
        this.UnitData = res
      })
    },
    // 库房数据
    getKufang(query) {
      this.loading = true
      let querytext = ''
      querytext = typeof (query) === 'string' ? query : ''

      const searchQuery = {
        text: querytext,
        allUnit: true,
        unitId: this.formSearch.unitId
      }
      this.$axios.get('/api/SpareRepository', { params: searchQuery }).then(res => {
        this.loading = false
        this.SpareRepositoryData = res.data
      })
    },
    getKufangdiaobo(query) {
      this.loading = true
      let querytext = ''
      querytext = typeof (query) === 'string' ? query : ''

      const searchQuery = {
        text: querytext
        // allUnit: true
        // unitId: this.allocationForm.unitId
      }
      this.$axios.get('/api/SpareRepository', { params: searchQuery }).then(res => {
        this.loading = false
        this.SpareRepositoryDatadiaobo = res.data
      })
    },
    // 获取库房数据
    // getSpareRepositoryData() {
    //   this.$axios.get('/api/SpareRepository').then(res => {
    //     this.SpareRepositoryData = res.data
    //   })
    // },
    // 库存table 数据选中事件
    handleSelectionSpare(val) {
      this.multipleSpareData = val
    },
    // 调拨
    allocation() {
      if (this.multipleSpareData.length >= 1) {
        let hasData = true
        this.multipleSpareData.forEach(item => {
          item.unitId === this.multipleSpareData[0].unitId && item.spareRepositoryId === this.multipleSpareData[0].spareRepositoryId ? '' : hasData = false
        })
        if (hasData) {
          this.beforeUnitName = this.multipleSpareData[0].unit.name
          this.beforeSparRepository = this.multipleSpareData[0].spareRepository.name
          this.allocationForm.fromUnitId = this.multipleSpareData[0].unitId
          this.allocationForm.fromRepositoryId = this.multipleSpareData[0].spareRepositoryId
          this.multipleSpareData.forEach(item => {
            this.multipleSpareDatadiaobo.push({ ...item, remark: item.comment })
          })
          this.allocationVisibale = true
        } else {
          this.$message.warning('请选择同一单位、同一库房备件')
        }
      } else {
        this.$message.warning('请选择调拨设备')
      }
    },
    // 删除选中备件 (选中备件数据，从选中备件数据中选中的数据)
    removeSelectSpare({ spareData = [], selectData = [] }) {
      selectData.forEach(item => {
        spareData.splice(spareData.findIndex(i => i.id === item.id), 1)
      })
    },
    // 弹框中table选中事件
    handleSelection(val) {
      this.handleSelectionData = val
    },
    submitAllocation() {
      this.allocationForm.spareStockRecordItems = []
      this.multipleSpareDatadiaobo.forEach(item => {
        this.allocationForm.spareStockRecordItems.push({ stockId: item.id, quantity: item.allocationQuantity, unitPrice: item.unitPrice, totalPrice: item.unitPrice * item.allocationQuantity, remark: item.remark })
      })
      this.$refs.allocationForm.validate(valid => {
        if (valid) {
          this.$axios.post('/api/SpareStockRecord', this.allocationForm).then(res => {
            this.$message.success('调拨申请成功')
            this.allocationVisibale = false
            this.closeAllocatio()
          })
        }
      })
    },
    // 关闭调拨
    closeAllocatio() {
      this.$refs.allocationForm.resetFields()
      this.allocationForm.spareStockRecordItems = []
      this.multipleSpareDatadiaobo = []
      this.allocationVisibale = false
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
  .el-form-item {
    width: 250px;
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
