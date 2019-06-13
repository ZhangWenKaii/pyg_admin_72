export default {
  data() {
    return {
      // 树状的分类属性
      categoryList: [],
      // 获取分类列表参数
      reqParams: {
        pagenum: 1,
        pagesize: 5
      },
      // 分页相关数据
      total: 0,
      // 添加分类相关的数据
      addDialogFormVisible: false,
      rules: {
        cat_name: [{ required: true, message: "分类名称必填", trigger: "blur" }]
      },
      addForm: {
        cat_pid: 0, // 选择的分类ID  默认是0
        cat_name: "", // 添加的分类名称
        cat_level: 0 // 添加的分类的等级 0 1 2
      },
      // 选中的分类数据
      selectedCateArr: [],
      // 只拥有两层分类的数据
      cascaderOptions: [],
      // 编辑相关的数据
      editForm: {
        cat_name: ""
      },
      editDialogFormVisible: false
    };
  },
  created() {
    this.getData();
  },
  methods: {
    // 删除分类
    delCate(id) {
      this.$confirm("亲，是否删除该分类?", "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          // 删除请求
          const {
            data: { meta }
          } = await this.$http.delete(`categories/${id}`);
          if (meta.status !== 200) return this.$message.error("删除分类失败");
          this.getData();
          this.$message.success("删除分类成功");
        })
        .catch(() => null);
    },
    // 打开编辑对话框
    openEditDialog(row) {
      this.editDialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs.editForm.resetFields();
        // 填充分类名字
        this.editForm.cat_name = row.cat_name;
        this.editForm.cat_id = row.cat_id;
      });
    },
    async editCate() {
      // 编辑请求
      const {
        data: { meta }
      } = await this.$http.put(`categories/${this.editForm.cat_id}`, {
        cat_name: this.editForm.cat_name
      });
      if (meta.status !== 200) return this.$message.error("编辑分类失败");
      this.getData();
      this.editDialogFormVisible = false;
      this.$message.success("编辑分类成功");
    },
    // 选择级联
    handleChange() {},
    // 添加对话框打开
    async openAddDialog() {
      // 渲染级联控件
      const {
        data: { data, meta }
      } = await this.$http.get("categories", {
        params: { type: 2 }
      });
      if (meta.status !== 200) return this.$message.error("获取分类数据失败");
      this.cascaderOptions = data;
      // 默认不选中任何分类
      this.selectedCateArr = [];
      this.addDialogFormVisible = true;
      // 渲染完毕后去重置表单
      this.$nextTick(() => {
        this.$refs.addForm.resetFields();
      });
    },
    // 添加分类
    async addCate() {
      // addForm 此时的数据是否完整
      // cat_name 双向绑定的  此时有数据的
      // cat_pid  cat_level 根据当时的级联选中的内容去赋值
      let cat_pid = 0;
      if (this.selectedCateArr.length) {
        cat_pid = this.selectedCateArr[this.selectedCateArr.length - 1];
      }
      this.addForm.cat_pid = cat_pid;
      this.addForm.cat_level = this.selectedCateArr.length;
      const {
        data: { meta }
      } = await this.$http.post("categories", this.addForm);
      if (meta.status !== 201) return this.$message.error("添加分类失败");
      this.getData();
      this.addDialogFormVisible = false;
      this.$message.success("添加分类成功");
    },
    // 分页函数
    pager(newPage) {
      // 根据当前的页码 重新获取数据
      this.reqParams.pagenum = newPage;
      this.getData();
    },
    async getData() {
      // 获取数据
      const {
        data: { data, meta }
      } = await this.$http.get("categories", { params: this.reqParams });
      if (meta.status !== 200) return this.$message.error("获取分类数据失败");
      this.categoryList = data.result;
      // 设置总页数
      this.total = Math.ceil(data.total / data.pagesize);
    }
  }
};
