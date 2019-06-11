<template>
  <div class="users_container">
    <!-- 面包屑（路径导航） -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <!-- 卡片 栅格系统-->
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input v-model="reqParams.query" placeholder="请输入内容">
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="search()"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="18">
          <el-button type="primary" @click="openAddDialog()"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 卡片 表格-->
      <el-table :data="usersList" border style="width: 100%">
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="toggleState(scope.row)"
              active-color="#13ce66"
              inactive-color="#ff4949"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <el-button-group>
              <el-button type="primary" icon="el-icon-edit"></el-button>
              <el-button
                type="primary"
                icon="el-icon-delete"
                @click="delUser(scope.row.id)"
              ></el-button>
              <el-button
                type="primary"
                icon="el-icon-setting"
                @click="openChangeRole(scope.row)"
              ></el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
      <!-- 卡片 分页-->
      <el-pagination
        background
        layout="prev, pager, next"
        :current-page="reqParams.pagenum"
        :page-count="total"
        @current-change="pager"
      >
      </el-pagination>
    </el-card>
    <el-dialog title="添加用户" :visible.sync="addDialogFormVisible">
      <el-form
        :model="addForm"
        autocomplete="off"
        :rules="addRules"
        label-width="80px"
        ref="addForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="分配角色" :visible.sync="roleDialogFormVisible">
      <el-form autocomplete="off" label-width="100px">
        <el-form-item label="当前用户："> {{ roleUserName }} </el-form-item>
        <el-form-item label="当前角色："> {{ roleName }} </el-form-item>
        <el-form-item label="分配角色：">
          <el-select v-model="roleSelected" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="changeRole()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    this.getData();
  },
  data() {
    // 自定义校验规则函数
    const checkMobile = (rule, value, callback) => {
      // rule 规则对象  value 当前表单元素的值  callback 校验完毕后的回调函数
      // 成功 callback()  失败 callback(new Errror('错误信息'))  将来会显示在你的元素下
      // 定义自己的校验规则
      // 校验组件去调用这个函数  定义的规则符合校验组件的要求
      if (!/^1[356789]\d{9}$/.test(value)) {
        return callback(new Error("手机号格式不正确"));
      }
      callback();
    };
    return {
      // 获取用户列表的参数
      reqParams: {
        query: "",
        pagenum: 1,
        pagesize: 2
      },
      // 用户列表数据
      usersList: [],
      // 分页相关数据
      total: 0,
      // 添加用户对话框相关数据
      addDialogFormVisible: false,
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      addRules: {
        username: [{ required: true, trigger: "blur", message: "用户名必填" }],
        password: [
          { required: true, trigger: "blur", message: "密码必填" },
          { min: 6, max: 18, message: "长度在 6 到 18 个字符", trigger: "blur" }
        ],
        email: [
          { required: true, trigger: "blur", message: "邮箱必填" },
          { type: "email", trigger: "blur", message: "邮箱格式不正确" }
        ],
        mobile: [
          { required: true, trigger: "blur", message: "手机号必填" },
          // 没有符合国情的校验规则  使用自定义校验规则
          // { validator: 检验函数名称, trigger: 'blur' }
          // 校验函数写在哪里？ 在 return 之前定义  因为addRules需要使用
          { validator: checkMobile, trigger: "blur" }
        ]
      },
      // 分配角色相关数据
      roleDialogFormVisible: false,
      roleUserName: "",
      roleUserId: null,
      roleName: "",
      roleList: [],
      roleSelected: ""
    };
  },
  methods: {
    async getData() {
      // 获取表格依赖的数据  用户列表数据
      // 后台返回的数据 res = {data:{data:'数据',meta:{status:200,msg:'提示'}}
      const {
        data: { data, meta }
      } = await this.$http.get("users", { params: this.reqParams });
      // 错误判断
      if (meta.status !== 200) return this.$message.error(meta.msg);
      // 修改data中的表格数据  驱动视图改变
      this.usersList = data.users;
      // data.total 是总条数
      this.total = Math.ceil(data.total / this.reqParams.pagesize);
    },
    search() {
      // 每次搜索显示第一页
      this.reqParams.pagenum = 1;
      // 获取输入框的内容  需要携带
      // 使用v-model绑定 reqParmas.query数据  当输入的内容修改的时候reqParmas.query也修改
      this.getData();
    },
    pager(newPagenum) {
      // 更新请求的参数 reqParams.pagenum 为 newPagenum
      this.reqParams.pagenum = newPagenum;
      // 获取数据
      this.getData();
    },
    addUser() {
      // 添加用户
      // 调用  表单组件的函数  函数是挂载在dom元素上的
      this.$refs.addForm.validate(async valid => {
        if (valid) {
          // 进行数据的提交了
          const {
            data: { meta }
          } = await this.$http.post("users", this.addForm);
          // 失败
          if (meta.status !== 201) return this.$message.error(meta.msg);
          // 成功
          this.addDialogFormVisible = false;
          // 最好跳转到第一页
          this.reqParams.pagenum = 1;
          this.getData();
        }
      });
    },
    openAddDialog() {
      // 显示对话框
      this.addDialogFormVisible = true;
      // 重置添加表单
      // "TypeError: Cannot read property 'resetFields' of undefined"
      // addForm 是 undefined 引起的
      // 当 this.addDialogFormVisible = true; 对话框和表单并没有渲染在页面上
      // 需要渲染的时间，此时获取dom元素，不能获取dom,因为还没有渲染dom
      // 解决方案：等dom渲染完毕在去获取dom调用函数
      // 1. 使用原始的方式  setTimeout(fn,0) 等当前函数作用域下所有的代码执行完毕后在执行fn中的代码
      // setTimeout(() => {
      //   this.$refs.addForm.resetFields();
      // }, 0);
      // 2. 使用 $nextTick(fn) 等待dom渲染完毕
      // 2.1 含义： 下一帧 去执行fn函数    浏览器一秒渲染60次  60帧
      this.$nextTick(() => {
        this.$refs.addForm.resetFields();
      });
    },
    delUser(id) {
      // 确认框
      this.$confirm("亲，是否删除该用户?", "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          // 需要用户的ID
          // 删除请求
          // 问请求方式有几种8种：
          // 常用的有五种，这是一种resetful接口定义规范：
          // get    查询操作
          // post   添加操作
          // put    修改操作  整个数据修改
          // patch  修改操作  部分属性修改
          // delete 删除操作
          const {
            data: { meta }
          } = await this.$http.delete(`users/${id}`);
          // 失败情况
          if (meta.status !== 200) return this.$message.error(meta.msg);
          // 成功情况
          this.getData();
        })
        .catch(() => null);
    },
    async toggleState(row) {
      // scope.row {id,mg_state} 最新的状态  row.mg_state
      // 获取当前行的ID
      // 当你去切换的时候  修改当前组件的值  值是双向数据绑定  mg_state 也已经修改
      const {
        data: { meta }
      } = await this.$http.put(`users/${row.id}/state/${row.mg_state}`);
      if (meta.status !== 200) return this.$message.error("切换状态失败");
      // this.getData();
      this.$message.success("切换状态成功");
    },
    async openChangeRole(row) {
      // 获取 当前行数据
      // 获取 当角色列表数据
      const {
        data: { data, meta }
      } = await this.$http.get("roles");
      if (meta.status !== 200) return this.$message.error("获取角色列表失败");
      // 两项数据准备完毕  渲染
      this.roleUserName = row.username;
      // 目的：给将来分配角色使用
      this.roleUserId = row.id;
      this.roleName = row.role_name;
      this.roleList = data;
      // 显示对话框
      this.roleDialogFormVisible = true;
    },
    async changeRole() {
      // 点击确认按钮  修改当前用户的角色
      // 1. 明确修改角色需要哪些数据  用户ID  角色ID
      // 2. 准备数据 用户ID 在打开对话框的时候 roleUserId 赋值
      // 3. 准备数据 角色ID v-model="roleSelected"  就是选中的角色ID
      const {
        data: { meta }
      } = await this.$http.put(`users/${this.roleUserId}/role`, {
        rid: this.roleSelected
      });
      // 4. 失败
      if (meta.status !== 200) return this.$message.error("分配角色失败");
      // 5. 成功
      this.getData();
      this.roleDialogFormVisible = false;
    }
  }
};
</script>

<style lang="less" scoped></style>
