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
          <el-button type="primary" @click="addDialogFormVisible = true"
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
              active-color="#13ce66"
              inactive-color="#ff4949"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <el-button-group>
            <el-button type="primary" icon="el-icon-edit"></el-button>
            <el-button type="primary" icon="el-icon-delete"></el-button>
            <el-button type="primary" icon="el-icon-setting"></el-button>
          </el-button-group>
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
    <el-dialog title="收货地址" :visible.sync="addDialogFormVisible">
      <el-form :model="addForm" autocomplete="off" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDialogFormVisible = false"
          >确 定</el-button
        >
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
      addForm: {}
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
    }
  }
};
</script>

<style lang="less" scoped></style>
