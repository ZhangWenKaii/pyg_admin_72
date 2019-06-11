<template>
  <div class="roles_container">
    <!-- 自定义面包屑组件 -->
    <my-bread :list="['权限管理', '角色列表']"></my-bread>
    <el-card class="box-card">
      <el-button type="primary">添加角色</el-button>
      <el-table :data="rolesList" border style="width:100%">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- 权限数据  需要布局 -->
            <el-row
              style="border-bottom:1px solid #eee"
              :style="{ 'border-top': index === 0 ? '1px solid #eee' : 'none' }"
              :key="item.id"
              v-for="(item, index) in scope.row.children"
            >
              <el-col :span="4">
                <el-tag closable>{{ item.authName }} </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="20">
                <el-row
                  :key="subItem.id"
                  v-for="(subItem, subIndex) in item.children"
                  :style="{
                    'border-top': subIndex !== 0 ? '1px solid #eee' : 'none'
                  }"
                >
                  <el-col :span="6">
                    <el-tag closable type="success"
                      >{{ subItem.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      :key="lastItem.id"
                      v-for="lastItem in subItem.children"
                      closable
                      type="warning"
                      >{{ lastItem.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button-group>
              <el-button icon="el-icon-edit" type="primary"></el-button>
              <el-button icon="el-icon-delete" type="primary"></el-button>
              <el-button icon="el-icon-setting" type="primary"></el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import mixin from "./Roles-Mixin";
export default {
  mixins: [mixin]
};
</script>

<style scoped>
.el-row {
  padding: 10px 0;
  /* 垂直居中 */
  display: flex;
  align-items: center;
}
.el-tag {
  margin-right: 5px;
  margin-bottom: 5px;
}
</style>
