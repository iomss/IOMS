<!-----维修等级信息-------->
<template>
  <div>
    <el-row>
      <el-col>
        <div class="panel">
          <div class="header">
            <div class="search">
              <el-input v-model="RepairLevelFormSearch.text" placeholder="维修等级名称" size="small" />
              <el-button type="primary" size="small" @click="getData()">查询</el-button>
              <el-button type="success" size="small" @click="adddata()">添加</el-button>
              <el-button type="warning" size="small" @click="updateRepairLevel()">修改</el-button>
              <el-button type="danger" size="small" @click="deleteRepairLevel()">删除</el-button>
            </div>
          </div>
          <div class="content">
            <el-table :data="RepairLevelData" stripe border style="width: 100%" @selection-change="handleSelectionChangeRepairLevel">
              <el-table-column type="selection" width="40" />
              <el-table-column type="index" label="序号" />
              <el-table-column prop="name" label="维修等级名称" />
            </el-table>
            <pagination v-show="RepairLevelTotalCount>0" :total="RepairLevelTotalCount" :page.sync="RepairLevelFormSearch.pageNumber" :limit.sync="RepairLevelFormSearch.pageSize" @pagination="getRepairLevelPage" />

            <el-dialog :title="RepairLevelFormTitle" :visible.sync="RepairLevelFormVisible" :close-on-press-escape="false" :close-on-click-modal="false" width="450px" @close="RepairLevelFormClose">
              <el-form ref="RepairLevelForm" :model="RepairLevelForm" :rules="RepairLevelFormRules" label-width="120px">
                <el-form-item label="维修等级" prop="name">
                  <el-input v-model="RepairLevelForm.name" placeholder="维修等级" size="small" />
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="RepairLevelFormVisible=false">关闭</el-button>
                <el-button type="primary" @click="submitRepairLevel()">提交</el-button>
              </span>
            </el-dialog>

            <el-dialog ref="removeData" title="提示" :close-on-press-escape="false" :close-on-click-modal="false" :visible.sync="RepairLevelDeleteModelVisible" width="220px">
              <span>您确定要删除此条数据？</span>
              <span slot="footer" class="dialog-footer">
                <el-button @click="RepairLevelDeleteModelVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitDeleteRepairLevel">确 定</el-button>
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
  name: 'MetaRepairLevel',
  components: {
    pagination
  },
  data() {
    return {
      RepairLevelData: [], // 数据
      RepairLevelFormSearch: {
        text: '',
        pageSize: 20,
        pageNumber: 1
      },
      RepairLevelTotalCount: 0,
      RepairLevelFormTitle: '',
      RepairLevelFormVisible: false,
      RepairLevelForm: {
        id: undefined,
        name: ''
      },
      RepairLevelFormRules: {
        name: {
          required: true,
          message: '维修等级名称不可为空',
          trigger: 'blur'
        }
      },
      RepairLevelDeleteModelVisible: false,
      RepairLevelDeleteDataId: null,
      multipleSelectionRepairLevel: []
    }
  },
  computed: {},
  mounted() {
    this.getData()
  },
  methods: {
    // 获取数据
    getData() {
      this.$axios.get('/api/Meta/RepairLevel', { params: this.RepairLevelFormSearch }).then(res => {
        this.RepairLevelData = res.data
        this.RepairLevelTotalCount = res.totalCount
      })
    },
    // 分页
    getRepairLevelPage(val) {
      // 展示条数
      this.RepairLevelFormSearch.pageSize = val.limit
      // 页码
      this.RepairLevelFormSearch.pageNumber = val.page
      // 调用获取数据
      this.getData()
    },
    // 添加
    adddata() {
      this.RepairLevelFormVisible = true// 显示弹框
      this.RepairLevelFormTitle = '添加维修等级'
      this.RepairLevelForm.id = undefined
      this.RepairLevelForm.name = ''
    },
    // 表单关闭重置
    RepairLevelFormClose() {
      this.$refs.RepairLevelForm.resetFields()
    },
    updateRepairLevel(row) {
      if (row === undefined) {
        this.RepairLevelFormTitle = '编辑'
        if (this.multipleSelectionRepairLevel.length !== 1) {
          this.$message.error('请选择一项数据进行操作')
        } else {
          this.RepairLevelFormVisible = true
          this.RepairLevelForm.id = this.multipleSelectionRepairLevel[0].id
          this.RepairLevelForm.name = this.multipleSelectionRepairLevel[0].name
        }
      } else {
        this.RepairLevelFormVisible = true
        this.RepairLevelForm.id = row.id
        this.RepairLevelForm.name = row.name
      }
    },
    // 表单提交
    submitRepairLevel() {
      this.$refs.RepairLevelForm.validate(valid => {
        if (valid) {
          if (this.RepairLevelForm.id === undefined) {
            this.$axios.post('/api/Meta/RepairLevel', this.RepairLevelForm).then(res => {
              this.getData()
              this.$message.success('添加成功')
              this.RepairLevelFormVisible = false
            })
          } else {
            this.$axios.put('/api/Meta/RepairLevel/' + this.RepairLevelForm.id, this.RepairLevelForm).then(res => {
              this.getData()
              this.$message.success('修改成功')
              this.RepairLevelFormVisible = false
            })
          }
        }
      })
    },
    // 删除
    deleteRepairLevel(row) {
      if (row === undefined) {
        if (this.multipleSelectionRepairLevel.length !== 1) {
          this.$message.error('请选择一项数据进行操作')
        } else {
          this.RepairLevelDeleteModelVisible = true
          this.RepairLevelDeleteDataId = this.multipleSelectionRepairLevel[0].id
        }
      } else {
        this.RepairLevelDeleteModelVisible = true
        this.RepairLevelDeleteDataId = row.id
      }
    },
    // 提交删除
    submitDeleteRepairLevel() {
      this.$axios.delete('/api/Meta/RepairLevel/' + this.RepairLevelDeleteDataId).then(res => {
        this.getData()
        this.$message.success('删除成功')
        this.RepairLevelDeleteModelVisible = false
      })
    },
    // 表单多选数据
    handleSelectionChangeRepairLevel(val) {
      this.multipleSelectionRepairLevel = val
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

