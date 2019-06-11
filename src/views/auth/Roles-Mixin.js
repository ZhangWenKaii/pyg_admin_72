export default {
  data() {
    return {
      rolesList: []
    };
  },
  created() {
    this.getData();
  },
  methods: {
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
