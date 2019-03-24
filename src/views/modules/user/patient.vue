<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @submit.native.prevent  @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.name" placeholder="姓名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('user:patient:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <!--<el-button v-if="isAuth('user:patient:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>-->
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        v-if="columnVisible"
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        v-if="columnVisible"
        prop="id"
        header-align="center"
        align="center"
        label="主键">
      </el-table-column>
      <el-table-column
        prop="name"
        header-align="center"
        align="center"
        label="姓名">
      </el-table-column>
      <el-table-column
        prop="sex"
        header-align="center"
        align="center"
        label="性别">
      </el-table-column>
      <el-table-column
        prop="age"
        header-align="center"
        align="center"
        label="年龄">
      </el-table-column>
      <el-table-column
        prop="idNumber"
        header-align="center"
        align="center"
        label="身份证号码">
      </el-table-column>
      <el-table-column
        prop="address"
        header-align="center"
        align="center"
        label="家庭住址">
      </el-table-column>
      <el-table-column
        prop="mobile"
        header-align="center"
        align="center"
        label="联系电话">
      </el-table-column>
      <el-table-column
        prop="emergencyConnectName"
        header-align="center"
        align="center"
        label="紧急联系人姓名">
      </el-table-column>
      <el-table-column
        prop="emergencyConnectMobile"
        header-align="center"
        align="center"
        label="紧急联系人电话">
      </el-table-column>
      <el-table-column
        v-if="columnVisible"
        prop="delFlag"
        header-align="center"
        align="center"
        label="删除标志">
      </el-table-column>
      <el-table-column
        v-if="columnVisible"
        prop="createBy"
        header-align="center"
        align="center"
        label="创建人">
      </el-table-column>
      <el-table-column
        v-if="columnVisible"
        prop="createTime"
        header-align="center"
        align="center"
        label="创建时间">
      </el-table-column>
      <el-table-column
        v-if="columnVisible"
        prop="modifyBy"
        header-align="center"
        align="center"
        label="修改人">
      </el-table-column>
      <el-table-column
        v-if="columnVisible"
        prop="modifyTime"
        header-align="center"
        align="center"
        label="修改时间">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="100"
        label="住院病案">
        <template slot-scope="scope">
          <el-button  type="text" size="small" @click="caseDetailHandle(scope.row.id)">详情</el-button>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="100"
        label="手续">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status===null" type="text" size="small" @click="addRecordHandle(scope.row.id)">入院</el-button>
          <el-button v-else type="text" size="small" @click="checkOutHandle(scope.row.recordId)">出院</el-button>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="病程">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status!==null" type="text" size="small" @click="addDiagnose(scope.row.recordId)">填写</el-button>
          <el-button v-if="scope.row.status!==null" type="text" size="small" @click="getDiagnoseList(scope.row.recordId)">历史记录</el-button>
          <p v-else>————</p>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="100"
        label="住院">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="getRecordList(scope.row.id)">历史记录</el-button>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="100"
        label="缴费">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status!==null" type="text" size="small" @click="addPatientCost(scope.row.recordId)">填写</el-button>
          <p v-else>————</p>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    <!-- 新增入院记录-->
    <add-patient-record v-if="addPatientRecordVisible" ref="addPatientRecord" @refreshDataList="getDataList"></add-patient-record>

    <!-- 新增病程-->
    <add-diagnose v-if="addDiagnoseVisible" ref="addDiagnose" @refreshDataList="getDataList"></add-diagnose>
    <!-- 病程历史-->
    <diagnose-list v-if="diagnoseListVisible" ref="diagnoseList" @refreshDataList="getDataList"></diagnose-list>
    <!-- 入院历史记录-->
    <record-list v-if="recordListVisible" ref="recordList" @refreshDataList="getDataList"></record-list>
    <!-- 病案 -->
    <case-detail v-if="caseDetailVisible" ref="caseDetail" @refreshDataList="getDataList"></case-detail>
    <!-- 缴费-->
    <add-patient-cost v-if="addPatientCostVisible" ref="addPatientCost" @refreshDataList="getDataList"></add-patient-cost>
  </div>
</template>

<script>
import AddOrUpdate from './patient-add-or-update'
import AddPatientRecord from './patientrecord-add-or-update'

import AddDiagnose from './patientdiagnose-add-or-update'

import DiagnoseList from './diagnose'
import RecordList from './record'

import CaseDetail from './case-detail'

import AddPatientCost from './patientcost-add-or-update'

export default {
  data () {
    return {
      columnVisible: false,
      dataForm: {
        name: ''
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      addPatientRecordVisible: false,
      diagnoseListVisible: false,
      recordListVisible: false,
      addDiagnoseVisible: false,
      caseDetailVisible: false,
      addPatientCostVisible: false
    }
  },
  components: {
    AddOrUpdate,
    AddPatientRecord,
    DiagnoseList,
    AddDiagnose,
    RecordList,
    CaseDetail,
    AddPatientCost
  },
  activated () {
    this.getDataList()
  },
  computed: {
    doctorId: {
      get () { return this.$store.state.user.doctorId }
    }
  },
  methods: {
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/user/patient/list'),
        method: 'get',
        params: this.$http.adornParams({
          'page': this.pageIndex,
          'limit': this.pageSize,
          'doctorId': this.doctorId === 1 ? '' : this.doctorId,
          'name': this.dataForm.name
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.dataList = data.page.list
          this.totalPage = data.page.totalCount
        } else {
          this.dataList = []
          this.totalPage = 0
        }
        this.dataListLoading = false
      })
    },
    // 每页数
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageIndex = val
      this.getDataList()
    },
    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
    },
    // 填写病程
    addDiagnose (recordId) {
      this.addDiagnoseVisible = true
      this.$nextTick(() => {
        this.$refs.addDiagnose.initAddDiagnose(recordId)
      })
    },
    // 填写缴费记录
    addPatientCost (recordId) {
      this.addPatientCostVisible = true
      this.$nextTick(() => {
        this.$refs.addPatientCost.initAddPatientCost(recordId)
      })
    },
    // 病程记录
    getDiagnoseList (recordId) {
      this.diagnoseListVisible = true
      this.$nextTick(() => {
        this.$refs.diagnoseList.initDiagnoseList(recordId)
      })
    },
    // 病案首页
    caseDetailHandle (id) {
      this.caseDetailVisible = true
      this.$nextTick(() => {
        this.$refs.caseDetail.init(id)
      })
    },
    // 出院
    checkOutHandle (recordId) {
      this.$http({
        url: this.$http.adornUrl(`/user/patientrecord/checkOut/${recordId}`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.getDataList()
            }
          })
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 住院记录
    getRecordList (patientId) {
      this.recordListVisible = true
      this.$nextTick(() => {
        this.$refs.recordList.initRecordList(patientId)
      })
    },
    addRecordHandle (id) {
      this.addPatientRecordVisible = true
      this.$nextTick(() => {
        this.$refs.addPatientRecord.initRecord(id)
      })
    },
    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    // 删除
    deleteHandle (id) {
      var ids = id ? [id] : this.dataListSelections.map(item => {
        return item.id
      })
      this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/user/patient/delete'),
          method: 'post',
          data: this.$http.adornData(ids, false)
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getDataList()
              }
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      })
    }
  }
}
</script>
