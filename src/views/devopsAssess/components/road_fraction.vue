<template>

  <div class="djalog-box">

    <el-dialog title="运维指标查询-下属考核分数" :visible.sync="changeActiveVisible" :close-on-press-escape="false" :close-on-click-modal="false" width="60%">
      <div class="app-road-fraction">

        <el-row class="average">平均分：{{ avgScore }}</el-row>
        <el-table
          v-loading="table.listLoading"
          :data="table.list"
          border
          fit
          highlight-current-row
          style="width: 100%;"
          size="small"
          @expand-change="changeExpand"
        >

          <el-table-column type="expand">
            <template>
              <el-table :data="childnTable" style="width: 100%" size="mini" border fit show-summary :summary-method="getSummaries">
                <el-table-column
                  prop="assessmentWeight.name"
                  label="指标名称"
                />
                <el-table-column label="统计指标" prop="equipmentIntegrityRate" align="center">
                  <template slot-scope="scope">
                    {{ scope.row.equipmentIntegrityRate?(scope.row.equipmentIntegrityRate+'%'):'-' }}
                  </template>
                </el-table-column>

                <el-table-column
                  prop="rateScore"
                  label="指标得分"
                />
                <el-table-column
                  prop="weight"
                  label="权重"
                />
                <el-table-column label="加权得分" prop="score" align="center">
                  <template slot-scope="scope">
                    {{ scope.row.score.toFixed(2) }}
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button size="mini" type="text" @click="handlerOpenWorkOrder(scope.index, scope.row)">查看工单</el-button>
                  </template>
                </el-table-column>

              </el-table>
              <el-row class="note">
                <el-col :span="2" class="title">备注:</el-col>
                <el-col :span="22">{{ childnTable.remark }}</el-col>
              </el-row>
            </template>
          </el-table-column>

          <el-table-column label="编号" prop="id" sortable="custom" align="center" />

          <el-table-column label="所管辖路段和隧道" prop="position.name" width="150" align="center" />
          <el-table-column label="总评分" prop="totalScore" align="center" />
          <el-table-column label="考评日期" prop="updateTime" align="center" :formatter="formatterDate" />

          <el-table-column label="考评人" prop="createUser.name" align="center" />
          <el-table-column label="备注" prop="remark" align="center" />

        </el-table>

        <pagination v-show="table.total>0" :total="table.total" :page.sync="listQuery.pageNumber" :limit.sync="listQuery.pageSize" @pagination="getTableData" />

      </div>
    </el-dialog>

    <el-dialog title="工单" :visible.sync="workOrderVisible" :close-on-press-escape="false" :close-on-click-modal="false" width="80%">
      <div class="app-work-order">
        <el-button type="primary" size="small" class="btn-export">导出</el-button>
        <el-table
          v-loading="workOrderTable.listLoading"
          :data="workOrderTable.list"
          border
          size="small"
          style="width: 100%"
        >
          <el-table-column
            prop="repairOrderId"
            label="工单号"
          />
          <el-table-column
            prop="repairOrder.position.name"
            label="位置"
            width="100"
          />
          <el-table-column
            prop="repairOrder.equipment.name"
            label="设备名称"
          />
          <el-table-column
            prop="repairOrder.description"
            label="故障描述"
          />
          <el-table-column
            prop="orderState"
            label="状态"
          >
            <template slot-scope="scope">
              {{ scope.row.orderState==="Record"?"待处理":scope.row.orderState==='Dispatching'?"待分配":scope.row.orderState==='Dispatched'?'已分配':scope.row.orderState==='Repair'?'处理中':scope.row.orderState==='Suspend'?'暂缓':scope.row.orderState==='Check'?'待验收':scope.row.orderState==='Review'?'待审核':scope.row.orderState==='Done'?'工单已完成':'报修单流程被终止' }}
            </template>

          </el-table-column>

          <el-table-column
            prop="repairOrder.failureTime"
            label="故障时间"
            :formatter="formatterDate"
          />
          <el-table-column
            prop="repairOrder.lastRepairRecord.startTime"
            label="修复时间"
            :formatter="formatterDate"
          />
          <el-table-column
            prop="repairOrder.lastRepairRecord.repairer.name"
            label="维修员"
          />
          <el-table-column
            prop="repairOrder.lastRepairRecord.checkUser.name"
            label="验收员"
          />
          <el-table-column
            prop="faultMinutes"
            label="故障时常(分钟)"
          />
        </el-table>
      </div>
    </el-dialog>

  </div>

