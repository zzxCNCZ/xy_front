<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="姓名" prop="name">
      <el-input v-model="dataForm.name" placeholder="姓名"></el-input>
    </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-select v-model="dataForm.sex"  filterable clearable  placeholder="性别">
          <el-option
            v-for="item in sexOption"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
    <el-form-item label="年龄" prop="age">
      <el-input v-model="dataForm.age" placeholder="年龄"></el-input>
    </el-form-item>
    <el-form-item label="手机号码" prop="mobile">
      <el-input v-model="dataForm.mobile" placeholder="手机号码"></el-input>
    </el-form-item>
    <!--<el-form-item label="单位编号" prop="deptId">-->
      <!--<el-input v-model="dataForm.deptId" placeholder="单位编号"></el-input>-->
    <!--</el-form-item>-->
      <el-form-item label="部门" prop="deptId">
        <el-popover
          ref="deptListPopover"
          placement="bottom-start"
          trigger="click">
          <el-tree
            :data="deptList"
            :props="deptListTreeProps"
            node-key="id"
            ref="deptListTree"
            @current-change="deptListTreeCurrentChangeHandle"
            :default-expand-all="true"
            :highlight-current="true"
            :expand-on-click-node="false">
          </el-tree>
        </el-popover>
        <el-input v-model="dataForm.deptName" v-popover:deptListPopover :readonly="true" placeholder="点击选择部门" class="menu-list__input"></el-input>
      </el-form-item>
    <el-form-item label="职位" prop="job">
      <el-select v-model="dataForm.job"  filterable clearable  placeholder="职位">
        <el-option
          v-for="item in jobOption"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { treeDataTranslate } from '@/utils'
export default {
  data () {
    return {
      sexOption: [{
        value: 0,
        label: '男'
      }, {
        value: 1,
        label: '女'
      }],
      jobOption: [{
        value: 'main',
        label: '主治医师'
      }, {
        value: 'bed',
        label: '管床医师'
      }, {
        value: 'nurse',
        label: '护士'
      }, {
        value: 'chief',
        label: '主任医师'
      }],
      visible: false,
      dataForm: {
        id: 0,
        name: '',
        sex: 0,
        age: '',
        mobile: '',
        deptId: '',
        job: '',
        deptName: ''
      },
      dataRule: {
        name: [
          { required: true, message: '姓名不能为空', trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '性别 0 男 1 女不能为空', trigger: 'blur' }
        ],
        age: [
          { required: true, message: '年龄不能为空', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '手机号码不能为空', trigger: 'blur' }
        ],
        deptId: [
          { required: true, message: '单位编号不能为空', trigger: 'blur' }
        ],
        job: [
          { required: true, message: '职位不能为空', trigger: 'blur' }
        ]
      },
      deptList: [],
      deptListTreeProps: {
        label: 'name',
        children: 'children'
      }
    }
  },
  methods: { // 单位数选中
    deptListTreeCurrentChangeHandle (data, node) {
      this.dataForm.deptId = data.id
      this.dataForm.deptName = data.name
    },
    // 单位树设置当前选中节点
    deptListTreeSetCurrentNode () {
      this.$refs.deptListTree.setCurrentKey(this.dataForm.deptId)
      this.dataForm.deptName = (this.$refs.deptListTree.getCurrentNode() || {})['name']
    },
    init (id) {
      this.dataForm.id = id || 0
      this.visible = true
      this.$http({
        url: this.$http.adornUrl('/user/dept/all'),
        method: 'get',
        params: this.$http.adornParams({
          'deptId': this.dataForm.deptId
        })
      }).then(({data}) => {
        this.deptList = treeDataTranslate(data.deptList, 'id')
      }).then(() => {
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        })
      }).then(() => {
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(`/user/doctor/info/${this.dataForm.id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.dataForm.name = data.doctor.name
              this.dataForm.sex = data.doctor.sex
              this.dataForm.age = data.doctor.age
              this.dataForm.mobile = data.doctor.mobile
              this.dataForm.deptId = data.doctor.deptId
              this.dataForm.job = data.doctor.job
              this.deptListTreeSetCurrentNode()
            }
          })
        } else {
          this.deptListTreeSetCurrentNode()
        }
      })
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(`/user/doctor/${!this.dataForm.id ? 'save' : 'update'}`),
            method: 'post',
            data: this.$http.adornData({
              'id': this.dataForm.id || undefined,
              'name': this.dataForm.name,
              'sex': this.dataForm.sex,
              'age': this.dataForm.age,
              'mobile': this.dataForm.mobile,
              'deptId': this.dataForm.deptId,
              'job': this.dataForm.job,
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
