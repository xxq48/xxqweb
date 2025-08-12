<template>
  <el-container class="layout-container-demo" style="height: 100vh">
    <el-aside width="200px">
      <el-scrollbar>
        <el-menu :default-openeds="['1', '4']" router>
          <!-- 系统管理模块 -->
          <el-sub-menu index="1">
            <template #title>
              <el-icon><User /></el-icon>系统管理
            </template>
            <el-menu-item index="/user"><el-icon><Avatar /></el-icon>用户管理</el-menu-item>
            <el-menu-item index="/role"><el-icon><Key /></el-icon>角色管理</el-menu-item>
          </el-sub-menu>
          
          <!-- 咨询管理模块 -->
          <el-sub-menu index="2">
            <template #title>
              <el-icon><Message /></el-icon>咨询管理
            </template>
            <el-menu-item index="consultation"><el-icon><ChatDotRound /></el-icon>咨询记录</el-menu-item>
          </el-sub-menu>
          
          <!-- 课程管理模块 -->
          <el-sub-menu index="3">
  <template #title>
    <el-icon><Reading /></el-icon>课程管理 
  </template>
            <el-menu-item index="course"><el-icon><Document /></el-icon>课程列表</el-menu-item>
            <el-menu-item index="teacher"><el-icon><UserFilled /></el-icon>教师管理</el-menu-item>
          </el-sub-menu>
          
          <!-- 资讯管理模块 -->
          <el-sub-menu index="4">
            <template #title>
  <el-icon><MessageBox /></el-icon>资讯管理
</template>
            <el-menu-item index="news"><el-icon><Reading /></el-icon>资讯列表</el-menu-item>
           <el-menu-item index="statistics"><el-icon><Histogram/></el-icon>浏览统计</el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-scrollbar>
    </el-aside>
    
    <el-container>
      <el-header style="text-align: right; font-size: 12px">
        <div class="toolbar">
          <el-dropdown>
            <el-icon style="margin-right: 8px; margin-top: 1px">
              <Setting />
            </el-icon>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
                <el-dropdown-item @click="goProfile">个人中心</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <span>{{ state.suName }}</span>
        </div>
      </el-header>
      
      <el-main>
        <el-scrollbar>
          <router-view />
          
          <!-- 默认展示课程数据表格 -->
          <div v-if="$route.path === '/'">
            <el-card>
              <template #header>
                <div class="card-header">
                  <span>热门课程列表</span>
                  <el-button type="primary" size="small" @click="refreshData">刷新数据</el-button>
                </div>
              </template>
              
              <el-table :data="state.courseData" border style="width: 100%">
                <el-table-column prop="id" label="课程ID" width="80" />
                <el-table-column prop="title" label="课程名称" width="200" />
              <el-table-column prop="price" label="价格" width="100">
  <template #default="scope">{{ formatPrice(scope.row.price) }}</template>
