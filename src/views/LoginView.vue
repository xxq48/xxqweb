<template>
  <div class="login-container">
    <!-- 背景装饰 -->
    <div class="bg-decoration"></div>

    <!-- 登录卡片 -->
    <el-card class="login-card" shadow="hover">
      <!-- 企业Logo和标题 -->
      <div class="login-header">
        <div class="logo">
          <el-icon class="logo-icon"><Globe /></el-icon>
          <span class="logo-text">GlobalEdu</span>
        </div>
        <h2 class="login-title">管理员登录</h2>
        <p class="login-desc">欢迎登录国际教育管理系统</p>
      </div>

      <!-- 登录表单 -->
      <el-form
        :model="loginForm"
        class="login-form"
        size="large"
        ref="loginFormRef"
        :rules="loginRules"
      >
        <!-- 账号输入 -->
        <el-form-item prop="name">
          <el-input
            v-model="loginForm.name"
            placeholder="请输入账号"
            prefix-icon="User"
            :maxlength="20"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <!-- 密码输入 -->
        <el-form-item prop="pwd">
          <el-input
            v-model="loginForm.pwd"
            type="password"
            placeholder="请输入密码"
            prefix-icon="Lock"
            :show-password="showPassword"
            @click:suffix="showPassword = !showPassword"
            :maxlength="20"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <!-- 验证码输入 -->
        <el-form-item prop="captcha">
          <div class="captcha-container">
            <el-input
              v-model="loginForm.captcha"
              placeholder="请输入验证码"
              prefix-icon="Key"
              :maxlength="4"
              autocomplete="off"
              class="captcha-input"
            ></el-input>
            <div class="captcha-image" @click="refreshCaptcha">
              <!-- 验证码图片区域 -->
              <span class="captcha-text">{{ captchaText }}</span>
              <el-icon class="refresh-icon"><Refresh /></el-icon>
            </div>
          </div>
        </el-form-item>

        <!-- 记住密码和忘记密码 -->
        <div class="form-actions">
          <el-checkbox v-model="loginForm.rememberMe" size="small"
            >记住密码</el-checkbox>
          <el-link type="primary" size="small" class="forgot-password"
            >忘记密码?</el-link
          >
        </div>

        <!-- 登录按钮 -->
        <el-form-item>
          <el-button
            type="primary"
            class="login-btn"
            size="large"
            :loading="isLoading"
            @click="handleLogin"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import {
  ChatDotRound,
  Refresh,
  User,
  Lock,
  Key,
} from "@element-plus/icons-vue";
import axios from "axios";
import { lo } from "element-plus/es/locales.mjs";

// 登录表单数据
const loginForm = ref({
  name: "",
  pwd: "",
  captcha: "",
  rememberMe: false,
});

