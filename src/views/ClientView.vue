<template>
  <div class="home-page">
    <!-- Header Navigation -->
    <header class="header">
      <div class="container">
        <div class="nav">
          <div class="logo">东西方国际教育</div>
          <div class="menu-icon" @click="toggleMenu">
            <el-icon><Menu /></el-icon>
          </div>
          <nav class="nav-menu" :class="{ 'active': menuVisible }">
            <ul>
              <li><a href="#">首页</a></li>
              <li><a href="#about">关于我们</a></li>
              <li><a href="#courses">课程体系</a></li>
              <li><a href="#cases">成功案例</a></li>
              <li><a href="#news">资讯中心</a></li>
              <li><a href="#contact">联系我们</a></li>
            </ul>
          </nav>
        </div>
      </div>
    </header>

    <!-- Banner Carousel -->
    <section class="banner">
      <el-carousel height="500px" :interval="5000" arrow="always">
        <el-carousel-item v-for="item in bannerItems" :key="item.id">
          <img :src="item.image" alt="Banner" class="banner-image" />
          <div class="banner-text">
            <h1>{{ item.title }}</h1>
            <p>{{ item.subtitle }}</p>
            <el-button type="primary" @click="handleConsult">立即咨询</el-button>
          </div>
        </el-carousel-item>
      </el-carousel>
    </section>

    <!-- About Section -->
    <section id="about" class="about">
      <div class="container">
        <h2>关于我们</h2>
        <p>东西方国际教育集团成立于1999年，已有26年历史，是一个综合性教育科技服务集团，专注于国际教育、行业研究、项目开发和机构服务。集团在全球范围内运营，在多个中国城市设有分支机构，并在香港、英国、美国、加拿大等地设有子公司。我们致力于为学生提供优质的国际教育资源，帮助他们实现留学梦想。</p>
        <div class="culture">
          <el-card shadow="hover">
            <h3>企业理念</h3>
            <p>以客户为中心，以奋斗者为基石</p>
          </el-card>
          <el-card shadow="hover">
            <h3>价值观</h3>
            <p>客户为先、团队为本、创新驱动、协作共赢</p>
          </el-card>
          <el-card shadow="hover">
            <h3>愿景</h3>
            <p>做中国最好的国际教育服务机构</p>
          </el-card>
        </div>
      </div>
    </section>

    <!-- Courses Section -->
    <section id="courses" class="courses">
      <div class="container">
        <h2>热门课程</h2>
        <div class="course-grid">
          <el-card v-for="course in courses" :key="course.id" class="course-card" shadow="hover">
            <img :src="course.coverImage" alt="Course Cover" class="course-image" />
            <h3>{{ course.title }}</h3>
            <p>{{ course.description }}</p>
            <el-tag type="success" effect="dark" class="course-tag">难度: {{ course.level }}</el-tag>
            <el-button type="warning" @click="handleEnroll(course)">立即报名</el-button>
          </el-card>
        </div>
      </div>
    </section>

    <!-- Success Cases Section -->
    <section id="cases" class="cases">
      <div class="container">
        <h2>成功案例</h2>
        <div class="case-grid">
          <el-card v-for="caseItem in successCases" :key="caseItem.id" class="case-card" shadow="hover">
            <img :src="caseItem.image" alt="Case Image" class="case-image" />
            <h3>{{ caseItem.title }}</h3>
            <p>{{ caseItem.description }}</p>
          </el-card>
        </div>
      </div>
    </section>

    <!-- News Section -->
    <section id="news" class="news">
      <div class="container">
        <h2>最新资讯</h2>
        <el-carousel height="300px" :interval="4000" type="card" arrow="always">
          <el-carousel-item v-for="news in newsItems" :key="news.id">
            <el-card shadow="hover">
              <img :src="news.coverImage" alt="News Cover" class="news-image" />
              <h3>{{ news.title }}</h3>
              <p>{{ news.summary }}</p>
              <el-button type="info" @click="handleReadMore(news)">阅读更多</el-button>
            </el-card>
          </el-carousel-item>
        </el-carousel>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <p>&copy; 2025 东西方国际教育集团. All Rights Reserved.</p>
        <ul class="footer-links">
          <li><a href="#">隐私政策</a></li>
          <li><a href="#">使用条款</a></li>
          <li><a href="#">联系我们</a></li>
        </ul>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ElCarousel, ElCarouselItem, ElButton, ElCard, ElIcon, ElTag } from 'element-plus';
