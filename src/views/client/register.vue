<template>
  <div class="client-register-container">
    <el-card class="register-card">
      <div class="brand-mark"><i class="el-icon-school" /></div>
      <h2 class="title">加入校园互助</h2>
      <p class="subtitle">创建账号，一起守护校园里的每一份善意</p>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="0">
        <el-form-item prop="username">
          <el-input v-model="form.username" prefix-icon="el-icon-user" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" type="password" show-password prefix-icon="el-icon-lock" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item prop="confirmPassword">
          <el-input v-model="form.confirmPassword" type="password" show-password prefix-icon="el-icon-lock" placeholder="请再次输入密码" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" class="full-width" @click="handleRegister">
            注册
          </el-button>
        </el-form-item>
      </el-form>
      <div class="switch-entry">
        <el-link type="primary" @click="$router.push('/user/login')">已有账号，去登录</el-link>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'ClientRegister',
  data() {
    const validateConfirm = (rule, value, callback) => {
      if (value !== this.form.password) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      form: {
        username: '',
        password: '',
        confirmPassword: ''
      },
      rules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        confirmPassword: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { validator: validateConfirm, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleRegister() {
      this.$refs.formRef.validate(async valid => {
        if (!valid) return
        this.loading = true
        try {
          await this.$store.dispatch('clientUser/register', {
            username: this.form.username,
            password: this.form.password
          })
          this.$message.success('注册成功，请登录')
          this.$router.push('/user/login')
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

.client-register-container {
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

  .register-card {
    width: 420px;
    border: 1px solid rgba(220, 229, 239, .95);
    border-radius: 18px;
    box-shadow: 0 22px 55px rgba(24, 50, 79, .14);
  }

  .register-card ::v-deep .el-card__body {
    padding: 34px 38px 28px;
  }

  .brand-mark {
    display: flex;
    width: 58px;
    height: 58px;
    margin: 0 auto 16px;
    align-items: center;
    justify-content: center;
    border-radius: 18px;
    color: #fff;
    background: linear-gradient(135deg, $client-color-primary, $client-color-accent);
    box-shadow: 0 10px 22px rgba(29, 79, 145, .24);
    font-size: 28px;
  }

  .title {
    text-align: center;
    margin: 0;
    color: $client-color-text-main;
    letter-spacing: 1px;
  }

  .subtitle {
    margin: 10px 0 24px;
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
    text-align: right;
    margin-top: 8px;
  }

  .switch-entry ::v-deep .el-link--primary {
    color: $client-color-primary;
  }
}

@media (max-width: 480px) {
  .client-register-container .register-card ::v-deep .el-card__body { padding: 28px 24px 22px; }
}
</style>
