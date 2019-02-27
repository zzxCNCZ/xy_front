<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="单位名称" prop="name">
      <el-input v-model="dataForm.name" placeholder="单位名称"></el-input>
    </el-form-item>
    <el-form-item label="单位编码" prop="deptNum">
      <el-input v-model="dataForm.deptNum" placeholder="单位编码"></el-input>
    </el-form-item>
    <el-form-item label="父机构id" prop="parentId">
      <el-input v-model="dataForm.parentId" placeholder="父机构id"></el-input>
    </el-form-item>
    <el-form-item label="删除标志" prop="delFlag">
      <el-input v-model="dataForm.delFlag" placeholder="删除标志"></el-input>
    </el-form-item>
    <el-form-item label="创建人" prop="createBy">
      <el-input v-model="dataForm.createBy" placeholder="创建人"></el-input>
    </el-form-item>
    <el-form-item label="创建时间" prop="createTime">
      <el-input v-model="dataForm.createTime" placeholder="创建时间"></el-input>
    </el-form-item>
    <el-form-item label="修改人" prop="modifyBy">
      <el-input v-model="dataForm.modifyBy" placeholder="修改人"></el-input>
    </el-form-item>
    <el-form-item label="修改时间" prop="modifyTime">
      <el-input v-model="dataForm.modifyTime" placeholder="修改时间"></el-input>
    </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      visible: false,
      dataForm: {
        id: 0,
        name: '',
        deptNum: '',
        parentId: '',
        delFlag: '',
        createBy: '',
        createTime: '',
        modifyBy: '',
        modifyTime: ''
      },
      dataRule: {
        name: [
          { required: true, message: '单位名称不能为空', trigger: 'blur' }
        ],
        deptNum: [
          { required: true, message: '单位编码不能为空', trigger: 'blur' }
        ],
        parentId: [
          { required: true, message: '父机构id不能为空', trigger: 'blur' }
        ],
        delFlag: [
          { required: true, message: '删除标志不能为空', trigger: 'blur' }
        ],
        createBy: [
          { required: true, message: '创建人不能为空', trigger: 'blur' }
        ],
        createTime: [
          { required: true, message: '创建时间不能为空', trigger: 'blur' }
        ],
        modifyBy: [
          { required: true, message: '修改人不能为空', trigger: 'blur' }
        ],
        modifyTime: [
          { required: true, message: '修改时间不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init (id) {
      this.dataForm.id = id || 0
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(`/user/dept/info/${this.dataForm.id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.dataForm.name = data.dept.name
              this.dataForm.deptNum = data.dept.deptNum
              this.dataForm.parentId = data.dept.parentId
              this.dataForm.delFlag = data.dept.delFlag
              this.dataForm.createBy = data.dept.createBy
              this.dataForm.createTime = data.dept.createTime
              this.dataForm.modifyBy = data.dept.modifyBy
              this.dataForm.modifyTime = data.dept.modifyTime
            }
          })
        }
      })
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(`/user/dept/${!this.dataForm.id ? 'save' : 'update'}`),
            method: 'post',
            data: this.$http.adornData({
              'id': this.dataForm.id || undefined,
              'name': this.dataForm.name,
              'deptNum': this.dataForm.deptNum,
              'parentId': this.dataForm.parentId,
              'delFlag': this.dataForm.delFlag,
              'createBy': this.dataForm.createBy,
              'createTime': this.dataForm.createTime,
              'modifyBy': this.dataForm.modifyBy,
              'modifyTime': this.dataForm.modifyTime
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
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
              this.$message.error(data.msg)
            }
          })
        }
      })
    }
  }
}
</script>
