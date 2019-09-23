<!-- 维护计划管理页面 -->
<template>
  <div>
    <el-row>
      <el-col>
        <div class="panel">
          <div class="header">
            <div class="select">
              <el-button type="primary" size="small" @click="addlist()">新增计划</el-button>
              <el-button type="primary" size="small" @click="setvalid()">导出计划</el-button>
              <el-button type="success" size="small" @click="UpdateStage()">编辑</el-button>
              <el-button type="danger" size="small" @click="deletelist()">删除</el-button>
            </div>
            <div class="toolsrt">
              <el-form ref="form" :model="tableDataSearch">
                <el-select v-model="tableDataSearch.start" filterable placeholder="开始时间" size="small">
                  <el-option v-for="item in startdateData" :key="item" :label="item" :value="item" />
                </el-select>
                <el-select v-model="tableDataSearch.end" filterable placeholder="结束时间" size="small">
                  <el-option v-for="item in enddateData" :key="item" :label="item" :value="item" />
                </el-select>
                <el-input v-model="tableDataSearch.text" placeholder="全局搜索" size="small" />
                <el-button type="primary" plain size="small" @click="getData()">查询</el-button>
              </el-form>
            </div>
          </div>
          <div class="content">
            <el-table :data="tableData" stripe border style="width: 100%" @selection-change="handleChange">
              <el-table-column type="selection" />
              <el-table-column label="完成状态" prop="planState ">
                <template slot-scope="scope">
                  <el-button size="mini" type="text" @click="showInfo(scope.row)">{{ scope.row.planState }}</el-button>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="维护计划名名称" />
              <el-table-column prop="start" label="起止时间">
                <template slot-scope="scope">
                  {{ formatter(scope.row.start) }} <br>至<br>
                  {{ formatter(scope.row.end) }}
                </template>
              </el-table-column>
              <el-table-column prop="responsibleUser" label="负责人" />
              <el-table-column prop="excuteUser" label="执行人" />
              <el-table-column prop="assetCount" label="关联资产数" />
              <el-table-column prop="cyclic" label="维护频率">
                <template slot-scope="scope">
                  {{ scope.row.cyclic=='Day'?'每天':scope.row.cyclic=='Week'?'每周':scope.row.cyclic=='Month'?'每月':'每年' }}
                </template>
              </el-table-column>
              <el-table-column prop="createTime" label="录入日期" :formatter="formatterDate" />
              <el-table-column prop="createUser" label="录入人">
                <template slot-scope="scope">
                  {{ scope.row.createUser.name }}
                </template>
              </el-table-column>
              <el-table-column prop="reviewUser" label="验收人" />
              <el-table-column prop="reviewtime" label="验收时间" :formatter="formatterDate" />
              <el-table-column label="操作" width="200px">
                <template slot-scope="scope">
                  <el-button size="mini" type="primary" style="margin:2px 5px" @click="UpdateStage(scope.row)">编辑计划</el-button>
                  <el-button type="primary" size="mini" style="margin:2px 5px" @click="managelist(scope.row)">管理资产</el-button>
                  <el-button size="mini" type="danger" style="margin:2px 5px" @click="deletelist(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!--分页-->
            <pagination v-show="totalCount>0" :total="totalCount" :page.sync="tableDataSearch.pageNumber" :limit.sync="tableDataSearch.pageSize" @pagination="getPage" />
            <!-- 删除计划 -->
            <el-dialog ref="removeData" title="提示" :close-on-press-escape="false" :close-on-click-modal="false" :visible.sync="removeQuestionVisible" width="220px">
              <span>您确定要删除此条数据？</span>
              <span slot="footer" class="dialog-footer">
                <el-button @click="removeQuestionVisible = false">取 消</el-button>
                <el-button type="primary" @click="removeData">确 定</el-button>
              </span>
            </el-dialog>
            <!-- 新增或编辑计划-->
            <el-dialog :title="title" :visible.sync="Visible" :close-on-press-escape="false" :close-on-click-modal="false" width="1200px">
              <el-form ref="tableDatanew" :model="tableDatanew" :rules="tableDatanewrules" label-width="120px">
                <el-row class="selfstyle">
                  <el-col :span="12">
                    <el-form-item label="计划名称" prop="name">
                      <el-input v-model="tableDatanew.name" placeholder="计划名称" size="small" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="所属系统" prop="systemId">
                      <el-select v-model="tableDatanew.systemId" filterable remote :remote-method="remoteMethodsystemId" :loading="loading" placeholder="所属系统" size="small" @focus="remoteMethodsystemId">
                        <el-option v-for="item in systemData" :key="item.id" :label="item.name" :value="item.id" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="起止时间" prop="daterange">
                      <el-date-picker v-model="tableDatanew.daterange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="daterangeChange" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="维护频率" prop="cyclic">
                      <el-select v-model="tableDatanew.cyclic" filterable placeholder="维护频率" size="small">
                        <el-option key="Day" label="每天" value="Day" />
                        <el-option key="Week" label="每周" value="Week" />
                        <el-option key="Month" label="每月" value="Month" />
                        <el-option key="Year" label="每年" value="Year" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="抽检率" prop="samplingRate">
                      <el-select v-model="tableDatanew.samplingRate" filterable placeholder="抽检率" size="small">
                        <el-option v-for="item in samplingRateData" :key="item.id" :label="item.name" :value="item.id" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="责任人" prop="responsibleUser">
                      <el-input v-model="tableDatanew.responsibleUser" placeholder="责任人" size="small" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="执行人" prop="excuteUser">
                      <el-input v-model="tableDatanew.excuteUser" placeholder="执行人" size="small" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item style="text-align:center;">
                      <el-button type="primary" size="small" icon="el-icon-search" @click="createorupdate()">保存</el-button>
                      <el-button size="small" icon="el-icon-close" @click="cancel()">取消</el-button>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </el-dialog>
            <!-- 一级弹框开始******************************************************* -->
            <el-dialog title="编辑资产" :visible.sync="Visiblefirst" :close-on-press-escape="false" :close-on-click-modal="false" width="1200px">
              <el-form ref="form" :model="tableDatanewfirst" label-width="120px">
                <el-row class="selfstyle">
                  <el-col :span="12">
                    <el-form-item label="计划名称" prop="name">
                      <el-input v-model="tableDatanewfirst.name" :disabled="true" placeholder="计划名称" size="small" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="所属系统" prop="systemId">
                      <el-select v-model="tableDatanewfirst.systemId" :disabled="true" clearable placeholder="所属系统" size="small">
                        <el-option v-for="item in systemData" :key="item.id" :label="item.name" :value="item.id" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="起止时间" prop="daterange">
                      <el-date-picker v-model="tableDatanewfirst.daterange" :disabled="true" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="维护频率" prop="cyclic">
                      <el-select v-model="tableDatanewfirst.cyclic" filterable :disabled="true" placeholder="维护频率" size="small">
                        <el-option key="Day" label="每天" value="Day" />
                        <el-option key="Week" label="每周" value="Week" />
                        <el-option key="Month" label="每月" value="Month" />
                        <el-option key="Year" label="每年" value="Year" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="抽检率" prop="samplingRate">
                      <el-select v-model="tableDatanewfirst.samplingRate" filterable :disabled="true" placeholder="抽检率" size="small">
                        <el-option v-for="item in samplingRateData" :key="item.id" :label="item.name" :value="item.id" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="责任人" prop="responsibleUser">
                      <el-input v-model="tableDatanewfirst.responsibleUser" :disabled="true" placeholder="责任人" size="small" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="执行人" prop="excuteUser">
                      <el-input v-model="tableDatanewfirst.excuteUser" :disabled="true" placeholder="执行人" size="small" />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
              <div class="header">
                <div class="select">
                  <el-button type="primary" size="small" @click="addAssets()">添加资产</el-button>
                  <el-button type="primary" size="small" @click="removeEquip()">移除资产</el-button>
                </div>
              </div>
              <el-table :data="tableDatafirst" stripe border style="width: 100%" @selection-change="handleChangefirst">
                <el-table-column type="selection" />
                <el-table-column prop="equipment" label="资产名称">
                  <template slot-scope="scope">
                    {{ scope.row.equipment.name }}
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
                <el-table-column prop="count" label="数量" />
                <el-table-column prop="level1" label="一级" />
                <el-table-column prop="level2" label="二级" />
                <el-table-column prop="level3" label="三级" />
                <el-table-column prop="level4" label="四级" />
                <el-table-column prop="level5" label="五级" />
              </el-table>
              <!--分页-->
              <pagination v-show="totalCountfirst>0" :total="totalCountfirst" :page.sync="tableDataSearchfirst.pageNumber" :limit.sync="tableDataSearchfirst.pageSize" @pagination="getPagefirst" />
            </el-dialog>
            <!-- 一级弹框结束**************************************************************** -->
            <!-- 二级弹框开始**************************************************************** -->
            <el-dialog title="新增计划子项" :visible.sync="Visiblesecond" :close-on-press-escape="false" :close-on-click-modal="false" width="1200px">
              <div class="header">
                <div class="">
                  <el-form ref="tableDataSearchsecond" :model="tableDataSearchsecond" label-width="50px;">
                    <el-row class="selfstyle">
                      <el-col :span="6">
                        <el-form-item>
                          <treeselect v-model="tableDataSearchsecond.positionId" :disable-branch-nodes="true" :normalizer="normalizer" :options="positionTreeData" :load-options="loadOptions" placeholder="安装位置" no-results-text="未找到相关数据" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item>
                          <el-select v-model="tableDataSearchsecond.systemId" filterable remote :remote-method="remoteMethodsystemId" :loading="loading" clearable placeholder="所属系统" size="small" @focus="remoteMethodsystemId">
                            <el-option v-for="item in systemData" :key="item.id" :label="item.name" :value="item.id" />
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item>
                          <el-input v-model="tableDataSearchsecond.text" placeholder="关键字模糊查询" size="small" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item>
                          <el-button type="primary" plain size="small" @click="getDatasecond()">查询</el-button>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-form>
                  <el-form ref="RepairRecord" :model="RepairRecord" label-width="50px;">
                    <el-row>
                      <el-col :span="24">录入维护记录</el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="3">
                        <el-form-item label="一级">
                          <el-input-number v-model="RepairRecord.level1" controls-position="right" size="mini" :min="0" :max="1000000" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="1">次</el-col>
                      <el-col :span="3">
                        <el-form-item label="二级">
                          <el-input-number v-model="RepairRecord.level2" controls-position="right" size="mini" :min="0" :max="1000000" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="1">次</el-col>
                      <el-col :span="3">
                        <el-form-item label="三级">
                          <el-input-number v-model="RepairRecord.level3" controls-position="right" size="mini" :min="0" :max="1000000" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="1">次</el-col>
                      <el-col :span="3">
                        <el-form-item label="四级">
                          <el-input-number v-model="RepairRecord.level4" controls-position="right" size="mini" :min="0" :max="1000000" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="1">次</el-col>
                      <el-col :span="3">
                        <el-form-item label="五级">
                          <el-input-number v-model="RepairRecord.level5" controls-position="right" size="mini" :min="0" :max="1000000" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="1">次</el-col>
                    </el-row>
                  </el-form>
                </div>
              </div>
              <el-table :data="tableDatasecond" stripe border style="width: 100%" @selection-change="handleChangesecond">
                <el-table-column type="selection" />
                <el-table-column prop="equipment" label="资产名称">
                  <template slot-scope="scope">
                    {{ scope.row.equipment.name }}
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
                <el-table-column prop="count" label="数量" />
              </el-table>
              <!--分页-->
              <pagination v-show="totalCountsecond>0" :total="totalCountsecond" :page.sync="tableDataSearchsecond.pageNumber" :limit.sync="tableDataSearchsecond.pageSize" @pagination="getPagesecond" />
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="creatlist">添加</el-button>
                <el-button type="primary" @click="Visiblesecond=false">取消</el-button>
              </span>
            </el-dialog>
            <!-- 二级弹框结束**************************************************************** -->
            <!-- 删除计划子项**************************************************************** -->
            <el-dialog ref="removeData" title="提示" :close-on-press-escape="false" :close-on-click-modal="false" :visible.sync="removeVisible" width="220px">
              <span>您确定要删除此条数据？</span>
              <span slot="footer" class="dialog-footer">
                <el-button @click="removeVisible = false">取 消</el-button>
                <el-button type="primary" @click="removeDatainfo">确 定</el-button>
              </span>
            </el-dialog>
            <!-- 是否添加资产 -->
            <el-dialog title="提示" :close-on-press-escape="false" :close-on-click-modal="false" :visible.sync="AddVisible" width="220px">
              <span>是否添加资产？</span>
              <span slot="footer" class="dialog-footer">
                <el-button @click="AddVisible = false">否</el-button>
                <el-button type="primary" @click="AddDatainfo()">是</el-button>
              </span>
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
      AddVisible: false, // 是否添加资产弹框
      loading: false, // 远程搜索
      title: '新增计划',
      formSearchShow: false,
      removeQuestionVisible: false, // 删除计划弹框
      removeVisible: false, // 删除计划子项弹框
      Visible: false, // 新增计划弹框
      Visiblefirst: false, // 一级弹框隐藏
      Visiblesecond: false, // 二级弹框隐藏
      tableDataSearch: {
        planState: 'Plan', // 状态
        start: '',
        end: '',
        text: '', // 搜索文本
        pageSize: 10, // 展示条数
        pageNumber: 1// 页码
      },
      tableDataSearchfirst: {// 一级弹框搜索
        pageSize: 10, // 展示条数
        pageNumber: 1// 页码
      },
      tableDataSearchsecond: {// 二级弹框搜索
        positionId: '',
        systemId: '',
        text: '',
        pageSize: 10, // 展示条数
        pageNumber: 1// 页码
      },
      totalCount: 0, // 数据总条数
      totalCountfirst: 0, // 数据总条数
      totalCountsecond: 0, // 数据总条数
      tableData: [],
      tableDatafirst: [], // 一级弹框表单数据
      tableDatasecond: [], // 二级弹框表单数据
      tableDatanew: {// 新增计划表单
        daterange: [],
        start: '',
        end: '',
        responsibleUser: '',
        excuteUser: '',
        samplingRate: '',
        systemId: '',
        name: '',
        cyclic: ''
      },
      tableDatanewfirst: {}, // 一级弹框搜索
      multiple: '', // 表单选中行
      multiplefirst: '', // 一级弹框表单选中行
      multiplesecond: [], // 二级弹框表单选中行
      yearData: [],
      systemData: [],
      systempage: {// 所属系统分页
        pageNumber: 1,
        pageSize: 50,
        pageCount: ''
      },
      samplingRateData: [// 抽检率数据
        { id: 10, name: '10 %' },
        { id: 20, name: '20 %' },
        { id: 30, name: '30 %' },
        { id: 40, name: '40 %' },
        { id: 50, name: '50 %' },
        { id: 60, name: '60 %' },
        { id: 70, name: '70 %' },
        { id: 80, name: '80 %' },
        { id: 90, name: '90 %' },
        { id: 100, name: '100 %' }
      ],
      tableDatanewrules: {// 新增计划表单验证
        responsibleUser: [
          { required: true, message: '责任人不可为空', trigger: 'change' }
        ],
        excuteUser: [
          { required: true, message: '执行人不可为空', trigger: 'change' }
        ],
        name: [
          { required: true, message: '计划名称不可为空', trigger: 'change' }
        ],
        daterange: [
          { required: true, message: '起止时间不可为空', trigger: 'change' }
        ]
      },
      positionTreeData: [], // 位置数据
      RepairRecord: {// 维修记录表单
        level1: '',
        level2: '',
        level3: '',
        level4: '',
        level5: ''
      },
      itemid: '', // 计划子项id
      startdateData: [],
      enddateData: []
    }
  },
  computed: {},
  mounted() {
    this.getData()
    // 获取查询项下拉菜单数据
    this.getyearData()
    this.getsystemData()
    this.getDates()
  },
  methods: {
    //* ******************************************************************************************************* */
    // 公用代码

    formatterDate(row, column, cellValue) { // 日期时间格式化
      if (cellValue !== null) {
        return this.$moment(cellValue).format('YYYY-MM-DD')
      } else {
        return cellValue
      }
    },
    formatter(val) { // 日期时间格式化
      return this.$moment(val).format('YYYY-MM-DD')
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
    getpositionData() { // 获取位置
      this.$axios.get('/api/Tree/Position').then(res => {
        this.positionTreeData = this.checkhasChildren(res)
      })
    },
    getDates() { // 获取列表
      this.$axios.get('/api/MaintenancePlan/Dates').then(res => {
        this.startdateData = res.startDates
        this.enddateData = res.endDates
      })
    },

    //* ******************************************************************************************************* */
    // 下拉菜单数据
    getsystemData() { // 获取系统
      // 获取所属系统
      this.$axios.get('/api/Meta/System?pageSize=' + this.systempage.pageSize + '&pageNumber=' + this.systempage.pageNumber).then(res => {
        this.systemData = this.systemData.concat(res.data)
      })
    },
    getyearData() {
      var year = new Date().getFullYear()
      for (var i = 2015; i <= year; i++) {
        this.yearData.push({
          id: i,
          name: i
        })
      }
    },
    remoteMethodsystemId(query) { // 所属系统远程搜索
      this.loading = true
      let querytext = ''
      querytext = typeof (query) === 'string' ? query : ''
      this.$axios.get('/api/Meta/System?text=' + querytext).then(res => {
        this.loading = false
        this.systemData = res.data
      })
    },
    //* ******************************************************************************************************* */
    // 列表数据

    getData(data) { // 获取列表
      if (data) {
        this.tableDataSearch.valid = data
      } else {
        this.tableDataSearch.valid = ''
      }
      this.$axios.get('/api/MaintenancePlan', { params: this.tableDataSearch }).then(res => {
        this.tableData = res.data
        this.totalCount = res.totalCount
      })
    },
    getPage(val) { // page事件
      // 展示条数
      this.tableDataSearch.pageSize = val.limit
      // 页码
      this.tableDataSearch.pageNumber = val.page
      // 调用获取数据
      this.$axios.get('/api/MaintenancePlan', { params: this.tableDataSearch }).then(res => {
        this.tableData = res.data
      })
    },

    setvalid() { // 导出计划

    },
    addlist() { // 新增计划
      // 重置表单数据
      this.tableDatanew = {
        daterange: [],
        start: '',
        end: '',
        responsibleUser: '',
        excuteUser: '',
        samplingRate: '',
        systemId: '',
        name: '',
        cyclic: ''
      }
      this.Visible = true
    },
    deletelist(data) { // 删除计划
      if (data) {
        this.removeQuestionVisible = true
        this.multiple = data
      } else {
        if (this.multiple === '') {
          this.$message.error('请至少选择一条数据')
        } else {
          this.removeQuestionVisible = true
        }
      }
    },
    removeData() { // 删除弹框点确定
      this.removeQuestionVisible = true
      let id = ''
      if (typeof (this.multiple) === 'object' && this.multiple.constructor === Array) {
        id = this.multiple[0].id
      } else if (typeof (this.multiple) === 'object') {
        id = this.multiple.id
      }
      this.$axios.delete('/api/MaintenancePlan/' + id).then(res => {
        this.$message.success('删除成功')
        this.removeQuestionVisible = false
        // 清空选中值
        this.multiple = ''
        // 更新表格数据
        this.getData()
      })
    },
    handleChange(val) {
      this.multiple = val
    },
    showInfo(row) { // 点击详情按钮
      // 重置表单数据
      this.tableDatanew = {
        daterange: [],
        start: '',
        end: '',
        responsibleUser: '',
        excuteUser: '',
        samplingRate: '',
        systemId: '',
        name: '',
        cyclic: ''
      }
      this.title = '计划详情'
      // 判断当前按选中值是否存在，不存在插入
      let hasSystemData = false
      this.systemData.forEach(item => { item.id === row.system.id ? hasSystemData = true : '' })
      hasSystemData ? '' : this.systemData.push(row.system)
      // 赋值
      this.tableDatanew.daterange = [row.start, row.end]
      this.tableDatanew.name = row.name
      this.tableDatanew.systemId = row.systemId
      this.tableDatanew.cyclic = row.cyclic
      this.tableDatanew.samplingRate = row.samplingRate
      this.tableDatanew.responsibleUser = row.responsibleUser
      this.tableDatanew.excuteUser = row.excuteUser
      // 显示弹框
      this.Visible = true
      this.itemid = row.id
    },
    daterangeChange(val) {
      this.tableDatanew.start = val[0]
      this.tableDatanew.end = val[1]
    },
    UpdateStage(row) { // 点击编辑按钮
      if (row) {
        // 重置表单数据
        this.tableDatanew = {
          daterange: [],
          start: '',
          end: '',
          responsibleUser: '',
          excuteUser: '',
          samplingRate: '',
          systemId: '',
          name: '',
          cyclic: ''
        }
        this.title = '编辑计划'
        // 判断当前按选中值是否存在，不存在插入
        let hasSystemData = false
        this.systemData.forEach(item => { item.id === row.system.id ? hasSystemData = true : '' })
        hasSystemData ? '' : this.systemData.push(row.system)
        // tableDatanew
        this.tableDatanew.daterange = [row.start, row.end]
        this.tableDatanew.name = row.name
        this.tableDatanew.systemId = row.systemId
        this.tableDatanew.cyclic = row.cyclic
        this.tableDatanew.samplingRate = row.samplingRate
        this.tableDatanew.responsibleUser = row.responsibleUser
        this.tableDatanew.excuteUser = row.excuteUser
        // 显示弹框
        this.Visible = true
        this.itemid = row.id
      } else {
        if (this.multiple === '') {
          this.$message.error('请至少选择一条数据')
        } else {
          // 重置表单数据
          this.tableDatanew = {
            daterange: [],
            start: '',
            end: '',
            responsibleUser: '',
            excuteUser: '',
            samplingRate: '',
            systemId: '',
            name: '',
            cyclic: ''
          }
          // 获取编辑弹框中数据
          this.$axios.get('/api/MaintenancePlan/' + this.multiple[0].id).then(res => {
            // 判断当前按选中值是否存在，不存在插入
            let hasSystemData = false
            this.systemData.forEach(item => { item.id === res.system.id ? hasSystemData = true : '' })
            hasSystemData ? '' : this.systemData.push(res.system)
            // 赋值
            this.tableDatanew = res
            this.tableDatanew.daterange = [res.start, res.end]
            // 显示弹框
            this.Visible = true
            this.itemid = this.multiple[0].id
          })
        }
      }
    },
    managelist(row) { // 点击管理资产按钮
      this.tableDatanewfirst.daterange = [row.start, row.end]
      this.tableDatanewfirst.name = row.name
      this.tableDatanewfirst.systemId = row.systemId
      this.tableDatanewfirst.cyclic = row.cyclic
      this.tableDatanewfirst.samplingRate = row.samplingRate
      this.tableDatanewfirst.responsibleUser = row.responsibleUser
      this.tableDatanewfirst.excuteUser = row.excuteUser
      //  打开弹框
      this.Visiblefirst = true

      this.itemid = row.id
      // 加载数据
      this.getDatafirst()
    },
    //* *************************************************************************************************************** */
    // 新增或编辑计划弹框方法
    createorupdate() {
      this.$refs.tableDatanew.validate(valid => {
        if (valid) {
          this.tableDatanew.start = this.tableDatanew.daterange[0]
          this.tableDatanew.end = this.tableDatanew.daterange[1]
          if (this.title === '新增计划') {
            this.$axios.post('/api/MaintenancePlan', this.tableDatanew).then(response => {
              this.$message.success('添加成功')
              this.Visible = false
              // 清空选中值
              this.multiple = ''
              // 更新表格数据
              this.getData()
              // 显示是否添加资产弹框
              this.AddVisible = true
              // 一级弹框赋值
              this.tableDatanewfirst = response
              this.tableDatanewfirst.daterange = [response.start, response.end]
            })
          } else if (this.title === '编辑计划' || this.title === '计划详情') {
            this.$axios.put('/api/MaintenancePlan/' + this.itemid, this.tableDatanew).then(response => {
              this.$message.success('编辑成功')
              this.Visible = false
              // 清空选中值
              this.multiple = ''
              // 更新表格数据
              this.getData()
            })
          }
        }
      })
    },
    AddDatainfo() { //
      // 隐藏是否添加资产弹框
      this.AddVisible = false
      // 打开一级弹框
      this.Visiblefirst = true
    },
    cancel() { // 新增或编辑弹框取消方法
      this.Visible = false
    },
    //* *************************************************************************************************************** */
    // 一级弹框方法

    getDatafirst() { // 获取资产列表
      this.$axios.get('/api/MaintenancePlan/' + this.itemid + '/Items').then(res => {
        this.tableDatafirst = res.data
        this.totalCountfirst = res.totalCount
      })
    },
    getPagefirst(val) { // page事件
      // 展示条数
      this.tableDataSearchfirst.pageSize = val.limit
      // 页码
      this.tableDataSearchfirst.pageNumber = val.page
      // 调用获取数据
      this.$axios.get('/api/MaintenancePlan/' + this.itemid + '/Items', { params: this.tableDataSearchfirst }).then(res => {
        this.tableDatafirst = res.data
      })
    },
    handleChangefirst(val) {
      const arr = []
      val.forEach(item => {
        arr.push(item.id)
      })
      this.multiplefirst = arr
      console.log(this.multiplefirst)
    },

    removeEquip() { // 一级弹框中点删除
      if (this.multiplefirst === '') {
        this.$message.error('请至少选择一条数据')
      } else {
        this.removeVisible = true
      }
    },

    removeDatainfo() { // 删除弹框点确定
      this.removeVisible = true
      const itemIds = {
        itemIds: this.multiplefirst
      }
      this.$axios.delete('api/MaintenancePlan/' + this.itemid + '/Item', { data: itemIds }).then(res => {
        this.$message.success('删除成功')
        this.removeVisible = false
        // 清空选中值
        this.multiple = ''
        // 获取资产level列表
        this.getDatafirst()
      })
    },
    addAssets() { // 一级弹框中点添加资产
      // 获取位置数据
      // this.getpositionData()
      this.$axios.get('/api/Tree/Position').then(res => {
        this.positionTreeData = this.checkhasChildren(res)
        this.Visiblesecond = true
        // 获取资产level列表
        this.getDatasecond()
      })
    },
    //* *************************************************************************************************************** */
    // 二级弹框方法
    gettreeposition(arr) { // 遍历位置树，设置第一个可点positionId
      for (var item of arr) {
        if (item.children === undefined) {
          this.tableDataSearchsecond.positionId = item.id
          break
        } else {
          this.gettreeposition(item.children)
          break
        }
      }
    },
    getDatasecond() { // 获取列表
      // 遍历位置树，设置第一个可点positionId
      this.gettreeposition(this.positionTreeData)
      console.log(this.tableDataSearchsecond.positionId)
      this.$axios.get('/api/MaintenancePlan/Equipments', { params: this.tableDataSearchsecond }).then(res => {
        this.tableDatasecond = res.data
        this.totalCountsecond = res.totalCount
      })
    },
    getPagesecond(val) { // page事件
      // 展示条数
      this.tableDataSearchsecond.pageSize = val.limit
      // 页码
      this.tableDataSearchsecond.pageNumber = val.page
      // 调用获取数据
      this.$axios.get('/api/EquipmentList', { params: this.tableDataSearchsecond }).then(res => {
        this.tableDatasecond = res.data
      })
    },
    handleChangesecond(val) {
      const arr = []
      val.forEach(item => {
        arr.push(
          {
            equipmentId: item.equipment.id,
            modelId: item.model.id,
            brandId: item.brand.id
          }
        )
      })
      this.multiplesecond = arr
      console.log(this.multiplesecond)
    },
    creatlist() {
      if (this.multiplesecond.length === 0) {
        this.$message.error('请至少选择一条数据')
      } else {
        this.RepairRecord.equipmentIds = this.multiplesecond
        this.RepairRecord.positionId = this.tableDataSearchsecond.positionId
        this.RepairRecord.systemId = this.tableDataSearchsecond.systemId
        this.$axios.post('api/MaintenancePlan/' + this.itemid + '/Item', this.RepairRecord).then(res => {
          this.$message.success('添加成功')
          this.Visiblesecond = false
          // 刷新资产列表
          this.getDatafirst()
        })
      }
    }
  }
}
</script>
<style lang='scss' scoped>
.header {
  width: 100%;
}

.select {
  margin: 10px 0px;
  width: 39%;
  display: inline-block;
}
.toolsrt {
  width: 60%;
  display: inline-block;
  text-align: right;
  .el-input {
    width: 200px;
  }
}
.search {
  width: 450px;
  position: absolute;
  right: 0;
  z-index: 4;
}
.content {
  .el-table th,
  .el-table td {
    padding: 5px;
  }
}
.el-dialog__footer {
  text-align: center;
}
.selfstyle {
  .el-select {
    width: 100%;
  }
  .el-range-editor {
    width: 100%;
  }
}
.dialog-footer {
  display: block;
  width: 100%;
  text-align: center;
}
.el-input-number {
  width: 70%;
}
</style>

