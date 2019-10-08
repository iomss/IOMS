<template>

  <div class="djalog-box">

    <el-dialog title="运维指标查询-下属考核分数" :visible.sync="changeActiveVisible" :close-on-press-escape="false" :close-on-click-modal="false" width="60%">
      <div class="app-road-fraction">

        <el-row class="average">平均分：222</el-row>
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
              <el-table :data="childnTable" style="width: 100%" size="mini" border fit show-summary>
                <el-table-column
                  prop="name"
                  label="指标名称"
                />
                <el-table-column
                  prop="flg1"
                  label="统计指标"
                />
                <el-table-column
                  prop="flg2"
                  label="指标得分"
                />
                <el-table-column
                  prop="flg3"
                  label="权重"
                />
                <el-table-column
                  prop="flg4"
                  label="加权重得分(指标得分*权重)"
                  width="180"
                />
                <el-table-column label="操作">
                  <el-button size="mini" type="text" @click="handlerOpenWorkOrder">查看工单</el-button>
                </el-table-column>

              </el-table>
              <el-row class="note">
                <el-col :span="2" class="title">备注:</el-col>
                <el-col :span="22" />
              </el-row>
            </template>
          </el-table-column>

          <el-table-column label="编号" prop="id" sortable="custom" align="center" />

          <el-table-column label="所管辖路段和隧道" prop="sos" width="150" align="center" />
          <el-table-column label="总评分" prop="name" align="center" />
          <el-table-column label="考评日期" prop="createTime" align="center" />

          <el-table-column label="考评人" prop="company" align="center" />
          <el-table-column label="备注" prop="company_2" align="center" />

        </el-table>

      </div>
    </el-dialog>

    <el-dialog title="工单" :visible.sync="workOrderVisible" :close-on-press-escape="false" :close-on-click-modal="false" width="80%">
      <div class="app-work-order">
        <el-button type="primary" size="small" class="btn-export">导出</el-button>
        <el-table
          :data="workOrderTable.list"
          border
          size="small"
          style="width: 100%"
        >
          <el-table-column
            prop="date"
            label="工单号"
          />
          <el-table-column
            prop="name"
            label="位置"
            width="100"
          />
          <el-table-column
            prop="address"
            label="设备名称"
          />
          <el-table-column
            prop="address"
            label="故障描述"
          />
          <el-table-column
            prop="address"
            label="状态"
          />
          <el-table-column
            prop="address"
            label="故障时间"
          />
          <el-table-column
            prop="address"
            label="修复时间"
          />
          <el-table-column
            prop="address"
            label="维修员"
          />
          <el-table-column
            prop="address"
            label="验收员"
          />
          <el-table-column
            prop="address"
            label="故障时常(分钟)"
          />
        </el-table>
        <pagination v-show="workOrderTable.total>0" :total="workOrderTable.total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getWrokOrderList" />
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
      table: {
        listLoading: false,
        total: 0,
        list: [{
          id: 1,
          sos: '贡茶一级公路',
          name: 80,
          createTime: '2018/12/23',
          company: '系统管理员'
        }, {
          id: 2,
          sos: '贡茶一级公路',
          name: 80,
          createTime: '2018/12/23',
          company: '系统管理员'
        }]
      },
      childnTable: [{
        name: '嘿嘿',
        flg1: 1,
        flg2: 2,
        flg3: 1,
        flg4: 100
      }],
      workOrderTable: {
        list: [{
          date: '1',
          name: '',
          address: ''
        }],

        total: 20
      },

      listQuery: {
        page: 0,
        limit: 10
      }
    }
  },
  methods: {
    init() {
      this.changeActiveVisible = true
    },

    changeExpand(opt) {
      console.log(opt)
    },

    handlerOpenWorkOrder() {
      this.workOrderVisible = true
    },

    getWrokOrderList() {

    }
  }
}
</script>
