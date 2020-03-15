<!-- 维修工程师转单页面 -->
<template>
  <div>
    <el-row>
      <el-col>
        <div class="panel">
          <div class="header">
            <h4>维修转单详情</h4>
            <div v-if="formData.code!==''" class="formData">
              <ul>
                <el-form ref="form" :model="formData" label-width="90px">
                  <el-row>
                    <el-col :span="8">
                      <el-form-item label="维修单编号" prop="code" :disabled="showedit" size="small">
                        {{ formData.code }}
                      </el-form-item>
                    </el-col>
                    <el-col :span="16">
                      <el-form-item v-show="btshow" label="报修位置" prop="positionId" size="small">
                        {{ formData.position.crumbName }}
                      </el-form-item>
                      <el-form-item v-show="btedit" label="报修位置" prop="positionId" :disabled="showedit" style="margin-bottom:-20px;">
                        <treeselect v-model="formData.positionId" :disable-branch-nodes="true" :normalizer="normalizer" :disabled="showedit" :options="positionTreeData" :load-options="loadOptions" placeholder="安装位置" no-results-text="未找到相关数据">
                          <div slot="value-label" slot-scope="{ node }">{{ node.raw.crumbsName }}</div>
                        </treeselect>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="8">
                      <el-form-item v-show="btshow" label="资产名称" prop="equipmentId" size="small">
                        {{ formData.equipment.name }}
                      </el-form-item>
                      <el-form-item v-show="btedit" label="资产名称" :disabled="showedit" prop="equipmentId">
                        <el-select v-model="formData.assetId" filterable remote :remote-method="remoteMethodequipmentID" popper-class="optionsContent" :loading="loading" placeholder="设备种类" size="small" @change="changeEquipment" @focus="remoteMethodequipmentID">
                          <el-option v-for="item in equipmentname" :key="item.alias" :label="item.alias" :value="item.id" :disabled="item.disabled">
                            <span style="float: left">{{ item.code }}</span>
                            <span style="float: left">{{ item.id }}</span>
                            <span style="float: left">{{ item.alias }}</span>
                            <span style="float: left">{{ item.brand.name }}</span>
                            <span style="float: left">{{ item.model.name }}</span>
                            <span style="float: left">{{ item.equipment.id }}</span>
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="16">
                      <el-form-item label="资产编码" :disabled="showedit" prop="assetCode">
                        {{ formData.assetCode }}
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="8">
                      <el-form-item v-show="btshow" label="故障时间" prop="failureTime">
                        {{ formData.failureTime }}
                      </el-form-item>
                      <el-form-item v-show="btedit" label="故障时间" prop="failureTime">
                        <el-date-picker v-model="formData.failureTime" type="datetime" placeholder="故障时间" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="16">
                      <el-form-item label="录入人" prop="reporterName">
                        {{ formData.recordUser.name }}
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-form-item v-show="btshow" label="故障描述" class="total" prop="description">
                      {{ formData.description }}
                    </el-form-item>
                    <el-form-item v-show="btedit" label="故障描述" class="total" prop="description">
                      <el-input v-model="formData.description" placeholder="故障描述" :disabled="false" size="small" />
                    </el-form-item>
                  </el-row>
                  <el-row>
                    <el-col :span="8">
                      <el-form-item v-show="btshow" label="故障类型" class="showtishi" prop="equipmentFaultId">
                        {{ formData.equipmentFault.name }}
                      </el-form-item>
                      <el-form-item v-show="btedit" label="故障类型" class="showtishi" prop="equipmentFaultId">
                        <el-select v-model="formData.equipmentFaultId" filterable remote :remote-method="remoteMethodefaultID" :loading="loading" placeholder="故障类型" :disabled="showedit" size="small" @focus="remoteMethodefaultID" @change="selectChange">
                          <el-option v-for="item in faultData" :key="item.id" :label="item.name" :value="item.id" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="16">
                      <el-form-item v-show="btshow" label="报修级别" class="showtishi" prop="repairLevelId">
                        {{ formData.repairLevel.name }}
                      </el-form-item>
                      <el-form-item v-show="btedit" label="报修级别" class="showtishi" prop="repairLevelId" @change="selectChange">
                        <el-select v-model="formData.repairLevelId" filterable placeholder="故障级别" :disabled="showedit" size="small">
                          <el-option v-for="item in levelData" :key="item.id" :label="item.name" :value="item.id" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="8">
                      <el-form-item label="报修人" prop="reporterName">
                        {{ formData.recordUser.name }}
                      </el-form-item>
                    </el-col>
                    <el-col :span="16">
                      <el-form-item label="报修时间" prop="reportTime">
                        {{ formData.reportTime }}
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="8">
                      <el-form-item label="派工次数" prop="dispatchCount">
                        {{ formData.dispatchCount }}
                      </el-form-item>
                    </el-col>
                    <el-col :span="16">
                      <el-form-item label="维修次数" prop="repairCount">
                        {{ formData.repairCount }}
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <li>
                    <el-form-item label="派工:">
                      <el-select v-model="formData.repairUserId" v-loadmore="loadMoreuser" clearable filterable placeholder="派工" size="small">
                        <el-option v-for="item in userData" :key="item.id" :label="item.trueName" :value="item.id" />
                      </el-select>
                    </el-form-item>
                  </li>
                </el-form>
              </ul>
            </div>
          </div>
        </div>
        <div class="content">
          <!-- v-if="roles.indexOf('DispatchUpdate') >-1" -->
          <el-button v-show="btshow" type="primary" size="small" @click="edit()">编辑</el-button>
          <el-button v-show="btedit" type="primary" size="small" @click="repartwork()">编辑并分配工单</el-button>
          <el-button v-show="btshow" type="primary" size="small" @click="partwork()">分配工单</el-button>
          <el-button type="primary" size="small" @click="processrecord()">过程记录</el-button>
          <el-button type="danger" size="small" @click="closework()">关闭</el-button>
        </div>
        <el-dialog title="过程记录" :visible.sync="showInfopast" :close-on-press-escape="false" :close-on-click-modal="false" width="1500px" :show-close="false">
          <div class="titletext">派单记录</div>
          <el-table :data="logsDatapd" border style="width: 100%">
            <el-table-column prop="inputUser" label="指派人">
              <template slot-scope="scope">
                {{ scope.row.inputUser.name }}
              </template>
            </el-table-column>
            <el-table-column prop="dispatchTime" label="指派时间" :formatter="formatterDate" />
            <el-table-column prop="repairer" label="接收人">
              <template slot-scope="scope">
                {{ scope.row.repairer.name }}
              </template>
            </el-table-column>
            <el-table-column prop="operate" label="备注" />
          </el-table>
          <div class="titletext">维修记录</div>
          <el-table :data="logsDatawx" border style="width: 100%">
            <el-table-column prop="repairType" label="维修单类型">
              <template slot-scope="scope">
                {{ scope.row.repairType=='Done'?'维修完成':scope.row.repairType=='Repeat'?'重复报修':scope.row.repairType=='Mistaken'?'误报':'暂缓' }}
              </template>
            </el-table-column>
            <el-table-column prop="equipment" label="资产名称" />
            <el-table-column prop="assetCode" label="设备编号" />
            <el-table-column prop="equipmentFault" label="故障类型" />
            <el-table-column prop="repairLevel" label="维修级别" />
            <el-table-column prop="startTime" label="维修开始时间" :formatter="formatterDate" />
            <el-table-column prop="endTime" label="维修结束时间" :formatter="formatterDate" />
            <el-table-column prop="description" label="维修过程" />
            <el-table-column prop="spareDescription" label="配件名称及数量" />
            <el-table-column prop="repairer" label="维修人" />
          </el-table>
          <div class="dialog-footer">
            <el-button type="primary" @click="showInfopast = false">关闭</el-button>
          </div>
        </el-dialog>
      </el-col>
    </el-row>
  </div>
