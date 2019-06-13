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
          <el-input style="width:200px"></el-input>
        </el-form-item>
      </el-form>
      <!-- tab切换组件  标签页组件 -->
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
