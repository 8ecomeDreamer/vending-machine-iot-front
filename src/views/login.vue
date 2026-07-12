<template>
  <div class="auth-container">
    <!-- 背景装饰 -->
    <div class="background-decor">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
      <div class="shape shape-3"></div>
    </div>

    <div class="auth-wrapper">
      <!-- 切换标签 -->
      <div class="auth-tabs">
        <div
          class="tab-item"
          :class="{ active: activeTab === 'login' }"
          @click="activeTab = 'login'"
        >
          登录
        </div>
        <div
          class="tab-item"
          :class="{ active: activeTab === 'register' }"
          @click="activeTab = 'register'"
        >
          注册
        </div>
      </div>

      <!-- 登录表单 -->
      <div v-if="activeTab === 'login'" class="auth-form login-form">
        <div class="form-header">
          <div class="logo-container">
            <img src="/coderworld.png" alt="CoderWorld" class="logo-img">
            <div class="logo-text">
              <h2>智造供应链协同平台</h2>
              <p>欢迎回来，请登录您的账户</p>
            </div>
          </div>
        </div>

        <el-form ref="loginRef" :model="loginForm" :rules="loginRules" class="form-content">
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              size="large"
              placeholder="请输入用户名/邮箱"
              :prefix-icon="User"
              class="custom-input"
            />
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              size="large"
              type="password"
              placeholder="请输入密码"
              :prefix-icon="Lock"
              show-password
              class="custom-input"
              @keyup.enter="handleLogin"
            />
          </el-form-item>

          <div class="form-options">
            <el-checkbox v-model="loginForm.rememberMe">
              记住我
            </el-checkbox>
            <a href="#" class="forgot-link" @click.prevent="showForgotDialog = true">
              忘记密码？
            </a>
          </div>

          <el-button
            type="primary"
            size="large"
            :loading="loginLoading"
            @click="handleLogin"
            class="submit-btn"
          >
            {{ loginLoading ? '登录中...' : '立即登录' }}
          </el-button>

<!--          <div class="divider">-->
<!--            <span>或</span>-->
<!--          </div>-->

<!--          <div class="social-login">-->
<!--            <el-button class="social-btn wechat" @click="handleWechatLogin">-->
<!--              <i class="el-icon-chat-dot-round"></i>-->
<!--              微信登录-->
<!--            </el-button>-->
<!--            <el-button class="social-btn qq" @click="handleQQLogin">-->
<!--              <i class="el-icon-chat-line-round"></i>-->
<!--              QQ登录-->
<!--            </el-button>-->
<!--          </div>-->
        </el-form>
      </div>

<!--      &lt;!&ndash; 注册表单 &ndash;&gt;-->
<!--      <div v-else class="auth-form register-form">-->
<!--        <div class="form-header">-->
<!--          <div class="logo-container">-->
<!--            <img src="/coderworld.png" alt="CoderWorld" class="logo-img">-->
<!--            <div class="logo-text">-->
<!--              <h2>加入智造供应链平台</h2>-->
<!--              <p>创建您的账户，开启智能管理之旅</p>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->

<!--        <el-form ref="registerRef" :model="registerForm" :rules="registerRules" class="form-content">-->
<!--          <el-form-item prop="username">-->
<!--            <el-input-->
<!--              v-model="registerForm.username"-->
<!--              size="large"-->
<!--              placeholder="请输入用户名"-->
<!--              :prefix-icon="User"-->
<!--              class="custom-input"-->
<!--            />-->
<!--          </el-form-item>-->

<!--          <el-form-item prop="email">-->
<!--            <el-input-->
<!--              v-model="registerForm.email"-->
<!--              size="large"-->
<!--              placeholder="请输入邮箱"-->
<!--              :prefix-icon="Message"-->
<!--              class="custom-input"-->
<!--            />-->
<!--          </el-form-item>-->

<!--          <el-form-item prop="phone">-->
<!--            <el-input-->
<!--              v-model="registerForm.phone"-->
<!--              size="large"-->
<!--              placeholder="请输入手机号"-->
<!--              :prefix-icon="Iphone"-->
<!--              class="custom-input"-->
<!--            />-->
<!--          </el-form-item>-->

