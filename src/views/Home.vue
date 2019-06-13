<template>
  <el-container>
    <el-header>
      <div id="logo-box">
        <img src="../assets/img/heima.png" alt />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout()">退出</el-button>
    </el-header>
    <el-container :style="{ height: 'calc(100% - 60px)' }">
      <el-aside :width="menushow ? '65px' : '200px'">
        <div id="toggle_bar" @click="menushow = !menushow">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          unique-opened
          :collapse="menushow"
          :collapse-transition="false"
          :default-active="$route.path"
          router
        >
          <el-submenu
            v-for="item in menuList"
            :key="item.id"
            :index="item.id + ''"
            :style="{ width: menushow ? '65px' : '200px' }"
          >
            <template slot="title">
              <i :class="'iconfont icon-' + icons['ic' + item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item
              :index="'/' + item2.path"
              v-for="item2 in item.children"
              :key="item2.id"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ item2.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <!--为第3级别业务组件的显示设置占位符-->
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  created() {
    this.getMenuList();
  },
  // mounted() {
  //   // 获取当前地址的路径  和菜单的index是一致
  //   console.log(this.$route);
  // },
  methods: {
    // 管理员退出系统
    logout() {
      this.$confirm("确认要退出系统么?", "退出", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          window.sessionStorage.removeItem("token");
          this.$router.push("/login");
        })
        .catch(() => {});
    },
    // 获得左侧导航菜单数据
    async getMenuList() {
      // axios访问服务器获得数据
      var { data: dt } = await this.$http.get("menus");
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg);
      }
      // 把获得好的菜单数据赋予给menuList
      this.menuList = dt.data;
    }
  },
  data() {
    return {
      menushow: false, // 控制左侧菜单 折叠true、展开false
      menuList: [], // 存储左侧导航菜单数据
      // 给左侧菜单设计图标
      icons: {
        ic125: "users",
        ic103: "tijikongjian",
        ic101: "shangpin",
        ic102: "danju",
        ic145: "baobiao"
      }
    };
  }
};
</script>

<style lang="less" scoped>
// .el-submenu__title span {
//   font-size: 13px;
// }
.el-container {
  height: 100%;
  .el-header {
    background-color: #373d41;
    display: flex;
    align-items: center;
    padding: 0;
    justify-content: space-between;
    padding-right: 20px;
    #logo-box {
      display: flex;
      align-items: center;
      color: #fff;
      font-size: 22px;
      user-select: none;
      img {
        width: 50px;
        height: 50px;
        margin-right: 10px;
      }
    }
  }
  .el-aside {
    background-color: #333744;
    #toggle_bar {
      background-color: #4a5064;
      text-align: center;
      color: #fff;
      height: 25px;
      line-height: 25px;
      font-size: 12px;
      letter-spacing: 0.1em;
      user-select: none;
      cursor: pointer;
    }
  }
  .el-main {
    background-color: #eaedf1;
  }
}
</style>
