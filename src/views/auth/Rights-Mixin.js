export default {
  created() {
    this.getData();
  },
  data() {
    return {
      rightsList: []
    };
  },
  methods: {
    async getData() {
      const {
        data: { data, meta }
      } = await this.$http.get("rights/list");
      if (meta.status !== 200) return this.$message.error("获取权限数据失败");
      this.rightsList = data;
    }
  }
};