</el-table-column>
                <el-table-column prop="duration" label="时长(月)" width="100" />
                <el-table-column prop="level" label="难度级别" width="120">
                  <template #default="scope">
                    <el-tag :type="getLevelTagType(scope.row.level)">
                      {{ scope.row.level === 1 ? '入门' : 
                        scope.row.level === 2 ? '基础' : 
                        scope.row.level === 3 ? '进阶' : '高级' }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="time" label="创建时间" width="160" />
                <el-table-column label="操作" width="180">
                  <template #default="scope">
                    <el-button size="small" @click="viewCourseDetail(scope.row.id)">查看详情</el-button>
                    <el-button size="small" type="primary" @click="editCourse(scope.row.id)">编辑</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </div>
        </el-scrollbar>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import { 
  User, Message, Reading, 
  MessageBox, Avatar, Key, ChatDotRound, Check,  
  Document, UserFilled, Histogram,  
  Setting, Refresh, ArrowRight
} from "@element-plus/icons-vue";
import { reactive, onMounted } from "vue";
import { useRouter } from 'vue-router';
import axios from "axios";
import { ElMessage,ElLoading } from 'element-plus';

const router = useRouter();

// 状态管理
const state = reactive({
  suName: '',
  courseData: [],
  loading: false
});

// 格式化价格过滤器
const formatPrice = (value: number) => {
  return `¥${value.toFixed(2)}`;
};

// 获取难度级别标签样式
const getLevelTagType = (level: number) => {
  const types = ['', 'success', 'info', 'warning', 'danger'];
  return types[level] || 'default';
};

// 刷新数据
const refreshData = () => {
  state.loading = true;
  fetchCourseData().then(() => {
    state.loading = false;
    ElMessage.success('数据刷新成功');
  });
};

// 获取课程数据
const fetchCourseData = () => {
  return axios.get('http://localhost:8080/course/listCourse')
    .then(res => {
      // 转换价格为数字类型
      state.courseData = res.data.map((course: any) => ({
        ...course,
        price: Number(course.price)
      }));
      return state.courseData;
    })
    .catch(err => {
      console.error('获取课程数据失败:', err);
      ElMessage.error('获取课程数据失败');
      return [];
    });
};

// 获取课程详情
const fetchCourseDetail = (id: number) => {
  const loading = ElLoading.service({
    lock: true,
    text: '加载中...',
    background: 'rgba(0, 0, 0, 0.7)'
  });
  
  return axios.get(`http://localhost:8080/course/detail/${id}`)
    .then(res => {
      loading.close();
      return res.data;
    })
    .catch(err => {
      loading.close();
      console.error('获取课程详情失败:', err);
      ElMessage.error('获取课程详情失败');
      return null;
    });
};

// 查看课程详情
const viewCourseDetail = async (id: number) => {
  const courseDetail = await fetchCourseDetail(id);
  if (courseDetail) {
    router.push({
      path: `/course/detail/${id}`,
      query: { course: JSON.stringify(courseDetail) }
    });
  }
};

// 编辑课程
const editCourse = async (id: number) => {
  const courseDetail = await fetchCourseDetail(id);
  if (courseDetail) {
    // 存储课程详情到localStorage供编辑页面使用
    localStorage.setItem('editCourseData', JSON.stringify(courseDetail));
    router.push(`/course/edit/${id}`);
  }
};

// 保存课程编辑
const saveCourseEdit = async (formData: any) => {
  try {
    await axios.put(`http://localhost:8080/course/update/${formData.id}`, formData);
    ElMessage.success('课程编辑成功');
    // 返回课程列表并刷新数据
    router.push('/course');
    fetchCourseData();
    return true;
  } catch (err) {
    console.error('保存课程编辑失败:', err);
    ElMessage.error('保存课程编辑失败');
    return false;
  }
};

// 个人中心
const goProfile = () => {
  router.push('/profile');
};

// 退出登录
const logout = () => {
  localStorage.clear();
  router.push('/login');
  ElMessage.success('已退出登录');
};

// 页面初始化
onMounted(() => {
  // 验证登录状态
  const suName = localStorage.getItem('suName');
  if (suName) {
    state.suName = suName;
    fetchCourseData(); // 加载课程数据
  } else {
    router.push('/login');
  }
});

// 暴露方法供子组件使用
defineExpose({
  saveCourseEdit,
  fetchCourseDetail
});

</script>

<style scoped>
.layout-container-demo .el-header {
  background-color: var(--el-color-primary-light-7);
  color: var(--el-text-color-primary);
  padding: 0 20px;
}

.layout-container-demo .el-aside {
  background: var(--el-color-primary-light-8);
  border-right: 1px solid var(--el-border-color);
}

.el-menu {
  border-right: none;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.toolbar {
  height: 100%;
  display: flex;
  align-items: center;
  gap: 15px;
}

.el-main {
  padding: 15px;
}

.el-table {
  margin-top: 15px;
}
</style>