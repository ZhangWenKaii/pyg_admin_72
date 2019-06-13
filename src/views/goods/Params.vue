<template>
  <div class="params_container">
    <my-bread :list="['商品管理', '分类参数']"></my-bread>
    <el-card class="box-card">
      <el-alert
        title="注意：只有第三级分类才能设置参数。"
        type="warning"
        show-icon
      >
      </el-alert>
      <!-- label 级联 -->
      <el-form label-width="120px">
        <el-form-item label="商品分类：">
          <el-cascader
            v-model="selectedCateArr"
            clearable
            :options="cascaderOptions"
            :props="cascaderProps"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <!-- tab切换组件  标签页组件 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">用户管理</el-tab-pane>
        <el-tab-pane label="静态参数" name="only">配置管理</el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import mixin from "./Params-Mixin";
export default {
  mixins: [mixin]
};
</script>

<style scoped>
.el-form {
  margin-top: 20px;
}
</style>
