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
      }
    };
  },
  created() {
    this.getData();
  },
  methods: {
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