</template>

<style>
.average{
	font-weight: 600;
	margin-bottom: 5px;
}
.note{
	margin-top: 5px;
}
.note .title{
	font-weight: 500;
}
.btn-link{
	color:blue;
}
.btn-export{
	float: right;
  margin-bottom: 5px;
}
</style>

<script>
import pagination from '@/components/Pagination'

export default {
  name: 'RoadFraction',
  components: {
    pagination
  },
  data() {
    return {
      changeActiveVisible: false,
      workOrderVisible: false,
      id: 0,
      avgScore: 0,

      // 总表
      table: {
        listLoading: false,
        total: 0,
        list: [{
          position: {
            name: ''
          },
          id: 1,
          totalScore: 0,
          updateTime: '',
          createUser: {
            name: ''
          },
          remark: ''
        }]
      },

      // 子表
      childnTable: [{
        assessmentWeight: {
          name: ''
        },
        equipmentIntegrityRate: 0,
        weight: 0,
        rateScore: 0,
        score: 0,
        remark: ''
      }],

      // 工单表
      workOrderTable: {
        list: [{
          repairOrderId: 0,
          faultMinutes: 0,

          repairOrder: {
            position: {
              name: ''
            },
            equipment: {
              name: ''
            },
            description: '',
            orderState: '',
            failureTime: '',
            lastRepairRecord: {
              startTime: '',
              repairer: {
                name: ''
              },
              checkUser: {
                name: ''
              }
            }
          }
        }],
        listLoading: false,
        total: 20
      },

      listQuery: {
        beginDate: '',
        endDate: '',

        positionId: 0,
        pageNumber: 1,
        pageSize: 10
      }
    }
  },
  methods: {
    /**
     * 日期格式化
     * @param  {[type]} row       [description]
     * @param  {[type]} column    [description]
     * @param  {[type]} cellValue [description]
     * @return {[type]}           [description]
     */
    formatterDate(row, column, cellValue) {
      if (cellValue !== null) {
        return this.$moment(cellValue).format('YYYY-MM-DD HH:mm:ss')
      } else {
        return cellValue
      }
    },
    init(id, avgScore, beginDate, endDate) {
      if (!id) return
      this.changeActiveVisible = true
      this.listQuery.positionId = id
      this.listQuery.beginDate = beginDate
      this.listQuery.endDate = endDate

      this.avgScore = avgScore

      this.getTableData()
      // this.getWrokOrderList();
    },

    /**
     * 查看子路段数据
     * @param  {[type]} opt [description]
     * @return {[type]}     [description]
     */
    changeExpand(opt) {
      // console.log(opt)
      this.childnTable = opt.assessmentRecordItems
    },

    /**
     * 查看工单数据
     * @return {[type]} [description]
     */
    handlerOpenWorkOrder(index, rows) {
      // debugger
      this.workOrderVisible = true
      this.getWrokOrderList(rows.id)
    },

    /**
     * 获取表格数据
     * @return {[type]} [description]
     */
    getTableData() {
      this.table.listLoading = true
      const queryString = this.$utils.objectToString(this.listQuery)

      this.$axios.get('/api/AssessmentRecord/' + queryString).then(res => {
        this.table.list = res.data
        this.table.total = res.totalCount
        this.table.listLoading = false
      })
    },

    /**
     * 获取工单数据
     * @param  {[type]} id [description]
     * @return {[type]}    [description]
     */
    getWrokOrderList(id) {
      if (!id) return
      this.workOrderTable.listLoading = true
      this.$axios.get('/api/AssessmentRecordItem/' + id).then(res => {
        this.workOrderTable.list = res.assessmentRecordItemRepairOrderMappings
        this.workOrderTable.listLoading = false
      })
    },
    /**
    * 自定义返回合计
    * @return {[type]} [description]
    */
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总价'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value)) && (index === 3 || index === 4)) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)

          sums[index] = sums[index].toFixed(2)
        } else {
          sums[index] = ''
        }
      })
      return sums
    }
  }
}
</script>
