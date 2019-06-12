export default {
  data() {
    return {
      rolesList: [],
      // 添加角色相关数据
      addDialogFormVisible: false,
      addForm: {
        roleName: "",
        roleDesc: ""
      },
      rules: {
        roleName: [
          { required: true, message: "角色名称必填", trigger: "blur" }
        ],
        roleDesc: [{ required: true, message: "角色描述必填", trigger: "blur" }]
      },
      // 编辑相关的数据
      editDialogFormVisible: false,
      editForm: {
        roleName: "",
        roleDesc: ""
      },
      // 分配权限相关数据
      rightDialogFormVisible: false,
      rightsTreeData: [],
      defaultProps: {
        children: "children",
        label: "authName"
      },
      checkedIdArr: []
    };
  },
  created() {
    this.getData();
  },
  methods: {
    // 打开分配权限对话框
    async openRightsDialog(row) {
      // 先获取数据 使用await阻止程序的运行
      const {
        data: { data, meta }
      } = await this.$http.get("rights/tree");
      if (meta.status !== 200)
        return this.$message.error("获取所有权限数据失败");
      this.rightsTreeData = data;
      // 选中已有的权限的复选框
      let arr = [];
      // 只需要第三级的权限ID
      row.children.forEach(item => {
        item.children.forEach(subItem => {
          subItem.children.forEach(lastItem => {
            // 添加ID给arr数组
            arr.push(lastItem.id);
          });
        });
      });
      this.checkedIdArr = arr;
      // 再打开对话框
      this.rightDialogFormVisible = true;
    },
    // 提交分配权限
    disRights() {},
    // 删除单个权限
    delRights(row, rightId) {
      console.log(row);
      this.$confirm("亲，是否删除该权限?", "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          // 进行删除 准备 角色ID roleId 权限ID rightId
          // 需要 data （修改后的权限数据） 去局部的更新展开项
          // 当前获取的所有的角色列表信息是 rolesList
          // 去修改 rolesList 中的当前一项角色的数据  scope.row
          // scope.row.children 就是权限数据
          // 结论：scope.row.children = data 即可
          const {
            data: { data, meta }
          } = await this.$http.delete(`roles/${row.id}/rights/${rightId}`);
          if (meta.status !== 200)
            return this.$message.error("角色权限删除失败");
          // 通过当前实例中的数据是获取不到当前行数据的
          // 在 template 是可以获取row 数据
          // delRights 就是在  template 调用的
          row.children = data;
        })
        .catch(() => null);
    },
    // 打开编辑角色对话框
    openEditDialog(row) {
      this.editDialogFormVisible = true;
      this.$nextTick(() => {
        // 重置表单（数据 样式）
        this.$refs.editForm.resetFields();
        // 填充数据 row
        // 将来提交请求需要ID
        this.editForm.id = row.id;
        this.editForm.roleName = row.roleName;
        this.editForm.roleDesc = row.roleDesc;
      });
    },
    // 编辑请求
    editRole() {
      this.$refs.editForm.validate(async valid => {
        if (valid) {
          const {
            data: { meta }
          } = await this.$http.put(`roles/${this.editForm.id}`, {
            roleName: this.editForm.roleName,
            roleDesc: this.editForm.roleDesc
          });
          if (meta.status !== 200) return this.$message.error("编辑角色失败");
          // 成功
          this.editDialogFormVisible = false;
          this.getData();
        }
      });
    },
    // 删除业务
    delRole(roleId) {
      this.$confirm("亲，是否删除该角色?", "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const {
            data: { meta }
          } = await this.$http.delete(`roles/${roleId}`);
          if (meta.status !== 200) return this.$message.error("删除角色失败");
          this.getData();
        })
        .catch(() => null);
    },
    // 打开添加对话框
    openAddDialog() {
      this.addDialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs.addForm.resetFields();
      });
    },
    // 添加请求
    addRole() {
      // 1. 校验整个表单
      this.$refs.addForm.validate(async valid => {
        if (valid) {
          // 2. 知道提交的数据有哪些？roleName roleDesc ---> addForm
          const {
            data: { meta }
          } = await this.$http.post("/roles", this.addForm);
          if (meta.status !== 201) return this.$message.error("添加角色失败");
          // 3. 成功
          this.getData();
          this.addDialogFormVisible = false;
        }
      });
    },
    async getData() {
      // 获取角色列表数据
      const {
        data: { data, meta }
      } = await this.$http.get("roles");
      if (meta.status !== 200) return this.$message.error("获取角色据失败");
      this.rolesList = data;
    }
  }
};
