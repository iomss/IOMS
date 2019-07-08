<!-- 资产详情页面 -->
<template>
  <div>
    <el-row>
      <el-col>
        <div class="panel">
          <div class="content">
            <h4>资产明细</h4>
            <el-form ref="form" :model="formSearch" label-width="90px">
              <el-form-item label="使用单位">
                <el-select v-model="formSearch.unit" clearable placeholder="使用单位" size="small">
                  <el-option key="1" label="单选" value="1" />
                  <el-option key="2" label="多选" value="2" />
                </el-select>
              </el-form-item>
              <el-form-item label="安装位置">
                <el-select v-model="formSearch.position" clearale placeholder="安装位置" size="small">
                  <el-option key="0" label="0" value="0" />
                  <el-option key="1" label="1" value="1" />
                </el-select>
              </el-form-item>
              <el-form-item label="所属系统">
                <el-select v-model="formSearch.system" clearale placeholder="所属系统" size="small">
                  <el-option key="0" label="0" value="0" />
                  <el-option key="1" label="1" value="1" />
                </el-select>
              </el-form-item>
              <el-form-item label="资产类别">
                <el-select v-model="formSearch.sort" clearable placeholder="资产类别" size="small">
                  <el-option key="1" label="已发布" value="true" />
                  <el-option key="2" label="未发布" value="false" />
                </el-select>
              </el-form-item>
              <el-form-item label="资产名称">
                <el-input v-model="formSearch.name" placeholder="资产名称" size="small" />
              </el-form-item>
              <el-form-item label="投用时间">
                <el-select v-model="formSearch.starttime" clearable placeholder="投用时间" size="small">
                  <el-option key="1" label="已发布" value="true" />
                  <el-option key="2" label="未发布" value="false" />
                </el-select>
              </el-form-item>
              <el-form-item label="品牌">
                <el-input v-model="formSearch.brand" placeholder="品牌" size="small" />
              </el-form-item>
              <el-form-item label="型号">
                <el-input v-model="formSearch.Model" placeholder="型号" size="small" />
              </el-form-item>
              <el-form-item label="来源">
                <el-select v-model="formSearch.source" clearable placeholder="来源" size="small">
                  <el-option key="1" label="已发布" value="true" />
                  <el-option key="2" label="未发布" value="false" />
                </el-select>
              </el-form-item>
              <el-form-item label="购置年份">
                <el-select v-model="formSearch.age" clearable placeholder="购置年份" size="small">
                  <el-option key="1" label="启用" value="true" />
                  <el-option key="2" label="禁用" value="false" />
                </el-select>
              </el-form-item>
              <el-form-item label="交工时间">
                <el-select v-model="formSearch.endtime" clearable placeholder="交工时间" size="small">
                  <el-option key="1" label="已发布" value="true" />
                  <el-option key="2" label="未发布" value="false" />
                </el-select>
              </el-form-item>
              <el-form-item label="工程名称">
                <el-input v-model="formSearch.projectname" placeholder="工程名称" size="small" />
              </el-form-item>
              <el-form-item label="使用年限">
                <el-input v-model="formSearch.useyear" placeholder="使用年限" size="small" />
              </el-form-item>
              <el-form-item label="缺陷责任期">
                <el-input v-model="formSearch.defect" placeholder="缺陷责任期" size="small" />
              </el-form-item>
              <el-form-item label="产权单位">
                <el-select v-model="formSearch.Owner" clearable placeholder="产权单位" size="small">
                  <el-option key="1" label="已发布" value="true" />
                  <el-option key="2" label="未发布" value="false" />
                </el-select>
              </el-form-item>
              <el-form-item label="使用单位">
                <el-input v-model="formSearch.user" placeholder="使用单位" size="small" />
              </el-form-item>
              <el-form-item label="资产原值">
                <el-input v-model="formSearch.Original" placeholder="资产原值" size="small" />
              </el-form-item>
              <el-form-item label="计量单位">
                <el-select v-model="formSearch.count" clearable placeholder="产权单位" size="small">
                  <el-option key="1" label="台" value="true" />
                  <el-option key="2" label="套" value="false" />
                  <el-option key="3" label="个" value="true" />
                  <el-option key="4" label="米" value="false" />
                </el-select>
              </el-form-item>
              <el-form-item label="备注" class="form_mid">
                <el-input v-model="formSearch.Remarks" type="textarea" :rows="2" placeholder="请输入内容" />
              </el-form-item>
              <el-form-item label="照片" class="form_mid" />
              <el-form-item label="自定义属性">
                <el-input v-model="formSearch.Model" placeholder="使用单位" size="small" />
              </el-form-item>
              <el-form-item class="form_mid">
                <el-button size="small" type="primary" @click="changeActiveVisible=true">查看处理日志</el-button>
              </el-form-item>
              <el-form-item class="form_total">
                <el-button type="primary" size="small" icon="el-icon-search" @click="initData()">确定</el-button>
              </el-form-item>
            </el-form>
            <el-dialog title="资产处理日志" :visible.sync="changeActiveVisible" :close-on-press-escape="false" :close-on-click-modal="false" width="600px">
              <el-table :data="dealtableData" style="width: 100%">
                <el-table-column prop="dealdate" label="处理日期" width="100" />
                <el-table-column prop="dealperson" label="处理人" width="80" />
                <el-table-column prop="dealway" label="处理方式" />
                <el-table-column prop="message" label="处理内容" width="150" />
                <el-table-column prop="dealremark" label="备注" />
              </el-table>
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="changeActiveVisible=false">确 定</el-button>
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
      formSearch: {
        unit: '',
        position: '',
        sort: '',
        owner: '',
        starttime: '',
        endtime: '',
        source: '',
        age: '',
        brand: '',
        Model: '',
        system: '',
        name: '',
        projectname: '',
        useyear: '',
        defect: '',
        user: '',
        Original: '',
        count: '',
        Remarks: ''
      },
      changeActiveVisible: false,
      dealtableData: [
        {
          dealdate: '123',
          dealperson: '123',
          dealway: '123',
          message: '123',
          dealremark: '123'
        }
      ]
    }
  },
  computed: {},
  mounted() {
  },
  methods: {
    initData() {
      // 跳转资产管理页面
      this.$router.push('/Asset/List')
    }
  }
}
</script>
<style lang='scss' scoped>
.header {
  width: 100%;
  height: 64px;
}
.select {
  width: 40%;
  display: inline-block;
}
.tools {
  width: 30%;
  display: inline-block;
}
.toolsrt {
  width: 20%;
  display: inline-block;
  text-align: right;
}
.search {
  width: 450px;
  position: absolute;
  right: 0;
  z-index: 4;
  .el-input {
    display: inline-block;
    width: 49%;
  }
  .el-select {
    margin-bottom: 5px;
    .el-input {
      width: 100%;
    }
  }
}
.content {
  margin-top: 30px;
  .el-table th,
  .el-table td {
    padding: 5px;
  }
}
.el-form-item {
  width: 30%;
  display: inline-block;
}
.form_mid {
  width: 49%;
}
.form_total {
  width: 100%;
  text-align: center;
}
.el-select {
  width: 100%;
}
</style>
