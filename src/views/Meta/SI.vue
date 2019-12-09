<!-- 系统集成商页面 -->
<template>
  <div>
    <el-row>
      <el-col>
        <div class="panel">
          <div class="header">
            <div class="search">
              <el-input v-model="SIFormSearce.text" placeholder="系统集成商名称" size="small" />
              <el-button type="primary" size="small" @click="getData()">查询</el-button>
              <el-button type="success" size="small" @click="adddata()">添加</el-button>
              <el-button type="warning" size="small" @click="updateSI()">修改</el-button>
              <el-button type="danger" size="small" @click="deleteSI()">删除</el-button>
            </div>
          </div>
          <div class="content">
            <el-table :data="SIData" stripe border style="width: 100%" @selection-change="handleSelectionChangeSI">
              <el-table-column type="selection" width="40" />
              <el-table-column type="index" label="序号" />
              <el-table-column prop="name" label="系统集成商名称" />
            </el-table>
            <pagination v-show="SITotalCount>0" :total="SITotalCount" :page.sync="SIFormSearce.pageNumber" :limit.sync="SIFormSearce.pageSize" @pagination="getSIPage" />

            <el-dialog :title="SIFormTitle" :visible.sync="SIFormVisible" :close-on-press-escape="false" :close-on-click-modal="false" width="450px" @close="SIFormClose">
              <el-form ref="SIForm" :model="SIForm" :rules="SIFormRules" label-width="120px">
                <el-form-item label="系统集成商" prop="name">
                  <el-input v-model="SIForm.name" placeholder="系统集成商" size="small" />
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="SIFormVisible=false">关闭</el-button>
                <el-button type="primary" @click="submitSI()">提交更改</el-button>
              </span>
            </el-dialog>

            <el-dialog ref="removeData" title="提示" :close-on-press-escape="false" :close-on-click-modal="false" :visible.sync="SIDeleteModelVisible" width="220px">
              <span>您确定要删除此条数据？</span>
              <span slot="footer" class="dialog-footer">
                <el-button @click="SIDeleteModelVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitDeleteSI">确 定</el-button>
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
      SIData: [], // 数据
      SIFormSearce: {
        text: '',
        pageSize: 20,
        pageNumber: 1
      },
      SITotalCount: 0, // 总条数
      SIFormTitle: '添加设备集成商', // 表单表头
      SIFormVisible: false,
      SIForm: {
        id: undefined,
        name: ''
      },
      SIFormRules: {
        name: {
          required: true,
          message: '设备集成商不可为空',
          trigger: 'blur'
        }
      },
      SIDeleteModelVisible: false,
      SIDeleteDataId: null,
      multipleSelectionpSI: []

    }
  },
  computed: {},
  mounted() {
    this.getData()
  },
  methods: {
    // 获取数据
    getData() {
      this.$axios.get('/api/Meta/SI', { params: this.SIFormSearce }).then(res => {
        this.SIData = res.data
        this.SITotalCount = res.totalCount
      })
    },
    // 分页
    getSIPage(val) {
      // 展示条数
      this.SIFormSearce.pageSize = val.limit
      // 页码
      this.SIFormSearce.pageNumber = val.page
      // 调用获取数据
      this.getData()
    },
    // 表单关闭重置
    SIFormClose() {
      this.$refs.SIForm.resetFields()
    },
    // 添加
    adddata() {
      this.SIFormVisible = true// 显示弹框
      this.SIFormTitle = '添加设备集成商'
      this.SIForm.id = undefined
      this.SIForm.name = ''
    },
    updateSI(row) {
      if (row === undefined) {
        this.SIFormTitle = '编辑'
        if (this.multipleSelectionSI.length !== 1) {
          this.$message.error('请选择一项数据进行操作')
        } else {
          this.SIFormVisible = true
          this.SIForm.id = this.multipleSelectionSI[0].id
          this.SIForm.name = this.multipleSelectionSI[0].name
        }
      } else {
        this.SIFormVisible = true
        this.SIForm.id = row.id
        this.SIForm.name = row.name
      }
    },
    // 表单提交
    submitSI() {
      this.$refs.SIForm.validate(valid => {
        if (valid) {
          if (this.SIForm.id === undefined) {
            this.$axios.post('/api/Meta/SI', this.SIForm).then(res => {
              this.getData()
              this.$message.success('添加成功')
              this.SIFormVisible = false
            })
          } else {
            this.$axios.put('/api/Meta/SI/' + this.SIForm.id, this.SIForm).then(res => {
              this.getData()
              this.$message.success('修改成功')
              this.SIFormVisible = false
            })
          }
        }
      })
    },
    // 删除
    deleteSI(row) {
      if (row === undefined) {
        if (this.multipleSelectionSI.length !== 1) {
          this.$message.error('请选择一项数据进行操作')
        } else {
          this.SIDeleteModelVisible = true
          this.SIDeleteDataId = this.multipleSelectionSI[0].id
        }
      } else {
        this.SIDeleteModelVisible = true
        this.SIDeleteDataId = row.id
      }
    },
    // 提交删除
    submitDeleteSI() {
      this.$axios.delete('/api/Meta/SI/' + this.SIDeleteDataId).then(res => {
        this.getData()
        this.$message.success('删除成功')
        this.SIDeleteModelVisible = false
      })
    },
    // 表单多选数据
    handleSelectionChangeSI(val) {
      this.multipleSelectionSI = val
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
