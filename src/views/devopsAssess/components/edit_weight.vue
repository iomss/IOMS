<template>
  <el-dialog title="修改权重" :visible.sync="changeActiveVisible" :close-on-press-escape="false" :close-on-click-modal="false">
    <el-form ref="form" :model="form" label-width="200px" size="small" :inline="true" class="demo-form-inline dialog-form-add">
      <el-row>
        <el-col :span="24">
          <el-form-item label="指标名称">
            ssss
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="权重">
        <el-input v-model="form.name" placeholder="权重" style="width:282px;" />
      </el-form-item>

      <el-form-item label="编辑备注">
        <el-input v-model="form.desc" type="textarea" style="width:282px;" />
      </el-form-item>

      <el-form-item style="text-align: center;display: block;">
        <el-button type="primary" @click="onSubmit">确定</el-button>
        <el-button>取消</el-button>
      </el-form-item>

    </el-form>
  </el-dialog>
</template>

<style>
	.dialog-form-add{
		height: 290px;
	}
</style>

<script>
export default {
  name: 'EditWeight',
  data: function() {
    return {
      changeActiveVisible: false,

      form: {
        name: ''
      }
    }
  },
  methods: {
    init() {
      this.changeActiveVisible = true
    },
    onSubmit() {

    }
  }
}
</script>
