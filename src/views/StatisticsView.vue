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
import { ref, onMounted, onUnmounted } from "vue";
import { ArrowRight } from "@element-plus/icons-vue";
import * as echarts from "echarts";
import type { ECharts } from "echarts";
import axios from "axios";
import { ElMessage } from "element-plus";

// 定义统计数据类型
interface StatisticsItem {
  id: string;
  title: string;
  viewCount: number;
  viewRank: number;
  createTime: string; // 添加 createTime 用于趋势排序
}

// 统计数据
const statisticsData = ref<StatisticsItem[]>([]);

// 图表引用
const barChart = ref<HTMLDivElement | null>(null);
const lineChart = ref<HTMLDivElement | null>(null);

// 获取新闻数据
const getData = async () => {
  try {
    const res = await axios.get("http://localhost:8080/news/pageNews", {
      params: { pageNum: 1, pageSize: 100 } // 获取足够数据，假设新闻不多
    });
    if (res.data.code === 0) {
      let data = res.data.data;
      // 按 viewCount 降序排序，并添加排名
      data.sort((a: any, b: any) => b.viewCount - a.viewCount);
      data.forEach((item: any, index: number) => {
        item.viewRank = index + 1;
      });
      statisticsData.value = data;
    } else {
      ElMessage.error("加载失败：" + res.data.msg);
      statisticsData.value = [];
    }
  } catch (err) {
    ElMessage.error("接口请求失败：" + (err as Error).message);
  }
};

// 初始化柱状图（浏览量对比，使用按 viewCount 排序的数据）
const initBarChart = () => {
  if (!barChart.value || statisticsData.value.length === 0) return;
  
  const chartInstance: ECharts = echarts.init(barChart.value);
  
  const option = {
    tooltip: {
      trigger: 'axis' as const,
      formatter: '{b}: {c} 次浏览'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category' as const,
      data: statisticsData.value.map(item => item.title),
      axisLabel: {
        rotate: 45,
        interval: 0,
        fontSize: 12
      }
    },
    yAxis: {
      type: 'value' as const,
      name: '浏览量'
    },
    series: [
      {
        data: statisticsData.value.map(item => item.viewCount),
        type: 'bar' as const,
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

// 初始化折线图（浏览量趋势，按 createTime 排序）
const initLineChart = () => {
  if (!lineChart.value || statisticsData.value.length === 0) return;
  
  // 按 createTime 升序排序以展示趋势
  const sortedByTime = [...statisticsData.value].sort((a, b) => 
    new Date(a.createTime).getTime() - new Date(b.createTime).getTime()
  );
  
  const chartInstance: ECharts = echarts.init(lineChart.value);
  
  const option = {
    tooltip: {
      trigger: 'item' as const,
      formatter: '{b}: {c} 次浏览'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category' as const,
      data: sortedByTime.map(item => item.title || `新闻${item.id}`), // 使用标题或编号
      name: '新闻'
    },
    yAxis: {
      type: 'value' as const,
      name: '浏览量'
    },
    series: [
      {
        data: sortedByTime.map(item => item.viewCount),
        type: 'line' as const,
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

// 页面挂载时获取数据并初始化图表
onMounted(async () => {
  await getData();
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