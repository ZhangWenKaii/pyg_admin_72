<template>
  <div class="roles_container">
    <!-- 自定义面包屑组件 -->
    <my-bread :list="['权限管理', '角色列表']"></my-bread>
    <el-card class="box-card">
      <el-button type="primary" @click="openAddDialog()">添加角色</el-button>
      <el-table :data="rolesList" border style="width:100%">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- 权限数据  需要布局 -->
            <div v-if="!scope.row.children.length" style="color:#ccc">
              该角色未分配任何权限
            </div>
            <div v-if="scope.row.children.length">
              <el-row
                style="border-bottom:1px solid #eee"
                :style="{
                  'border-top': index === 0 ? '1px solid #eee' : 'none'
                }"
                :key="item.id"
                v-for="(item, index) in scope.row.children"
              >
                <el-col :span="4">
                  <el-tag closable @close="delRights(scope.row, item.id)"
                    >{{ item.authName }}
                  </el-tag>
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
                      <el-tag
                        closable
                        type="success"
                        @close="delRights(scope.row, subItem.id)"
                        >{{ subItem.authName }}
                      </el-tag>
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <el-col :span="18">
                      <el-tag
                        :key="lastItem.id"
                        v-for="lastItem in subItem.children"
                        closable
                        @close="delRights(scope.row, lastItem.id)"
                        type="warning"
                        >{{ lastItem.authName }}
                      </el-tag>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </div>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button-group>
              <el-button
                @click="openEditDialog(scope.row)"
                icon="el-icon-edit"
                type="primary"
              ></el-button>
              <el-button
                icon="el-icon-delete"
                @click="delRole(scope.row.id)"
                type="primary"
              ></el-button>
              <el-button
                @click="openRightsDialog(scope.row)"
                icon="el-icon-setting"
                type="primary"
              ></el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="addDialogFormVisible">
      <el-form
        :rules="rules"
        :model="addForm"
        label-width="80px"
        autocomplete="off"
        ref="addForm"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑角色对话框 -->
    <el-dialog title="编辑角色" :visible.sync="editDialogFormVisible">
      <el-form
        :rules="rules"
        :model="editForm"
        label-width="80px"
        autocomplete="off"
        ref="editForm"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配权限对话框 -->
    <el-dialog title="分配权限" :visible.sync="rightDialogFormVisible">
      <el-tree
        :data="rightsTreeData"
        show-checkbox
        node-key="id"
        :default-expand-all="true"
        :default-checked-keys="checkedIdArr"
        :props="defaultProps"
      >
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="rightDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="disRights()">确 定</el-button>
      </div>
    </el-dialog>
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