// 表单验证规则
const loginRules = ref({
  name: [{ required: true, message: "请输入账号", trigger: "blur" }],
  pwd: [{ required: true, message: "请输入密码", trigger: "blur" }],
  captcha: [
    { required: true, message: "请输入验证码", trigger: "blur" },
    { len: 4, message: "验证码长度为4位", trigger: "blur" },
    {
      validator: (rule: any, value: string, callback: any) => {
        if (value.toUpperCase() !== captchaText.value) {
          callback(new Error("验证码不正确"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
});

// 状态变量
const showPassword = ref(false);
const isLoading = ref(false);
const captchaText = ref(""); // 验证码文本
const loginFormRef = ref<any>(null);
const router = useRouter();

// 自动刷新相关
let refreshTimer: number | null = null;

// 生成随机验证码
const generateCaptcha = () => {
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// 刷新验证码方法
const refreshCaptcha = () => {
  captchaText.value = generateCaptcha();
  loginForm.value.captcha = ""; // 清空输入框
};

// 启动自动刷新定时器
const startAutoRefresh = () => {
  // 清除现有定时器
  if (refreshTimer) {
    window.clearInterval(refreshTimer);
  }
  // 每60秒刷新一次
  refreshTimer = window.setInterval(refreshCaptcha, 60000);
};

// 登录处理函数
const handleLogin = async () => {
  // 表单验证
  try {
    await loginFormRef.value.validate();
    isLoading.value = true;

    // 模拟登录请求
    setTimeout(() => {
      isLoading.value = false;

      // 这里可以添加实际的登录API调用
      // 假设登录成功
      axios({
        method: "post",
        url: "http://localhost:8080/sysUser/login",
        params: loginForm.value,
      })
        .then((res) => {
          if (res.data.code == 0) {
            localStorage.setItem("suName", loginForm.value.name);
            // 记住密码逻辑
            if (loginForm.value.rememberMe) {
              localStorage.setItem("username", loginForm.value.name);
              localStorage.setItem("password", loginForm.value.pwd);
            } else {
              localStorage.removeItem("username");
              localStorage.removeItem("password");
            }
            // 跳转到首页或其他指定页面
            router.push("/");
          }
        })
        .catch((error) => {
          ElMessage.error("登录失败: " + error.message);
        });
    }, 1000);
  } catch (error) {
    console.log("表单验证失败", error);
    return;
  }
};

// 组件挂载时初始化验证码并启动自动刷新
onMounted(() => {
  refreshCaptcha();
  startAutoRefresh();

  // 读取记住的密码
  const savedUsername = localStorage.getItem("username");
  const savedPassword = localStorage.getItem("password");
  if (savedUsername && savedPassword) {
    loginForm.value.name = savedUsername;
    loginForm.value.pwd = savedPassword;
    loginForm.value.rememberMe = true;
  }
});

// 组件卸载时清除定时器
onUnmounted(() => {
  if (refreshTimer) {
    window.clearInterval(refreshTimer);
  }
});
</script>

<style scoped>
/* 样式部分保持不变 */
.login-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
  position: relative;
  padding: 20px;
}

/* 背景装饰 */
.bg-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: radial-gradient(
      circle at 20% 30%,
      rgba(66, 153, 225, 0.1) 0%,
      transparent 40%
    ),
    radial-gradient(
      circle at 80% 70%,
      rgba(102, 16, 242, 0.1) 0%,
      transparent 40%
    );
  z-index: 1;
}

/* 登录卡片 */
.login-card {
  width: 100%;
  max-width: 420px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  position: relative;
  z-index: 2;
}

/* 登录头部 */
.login-header {
  text-align: center;
  padding: 30px 0 20px;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.logo-icon {
  font-size: 28px;
  color: #4299e1;
  margin-right: 8px;
}

.logo-text {
  font-size: 24px;
  font-weight: 700;
  color: #1a365d;
}

.login-title {
  font-size: 22px;
  font-weight: 600;
  color: #1a365d;
  margin: 0 0 8px;
}

.login-desc {
  font-size: 14px;
  color: #718096;
  margin: 0;
}

/* 登录表单 */
.login-form {
  padding: 0 30px 30px;
}

.el-form-item {
  margin-bottom: 20px;
}

/* 验证码容器 */
.captcha-container {
  display: flex;
  gap: 10px;
}

.captcha-input {
  flex: 1;
}

.captcha-image {
  width: 130px;
  height: 40px;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.captcha-image:hover {
  border-color: #4299e1;
  background-color: #f1f5f9;
}

.captcha-text {
  font-size: 18px;
  letter-spacing: 4px;
  font-weight: 600;
  color: #1a365d;
}

.refresh-icon {
  font-size: 16px;
  color: #718096;
}

/* 表单操作区 */
.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.forgot-password {
  font-size: 13px;
}

/* 登录按钮 */
.login-btn {
  width: 100%;
  height: 44px;
  font-size: 16px;
  background-color: #4299e1;
  border-color: #4299e1;
}

.login-btn:hover {
  background-color: #3182ce;
  border-color: #3182ce;
}

/* 页脚 */
.login-footer {
  margin-top: 20px;
  position: relative;
  z-index: 2;
}

.login-footer p {
  font-size: 12px;
  color: #a0aec0;
  margin: 0;
}

/* 响应式调整 */
@media (max-width: 576px) {
  .login-card {
    width: 100%;
    max-width: none;
  }

  .captcha-image {
    width: 110px;
  }
}
</style>