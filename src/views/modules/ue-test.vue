<template>
  <el-dialog
    :title="'导入'"
    :close-on-click-modal="false"
    :visible.sync="visible">
<div class="view" v-html="divElement">
</div>
  </el-dialog>
</template>

<script>
export default {
  name: 'ueTest',
  data: function () {
    return {
      divElement: '',
      visible: false
    }
  },
  props: ['msg'],
  methods: {
    init () {
      this.visible = true
      this.divElement = this.msg
    }
  }
}

</script>

<style scoped>
  .view{text-align: left; padding:0;word-wrap:break-word;cursor:text;height:90%;}body{margin:8px;font-family:sans-serif;font-size:16px;}p{margin:5px 0;}
</style>
<!--<style scoped id="table">.selectTdClass{background-color:#edf5fa !important}table.noBorderTable td,table.noBorderTable th,table.noBorderTable caption{border:1px dashed #ddd !important}table{margin-bottom:10px;border-collapse:collapse;display:table;}td,th{padding: 5px 10px;border: 1px solid #DDD;}caption{border:1px dashed #DDD;border-bottom:0;padding:3px;text-align:center;}th{border-top:1px solid #BBB;background-color:#F7F7F7;}table tr.firstRow th{border-top-width:2px;}.ue-table-interlace-color-single{ background-color: #fcfcfc; } .ue-table-interlace-color-double{ background-color: #f7faff; }td p{margin:0;padding:0;}</style>-->
