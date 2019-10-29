<!-- 维护任务页面 -->
<template>
  <div>
    <el-row>
      <el-col>
        <div class="panel">
          <div class="header">
            <div class="select">
              <el-button type="primary" size="small" @click="selectstate('')">任务列表</el-button>
              <el-button type="primary" size="small" @click="selectstate('Review')">待验收</el-button>
              <el-button type="primary" size="small" @click="selectstate('Excute')">已完成</el-button>
              <el-button type="primary" size="small" @click="selectstate('Plan')">未完成</el-button>
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
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button :key="scope.row.code" size="mini" type="primary" @click="showInfo(scope.row)">维护记录</el-button>
                </template>
              </el-table-column>
              <el-table-column label="完成状态" prop="planState">
                <template slot-scope="scope">
                  {{ scope.row.planState==='Plan'?'计划':scope.row.planState==='Excute'?'执行':scope.row.planState==='Review'?'待验收':scope.row.planState==='Done'?'计划结束':'验收不通过' }}
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
              <el-table-column prop="reviewUser" label="验收人">
                <template slot-scope="scope">
                  {{ scope.row.reviewUser===null?'':scope.row.reviewUser.name }}
                </template>
              </el-table-column>
              <el-table-column prop="reviewComment" label="验收意见" />
              <el-table-column prop="reviewTime" label="验收时间" :formatter="formatterDate" />

            </el-table>
            <!--分页-->
            <pagination v-show="totalCount>0" :total="totalCount" :page.sync="tableDataSearch.pageNumber" :limit.sync="tableDataSearch.pageSize" @pagination="getPage" />
            <!-- 删除 -->
            <el-dialog ref="removeData" title="提示" :close-on-press-escape="false" :close-on-click-modal="false" :visible.sync="removeQuestionVisible" width="220px">
              <span>您确定要删除此条数据？</span>
              <span slot="footer" class="dialog-footer">
                <el-button @click="removeQuestionVisible = false">取 消</el-button>
                <el-button type="primary" @click="deletelist">确 定</el-button>
              </span>
            </el-dialog>
            <!-- 生成新的计划-->
            <!-- 一级弹框开始******************************************************* -->
            <el-dialog title="维护任务详情" :visible.sync="Visiblefirst" :close-on-press-escape="false" :close-on-click-modal="false" width="1200px">
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
              <el-table :data="tableDatafirst" stripe border style="width: 100%">
                <el-table-column type="index" label="序号" />
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button :key="scope.row.code" size="mini" type="primary" @click="showsecond(scope.row.id)">维护记录</el-button>
                  </template>
                </el-table-column>
                <el-table-column label="维护状态" prop="planState">
                  <template slot-scope="scope">
                    {{ scope.row.planState==='Plan'?'计划':scope.row.planState==='Excute'?'执行':scope.row.planState==='Review'?'待验收':'计划结束' }}
                  </template>
                </el-table-column>
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
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="creatchecklist">提交验收</el-button>
                <el-button type="success" @click="Visiblefirst=false">取消</el-button>
              </span>
            </el-dialog>
            <!-- 一级弹框结束**************************************************************** -->
            <!-- 二级弹框开始**************************************************************** -->
            <el-dialog title="维护任务资产明细" :visible.sync="Visiblesecond" :close-on-press-escape="false" :close-on-click-modal="false" width="1200px">
              <div class="header">
                <el-button type="primary" size="small" @click="showthird()">添加维护记录</el-button>
              </div>
              <el-table :data="tableDatasecond" stripe border style="width: 100%" @selection-change="handleChangesecond">
                <el-table-column type="selection" />
                <el-table-column prop="done" label="维护状态">
                  <template slot-scope="scope">
                    {{ scope.row.done?'已完成':'未完成' }}
                  </template>
                </el-table-column>
                <el-table-column prop="equipment" label="资产名称">
                  <template slot-scope="scope">
                    {{ scope.row.asset.equipment.name }}
                  </template>
                </el-table-column>
                <el-table-column prop="position" label="安装位置">
                  <template slot-scope="scope">
                    {{ scope.row.asset.position.name }}
                  </template>
                </el-table-column>
                <el-table-column prop="brand" label="品牌">
                  <template slot-scope="scope">
                    {{ scope.row.asset.brand.name }}
                  </template>
                </el-table-column>
                <el-table-column prop="model" label="型号">
                  <template slot-scope="scope">
                    {{ scope.row.asset.model.name }}
                  </template>
                </el-table-column>
                <el-table-column prop="code" label="资产编码">
                  <template slot-scope="scope">
                    {{ scope.row.asset.code }}
                  </template>
                </el-table-column>
                <el-table-column prop="maintenanceTime" label="维护时间" :formatter="formatterDatethird" />
                <el-table-column prop="maintenanceDescription" label="维护情况" />
                <el-table-column prop="maintenanceUser" label="维护人">
                  <template slot-scope="scope">
                    {{ scope.row.maintenanceUser===null?'':scope.row.maintenanceUser.name }}
                  </template>
                </el-table-column>
              </el-table>
              <!--分页-->
              <pagination v-show="totalCountsecond>0" :total="totalCountsecond" :page.sync="tableDataSearchsecond.pageNumber" :limit.sync="tableDataSearchsecond.pageSize" @pagination="getPagesecond" />
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="closesecond()">关闭</el-button>
              </span>
            </el-dialog>
            <!-- 二级弹框结束**************************************************************** -->
            <!-- 三级弹框开始**************************************************************** -->
            <el-dialog title="录入维护记录" :visible.sync="Visiblethird" :close-on-press-escape="false" :close-on-click-modal="false" width="600px">
              <el-form ref="form" :model="tableDatathird" label-width="90px">
                <el-form-item prop="maintenanceUserName" label="维护人">
                  <el-input v-model="tableDatathird.maintenanceUserName" disabled placeholder="维护人" size="small" />
                </el-form-item>
                <el-form-item prop="maintenanceTime" label="维护时间">
                  <el-date-picker v-model="tableDatathird.maintenanceTime" type="datetime" placeholder="维护时间" :formatter="formatterDatethird" style="width:100%;" />
                </el-form-item>
                <el-form-item prop="stage" label="维护等级">
                  <el-checkbox-group v-model="tableDatathird.stage">
                    <el-checkbox key="1" val="1" label="1" disabled>一级</el-checkbox>
                    <el-checkbox key="2" val="2" label="2" disabled>二级</el-checkbox>
                    <el-checkbox key="3" val="2" label="3" disabled>三级</el-checkbox>
                    <el-checkbox key="4" val="4" label="4" disabled>四级</el-checkbox>
                    <el-checkbox key="5" val="5" label="5" disabled>五级</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item prop="maintenanceDescription" label="维护情况">
                  <el-input v-model="tableDatathird.maintenanceDescription" type="textarea" :rows="2" placeholder="维护情况" size="small" />
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="saveData">保存</el-button>
                <el-button type="primary" @click="Visiblethird=false">关闭</el-button>
              </span>
            </el-dialog>
            <!-- 三级弹框结束**************************************************************** -->
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import pagination from '@/components/Pagination'
export default {
  components: {
    pagination
  },
  data() {
    return {
      dangqianUser: {// 当前登陆用户
        userName: this.$cookie.get('trueName'),
        id: this.$cookie.get('id')
      },
      formSearchShow: false,
      removeQuestionVisible: false,
      Visiblefirst: false, // 一级弹框隐藏
      Visiblesecond: false, // 二级弹框隐藏
      Visiblethird: false, // 三级弹框隐藏
      tableDataSearch: {
        planState: 'Plan', // 状态
        start: '', // 开始时间
        end: '', // 结束时间
        text: '', // 搜索文本
        pageSize: 10, // 展示条数
        pageNumber: 1// 页码
      },
      tableDataSearchfirst: {// 一级弹框搜索
        pageSize: 10, // 展示条数
        pageNumber: 1// 页码
      },
      tableDataSearchsecond: {// 二级弹框搜索
        pageSize: 50, // 展示条数
        pageNumber: 1// 页码
      },
      totalCount: 0, // 数据总条数
      totalCountfirst: 0, // 数据总条数
      totalCountsecond: 0, // 数据总条数
      tableData: [],
      tableDatafirst: [], // 一级弹框表单数据
      tableDatasecond: [], // 二级弹框表单数据
      tableDatathird: { // 三级弹框表单数据
        stage: [],
        maintenanceDescription: '',
        maintenanceTime: '',
        maintenanceUserName: ''
      },
      tableDatanew: {},
      tableDatanewfirst: {}, // 一级弹框搜索
      multiple: '', // 表单选中行
      multiplefirst: '', // 一级弹框表单选中行
      multiplesecond: '', // 二级弹框表单选中行
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
      positionTreeData: [],
      itemid: '', // 计划子项id
      itemidfirst: '', // 一级弹框数据id
      startdateData: [],
      enddateData: [],
      addrecordidarr: [] // 三级弹框添加维护记录数组
    }
  },
  computed: {},
  mounted() {
    this.getData()
    // 获取查询项下拉菜单数据
    this.getyearData()
    this.getpositionData()
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
    formatterDatethird(row, column, cellValue) { // 日期时间格式化
      if (cellValue !== null) {
        return this.$moment(cellValue).format('YYYY-MM-DD HH:mm')
      } else {
        return cellValue
      }
    },
    //* ******************************************************************************************************* */
    // 下拉菜单数据
    getpositionData() { // 获取安装位置
      this.$axios.get('/api/Meta/Position?secondThird=true').then(res => {
        this.positionTreeData = res.data
      })
    },
    getDates() { // 获取列表
      this.$axios.get('/api/MaintenancePlan/Dates').then(res => {
        this.startdateData = res.startDates
        this.enddateData = res.endDates
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
      console.log(this.yearData)
    },
    selectstate(data) { // 列表筛选
      if (data === '') {
        this.tableDataSearch.planState = null
      } else {
        this.tableDataSearch.planState = data
      }
      this.getData()
    },
    //* ******************************************************************************************************* */
    // 列表数据

    getData() { // 获取列表
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
    setvalid() {
      // 设置有效
      if (this.multipleSelection === '') {
        this.$message.error('请至少选择一条数据')
      } else {
        this.$axios.post('/api/EquipmentList/' + this.multipleSelection[0].id + '/Valid').then(res => {
          this.tableData = res.data
        })
      }
    },
    deletelist(data) {
      // 删除设备
      if (data) {
        this.removeQuestionVisible = true
        this.$axios.delete('/api/EquipmentList/' + data.id).then(res => {
          this.removeQuestionVisible = false
        })
      } else {
        if (this.multipleSelection === '') {
          this.$message.error('请至少选择一条数据')
        } else {
          this.removeQuestionVisible = true
          this.$axios.delete('/api/EquipmentList/' + this.multipleSelection[0].id).then(res => {
            this.removeQuestionVisible = false
          })
        }
      }
    },
    handleChange(val) {
      this.multiple = val
    },
    showInfo(row) { // 点击详情按钮
      this.title = '计划详情'
      // 判断当前按选中值是否存在，不存在插入
      let hasSystemData = false
      this.systemData.forEach(item => { item.id === row.system.id ? hasSystemData = true : '' })
      hasSystemData ? '' : this.systemData.push(row.system)
      // 赋值
      this.tableDatanewfirst.daterange = [row.start, row.end]
      this.tableDatanewfirst.name = row.name
      this.tableDatanewfirst.systemId = row.systemId
      this.tableDatanewfirst.cyclic = row.cyclic
      this.tableDatanewfirst.samplingRate = row.samplingRate
      this.tableDatanewfirst.responsibleUser = row.responsibleUser
      this.tableDatanewfirst.excuteUser = row.excuteUser
      // 显示弹框
      this.itemid = row.id
      this.Visiblefirst = true
      this.getDatafirst()
    },
    UpdateStage(val) { // 点击编辑按钮
      this.$router.push('/Inventory/Update/' + val.id)
    },
    removeEquip() { // 一级弹框中点删除

    },

    //* *************************************************************************************************************** */
    // 一级弹框方法

    getDatafirst(data) { // 获取列表
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
      this.$axios.get('/api/MaintenancePlan' + this.itemid + '/Items', { params: this.tableDataSearchfirst }).then(res => {
        this.tableDatafirst = res.data
      })
    },
    creatchecklist() { // 提交验收方法
      this.$axios.post('/api/MaintenancePlan/' + this.itemid + '/Submit').then(res => {
        if (res.success) {
          this.$message.success('提交验收成功')
          // 关闭一级弹框
          this.Visiblefirst = false
          // 刷新列表数据
          this.getData()
        } else {
          this.$message.error(res.message)
        }
      })
    },
    showsecond(id) {
      // 点击一级弹框维修记录
      // 获取列表
      this.itemidfirst = id
      this.$axios.get('/api/MaintenancePlan/' + this.itemid + '/' + this.itemidfirst + '/ItemRecords', { params: this.tableDataSearchsecond }).then(res => {
        this.tableDatasecond = res.data
        // 打开二级弹框
        this.Visiblesecond = true
        this.totalCountsecond = res.totalCount
      })
    },

    //* *************************************************************************************************************** */
    // 二级弹框方法
    getPagesecond(val) { // page事件
      // 展示条数
      this.tableDataSearchsecond.pageSize = val.limit
      // 页码
      this.tableDataSearchsecond.pageNumber = val.page
      // 调用获取数据
      this.$axios.get('/api/MaintenancePlan/' + this.itemid + '/' + this.itemidfirst + '/ItemRecords', { params: this.tableDataSearchsecond }).then(res => {
        this.tableDatasecond = res.data
        this.totalCountsecond = res.totalCount
      })
    },
    handleChangesecond(val) {
      this.multiplesecond = val
    },
    showthird() { // 二级弹框点添加维修记录
      if (this.multiplesecond === '') {
        this.$message.error('请至少选择一条数据')
      } else {
        const arr = []
        this.multiplesecond.forEach(item => {
          arr.push(item.assetId)
        })
        this.addrecordidarr = arr
        console.log(this.addrecordidarr)
        // 打开三级弹框
        this.Visiblethird = true
        // 三级弹框添加维护级别选中
        this.getstage()
        // 设置维护人为当前登录人
        this.tableDatathird.maintenanceUserName = this.dangqianUser.userName
        this.tableDatathird.maintenanceUserId = this.dangqianUser.id
      }
    },
    closesecond() { // 二级弹框中点击关闭
      this.Visiblesecond = false
      // 刷新一级弹框数据
      this.getDatafirst()
    },
    //* *************************************************************************************************************** */
    // 三级弹框方法
    getstage() {
      this.$axios.get('/api/MaintenancePlan/item/' + this.itemidfirst).then(res => {
        if (res.level1 !== 0) {
          this.tableDatathird.stage.push('1')
        }
        if (res.level2 !== 0) {
          this.tableDatathird.stage.push('2')
        }
        if (res.level3 !== 0) {
          this.tableDatathird.stage.push('3')
        }
        if (res.level4 !== 0) {
          this.tableDatathird.stage.push('4')
        }
        if (res.level5 !== 0) {
          this.tableDatathird.stage.push('5')
        }
      })
    },
    saveData() { // 添加维护记录
      this.tableDatathird.AssetIds = this.addrecordidarr
      this.tableDatathird.maintenanceTime = this.$moment(this.tableDatathird.maintenanceTime).format('YYYY-MM-DD HH:mm')
      this.$axios.post('/api/MaintenancePlan/' + this.itemidfirst + '/ItemRecord', this.tableDatathird).then(res => {
        this.$message.success('添加成功')
        // 关闭三级弹框
        this.Visiblethird = false
        // 刷新二级弹框数据
        this.showsecond(this.itemidfirst)
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
</style>

