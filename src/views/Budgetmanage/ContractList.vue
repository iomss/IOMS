<!-- 合同测算预算页面 -->
<template>
  <div>
    <el-row>
      <el-col>
        <div class="panel">
          <div class="header">
            <div class="tools">
              <span>生成预算：</span>
              <el-button type="success" size="small" @click="create('HardMaintain')">硬件维护</el-button>
              <el-button type="primary" size="small" @click="create('SoftMaintain')">软件维护</el-button>
              <el-button type="success" size="small" @click="create('InformationSecurity')">信息安全</el-button>
              <el-button type="primary" size="small" @click="create('HardRepair')">硬件维修</el-button>
              <el-button type="warning" size="small" @click="create('SoftRepair')">软件维修</el-button>
              <!-- <el-button type="warning" size="small" @click="changeRate()">修改折扣</el-button> -->
              <el-button type="warning" size="small" @click="setvalidSubmit()">设为有效</el-button>
              <el-button type="warning" size="small" @click="removeSubmit()">删除</el-button>
            </div>
            <div class="toolsrt">
              <el-form ref="form" :model="formSearch" label-width="60px">
                <el-form-item label="版本号" prop="code">
                  <el-input v-model="formSearch.code" placeholder="版本号" size="small" />
                </el-form-item>
                <el-form-item label="年度" prop="year">
                  <el-select v-model="formSearch.year" filterable clearable size="small">
                    <el-option v-for="(item,index) in yearData" :key="index" :label="item" :value="item" />
                  </el-select>
                </el-form-item>
                <el-form-item label="路段" prop="postionId">
                  <treeselect v-model="formSearch.postionId" :normalizer="normalizer" :options="positionData" :load-options="loadOptions" placeholder="安装位置" no-results-text="未找到相关数据" />
                </el-form-item>
                <el-form-item label="状态" prop="isValid">
                  <el-select v-model="formSearch.isValid" placeholder="状态" size="small">
                    <el-option key="全部" label="全部" value="" />
                    <el-option key="无效" label="无效" value="false" />
                    <el-option key="有效" label="有效" value="true" />
                  </el-select>
                </el-form-item>
                <el-form-item label="类型" prop="type">
                  <el-select v-model="formSearch.type" clearable placeholder="类型" size="small">
                    <el-option key="all" label="全部" value="" />
                    <el-option v-for="(item,index) in typeData" :key="index" :label="item.name" :value="item.value" />
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
              <el-table-column prop="code" label="版本号">
                <template slot-scope="scope">
                  <router-link :to="'/Budgetmanage/ContractInfo/'+scope.row.id" tag="a" style="color:#409eff">{{ scope.row.code }}</router-link>
                </template>
              </el-table-column>
              <el-table-column prop="year" label="年份" />
              <el-table-column prop="position.name" label="单位" />
              <el-table-column prop="totalCount" label="数量/次数" />
              <el-table-column prop="discount" label="折扣率" />
              <el-table-column prop="totalPrice" label="总金额" />
              <el-table-column prop="createTime" label="创建时间" :formatter="formatterDate" />
              <el-table-column prop="isValid" label="是否有效">
                <template slot-scope="scope">
                  {{ scope.row.isValid?"有效":"无效" }}
                </template>
              </el-table-column>
              <el-table-column prop="operationType" label="类型">
                <template slot-scope="scope">
                  {{ scope.row.operationType==='HardMaintain'?"硬件维护":scope.row.operationType==='SoftMaintain'?'软件维护':scope.row.operationType==='InformationSecurity'?'信息安全':scope.row.operationType==='HardRepair'?'硬件维修':scope.row.operationType==='SoftRepair'?'软件维修':'' }}
                </template>
              </el-table-column>
            </el-table>
            <!-- 创建预算 -->
            <el-dialog :title="createFormTitle" :visible.sync="createFormVisibale" :close-on-press-escape="false" :close-on-click-modal="false" width="450px">
              <el-form ref="createForm" :model="createForm" :rules="createFormRules" label-width="120px">
                <el-form-item label="预算年度" prop="year">
                  <el-select v-model="createForm.year" filterable clearable>
                    <el-option v-for="(item,index) in yearData" :key="index" :label="item" :value="item" />
                  </el-select>
                </el-form-item>
                <el-form-item label="单位" prop="postionId">
                  <treeselect v-model="createForm.postionId" :normalizer="normalizer" :options="positionData" :load-options="loadOptions" placeholder="安装位置" no-results-text="未找到相关数据" />
                </el-form-item>
                <el-form-item label="折扣率" prop="discount">
                  <el-input v-model="createForm.discount" placeholder="折扣率%">
                    <template slot="append">%</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="记住上一版设备数量与维护次数" prop="remeberLast">
                  <el-switch v-model="createForm.remeberLast" active-text="是" inactive-text="否" />
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="createFormVisibale=false">关闭</el-button>
                <el-button type="primary" @click="submitCreateForm()">确定</el-button>
              </span>
            </el-dialog>

            <!--分页-->
            <pagination v-show="totalCount>0" :total="totalCount" :page.sync="formSearch.pageNumber" :limit.sync="formSearch.pageSize" @pagination="getPage" />
            <!--删除-->
            <el-dialog ref="removeData" title="提示" :close-on-press-escape="false" :close-on-click-modal="false" :visible.sync="removeVisible" width="220px">
              <span>您确定要删除此条数据？</span>
              <span slot="footer" class="dialog-footer">
                <el-button @click="removeVisible = false">取 消</el-button>
                <el-button type="primary" @click="removeSubmit">确 定</el-button>
              </span>
            </el-dialog>
            <!--设为生效-->
            <el-dialog ref="setValid" title="提示" :close-on-press-escape="false" :close-on-click-modal="false" :visible.sync="setValidVisible" width="220px">
              <span>您确定要生效此条数据？</span>
              <span slot="footer" class="dialog-footer">
                <el-button @click="setValidVisible = false">取 消</el-button>
                <el-button type="primary" @click="setvalidSubmit">确 定</el-button>
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
// 节流
const simulateAsyncOperation = fn => {
  setTimeout(fn, 500)
}
import pagination from '@/components/Pagination'
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
      formSearch: {
        code: '',
        year: '',
        postionId: null,
        type: '',
        isValid: '',
        pageSize: 10, // 展示条数
        pageNumber: 1 // 页码
      },
      totalCount: 0, // 数据总条数
      multipleSelection: '', // 表单选中行
      tableData: [], // 表格数据
      yearData: [2019, 2020], // 年份数据
      positionData: [], // 位置数据
      typeData: [
        { name: '硬件维护', value: 'HardMaintain' },
        { name: '软件维护', value: 'SoftMaintain' },
        { name: '信息安全', value: 'InformationSecurity' },
        { name: '硬件维修', value: 'HardRepair' },
        { name: '软件维修', value: 'SoftRepair' }
      ], // 类型数据
      createFormVisibale: false, // 添加表单显示隐藏
      createFormTitle: '', // 添加表单标题
      createForm: {
        type: '', // 类型
        year: null, // 年份
        postionId: null, // 单位
        discount: null, // 折扣率
        remeberLast: false// 记住上一版设备数量与维护次数
      }, // 添加表单
      createFormRules: {
        year: {
          required: true,
          message: '预算年度不可为空',
          trigger: 'blur'
        },
        postionId: {
          required: true,
          message: '相关单位不可为空',
          trigger: 'change'
        }
      }, // 添加表单验证规则
      setValidVisible: false, // 设为有效弹框
      removeVisible: false// 删除弹框

    }
  },
  computed: {},
  mounted() {
    this.getData()
    this.getPositionData()
  },
  methods: {
    formatterDate(row, column, cellValue) {
      if (cellValue !== null) {
        return this.$moment(cellValue).format('YYYY-MM-DD HH:mm')
      } else {
        return cellValue
      }
    },
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
      this.$axios.get('/api/Budget', { params: this.formSearch }).then(res => {
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
      this.getData()
    },
    getPositionData() {
      // 获取所属系统
      this.$axios.get('/api/Tree/Position').then(res => {
        this.positionData = res
      })
    },
    // 创建
    create(type) {
      switch (type) {
        case 'HardMaintain':
          this.createFormTitle = '生成硬件维护预算'
          break
        case 'SoftMaintain':
          this.createFormTitle = '生成软件维护预算'
          break
        case 'InformationSecurity':
          this.createFormTitle = '生成信息安全预算'
          break
        case 'HardRepair':
          this.createFormTitle = '生成硬件维修预算'
          break
        case 'SoftRepair':
          this.createFormTitle = '生成软件维修预算'
          break
        default:
          break
      }
      this.createForm.type = type
      this.createFormVisibale = true
      this.createForm.year = null
      this.createForm.postionId = null
      this.createForm.discount = null
      this.createForm.remeberLast = false
    },
    // 提交创建表单
    submitCreateForm() {
      this.$refs.createForm.validate(valid => {
        if (valid) {
          this.$axios.post('/api/Budget', this.createForm).then(res => {
            this.$message.success(this.createFormTitle + this.createForm.year + '版成功')
            this.createFormVisibale = false
            this.getData()
          })
        }
      })
    },
    // table 数据选中
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    setvalid(row) { // 设置有效
      if (row === undefined) {
        if (this.multipleSelection.length !== 1) {
          this.$message.error('请选择一项数据进行操作')
        } else {
          this.setValidVisible = true
        }
      } else {
        this.setValidVisible = true
      }
    },
    // 设为有效
    setvalidSubmit() {
      this.$axios.post('/api/Budget/' + this.multipleSelection[0].id).then(res => {
        this.$message.success('预算版本生效成功')
        this.getData()
        this.setValidVisible = false
      })
    },
    // 删除
    remove() {
      if (this.multipleSelection.length !== 1) {
        this.$message.error('请选择一项数据进行操作')
      } else {
        this.removeVisible = true
      }
    },
    removeSubmit() {
      const _this = this
      this.$axios.delete('/api/Budget/' + this.multipleSelection[0].id).then(response => {
        _this.$message.success('预算版本删除成功')
        _this.removeVisible = false
        this.getData()
      })
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
  .el-select {
    width: 100%;
  }
}
</style>
