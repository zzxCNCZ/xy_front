<template lang="html">
  <el-row style="text-align: center" >
    <div id="quill">
      <div class="ql-container ql-snow" >
        <div class="ql-editor" >
          <div v-html="contentHtml"></div>
        </div>
      </div>
    </div>
    <el-button @click="printNews()">打印</el-button>
  </el-row>
</template>

<style scoped>
  .quill-editor {
    /*height: 350px;*/
    /*width: 500px;*/
  }
</style>

<script>
import axios from 'axios'
// eslint-disable-next-line
import { quillEditor } from 'vue-quill-editor'
import printJS from 'print-js'
export default {
  data: function () {
    return {
      contentHtml: '',
      dataForm: {
        id: 0,
        title: '',
        content: '',
        url: '',
        delFlag: '',
        createBy: '',
        createTime: '',
        modifyBy: '',
        modifyTime: ''
      },
      editorOption: {
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ 'header': 1 }, { 'header': 2 }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'script': 'sub' }, { 'script': 'super' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            [{ 'direction': 'rtl' }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'font': [] }],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'align': [] }],
            ['clean'],
            ['link', 'image', 'video']
          ]
        }
      }
    }
  },
  mounted () {
    this.onload()
  },
  methods: {
    printNews () {
      printJS({printable: 'quill',
        type: 'html',
        // css: []})
        css: [
          'https://cdn.bootcss.com/quill/2.0.0-dev.3/quill.bubble.min.css',
          'https://cdn.bootcss.com/quill/2.0.0-dev.3/quill.core.css',
          'https://cdn.bootcss.com/quill/2.0.0-dev.3/quill.snow.min.css']})
    },
    onload () {
      let that = this
      axios.get('http://www.grandlynn.com/apis/user/newsinfo/getNewsById?id=20')
        .then(function (data) {
          console.log(data.data)
          that.contentHtml = data.data.newsInfo.content
        })
    },
    onEditorBlur (editor) { // 失去焦点事件
    },
    onEditorFocus (editor) { // 获得焦点事件
    },
    onEditorChange ({editor, html, text}) { // 编辑器文本发生变化
      // this.content可以实时获取到当前编辑器内的文本内容
      console.log(this.dataForm.content)
    }
  }
}

</script>
