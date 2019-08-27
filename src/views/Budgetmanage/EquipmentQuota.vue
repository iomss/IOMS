<!-- 设备定额名称匹配页面 -->
<template>
  <div>
    <el-row>
      <el-col>
        <div class="panel">
          <div class="header">
            <div class="toolsrt">
              <el-form ref="form" :model="formSearch" label-width="110px">
                <el-form-item label="设备编码" prop="normEquipmentId">
                  <el-input v-model="formSearch.normEquipmentId" placeholder="设备编码" size="small" />
                </el-form-item>
                <el-form-item label="设备名称" prop="name">
                  <el-input v-model="formSearch.name" placeholder="设备名称" size="small" />
                </el-form-item>
                <!-- <el-form-item label="所属系统" prop="normSystemId">
                  <el-select v-model="formSearch.systemId" filterable remote :remote-method="remoteMethodsystemId" :loading="loading" placeholder="所属系统" size="small" @focus="remoteMethodsystemId">
                    <el-option v-for="item in systemData" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                </el-form-item> -->
                <el-form-item label="定额编目" prop="normCode">
                  <el-input v-model="formSearch.normCode" placeholder="定额编目" size="small" />
                </el-form-item>
                <el-form-item label="定额设备名称" prop="normName">
                  <el-input v-model="formSearch.normName" placeholder="定额设备名称" size="small" />
                </el-form-item>
                <el-form-item label="匹配度" prop="matchType">
                  <el-select v-model="formSearch.matchType" placeholder="匹配度" size="small">
                    <el-option key="Full" label="完全匹配" value="Full" />
                    <el-option key="Like" label="近似匹配" value="Like" />
                    <el-option key="Reference" label="参考匹配" value="Reference" />
                  </el-select>
                </el-form-item>
                <el-form-item class="form_total">
                  <el-button type="primary" plain size="small" @click="getData()">查询</el-button>
                </el-form-item>
              </el-form>
            </div>
            <h4>维修单</h4>
            <div class="tools">
              <el-button type="success" size="small" @click="getData()">刷新</el-button>
              <el-button type="primary" size="small" @click="updateData()">编辑</el-button>
              <el-button type="danger" size="small" @click="deleteData()">删除</el-button>
            </div>
          </div>
          <div class="content">
            <el-table :data="tableData" stripe border style="width: 1000px" @selection-change="handleSelectionChange">
              <el-table-column type="selection" />
              <el-table-column prop="id" label="设备编码" />
              <el-table-column label="设备名称" prop="name" />
              <!-- <el-table-column prop="inLiability" label="所属系统">
                <template slot-scope="scope">
                  {{ scope.row.normEquipment===null?'':scope.row.normEquipment.name }}
                </template>
              </el-table-column> -->
              <el-table-column prop="code" label="定额编目">
                <template slot-scope="scope">
                  {{ scope.row.normEquipment===null?'':scope.row.normEquipment.code }}
                </template>
              </el-table-column>
              <el-table-column prop="count" label="定额设备名称">
                <template slot-scope="scope">
                  {{ scope.row.normEquipment===null?'':scope.row.normEquipment.name }}
                </template>
              </el-table-column>
              <el-table-column prop="matchType" label="匹配度">
                <template slot-scope="scope">
                  {{ scope.row.matchType=='Full'?'完全匹配':scope.row.matchType=='Like'?'近似匹配':scope.row.matchType=='Reference'?'参考匹配':'' }}
                </template>
              </el-table-column>
              <el-table-column prop="operationType" label="合同类型">
                <template slot-scope="scope">
                  {{ scope.row.normEquipment===null?'':scope.row.normEquipment.operationType=='HardMaintain'?'硬件维护':scope.row.normEquipment.operationType=='SoftMaintain'?'软件维护':scope.row.normEquipment.operationType=='InformationSecurity'?'信息安全':scope.row.normEquipment.operationType=='HardRepair'?'硬件维修':'软件维修' }}
                </template>
              </el-table-column>
            </el-table>
            <!-- 编辑 -->
            <el-dialog title="修改" :visible.sync="FormVisible" :close-on-press-escape="false" :close-on-click-modal="false" width="450px">
              <el-form ref="EditForm" :model="EditForm" :rules="FormRules" label-width="120px">
                <el-form-item label="设备编码" prop="id">
                  <el-input v-model="EditForm.id" placeholder="设备编码" size="small" :disabled="true" />
                </el-form-item>
                <el-form-item label="设备名称" prop="name">
                  <el-input v-model="EditForm.name" placeholder="设备名称" size="small" :disabled="true" />
                </el-form-item>
                <el-form-item label="定额编目" prop="code">
                  <el-input v-model="EditForm.code" placeholder="定额编目" size="small" :disabled="true" />
                </el-form-item>
                <el-form-item label="定额设备名称" prop="normEquipmentId">
                  <el-select v-model="EditForm.normEquipmentId" filterable remote :remote-method="remoteMethodnormEquipmentId" :loading="loading" placeholder="定额设备名称" size="small" @focus="remoteMethodnormEquipmentId">
                    <el-option v-for="item in normEquipmentData" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                </el-form-item>
                <el-form-item label="匹配度" prop="matchType">
                  <el-select v-model="EditForm.matchType" placeholder="匹配度" size="small">
                    <el-option key="Full" label="完全匹配" value="Full" />
                    <el-option key="Like" label="近似匹配" value="Like" />
                    <el-option key="Reference" label="参考匹配" value="Reference" />
                  </el-select>
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitData()">确定</el-button>
                <el-button type="primary" @click="FormVisible=false">关闭</el-button>
              </span>
            </el-dialog>
            <!--分页-->
            <pagination v-show="totalCount>0" :total="totalCount" :page.sync="formSearch.pageNumber" :limit.sync="formSearch.pageSize" @pagination="getPage" />
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
      loading: false, // 远程搜索
      formSearch: {
        name: '',
        normEquipmentId: '',
        normSystemId: '',
        matchType: '',
        normCode: '',
        normName: '',
        text: '', // 搜索文本
        pageSize: 10, // 展示条数
        pageNumber: 1// 页码
      },
      totalCount: 0, // 数据总条数
      multipleSelection: '', // 表单选中行
      removeQuestionVisible: false, // 删除弹框
      tableData: [],
      removeData: [],
      // systemData: [],
      // sourceData: [],
      normEquipmentData: [],
      FormVisible: false, // 编辑弹框
      EditForm: [], // 编辑表单数据
      // sourcepage: {// 匹配度分页
      //   pageNumber: 1,
      //   pageSize: 999999,
      //   pageCount: ''
      // },
      // systempage: {// 所属系统分页
      //   pageNumber: 1,
      //   pageSize: 999999,
      //   pageCount: ''
      // },
      normEquipmentpage: {// 匹配度分页
        pageNumber: 1,
        pageSize: 999999,
        pageCount: ''
      },
      FormRules: {
        name: {
          required: true,
          message: '设备名称不可为空',
          trigger: 'blur'
        },
        brandId: {
          required: true,
          message: '定额编目不可为空',
          trigger: 'blur'
        }
      }
    }
  },
  computed: {},
  mounted() {
    this.getData()
    // this.getsystemData()
    // this.getsourceData()
    this.getnormEquipmentData()
  },
  methods: {
    getData() {
      this.$axios.get('/api/MatchEquipment/', { params: this.formSearch }).then(res => {
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
      this.$axios.get('/api/MatchEquipment/', { params: this.formSearch }).then(res => {
        this.tableData = res.data
      })
    },
    // getsystemData() {
    //   // 获取所属系统
    //   this.$axios.get('/api/Meta/System?pageSize=' + this.systempage.pageSize + '&pageNumber=' + this.systempage.pageNumber).then(res => {
    //     this.systemData = this.systemData.concat(res.data)
    //   })
    // },
    // remoteMethodsystemId(query) {
    //   this.loading = true
    //   let querytext = ''
    //   querytext = typeof (query) === 'string' ? query : ''
    //   this.$axios.get('/api/Meta/System?text=' + querytext).then(res => {
    //     this.loading = false
    //     this.systemData = res.data
    //   })
    // },
    getnormEquipmentData() {
      this.$axios.get('/api/Meta/NormEquipment?pageSize=' + this.normEquipmentpage.pageSize + '&pageNumber=' + this.normEquipmentpage.pageNumber).then(res => {
        this.normEquipmentData = this.normEquipmentData.concat(res.data)
      })
    },
    remoteMethodnormEquipmentId(query) {
      this.loading = true
      let querytext = ''
      querytext = typeof (query) === 'string' ? query : ''
      this.$axios.get('/api/Meta/NormEquipment?text=' + querytext).then(res => {
        this.loading = false
        this.normEquipmentData = res.data
      })
    },
    updateData(row) {
      if (row === undefined) {
        if (this.multipleSelection.length !== 1) {
          this.$message.error('请选择一项数据进行操作')
        } else {
          this.FormVisible = true
          this.EditForm = this.multipleSelection[0]
          this.EditForm.code = this.multipleSelection[0].normEquipment.code
          this.EditForm.normEquipmentId = this.multipleSelection[0].normEquipment.id
        }
      } else {
        this.FormVisible = true
      }
    },
    deleteData(row) {
      if (row === undefined) {
        if (this.multipleSelection.length !== 1) {
          this.$message.error('请选择一项数据进行操作')
        } else {
          this.removeQuestionVisible = true
          this.removeData = this.multipleSelection[0]
        }
      } else {
        this.removeQuestionVisible = true
      }
    },
    submitData() {
      this.$refs.EditForm.validate(valid => {
        if (valid) {
          this.$axios.put('/api/MatchEquipment/' + this.EditForm.id, this.EditForm).then(res => {
            this.$message.success('修改成功')
            this.FormVisible = false
            this.getData()
          })
        }
      })
    },
    // 删除
    removeQuestion() {
      const _this = this
      this.$axios.delete('/api/MatchEquipment/?Id=' + this.removeData.id).then(response => {
        _this.$message.success('删除成功')
        _this.removeQuestionVisible = false
        this.getData()
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
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
  width: 29%;
  display: inline-block;
}
.toolsrt {
  width: 100%;
  .el-form-item {
    width: 33%;
    display: inline-block;
  }
  .form_total {
    width: 100%;
    text-align: center;
  }
  .el-select {
    width: 50%;
  }
  .el-input {
    width: 50%;
  }
}

.content {
  .el-table th,
  .el-table td {
    padding: 5px;
  }
}
</style>
