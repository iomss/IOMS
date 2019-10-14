<template>
  <el-dialog title="修改指标得分" :visible.sync="changeActiveVisible" :close-on-press-escape="false" :close-on-click-modal="false">
    <el-form ref="form" :model="form" label-width="200px" size="small" :inline="true" class="demo-form-inline dialog-form-add">
      <el-row>
        <el-col :span="24">
          <el-form-item label="指标名称">
            {{ assessmentRecordItemData.assessmentWeight.name }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="统计指标">
            {{ assessmentRecordItemData.equipmentIntegrityRate }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item label="权重">
            {{ assessmentRecordItemData.weight }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item
        label="指标得分"
        :rules="[
          { required: true, message: '不能为空'},
          { type: 'number', message: '必须为数字值'}
        ]"
      >
        <el-input v-model.number="form.rateScore" type="age" placeholder="指标得分" autocomplete="off" style="width:282px;" />
      </el-form-item>

      <el-form-item label="编辑备注">
        <el-input v-model="form.remark" type="textarea" style="width:282px;" autocomplete="off" />
      </el-form-item>

      <el-form-item style="text-align: center;display: block;">
        <el-button type="primary" @click="updateAssessData">确定</el-button>
        <el-button @click="changeActiveVisible = false">取消</el-button>
      </el-form-item>

    </el-form>
  </el-dialog>
</template>

<style>
	.dialog-form-add{
		height: 300px;
	}
</style>

<script>
export default {
  name: 'EditAssess',
  data: function() {
    return {
      assessmentItemId: '',
      changeActiveVisible: false,

      form: {
        rateScore: 0,
        remark: ''
      },

      assessmentRecordItemData: {
        assessmentWeight: {
          name: ''
        }
      }

    }
  },
  methods: {
    init(id) {
      if (!id) {
        this.$message.error('需要选择查询单位')
        return
      }
      this.changeActiveVisible = true
      this.assessmentItemId = id
      this.getAssessmentRecordItemById(id)
    },

    /**
     * 获取运维指标单项数据
     * @param  {[type]} id [description]
     * @return {[type]}    [description]
     */
    getAssessmentRecordItemById(id) {
      if (!id) return

      this.$axios.get('/api/AssessmentRecordItem/' + id).then(res => {
        this.assessmentRecordItemData = res
        this.form.rateScore = res.rateScore
      })
    },

    /**
     * 提交数据
     * @return {[type]} [description]
     */
    updateAssessData() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          // debugger
          this.$axios.put('/api/AssessmentRecordItem/' + this.assessmentItemId, this.form).then(res => {
            this.$message({
              message: '修改成功',
              type: 'success'
            })

            this.changeActiveVisible = false
            this.$emit('refreshtabledata')
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
