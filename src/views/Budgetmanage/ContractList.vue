<!-- 合同测算-预算（调整版）页面 -->
<template>
  <div>
    <el-row>
      <el-col>
        <div class="panel">
          <div class="header">
            <div class="tools">
              <span>生成预算调整版：</span>
              <el-button type="success" size="small" @click="HardwareMvisible = true">硬件维护</el-button>
              <el-button type="primary" size="small" @click="HardwareRvisible = true">硬件维修</el-button>
              <el-button type="success" size="small" @click="SoftwareMvisible = true">软件维护</el-button>
              <el-button type="primary" size="small" @click="SoftwareRvisible = true">软件维修</el-button>
              <el-button type="warning" size="small" @click="infoSafevisible = true">信息安全</el-button>
              <el-button type="warning" size="small" @click="setvalid()">设为有效</el-button>
            </div>
            <div class="toolsrt">
              <el-form ref="form" :model="formSearch" label-width="60px">
                <el-form-item label="版本号" prop="uint">
                  <el-input v-model="formSearch.text" placeholder="版本号" size="small" />
                </el-form-item>
                <el-form-item label="年度" prop="uint">
                  <el-select v-model="formSearch.systemId" filterable remote :remote-method="remoteMethodsystemId" :loading="loading" placeholder="年度" size="small" @focus="remoteMethodsystemId">
                    <el-option v-for="item in systemData" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                </el-form-item>
                <el-form-item label="路段" prop="uint">
                  <el-select v-model="formSearch.systemId" filterable remote :remote-method="remoteMethodsystemId" :loading="loading" placeholder="路段" size="small" @focus="remoteMethodsystemId">
                    <el-option v-for="item in systemData" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                </el-form-item>
                <el-form-item label="状态" prop="uint">
                  <el-select v-model="formSearch.systemId" filterable remote :remote-method="remoteMethodsystemId" :loading="loading" placeholder="状态" size="small" @focus="remoteMethodsystemId">
                    <el-option v-for="item in systemData" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                </el-form-item>
                <el-form-item label="类型" prop="uint">
                  <el-select v-model="formSearch.systemId" filterable remote :remote-method="remoteMethodsystemId" :loading="loading" placeholder="类型" size="small" @focus="remoteMethodsystemId">
                    <el-option v-for="item in systemData" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" plain size="small" @click="getData()">查询</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <div class="content">
            <el-table :data="tableData" stripe border style="width: 100%" @selection-change="handleSelectionChange">
              <el-table-column type="selection" />
              <el-table-column prop="equipment" label="版本号">
                <template slot-scope="scope">
                  {{ scope.row.equipment.name }}
                </template>
              </el-table-column>
              <el-table-column label="年份" prop="system">
                <template slot-scope="scope">
                  {{ scope.row.system.name }}
                </template>
              </el-table-column>
              <el-table-column prop="inLiability" label="单位" />
              <el-table-column prop="outLiability" label="数量/次数" />
              <el-table-column prop="count" label="总金额" />
              <el-table-column prop="remark" label="创建时间" />
              <el-table-column prop="source" label="是否有效">
                <template slot-scope="scope">
                  {{ scope.row.source==='Automatic'?"有效":"无效" }}
                </template>
              </el-table-column>
              <el-table-column prop="source" label="类型">
                <template slot-scope="scope">
                  {{ scope.row.source==='Automatic'?"硬件维护调整版":"软件维护调整版" }}
                </template>
              </el-table-column>
            </el-table>
            <!-- 硬件维护 -->
            <el-dialog title="生成硬件维护调整版" :visible.sync="HardwareMvisible" :close-on-press-escape="false" :close-on-click-modal="false" width="450px">
              <el-form ref="HardwareMForm" :model="HardwareMForm" :rules="HardwareMFormRules" label-width="120px">
                <el-form-item label="单位" prop="name">
                  <el-select v-model="HardwareMForm.systemId" filterable remote :remote-method="remoteMethodsystemId" :loading="loading" placeholder="单位" size="small" @focus="remoteMethodsystemId">
                    <el-option v-for="item in systemData" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                </el-form-item>
                <el-form-item label="设备清单版本" prop="name">
                  <el-input v-model="HardwareMForm.name" placeholder="设备清单版本" size="small" />
                </el-form-item>
                <el-form-item label="维护单价版本" prop="name">
                  <el-select v-model="HardwareMForm.systemId" filterable remote :remote-method="remoteMethodsystemId" :loading="loading" placeholder="维护单价版本" size="small" @focus="remoteMethodsystemId">
                    <el-option v-for="item in systemData" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                </el-form-item>
                <el-form-item label="预算年度" prop="name">
                  <el-select v-model="HardwareMForm.systemId" filterable remote :remote-method="remoteMethodsystemId" :loading="loading" placeholder="预算年度" size="small" @focus="remoteMethodsystemId">
                    <el-option v-for="item in systemData" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitData()">确定</el-button>
                <el-button type="primary" @click="HardwareMvisible=false">关闭</el-button>
              </span>
            </el-dialog>
            <!-- 硬件维修 -->
            <el-dialog title="生成硬件维修调整版" :visible.sync="HardwareRvisible" :close-on-press-escape="false" :close-on-click-modal="false" width="450px">
              <el-form ref="HardwareRForm" :model="HardwareRForm" :rules="HardwareRFormRules" label-width="120px">
                <el-form-item label="单位" prop="name">
                  <el-select v-model="HardwareRForm.systemId" filterable remote :remote-method="remoteMethodsystemId" :loading="loading" placeholder="单位" size="small" @focus="remoteMethodsystemId">
                    <el-option v-for="item in systemData" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                </el-form-item>
                <el-form-item label="维护单价版本" prop="name">
                  <el-select v-model="HardwareRForm.systemId" filterable remote :remote-method="remoteMethodsystemId" :loading="loading" placeholder="维护单价版本" size="small" @focus="remoteMethodsystemId">
                    <el-option v-for="item in systemData" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                </el-form-item>
                <el-form-item label="预算年度" prop="name">
                  <el-select v-model="HardwareRForm.systemId" filterable remote :remote-method="remoteMethodsystemId" :loading="loading" placeholder="预算年度" size="small" @focus="remoteMethodsystemId">
                    <el-option v-for="item in systemData" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitData()">确定</el-button>
                <el-button type="primary" @click="HardwareRvisible=false">关闭</el-button>
              </span>
            </el-dialog>
            <!-- 软件维护 -->
            <el-dialog title="生成软件维护调整版" :visible.sync="SoftwareMvisible" :close-on-press-escape="false" :close-on-click-modal="false" width="450px">
              <el-form ref="SoftwareMForm" :model="SoftwareMForm" :rules="SoftwareMFormRules" label-width="120px">
                <el-form-item label="单位" prop="name">
                  <el-select v-model="SoftwareMForm.systemId" filterable remote :remote-method="remoteMethodsystemId" :loading="loading" placeholder="单位" size="small" @focus="remoteMethodsystemId">
                    <el-option v-for="item in systemData" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                </el-form-item>
                <el-form-item label="维护单价版本" prop="name">
                  <el-select v-model="SoftwareMForm.systemId" filterable remote :remote-method="remoteMethodsystemId" :loading="loading" placeholder="维护单价版本" size="small" @focus="remoteMethodsystemId">
                    <el-option v-for="item in systemData" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                </el-form-item>
                <el-form-item label="预算年度" prop="name">
                  <el-select v-model="SoftwareMForm.systemId" filterable remote :remote-method="remoteMethodsystemId" :loading="loading" placeholder="预算年度" size="small" @focus="remoteMethodsystemId">
                    <el-option v-for="item in systemData" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitData()">确定</el-button>
                <el-button type="primary" @click="SoftwareMvisible=false">关闭</el-button>
              </span>
            </el-dialog>
            <!-- 软件维修 -->
            <el-dialog title="生成软件维修调整版" :visible.sync="SoftwareRvisible" :close-on-press-escape="false" :close-on-click-modal="false" width="450px">
              <el-form ref="SoftwareRForm" :model="SoftwareRForm" :rules="SoftwareRFormRules" label-width="120px">
                <el-form-item label="单位" prop="name">
                  <el-select v-model="SoftwareRForm.systemId" filterable remote :remote-method="remoteMethodsystemId" :loading="loading" placeholder="单位" size="small" @focus="remoteMethodsystemId">
                    <el-option v-for="item in systemData" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                </el-form-item>
                <el-form-item label="维护单价版本" prop="name">
                  <el-select v-model="SoftwareRForm.systemId" filterable remote :remote-method="remoteMethodsystemId" :loading="loading" placeholder="维护单价版本" size="small" @focus="remoteMethodsystemId">
                    <el-option v-for="item in systemData" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                </el-form-item>
                <el-form-item label="预算年度" prop="name">
                  <el-select v-model="SoftwareRForm.systemId" filterable remote :remote-method="remoteMethodsystemId" :loading="loading" placeholder="预算年度" size="small" @focus="remoteMethodsystemId">
                    <el-option v-for="item in systemData" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitData()">确定</el-button>
                <el-button type="primary" @click="SoftwareRvisible=false">关闭</el-button>
              </span>
            </el-dialog>
            <!-- 信息安全 -->
            <el-dialog title="生成信息安全调整版" :visible.sync="infoSafevisible" :close-on-press-escape="false" :close-on-click-modal="false" width="450px">
              <el-form ref="infoSafeMForm" :model="infoSafeMForm" :rules="infoSafeMFormRules" label-width="120px">
                <el-form-item label="单位" prop="name">
                  <el-select v-model="infoSafeMForm.systemId" filterable remote :remote-method="remoteMethodsystemId" :loading="loading" placeholder="单位" size="small" @focus="remoteMethodsystemId">
                    <el-option v-for="item in systemData" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                </el-form-item>
                <el-form-item label="维护单价版本" prop="name">
                  <el-select v-model="infoSafeMForm.systemId" filterable remote :remote-method="remoteMethodsystemId" :loading="loading" placeholder="维护单价版本" size="small" @focus="remoteMethodsystemId">
                    <el-option v-for="item in systemData" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                </el-form-item>
                <el-form-item label="预算年度" prop="name">
                  <el-select v-model="infoSafeMForm.systemId" filterable remote :remote-method="remoteMethodsystemId" :loading="loading" placeholder="预算年度" size="small" @focus="remoteMethodsystemId">
                    <el-option v-for="item in systemData" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitData()">确定</el-button>
                <el-button type="primary" @click="infoSafevisible=false">关闭</el-button>
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
        year: '',
        system: '',
        text: '', // 搜索文本
        pageSize: 10, // 展示条数
        pageNumber: 1// 页码
      },
      totalCount: 0, // 数据总条数
      multipleSelection: '', // 表单选中行
      removeQuestionVisible: false, // 删除弹框
      tableData: [],
      removeData: [],
      systemData: [],
      sourceData: [],
      FormVisible: false, // 编辑弹框
      EditForm: [], // 编辑表单数据
      HardwareMvisible: false, // 硬件维护弹框
      HardwareRvisible: false, // 硬件维修弹框
      SoftwareMvisible: false, // 软件维护弹框
      SoftwareRvisible: false, // 软件维修弹框
      infoSafevisible: false, // 信息安全弹框
      HardwareMForm: {}, // 硬件维护表单
      HardwareRForm: {}, // 硬件维修表单
      SoftwareMForm: {}, // 软件维护表单
      SoftwareRForm: {}, // 软件维修表单
      infoSafeMForm: {}, // 信息安全表单
      sourcepage: {// 匹配度分页
        pageNumber: 1,
        pageSize: 999999,
        pageCount: ''
      },
      systempage: {// 所属系统分页
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
      },
      HardwareMFormRules: {
        name: {
          required: true,
          message: '设备名称不可为空',
          trigger: 'blur'
        }
      },
      HardwareRFormRules: {
        name: {
          required: true,
          message: '设备名称不可为空',
          trigger: 'blur'
        }
      },
      SoftwareMFormRules: {
        name: {
          required: true,
          message: '设备名称不可为空',
          trigger: 'blur'
        }
      },
      SoftwareRFormRules: {
        name: {
          required: true,
          message: '设备名称不可为空',
          trigger: 'blur'
        }
      },
      infoSafeMFormRules: {
        name: {
          required: true,
          message: '设备名称不可为空',
          trigger: 'blur'
        }
      }
    }
  },
  computed: {},
  mounted() {
    this.getData()
    this.getsystemData()
    this.getsourceData()
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
      this.$axios.get('/api/EquipmentList/', { params: this.formSearch }).then(res => {
        this.tableData = res.data
      })
    },
    getsystemData() {
      // 获取所属系统
      this.$axios.get('/api/Meta/System?pageSize=' + this.systempage.pageSize + '&pageNumber=' + this.systempage.pageNumber).then(res => {
        this.systemData = this.systemData.concat(res.data)
      })
    },
    getsourceData() {
      // 获取匹配度
      this.$axios.get('/api/Meta/Source?pageSize=' + this.sourcepage.pageSize + '&pageNumber=' + this.sourcepage.pageNumber).then(res => {
        this.sourceData = this.sourceData.concat(res.data)
      })
    },
    remoteMethodsystemId(query) {
      this.loading = true
      let querytext = ''
      querytext = typeof (query) === 'string' ? query : ''
      this.$axios.get('/api/Meta/System?text=' + querytext).then(res => {
        this.loading = false
        this.systemData = res.data
      })
    },
    remoteMethodsourceId(query) {
      this.loading = true
      let querytext = ''
      querytext = typeof (query) === 'string' ? query : ''
      this.$axios.get('/api/Meta/source?text=' + querytext).then(res => {
        this.loading = false
        this.sourceData = res.data
      })
    },
    updateData(row) {
      if (row === undefined) {
        if (this.multipleSelection.length !== 1) {
          this.$message.error('请选择一项数据进行操作')
        } else {
          this.FormVisible = true
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
        }
      } else {
        this.removeQuestionVisible = true
      }
    },
    submitData() {
      this.$refs.EditForm.validate(valid => {
        if (valid) {
          this.$axios.put('/api/Meta/Brand/' + this.EditForm.id, this.EditForm).then(res => {
            this.getData()
            this.$message.success('修改成功')
            this.FormVisible = false
          })
        }
      })
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
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    setvalid() { // 设为有效
      if (this.multipleSelection.length !== 1) {
        this.$message.error('请选择一项数据进行操作')
      } else {
        // ajax
      }
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
  display: inline-block;
}
.toolsrt {
  width: 100%;
  .el-form-item {
    width: 10%;
    display: inline-block;
  }
  .form_total {
    width: 100%;
    text-align: center;
  }
  .el-select {
    width: 100%;
  }
  .el-input {
    width: 100%;
  }
}

.content {
  .el-table th,
  .el-table td {
    padding: 5px;
  }
}
</style>
