<template>
  <el-config-provider :locale="currentLocale">
    <router-view />
    <ReDialog />
  </el-config-provider>
</template>

<script lang="ts">
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { defineComponent } from 'vue'
import { ReDialog } from '@/components/ReDialog'

export default defineComponent({
  name: 'App',
  components: {
    [ElConfigProvider.name]: ElConfigProvider,
    ReDialog,
  },
  computed: {
    currentLocale() {
      return zhCn
    },
  },
})
</script>