import { Menu } from '@element-plus/icons-vue';

// State for menu visibility
const menuVisible = ref(false);

// Toggle menu for mobile
const toggleMenu = () => {
  menuVisible.value = !menuVisible.value;
};

// Static data for banner
const bannerItems = ref([
  {
    id: 1,
    title: '开启国际教育之旅',
    subtitle: '专业指导，助力留学梦想，提供一站式服务',
    image:'/image/gjjybj.png',
  },
  {
    id: 2,
    title: '全球优质课程资源',
    subtitle: '个性化学习路径规划，覆盖多种留学需求',
    image: '/image/lqtzs.png',
  },
  {
    id: 3,
    title: '成功案例分享',
    subtitle: '数千学生圆梦世界名校，真实故事激励前行',
    image: '/image/lxmdd.png',
  },
]);

// Static data for courses
const courses = ref([
  {
    id: 1,
    title: '雅思强化课程',
    description: '针对雅思考试的全面培训，帮助学生快速提升听、说、读、写成绩。课程包括模拟考试和个性化反馈。',
    coverImage: '/image/xxyy.png',
    level: '中级',
  },
  {
    id: 2,
    title: '托福冲刺班',
    description: '高效备考策略，聚焦高频考点，助力学生高分通过托福考试。包含在线资源和导师指导。',
    coverImage: '/image/yyks.png',
    level: '高级',
  },
  {
    id: 3,
    title: '留学规划咨询',
    description: '个性化留学方案设计，指导申请世界顶尖大学，包括文书写作和面试准备。',
    coverImage: '/image/xstl.png',
    level: '入门',
  },
  {
    id: 4,
    title: '国际文化交流项目',
    description: '促进中外文化理解，提升全球视野，通过线上线下活动连接国际学生。',
    coverImage:  '/image/xsjh.png',
    level: '中级',
  },
  {
    id: 5,
    title: 'GRE/GMAT备考课程',
    description: '针对研究生入学考试的专项训练，涵盖量化、逻辑和写作模块。',
    coverImage: '/image/sxks.png',
    level: '高级',
  },
]);

// Static data for success cases
const successCases = ref([
  {
    id: 1,
    title: '学生成功录取哈佛大学',
    description: '通过我们的留学规划服务，学生从普通高中生转变为哈佛新生，实现了梦想。',
    image: '/image/hfdxhy.png',
  },
  {
    id: 2,
    title: '学生获得全额奖学金',
    description: '在托福冲刺班的帮助下，学生高分通过考试，并获得英国牛津大学全额奖学金。',
    image: '/image/jxj.png',
  },
  {
    id: 3,
    title: '学生文化交流项目经历',
    description: '参与国际文化交流后，学生提升了语言能力和跨文化适应力，成功申请加拿大大学。',
    image: '/image/cpjh.png',
  },
]);

// Static data for news
const newsItems = ref([
  {
    id: 1,
    title: '2025留学新政解读',
    summary: '分析最新留学政策变化，包括签证调整和奖学金机会，对留学生的影响详解。',
    coverImage: '/image/hy.png',
  },
  {
    id: 2,
    title: '国际教育展盛大开幕',
    summary: '2025年教育展在北京举办，汇聚全球顶尖大学，现场咨询留学机会。',
    coverImage: '/image/gjzl.png',
  },
  {
    id: 3,
    title: '总裁寄语：教育全球化趋势',
    summary: '探讨AI在教育中的应用，以及全球化背景下国际教育的机遇与挑战。',
    coverImage: '/image/zcfy.png',
  },
  {
    id: 4,
    title: '学生成功故事分享会',
    summary: '邀请多名毕业生分享留学经历，激励更多学生追求国际教育梦想。',
    coverImage: '/image/hjfy.png',
  },
]);

// Handlers (static, no backend)
const handleConsult = () => {
  alert('咨询功能即将上线！请联系客服：service@iewie.org');
};

const handleEnroll = (course: any) => {
  alert(`您已选择报名：${course.title}。请联系客服以完成注册。`);
};

const handleReadMore = (news: any) => {
  alert(`正在跳转阅读：${news.title}。完整内容请访问官网资讯页面。`);
};
</script>

<style scoped>
/* Global Styles */
.home-page {
  font-family: 'Roboto', 'Microsoft YaHei', '宋体', sans-serif;
  color: #333;
  overflow-x: hidden;
}

