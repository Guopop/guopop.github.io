---
title: 输入访问密码
layout: page
publish: false
---

<script setup>
import { passwordConfig, defaultPassword } from '/.vitepress/theme/index.ts';
</script>

<Password :passwordConfig="passwordConfig" :defaultPassword="defaultPassword" />