<!--          <el-form-item prop="password">-->
<!--            <el-input-->
<!--              v-model="registerForm.password"-->
<!--              size="large"-->
<!--              type="password"-->
<!--              placeholder="请输入密码"-->
<!--              :prefix-icon="Lock"-->
<!--              show-password-->
<!--              class="custom-input"-->
<!--            />-->
<!--          </el-form-item>-->

<!--          <el-form-item prop="confirmPassword">-->
<!--            <el-input-->
<!--              v-model="registerForm.confirmPassword"-->
<!--              size="large"-->
<!--              type="password"-->
<!--              placeholder="请确认密码"-->
<!--              :prefix-icon="Lock"-->
<!--              show-password-->
<!--              class="custom-input"-->
<!--            />-->
<!--          </el-form-item>-->

<!--&lt;!&ndash;          <el-form-item prop="inviteCode">&ndash;&gt;-->
<!--&lt;!&ndash;            <el-input&ndash;&gt;-->
<!--&lt;!&ndash;              v-model="registerForm.inviteCode"&ndash;&gt;-->
<!--&lt;!&ndash;              size="large"&ndash;&gt;-->
<!--&lt;!&ndash;              placeholder="邀请码（选填）"&ndash;&gt;-->
<!--&lt;!&ndash;              :prefix-icon="Key"&ndash;&gt;-->
<!--&lt;!&ndash;              class="custom-input"&ndash;&gt;-->
<!--&lt;!&ndash;            />&ndash;&gt;-->
<!--&lt;!&ndash;          </el-form-item>&ndash;&gt;-->

<!--&lt;!&ndash;          <div class="form-options">&ndash;&gt;-->
<!--&lt;!&ndash;            <el-checkbox v-model="registerForm.agreement">&ndash;&gt;-->
<!--&lt;!&ndash;              我已阅读并同意&ndash;&gt;-->
<!--&lt;!&ndash;              <a href="#" class="agreement-link" @click.prevent="showAgreement = true">&ndash;&gt;-->
<!--&lt;!&ndash;                《用户协议》&ndash;&gt;-->
<!--&lt;!&ndash;              </a>&ndash;&gt;-->
<!--&lt;!&ndash;              和&ndash;&gt;-->
<!--&lt;!&ndash;              <a href="#" class="agreement-link" @click.prevent="showPrivacy = true">&ndash;&gt;-->
<!--&lt;!&ndash;                《隐私政策》&ndash;&gt;-->
<!--&lt;!&ndash;              </a>&ndash;&gt;-->
<!--&lt;!&ndash;            </el-checkbox>&ndash;&gt;-->
<!--&lt;!&ndash;          </div>&ndash;&gt;-->

<!--          <el-button-->
<!--            type="primary"-->
<!--            size="large"-->
<!--            :loading="registerLoading"-->
<!--            @click="handleRegister"-->
<!--            class="submit-btn"-->
<!--          >-->
<!--            {{ registerLoading ? '注册中...' : '立即注册' }}-->
<!--          </el-button>-->
<!--        </el-form>-->
<!--      </div>-->

      <!-- 底部信息 -->
      <div class="auth-footer">
        <p>© 2026 智造供应链协同平台 · 技术支持：CoderWorld</p>
<!--        <p>如有问题，请联系客服：400-123-4567</p>-->
      </div>
    </div>

<!--    &lt;!&ndash; 忘记密码弹窗 &ndash;&gt;-->
<!--    <el-dialog v-model="showForgotDialog" title="找回密码" width="400px">-->
<!--      <el-form :model="forgotForm" label-width="80px">-->
<!--        <el-form-item label="邮箱">-->
<!--          <el-input v-model="forgotForm.email" placeholder="请输入注册邮箱" />-->
<!--        </el-form-item>-->
<!--      </el-form>-->
<!--      <template #footer>-->
<!--        <el-button @click="showForgotDialog = false">取消</el-button>-->
<!--        <el-button type="primary" @click="handleForgotPassword">发送重置邮件</el-button>-->
<!--      </template>-->
<!--    </el-dialog>-->
  </div>
