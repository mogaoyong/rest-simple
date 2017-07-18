<template>
  <el-tree :data="treeData" :props="defaultProps" node-key='id' :default-expanded-keys="expandedKeys"
           @node-click="handleNodeClick" v-loading="treeLoading" :render-content="renderContent"
           :class="treeClass"></el-tree>
</template>

<script type="text/ecmascript-6">
  export default {
    data () {
      return {
        treeLoading: false,
        treeData: [],
        expandedKeys: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        }
      };
    },
    props: {
      treeClass: {
        type: String
      },
      renderContent: Function,
      handleNodeClick: Function
    },
    methods: {
      // 读取部门树
      async getDepartmentTree (parentId) {
        if (!parentId) {
          parentId = '00000000';
        }
        // var _this = this;
        let params = {
          parentId: parentId
        };
        this.treeLoading = true;
        let data = await this.$api.post(params, 'department.tree');
        this.treeLoading = false;
        if (data) {
          this.treeData = data;
          this.expandedKeys.push(this.treeData[0].id);
        }
        /* _this.treeLoading = true;
        this.$api.post(params, 'department.tree').then(response => {
          _this.treeLoading = false;
          this.$api.proccess(response, function () {
            _this.treeData = response.data.data;
            _this.expandedKeys.push(_this.treeData[0].id);
          });
        }); */
      }
    },
    mounted () {
      this.getDepartmentTree();
    }
  };
</script>

<style lang="scss">

</style>
