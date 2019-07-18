<!-- 资产管理页面 -->
<template>
  <div>
    <el-row>
      <el-col>
        <div class="panel">
          <div class="header">
            <h4>资产管理</h4>
            <div class="select">
              <el-button type="primary" plain size="small" @click="selectstate(0)">资产列表</el-button>
              <el-button type="primary" plain size="small" @click="selectstate(1)">在用资产</el-button>
              <el-button type="primary" plain size="small" @click="selectstate(2)">闲置资产</el-button>
              <el-button type="primary" plain size="small" @click="selectstate(3)">报废资产</el-button>
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
                  <el-dropdown-item>导出全部</el-dropdown-item>
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
              <el-form ref="form" :model="formSearch" label-width="90px">
                <el-select v-model="formSearch.unit" clearable placeholder="使用单位" size="small">
                  <el-option key="1" label="单选" value="1" />
                  <el-option key="2" label="多选" value="2" />
                </el-select>
                <el-select v-model="formSearch.position" clearale placeholder="安装位置" size="small">
                  <el-option key="0" label="0" value="0" />
                  <el-option key="1" label="1" value="1" />
                </el-select>
                <el-select v-model="formSearch.sort" clearable placeholder="资产类别" size="small">
                  <el-option key="1" label="已发布" value="true" />
                  <el-option key="2" label="未发布" value="false" />
                </el-select>
                <el-select v-model="formSearch.owner" clearable placeholder="所属系统" size="small">
                  <el-option key="1" label="启用" value="true" />
                  <el-option key="2" label="禁用" value="false" />
                </el-select>
                <el-select v-model="formSearch.starttime" clearable placeholder="投用开始时间" size="small">
                  <el-option key="1" label="已发布" value="true" />
                  <el-option key="2" label="未发布" value="false" />
                </el-select>
                <el-select v-model="formSearch.endtime" clearable placeholder="投用截止时间" size="small">
                  <el-option key="1" label="启用" value="true" />
                  <el-option key="2" label="禁用" value="false" />
                </el-select>
                <el-select v-model="formSearch.source" clearable placeholder="资产来源" size="small">
                  <el-option key="1" label="已发布" value="true" />
                  <el-option key="2" label="未发布" value="false" />
                </el-select>
                <el-select v-model="formSearch.age" clearable placeholder="寿命状态" size="small">
                  <el-option key="1" label="启用" value="true" />
                  <el-option key="2" label="禁用" value="false" />
                </el-select>
                <el-input v-model="formSearch.brand" placeholder="品牌" size="small" />
                <el-input v-model="formSearch.Model" placeholder="型号" size="small" />
                <el-form-item style="margin-bottom:0">
                  <el-button type="primary" size="small" icon="el-icon-search" @click="initData(formSearch.pageNumber)">查询</el-button>
                  <el-button size="small" icon="el-icon-close" @click="formSearchShow=false">取消</el-button>
                </el-form-item>
              </el-form>
            </el-card>
          </div>
          <!--表格-->
          <div class="content">
            <el-table :data="tableData" stripe border style="width: 100%" @sort-change="sortasstes" @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="40" />
              <el-table-column prop="id" label="序号" sortable="custom" width="80" />
              <el-table-column prop="state" label="状态" sortable="custom" width="100">
                <template slot-scope="scope">
                  {{ scope.row.state==='Normal'?"正常":scope.row.state==='Using'?"使用中":"故障" }}
                </template>
              </el-table-column>
              <el-table-column prop="code" label="资产编码" sortable="custom" width="110" />
              <el-table-column prop="equipment.equimentType.name" label="资产类别" sortable="custom" width="110" />
              <el-table-column prop="alias" label="资产名称" sortable="custom" width="110" />
              <el-table-column prop="brand.name" label="品牌" sortable="custom" width="90" />
              <el-table-column prop="model.name" label="型号" sortable="custom" width="120" />
              <el-table-column prop="parentSystem" label="所属系统" sortable="custom" width="120" />
              <el-table-column prop="system.name" label="所属子系统" sortable="custom" width="140" />
              <el-table-column prop="position.name" label="安装位置" sortable="custom" width="110" />
              <el-table-column prop="enableTime" label="投用时间" sortable="custom" width="110" />
              <el-table-column prop="handoverDate" label="交工时间" sortable="custom" width="110" />
              <el-table-column prop="purchaseYear" label="购置年份" sortable="custom" width="110" />
              <el-table-column prop="original" label="资产原值" sortable="custom" width="110" />
              <el-table-column prop="source.name" label="增加方式" sortable="custom" width="110" />
              <el-table-column prop="si.name" label="集成商" sortable="custom" width="150" />
              <el-table-column prop="recordUser" label="录入人" sortable="custom" width="100" />
              <el-table-column prop="lastUpdateTime" label="更新时间" sortable="custom" width="110" />
              <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                  <el-button style="display:block;margin-left:0;margin-bottom:5px;" size="mini" type="primary" @click="UpdateStage(scope.row)">编辑</el-button>
                  <el-button style="display:block;margin-left:0;margin-bottom:5px;" size="mini" type="danger" @click="deleteManage(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!--分页-->
            <pagination v-show="totalCount>0" :total="totalCount" :page.sync="formSearch.pageSize" :limit.sync="formSearch.pageNumber" @pagination="getPage" />
            <!--删除-->
            <el-dialog ref="removeData" title="提示" :close-on-press-escape="false" :close-on-click-modal="false" :visible.sync="removeQuestionVisible" width="220px">
              <span>您确定要删除此条数据？</span>
              <span slot="footer" class="dialog-footer">
                <el-button @click="removeQuestionVisible = false">取 消</el-button>
                <el-button type="primary" @click="removeQuestion">确 定</el-button>
              </span>
            </el-dialog>
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
      formSearchShow: false, // 高级搜索弹框隐藏
      removeQuestionVisible: false, // 删除弹框隐藏
      formSearch: {
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
      tableData: [], // 表格数据
      multipleSelection: '', // 表单选中行
      removeData: null, // 当前表单所选删除行
      tableDataSearch: {
        orderBy: '', // 排序字段
        desc: undefined, // 倒叙  是否
        text: '', // 搜索文本
        pageSize: 20, // 展示条数
        pageNumber: 1// 页码
      },
      totalCount: 0 // 数据总条数
    }
  },
  computed: {},
  mounted() {
    this.getData()
  },
  methods: {
    sortasstes(column) {
      this.tableDataSearch.orderBy = column.prop
      this.tableDataSearch.desc = column.order === 'descending'
      this.getData()
    },
    getData() { // 获取数据
      console.log(this.tableDataSearch.text)
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
      console.log(data)
    },
    handleClick(e) { // 导入导出选择事件
      console.log(e)
    },
    Import() { // 导入方法

    },
    export() { // 导出方法

    },
    searchData() {
      // 全局查询方法
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    UpdateStage(val) { // 点击编辑按钮
      console.log(val.id)
      this.$router.push('/assets/Info/' + val.id)
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
      this.getData()
    }
  }
}
</script>
<style lang='scss' scoped>
.header {
  width: 100%;
  height: 64px;
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
</style>
