<template lang="html">
  <el-row style="text-align: center">
    <el-form :model="dataForm" label-width="80px" id="quill">
      <el-form-item label="标题" prop="title">
        <el-input v-model="dataForm.title" placeholder="标题"></el-input>
      </el-form-item>
      <el-form-item label="主体内容" prop="content">
        <quill-editor
          v-model="dataForm.content"
                       :options="editorOption"
                       @blur="onEditorBlur($event)"
                       @focus="onEditorFocus($event)"
                       @change="onEditorChange($event)">
        </quill-editor>
      </el-form-item>
      <el-form-item label="原文地址" prop="url">
        <el-input v-model="dataForm.url" placeholder="原文地址"></el-input>
      </el-form-item>
    </el-form>
    <el-button @click="submitNews()">提交</el-button>
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
import Vue from 'vue'
// eslint-disable-next-line
import { quillEditor } from 'vue-quill-editor'
import printJS from 'print-js'
export default {
  data: function () {
    return {
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
  methods: {
    printNews () {
      console.log('111111111')
      console.log(Vue)
      printJS({printable: 'quill',
        type: 'html'
        // css: [core,
        //   snow,
        //   bubble]})
      })
      // css: ['https://cdn.bootcss.com/element-ui/2.4.11/theme-chalk/index.css',
      //   'https://cdn.bootcss.com/quill/2.0.0-dev.3/quill.bubble.min.css',
      //   'https://cdn.bootcss.com/quill/2.0.0-dev.3/quill.core.css',
      //   'https://cdn.bootcss.com/quill/2.0.0-dev.3/quill.snow.min.css']})
    },
    submitNews () {
      var form = new FormData()
      form.append('title', this.dataForm.title)
      form.append('content', this.dataForm.content)
      form.append('url', this.dataForm.url)
      axios.post(this.$http.adornUrl(`/user/newsinfo/uploadNewsInfo`), form, {
        method: 'post',
        headers: {
          'Content-Type': 'multipart/form-data',
          'token': Vue.cookie.get('token')
        }
      }).then((res) => {
        console.log(res)
        if (res.data && res.data.code === 0) {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.visible = false
              this.$emit('refreshDataList')
            }
          })
        } else {
          this.$message.error(res.data.msg)
        }
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
