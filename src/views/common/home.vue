<template>
    <div class="mod-demo-echarts">
      <el-row :gutter="20">
        <el-col :span="8" >
          <el-card style="text-align: center">
            <el-col :span="12" offset="6">
              <icon-svg name="patient" class="head_icon" style="color: #00a0e9"></icon-svg>
              <h1 style="float: right">290人</h1>
            </el-col>
          </el-card>
        </el-col>
        <el-col :span="8" >
          <el-card>
            <el-col :span="12" offset="6">
              <icon-svg name="icu" class="head_icon" style="color: #ff5234"></icon-svg>
              <h1 style="float: right">35人</h1>
            </el-col>
          </el-card>
        </el-col>
        <el-col :span="8" >
          <el-card>
            <el-col :span="12" offset="6">
              <icon-svg name="medicalcase" class="head_icon" style="color: #21ff22"></icon-svg>
              <h1 style="float: right">148例</h1>
            </el-col>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12" >
          <el-card>
            <ve-line :data="lineData"></ve-line>
          </el-card>
        </el-col>
        <el-col :span="12" >
          <el-card>
            <ve-histogram :data="barData" :settings="barChartSettings"></ve-histogram>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8" >
          <el-card>
            <ve-pie :data="pieData"></ve-pie>
          </el-card>
        </el-col>
        <el-col :span="8" >
          <el-card>
            <ve-ring :data="ringData" :settings="ringChartSettings"></ve-ring>
          </el-card>
        </el-col>
        <el-col :span="8" >
          <el-card>
            <ve-funnel :data="funnelData" :settings="funnelChartSettings"></ve-funnel>
          </el-card>
        </el-col>
      </el-row>
    </div>
</template>

<script>

export default {
  data () {
    this.barChartSettings = {
      axisSite: { right: ['下单率'] },
      yAxisType: ['KMB', 'percent'],
      yAxisName: ['数值', '比率']
    }
    this.ringChartSettings = {
      roseType: 'radius'
    }
    this.funnelChartSettings = {
      sequence: ['订单', '点击', '访问', '展示']
    }
    return {
      chartBar: null,
      // 折线图
      lineData: {
        columns: ['月份', '住院病人总数', '男性病人', '女性病人'],
        rows: [
          { '月份': '1', '住院病人总数': 1393, '男性病人': 693, '女性病人': 700 },
          { '月份': '2', '住院病人总数': 1400, '男性病人': 750, '女性病人': 650 },
          { '月份': '3', '住院病人总数': 1320, '男性病人': 620, '女性病人': 700 },
          { '月份': '4', '住院病人总数': 1250, '男性病人': 650, '女性病人': 600 },
          { '月份': '5', '住院病人总数': 1344, '男性病人': 540, '女性病人': 804 },
          { '月份': '6', '住院病人总数': 1230, '男性病人': 520, '女性病人': 710 }
        ]
      },
      barData: {
        columns: ['年龄', '男性病人', '女性病人'],
        rows: [
          { '年龄': '50+', '男性病人': 33, '女性病人': 43 },
          { '年龄': '60+', '男性病人': 60, '女性病人': 80 },
          { '年龄': '70+', '男性病人': 53, '女性病人': 83 },
          { '年龄': '80+', '男性病人': 43, '女性病人': 43 },
          { '年龄': '90+', '男性病人': 18, '女性病人': 12 }]
      },
      pieData: {
        columns: ['日期', '访问用户'],
        rows: [
          { '日期': '1/1', '访问用户': 1393 },
          { '日期': '1/2', '访问用户': 3530 },
          { '日期': '1/3', '访问用户': 2923 },
          { '日期': '1/4', '访问用户': 1723 },
          { '日期': '1/5', '访问用户': 3792 },
          { '日期': '1/6', '访问用户': 4593 }
        ]
      },
      ringData: {
        columns: ['日期', '访问用户'],
        rows: [
          { '日期': '1/1', '访问用户': 1393 },
          { '日期': '1/2', '访问用户': 3530 },
          { '日期': '1/3', '访问用户': 2923 },
          { '日期': '1/4', '访问用户': 1723 },
          { '日期': '1/5', '访问用户': 3792 },
          { '日期': '1/6', '访问用户': 4593 }
        ]
      },
      funnelData: {
        columns: ['病程', '数值'],
        rows: [
          { '病程': '记忆减退', '数值': 900 },
          { '病程': '视力模糊', '数值': 600 },
          { '病程': '行动不便', '数值': 300 },
          { '病程': '卧床不起', '数值': 100 }
        ]
      }
    }
  },
  methods: {
  }
}
</script>

<style lang="scss">
  .mod-demo-echarts {
  > .el-row {
    margin-top: -10px;
    margin-bottom: -10px;
  .el-col {
    padding-top: 10px;
    padding-bottom: 10px;
  }
  }
  .chart-box {
    min-height: 400px;
  }
  .head_icon{
    width: 5em;
    height: 5em;
    float: left;
    }
  }
</style>
