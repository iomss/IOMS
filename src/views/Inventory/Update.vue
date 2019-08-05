<!-- 设备管理页面 -->
<template>
  <div>
    <el-row>
      <el-col>
        <div class="panel">
          <div class="header">
            <h4>设备管理</h4>
            <div class="select">
              <el-button type="primary" @click="create()">新增设备</el-button>
              <el-button type="primary" @click="savelist()">保存设备清单</el-button>
              <el-button type="danger" @click="deletelist()">批量删除</el-button>
            </div>
            <div class="title">
              {{ title }}清单编号：{{ code }}
            </div>
          </div>
          <div class="content">
            <el-table :data="tableData" stripe border style="width: 100%" @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="40" />
              <el-table-column label="系统名称" prop="system">
                <template slot-scope="scope">
                  {{ scope.row.system.name }}
                </template>
              </el-table-column>
              <el-table-column prop="equipment" label="设备种类">
                <template slot-scope="scope">
                  {{ scope.row.equipment.name }}
                </template>
              </el-table-column>
              <el-table-column prop="inLiability" label="责任期内数量" />
              <el-table-column prop="outLiability" label="责任期外数量" />
              <el-table-column prop="count" label="设备小计" />
              <el-table-column prop="remark" label="备注" />
              <el-table-column prop="source" label="来源">
                <template slot-scope="scope">
                  {{ scope.row.source==='Automatic'?"自动汇总":"人工修订" }}
                </template>
              </el-table-column>
              <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                  <el-button style="display:block;margin-left:0;margin-bottom:5px;" size="mini" type="primary" @click="UpdateStage(scope.row)">编辑</el-button>
                  <el-button style="display:block;margin-left:0;margin-bottom:5px;" size="mini" type="danger" @click="deleteManage(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-dialog ref="removeData" title="提示" :close-on-press-escape="false" :close-on-click-modal="false" :visible.sync="removeQuestionVisible" width="220px">
              <span>您确定要删除此条数据？</span>
              <span slot="footer" class="dialog-footer">
                <el-button @click="removeQuestionVisible = false">取 消</el-button>
                <el-button type="primary" @click="removeQuestion">确 定</el-button>
              </span>
            </el-dialog>
            <el-dialog title="编辑设备清单" :visible.sync="changeActiveVisible" :close-on-press-escape="false" :close-on-click-modal="false" width="450px">
              <el-form ref="form" :model="formSearch" label-width="120px">
                <el-form-item label="系统名称">
                  <el-select v-model="formSearch.systemId" v-loadmore="loadMoresystem" filterable placeholder="系统名称" size="small">
                    <el-option v-for="item in systemData" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                </el-form-item>
                <el-form-item label="设备种类">
                  <el-select v-model="formSearch.equipmentId" v-loadmore="loadMoreequipment" filterable placeholder="设备种类" size="small">
                    <el-option v-for="item in equipmentData" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                </el-form-item>
                <el-form-item label="责任期内数量">
                  <el-input-number v-model="formSearch.inLiability" placeholder="责任期内数量" controls-position="right" :min="0" :max="2147483647" />
                </el-form-item>
                <el-form-item label="责任期外数量">
                  <el-input-number v-model="formSearch.outLiability" placeholder="责任期外数量" controls-position="right" :min="0" :max="2147483647" />
                </el-form-item>
                <el-form-item label="设备小计">
                  <el-input-number v-model="formSearch.count" placeholder="设备小计" controls-position="right" :min="0" :max="2147483647" />
                </el-form-item>
                <el-form-item label="来源">
                  <el-select v-model="formSearch.source" placeholder="请选择">
                    <el-option key="Manual" label="人工修订" value="Manual" />
                    <el-option key="Automatic" label="自动汇总" value="Automatic" />
                  </el-select>
                </el-form-item>
                <el-form-item label="备注">
                  <el-input v-model="formSearch.remark" placeholder="备注" size="small" />
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="updatedata()">确 定</el-button>
                <el-button type="primary" @click="changeActiveVisible=false">取消</el-button>
              </span>
            </el-dialog>
            <!--分页-->
            <pagination v-show="totalCount>0" :total="totalCount" :page.sync="formSearch.pageNumber" :limit.sync="formSearch.pageSize" @pagination="getPage" />
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
      searchData: {
        pageSize: 10, // 展示条数
        pageNumber: 1// 页码
      },
      formSearch: {
        systemId: '',
        equipmentId: '',
        inLiability: '',
        outLiability: '',
        count: '',
        source: '',
        remark: ''
      },
      tableData: [],
      totalCount: 0, // 数据总条数
      multipleSelection: '', // 表单选中行
      title: '',
      code: '',
      systemData: [], // 系统数据
      equipmentData: [], // 设备种类数据
      systempage: {// 所属系统分页
        pageNumber: 1,
        pageSize: 999999,
        pageCount: ''
      },
      equipmentpage: {// 资产类别分页
        pageNumber: 1,
        pageSize: 999999,
        pageCount: ''
      }
    }
  },
  computed: {},
  mounted() {
    this.getData()
    this.gettitle()
  },
  methods: {
    getData() {
      this.id = window.location.href.split('/')[window.location.href.split('/').length - 1]
      this.$axios.get('/api/EquipmentList/' + this.id + '/Items', { params: this.searchData }).then(res => {
        this.tableData = res.data
        this.totalCount = res.totalCount
      })
    },
    gettitle() {
      this.$axios.get('/api/EquipmentList/' + this.id).then(res => {
        this.title = res.position.name
        this.code = res.code
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
    getPage(val) { // page事件
      // 展示条数
      this.formSearch.pageSize = val.limit
      // 页码
      this.formSearch.pageNumber = val.page
      // 调用获取数据
      this.$axios.get('/api/EquipmentList/' + this.id + '/Items', { params: this.searchData }).then(res => {
        this.tableData = res.data
      })
    },
    create() {
      // 新增设备
    },
    savelist() {
      // 保存设备清单
    },
    deletelist() {
      // 删除设备清单
      if (this.multipleSelection === '') {
        this.$message.error('请至少选择一条数据')
      } else {
        this.removeQuestionVisible = true
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    UpdateStage(val) { // 点击编辑按钮
      // 获取下拉菜单数据
      this.getsystemData()
      this.getequipmentData()
      // 显示弹框
      this.changeActiveVisible = true
      console.log(val)
      this.formSearch = val
      this.formSearch.systemId = val.system.id
      this.formSearch.equipmentId = val.equipment.id
    },
    updatedata() {
      // 编辑弹框关闭
      this.changeActiveVisible = false
      // 列表数据刷新
      this.$axios.put('/api/EquipmentList/' + this.id + '/Item/' + this.formSearch.id, { params: this.formSearch }).then(res => {
        this.$message.success('更新成功')
        this.getData()
      })
    },
    deleteManage(row) { // 点击删除按钮
      this.removeData = row
      this.removeQuestionVisible = true
    },
    // 删除试题
    removeQuestion() {
      // const _this = this
      // this.$ajax.delete('/api/services/app/Question/DeleteClozeQuestion?Id=' + this.removeData.id).then(response => {
      //   if (response.data.success) {
      //     let index = _this.tableData.indexOf(_this.removeData)
      //     _this.tableData.splice(index, 1)
      //     _this.$message.success('删除成功')
      //     _this.removeQuestionVisible = false
      //   } else {
      //     _this.$message.error(response.data.error.message)
      //   }
      // })
    }
  }
}
</script>
<style lang='scss' scoped>
.header {
  width: 100%;
}

.title {
  margin: 10px 0px;
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
</style>

