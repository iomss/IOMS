<!-- 资产清单管理页面 -->
<template>
  <div>
    <el-row>
      <el-col>
        <div class="panel">
          <div class="header">
            <h4>清单管理</h4>
            <div class="select">
              <el-button type="primary" size="small" @click="changeActiveVisible=true">筛选设备清单</el-button>
              <el-button type="primary" size="small" @click="setvalid()">设置清单有效</el-button>
              <el-button type="danger" size="small" @click="deletelist()">删除设备清单</el-button>
            </div>
            <div class="tools">
              <el-button type="primary" plain size="small" @click="selectstate(0)">清单列表</el-button>
              <el-button type="primary" plain size="small" @click="selectstate(1)">未生效清单</el-button>
              <el-button type="primary" plain size="small" @click="selectstate(2)">已生效清单</el-button>
            </div>
            <div class="toolsrt">
              <el-form ref="form" :model="formSearch">
                <el-select v-model="formSearch.unit" clearable placeholder="管理单位" size="small">
                  <el-option key="1" label="单选" value="1" />
                  <el-option key="2" label="多选" value="2" />
                </el-select>
                <el-select v-model="formSearch.year" clearable placeholder="所属年度" size="small">
                  <el-option key="1" label="单选" value="1" />
                  <el-option key="2" label="多选" value="2" />
                </el-select>
                <el-button type="primary" plain size="small" @click="search()">查询</el-button>
              </el-form>
            </div>
          </div>
          <div class="content">
            <el-table :data="tableData" stripe border style="width: 100%" @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="40" />
              <el-table-column label="版本号" prop="version" width="150">
                <template slot-scope="scope">
                  <span v-for="(item,index) in scope.row.answer" :key="index" style="margin-right:8px;">{{ item===1?"A":item===2?"B":item===3?"C":"D" }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="year" label="年份" width="90" />
              <el-table-column prop="unit" label="管理单位" width="150" />
              <el-table-column prop="num" label="数量" width="90" />
              <el-table-column prop="time" label="生成时间" width="100" />
              <el-table-column prop="state" label="生效状态" width="100" />
              <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                  <el-button style="display:block;margin-left:0;margin-bottom:5px;" size="mini" type="success" @click="showInfo(scope.row)">详情</el-button>
                  <el-button style="display:block;margin-left:0;margin-bottom:5px;" size="mini" type="primary" @click="UpdateStage(scope.row)">编辑</el-button>
                  <el-button style="display:block;margin-left:0;margin-bottom:5px;" size="mini" type="danger" @click="deleteManage(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-dialog ref="removeData" title="提示" :close-on-press-escape="false" :close-on-click-modal="false" :visible.sync="removeQuestionVisible" width="220px">
              <span>您确定要删除此条数据？</span>
              <span slot="footer" class="dialog-footer">
                <el-button @click="removeQuestionVisible = false">取 消</el-button>
                <el-button type="primary" @click="removeQuestion">确 定</el-button>
              </span>
            </el-dialog>
            <el-dialog title="筛选生成新的设备清单" :visible.sync="changeActiveVisible" :close-on-press-escape="false" :close-on-click-modal="false" width="450px">
              <el-form ref="form" :model="formSearch" label-width="120px">
                <el-form-item label="管理中心">
                  <el-select v-model="formSearch.system" clearable placeholder="管理中心" size="small">
                    <el-option key="1" label="单选" value="1" />
                    <el-option key="2" label="多选" value="2" />
                  </el-select>
                </el-form-item>
                <el-form-item label="设备清单编号">
                  <el-input v-model="formSearch.number" placeholder="设备清单编号" size="small" />
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="changeActiveVisible=false">确 定</el-button>
                <el-button type="primary" @click="changeActiveVisible=false">取消</el-button>
              </span>
            </el-dialog>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// import page from '@/components/page.vue'
export default {
  components: {
    // page
  },
  data() {
    return {
      formSearchShow: false,
      removeQuestionVisible: false,
      changeActiveVisible: false,
      formSearch: {
        unit: '',
        year: ''
      },
      tableData: [],
      multipleSelection: '' // 表单选中行
    }
  },
  computed: {},
  mounted() {
  },
  methods: {
    creatlist() {
      // 生成设备清单
    },
    setvalid() {
      // 设置清单有效
      if (this.multipleSelection === '') {
        this.$message.error('请至少选择一条数据')
      } else {
        console.log('设置有效')
      }
    },
    deletelist() {
      // 删除设备清单
      if (this.multipleSelection === '') {
        this.$message.error('请至少选择一条数据')
      } else {
        this.removeQuestionVisible = true
      }
    },
    selectstate(data) { // 按状态筛选清单
      console.log(data)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    showInfo(val) { // 点击详情按钮
      this.$router.push('/Asset/Info' + val)
    },
    UpdateStage(val) { // 点击编辑按钮
      this.$router.push('/Asset/Info' + val)
    },
    deleteManage(row) { // 点击删除按钮
      this.removeData = row
      this.removeQuestionVisible = true
    },
    // 删除试题
    removeQuestion() {
      // const _this = this
      // this.$ajax.delete('/api/services/app/Question/DeleteClozeQuestion?Id=' + this.removeData.id).then(response => {
      //   if (response.data.success) {
      //     let index = _this.tableData.indexOf(_this.removeData)
      //     _this.tableData.splice(index, 1)
      //     _this.$message.success('删除成功')
      //     _this.removeQuestionVisible = false
      //   } else {
      //     _this.$message.error(response.data.error.message)
      //   }
      // })
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
  width: 49%;
  display: inline-block;
}
.toolsrt {
  width: 50%;
  display: inline-block;
  text-align: right;
}
.search {
  width: 450px;
  position: absolute;
  right: 0;
  z-index: 4;
}
.content {
  .el-table th,
  .el-table td {
    padding: 5px;
  }
}
.el-dialog__footer {
  text-align: center;
}
.el-input {
  width: 70%;
}
</style>

