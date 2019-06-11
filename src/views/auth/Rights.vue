<template>
  <div>
    <!-- 面包屑（路径导航） -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-table :data="rightsList" height="400" border style="width: 100%">
        <!-- 序号列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="权限名称" prop=""></el-table-column>
        <el-table-column label="路径" prop=""></el-table-column>
        <el-table-column label="权限等级" prop=""></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import mixin from "./Rights-Mixin";
export default {
  mixins: [mixin]
};
</script>

<style scoped></style>
