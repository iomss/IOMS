<!-- 库房管理页面 -->
<template>
  <div>
    <el-row>
      <el-col>
        <div class="panel">
          <div class="header">
            <div class="search">
              <el-input v-model="SpareRepositoryFormSearce.text" placeholder="全局查询" size="small" />
              <el-button type="primary" size="small" @click="getData()">查询</el-button>
              <el-button type="success" size="small" @click="adddata()">添加</el-button>
              <el-button type="warning" size="small" @click="updateSpareRepository()">修改</el-button>
              <el-button type="danger" size="small" @click="deleteSpareRepository()">删除</el-button>
            </div>
          </div>
          <div class="content">
            <el-table :data="SpareRepositoryData" stripe border style="width: 100%" @selection-change="handleSelectionChangeSpareRepository">
              <el-table-column type="selection" width="40" />
              <el-table-column type="index" label="序号" />
              <el-table-column prop="name" label="仓库名称" />
              <el-table-column prop="unit.name" label="单位名称" />
              <el-table-column prop="location" label="位置" />
              <el-table-column prop="createTime" label="创建时间" :formatter="formatterDate" />

            </el-table>
            <pagination v-show="SpareRepositoryTotalCount>0" :total="SpareRepositoryTotalCount" :page.sync="SpareRepositoryFormSearce.pageNumber" :limit.sync="SpareRepositoryFormSearce.pageSize" @pagination="getSpareRepositoryPage" />

            <el-dialog :title="SpareRepositoryFormTitle" :visible.sync="SpareRepositoryFormVisible" :close-on-press-escape="false" :close-on-click-modal="false" width="450px" @close="SpareRepositoryFormClose">
              <el-form ref="SpareRepositoryForm" :model="SpareRepositoryForm" :rules="SpareRepositoryFormRules" label-width="120px">
                <el-form-item label="仓库名称" prop="name">
                  <el-input v-model="SpareRepositoryForm.name" placeholder="仓库名称" size="small" />
                </el-form-item>
                <el-form-item label="位置" prop="location">
                  <el-input v-model="SpareRepositoryForm.location" placeholder="位置" size="small" />
                </el-form-item>
                <el-form-item label="单位" prop="unitId">
                  <treeselect v-model="SpareRepositoryForm.unitId" :normalizer="normalizer" :options="unitData" :load-options="loadOptions" placeholder="单位部门" no-results-text="未找到相关数据" />
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="SpareRepositoryFormVisible=false">关闭</el-button>
                <el-button type="primary" @click="submitSpareRepository()">提交</el-button>
              </span>
            </el-dialog>

            <el-dialog ref="removeData" title="提示" :close-on-press-escape="false" :close-on-click-modal="false" :visible.sync="SpareRepositoryDeleteModelVisible" width="220px">
              <span>您确定要删除此条数据？</span>
              <span slot="footer" class="dialog-footer">
                <el-button @click="SpareRepositoryDeleteModelVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitDeleteSpareRepository">确 定</el-button>
              </span>
            </el-dialog>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { Treeselect, LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'

import pagination from '@/components/Pagination/index.vue'

// 节流
const simulateAsyncOperation = fn => {
  setTimeout(fn, 500)
}
export default {
  components: {
    pagination,
    Treeselect
  },
  data() {
    return {
      // 树结构
      normalizer(node) {
        return {
          id: node.id,
          label: node.name,
          children: node.children
        }
      },
      unitData: [],
      SpareRepositoryData: [], // 数据
      SpareRepositoryFormSearce: {
        text: '',
        pageSize: 20,
        pageNumber: 1
      },
      SpareRepositoryTotalCount: 0, // 总条数
      SpareRepositoryFormTitle: '添加备件仓库', // 表单表头
      SpareRepositoryFormVisible: false,
      SpareRepositoryForm: {
        id: undefined,
        name: '',
        location: '',
        unitId: null
      },
      SpareRepositoryFormRules: {
        name: {
          required: true,
          message: '备件仓库不可为空',
          trigger: 'blur'
        },
        unitId: {
          required: true,
          message: '备件仓库单位不可为空',
          trigger: 'blur'
        }
      },
      SpareRepositoryDeleteModelVisible: false,
      SpareRepositoryDeleteDataId: null,
      multipleSelectionpSpareRepository: []
    }
  },
  computed: {},
  mounted() {
    this.getData()
    this.getUnitData()
  },
  methods: {
    // treeSelect 加载
    loadOptions({ action, parentNode, callback }) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        switch (parentNode.id) {
          case 'success': {
            simulateAsyncOperation(() => {
              parentNode.children = [
                {
                  id: 'child',
                  label: 'Child option'
                }
              ]
              callback()
            })
            break
          }
          case 'no-children': {
            simulateAsyncOperation(() => {
              parentNode.children = []
              callback()
            })
            break
          }
          case 'failure': {
            simulateAsyncOperation(() => {
              callback(new Error('Failed to load options: network error.'))
            })
            break
          }
          default: /* empty */
        }
      }
    },
    // 时间格式化
    formatterDate(row, column, cellValue) {
      if (cellValue !== null) {
        return this.$moment(cellValue).format('YYYY-MM-DD HH:mm:ss')
      } else {
        return cellValue
      }
    },
    getUnitData() {
      this.$axios.get('/api/Tree/Unit').then(res => {
        this.unitData = res
      })
    },
    // 获取数据
    getData() {
      this.$axios.get('/api/SpareRepository', { params: this.SpareRepositoryFormSearce }).then(res => {
        this.SpareRepositoryData = res.data
        this.SpareRepositoryTotalCount = res.totalCount
      })
    },
    // 分页
    getSpareRepositoryPage(val) {
      // 展示条数
      this.SpareRepositoryFormSearce.pageSize = val.limit
      // 页码
      this.SpareRepositoryFormSearce.pageNumber = val.page
      // 调用获取数据
      this.getData()
    },
    // 表单关闭重置
    SpareRepositoryFormClose() {
      this.$refs.SpareRepositoryForm.resetFields()
    },
    // 添加
    adddata() {
      this.SpareRepositoryFormVisible = true// 显示弹框
      this.SpareRepositoryFormTitle = '添加备件仓库'
      this.SpareRepositoryForm.id = undefined
      this.SpareRepositoryForm.name = ''
      this.SpareRepositoryForm.location = ''
      this.SpareRepositoryForm.unitId = null
    },
    updateSpareRepository(row) {
      if (row === undefined) {
        this.SpareRepositoryFormTitle = '编辑'
        if (this.multipleSelectionpSpareRepository.length !== 1) {
          this.$message.error('请选择一项数据进行操作')
        } else {
          this.SpareRepositoryFormVisible = true
          this.SpareRepositoryForm.id = this.multipleSelectionpSpareRepository[0].id
          this.SpareRepositoryForm.name = this.multipleSelectionpSpareRepository[0].name
          this.SpareRepositoryForm.location = this.multipleSelectionpSpareRepository[0].location
          this.SpareRepositoryForm.unitId = this.multipleSelectionpSpareRepository[0].unitId
        }
      } else {
        this.SpareRepositoryFormVisible = true
        this.SpareRepositoryForm.id = row.id
        this.SpareRepositoryForm.name = row.name
        this.SpareRepositoryForm.location = row.location
        this.SpareRepositoryForm.unitId = row.unitId
      }
    },
    // 表单提交
    submitSpareRepository() {
      this.$refs.SpareRepositoryForm.validate(valid => {
        if (valid) {
          if (this.SpareRepositoryForm.id === undefined) {
            this.$axios.post('/api/SpareRepository', this.SpareRepositoryForm).then(res => {
              this.getData()
              this.$message.success('添加成功')
              this.SpareRepositoryFormVisible = false
            })
          } else {
            this.$axios.put('/api/SpareRepository/' + this.SpareRepositoryForm.id, this.SpareRepositoryForm).then(res => {
              this.getData()
              this.$message.success('修改成功')
              this.SpareRepositoryFormVisible = false
            })
          }
        }
      })
    },
    // 删除
    deleteSpareRepository(row) {
      if (row === undefined) {
        if (this.multipleSelectionpSpareRepository.length !== 1) {
          this.$message.error('请选择一项数据进行操作')
        } else {
          this.SpareRepositoryDeleteModelVisible = true
          this.SpareRepositoryDeleteDataId = this.multipleSelectionpSpareRepository[0].id
        }
      } else {
        this.SpareRepositoryDeleteModelVisible = true
        this.SpareRepositoryDeleteDataId = row.id
      }
    },
    // 提交删除
    submitDeleteSpareRepository() {
      this.$axios.delete('/api/SpareRepository/' + this.SpareRepositoryDeleteDataId).then(res => {
        this.getData()
        this.$message.success('删除成功')
        this.SpareRepositoryDeleteModelVisible = false
      })
    },
    // 表单多选数据
    handleSelectionChangeSpareRepository(val) {
      this.multipleSelectionpSpareRepository = val
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
