<!-- 备品备件管理-即时库存页面 -->
<template>
  <el-col>
    <el-row>
      <el-col>
        <el-row class="panel">
          <div class="header">
            <div class="tooltotal">
              <el-button size="small" type="primary" @click="rukushow('InBound','Spare')">备件入库</el-button>
              <el-button size="small" type="primary" @click="rukushow('OutBound','Spare')">备件出库</el-button>
              <!-- <el-button size="small" type="primary" @click="rukushow('InBound','Scrap')">报废入库</el-button> -->
              <el-button v-show="formSearch.type==='scrap'" size="small" type="danger" @click="baofei()">报废归档</el-button>
              <el-button size="small" type="primary" plain @click="exportData()">导出</el-button>
            </div>
            <!-- <div class="tools">
              {{ formSearch.typ }}
              <el-button type="primary" :plain="formSearch.type==='spare'?false:true" size="small" @click="formSearch.type='spare';getData()">备件库</el-button>
              <el-button type="primary" :plain="formSearch.type==='repair'?false:true" size="small" @click="formSearch.type='repair';getData()">维修库</el-button>
              <el-button type="primary" :plain="formSearch.type==='scrap'?false:true" size="small" @click="formSearch.type='scrap';getData()">报废库</el-button>
            </div> -->
            <div class="toolsrt" style="margin:15px 0;">
              <el-form ref="form" :model="formSearch">
                <el-select v-model="formSearch.spareRepositoryId" filterable remote :remote-method="getKufang" :loading="loading" clearable placeholder="全部库房" size="small" @focus="getKufang">
                  <el-option v-for="item in kufangData" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
                <el-select v-model="formSearch.consumable" clearable placeholder="备件性质" size="small">
                  <el-option key="1" label="非易损易耗" value="false" />
                  <el-option key="2" label="易损易耗" value="true" />
                </el-select>
                <el-input v-model="formSearch.text" placeholder="模糊搜索" size="small" />
                <el-button type="primary" plain size="small" @click="getData()">查询</el-button>
              </el-form>
            </div>
          </div>
          <el-col class="content">
            <el-table :data="tableData" stripe border :row-class-name="baofeiclass" @selection-change="xuanzekucunSelect">
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
              <el-table-column label="摘要">
                <template slot-scope="scope">
                  <el-button v-show="scope.row.spare.consumable" type="text" @click="zhaiyaoVisible=true;getZhaiyaoData(scope.row.id)">出入库摘要</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!--分页-->
            <pagination v-show="totalCount>0" :total="totalCount" :page.sync="formSearch.pageNumber" :limit.sync="formSearch.pageSize" @pagination="getPage" />
            <!--出入库摘要-->
            <el-dialog width="40%" title="出入库摘要" :visible.sync="zhaiyaoVisible" append-to-body>
              <el-table :data="zhaiyaoData" border>
                <el-table-column type="index" label="序号" width="50" />
                <el-table-column type="spareStockRecordCode" label="单据号">
                  <template slot-scope="scope">
                    {{ scope.row.spareStockRecordCode }}
                  </template>
                </el-table-column>
                <el-table-column type="spareStockRecordCode" label="出入库类型">
                  <template slot-scope="scope">
                    {{ scope.row.spareBoundType==='InBound'?'入库': scope.row.spareBoundType==='OutBound'?'出库':scope.row.spareBoundType==='ScrapBound'?'报废':scope.row.spareBoundType==='TransferApplication'?'调拨':'' }}
                  </template>
                </el-table-column>
                <el-table-column type="spareStockRecordItem.spare.name" label="设备名称">
                  <template slot-scope="scope">
                    {{ scope.row.spareStockRecordItem.spare.name }}
                  </template>
                </el-table-column>
                <el-table-column type="spareStockRecordBoundTime" label="出入库时间">
                  <template slot-scope="scope">
                    {{ scope.row.spareStockRecordBoundTime }}
                  </template>
                </el-table-column>
                <el-table-column type="quantity" label="出入库数量">
                  <template slot-scope="scope">
                    {{ scope.row.quantity }}
                  </template>
                </el-table-column>
                <el-table-column type="remark" label="备注">
                  <template slot-scope="scope">
                    {{ scope.row.spareStockRecordItem.remark }}
                  </template>
                </el-table-column>
              </el-table>
              <pagination v-show="zhaiyaoTotalCount>0" :total="zhaiyaoTotalCount" :page.sync="zhaiyaoForm.pageNumber" :limit.sync="zhaiyaoForm.pageSize" @pagination="getPageZhaiyao" />
            </el-dialog>
            <!--入库-->
            <!-- 新增备件入库 -->
            <el-dialog :title="'新增备件' + title + '单'" :visible.sync="rukuVisible" :close-on-press-escape="false" :show-close="false" :close-on-click-modal="false" width="1300px">
              <el-form ref="rukuForm" :model="rukuForm" :rules="rukuRules" label-width="120px">
                <el-form-item :label="title+'单号'">
                  <el-input value="系统自动生成" disabled />
                </el-form-item>
                <el-form-item :label="title+'单类型'" prop="spareBoundSubType">
                  <el-select v-if="rukuForm.spareBoundType==='InBound'&& rukuForm.spareStockType === 'Spare'" v-model="rukuForm.spareBoundSubType" filterable placeholder="入库单类型" size="small">
                    <el-option key="PurchaseInBound" label="采购入库" value="PurchaseInBound" />
                    <el-option key="SpecialInBound" label="专项入库" value="SpecialInBound" />
                    <el-option key="Repair" label="维修入库" value="Repair" />
                    <!-- <el-option key="Scrap" label="报废入库" value="Scrap" /> -->
                  </el-select>
                  <el-select v-if="rukuForm.spareBoundType==='OutBound'&& rukuForm.spareStockType === 'Spare'" v-model="rukuForm.spareBoundSubType" filterable placeholder="出库单类型" size="small">
                    <el-option key="ReceiveOutBound" label="领用出库" value="ReceiveOutBound" />
                    <el-option key="Repair" label="维修出库" value="Repair" />
                    <!-- <el-option key="Scrap" label="报废出库" value="Scrap" /> -->
                  </el-select>
                  <el-select v-if="rukuForm.spareBoundType==='InBound'&& rukuForm.spareStockType === 'Scrap'" v-model="rukuForm.spareBoundSubType" filterable placeholder="报废单类型" size="small">
                    <el-option key="Scrap" label="报废入库" value="Scrap" />
                  </el-select>
                </el-form-item>
                <el-form-item :label="title+'库房'" prop="spareRepositoryId">
                  <el-select
                    v-model="rukuForm.spareRepositoryId"
                    :disabled="rukuForm.spareBoundType==='OutBound' && rukuForm.spareStockType === 'Spare'"
                    filterable
                    remote
                    :remote-method="getKufang"
                    :loading="loading"
                    :placeholder="title+'库房'"
                    size="small"
                    @focus="getKufang"
                  >
                    <el-option v-for="item in kufangData" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                </el-form-item>
                <el-form-item :label="title+'日期'" prop="boundTime">
                  <el-date-picker v-model="rukuForm.boundTime" type="date" :placeholder="title+'日期'" />
                </el-form-item>
                <el-form-item label="经办人" prop="opeartor">
                  <el-input v-model="rukuForm.opeartor" :disabled="true" placeholder="经办人" size="small" />
                </el-form-item>
                <el-form-item v-if="rukuForm.spareBoundType==='OutBound'" label="领用人" prop="receive">
                  <el-input v-model="rukuForm.receive" placeholder="领用人" size="small" />
                </el-form-item>
                <el-form-item v-if="rukuForm.spareBoundType==='InBound'&& rukuForm.spareStockType === 'Spare' && rukuForm.spareBoundSubType==='Repair'" label="维修单编号" prop="repairOrderCode">
                  <el-input v-model="rukuForm.repairOrderCode" placeholder="维修单编号" size="small" />
                </el-form-item>
                <el-form-item label="备注" prop="remark" class="form_total">
                  <el-input v-model="rukuForm.remark" type="textarea" placeholder="备注" size="small" />
                </el-form-item>
              </el-form>
              <div class="header">
                <div class="tools">
                  <el-button v-show="rukuForm.spareBoundType!=='OutBound'&&rukuForm.spareStockType === 'Spare'" type="primary" size="small" @click="xuanzerukubeijian()">选择备件</el-button>
                  <el-button type="primary" size="small" @click="shanchurukubeijian()">删除备件</el-button>
                </div>
              </div>
              <el-table :data="rukubeijian" stripe border style="width: 1500px" max-height="650px" @selection-change="rukubeijianselect">
                <el-table-column type="selection" />
                <!-- <el-table-column prop="number" label="编码" /> -->
                <el-table-column prop="name" label="备件名称" />
                <el-table-column prop="consumable" label="备件分类">
                  <template slot-scope="scope">
                    {{ scope.row.consumable?"易损易耗品":"非易损易耗品" }}
                  </template>
                </el-table-column>
                <el-table-column prop="brand.name" label="品牌" />
                <el-table-column prop="model.name" label="型号" />
                <el-table-column v-show="rukuForm.spareBoundType==='OutBound' && rukuForm.spareStockType === 'Spare'" prop="safetyStock" label="安全库存" />
                <el-table-column prop="unitPrice" label="单价">
                  <template slot-scope="scope">
                    <el-input
                      v-model="scope.row.unitPrice"
                      :disabled="!(rukuForm.spareBoundType==='InBound' && rukuForm.spareStockType === 'Spare')"
                      type="number"
                      size="small"
                      :min="0"
                      controls-position="right"
                      placeholder="请输入内容"
                    />
                  </template>
                </el-table-column>
                <el-table-column v-if="rukuForm.spareBoundType==='OutBound' && rukuForm.spareStockType === 'Spare'" prop="kucun" label="库存" />
                <el-table-column prop="quantity" label="数量">
                  <template slot-scope="scope">
                    <el-input-number
                      v-model="scope.row.quantity"
                      controls-position="right"
                      :max="rukuForm.spareBoundType==='OutBound' && rukuForm.spareStockType === 'Spare'?scope.row.kucun:Infinity"
                      size="small"
                      :min="1"
                      placeholder="请输入内容"
                      style="width:100%;"
                    />
                  </template>
                </el-table-column>
                <el-table-column prop="totalPrice" label="总金额">
                  <template slot-scope="scope">
                    {{ scope.row.unitPrice !==undefined && scope.row.quantity!==undefined ? scope.row.unitPrice*scope.row.quantity:'' }}
                  </template>
                </el-table-column>
                <el-table-column prop="remark" label="备注">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.remark" size="small" placeholder="请输入内容" />
                  </template>
                </el-table-column>
              </el-table>
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" size="small" @click="ruku()">暂存</el-button>
                <el-button type="success" size="small" @click="submitruku()">{{ rukuForm.spareBoundType==='InBound'? '确认入库':rukuForm.spareBoundType==='OutBound'?'确认出库':'' }}</el-button>
                <el-button type="primary" plain size="small" @click="closeruku()">取消</el-button>
              </span>
            </el-dialog>
            <!-- 选择备件 -->
            <el-dialog title="选择备件" :visible.sync="xuanzebeijianVisible" :close-on-press-escape="false" :show-close="false" :close-on-click-modal="false" width="1000px">
              <div class="toolsrt">
                <el-form ref="form" :model="beijianFormSearch" label-width="70px">
                  <el-input v-model="beijianFormSearch.text" clearable placeholder="全局搜索" size="small" />
                  <el-button type="primary" plain size="small" @click="getbeijianData()">查询</el-button>
                </el-form>
              </div>
              <el-table :data="beijianData" stripe border style="width: 1500px" @selection-change="handleBeijianSelection">
                <el-table-column type="selection" />
                <el-table-column prop="number" label="编码" />
                <el-table-column prop="name" label="备件名称" />
                <el-table-column prop="consumable" label="备件分类">
                  <template slot-scope="scope">
                    {{ scope.row.consumable?"易损易耗品":"非易损易耗品" }}
                  </template>
                </el-table-column>
                <el-table-column prop="brand.name" label="品牌" />
                <el-table-column prop="model.name" label="型号" />
                <el-table-column prop="unit" label="单位" />
                <el-table-column prop="supplier" label="供应商" />
              </el-table>
              <!--分页-->
              <pagination v-show="beijianTotalCount>0" :total="beijianTotalCount" :page.sync="beijianFormSearch.pageNumber" :limit.sync="beijianFormSearch.pageSize" @pagination="getbeijianpage" />
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" size="small" @click="jiarurukubeijian()">选择</el-button>
                <el-button type="primary" plain size="small" @click="xuanzebeijianVisible=false;xuanzebeijianData=[]">取消</el-button>
              </span>
            </el-dialog>
            <!--报废归档-->
            <el-dialog ref="removeData" title="提示" :close-on-press-escape="false" :close-on-click-modal="false" :visible.sync="baofeiVisibale" width="220px">
              <span>您确定要报废此设备？</span>
              <span slot="footer" class="dialog-footer">
                <el-button @click="baofeiVisibale = false">取 消</el-button>
                <el-button type="primary" @click="submitBaofei">确 定</el-button>
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
      beijianData: [], // 备件数据
      beijianFormSearch: {
        text: '',
        pageSize: 10, // 展示条数
        pageNumber: 1// 页码
      },
      beijianTotalCount: 0, // 备件总数
      kufangData: [], // 库房数据
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
      /* ****************  摘要开始  ******************** */
      // 出入库摘要
      zhaiyaoVisible: false, // 摘要
      zhaiyaoData: [], // 摘要数据
      zhaiyaoForm: {
        pageNumber: 1, // 当前页码
        pageSize: 10// 每页条数
      },
      zhaiyaoTotalCount: 0, // 摘要总数
      /* ****************  摘要结束  ******************** */

      /* ****************  入库开始  ******************** */
      // 入库
      title: '', // 标题
      rukuForm: {
        spareStockType: 'Spare', // 库存类型
        spareBoundType: 'InBound', // 出入库类型
        spareBoundSubType: '', // 出入库子类型
        opeartor: this.$cookie.get('trueName'), // 经办人
        receive: '', // 领用人（出库）
        repairOrderCode: '', // 维修单编号
        boundTime: '', // 出入口时间
        spareStockRecordItems: '', // 备件
        spareRepositoryId: null, // 库房
        remark: '' // 备注
      },
      // 入库表单验证
      rukuRules: {
        spareBoundSubType: {
          required: true,
          message: '出入库单类型不可为空',
          trigger: 'blur'
        },
        spareRepositoryId: {
          required: true,
          message: '出入库库房不可为空',
          trigger: 'blur'
        },
        boundTime: {
          required: true,
          message: '出入库日期不可为空',
          trigger: 'blur'
        }
      },
      xuanzekucunSelectData: [], //
      rukuVisible: false, // 入库
      rukubeijian: [], // 入库备件
      rukubeijianselectData: [], // 被选中的入库备件
      /* ******* 选择备件开始 ****** */
      xuanzebeijianVisible: false,
      xuanzebeijianData: [],
      /* ******* 选择备件结束 ****** */

      /* ****************  入库结束  ******************** */

      /* ****************  报废归档开始  ******************** */
      baofeiVisibale: false// 报废归档提示
      /* ****************  报废归档结束  ******************** */

    }
  },
  computed: {},
  mounted() {
    this.getData()// 获取即时库存数据
    this.getKufang()
  },
  methods: {
    // 格式化日期
    formatterTime(row, column, cellValue) {
      if (cellValue !== null) {
        return this.$moment(cellValue).format('YYYY-MM-DD HH:mm')
      } else {
        return cellValue
      }
    },
    // 获取即时库存数据
    getData() {
      this.$axios.get('/api/SpareStock/', { params: this.formSearch }).then(res => {
        this.tableData = res.data
        this.totalCount = res.totalCount
      })
    },
    exportData() {
      this.$axios
        .get('/api/SpareStock/Export', {
          params: this.formSearch,
          Accept: {
            'Content-Type': 'application/json;application/octet-stream'
          },
          responseType: 'blob'
        })
        .then(res => {
          const fileName = res.headers['content-disposition'].match(
            /filename=(.*)/
          )[1]
          const url = window.URL.createObjectURL(new Blob([res.data]))
          const link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', decodeURI(fileName))
          document.body.appendChild(link)
          link.click()
        })
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
    getKufang(query) {
      this.loading = true
      let querytext = ''
      querytext = typeof (query) === 'string' ? query : ''
      this.$axios.get('/api/SpareRepository?text=' + querytext).then(res => {
        this.loading = false
        this.kufangData = res.data
      })
    },
    // 获取备件数据
    getbeijianData() {
      this.$axios.get('/api/Spare', { params: this.beijianFormSearch }).then(res => {
        this.beijianData = res.data
        this.beijianTotalCount = res.totalCount
      })
    },
    // 备件分页
    getbeijianpage(val) {
      // 展示条数
      this.beijianFormSearch.pageSize = val.limit
      // 页码
      this.beijianFormSearch.pageNumber = val.page
      // 调用获取数据
      this.getbeijianData()
    },
    /* ****************  摘要开始  ******************** */
    // 获取摘要数据
    getZhaiyaoData(id) {
      this.$axios.get('/api/SpareStock/' + id + '/Logs', { params: this.zhaiyaoForm }).then(res => {
        res.data.forEach(item => { item.spareStockRecordBoundTime = this.$moment(item.spareStockRecordBoundTime).format('YYYY-MM-DD') })
        this.zhaiyaoData = res.data
      })
    },
    // 摘要数据分页
    getPageZhaiyao(val) {
      // 展示条数
      this.formSearch.pageSize = val.limit
      // 页码
      this.formSearch.pageNumber = val.page
      // 调用获取摘要数据
      this.getZhaiyaoData()
    },
    /* ****************  摘要结束  ******************** */
    /* ****************  入库开始  ******************** */
    /**
     * rukushow 出入库单添加
     * spareBoundType 出入库类型
     * spareStockType 库存类型
     */
    rukushow(spareBoundType, spareStockType) {
      this.xuanzekucunSelectData.forEach(item => {
        this.rukubeijian.push({ kucunId: item.id, ...item.spare, unitPrice: item.unitPrice, remark: item.comment, kucun: item.quantity })
      })
      this.rukuForm.spareBoundType = spareBoundType
      this.rukuForm.spareStockType = spareStockType
      spareBoundType === 'InBound' && spareStockType === 'Spare' ? this.title = '入库' : spareBoundType === 'OutBound' && spareStockType === 'Spare' ? this.title = '出库' : spareBoundType === 'InBound' && spareStockType === 'Scrap' ? this.title = '报废入库' : ''
      if ((spareBoundType === 'OutBound' || spareStockType === 'Scrap') && !this.xuanzekucunSelectData.length >= 1) {
        this.$message.warning('请选择相关库存进行操作')
      } else {
        if (this.rukuForm.spareBoundType === 'OutBound' && this.rukuForm.spareStockType === 'Spare') {
          let hasData = true
          this.xuanzekucunSelectData.forEach(item => {
            item.unitId === this.xuanzekucunSelectData[0].unitId && item.spareRepositoryId === this.xuanzekucunSelectData[0].spareRepositoryId ? '' : hasData = false
          })
          if (hasData) {
            if (this.rukuForm.spareBoundType === 'OutBound' && this.rukuForm.spareStockType === 'Spare') {
              this.rukuForm.spareRepositoryId = this.xuanzekucunSelectData[0].spareRepositoryId
            }
            this.rukuVisible = true
          } else {
            this.$message.warning('请选择同一单位、同一库房备件')
          }
        } else {
          this.rukuVisible = true
        }
      }
    },
    // 选择库存
    xuanzekucunSelect(val) {
      this.xuanzekucunSelectData = val
    },
    // 选择备件
    xuanzerukubeijian() {
      this.xuanzebeijianVisible = true
      this.getbeijianData()
    },
    // 删除选择备件
    shanchurukubeijian() {
      this.rukubeijianselectData.forEach(item => {
        this.rukubeijian.splice(this.rukubeijian.findIndex(i => i.kucunId === item.kucunId), 1)
      })
    },
    // 选择入库备件
    rukubeijianselect(val) {
      this.rukubeijianselectData = val
    },
    // 入库暂存
    ruku() {
      const spareStockRecordItems = []
      this.rukubeijian.forEach(item => {
        spareStockRecordItems.push({
          stockId: this.title === '出库' ? item.kucunId : null,
          spareId: item.id,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.quantity * item.unitPrice,
          remark: item.remark
        })
      })
      this.rukuForm.spareStockRecordItems = spareStockRecordItems
      this.$refs.rukuForm.validate(valid => {
        if (valid) {
          this.$axios.post('/api/SpareStockRecord', this.rukuForm).then(res => {
            this.getData()
            this.$message.success(this.title + '单暂存')
            this.closeruku()
          })
        }
      })
    },
    // 确认入库
    submitruku() {
      const spareStockRecordItems = []
      this.rukubeijian.forEach(item => {
        spareStockRecordItems.push({
          stockId: this.title === '出库' ? item.kucunId : null,
          spareId: item.id,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.quantity * item.unitPrice,
          remark: item.remark
        })
      })
      this.rukuForm.spareStockRecordItems = spareStockRecordItems
      this.$refs.rukuForm.validate(valid => {
        if (valid) {
          this.$axios.post('/api/SpareStockRecord/CreateAndSubmit', this.rukuForm).then(res => {
            this.getData()
            this.$message.success('确认' + this.title + '成功')
            this.closeruku()
          })
        }
      })
    },
    // 取消 关闭入库弹窗
    closeruku() {
      this.$refs.rukuForm.resetFields()
      this.rukuVisible = false
      this.rukubeijian = []
    },
    /* *****选择备件开始***** */
    // 从备件中选择备件
    handleBeijianSelection(val) {
      if (val) {
        const newArray = []
        val.forEach(i => {
          let hasData = false
          this.xuanzebeijianData.forEach(item => { item.id === i.id ? hasData = true : '' })
          hasData ? '' : newArray.push(i)
        })
        this.xuanzebeijianData = Array.prototype.concat.apply(this.xuanzebeijianData, newArray)
      }
    },
    // 选中备件加入rukubeijian
    jiarurukubeijian() {
      if (this.xuanzebeijianData) {
        const newArray = []
        this.xuanzebeijianData.forEach(i => {
          let hasData = false
          this.rukubeijian.forEach(item => { item.id === i.id ? hasData = true : '' })
          hasData ? '' : newArray.push({ ...i, kucunId: i.id })
        })
        this.rukubeijian = Array.prototype.concat.apply(this.rukubeijian, newArray)
      }

      this.xuanzebeijianVisible = false
      this.xuanzebeijianData = []
    },
    /* *****选择备件结束***** */
    /* ****************  入库结束  ******************** */
    /* ****************  报废归档开始  ******************** */
    baofei() {
      if (this.xuanzekucunSelectData.length >= 1) {
        this.baofeiVisibale = true
      } else {
        this.$message.warning('请选择相关库存进行操作')
      }
    },
    submitBaofei() {
      const baofei = []
      this.xuanzekucunSelectData.forEach(item => baofei.push(item.id))
      this.$axios.delete('/api/SpareStock', { data: { ids: baofei }}).then(res => {
        this.baofeiVisibale = false
        this.$message.success('报废归档成功')
      })
    },
    baofeiclass({ row, rowIndex }) {
      return row.scrapped ? 'scrapped' : ''
    }
    /* ****************  报废归档结束  ******************** */
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
//报废归档样式
</style>
<style>
.scrapped {
  color: #ccc;
}
</style>
