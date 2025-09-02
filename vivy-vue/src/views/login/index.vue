<script setup lang="ts">
import { debounce } from '@pureadmin/utils'
import { useEventListener } from '@vueuse/core'
import type { FormInstance } from 'element-plus'
import { ref, reactive, toRaw } from 'vue'
import { useRequest } from 'vue-request'
import { useRouter } from 'vue-router'
import { captcha } from '@/api/auth/login'
import darkIcon from '@/assets/svg/dark.svg?component'
import dayIcon from '@/assets/svg/day.svg?component'
import { useRenderIcon } from '@/components/ReIcon/src/hooks'
import { useDataThemeChange } from '@/layout/hooks/useDataThemeChange'

import { useLayout } from '@/layout/hooks/useLayout'
import { useNav } from '@/layout/hooks/useNav'
import { initRouter, getTopMenu } from '@/router/utils'
import { useUserStoreHook } from '@/store/modules/user'
import { message } from '@/utils/message'
import Motion from './utils/motion'
import { loginRules } from './utils/rule'
import { bg, avatar, illustration } from './utils/static'
import Code from '~icons/ri/key-2-fill'
import Lock from '~icons/ri/lock-fill'
import User from '~icons/ri/user-3-fill'

defineOptions({
  name: 'Login',
})

const router = useRouter()
const loading = ref(false)
const disabled = ref(false)
const ruleFormRef = ref<FormInstance>()

const { initStorage } = useLayout()
initStorage()

const { dataTheme, overallStyle, dataThemeChange } = useDataThemeChange()
dataThemeChange(overallStyle.value)
const { title } = useNav()

const ruleForm = reactive({
  code: '',
  username: 'admin',
  password: 'Aa@123456',
})

const { data: captchaImage, run: runCaptchaImage } = useRequest(captcha)

const onLogin = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      loading.value = true
      useUserStoreHook()
        .login({
          username: ruleForm.username,
          password: ruleForm.password,
          code: ruleForm.code,
          uuid: captchaImage.value?.uuid,
        })
        .then(async () => {
          return initRouter().then(() => {
            disabled.value = true
            router
              .push(getTopMenu(true).path)
              .then(() => {
                message('登录成功', { type: 'success' })
              })
              .finally(() => (disabled.value = false))
          })
        })
        .catch((error) => {
          message(error.message || '登录失败，请重试！', { type: 'error' })
        })
        .finally(() => (loading.value = false))
    }
  })
}

const immediateDebounce: any = debounce((formRef) => onLogin(formRef), 1000, true)

useEventListener(document, 'keydown', ({ code }) => {
  if (['Enter', 'NumpadEnter'].includes(code) && !disabled.value && !loading.value) immediateDebounce(ruleFormRef.value)
})
</script>

<template>
  <div class="select-none">
    <img :src="bg" class="wave" />
    <div class="flex-c absolute right-5 top-3">
      <!-- 主题 -->
      <el-switch
        v-model="dataTheme"
        inline-prompt
        :active-icon="dayIcon"
        :inactive-icon="darkIcon"
        @change="dataThemeChange"
      />
    </div>
    <div class="login-container">
      <div class="img">
        <component :is="toRaw(illustration)" />
      </div>
      <div class="login-box">
        <div class="login-form">
          <img :src="avatar" class="avatar" />
          <Motion>
            <h2 class="outline-hidden">{{ title }}</h2>
          </Motion>

          <el-form ref="ruleFormRef" :model="ruleForm" :rules="loginRules" size="large">
            <Motion :delay="100">
              <el-form-item
                :rules="[
                  {
                    required: true,
                    message: '请输入账号',
                    trigger: 'blur',
                  },
                ]"
                prop="username"
              >
                <el-input v-model="ruleForm.username" clearable placeholder="账号" :prefix-icon="useRenderIcon(User)" />
              </el-form-item>
            </Motion>

            <Motion :delay="150">
              <el-form-item prop="password">
                <el-input
                  v-model="ruleForm.password"
                  clearable
                  show-password
                  placeholder="密码"
                  :prefix-icon="useRenderIcon(Lock)"
                />
              </el-form-item>
            </Motion>

            <Motion v-if="captchaImage" :delay="150">
              <el-space :size="20">
                <el-form-item
                  :rules="[
                    {
                      required: true,
                      message: '请输入验证码',
                      trigger: 'blur',
                    },
                  ]"
                  prop="code"
                >
                  <el-input v-model="ruleForm.code" clearable placeholder="验证码" :prefix-icon="useRenderIcon(Code)" />
                </el-form-item>
                <div class="flex cursor-pointer mb-[24px]" @click="runCaptchaImage" v-html="captchaImage.img" />
              </el-space>
            </Motion>

            <Motion :delay="250">
              <el-button
                class="w-full mt-4!"
                size="default"
                type="primary"
                :loading="loading"
                :disabled="disabled"
                @click="onLogin(ruleFormRef)"
              >
                登录
              </el-button>
            </Motion>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('@/style/login.css');
</style>

<style lang="scss" scoped>
:deep(.el-input-group__append, .el-input-group__prepend) {
  padding: 0;
}
</style>
