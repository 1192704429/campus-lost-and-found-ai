<template>
  <div class="login-page">
    <div class="page-bg" />

    <div class="login-center">
      <div class="hero-content">
        <h1 class="hero-title">欢迎使用校园失物招领系统</h1>
        <p class="hero-desc">失物招领与物品管理平台</p>
      </div>

      <div class="login-card">
        <div class="card-header">
          <h2>系统登录</h2>
          <p>请输入您的账号信息以继续</p>
        </div>

        <el-form
          ref="loginForm"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
          @keyup.enter.native="handleLogin"
        >
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              prefix-icon="el-icon-user"
              placeholder="用户名"
              size="medium"
            />
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              prefix-icon="el-icon-lock"
              type="password"
              placeholder="密码"
              show-password
              size="medium"
            />
          </el-form-item>

          <el-form-item prop="captcha">
            <div class="captcha-row">
              <el-input
                v-model="loginForm.captcha"
                prefix-icon="el-icon-picture-outline"
                placeholder="验证码"
                size="medium"
                class="captcha-input"
              />
              <div class="captcha-box" @click="refreshCaptcha">
                <img v-if="captchaImageUrl" :src="captchaImageUrl" alt="验证码">
                <span v-else class="captcha-tip">点击获取</span>
              </div>
            </div>
          </el-form-item>

          <div class="form-extra">
            <el-checkbox v-model="rememberMe">记住密码</el-checkbox>
            <a href="javascript:void(0)" class="link-muted">忘记密码？</a>
          </div>

          <el-button
            type="primary"
            class="submit-btn"
            :loading="loading"
            @click="handleLogin"
          >
            立即登录
          </el-button>
        </el-form>

        <div class="card-footer">
          <span>还没有账号？</span>
          <a href="javascript:void(0)">联系管理员开通</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getCaptcha } from '@/api/user'

export default {
  name: 'Login6',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value) callback(new Error('请输入用户名'))
      else callback()
    }
    const validatePassword = (rule, value, callback) => {
      if (!value) callback(new Error('请输入密码'))
      else if (value.length < 6) callback(new Error('密码长度不能少于6位'))
      else callback()
    }
    const validateCaptcha = (rule, value, callback) => {
      if (!value) callback(new Error('请输入验证码'))
      else callback()
    }
    return {
      loginForm: {
        username: '',
        password: '',
        captcha: '',
        captchaKey: ''
      },
      loginRules: {
        username: [{ validator: validateUsername, trigger: 'blur' }],
        password: [{ validator: validatePassword, trigger: 'blur' }],
        captcha: [{ validator: validateCaptcha, trigger: 'blur' }]
      },
      rememberMe: false,
      loading: false,
      captchaImageUrl: ''
    }
  },
  mounted() {
    this.refreshCaptcha()
  },
  beforeDestroy() {
    if (this.captchaImageUrl) {
      window.URL.revokeObjectURL(this.captchaImageUrl)
    }
  },
  methods: {
    refreshCaptcha() {
      const cacheKey = Date.now().toString()
      this.loginForm.captchaKey = cacheKey
      if (this.captchaImageUrl) {
        window.URL.revokeObjectURL(this.captchaImageUrl)
      }
      getCaptcha(cacheKey).then(blob => {
        this.captchaImageUrl = window.URL.createObjectURL(blob)
      }).catch(error => {
        console.error('获取验证码失败:', error)
        this.$message.error('获取验证码失败，请重试')
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (!valid) return false
        this.loading = true
        this.$store.dispatch('user/login', this.loginForm).then(() => {
          this.$router.push('/index')
        }).catch(() => {
          this.refreshCaptcha()
          this.loginForm.captcha = ''
        }).finally(() => {
          this.loading = false
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: #fffbf7;
  position: relative;
  overflow: hidden;
}

.page-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(125deg, #ffedd5 0%, #fed7aa 45%, #fde68a 100%);
  clip-path: ellipse(120% 55% at 50% 0%);

  &::before {
    content: '';
    position: absolute;
    width: 300px;
    height: 300px;
    top: -80px;
    left: -60px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.45);
  }

  &::after {
    content: '';
    position: absolute;
    width: 200px;
    height: 200px;
    top: 40px;
    right: 10%;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.35);
  }
}

.login-center {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 460px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hero-content {
  text-align: center;
  margin-bottom: 28px;
  color: #9a3412;

  .hero-title {
    margin: 0 0 8px;
    font-size: 32px;
    font-weight: 700;
    letter-spacing: 1px;
    color: #9a3412;
  }

  .hero-desc {
    margin: 0;
    font-size: 14px;
    color: #b45309;
    opacity: 0.9;
  }
}

.login-card {
  width: 100%;
  padding: 36px 32px 28px;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 12px 36px rgba(251, 146, 60, 0.1);
  border: 1px solid #ffedd5;
}

.card-header {
  text-align: center;
  margin-bottom: 28px;

  h2 {
    margin: 0 0 8px;
    font-size: 22px;
    font-weight: 600;
    color: #9a3412;
  }

  p {
    margin: 0;
    font-size: 13px;
    color: #b45309;
    opacity: 0.75;
  }
}

.login-form {
  ::v-deep .el-form-item {
    margin-bottom: 20px;
  }

  ::v-deep .el-input__inner {
    height: 44px;
    line-height: 44px;
    border-radius: 10px;
    border-color: #fde68a;
    background: #fffef9;

    &:focus {
      border-color: #fdba74;
      box-shadow: 0 0 0 3px rgba(253, 186, 116, 0.25);
    }
  }

  ::v-deep .el-input__prefix {
    color: #fdba74;
  }

  ::v-deep .el-checkbox__label {
    color: #b45309;
    font-size: 13px;
  }
}

.captcha-row {
  display: flex;
  gap: 12px;
}

.captcha-input {
  flex: 1;
}

.captcha-box {
  width: 112px;
  height: 44px;
  flex-shrink: 0;
  border: 1px solid #fde68a;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  background: #fffef9;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .captcha-tip {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color: #fdba74;
  }

  &:hover {
    border-color: #fdba74;
  }
}

.form-extra {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;

  .link-muted {
    font-size: 13px;
    color: #b45309;
    text-decoration: none;

    &:hover {
      color: #d97706;
    }
  }
}

.submit-btn {
  width: 100%;
  height: 46px;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  letter-spacing: 1px;
  background: linear-gradient(90deg, #fde68a 0%, #fdba74 100%);
  box-shadow: 0 6px 16px rgba(253, 186, 116, 0.3);
  color: #9a3412;

  &:hover,
  &:focus {
    background: linear-gradient(90deg, #fdba74 0%, #fb923c 100%);
    color: #fff;
  }
}

.card-footer {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px dashed #fde68a;
  text-align: center;
  font-size: 13px;
  color: #b45309;

  a {
    color: #d97706;
    text-decoration: none;
    margin-left: 4px;
    font-weight: 500;

    &:hover {
      color: #b45309;
    }
  }
}
</style>
