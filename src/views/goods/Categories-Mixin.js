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
      addRules: {
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
      cascaderOptions: []
    };
  },
  created() {
    this.getData();
  },
  methods: {
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
      this.addDialogFormVisible = true;
    },
    // 添加分类
    addCate() {},
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
