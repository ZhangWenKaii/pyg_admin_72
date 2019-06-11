<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>{{ list[0] }}</el-breadcrumb-item>
    <el-breadcrumb-item>{{ list[1] }}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  props: ["list"]
};
</script>

<style scoped></style>
