<!-- 备品备件管理-入库页面 -->
<template>
  <el-col>
    <el-row>
      <el-col>
        <el-row class="panel">
          <div class="header">
            <div class="tools">
              <!-- <el-button type="success" size="small" @click="rukushow('InBound','Spare')">新增备件入库</el-button> -->
              <el-button type="primary" size="small" @click="inForm()">确认入库</el-button>
              <!-- <el-button type="primary" size="small" @click="updateData()">修改</el-button> -->
              <el-button type="danger" size="small" @click="deleteData()">删除</el-button>
            </div>
            <div class="toolsrt">
              <el-form ref="form" :model="formSearch" label-width="70px">
                <el-date-picker v-model="formSearch.beginTime" placeholder="入库开始时间" size="small" />
                <el-date-picker v-model="formSearch.endTime" placeholder="入库结束时间" size="small" />
                <el-input v-model="formSearch.text" placeholder="入库单号" size="small" />
                <el-select v-model="formSearch.spareBoundSubType" clearable filterable placeholder="入库单类型" size="small">
                  <el-option key="PurchaseInBound" label="采购入库" value="PurchaseInBound" />
                  <el-option key="SpecialInBound" label="专项入库" value="SpecialInBound" />
                  <el-option key="Repair" label="维修入库" value="Repair" />
                  <el-option key="TransferApplication" label="调拨申请单" value="Repair" />
                </el-select>
                <el-select v-model="formSearch.reviewStatus" clearable filterable placeholder="单据状态" size="small">
                  <el-option key="pending" label="待入库" value="pending" />
                  <el-option key="Applied" label="已入库" value="Applied" />
                </el-select>
                <el-button type="primary" plain size="small" @click="getData()">查询</el-button>
              </el-form>
            </div>
          </div>
          <el-col class="content">
            <el-table :data="tableData" stripe border @selection-change="handlechange">
              <el-table-column type="selection" />
              <el-table-column prop="confirmed " label="单据状态">
                <template slot-scope="scope">
                  {{ scope.row.reviewStatus ==='Pending'?'未入库':scope.row.reviewStatus ==='Applied'?'已入库':'' }}
                </template>
              </el-table-column>
              <el-table-column prop="code" label="入库单号">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="getInfo(scope.row.id)">{{ scope.row.code }}</el-button>
                </template>
              </el-table-column>
              <el-table-column prop="boundTime" label="入库日期" :formatter="formatterstartDate" />
              <el-table-column prop="spareBoundSubType" label="入库类型">
                <template slot-scope="scope">
                  {{ scope.row.spareBoundSubType=='PurchaseInBound'?'采购入库':scope.row.spareBoundSubType=='SpecialInBound'?'专项入库':scope.row.spareBoundSubType=='Repair'?'维修入库':scope.row.spareBoundSubType=='Scrap'?'报废入库':scope.row.spareBoundSubType=='ReceiveOutBound'?'领用出库':'调拨申请单' }}
                </template>
              </el-table-column>
              <el-table-column prop="createUser" label="操作人">
                <template slot-scope="scope">
                  {{ scope.row.createUser.name }}
                </template>
              </el-table-column>
              <el-table-column prop="remark" label="备注" />
            </el-table>
            <pagination v-show="totalCount>0" :total="totalCount" :page.sync="formSearch.pageNumber" :limit.sync="formSearch.pageSize" @pagination="getPage" />
            <!--删除-->
            <el-dialog ref="removeData" title="提示" :close-on-press-escape="false" :close-on-click-modal="false" :visible.sync="removeQuestionVisible" width="220px">
              <span>您确定要删除此条数据？</span>
              <span slot="footer" class="dialog-footer">
                <el-button @click="removeQuestionVisible = false">取 消</el-button>
                <el-button type="primary" @click="removeQuestion">确 定</el-button>
              </span>
            </el-dialog>
            <!--入库单详情-->
            <el-dialog title="入库单详情" :visible.sync="infoVisible" width="1000">
              <el-row>
                <el-form v-if="Info!==''" label-width="120px">
                  <el-col :span="8">
                    <el-form-item label="入库单号">
                      {{ Info.code }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="入库单类型">
                      {{ Info.spareBoundSubType=='PurchaseInBound'?'采购入库':Info.spareBoundSubType=='SpecialInBound'?'专项入库':Info.spareBoundSubType=='Repair'?'维修入库':Info.spareBoundSubType=='Scrap'?'报废入库':Info.spareBoundSubType=='ReceiveOutBound'?'领用出库':'调拨申请单' }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="入库库房">
                      {{ Info.spareRepository!==null?Info.spareRepository.name:'' }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="入库日期">
                      {{ Info.boundTime!==null?this.$moment(Info.boundTime).format('YYYY-MM-DD'):'' }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="操作人">
                      {{ Info.opeartor }}
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
                  <el-table :data="Info.spareStockRecordItems" stripe border style="width: 100%" max-height="580px">
                    <el-table-column type="index" label="序号" width="50" />
                    <!-- <el-table-column prop="spare.number" label="编码" /> -->
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
            <!-------------------------------------------------------------------------------------------------------------------------------------------------------->
            <!--入库-->
            <!-- 新增备件入库 -->
            <el-dialog :title="'新增备件' + title + '单'" :visible.sync="rukuVisible" :close-on-press-escape="false" :show-close="false" :close-on-click-modal="false" width="1300px">
              <el-form ref="rukuForm" :model="rukuForm" :rules="rukuRules" label-width="120px" class="ruku">
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
                    <el-input v-model="scope.row.unitPrice" :disabled="!(rukuForm.spareBoundType==='InBound' && rukuForm.spareStockType === 'Spare')" type="number" size="small" placeholder="请输入内容" />
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
        beginTime: '', // 开始时间
        endTime: '', // 结束时间
        text: '', // 搜索文本
        spareBoundSubType: '',
        reviewStatus: '',
        pageSize: 10, // 展示条数
        pageNumber: 1, // 页码
        spareBoundType: 'InBound'
      },
      totalCount: 0, // 数据总条数
      tableData: [],
      multiple: '',
      removeQuestionVisible: false, // 删除弹框
      infoVisible: false,
      Info: '',
      //* ***************入库***************** */
      beijianData: [], // 备件数据
      beijianFormSearch: {
        text: '',
        pageSize: 10, // 展示条数
        pageNumber: 1// 页码
      },
      beijianTotalCount: 0, // 备件总数
      kufangData: [], // 库房数据
      // 入库
      title: '入库', // 标题
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
      rukuVisible: false, // 入库
      rukubeijian: [], // 入库备件
      rukubeijianselectData: [], // 被选中的入库备件
      /* ******* 选择备件开始 ****** */
      xuanzebeijianVisible: false,
      xuanzebeijianData: []
      /* ******* 选择备件结束 ****** */
    }
  },
  computed: {},
  mounted() {
    this.getData()
    this.getKufang()
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
    deleteData() {
      if (this.multiple.length !== 1) {
        this.$message.error('请选择一项数据进行操作')
      } else {
        if (this.multiple[0].confirmed) {
          this.$message.error('已入库不可删')
        } else {
          this.removeQuestionVisible = true
        }
      }
    },
    removeQuestion() { // 删除
      const _this = this
      this.$axios.delete('/api/SpareStockRecord/' + this.multiple[0].id).then(response => {
        _this.$message.success('删除成功')
        _this.removeQuestionVisible = false
        this.getData()
      })
    },
    handlechange(val) {
      this.multiple = val
    },
    // 入库单详情
    getInfo(id) {
      this.$axios.get('/api/SpareStockRecord/' + id).then(res => {
        this.Info = res
        this.infoVisible = true
      })
    },
    // 单独确认入库
    inForm() {
      if (this.multiple.length !== 1) {
        this.$message.error('请选择一项数据进行操作')
      } else {
        if (this.multiple[0].reviewStatus === 'Pending') {
          this.$axios.post('/api/SpareStockRecord/' + this.multiple[0].id, { reviewStatus: 'Applied' }).then(res => {
            this.$message.success('入库成功')
            this.getData()
          })
        } else {
          this.$message.error('已入库')
        }
      }
    },

    //* ************************************************************************************************************************************************** *//

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
    //* ******************************************************************入库********************************************************************************* *//
    /* ****************  入库开始  ******************** */
    /**
     * rukushow 出入库单添加
     * spareBoundType 出入库类型
     * spareStockType 库存类型
     */
    rukushow(spareBoundType, spareStockType) {
      this.rukuForm.spareStockType = spareStockType
      this.rukuVisible = true
    },
    // 选择入库备件
    rukubeijianselect(val) {
      this.rukubeijianselectData = val
    },
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
    // 取消 关闭入库弹窗
    closeruku() {
      this.$refs.rukuForm.resetFields()
      this.rukuVisible = false
      this.rukubeijian = []
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
  // width: 400px;
  // display: inline-block;
}
.toolsrt {
  // width: 30%;
  display: inline-block;
  margin-bottom: 20px;
  .el-input {
    width: 200px;
  }
}
.ruku {
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
