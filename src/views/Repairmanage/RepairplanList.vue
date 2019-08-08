<!-- 资产清单管理页面 -->
<template>
  <div>
    <el-row>
      <el-col>
        <div class="panel">
          <div class="header">
            <div class="select">
              <el-button type="primary" size="small" @click="Visible=true">新增计划</el-button>
              <el-button type="primary" size="small" @click="setvalid()">导出计划</el-button>
              <el-button type="success" size="small" @click="deletelist()">编辑</el-button>
              <el-button type="danger" size="small" @click="deletelist()">删除</el-button>
            </div>
            <div class="toolsrt">
              <el-form ref="form" :model="tableDataSearch">
                <el-select v-model="tableDataSearch.positionId" filterable placeholder="开始时间" size="small">
                  <el-option v-for="item in positionTreeData" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
                <el-select v-model="tableDataSearch.year" filterable placeholder="结束时间" size="small">
                  <el-option v-for="item in yearData" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
                <el-input v-model="tableDataSearch.text" placeholder="全局搜索" size="small" />
                <el-button type="primary" plain size="small" @click="getData()">查询</el-button>
              </el-form>
            </div>
          </div>
          <div class="content">
            <el-table :data="tableData" stripe border style="width: 100%" @selection-change="handleChange">
              <el-table-column type="selection" />
              <el-table-column label="完成状态" prop="code">
                <template slot-scope="scope">
                  <el-button size="mini" type="text" @click="showInfo(scope.row)">{{ scope.row.code }}</el-button>
                </template>
              </el-table-column>
              <el-table-column prop="year" label="维护计划名名称" />
              <el-table-column prop="position.name" label="起止时间" />
              <el-table-column prop="count" label="负责人" />
              <el-table-column prop="createTime" label="执行人" :formatter="formatterDate" />
              <el-table-column prop="valid" label="关联资产数">
                <template slot-scope="scope">
                  {{ scope.row.status?'已生效':'未生效' }}
                </template>
              </el-table-column>
              <el-table-column prop="cyclic" label="维护频率">
                <template slot-scope="scope">
                  {{ scope.row.cyclic=='Day'?'每天':scope.row.cyclic=='Week'?'每周':scope.row.cyclic=='Month'?'每月':'每年' }}
                </template>
              </el-table-column>
              <el-table-column prop="createTime" label="录入日期" :formatter="formatterDate" />
              <el-table-column prop="valid" label="录入人">
                <template slot-scope="scope">
                  {{ scope.row.status?'已生效':'未生效' }}
                </template>
              </el-table-column>
              <el-table-column prop="count" label="验收人" />
              <el-table-column prop="createTime" label="验收时间" :formatter="formatterDate" />
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button size="mini" type="primary" style="margin:2px 5px" @click="UpdateStage(scope.row)">编辑计划</el-button>
                  <el-button type="primary" size="mini" style="margin:2px 5px" @click="Visiblefirst=true">管理资产</el-button>
                  <el-button size="mini" type="danger" style="margin:2px 5px" @click="deletelist(scope.row)">删除</el-button>
                </template>
              </el-table-column>
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
            <el-dialog :title="title" :visible.sync="Visible" :close-on-press-escape="false" :close-on-click-modal="false" width="1200px">
              <el-form ref="form" :model="tableDatanewfirst" label-width="120px">
                <el-row class="selfstyle">
                  <el-col :span="12">
                    <el-form-item label="计划名称" prop="name">
                      <el-input v-model="tableDatanewfirst.name" placeholder="计划名称" size="small" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="所属系统" prop="">
                      <el-select v-model="tableDatanewfirst.positionId" clearable placeholder="所属系统" size="small">
                        <el-option v-for="item in positionTreeData" :key="item.id" :label="item.name" :value="item.id" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="起止时间" prop="">
                      <el-date-picker v-model="tableDatanewfirst.time" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="维护频率" prop="">
                      <el-select v-model="tableDatanewfirst.year" filterable placeholder="维护频率" size="small">
                        <el-option v-for="item in yearData" :key="item.id" :label="item.name" :value="item.id" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="抽检率" prop="">
                      <el-select v-model="tableDatanewfirst.year" filterable placeholder="抽检率" size="small">
                        <el-option v-for="item in yearData" :key="item.id" :label="item.name" :value="item.id" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="责任人" prop="">
                      <el-input v-model="tableDatanewfirst.code" placeholder="责任人" size="small" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="执行人" prop="">
                      <el-input v-model="tableDatanewfirst.code" placeholder="执行人" size="small" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item>
                      <el-button type="primary" size="small" icon="el-icon-search" @click="create()">保存</el-button>
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
                      <el-input v-model="tableDatanewfirst.name" placeholder="计划名称" size="small" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="所属系统" prop="">
                      <el-select v-model="tableDatanewfirst.positionId" clearable placeholder="所属系统" size="small">
                        <el-option v-for="item in positionTreeData" :key="item.id" :label="item.name" :value="item.id" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="起止时间" prop="">
                      <el-date-picker v-model="tableDatanewfirst.time" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="维护频率" prop="">
                      <el-select v-model="tableDatanewfirst.year" filterable placeholder="维护频率" size="small">
                        <el-option v-for="item in yearData" :key="item.id" :label="item.name" :value="item.id" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="抽检率" prop="">
                      <el-select v-model="tableDatanewfirst.year" filterable placeholder="抽检率" size="small">
                        <el-option v-for="item in yearData" :key="item.id" :label="item.name" :value="item.id" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="责任人" prop="">
                      <el-input v-model="tableDatanewfirst.code" placeholder="责任人" size="small" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="执行人" prop="">
                      <el-input v-model="tableDatanewfirst.code" placeholder="执行人" size="small" />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
              <div class="header">
                <div class="select">
                  <el-button type="primary" size="small" @click="Visiblesecond=true">添加资产</el-button>
                  <el-button type="primary" size="small" @click="removeEquip()">移除资产</el-button>
                </div>
              </div>
              <el-table :data="tableDatafirst" stripe border style="width: 100%" @selection-change="handleChangefirst">
                <el-table-column type="selection" />
                <el-table-column label="资产名称" prop="name" />
                <el-table-column prop="brand" label="品牌" />
                <el-table-column prop="model" label="型号" />
                <el-table-column prop="count" label="数量" />
                <el-table-column prop="createTime" label="一级" />
                <el-table-column prop="count" label="二级" />
                <el-table-column prop="createTime" label="三级" />
                <el-table-column prop="valid" label="四级" />
                <el-table-column prop="count" label="五级" />
              </el-table>
              <!--分页-->
              <pagination v-show="totalCountfirst>0" :total="totalCountfirst" :page.sync="tableDataSearchfirst.pageNumber" :limit.sync="tableDataSearchfirst.pageSize" @pagination="getPagefirst" />
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="creatlist">保存</el-button>
                <el-button type="success" @click="Visiblefirst=false">取消</el-button>
              </span>
            </el-dialog>
            <!-- 一级弹框结束**************************************************************** -->
            <!-- 二级弹框开始**************************************************************** -->
            <el-dialog title="新增资产" :visible.sync="Visiblesecond" :close-on-press-escape="false" :close-on-click-modal="false" width="1200px">
              <div class="header">
                <div class="toolsrt">
                  <el-form ref="form" :model="tableDataSearchsecond">
                    <el-select v-model="tableDataSearchsecond.positionId" filterable placeholder="位置" size="small">
                      <el-option v-for="item in positionTreeData" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
                    <el-select v-model="tableDataSearchsecond.year" filterable placeholder="所属系统" size="small">
                      <el-option v-for="item in yearData" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
                    <el-input v-model="tableDataSearchsecond.text" placeholder="关键字模糊查询" size="small" />
                    <el-button type="primary" plain size="small" @click="getData()">查询</el-button>
                  </el-form>
                </div>
              </div>
              <el-table :data="tableDatasecond" stripe border style="width: 100%" @selection-change="handleChangesecond">
                <el-table-column type="selection" />
                <el-table-column label="资产名称" prop="name" />
                <el-table-column prop="brand" label="品牌" />
                <el-table-column prop="model" label="型号" />
                <el-table-column prop="count" label="数量" />
              </el-table>
              <!--分页-->
              <pagination v-show="totalCountsecond>0" :total="totalCountsecond" :page.sync="tableDataSearchsecond.pageNumber" :limit.sync="tableDataSearchsecond.pageSize" @pagination="getPagesecond" />
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="creatlist">保存</el-button>
                <el-button type="primary" @click="Visiblesecond=false">取消</el-button>
              </span>
            </el-dialog>
            <!-- 二级弹框结束**************************************************************** -->
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
      title: '新增计划',
      formSearchShow: false,
      removeQuestionVisible: false,
      Visible: false, // 新增计划弹框
      Visiblefirst: false, // 一级弹框隐藏
      Visiblesecond: false, // 二级弹框隐藏
      tableDataSearch: {
        positionId: '',
        year: '',
        valid: '',
        text: '', // 搜索文本
        pageSize: 10, // 展示条数
        pageNumber: 1// 页码
      },
      tableDataSearchfirst: {// 一级弹框搜索
        pageSize: 10, // 展示条数
        pageNumber: 1// 页码
      },
      tableDataSearchsecond: {// 二级弹框搜索
        pageSize: 10, // 展示条数
        pageNumber: 1// 页码
      },
      totalCount: 0, // 数据总条数
      totalCountfirst: 0, // 数据总条数
      totalCountsecond: 0, // 数据总条数
      tableData: [],
      tableDatafirst: [], // 一级弹框表单数据
      tableDatasecond: [], // 二级弹框表单数据
      tableDatanew: {},
      tableDatanewfirst: {}, // 一级弹框搜索
      multiple: '', // 表单选中行
      multiplefirst: '', // 一级弹框表单选中行
      multiplesecond: '', // 二级弹框表单选中行
      yearData: [],
      positionTreeData: []
    }
  },
  computed: {},
  mounted() {
    this.getData()
    // 获取查询项下拉菜单数据
    this.getyearData()
    this.getpositionData()
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
    //* ******************************************************************************************************* */
    // 下拉菜单数据
    getpositionData() { // 获取安装位置
      this.$axios.get('/api/Meta/Position?secondThird=true').then(res => {
        this.positionTreeData = res.data
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

    //* ******************************************************************************************************* */
    // 列表数据

    getData(data) { // 获取清单列表
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

    creatlist() {
      // 生成设备清单
      this.$axios.post('/api/EquipmentList/', this.tableDatanew).then(res => {
        this.tableData = res.data
        this.changeActiveVisible = false
        // 刷新数据
        this.getData()
      })
    },
    setvalid() {
      // 设置清单有效
      if (this.multipleSelection === '') {
        this.$message.error('请至少选择一条数据')
      } else {
        this.$axios.post('/api/EquipmentList/' + this.multipleSelection[0].id + '/Valid').then(res => {
          this.tableData = res.data
        })
      }
    },
    deletelist(data) {
      // 删除设备清单
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
    showInfo(val) { // 点击详情按钮
      this.Visible = true
      this.title = '计划详情'
    },
    UpdateStage(val) { // 点击编辑按钮
      this.Visible = true
      this.title = '编辑计划'
      // 传计划id数据
    },
    removeEquip() { // 一级弹框中点删除

    },
    //* *************************************************************************************************************** */
    // 新增计划弹框方法

    create() {
      this.Visible = false
    },
    cancel() {
      this.Visible = false
    },
    //* *************************************************************************************************************** */
    // 一级弹框方法

    getDatafirst(data) { // 获取清单列表
      if (data) {
        this.tableDataSearchfirst.valid = data
      } else {
        this.tableDataSearchfirst.valid = ''
      }
      this.$axios.get('/api/EquipmentList', { params: this.tableDataSearchfirst }).then(res => {
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
      this.$axios.get('/api/EquipmentList', { params: this.tableDataSearchfirst }).then(res => {
        this.tableDatafirst = res.data
      })
    },
    handleChangefirst(val) {
      this.multiplefirst = val
    },

    //* *************************************************************************************************************** */
    // 二级弹框方法

    getDatasecond(data) { // 获取清单列表
      if (data) {
        this.tableDataSearchsecond.valid = data
      } else {
        this.tableDataSearchsecond.valid = ''
      }
      this.$axios.get('/api/EquipmentList', { params: this.tableDataSearchsecond }).then(res => {
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
      this.multiplesecond = val
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

