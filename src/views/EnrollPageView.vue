<template>
  <div class="enroll-page">
    <header class="page-header">
      <h1>课程报名 - {{ courseName }}</h1>
    </header>
    <main class="enroll-form">
      <el-form ref="enrollForm" :model="form" label-width="120px">
        <el-form-item label="课程名称" disabled>
          <el-input v-model="form.courseName"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" type="tel"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" type="email"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">提交报名</el-button>
        </el-form-item>
      </el-form>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps , onMounted} from 'vue';
import { ElMessage } from 'element-plus';
import {useRoute} from 'vue-router';

const route = useRoute();

const courseName = ref<string>(route.query.courseName as string || '');

// 表单数据
const form = ref({
  courseId: '',
  courseName:'',
  name: '',
  phone: '',
  email: ''
});

// 表单提交
const submitForm = () => {
  // 实际项目中这里会调用API提交数据
  ElMessage.success(`报名成功！我们将尽快与您联系确认${form.value.courseName}的课程详情`);
};

onMounted(() => {
  form.value.courseId = route.query.courseId as string;
  form.value.courseName = route.query.courseName as string;
});

</script>

<style scoped>
.enroll-page {
  padding: 40px 20px;
}
.page-header {
  text-align: center;
  margin-bottom: 30px;
}
.enroll-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
</style>