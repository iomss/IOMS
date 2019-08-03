<!-- 资产管理页面 -->
<template>
  <div>
    <el-row>
      <el-col>
        <div class="panel">
          <div class="header">
            <h4>资产管理</h4>
            <div class="select">
              <el-button type="primary" plain size="small" @click="selectstate()">资产列表</el-button>
              <el-button type="primary" plain size="small" @click="selectstate(1)">在用资产</el-button>
              <el-button type="primary" plain size="small" @click="selectstate(0)">闲置资产</el-button>
              <el-button type="primary" plain size="small" @click="selectstate(2)">报废资产</el-button>
            </div>
            <!--导入导出-->
            <div class="tools">
              <el-button type="primary" @click="create()">新增资产</el-button>
              <el-dropdown>
                <el-button type="primary" @click="handleClick">
                  批量导入<i class="el-icon-arrow-down el-icon--right" />
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>导入</el-dropdown-item>
                  <el-dropdown-item>下载模板</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-dropdown>
                <el-button type="primary" @click="handleClick">
                  批量导出<i class="el-icon-arrow-down el-icon--right" />
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="assetsExport">导出全部</el-dropdown-item>
                  <el-dropdown-item>选择导出</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <div class="toolsrt">
              <el-input v-model="tableDataSearch.text" placeholder="全局查询" size="small" />
              <el-button type="primary" size="small" @click="getData()">查询</el-button>
              <el-button type="primary" plain size="small" @click="formSearchShow = !formSearchShow">高级搜索</el-button>
            </div>
            <!--高级搜索表单-->
            <el-card v-if="formSearchShow" class="search" :body-style="{ padding: '20px' }">
              <el-form ref="form" :model="formSearch">
                <el-form-item>
                  <el-select v-model="formSearch.useUnitId" v-loadmore="loadMoreunit" filterable placeholder="使用单位" size="small">
                    <el-option v-for="item in unitData" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                </el-form-item>
                <el-form-item style="margin-bottom:-10px;">
                  <treeselect v-model="formSearch.positionId" :disable-branch-nodes="true" :normalizer="normalizer" :options="positionTreeData" :load-options="loadOptions" placeholder="安装位置" no-results-text="未找到相关数据" />
                </el-form-item>
                <el-form-item>
                  <el-select v-model="formSearch.equipmentID" v-loadmore="loadMoreequipment" filterable placeholder="资产类别" size="small">
                    <el-option v-for="item in equipmentData" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-select v-model="formSearch.systemId" v-loadmore="loadMoresystem" filterable placeholder="所属系统" size="small">
                    <el-option v-for="item in systemData" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-date-picker v-model="formSearch.handoverDate" type="date" placeholder="投用开始时间" />
                </el-form-item>
                <el-form-item>
                  <el-date-picker v-model="formSearch.handoverDate" type="date" placeholder="投用截止时间" />
                </el-form-item>
                <el-form-item>
                  <el-select v-model="formSearch.sourceId" v-loadmore="loadMoresource" filterable placeholder="资产来源" size="small">
                    <el-option v-for="item in sourceData" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-select v-model="formSearch.age" clearable placeholder="寿命状态" size="small">
                    <el-option key="1" label="超过使用期限" value="true" />
                    <el-option key="2" label="未超过使用期限" value="false" />
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-select v-model="formSearch.brandId" v-loadmore="loadMorebrand" filterable placeholder="品牌" size="small" @change="changebrand">
                    <el-option v-for="item in brandData" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-select v-model="formSearch.modelId" v-loadmore="loadMoremodel" filterable placeholder="型号" size="small">
                    <el-option v-for="item in modelData" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                </el-form-item>
                <el-form-item class="form_total">
                  <el-button type="primary" size="small" icon="el-icon-search" @click="initData()">查询</el-button>
                  <el-button size="small" icon="el-icon-close" @click="formSearchShow=false">取消</el-button>
                </el-form-item>
              </el-form>
            </el-card>
          </div>
          <!--表格-->
          <div class="content">
            <el-table :data="tableData" stripe border style="width: 100%" @sort-change="sortasstes" @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="40" />
              <el-table-column type="index" width="40" label="序号" />
              <!-- <el-table-column v-show="false" prop="id" label="序号" sortable="custom" width="80" /> -->
              <el-table-column prop="state" label="状态" sortable="custom">
                <template slot-scope="scope">
                  {{ scope.row.state==='Normal'?"正常":scope.row.state==='Using'?"使用中":"故障" }}
                </template>
              </el-table-column>
              <el-table-column prop="code" label="资产编码" sortable="custom" width="170">
                <template slot-scope="scope">
                  <el-button style="display:block;margin-left:0;margin-bottom:5px;" size="mini" type="primary" @click="UpdateStage(scope.row)">{{ scope.row.code }}</el-button>
                </template>
              </el-table-column>
              <el-table-column prop="equimentType.name" label="资产类别" sortable="custom" />
              <el-table-column prop="alias" label="资产名称" sortable="custom" />
              <el-table-column prop="brand.name" label="品牌" sortable="custom" />
              <el-table-column prop="model.name" label="型号" sortable="custom" />
              <el-table-column prop="parentSystem" label="所属系统" sortable="custom" />
              <el-table-column prop="system.name" label="所属子系统" sortable="custom" />
              <el-table-column prop="position.name" label="安装位置" sortable="custom" />
              <el-table-column prop="enableTime" label="投用时间" sortable="custom" :formatter="formatterstartDate" />
              <el-table-column prop="handoverDate" label="交工时间" sortable="custom" :formatter="formatterDate" />
              <el-table-column prop="purchaseYear" label="购置年份" sortable="custom" />
              <el-table-column prop="original" label="资产原值" sortable="custom" />
              <el-table-column prop="source.name" label="增加方式" sortable="custom" />
              <el-table-column prop="si.name" label="集成商" sortable="custom" />
              <el-table-column prop="recordUser" label="录入人" sortable="custom" />
              <el-table-column prop="lastUpdateTime" label="更新时间" sortable="custom" :formatter="formatterDate" />
              <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                  <el-button style="display:block;margin-left:0;margin-bottom:5px;" size="mini" type="primary" @click="UpdateStage(scope.row)">编辑</el-button>
                  <el-button style="display:block;margin-left:0;margin-bottom:5px;" size="mini" type="danger" @click="deleteManage(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!--分页-->
            <pagination v-show="totalCount>0" :total="totalCount" :page.sync="tableDataSearch.pageNumber" :limit.sync="tableDataSearch.pageSize" @pagination="getPage" />
            <!--删除-->
            <el-dialog ref="removeData" title="提示" :close-on-press-escape="false" :close-on-click-modal="false" :visible.sync="removeQuestionVisible" width="220px">
              <span>您确定要删除此条数据？</span>
              <span slot="footer" class="dialog-footer">
                <el-button @click="removeQuestionVisible = false">取 消</el-button>
                <el-button type="primary" @click="removeQuestion">确 定</el-button>
              </span>
            </el-dialog>
            <el-dialog title="资产详情" :visible.sync="showInfo" :close-on-press-escape="false" :close-on-click-modal="false" width="1500px" :show-close="false">
              <el-tabs v-model="activeName" tab-position="left" type="card" @tab-click="tabhandleClick">
                <el-tab-pane label="基本信息" name="first">
                  <el-form ref="form" :model="formData" :rules="formDatarules" label-width="90px">
                    <el-form-item label="使用单位" prop="useUnitId">
                      <el-select v-model="formData.useUnitId" v-loadmore="loadMoreunit" filterable placeholder="使用单位" size="small">
                        <el-option v-for="item in unitData" :key="item.id" :label="item.name" :value="item.id" />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="安装位置" prop="positionId" style="margin-bottom:-15px;">
                      <treeselect v-model="formData.positionId" :disable-branch-nodes="true" :normalizer="normalizer" :options="positionTreeData" :load-options="loadOptions" placeholder="安装位置" no-results-text="未找到相关数据" />
                    </el-form-item>
                    <el-form-item label="所属系统" prop="systemId">
                      <el-select v-model="formData.systemId" v-loadmore="loadMoresystem" filterable placeholder="所属系统" size="small">
                        <el-option v-for="item in systemData" :key="item.id" :label="item.name" :value="item.id" />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="资产类别" prop="equipmentID">
                      <el-select v-model="formData.equipmentID" v-loadmore="loadMoreequipment" filterable placeholder="资产类别" size="small">
                        <el-option v-for="item in equipmentData" :key="item.id" :label="item.name" :value="item.id" />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="集成商" prop="siId">
                      <el-select v-model="formData.siId" v-loadmore="loadMoresi" filterable placeholder="设备集成商" size="small">
                        <el-option v-for="item in siData" :key="item.id" :label="item.name" :value="item.id" />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="资产名称" prop="alias">
                      <el-input v-model="formData.alias" placeholder="资产名称" size="small" />
                    </el-form-item>
                    <el-form-item label="投用时间" prop="enableTime">
                      <el-date-picker v-model="formData.enableTime" type="date" placeholder="投用时间" />
                    </el-form-item>
                    <el-form-item label="品牌" prop="brandId">
                      <el-select v-model="formData.brandId" v-loadmore="loadMorebrand" filterable placeholder="品牌" size="small" @change="changebrand">
                        <el-option v-for="item in brandData" :key="item.id" :label="item.name" :value="item.id" />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="型号" prop="modelId">
                      <el-select v-model="formData.modelId" v-loadmore="loadMoremodel" filterable placeholder="型号" size="small">
                        <el-option v-for="item in modelData" :key="item.id" :label="item.name" :value="item.id" />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="来源" prop="sourceId">
                      <el-select v-model="formData.sourceId" v-loadmore="loadMoresource" filterable placeholder="来源" size="small">
                        <el-option v-for="item in sourceData" :key="item.id" :label="item.name" :value="item.id" />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="购置年份" prop="purchaseYear">
                      <el-input v-model="formData.purchaseYear" placeholder="购置年份" size="small" />
                    </el-form-item>
                    <el-form-item label="交工时间" prop="handoverDate">
                      <el-date-picker v-model="formData.handoverDate" type="date" placeholder="交工时间" />
                    </el-form-item>
                    <el-form-item label="工程名称" prop="engineering">
                      <el-input v-model="formData.engineering" placeholder="工程名称" size="small" />
                    </el-form-item>
                    <el-form-item label="使用年限" prop="ratedLife">
                      <el-input v-model="formData.ratedLife" placeholder="使用年限" size="small" />
                    </el-form-item>
                    <el-form-item label="缺陷责任期" prop="liabilityPeriod">
                      <el-input v-model="formData.liabilityPeriod" placeholder="缺陷责任期" size="small" />
                    </el-form-item>
                    <el-form-item label="产权单位" prop="propertyUnitId">
                      <el-select v-model="formData.propertyUnitId" v-loadmore="loadMoreunit" filterable placeholder="产权单位" size="small">
                        <el-option v-for="item in unitData" :key="item.id" :label="item.name" :value="item.id" />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="资产原值" prop="original">
                      <el-input v-model="formData.original" placeholder="资产原值" size="small" />
                    </el-form-item>
                    <el-form-item label="计量单位" prop="uint">
                      <el-select v-model="formData.uint" clearable placeholder="计量单位" size="small">
                        <el-option key="1" label="台" value="台" />
                        <el-option key="2" label="套" value="套" />
                        <el-option key="3" label="个" value="个" />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="备注" class="form_mid" prop="comment">
                      <el-input v-model="formData.comment" type="textarea" :rows="2" placeholder="请输入内容" />
                    </el-form-item>
                    <el-form-item label="照片" class="form_mid">
                      <Uploadimg v-model="formData.image" :reset="formData.image" @uploadimg="uploadimgdata">aaa</Uploadimg>
                    </el-form-item>
                    <el-form-item class="form_total">
                      <el-button type="primary" @click="updataform()">确定</el-button>
                    </el-form-item>
                  </el-form>
                </el-tab-pane>
                <el-tab-pane label="处理日志" name="second">
                  <el-table :data="logsData" style="width: 100%">
                    <el-table-column prop="createTime" label="处理日期" :formatter="formatterstartDate" />
                    <el-table-column prop="operatUser" label="处理人">
                      <template slot-scope="scope">
                        {{ scope.row.operatUser.name }}
                      </template>
                    </el-table-column>
                    <el-table-column prop="type" label="处理方式">
                      <template slot-scope="scope">
                        {{ scope.row.type==='Update'?"更新":scope.row.type==='Enable'?"启用":"禁用" }}
                      </template>
                    </el-table-column>
                    <el-table-column prop="content" label="处理内容" width="400" />
                    <el-table-column prop="remark" label="备注" width="400" />
                  </el-table>
                  <div class="dialog-footer">
                    <el-button type="primary" @click="showInfo=false">确 定</el-button>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </el-dialog>
          </div>

        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { Treeselect, LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
// 节流
const simulateAsyncOperation = fn => {
  setTimeout(fn, 500)
}
import pagination from '@/components/Pagination'
import Uploadimg from '@/components/Uploadimg'
export default {
  components: {
    pagination,
    Treeselect,
    Uploadimg
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
      showInfo: false, // 编辑弹框隐藏
      activeName: 'first', // 编辑弹框tab
      formSearchShow: false, // 高级搜索弹框隐藏
      removeQuestionVisible: false, // 删除弹框隐藏
      formSearch: {// 高级搜索数据
        code: '',
        equimentType: '',
        alias: '',
        brand: '',
        model: '',
        parentSystem: '',
        system: '',
        position: '',
        enableTime: '',
        handoverDate: '',
        purchaseYear: '',
        original: '',
        source: '',
        recordUser: '',
        lastUpdateTime: ''
      },
      formData: {// 编辑或详情表单数据
        id: '',
        useUnitId: '',
        positionId: '',
        systemId: '',
        equipmentID: '',
        enableTime: '',
        brandId: '',
        modelId: '',
        sourceId: '',
        siId: '',
        purchaseYear: '',
        ratedLife: '',
        handoverDate: '',
        engineering: '',
        liabilityPeriod: '',
        propertyUnitId: '',
        original: '',
        uint: '',
        comment: '',
        image: ''
      },
      tableData: [], // 表格数据
      multipleSelection: '', // 表单选中行
      removeData: null, // 当前表单所选删除行
      tableDataSearch: {
        orderBy: '', // 排序字段
        desc: undefined, // 倒叙  是否
        state: null, // 资产状态
        text: '', // 搜索文本
        pageSize: 10, // 展示条数
        pageNumber: 1// 页码
      },
      totalCount: 0, // 数据总条数
      logsData: [// 日志数据
        {
          createTime: '',
          operatUser: '',
          type: '',
          content: '',
          remark: ''
        }
      ],
      unitData: [], // 使用单位数据
      positionTreeData: [], // 安装位置数据
      systemData: [], // 所属系统数据
      equipmentData: [], // 资产类别数据
      brandData: [], // 品牌数据
      modelData: [], // 型号数据
      sourceData: [], // 设备来源
      siData: [], // 集成商来源
      formDatarules: {
        useUnitId: [
          { required: true, message: '使用单位不可为空', trigger: 'change' }
        ],
        positionId: [
          { required: true, message: '安装位置不可为空', trigger: 'change' }
        ],
        systemId: [
          { required: true, message: '所属系统不可为空', trigger: 'change' }
        ],
        equipmentID: [
          { required: true, message: '资产类别不可为空', trigger: 'change' }
        ],
        siId: [
          { required: true, message: '资产名称不可为空', trigger: 'change' }
        ],
        brandId: [
          { required: true, message: '品牌不可为空', trigger: 'change' }
        ],
        modelId: [
          { required: true, message: '型号不可为空', trigger: 'change' }
        ],
        enableTime: [
          { type: 'date', required: true, message: '请选择投用时间', trigger: 'change' }
        ]
      },
      unitpage: {// 使用单位同产权单位分页
        pageNumber: 1,
        pageSize: 999999,
        pageCount: ''
      },
      positionpage: {// 安装位置分页
        pageNumber: 1,
        pageSize: 999999,
        pageCount: ''
      },
      systempage: {// 所属系统分页
        pageNumber: 1,
        pageSize: 999999,
        pageCount: ''
      },
      equipmentpage: {// 资产类别分页
        pageNumber: 1,
        pageSize: 999999,
        pageCount: ''
      },
      brandpage: {// 品牌分页
        pageNumber: 1,
        pageSize: 999999,
        pageCount: ''
      },
      modelpage: {// 型号分页
        pageNumber: 1,
        pageSize: 999999,
        pageCount: ''
      },
      sourcepage: {// 来源分页
        pageNumber: 1,
        pageSize: 999999,
        pageCount: ''
      },
      sipage: {// 集成商分页
        pageNumber: 1,
        pageSize: 999999,
        pageCount: ''
      }
    }
  },
  computed: {},
  mounted() {
    this.getData()
    // 获取下拉菜单数据
    this.getunitData()
    this.getpositionData()
    this.getsystemData()
    this.getequipmentData()
    this.getbrandData()
    this.getmodelData()
    this.getsourceData()
    this.getsiData()
  },
  methods: {
    getlogs() { // 获取日志
      const _this = this
      this.$axios.get('/api/Assets/' + _this.formData.id + '/logs').then(res => {
        _this.logsData = res.data
      })
    },
    // 上传图片 子传父的值
    uploadimgdata(e) {
      console.log(e)
      this.formData.image = e
    },
    // 日期时间格式化
    formatterDate(row, column, cellValue) {
      if (cellValue !== null) {
        return this.$moment(cellValue).format('YYYY-MM-DD HH:mm')
      } else {
        return cellValue
      }
    },
    // 投用时间日期时间格式化
    formatterstartDate(row, column, cellValue) {
      if (cellValue !== null) {
        return this.$moment(cellValue).format('YYYY-MM-DD')
      } else {
        return cellValue
      }
    },
    sortasstes(column) {
      this.tableDataSearch.orderBy = column.prop
      this.tableDataSearch.desc = column.order === 'descending'
      this.getData()
    },
    initData() { // 高级搜索
      this.$axios.get('/api/Assets', { params: this.formSearch }).then(res => {
        this.tableData = res.data
        this.totalCount = res.totalCount
        // 隐藏高级搜索
        this.formSearchShow = false
      })
    },
    getData() { // 获取数据
      // 搜索框内容不为空 页码跳转至第一页
      if (this.tableDataSearch.text !== '') {
        this.tableDataSearch.pageNumber = 1
      }
      this.$axios.get('/api/Assets', { params: this.tableDataSearch }).then(res => {
        this.tableData = res.data
        this.totalCount = res.totalCount
      })
    },
    create() { // 新增资产
      this.$router.push('/assets/Create')
    },
    selectstate(data) { // 按状态筛选资产
      this.tableDataSearch.state = data === undefined ? null : data
      this.getData()
    },
    handleClick(e) { // 导入导出选择事件
    },
    Import() { // 导入方法

    },
    searchData() {
      // 全局查询方法
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    UpdateStage(val) { // 点击编辑按钮
      this.showInfo = true
      this.formData.id = val.id
      // 获取单条数据
      this.gedata()
      // 获取日志
      this.getlogs()
    },
    deleteManage(row) {
      this.removeData = row
      this.removeQuestionVisible = true
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
    getPage(val) { // page事件
      // 展示条数
      this.tableDataSearch.pageSize = val.limit
      // 页码
      this.tableDataSearch.pageNumber = val.page
      // 调用获取数据
      // this.getData()
      this.$axios.get('/api/Assets', { params: this.tableDataSearch }).then(res => {
        this.tableData = res.data
        this.totalCount = res.totalCount
      })
    },
    tabhandleClick(tab, event) {
    },
    checkhasChildren(data) {
      // 位置数据遍历
      data.forEach((item, index) => {
        if (item.children === null) {
          item.children = undefined
        } else {
          this.checkhasChildren(item.children)
        }
      })
      return data
    },
    getpositionData() {
      // 获取安装位置
      this.$axios.get('/api/Tree/Position').then(res => {
        this.positionTreeData = this.checkhasChildren(res)
      })
    },
    getunitData() {
      // 获取使用单位信息
      this.$axios.get('/api/Meta/Unit?pageSize=' + this.unitpage.pageSize + '&pageNumber=' + this.unitpage.pageNumber).then(res => {
        this.unitData = this.unitData.concat(res.data)
        this.unitpage.pageCount = res.pageCount
      })
    },
    getsystemData() {
      // 获取所属系统
      this.$axios.get('/api/Meta/System?pageSize=' + this.systempage.pageSize + '&pageNumber=' + this.systempage.pageNumber).then(res => {
        this.systemData = this.systemData.concat(res.data)
        this.systempage.pageCount = res.pageCount
      })
    },
    getequipmentData() {
      // 获取资产类别
      this.$axios.get('/api/Meta/equipment?pageSize=' + this.equipmentpage.pageSize + '&pageNumber=' + this.equipmentpage.pageNumber).then(res => {
        this.equipmentData = this.equipmentData.concat(res.data)
        this.equipmentpage.pageCount = res.pageCount
      })
    },
    getbrandData() {
      // 获取品牌
      this.$axios.get('/api/Meta/Brand?pageSize=' + this.brandpage.pageSize + '&pageNumber=' + this.brandpage.pageNumber).then(res => {
        this.brandData = this.brandData.concat(res.data)
        this.brandpage.pageCount = res.pageCount
      })
    },
    getmodelData() {
      // 获取型号
      this.$axios.get('/api/Meta/Model?pageSize=' + this.modelpage.pageSize + '&pageNumber=' + this.modelpage.pageNumber).then(res => {
        this.modelData = this.modelData.concat(res.data)
        this.modelpage.pageCount = res.pageCount
      })
    },
    getsourceData() {
      // 获取设备来源
      this.$axios.get('/api/Meta/Source?pageSize=' + this.sourcepage.pageSize + '&pageNumber=' + this.sourcepage.pageNumber).then(res => {
        this.sourceData = this.sourceData.concat(res.data)
        this.sourcepage.pageCount = res.pageCount
      })
    },
    getsiData() {
      // 获取集成商
      this.$axios.get('/api/Meta/SI?pageSize=' + this.sipage.pageSize + '&pageNumber=' + this.sipage.pageNumber).then(res => {
        this.siData = this.siData.concat(res.data)
        this.sipage.pageCount = res.pageCount
      })
    },
    loadMoreunit() { // 加载下一页数据
      if (this.unitpage.pageCount > this.unitpage.pageNumber) {
        this.unitpage.pageNumber += 1
        this.getunitData()
      }
    },
    loadMoresystem() { // 所属系统加载下一页数据
      if (this.systempage.pageCount > this.systempage.pageNumber) {
        this.systempage.pageNumber += 1
        this.getsystemData()
      }
    },
    loadMoreequipment() { // 资产种类加载下一页数据
      if (this.equipmentpage.pageCount > this.equipmentpage.pageNumber) {
        this.equipmentpage.pageNumber += 1
        this.getequipmentData()
      }
    },
    loadMoresi() { // 集成商加载下一页数据
      if (this.sipage.pageCount > this.sipage.pageNumber) {
        this.sipage.pageNumber += 1
        this.getsiData()
      }
    },
    loadMorebrand() { // 品牌加载下一页数据
      if (this.brandpage.pageCount > this.brandpage.pageNumber) {
        this.brandpage.pageNumber += 1
        this.getbrandData()
      }
    },
    loadMoremodel() { // 型号加载下一页数据
      if (this.modelpage.pageCount > this.modelpage.pageNumber) {
        this.modelpage.pageNumber += 1
        this.getmodelData()
      }
    },
    loadMoresource() { // 来源加载下一页数据
      if (this.sourcepage.pageCount > this.sourcepage.pageNumber) {
        this.sourcepage.pageNumber += 1
        this.getsourceData()
      }
    },
    changebrand() {
      this.formData.modelId = ''
      this.$axios.get('/api/Meta/Model?brandId=' + this.formData.brandId).then(res => {
        this.modelData = res.data
      })
    },
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
    gedata() { // 获取单条数据
      this.$axios.get('/api/Assets/Lite/' + this.formData.id).then(res => {
        this.formData = res
        this.formData.enableTime = new Date(res.enableTime)
        this.formData.handoverDate = new Date(res.handoverDate)
      })
    },
    updataform() {
      this.$axios.put('/api/Assets?id=' + this.formData.id, this.formData).then(res => {
        // 关掉编辑或详情弹框
        this.showInfo = false
      })
    },
    assetsExport() {
      this.$axios.post('/api/Assets/Export', this.formSearch, { Accept: {
        'Content-Type': 'application/json;application/octet-stream'
      }, responseType: 'blob' }).then(res => {
        const url = window.URL.createObjectURL(new Blob([res.data]))
        const link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', this.$base64.decode(/filename="=\?(\S*)\?(\S*)==/.exec(res.headers['content-disposition'])[2]))
        document.body.appendChild(link)
        link.click()
      })
    }
  }
}
</script>
<style lang='scss' scoped>
.header {
  width: 100%;
}
.select {
  width: 33%;
  display: inline-block;
  .el-button {
    margin-left: 0px;
  }
}
.tools {
  width: 33%;
  display: inline-block;
}
.toolsrt {
  width: 33%;
  display: inline-block;
  text-align: right;
  .el-input {
    display: inline-block;
    width: 200px;
  }
}
.search {
  width: 450px;
  position: absolute;
  right: 0;
  z-index: 4;
  .el-input {
    display: inline-block;
    width: 49%;
  }
  .el-select {
    margin-bottom: 5px;
    .el-input {
      width: 100%;
    }
  }
}
.content {
  margin-top: 30px;
  .el-table th,
  .el-table td {
    padding: 5px;
  }
}
.el-tab-pane {
  .el-form-item {
    width: 49%;
    display: inline-block;
    .el-select {
      width: 100%;
    }
    .el-date-editor {
      width: 100%;
    }
  }
  .el-tabs__content {
    border: 1px solid #ddd;
    min-height: 700px;
  }
  .el-tabs--left.el-tabs--card .el-tabs__item.is-left.is-active:first-child {
    border: none;
  }
}
.form_total {
  width: 100% !important;
  text-align: center;
}
.el-card__body {
  .el-form-item {
    width: 49%;
    display: inline-block;
    margin-bottom: 5px;
    .el-date-editor {
      width: 100%;
    }
  }
}
.dialog-footer {
  text-align: center;
  margin-top: 20px;
}
</style>
