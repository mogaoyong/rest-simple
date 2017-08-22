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
      async getResourceTree (parentId) {
        if (!parentId) {
          parentId = '-1';
        }
        let params = {
          parentId: parentId
        };
        this.treeLoading = true;
        let data = await this.$api.post(params, 'resource.user');
        this.treeLoading = false;
        if (data) {
          this.treeData = [{id: '-1', name: '所有资源', children: data}];
          this.expandedKeys.push(this.treeData[0].id);
        }
      }
    },
    mounted () {
      this.getResourceTree();
    }
  };
</script>

<style lang="scss">

</style>
