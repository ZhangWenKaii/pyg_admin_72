export default {
  data() {
    return {
      // 级联数据  选中的分类
      selectedCateArr: [],
      // 级联数据  所有级分类数据
      cascaderOptions: [],
      // 级联数据  属性相关属性
      cascaderProps: {
        expandTrigger: "hover",
        label: "cat_name",
        value: "cat_id"
      },
      // tabs的属性 参数类型
      activeName: "many"
    };
  },
  // 计算属性：当需要的一项数据，需要依赖data中的数据，通过一些逻辑得到
  // 语法: computed:{key:value} key数据的名字 value 数据对应的函数 必须有返回值
  computed: {
    thirdCateId() {
      let id = null;
      if (this.selectedCateArr.length === 3) {
        id = this.selectedCateArr[2];
      }
      return id;
    }
  },
  created() {
    // 给cascaderOptions赋值  获取所有分类数据
    this.getData();
  },
  methods: {
    async getParamsData() {
      // 严谨处理  让你的程序更加健壮
      if (!this.thirdCateId) {
        return false;
      }
      // 获取参数列表数据
      // 依赖：第三级分类的ID
      // 依赖：参数的类型
      const {
        data: { data, meta }
      } = await this.$http.get(`categories/${this.thirdCateId}/attributes`, {
        params: { sel: this.activeName }
      });
      console.log(meta);
      console.log(data);
    },
    // 切换了选项卡触发事件
    handleClick() {
      // tab 是当前选中的选项卡实例
      this.getParamsData();
    },
    handleChange() {
      // 选择了分类触发事件
      // 参数是挂在 三级分类下  其他分类是无意义的
      if (this.selectedCateArr.length !== 3) {
        this.selectedCateArr = [];
        this.$message.warning("第三级分类才能设置参数");
        return false;
      }
      this.getParamsData();
    },
    async getData() {
      const {
        data: { data, meta }
      } = await this.$http.get("categories");
      if (meta.status !== 200) return this.$message.error("获取分类失败");
      this.cascaderOptions = data;
    }
  }
};
