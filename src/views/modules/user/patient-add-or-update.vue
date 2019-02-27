<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="姓名" prop="name">
      <el-input v-model="dataForm.name" placeholder="姓名"></el-input>
    </el-form-item>
    <el-form-item label="性别(默认为0，0：男，1：女)" prop="sex">
      <el-input v-model="dataForm.sex" placeholder="性别(默认为0，0：男，1：女)"></el-input>
    </el-form-item>
    <el-form-item label="年龄" prop="age">
      <el-input v-model="dataForm.age" placeholder="年龄"></el-input>
    </el-form-item>
    <el-form-item label="身份证号码" prop="idNumber">
      <el-input v-model="dataForm.idNumber" placeholder="身份证号码"></el-input>
    </el-form-item>
    <el-form-item label="家庭住址" prop="address">
      <el-input v-model="dataForm.address" placeholder="家庭住址"></el-input>
    </el-form-item>
    <el-form-item label="联系电话" prop="mobile">
      <el-input v-model="dataForm.mobile" placeholder="联系电话"></el-input>
    </el-form-item>
    <el-form-item label="紧急联系人姓名" prop="emergencyConnectName">
      <el-input v-model="dataForm.emergencyConnectName" placeholder="紧急联系人姓名"></el-input>
    </el-form-item>
    <el-form-item label="紧急联系人电话" prop="emergencyConnectMobile">
      <el-input v-model="dataForm.emergencyConnectMobile" placeholder="紧急联系人电话"></el-input>
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
        sex: '',
        age: '',
        idNumber: '',
        address: '',
        mobile: '',
        emergencyConnectName: '',
        emergencyConnectMobile: '',
        delFlag: '',
        createBy: '',
        createTime: '',
        modifyBy: '',
        modifyTime: ''
      },
      dataRule: {
        name: [
          { required: true, message: '姓名不能为空', trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '性别(默认为0，0：男，1：女)不能为空', trigger: 'blur' }
        ],
        age: [
          { required: true, message: '年龄不能为空', trigger: 'blur' }
        ],
        idNumber: [
          { required: true, message: '身份证号码不能为空', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '家庭住址不能为空', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '联系电话不能为空', trigger: 'blur' }
        ],
        emergencyConnectName: [
          { required: true, message: '紧急联系人姓名不能为空', trigger: 'blur' }
        ],
        emergencyConnectMobile: [
          { required: true, message: '紧急联系人电话不能为空', trigger: 'blur' }
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
            url: this.$http.adornUrl(`/user/patient/info/${this.dataForm.id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.dataForm.name = data.patient.name
              this.dataForm.sex = data.patient.sex
              this.dataForm.age = data.patient.age
              this.dataForm.idNumber = data.patient.idNumber
              this.dataForm.address = data.patient.address
              this.dataForm.mobile = data.patient.mobile
              this.dataForm.emergencyConnectName = data.patient.emergencyConnectName
              this.dataForm.emergencyConnectMobile = data.patient.emergencyConnectMobile
              this.dataForm.delFlag = data.patient.delFlag
              this.dataForm.createBy = data.patient.createBy
              this.dataForm.createTime = data.patient.createTime
              this.dataForm.modifyBy = data.patient.modifyBy
              this.dataForm.modifyTime = data.patient.modifyTime
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
            url: this.$http.adornUrl(`/user/patient/${!this.dataForm.id ? 'save' : 'update'}`),
            method: 'post',
            data: this.$http.adornData({
              'id': this.dataForm.id || undefined,
              'name': this.dataForm.name,
              'sex': this.dataForm.sex,
              'age': this.dataForm.age,
              'idNumber': this.dataForm.idNumber,
              'address': this.dataForm.address,
              'mobile': this.dataForm.mobile,
              'emergencyConnectName': this.dataForm.emergencyConnectName,
              'emergencyConnectMobile': this.dataForm.emergencyConnectMobile,
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
