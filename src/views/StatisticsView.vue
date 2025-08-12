<template>
  <el-breadcrumb :separator-icon="ArrowRight" style="margin-bottom: 20px;">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>内容管理</el-breadcrumb-item>
    <el-breadcrumb-item>浏览量统计</el-breadcrumb-item>
  </el-breadcrumb>

  <el-card>
    <template #header>
      <span>新闻浏览量统计</span>
    </template>
    <div class="chart-container">
      <!-- 柱状图展示 -->
      <div class="chart-wrapper">
        <h3>各新闻浏览量对比</h3>
        <div ref="barChart" class="chart-area"></div>
      </div>
      
      <!-- 折线图展示 -->
      <div class="chart-wrapper">
        <h3>浏览量趋势分布</h3>
        <div ref="lineChart" class="chart-area"></div>
      </div>
    </div>
  </el-card>

  <!-- 数据表格展示 -->
  <el-card style="margin-top: 20px;">
    <template #header>
      <span>新闻数据列表</span>
    </template>
    <el-table :data="statisticsData" border stripe style="width: 100%;">
      <el-table-column prop="id" label="编号" width="80" />
      <el-table-column prop="title" label="标题" width="400" />
      <el-table-column prop="viewCount" label="阅读量" width="120" />
      <el-table-column prop="viewRank" label="浏览量排名" width="120">
        <template #default="scope">
          <el-tag type="info">{{ scope.row.viewRank }}</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted} from "vue";
import { ArrowRight } from "@element-plus/icons-vue";
import * as echarts from "echarts";
import type { ECharts } from "echarts";

// 定义统计数据类型
interface StatisticsItem {
  id: string;
  title: string;
  viewCount: number;
  viewRank: number;
}

// 从statistics.txt解析的数据
const statisticsData: StatisticsItem[] = [
  { id: "1", title: "2025 美国本科申请截止日期汇总", viewCount: 2156, viewRank: 1 },
  { id: "2", title: "雅思口语 9-12 月新题预测", viewCount: 1892, viewRank: 2 },
  { id: "3", title: "澳洲留学签证政策 2024 更新", viewCount: 1568, viewRank: 3 },
  { id: "4", title: "托福家考认可度提升！这些院校接受", viewCount: 1325, viewRank: 4 }
];

// 图表引用
const barChart = ref<HTMLDivElement | null>(null);
const lineChart = ref<HTMLDivElement | null>(null);

// 初始化柱状图
const initBarChart = () => {
  if (!barChart.value) return;
  
  const chartInstance: ECharts = echarts.init(barChart.value);
  
  const option = {
  tooltip: {
    trigger: 'axis' as const,  // 添加 as const 断言
    formatter: '{b}: {c} 次浏览'
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '15%',
    containLabel: true
  },
  xAxis: {
    type: 'category' as const,  // 添加 as const 断言
    data: statisticsData.map(item => item.title),
    axisLabel: {
      rotate: 45,
      interval: 0,
      fontSize: 12
    }
  },
  yAxis: {
    type: 'value' as const,  // 添加 as const 断言
    name: '浏览量'
  },
  series: [
    {
      data: statisticsData.map(item => item.viewCount),
      type: 'bar' as const,  // 添加 as const 断言
      itemStyle: {
        color: '#409eff'
      },
      label: {
        show: true,
        position: 'top',
        formatter: '{c}'
      }
    }
  ]
};
  
  chartInstance.setOption(option);
  
  // 响应窗口大小变化
  const handleResize = () => {
    chartInstance.resize();
  };
  window.addEventListener('resize', handleResize);
  
  // 组件卸载时移除事件监听
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
  });
};

// 初始化折线图
const initLineChart = () => {
  if (!lineChart.value) return;
  
  const chartInstance: ECharts = echarts.init(lineChart.value);
  
  const option = {
  tooltip: {
    trigger: 'item' as const,  // 添加 as const 断言
    formatter: '{b}: {c} 次浏览'
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category' as const,  // 添加 as const 断言
    data: statisticsData.map(item => `新闻${item.id}`),
    name: '新闻编号'
  },
  yAxis: {
    type: 'value' as const,  // 添加 as const 断言
    name: '浏览量'
  },
  series: [
    {
      data: statisticsData.map(item => item.viewCount),
      type: 'line' as const,  // 添加 as const 断言
      smooth: true,
      symbol: 'circle',
      symbolSize: 8,
      lineStyle: {
        width: 3
      },
      itemStyle: {
        color: '#67c23a'
      },
      label: {
        show: true,
        position: 'top'
      }
    }
  ]
};
  
  chartInstance.setOption(option);
  
  // 响应窗口大小变化
  const handleResize = () => {
    chartInstance.resize();
  };
  window.addEventListener('resize', handleResize);
  
  // 组件卸载时移除事件监听
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
  });
};

// 页面挂载时初始化图表
onMounted(() => {
  initBarChart();
  initLineChart();
});
</script>

<style scoped>
.chart-container {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.chart-wrapper {
  flex: 1;
  min-width: 300px;
}

.chart-area {
  width: 100%;
  height: 400px;
  margin-top: 10px;
}

h3 {
  font-size: 16px;
  color: #333;
  margin: 0;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}
</style>