<!-- 位置页面 -->
<template>
  <div>
    <el-row>
      <el-col>
        <div class="panel">
          <div class="header">
            <div class="search">
              <el-input v-model="positionFormSearce.text" placeholder="全局查询" size="small" />
              <el-button type="primary" size="small" @click="getData()">查询</el-button>
              <el-button type="success" size="small" @click="addData()">添加</el-button>
              <el-button type="warning" size="small" @click="updatePosition()">修改</el-button>
              <el-button type="danger" size="small" @click="deletePosition()">删除</el-button>
            </div>
          </div>
          <div class="content">
            <el-table :data="positionData" stripe border style="width: 100%" @selection-change="handleSelectionChangePosition">
              <el-table-column type="selection" width="40" />
              <el-table-column type="index" label="序号" />
              <el-table-column prop="name" label="位置" />
              <el-table-column prop="parentName" label="上级位置" />
              <el-table-column prop="" label="位置类型">
                <template slot-scope="scope">
                  {{ scope.row.positionType.name }}
                </template>
              </el-table-column>
            </el-table>
            <pagination v-show="positionTotalCount>0" :total="positionTotalCount" :page.sync="positionFormSearce.pageNumber" :limit.sync="positionFormSearce.pageSize" @pagination="getpositionPage" />

            <el-dialog :title="positionFormTitle" :visible.sync="positionFormVisible" :close-on-press-escape="false" :close-on-click-modal="false" width="450px" @close="positionFormClose">
              <el-form ref="positionForm" :model="positionForm" :rules="positionFormRules" label-width="120px">
                <el-form-item label="位置" prop="name">
                  <el-input v-model="positionForm.name" placeholder="位置" size="small" />
                </el-form-item>
                <el-form-item label="上级位置">
                  <treeselect v-model="positionForm.parentId" :normalizer="normalizer" :options="positionTreeData" :load-options="loadOptions" placeholder="请选择上级位置" no-results-text="未找到相关数据" />
                </el-form-item>
                <el-form-item label="位置类型" prop="positionTypeId">
                  <el-select v-model="positionForm.positionTypeId" size="small" filterable remote :remote-method="remoteMethodType" :loading="loading" placeholder="请选择" @focus="remoteMethodType">
                    <el-option v-for="item in postiontTypeData" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="positionFormVisible=false">关闭</el-button>
                <el-button type="primary" @click="submitPosition()">提交</el-button>
              </span>
            </el-dialog>

            <el-dialog ref="removeData" title="提示" :close-on-press-escape="false" :close-on-click-modal="false" :visible.sync="positionDeleteModelVisible" width="220px">
              <span>您确定要删除此条数据？</span>
              <span slot="footer" class="dialog-footer">
                <el-button @click="positionDeleteModelVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitDeletePosition">确 定</el-button>
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
      loading: false, // 远程搜索
      positionData: [], // 数据
      positionTreeData: [],
      postiontTypeData: [],
      positionFormSearce: {
        text: '',
        pageSize: 20,
        pageNumber: 1
      },
      positionTotalCount: 0, // 总条数
      positionFormTitle: '添加位置', // 表单表头
      positionFormVisible: false,
      positionForm: {
        id: undefined,
        positionTypeId: undefined,
        parentId: undefined,
        name: ''
      },
      positionFormRules: {
        name: {
          required: true,
          message: '位置名称不可为空',
          trigger: 'blur'
        },
        positionTypeId: {
          required: true,
          message: '位置类型不可为空',
          trigger: 'blur'
        }
      },
      positionDeleteModelVisible: false,
      positionDeleteDataId: null,
      multipleSelectionpPosition: []

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
      this.$axios.get('/api/Meta/Position', { params: this.positionFormSearce }).then(res => {
        this.positionData = res.data
        this.positionTotalCount = res.totalCount
      })
      this.$axios.get('/api/Tree/Position').then(res => {
        this.positionTreeData = res
      })
      this.$axios.get('/api/Meta/PositionType', { params: { pageNumber: 1, pageSize: 50 }}).then(res => {
        this.postiontTypeData = this.postiontTypeData.concat(res.data)
      })
    },
    // 分页
    getpositionPage(val) {
      // 展示条数
      this.positionFormSearce.pageSize = val.limit
      // 页码
      this.positionFormSearce.pageNumber = val.page
      // 调用获取数据
      this.getData()
    },
    // 表单关闭重置
    positionFormClose() {
      this.$refs.positionForm.resetFields()
    },
    remoteMethodType(query) {
      this.loading = true
      let querytext = ''
      querytext = typeof (query) === 'string' ? query : ''
      this.$axios.get('/api/Meta/PositionType?text=' + querytext).then(res => {
        this.loading = false
        this.postiontTypeData = res.data
      })
    },
    // 添加
    addData() {
      this.positionFormVisible = true// 显示弹框
      this.positionFormTitle = '添加位置类型'
      this.positionForm.id = undefined
      this.positionForm.name = ''
      this.positionForm.parentId = undefined
      this.positionForm.positionTypeId = undefined
    },
    updatePosition(row) {
      if (row === undefined) {
        this.positionFormTitle = '编辑'
        if (this.multipleSelectionPosition.length !== 1) {
          this.$message.error('请选择一项数据进行操作')
        } else {
          this.positionFormVisible = true
          this.positionForm.id = this.multipleSelectionPosition[0].id
          this.positionForm.name = this.multipleSelectionPosition[0].name
          this.positionForm.parentId = this.multipleSelectionPosition[0].parentId
          this.positionForm.positionTypeId = this.multipleSelectionPosition[0].positionType.id
        }
      } else {
        this.PositionFormVisible = true
        this.PositionForm.id = row.id
        this.PositionForm.name = row.name
        this.positionForm.parentId = row.parentId
        this.positionForm.positionTypeId = row.positionType.id
      }
    },
    // 表单提交
    submitPosition() {
      this.$refs.positionForm.validate(valid => {
        if (valid) {
          if (this.positionForm.id === undefined) {
            this.$axios.post('/api/Meta/Position', this.positionForm).then(res => {
              this.getData()
              this.$message.success('添加成功')
              this.positionFormVisible = false
            })
          } else {
            this.$axios.put('/api/Meta/Position/' + this.positionForm.id, this.positionForm).then(res => {
              this.getData()
              this.$message.success('修改成功')
              this.positionFormVisible = false
            })
          }
        }
      })
    },
    // 删除
    deletePosition(row) {
      if (row === undefined) {
        if (this.multipleSelectionPosition.length !== 1) {
          this.$message.error('请选择一项数据进行操作')
        } else {
          this.positionDeleteModelVisible = true
          this.positionDeleteDataId = this.multipleSelectionPosition[0].id
        }
      } else {
        this.positionDeleteModelVisible = true
        this.positionDeleteDataId = row.id
      }
    },
    // 提交删除
    submitDeletePosition() {
      this.$axios.delete('/api/Meta/Position/' + this.positionDeleteDataId).then(res => {
        this.getData()
        this.$message.success('删除成功')
        this.positionDeleteModelVisible = false
      })
    },
    // 表单多选数据
    handleSelectionChangePosition(val) {
      this.multipleSelectionPosition = val
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