</template>
<script>

import { Treeselect, LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
// 节流
const simulateAsyncOperation = fn => {
  setTimeout(fn, 500)
}
export default {
  name: 'WorkorderMaintainerChangeOrder',
  components: {
    Treeselect
  },
  data() {
    return {
      roles: this.$cookie.get('roles').split(','),
      showInfopast: false,
      logsDatapd: [], // 派单记录表格
      logsDatawx: [], // 维修记录表格
      btshow: true,
      btedit: false,
      showedit: true,
      formData: {
        code: '',
        assetId: '',
        positionId: '',
        positionName: '',
        equipment: '',
        equipmentId: '',
        failureTime: '',
        reportTime: '',
        equipmentFaultId: '',
        reporterName: '',
        description: '',
        repairLevelId: '',
        repairUserId: '',
        proxy: true
      },
      tableDataSearch: {
        text: '', // 搜索文本
        pageSize: 10, // 展示条数
        pageNumber: 1, // 页码
        positionIds: [], // 树选中值
        systemId: '', // 所属系统选中值
        includeRepairinfo: true
      },
      normalizer(node) {
        return {
          id: node.id,
          label: node.name,
          children: node.children
        }
      },
      faultData: [], // 故障类型数据
      levelData: [], // 故障级别数据
      equipmentname: [],
      positionTreeData: [], // 安装位置数据
      faultpage: {
        // 故障类型分页
        pageNumber: 1,
        pageSize: 50,
        pageCount: '',
        equipmentId: undefined
      },
      equipmentpage: {
        // 资产类别分页
        pageNumber: 1,
        pageSize: 5,
        pageCount: ''
      },
      loading: false, // 远程搜索
      userData: [], // 用户数据
      updateData: {
        id: '',
        userId: '',
        dispatchType: 'Transfer'// 转单
      },
      userpage: {// 指定工程师分页
        pageNumber: 1,
        pageSize: 10,
        pageCount: ''
      }
    }
  },
  computed: {},
  mounted() {
    this.getdata()
    this.getuserData()
    this.getpositionData()
    this.getfaultData()
    this.getlevelData()
    this.getassetData()
  },
  methods: {
    formatterDate(row, column, cellValue) {
      if (cellValue !== null) {
        return this.$moment(cellValue).format('YYYY-MM-DD HH:mm')
      } else {
        return cellValue
      }
    },
    getdata() {
      // 获取维修详情数据
      this.formData.assetId = window.location.href.split('/')[window.location.href.split('/').length - 1]
      this.$axios.get('/api/RepairOrder/' + this.formData.assetId).then(res => {
        this.formData = res
        this.formData.failureTime = this.$moment(res.failureTime).format('YYYY-MM-DD HH:mm')
        this.formData.reportTime = this.$moment(res.reportTime).format('YYYY-MM-DD HH:mm:ss')
        this.updateData.id = res.id
      })
    },
    edit() { // 点击编码显示详情
      this.formData.positionId = this.formData.position.id
      this.formData.equipmentFaultId = this.formData.equipmentFault.id
      this.formData.repairLevelId = this.formData.repairLevel.id
      this.btshow = false
      this.btedit = true
      this.showedit = false
      this.remoteMethodequipmentID('')
      let assetsData = false
      this.equipmentname.forEach(item => { item.id === this.formData.assetId ? assetsData = true : '' })
      assetsData ? '' : this.equipmentname.push(this.formData)
      this.formData.equipmentId = this.formData.equipment.id
      this.remoteMethodefaultID('')
      let efaultData = false
      this.faultData.forEach(item => { item.id === this.formData.equipmentFaultId ? efaultData = true : '' })
      efaultData ? '' : this.faultData.push(this.formData)
    },
    selectchange() { // 点击编码显示详情
      this.$forceUpdate()
    },
    changeEquipment(e) { // 设备种类筛选设备编码
      this.obj = this.equipmentname.find((item) => {
        return item.id === e
      })
      this.formData.assetCode = this.obj.code
      this.formData.equipmentId = this.obj.equipment.id
      this.formData.equipmentFaultId = ''
      this.faultpage.equipmentId = this.obj.equipment.id
      // 设备种类筛选故障类型
      this.$axios.get('/api/Meta/Fault', { params: this.faultpage }).then(res => {
        this.faultData = res.data
      })
    },
    getuserData() {
      // 获取用户
      this.$axios.get('/api/User?Dispatch=true&pageSize=' + this.userpage.pageSize + '&pageNumber=' + this.userpage.pageNumber).then(res => {
        this.userData = this.userData.concat(res.data)
        this.userpage.pageCount = res.pageCount
      })
    },
    loadMoreuser() {
      if (this.userpage.pageCount > this.userpage.pageNumber) {
        this.userpage.pageNumber += 1
        this.getuserData()
      }
    },
    remoteMethodefaultID(query) {
      this.loading = true
      this.$axios.get('/api/Meta/Fault?equipmentId=' + this.formData.equipmentId + '&text=' + '').then(res => {
        this.loading = false
        this.faultData = res.data
      })
    },
    remoteMethodequipmentID(query) {
      this.tableDataSearch.positionIds = this.formData.positionId
      this.loading = true
      this.$axios.get('/api/Assets', { params: this.tableDataSearch }).then(res => {
        this.loading = false
        this.equipmentname = res.data
      })
    },
    partwork() { // 分配工单
      this.updateData.userId = this.formData.userId
      this.$axios.post('/api/RepairOrder/' + this.formData.id + '/Dispatch', this.updateData).then(res => {
        this.$message.success('工单分配成功')
        // 跳转个人工作页
        this.$router.push('/Workorder/Watchmanlist')
      })
    },
    repartwork() { // 编辑工单
      this.$axios.put('/api/RepairOrder/' + this.formData.id + '/DispatchUpdate', this.formData).then(res => {
        // 跳转个人工作页
        this.$router.push('/Workorder/Watchmanlist')
      })
    },
    getfaultData() {
      // 获取故障类型
      this.$axios.get('/api/Meta/Fault?equipmentId=' + this.formData.assetId + '&pageSize=' + this.faultpage.pageSize + '&pageNumber=' + this.faultpage.pageNumber).then(res => {
        this.faultData = this.faultData.concat(res.data)
        this.faultpage.pageCount = res.pageCount
      })
    },
    getassetData() {
      this.tableDataSearch.positionIds = this.formData.positionId
      // 获取资产列表
      this.$axios.get('/api/Assets', { params: this.tableDataSearch }).then(res => {
        this.equipmentname = res.data
      })
    },
    getlevelData() {
      // 获取维修级别
      this.$axios.get('/api/Meta/RepairLevel').then(res => {
        this.levelData = res.data
        this.formData.repairLevelId = this.levelData[1].id
      })
    },
    getpositionData() {
      // 获取安装位置
      this.$axios.get('/api/Tree/Position').then(res => {
        this.positionTreeData = this.checkhasChildren(res)
      })
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
    processrecord() { // 点击过程记录
      this.showInfopast = true
      this.formData.assetId = window.location.href.split('/')[window.location.href.split('/').length - 1]
      this.$axios.get('/api/RepairOrder/' + this.formData.assetId + '/DispatchLogs').then(res => {
        this.logsDatapd = res
      })
      this.$axios.get('/api/RepairRecord?repairOrderId=' + this.formData.assetId).then(res => {
        this.logsDatawx = res.data
      })
    },
    closework() { // 点击关闭
      // 跳转个人工作页
      this.$router.push('/Workorder/Watchmanlist')
    }
  }
}
</script>
<style lang='scss' scoped>
.header {
  width: 100%;
  .formData {
    width: 100%;
    ul {
      list-style: none;
      width: 100%;
      padding-left: 10px;
      li {
        width: 49%;
        display: inline-block;
        span {
          display: inline-block;
          font-size: 16px;
          text-align: right;
          width: 120px;
          padding: 10px;
        }
        b {
          width: 77%;
          display: inline-block;
          font-weight: 400;
        }
      }
    }
  }
}
.content {
  width: 100%;
  text-align: center;
}
.dialog-footer {
  margin: 20px 0px;
  width: 100%;
  text-align: center;
}
.titletext {
  font-size: 20px;
  padding: 10px;
  background: #ddd;
  color: #333;
  margin: 10px 0px;
}
   .el-select-dropdown__item span{
    width:100px;
    text-align:center;
  }
</style>
