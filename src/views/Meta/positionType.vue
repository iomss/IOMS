<!-- 位置类型页面 -->
<template>
  <div>
    <el-row>
      <el-col>
        <div class="panel">
          <div class="header">
            <div class="search">
              <el-input v-model="positionTypeFormSearce.text" placeholder="全局查询" size="small" />
              <el-button type="primary" size="small" @click="getData()">查询</el-button>
              <el-button type="success" size="small" @click="adddata()">添加</el-button>
              <el-button type="warning" size="small" @click="updatePositionType()">修改</el-button>
              <el-button type="danger" size="small" @click="deletePositionType()">删除</el-button>
            </div>
          </div>
          <div class="content">
            <el-table :data="positionTypeData" stripe border style="width: 100%" @selection-change="handleSelectionChangePositionType">
              <el-table-column type="selection" width="40" />
              <el-table-column type="index" label="序号" />
              <el-table-column prop="name" label="位置类型名称" />
            </el-table>
            <pagination v-show="positionTypeTotalCount>0" :total="positionTypeTotalCount" :page.sync="positionTypeFormSearce.pageNumber" :limit.sync="positionTypeFormSearce.pageSize" @pagination="getPositionTypePage" />

            <el-dialog :title="positionTypeFormTitle" :visible.sync="positionTypeFormVisible" :close-on-press-escape="false" :close-on-click-modal="false" width="450px" @close="positionTypeFormClose">
              <el-form ref="positionTypeForm" :model="positionTypeForm" :rules="positionTypeFormRules" label-width="120px">
                <el-form-item label="位置类型" prop="name">
                  <el-input v-model="positionTypeForm.name" placeholder="位置类型" size="small" />
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="positionTypeFormVisible=false">关闭</el-button>
                <el-button type="primary" @click="submitPositionType()">提交</el-button>
              </span>
            </el-dialog>

            <el-dialog ref="removeData" title="提示" :close-on-press-escape="false" :close-on-click-modal="false" :visible.sync="positionTypeDeleteModelVisible" width="220px">
              <span>您确定要删除此条数据？</span>
              <span slot="footer" class="dialog-footer">
                <el-button @click="positionTypeDeleteModelVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitDeletepositionType">确 定</el-button>
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
      positionTypeData: [], // 数据
      positionTypeFormSearce: {
        text: '',
        pageSize: 20,
        pageNumber: 1
      },
      positionTypeTotalCount: 0, // 总条数
      positionTypeFormTitle: '添加设备集成商', // 表单表头
      positionTypeFormVisible: false,
      positionTypeForm: {
        id: undefined,
        name: ''
      },
      positionTypeFormRules: {
        name: {
          required: true,
          message: '位置类型不可为空',
          trigger: 'blur'
        }
      },
      positionTypeDeleteModelVisible: false,
      positionTypeDeleteDataId: null,
      multipleSelectionpPositionType: []
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    // 获取数据
    getData() {
      this.$axios.get('/api/Meta/PositionType', { params: this.positionTypeFormSearce }).then(res => {
        this.positionTypeData = res.data
        this.positionTypeTotalCount = res.totalCount
      })
    },
    // 分页
    getPositionTypePage(val) {
      // 展示条数
      this.positionTypeFormSearce.pageSize = val.limit
      // 页码
      this.positionTypeFormSearce.pageNumber = val.page
      // 调用获取数据
      this.getData()
    },
    // 表单关闭重置
    positionTypeFormClose() {
      this.$refs.positionTypeForm.resetFields()
    },
    // 添加
    adddata() {
      this.positionTypeFormVisible = true// 显示弹框
      this.positionTypeFormTitle = '添加位置类型'
      this.positionTypeForm.id = undefined
      this.positionTypeForm.name = ''
    },
    updatePositionType(row) {
      if (row === undefined) {
        this.positionTypeFormTitle = '编辑'
        if (this.multipleSelectionPositionType.length !== 1) {
          this.$message.error('请选择一项数据进行操作')
        } else {
          this.positionTypeFormVisible = true
          this.positionTypeForm.id = this.multipleSelectionPositionType[0].id
          this.positionTypeForm.name = this.multipleSelectionPositionType[0].name
        }
      } else {
        this.positionTypeFormVisible = true
        this.positionTypeForm.id = row.id
        this.positionTypeForm.name = row.name
      }
    },
    // 表单提交
    submitPositionType() {
      this.$refs.positionTypeForm.validate(valid => {
        if (valid) {
          if (this.positionTypeForm.id === undefined) {
            this.$axios.post('/api/Meta/PositionType', this.positionTypeForm).then(res => {
              this.getData()
              this.$message.success('添加成功')
              this.positionTypeFormVisible = false
            })
          } else {
            this.$axios.put('/api/Meta/PositionType/' + this.positionTypeForm.id, this.positionTypeForm).then(res => {
              this.getData()
              this.$message.success('修改成功')
              this.positionTypeFormVisible = false
            })
          }
        }
      })
    },
    // 删除
    deletePositionType(row) {
      if (row === undefined) {
        if (this.multipleSelectionPositionType.length !== 1) {
          this.$message.error('请选择一项数据进行操作')
        } else {
          this.positionTypeDeleteModelVisible = true
          this.positionTypeDeleteDataId = this.multipleSelectionPositionType[0].id
        }
      } else {
        this.positionTypeDeleteModelVisible = true
        this.positionTypeDeleteDataId = row.id
      }
    },
    // 提交删除
    submitDeletepositionType() {
      this.$axios.delete('/api/Meta/PositionType/' + this.positionTypeDeleteDataId).then(res => {
        this.getData()
        this.$message.success('删除成功')
        this.positionTypeDeleteModelVisible = false
      })
    },
    // 表单多选数据
    handleSelectionChangePositionType(val) {
      this.multipleSelectionPositionType = val
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
