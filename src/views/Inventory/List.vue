<!-- 资产清单管理页面 -->
<template>
  <div>
    <el-row>
      <el-col>
        <div class="panel">
          <div class="header">
            <h4>清单管理</h4>
            <div class="select">
              <el-button type="primary" size="small" @click="changeActiveVisible=true">生成设备清单</el-button>
              <el-button type="primary" size="small" @click="setvalid()">设置清单有效</el-button>
              <el-button type="danger" size="small" @click="deletelist()">删除设备清单</el-button>
            </div>
            <div class="tools">
              <el-button type="primary" plain size="small" @click="getData()">清单列表</el-button>
              <el-button type="primary" plain size="small" @click="getData('false')">未生效清单</el-button>
              <el-button type="primary" plain size="small" @click="getData('true')">已生效清单</el-button>
            </div>
            <div class="toolsrt">
              <el-form ref="form" :model="tableDataSearch">
                <el-select v-model="tableDataSearch.positionId" filterable placeholder="管理单位" size="small">
                  <el-option v-for="item in positionTreeData" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
                <el-select v-model="tableDataSearch.year" filterable placeholder="所属年度" size="small">
                  <el-option v-for="item in yearData" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
                <el-button type="primary" plain size="small" @click="getData()">查询</el-button>
              </el-form>
            </div>
          </div>
          <div class="content">
            <el-table :data="tableData" stripe border style="width: 100%" @selection-change="handleSelectionChange">
              <el-table-column type="selection" />
              <el-table-column label="版本号" prop="code">
                <template slot-scope="scope">
                  <el-button size="mini" type="text" @click="UpdateStage(scope.row)">{{ scope.row.code }}</el-button>
                </template>
              </el-table-column>
              <el-table-column prop="year" label="年份" />
              <el-table-column prop="position.name" label="管理单位" />
              <el-table-column prop="count" label="数量" />
              <el-table-column prop="createTime" label="生成时间" :formatter="formatterDate" />
              <el-table-column prop="valid" label="生效状态">
                <template slot-scope="scope">
                  {{ scope.row.status?'已生效':'未生效' }}
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button style="display:block;margin-left:0;margin-bottom:5px;" size="mini" type="primary" @click="UpdateStage(scope.row)">编辑</el-button>
                  <el-button style="display:block;margin-left:0;margin-bottom:5px;" size="mini" type="danger" @click="deletelist(scope.row)">删除</el-button>
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
            <!-- 生成新的设备清单 -->
            <el-dialog title="生成新的设备清单" :visible.sync="changeActiveVisible" :close-on-press-escape="false" :close-on-click-modal="false" width="450px">
              <el-form ref="form" :model="tableDatanew" label-width="120px">
                <el-form-item label="管理中心">
                  <el-select v-model="tableDatanew.positionId" clearable placeholder="管理中心" size="small">
                    <el-option v-for="item in positionTreeData" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                </el-form-item>
                <!-- <el-form-item label="设备清单编号">
                  <el-input v-model="tableDatanew.code" placeholder="设备清单编号" size="small" />
                </el-form-item> -->
                <el-form-item label="年份">
                  <el-select v-model="tableDatanew.year" filterable placeholder="年份" size="small">
                    <el-option v-for="item in yearData" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="creatlist">确 定</el-button>
                <el-button type="primary" @click="changeActiveVisible=false">取消</el-button>
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
      formSearchShow: false,
      removeQuestionVisible: false,
      changeActiveVisible: false,
      tableDataSearch: {
        positionId: '',
        year: '',
        valid: '',
        text: '', // 搜索文本
        pageSize: 10, // 展示条数
        pageNumber: 1// 页码
      },
      totalCount: 0, // 数据总条数
      tableData: [],
      tableDatanew: {},
      multipleSelection: '', // 表单选中行
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
    getpositionData() {
      // 获取安装位置
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
    getData(data) { // 获取清单列表
      if (data) {
        this.tableDataSearch.valid = data
      } else {
        this.tableDataSearch.valid = ''
      }
      this.$axios.get('/api/EquipmentList', { params: this.tableDataSearch }).then(res => {
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
      this.$axios.get('/api/EquipmentList', { params: this.tableDataSearch }).then(res => {
        this.tableData = res.data
      })
    },
    // 日期时间格式化
    formatterDate(row, column, cellValue) {
      if (cellValue !== null) {
        return this.$moment(cellValue).format('YYYY-MM-DD')
      } else {
        return cellValue
      }
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
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    showInfo(val) { // 点击详情按钮
      this.$router.push('/Inventory/Info/' + val.id)
    },
    UpdateStage(val) { // 点击编辑按钮
      this.$router.push('/Inventory/Update/' + val.id)
    },
    deleteManage(row) { // 点击删除按钮
      this.removeData = row
      this.removeQuestionVisible = true
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
  width: 49%;
  display: inline-block;
}
.toolsrt {
  width: 50%;
  display: inline-block;
  text-align: right;
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
.el-input {
  width: 70%;
}
</style>

