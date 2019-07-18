<!-----故障信息-------->
<template>
  <div>
    <el-row>
      <el-col>
        <div class="panel">
          <div class="header">
            <div class="search">
              <el-input v-model="FaultFormSearch.text" placeholder="全局查询" size="small" />
              <el-select v-model="FaultFormSearch.equipmentId" clearable placeholder="选择相关设备">
                <el-option v-for="item in Equipment" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
              <el-button type="primary" size="small" @click="getData()">查询</el-button>
              <el-button type="success" size="small" @click="adddata()">添加</el-button>
              <el-button type="warning" size="small" @click="updateFault()">修改</el-button>
              <el-button type="danger" size="small" @click="deleteFault()">删除</el-button>
            </div>
          </div>
          <div class="content">
            <el-table :data="FaultData" stripe border style="width: 100%" @selection-change="handleSelectionChangeFault">
              <el-table-column type="selection" width="40" />
              <el-table-column prop="id" label="序号" />
              <el-table-column prop="name" label="故障名称" />
              <el-table-column prop="equipmentName" label="相关设备名称" />
            </el-table>
            <pagination v-show="FaultTotalCount>0" :total="FaultTotalCount" :page.sync="FaultFormSearch.pageNumber" :limit.sync="FaultFormSearch.pageSize" @pagination="getFaultPage" />

            <el-dialog :title="FaultFormTitle" :visible.sync="FaultFormVisible" :close-on-press-escape="false" :close-on-click-modal="false" width="450px" @close="FaultFormClose">
              <el-form ref="FaultForm" :model="FaultForm" :rules="FaultFormRules" label-width="120px">
                <el-form-item label="故障" prop="name">
                  <el-input v-model="FaultForm.name" placeholder="故障" size="small" />
                </el-form-item>
                <el-form-item label="相关设备" prop="equipmentId">
                  <el-select v-model="FaultForm.equipmentId" placeholder="选择相关设备">
                    <el-option v-for="item in Equipment" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="FaultFormVisible=false">关闭</el-button>
                <el-button type="primary" @click="submitFault()">提交</el-button>
              </span>
            </el-dialog>

            <el-dialog ref="removeData" title="提示" :close-on-press-escape="false" :close-on-click-modal="false" :visible.sync="FaultDeleteModelVisible" width="220px">
              <span>您确定要删除此条数据？</span>
              <span slot="footer" class="dialog-footer">
                <el-button @click="FaultDeleteModelVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitDeleteFault">确 定</el-button>
              </span>
            </el-dialog>

          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import pagination from '@/components/Pagination/index.vue'

export default {
  components: {
    pagination
  },
  data() {
    return {
      FaultData: [], // 数据
      Equipment: [],
      FaultFormSearch: {
        equipmentId: undefined,
        text: '',
        pageSize: 20,
        pageNumber: 1
      },
      FaultTotalCount: 0,
      FaultFormTitle: '',
      FaultFormVisible: false,
      FaultForm: {
        id: undefined,
        equipmentId: undefined,
        name: ''
      },
      FaultFormRules: {
        name: {
          required: true,
          message: '故障名称不可为空',
          trigger: 'blur'
        },
        equipmentId: {
          required: true,
          message: '相关设备不可为空',
          trigger: 'change'
        }
      },
      FaultDeleteModelVisible: false,
      FaultDeleteDataId: null,
      multipleSelectionFault: []
    }
  },
  computed: {},
  mounted() {
    this.getData()
  },
  methods: {
    // 获取数据
    getData() {
      this.$axios.get('/api/Meta/Fault', { params: this.FaultFormSearch }).then(res => {
        this.FaultData = res.data
        this.FaultTotalCount = res.totalCount
      })
      this.$axios.get('/api/Meta/Equipment', { params: { pageNumber: 1, pageSize: 999999 }}).then(res => {
        this.Equipment = res.data
      })
    },
    // 分页
    getFaultPage(val) {
      // 展示条数
      this.FaultFormSearch.pageSize = val.limit
      // 页码
      this.FaultFormSearch.pageNumber = val.page
      // 调用获取数据
      this.getData()
    },
    // 添加
    adddata() {
      this.FaultFormVisible = true// 显示弹框
      this.FaultFormTitle = '添加故障'
      this.FaultForm.id = undefined
      this.FaultForm.name = ''
    },
    // 表单关闭重置
    FaultFormClose() {
      this.$refs.FaultForm.resetFields()
    },
    updateFault(row) {
      if (row === undefined) {
        this.FaultFormTitle = '编辑'
        if (this.multipleSelectionFault.length !== 1) {
          this.$message.error('请选择一项数据进行操作')
        } else {
          this.FaultFormVisible = true
          this.FaultForm.id = this.multipleSelectionFault[0].id
          this.FaultForm.name = this.multipleSelectionFault[0].name
          this.FaultForm.equipmentId = this.multipleSelectionFault[0].equipmentId
        }
      } else {
        this.FaultFormVisible = true
        this.FaultForm.id = row.id
        this.FaultForm.name = row.name
        this.FaultForm.equipmentId = row.equipmentId
      }
    },
    // 表单提交
    submitFault() {
      this.$refs.FaultForm.validate(valid => {
        if (valid) {
          if (this.FaultForm.id === undefined) {
            this.$axios.post('/api/Meta/Fault', this.FaultForm).then(res => {
              this.getData()
              this.$message.success('添加成功')
              this.FaultFormVisible = false
            })
          } else {
            this.$axios.put('/api/Meta/Fault/' + this.FaultForm.id, this.FaultForm).then(res => {
              this.getData()
              this.$message.success('修改成功')
              this.FaultFormVisible = false
            })
          }
        }
      })
    },
    // 删除
    deleteFault(row) {
      if (row === undefined) {
        if (this.multipleSelectionFault.length !== 1) {
          this.$message.error('请选择一项数据进行操作')
        } else {
          this.FaultDeleteModelVisible = true
          this.FaultDeleteDataId = this.multipleSelectionFault[0].id
        }
      } else {
        this.FaultDeleteModelVisible = true
        this.FaultDeleteDataId = row.id
      }
    },
    // 提交删除
    submitDeleteFault() {
      this.$axios.delete('/api/Meta/Fault/' + this.FaultDeleteDataId).then(res => {
        this.getData()
        this.$message.success('删除成功')
        this.FaultDeleteModelVisible = false
      })
    },
    // 表单多选数据
    handleSelectionChangeFault(val) {
      this.multipleSelectionFault = val
    }
  }
}
</script>
<style lang='scss' scoped>
.header {
  width: 100%;
  .search {
    margin: 10px 0px;
    .el-input {
      display: inline-block;
      width: 200px;
      margin-right: 20px;
    }
  }
}
.content {
  .el-table th,
  .el-table td {
    padding: 5px;
  }
}
</style>

