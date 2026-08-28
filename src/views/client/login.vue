<template>
  <div class="client-login-container">
    <el-card class="login-card">
      <img class="brand-logo" :src="clientLogo" alt="校园失物招领">
      <h2 class="title">校园失物招领</h2>
      <p class="subtitle">登录后发布信息，让遗失物品更快回家</p>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="0">
        <el-form-item prop="username">
          <el-input v-model="form.username" prefix-icon="el-icon-user" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" type="password" show-password prefix-icon="el-icon-lock" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" class="full-width" @click="handleLogin">
            登录用户端
          </el-button>
        </el-form-item>
      </el-form>
      <div class="switch-entry">
        <el-link type="primary" @click="$router.push('/user/register')">没有账号，去注册</el-link>
        <el-link type="primary" @click="$router.push('/login')">切换到后台登录</el-link>
      </div>
    </el-card>
  </div>
</template>

<script>
import clientLogo from '@/assets/logo.png'
export default {
  name: 'ClientLogin',
  data() {
    return {
      clientLogo,
      loading: false,
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  },
  methods: {
    handleLogin() {
      this.$refs.formRef.validate(async valid => {
        if (!valid) return
        this.loading = true
        try {
          await this.$store.dispatch('clientUser/login', this.form)
          const redirect = this.$route.query.redirect || '/user/home'
          this.$router.push(redirect)
        } finally {
          this.loading = false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../layout/client/client-theme.scss";

.client-login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 28px 16px;
  box-sizing: border-box;
  background:
    radial-gradient(circle at 15% 20%, rgba(47, 125, 101, .16), transparent 27%),
    radial-gradient(circle at 86% 78%, rgba(29, 79, 145, .16), transparent 30%),
    linear-gradient(145deg, #eef5fa 0%, #f7faf8 55%, #edf4f9 100%);

  .login-card {
    width: 420px;
    border: 1px solid rgba(220, 229, 239, .95);
    border-radius: 18px;
    box-shadow: 0 22px 55px rgba(24, 50, 79, .14);
  }

  .login-card ::v-deep .el-card__body {
    padding: 36px 38px 30px;
  }

  .brand-logo {
    display: block;
    width: 176px;
    height: 136px;
    margin: -18px auto 4px;
    object-fit: contain;
    mix-blend-mode: multiply;
  }

  .title {
    text-align: center;
    margin: 0;
    color: $client-color-text-main;
    letter-spacing: 1px;
  }

  .subtitle {
    margin: 10px 0 26px;
    color: $client-color-text-secondary;
    text-align: center;
    font-size: 13px;
  }

  ::v-deep .el-input__inner {
    height: 44px;
    border-radius: 10px;
    border-color: $client-color-border;
  }

  ::v-deep .el-input__inner:focus {
    border-color: $client-color-primary-light;
    box-shadow: 0 0 0 3px rgba(29, 79, 145, .1);
  }

  .full-width {
    width: 100%;
    height: 44px;
    border: 0;
    border-radius: 10px;
    background: linear-gradient(135deg, $client-color-primary, $client-color-accent);
    box-shadow: 0 8px 18px rgba(29, 79, 145, .2);
  }

  .switch-entry {
    display: flex;
    justify-content: space-between;
    margin-top: 8px;
  }

  .switch-entry ::v-deep .el-link--primary {
    color: $client-color-primary;
  }
}

@media (max-width: 480px) {
  .client-login-container .login-card ::v-deep .el-card__body { padding: 30px 24px 24px; }
}
</style>
