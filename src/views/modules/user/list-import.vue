<template>
  <el-dialog
    :title="'导入'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <div>{{msg}}</div>
  </el-dialog>
</template>

<script>
export default {
  name: 'list-import',
  data () {
    return {
      visible: false
    }
  },
  props: ['msg'],
  methods: {
    init () {
      this.visible = true
    }
  }
}
</script>

<style scoped>

</style>
