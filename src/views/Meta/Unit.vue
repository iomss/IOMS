<!-- 部门页面 -->
<template>
  <div>
    <el-row>
      <el-col>
        <div class="panel">
          <div class="header">
            <div class="search">
              <el-input v-model="UnitFormSearce.text" placeholder="全局查询" size="small" />
              <div style="width:300px;display:inline-block;margin-right:20px;">
                <treeselect v-model="UnitFormSearce.parentId" :normalizer="normalizer" :options="UnitTreeData" :load-options="loadOptions" placeholder="上级部门" no-results-text="未找到相关数据" />
              </div>
              <el-button type="primary" size="small" @click="getData()">查询</el-button>
              <el-button type="success" size="small" @click="addData()">添加</el-button>
              <el-button type="warning" size="small" @click="updateUnit()">修改</el-button>
              <el-button type="danger" size="small" @click="deleteUnit()">删除</el-button>
            </div>
          </div>
          <div class="content">
            <el-table :data="UnitData" stripe border style="width: 100%" @selection-change="handleSelectionChangeUnit">
              <el-table-column type="selection" width="40" />
              <el-table-column prop="id" label="序号" />
              <el-table-column prop="name" label="部门" />
              <el-table-column prop="parent" label="上级部门">
                <template slot-scope="scope">
                  {{ scope.row.parent?scope.row.parent.name:'' }}
                </template>
              </el-table-column>
              <el-table-column prop="position" label="所在位置">
                <template slot-scope="scope">
                  <span v-for="item in scope.row.positions" :key="item.id" style="margin-right:15px;">{{ item.name }}</span>
                </template>
              </el-table-column>
            </el-table>
            <pagination v-show="UnitTotalCount>0" :total="UnitTotalCount" :page.sync="UnitFormSearce.pageNumber" :limit.sync="UnitFormSearce.pageSize" @pagination="getUnitPage" />

            <el-dialog :title="UnitFormTitle" :visible.sync="UnitFormVisible" :close-on-press-escape="false" :close-on-click-modal="false" width="450px" @close="UnitFormClose">
              <el-form ref="UnitForm" :model="UnitForm" :rules="UnitFormRules" label-width="120px">
                <el-form-item label="部门" prop="name">
                  <el-input v-model="UnitForm.name" placeholder="部门" size="small" />
                </el-form-item>
                <el-form-item label="上级部门">
                  <treeselect v-model="UnitForm.parentId" :normalizer="normalizer" :options="UnitTreeData" :load-options="loadOptions" placeholder="请选择上级部门" no-results-text="未找到相关数据" />
                </el-form-item>
                <el-form-item label="所在位置">
                  <treeselect v-model="UnitForm.positionIds" :normalizer="normalizer" :multiple="true" :flat="true" :options="PositionData" :load-options="loadOptions" placeholder="请选择所在位置" no-results-text="未找到相关数据" />
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="UnitFormVisible=false">关闭</el-button>
                <el-button type="primary" @click="submitUnit()">提交</el-button>
              </span>
            </el-dialog>

            <el-dialog ref="removeData" title="提示" :close-on-press-escape="false" :close-on-click-modal="false" :visible.sync="UnitDeleteModelVisible" width="220px">
              <span>您确定要删除此条数据？</span>
              <span slot="footer" class="dialog-footer">
                <el-button @click="UnitDeleteModelVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitDeleteUnit">确 定</el-button>
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
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
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
      PositionData: [],
      UnitData: [], // 数据
      UnitTreeData: [],
      UnitFormSearce: {
        text: '',
        positionIds: undefined,
        pageSize: 20,
        pageNumber: 1
      },
      UnitTotalCount: 0, // 总条数
      UnitFormTitle: '添加部门', // 表单表头
      UnitFormVisible: false,
      UnitForm: {
        id: undefined,
        parentId: undefined,
        positionIds: undefined,
        name: ''
      },
      UnitFormRules: {
        name: {
          required: true,
          message: '部门名称不可为空',
          trigger: 'blur'
        }
      },
      UnitDeleteModelVisible: false,
      UnitDeleteDataId: null,
      multipleSelectionpUnit: []

    }
  },
  computed: {},
  mounted() {
    this.getData()
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
    // 获取数据
    getData() {
      this.$axios.get('/api/Meta/Unit', { params: this.UnitFormSearce }).then(res => {
        this.UnitData = res.data
        this.UnitTotalCount = res.totalCount
      })
      this.$axios.get('/api/Tree/Unit').then(res => {
        this.UnitTreeData = res
      })
      this.$axios.get('/api/Tree/Position').then(res => {
        this.PositionData = res
      })
    },
    // 分页
    getUnitPage(val) {
      // 展示条数
      this.UnitFormSearce.pageSize = val.limit
      // 页码
      this.UnitFormSearce.pageNumber = val.page
      // 调用获取数据
      this.getData()
    },
    // 表单关闭重置
    UnitFormClose() {
      this.$refs.UnitForm.resetFields()
    },
    // 添加
    addData() {
      this.UnitFormVisible = true// 显示弹框
      this.UnitFormTitle = '添加部门类型'
      this.UnitForm.id = undefined
      this.UnitForm.name = ''
      this.UnitForm.parentId = undefined
      this.UnitForm.positionIds = undefined
    },
    updateUnit(row) {
      if (row === undefined) {
        this.UnitFormTitle = '编辑'
        if (this.multipleSelectionUnit.length !== 1) {
          this.$message.error('请选择一项数据进行操作')
        } else {
          this.UnitFormVisible = true
          this.UnitForm.id = this.multipleSelectionUnit[0].id
          this.UnitForm.name = this.multipleSelectionUnit[0].name
          this.UnitForm.parentId = this.multipleSelectionUnit[0].parent.id
          const position = []
          this.multipleSelectionUnit[0].positions.forEach(item => {
            position.push(item.id)
          })
          this.UnitForm.positionIds = position
        }
      } else {
        this.UnitFormVisible = true
        this.UnitForm.id = row.id
        this.UnitForm.name = row.name
        this.UnitForm.parentId = row.parent.id
        const position = []
        row.positions.forEach(item => {
          position.push(item.id)
        })
        this.UnitForm.positionIds = position
      }
    },
    // 表单提交
    submitUnit() {
      this.$refs.UnitForm.validate(valid => {
        if (valid) {
          if (this.UnitForm.id === undefined) {
            this.$axios.post('/api/Meta/Unit', this.UnitForm).then(res => {
              this.getData()
              this.$message.success('添加成功')
              this.UnitFormVisible = false
            })
          } else {
            this.$axios.put('/api/Meta/Unit/' + this.UnitForm.id, this.UnitForm).then(res => {
              this.getData()
              this.$message.success('修改成功')
              this.UnitFormVisible = false
            })
          }
        }
      })
    },
    // 删除
    deleteUnit(row) {
      if (row === undefined) {
        if (this.multipleSelectionUnit.length !== 1) {
          this.$message.error('请选择一项数据进行操作')
        } else {
          this.UnitDeleteModelVisible = true
          this.UnitDeleteDataId = this.multipleSelectionUnit[0].id
        }
      } else {
        this.UnitDeleteModelVisible = true
        this.UnitDeleteDataId = row.id
      }
    },
    // 提交删除
    submitDeleteUnit() {
      this.$axios.delete('/api/Meta/Unit/' + this.UnitDeleteDataId).then(res => {
        this.getData()
        this.$message.success('删除成功')
        this.UnitDeleteModelVisible = false
      })
    },
    // 表单多选数据
    handleSelectionChangeUnit(val) {
      this.multipleSelectionUnit = val
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
