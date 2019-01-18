<template lang="html">
  <div>
    <vue-ueditor-wrap :config="ueConfig" v-model="msg"></vue-ueditor-wrap>
  </div>
  <!--<el-row style="text-align: center" >-->
    <!--<vue-ueditor-wrap :config="ueConfig" v-model="msg"></vue-ueditor-wrap>-->
    <!--<ue-test v-if="showTest" ref="uetest" :msg="msg"></ue-test>-->
    <!--<el-button @click="showUeTest()">显示</el-button>-->
    <!--<list-import v-if="listImportVisible" ref="listImport" :msg="msg"  ></list-import>-->
  <!--</el-row>-->
</template>

<style scoped>
</style>

<script>
import ListImport from '../modules/user/list-import'
import VueUeditorWrap from 'vue-ueditor-wrap'
import axios from 'axios'
import UeTest from './ue-test'
export default {
  data: function () {
    return {
      listImportVisible: false,
      showTest: false,
      msg: '<h2>Vue + UEditor + v-model双向绑定</h2>',
      ueConfig: {
        toolbars: [
          ['undo', 'redo', 'indent', 'bold', 'italic', '|', 'fontfamily', 'fontsize', '|', 'template'],
          ['justifyleft', 'justifyright', 'justifycenter', 'justifyjustify']
        ],
        // theme: 'gray',
        elementPathEnabled: false,
        wordCount: false,
        serverUrl: ''
      }
    }
  },
  components: {
    UeTest,
    VueUeditorWrap,
    ListImport
  },
  mounted () {
    // this.onload()
  },
  methods: {
    showUeTest () {
      console.log(22)
      this.showTest = true
      this.$nextTick(() => {
        this.$refs.uetest.init()
      })
      // this.listImportVisible = true
      // this.$nextTick(() => {
      //   this.$refs.listImport.init()
      // })
    },
    onload () {
      let that = this
      axios.get('http://www.grandlynn.com/apis/user/newsinfo/getNewsById?id=20')
        .then(function (data) {
          console.log(data.data)
          that.contentHtml = data.data.newsInfo.content
        })
    }
  }
}

</script>
