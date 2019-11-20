<template>

  <el-dialog
    title="更新工程单"
    :visible.sync="projectVisible"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    width="500px"
    append-to-body
    center
    @close="closeDialog"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="110px" size="small" class="demo-form-inline">
      <el-form-item label="指标名称" prop="name">
        <span v-html="weightDesc.name" />
      </el-form-item>

      <el-form-item label="权重系数" prop="weight">
        <el-input v-model="form.weight" placeholder="单位" style="width:200px" />
      </el-form-item>

      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" type="textarea" placeholder="请输入备注信息" style="width:200px" />
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button type="primary" size="small" @click="onSubmit('form')">确定</el-button>
      <el-button size="small" @click="projectVisible = false">取 消</el-button>
    </span>

  </el-dialog>
</template>

<script>
export default {
  name: 'InternalSetUp',
  data() {
    return {
      projectVisible: false,
      form: {
        name: '',
        weight: '',
        remark: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        unit: [
          { required: true, message: '请输入单位', trigger: 'blur' }
        ],
        quantity: [
          { required: true, message: '请输入数量', trigger: 'blur' }
        ],
        unitPrice: [
          { required: true, message: '请输入单价', trigger: 'blur' }
        ],
        totalPrice: [
          { required: true, message: '请输入总价', trigger: 'blur' }
        ]
      },
      weightDesc: {},
      descId: ''
    }
  },
  methods: {
    init(id) {
      this.projectVisible = true
      this.descId = id
      this.getWeightDesc(id)
    },

    // 获取权重详情
    getWeightDesc(id) {
      this.$axios.get(`/api/AssessmentWeight/${id}`).then(res => {
        this.weightDesc = res
        this.form.weight = res.weight
        this.form.remark = res.remark
      })
    },

    // 提交修改
    onSubmit(data) {
      this.$axios.put(`/api/AssessmentWeight/${this.descId}`, this.form).then(res => {
        this.$message({
          type: 'success',
          message: '修改成功!',
          duration: 2000,
          onClose: function() {
            location.reload()
          }
        })
      })
    },
    // 关闭回调 并且执行父组件方法
    closeDialog() {
      this.$parent.closeDialog()
    }
  }
}
</script>
