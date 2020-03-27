<!-- 备品备件管理-入库页面 -->
<template>
  <el-col>
    <el-row>
      <el-col>
        <el-row class="panel">
          <div class="header">
            <!-- <div class="tools">
              <el-button type="primary" size="small" @click="assetsExport()">导出全部</el-button>
              <el-button type="danger" size="small" @click="assetsExport(true)">选择导出</el-button>
            </div> -->
            <div class="toolsrt">
              <el-form ref="form" :model="formSearch" label-width="70px">
                <el-input v-model="formSearch.text" placeholder="工单号" size="small" />
                <el-select v-model="formSearch.equipmentId" filterable remote :remote-method="remoteMethodequipmentID" clearable :loading="loading" placeholder="资产类别" size="small" @focus="remoteMethodequipmentID">
                  <el-option v-for="item in equipmentData" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
                <el-date-picker v-model="formSearch.beginTime" placeholder="报修开始时间" size="small" />
                <el-date-picker v-model="formSearch.endTime" placeholder="报修结束时间" size="small" />
                <div style="width:300px;display:inline-block;margin-right:20px;margin-bottom:-15px;">
                  <treeselect v-model="formSearch.positionId" :normalizer="normalizer" :options="positionTreeData" :load-options="loadOptions" placeholder="设备位置" no-results-text="未找到相关数据" />
                </div>
                <el-button type="primary" plain size="small" @click="getData()">查询</el-button>
              </el-form>
            </div>
          </div>
          <el-col class="content">
            <el-table :data="tableData" stripe border style="width: 100%">
              <!-- @selection-change="handleSelectionChange" -->
              <el-table-column type="selection" />
              <el-table-column type="index" label="序号" />
              <el-table-column prop="code" label="维修单编号">
                <template slot-scope="scope">
                  <!-- 验收状态，审核状态，录入维修记录状态，完成状态可查看详情 -->
                  <router-link v-if="scope.row.orderState === 'Check' || scope.row.orderState === 'Review' || scope.row.orderState === 'Done' || scope.row.orderState === 'Repair'" :to="'/Workorder/CheckedInfo/' + scope.row.id" tag="a" style="color:#409eff">{{ scope.row.code }}</router-link>
                  <!-- 接单转单抢单不可查看详情 -->
                  <div v-if="scope.row.orderState === 'Dispatching' || scope.row.orderState === 'Record' || scope.row.orderState === 'Dispatched'">{{ scope.row.code }}</div>
                </template>
              </el-table-column>
              <el-table-column prop="repairUser.name" label="维修工程师" />
              <el-table-column prop="orderState" label="工单状态">
                <template slot-scope="scope">
                  {{ scope.row.orderState === 'Record' ? '待处理' : scope.row.orderState === 'Dispatching' ? '待分配' : scope.row.orderState === 'Dispatched' ? '已分配' : scope.row.orderState === 'Repair' ? '处理中' : scope.row.orderState === 'Suspend' ? '暂缓' : scope.row.orderState === 'Check' ? '待验收' : scope.row.orderState === 'Review' ? '待审核' : scope.row.orderState === 'Done' ? '工单已完成' : '报修单流程被终止' }}
                </template>
              </el-table-column>
              <el-table-column prop="reportTime" label="报修时间" :formatter="formatterDate" />
              <el-table-column prop="repairRecord.startTime" label="维修开始时间" :formatter="formatterDate" />
              <el-table-column prop="repairRecord.endTime" label="维修结束时间" :formatter="formatterDate" />
              <el-table-column prop="repairRecord.checkTime" label="验收时间" :formatter="formatterDate" />
              <el-table-column prop="position.crumbName" label="设备位置" width="200" />
              <el-table-column prop="equipment.name" label="资产名称" />
              <el-table-column prop="equipmentFault.name" label="故障类型" />
              <el-table-column prop="description" label="故障描述" width="200" />
              <el-table-column prop="repairRecord.description" label="维修过程" />
            </el-table>
            <pagination v-show="totalCount>0" :total="totalCount" :page.sync="formSearch.pageNumber" :limit.sync="formSearch.pageSize" @pagination="getPage" />
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </el-col>
</template>
<script>
import { Treeselect, LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import pagination from '@/components/Pagination'
const simulateAsyncOperation = fn => {
  setTimeout(fn, 500)
}
export default {
  name: 'InstockListList',
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
      dangqianUser: {
        userName: this.$cookie.get('trueName'),
        id: this.$cookie.get('id')
      },
      formSearch: {
        beginTime: '', // 开始时间
        endTime: '', // 结束时间
        code: '', // 搜索文本
        positionId: '', // 设备位置
        equipmentname: '', // 设备名称
        pageSize: 10, // 展示条数
        pageNumber: 1 // 页码
      },
      totalCount: 0, // 数据总条数
      tableData: [],
      positionTreeData: [], // 安装位置数据
      equipmentData: [],
      multipleSelection: '',
      removeQuestionVisible: false, // 删除弹框
      infoVisible: false,
      Info: ''
      /* ******* 选择备件结束 ****** */
    }
  },
  computed: {},
  mounted() {
    this.getData()
    this.getpositionData()
    // this.getequipmentData()
  },
  methods: {
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
    checkhasChildren(data) {
      // 位置数据遍历
      data.forEach((item, index) => {
        if (item.children === null) {
          item.children = undefined
        } else {
          this.checkhasChildren(item.children)
        }
      })
      return data
    },
    //* ******************************************************************************公用代码**************************************************************** *//
    // 投用时间日期时间格式化
    formatterDate(row, column, cellValue) {
      if (cellValue !== null) {
        return this.$moment(cellValue).format('YYYY-MM-DD HH:mm')
      } else {
        return cellValue
      }
    },
    //* ******************************************************************************页面列表**************************************************************** *//
    getData() {
      if (this.formSearch.code !== '') {
        this.formSearch.pageNumber = 1
      }
      this.$axios.get('/api/RepairOrder/All', { params: this.formSearch }).then(res => {
        this.tableData = res.data
        this.totalCount = res.totalCount
      })
    },
    // getequipmentData() {
    //   // 获取资产类别
    //   this.$axios.get('/api/Meta/equipment?pageSize=' + this.equipmentpage.pageSize + '&pageNumber=' + this.equipmentpage.pageNumber).then(res => {
    //     this.equipmentData = this.equipmentData.concat(res.data)
    //   })
    // },
    getpositionData() {
      // 获取设备位置
      this.$axios.get('/api/Tree/Position').then(res => {
        this.positionTreeData = this.checkhasChildren(res)
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
    remoteMethodequipmentID(query) {
      this.loading = true
      let querytext = ''
      querytext = typeof (query) === 'string' ? query : ''
      this.$axios.get('/api/Meta/Equipment?text=' + querytext).then(res => {
        this.loading = false
        this.equipmentData = res.data
      })
    },
    assetsExport(exportSelect) {
      debugger
      const p = exportSelect === true ? { ...this.formSearch, ids: this.multipleSelection.map(x => x.id) } : this.formSearch
      this.$axios.post('/api/Assets/ExportExcel', p, { Accept: {
        'Content-Type': 'application/json;application/octet-stream'
      }, responseType: 'blob' }).then(res => {
        const url = window.URL.createObjectURL(new Blob([res.data]))
        const link = document.createElement('a')
        const fileName = res.headers['content-disposition'].match(/filename=(.*)/)[1]
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', decodeURI(fileName))
        document.body.appendChild(link)
        link.click()
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
  // width: 400px;
  // display: inline-block;
}
.toolsrt {
  // width: 30%;
  display: inline-block;
  margin-bottom: 20px;
  .el-input {
    width: 200px;
  }
}
.ruku {
  .el-form-item {
    width: 33%;
    display: inline-block;
    .el-select {
      width: 100%;
    }
    .el-date-editor {
      width: 100%;
    }
  }
}

.form_total {
  width: 100%;
  text-align: center;
}
.dialog-footer {
  display: block;
  width: 100%;
  text-align: center;
}
.content {
  .el-table th,
  .el-table td {
    padding: 5px;
  }
}
</style>
