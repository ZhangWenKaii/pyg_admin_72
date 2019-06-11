// 用户vue组件 业务逻辑（实例的配置选项）
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
      roleSelected: "",
      // 编辑用户相关数据
      editDialogFormVisible: false,
      editForm: {
        username: "",
        email: "",
        mobile: ""
      },
      editRules: {
        email: [
          { required: true, trigger: "blur", message: "邮箱必填" },
          { type: "email", trigger: "blur", message: "邮箱格式不正确" }
        ],
        mobile: [
          { required: true, trigger: "blur", message: "手机号必填" },
          { validator: checkMobile, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    // 打开编辑对话框
    openEditDialog() {
      this.editDialogFormVisible = true;
    },
    // 编辑用户
    editUser() {},
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
      // 清除下拉内容
      this.roleSelected = "";
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
