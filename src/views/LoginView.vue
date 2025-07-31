
<template>
  <div class="login-container">
    <el-card class="login-box">
      <h2 class="login-title">客户关系管理系统</h2>
      <el-form :model="formData" ref="ruleFormRef">
        <el-form-item>
          <el-input
            v-model="formData.suName"
            placeholder="请输入账号"
            prefix-icon="User"
          />
        </el-form-item>

        <el-form-item>
          <el-input
            v-model="formData.suPwd"
            type="password"
            placeholder="请输入密码"
            prefix-icon="Lock"
            show-password
          />
        </el-form-item>

        <el-form-item>
          <div class="captcha-container">
            <el-input
              v-model="formData.captcha"
              placeholder="请输入验证码"
              class="captcha-input"
            />
            <div class="captcha-image" @click="refreshCaptcha">
              <!-- 验证码占位图 -->
              <span>{{formData}}</span>
            </div>
          </div>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" class="login-btn" @click="login">
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive ,onMounted,ref } from "vue";
import { ElMessage } from "element-plus";
import axios from "axios";
import {useRouter} from 'vue-router';

const captchaText = ref(''); 
// 创建路由器对象
const router = useRouter()



const formData = reactive({
  suName: "",
  suPwd: "",
  captcha: "",
  code: "",
});

// 登录方法
const login = () => {
  // ElMessage('登录成功')
  axios({
    method: "get",
    url: "http://localhost:8080/sysUser/login",
    params: formData
  }).then((res) => {
    if(res.data.code == 0){
        localStorage.setItem('suName', res.data.data[0].suName)
        localStorage.setItem('suId', res.data.data[0].suId)
        localStorage.setItem('suRole', res.data.data[0].suRole)
        // 跳转到首页
        router.push('/')
    }else{
        ElMessage('登录失败')
    }
  });
};

const refreshCaptcha = () => {
  // 生成4位随机验证码
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  captchaText.value = result;
};

onMounted(() => {
  // 初始化验证码
  refreshCaptcha();
});

</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-box {
  width: 400px;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.login-title {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.captcha-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.captcha-input {
  flex: 1;
}

.captcha-image {
  width: 120px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  color: #409eff;
  font-weight: bold;
  font-size: 20px;
  user-select: none;
}

.login-btn {
  width: 100%;
}
</style>
