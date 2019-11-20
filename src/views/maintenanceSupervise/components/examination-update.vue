<template>

  <el-dialog
    title="更新考核统计"
    :visible.sync="projectVisible"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    width="500px"
    append-to-body
    center
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="110px" size="small" class="demo-form-inline">
      <el-form-item label="指标名称" prop="name">
        <span v-html="form.name" />
      </el-form-item>

      <el-form-item label="上级评分" prop="superiorScore">
        <el-input v-model="form.superiorScore" placeholder="单位" style="width:200px" />
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
  name: 'ExaminationUpdate',
  props: {
    statiCloseDialog: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      projectVisible: false,
      form: {
        name: '',
        superiorScore: '',
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
      this.$axios.get(`/api/InternalAssessment/${id}`).then(res => {
        this.weightDesc = res
        this.form.superiorScore = res.superiorScore
        this.form.remark = res.remark
        this.form.name = res.position.name
      })
    },

    // 提交修改
    onSubmit(data) {
      const that = this
      this.$axios.put(`/api/InternalAssessment/${this.descId}`, this.form).then(res => {
        this.$message({
          type: 'success',
          message: '修改成功!',
          duration: 2000,
          onClose: function() {
            that.statiCloseDialog()
          }
        })
      })
    }
  }
}
</script>
