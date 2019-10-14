<template>
  <el-dialog title="修改权重" :visible.sync="changeActiveVisible" :close-on-press-escape="false" :close-on-click-modal="false">
    <el-form ref="form" :model="form" label-width="200px" size="small" :inline="true" class="demo-form-inline dialog-form-add">
      <el-row>
        <el-col :span="24">
          <el-form-item label="指标名称">
            {{ form.name }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="权重">
        <el-input v-model="form.weight" placeholder="权重" style="width:282px;" />
      </el-form-item>

      <el-form-item label="编辑备注">
        <el-input v-model="form.remark" type="textarea" style="width:282px;" />
      </el-form-item>

    </el-form>

    <div slot="footer" class="dialog-footer" style="text-align: center;display: block;">
      <el-button size="small" @click="changeActiveVisible = false">取 消</el-button>
      <el-button size="small" type="primary" @click="onSubmit">确 定</el-button>
    </div>

  </el-dialog>
</template>

<style>
	.dialog-form-add{
		height: 190px;
	}
</style>

<script>
export default {
  name: 'EditWeight',
  data: function() {
    return {
      changeActiveVisible: false,
      id: 0,
      form: {
        name: '',
        weight: 0,
        remark: ''
      }
    }
  },
  methods: {
    init(id) {
      if (!id) return

      this.changeActiveVisible = true
      this.id = id

      this.getWeightItemOneData(id)
    },

    /**
     * 获取一条权重数据
     * @param  {[type]} id [description]
     * @return {[type]}    [description]
     */
    getWeightItemOneData(id) {
      this.$axios.get('/api/AssessmentWeight/' + id).then(res => {
        this.form.name = res.name
        this.form.weight = res.weight
        this.form.remark = res.remark == null ? '' : res.remark
      })
    },
    /**
     * 提交权重数据
     * @return {[type]} [description]
     */
    onSubmit() {
      var id = this.id
      this.$axios.put('/api/AssessmentWeight/' + id, this.form).then(res => {
        this.$message({
          message: '修改成功',
          type: 'success'
        })

        this.changeActiveVisible = false
        this.$emit('refreshtabledata')
      })
    }
  }
}
</script>
