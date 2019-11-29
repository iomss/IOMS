<!-- 领域 -->
<template>
  <div>
    <el-tree-select ref="positionSelect" v-model="positionId" :select-params="selectParams" :tree-params="treeParams" class="case-form-item" :styles="treeSelectStyle" @searchFun="search" />
  </div>
</template>

<script>
export default {
  name: 'Caseposition',
  prop: 'sourcePosition',
  components: {
  },
  data() {
    return {
      positionData: [],
      positionId: null,
      selectParams: {
        multiple: true,
        clearable: true,
        placeholder: '请输入内容'
      },
      treeParams: {
        multiple: true,
        clickParent: true,
        filterable: true,
        'check-strictly': true,
        'default-expand-all': true,
        'expand-on-click-node': false,
        'auto-expand-parent': false,
        data: [],
        props: {
          children: 'children',
          label: 'name',
          value: 'id'
        }
      },
      treeSelectStyle: {
        width: '100%'
      }
    }
  },

  watch: {
    sourcePosition: function(val) {
      debugger
      this.positionId = val
    },
    positionId: function(val) {
      this.$emit('position', this.positionId)
    }
  },

  mounted() {
    this.loadData()
  },

  methods: {
    loadData() {
      this.$axios.get('/api/Tree/Position').then(res => {
        this.positionTreeData = res // this.checkhasChildren(res)
        this.$refs.positionSelect.treeDataUpdateFun(res)
      })
    },
    search(val) {
      this.$refs.positionSelect.filterFun(val)
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