</template>

<script setup>
// todo: 择情况完善注册功能
import { ref, reactive, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { encrypt, decrypt } from "@/utils/jsencrypt";
import {
  User,
  Lock,
  Message,
  Iphone,
  Key,
  ChatDotRound,
  ChatLineRound
} from '@element-plus/icons-vue'
import Cookies from "js-cookie";
import useUserStore from '@/store/modules/user'

const userStore = useUserStore()

const route = useRoute();
const router = useRouter()

const { proxy } = getCurrentInstance();

// 当前激活的标签
const activeTab = ref('login')

// 登录相关
const loginRef = ref()
const loginLoading = ref(false)
const loginForm = reactive({
  username: "admin",
  password: "admin123",
  rememberMe: true
})

const loginRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ]
}

// 注册相关
const registerRef = ref()
const registerLoading = ref(false)
const registerForm = reactive({
  username: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  inviteCode: '',
  agreement: false
})

// 注册开关
const register = ref(false);
const redirect = ref(undefined);

watch(route, (newRoute) => {
  redirect.value = newRoute.query && newRoute.query.redirect;
}, { immediate: true });

const validatePassword = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请确认密码'))
  } else if (value !== registerForm.password) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

const registerRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在3到20个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在6到20个字符', trigger: 'blur' },
    { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, message: '密码需包含大小写字母和数字', trigger: 'blur' }
  ],
  confirmPassword: [
    { validator: validatePassword, trigger: 'blur' }
  ],
  agreement: [
    {
      validator: (rule, value, callback) => {
        if (!value) {
          callback(new Error('请同意用户协议'))
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ]
}

// 忘记密码相关
const showForgotDialog = ref(false)
const forgotForm = reactive({
  email: ''
})

// 协议相关
const showAgreement = ref(false)
const showPrivacy = ref(false)

// 方法
const handleLogin = async () => {
  if (!loginRef.value) return

  loginRef.value.validate(valid => {
    if (valid) {
      loginLoading.value = true

      // 处理记住密码
      if (loginForm.rememberMe) {
        Cookies.set('username', loginForm.username, { expires: 30 })
        Cookies.set('password', encrypt(loginForm.password), { expires: 30 })
        Cookies.set('rememberMe', loginForm.rememberMe, { expires: 30 })
      } else {
        Cookies.remove('username')
        Cookies.remove('password')
        Cookies.remove('rememberMe')
      }

      // 调用store的登录方法
      userStore.login(loginForm)
          .then(() => {
            // 登录成功后的处理
            const query = route.query
            const otherQueryParams = Object.keys(query).reduce((acc, cur) => {
              if (cur !== 'redirect') {
                acc[cur] = query[cur]
              }
              return acc
            }, {})

            // 跳转到重定向页面或首页
            router.push({
              path: redirect.value || '/',
              query: otherQueryParams
            })
          })
          .catch((error) => {
            console.error('登录失败:', error)
            loginLoading.value = false

            // // 重新获取验证码
            // if (captchaEnabled.value) {
            //   getCode()
            // }

            // 显示错误信息
            ElMessage.error(error.message || '登录失败，请检查用户名和密码')
          })
    } else {
      console.log('表单验证失败')
      return false
    }
  })
}

const handleRegister = async () => {
  if (!registerRef.value) return

  try {
    await registerRef.value.validate()
    registerLoading.value = true

    // 模拟注册API调用
    await new Promise(resolve => setTimeout(resolve, 1500))

    ElMessage.success('注册成功，请登录邮箱验证')
    activeTab.value = 'login'

    // 清空注册表单
    Object.keys(registerForm).forEach(key => {
      registerForm[key] = ''
    })
  } catch (error) {
    console.log('注册验证失败')
  } finally {
    registerLoading.value = false
  }
}

const handleForgotPassword = async () => {
  if (!forgotForm.email) {
    ElMessage.warning('请输入邮箱地址')
    return
  }

  // 模拟发送重置邮件
  await new Promise(resolve => setTimeout(resolve, 1000))
  showForgotDialog.value = false
  ElMessage.success('重置邮件已发送，请查收')
}

const handleWechatLogin = () => {
  ElMessage.info('微信登录功能开发中')
}

const handleQQLogin = () => {
  ElMessage.info('QQ登录功能开发中')
}
</script>

<style lang="scss" scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  position: relative;
  overflow: hidden;
}

.background-decor {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 0;

  .shape {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
  }

  .shape-1 {
    width: 300px;
    height: 300px;
    top: -150px;
    right: -150px;
  }

  .shape-2 {
    width: 200px;
    height: 200px;
    bottom: -100px;
    left: -100px;
  }

  .shape-3 {
    width: 150px;
    height: 150px;
    top: 50%;
    right: 20%;
  }
}

.auth-wrapper {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 480px;
  background: white;
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  margin: 20px;
}

.auth-tabs {
  display: flex;
  margin-bottom: 30px;
  border-bottom: 2px solid #f0f0f0;

  .tab-item {
    flex: 1;
    text-align: center;
    padding: 15px 0;
    font-size: 18px;
    font-weight: 500;
    color: #666;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;

    &:hover {
      color: #667eea;
    }

    &.active {
      color: #667eea;
      font-weight: 600;

      &::after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 50%;
        transform: translateX(-50%);
        width: 60px;
        height: 3px;
        background: linear-gradient(90deg, #667eea, #764ba2);
        border-radius: 2px;
      }
    }
  }
}

.auth-form {
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.form-header {
  margin-bottom: 30px;

  .logo-container {
    display: flex;
    align-items: center;
    gap: 15px;

    .logo-img {
      width: 60px;
      height: 60px;
      object-fit: contain;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
    }

    .logo-text {
      h2 {
        font-size: 20px;
        font-weight: 600;
        color: #333;
        margin: 0 0 5px 0;
      }

      p {
        font-size: 14px;
        color: #666;
        margin: 0;
      }
    }
  }
}

.form-content {
  .el-form-item {
    margin-bottom: 24px;
  }
}

.custom-input {
  :deep(.el-input__wrapper) {
    border-radius: 12px;
    padding: 0 20px;
    height: 52px;
    border: 2px solid #e0e0e0;
    transition: all 0.3s ease;
    box-shadow: none;

    &:hover {
      border-color: #c0c0c0;
    }

    &.is-focus {
      border-color: #667eea;
      box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
    }
  }

  :deep(.el-input__inner) {
    height: 50px;
    font-size: 15px;
  }

  :deep(.el-input__prefix) {
    margin-right: 10px;
    color: #999;
  }
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;

  .forgot-link {
    color: #667eea;
    text-decoration: none;
    font-size: 14px;
    transition: color 0.3s ease;

    &:hover {
      color: #764ba2;
      text-decoration: underline;
    }
  }

  .agreement-link {
    color: #667eea;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}

.submit-btn {
  width: 100%;
  height: 52px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border: none;
  transition: all 0.3s ease;
  margin-bottom: 20px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
}

.divider {
  display: flex;
  align-items: center;
  margin: 25px 0;
  color: #999;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #e0e0e0;
  }

  span {
    padding: 0 15px;
    font-size: 14px;
  }
}

.social-login {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;

  .social-btn {
    flex: 1;
    height: 46px;
    border-radius: 12px;
    font-size: 14px;
    border: 2px solid #e0e0e0;
    background: white;

    i {
      margin-right: 8px;
    }

    &.wechat {
      color: #07C160;
      border-color: #07C160;

      &:hover {
        background: rgba(7, 193, 96, 0.05);
      }
    }

    &.qq {
      color: #12B7F5;
      border-color: #12B7F5;

      &:hover {
        background: rgba(18, 183, 245, 0.05);
      }
    }
  }
}

.auth-footer {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
  text-align: center;

  p {
    margin: 5px 0;
    font-size: 12px;
    color: #999;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .auth-wrapper {
    margin: 10px;
    padding: 30px 20px;
  }

  .logo-container {
    flex-direction: column;
    text-align: center;

    .logo-text {
      text-align: center;
    }
  }

  .social-login {
    flex-direction: column;
  }
}
</style>