/* Header */
.header {
  background-color: #5a84e9;
  color: white;
  padding: 15px 0;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.logo {
  font-size: 24px;
  font-weight: 700;
}
.menu-icon {
  display: none;
  cursor: pointer;
  font-size: 24px;
}
.nav-menu ul {
  display: flex;
  list-style: none;
  gap: 20px;
  margin: 0;
  padding: 0;
}
.nav-menu a {
  color: white;
  text-decoration: none;
  font-size: 16px;
  transition: color 0.3s;
}
.nav-menu a:hover {
  color: #FF7D00;
}

/* Banner */
.banner {
  position: relative;
}
.banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.banner-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  background: rgba(0, 0, 0, 0.3);
  padding: 20px;
  border-radius: 8px;
}
.banner-text h1 {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 10px;
}
.banner-text p {
  font-size: 18px;
  margin-bottom: 20px;
}

/* About */
.about {
  padding: 60px 0;
  background-color: #f5f5f5;
}
.about h2 {
  font-size: 28px;
  color: #165DFF;
  text-align: center;
  margin-bottom: 20px;
}
.about p {
  font-size: 16px;
  line-height: 1.6;
  text-align: center;
  margin-bottom: 40px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}
.culture {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}
.culture .el-card {
  transition: transform 0.3s;
}
.culture .el-card:hover {
  transform: translateY(-5px);
}
.culture h3 {
  font-size: 20px;
  color: #165DFF;
  text-align: center;
}

/* Courses */
.courses {
  padding: 60px 0;
  background-color: white;
}
.courses h2 {
  font-size: 28px;
  color: #165DFF;
  text-align: center;
  margin-bottom: 40px;
}
.course-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}
.course-card {
  text-align: center;
  transition: transform 0.3s;
}
.course-card:hover {
  transform: translateY(-5px);
}
.course-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px 8px 0 0;
}
.course-card h3 {
  font-size: 20px;
  margin: 15px 0 10px;
}
.course-card p {
  font-size: 14px;
  color: #666;
  margin-bottom: 15px;
}
.course-tag {
  margin-bottom: 10px;
}

/* Success Cases */
.cases {
  padding: 60px 0;
  background-color: #f5f5f5;
}
.cases h2 {
  font-size: 28px;
  color: #165DFF;
  text-align: center;
  margin-bottom: 40px;
}
.case-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}
.case-card {
  text-align: center;
  transition: transform 0.3s;
}
.case-card:hover {
  transform: translateY(-5px);
}
.case-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px 8px 0 0;
}
.case-card h3 {
  font-size: 20px;
  margin: 15px 0 10px;
}
.case-card p {
  font-size: 14px;
  color: #666;
}

/* News */
.news {
  padding: 60px 0;
  background-color: white;
}
.news h2 {
  font-size: 28px;
  color: #165DFF;
  text-align: center;
  margin-bottom: 40px;
}
.news-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}
.news :deep(.el-card) {
  text-align: center;
  height: 100%;
}
.news h3 {
  font-size: 20px;
  margin: 15px 0 10px;
}
.news p {
  font-size: 14px;
  color: #666;
  margin-bottom: 15px;
}

/* Footer */
.footer {
  background-color: #165DFF;
  color: white;
  padding: 40px 0;
  text-align: center;
}
.footer-links {
  list-style: none;
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 10px;
  padding: 0;
}
.footer-links a {
  color: white;
  text-decoration: none;
  transition: color 0.3s;
}
.footer-links a:hover {
  color: #ae7d4f;
}

/* Responsive Design */
@media (max-width: 768px) {
  .menu-icon {
    display: block;
  }
  .nav-menu {
    display: none;
    position: absolute;
    top: 60px;
    left: 0;
    width: 100%;
    background-color: #2b4c98;
  }
  .nav-menu.active {
    display: block;
  }
  .nav-menu ul {
    flex-direction: column;
    padding: 20px;
  }
  .nav-menu li {
    margin-bottom: 10px;
  }
  .banner {
    height: 300px;
  }
  .banner-text h1 {
    font-size: 24px;
  }
  .banner-text p {
    font-size: 14px;
  }
  .about, .courses, .cases, .news {
    padding: 40px 0;
  }
  .culture, .course-grid, .case-grid {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 768px) and (max-width: 1024px) {
  .banner {
    height: 400px;
  }
  .banner-text h1 {
    font-size: 30px;
  }
  .culture, .course-grid, .case-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>