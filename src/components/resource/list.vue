<template>
  <el-row>
    <el-col :span="4" style="position: relative">
      <ResourceTree :handleNodeClick="handleNodeClick" treeClass="side-tree"></ResourceTree>
    </el-col>
    <el-col :span="20">
      <!-- 工具栏 -->
      <PageTable ref="pageTable" :filters="filters" toolbarCls="tree-toolbar"
                 :handleAdd="handleAdd" method='resource.page' @batch-remove="batchRemove">
        <template slot="search">
          <el-form-item>
            <el-input v-model="filters.name" placeholder="资源名称" style="width:130px;"></el-input>
          </el-form-item>
        </template>

        <template slot="columns">
          <el-table-column type="selection" width="55"/>
          <el-table-column prop="name" label="名称" width="120" sortable/>
          <el-table-column prop="path" label="链接" width="150" sortable/>
          <el-table-column prop="code" label="权限编码" width="150" sortable/>
          <el-table-column prop="display" label="显示" :formatter="formatDisplay" width="80"/>
          <el-table-column prop="enable" label="可用" :formatter="formatEnable" width="80"/>
          <el-table-column prop="icon" label="图标" min-width="80">
            <template scope="scope">
              <i :class="scope.row.icon" aria-hidden="true"></i>
            </template>
          </el-table-column>
          <el-table-column prop="orders" label="排序" width="90" sortable/>
          <el-table-column label="操作">
            <template scope="scope">
              <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            </template>
          </el-table-column>
        </template>
      </PageTable>
    </el-col>
  </el-row>
</template>

<script type="text/ecmascript-6">
  import PageTable from 'components/page-table/page-table.vue';
  import ResourceTree from 'components/resource-tree/resource-tree.vue';
  import Vue from 'vue';

  export default {
    components: {
      PageTable,
      ResourceTree
    },
    data() {
      return {
        treeLoading: false,
        treeData: [],
        expandedKeys: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        filters: {
          name: '',
          parentId: ''
        }
      };
    },
    methods: {
      //  显示转换
      formatDisplay: function (row, column) {
        // console.log(row[column.property]);
        if (row.display) {
          return '是';
        } else {
          return '否';
        }
      },
      //  可用转换
      formatEnable: function (row, column) {
        // console.log(row[column.property]);
        if (row.enable) {
          return '是';
        } else {
          return '否';
        }
      },
      // 读取资源树
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
          this.treeData = data;
          this.expandedKeys.push(this.treeData[0].id);
        }
      },
      // 显示新增界面
      handleAdd: function () {
        this.$router.push({name: 'ResourceAdd'});
      },
      // 显示编辑界面
      handleEdit: function (index, row) {
        this.$router.push({name: 'ResourceEdit', params: {id: row.id}});
      },
      // 批量删除
      batchRemove: async function (ids) {
        var _this = this;
        // NProgress.start();
        let params = {ids: ids};
        this.$refs.pageTable.listLoading = true;
        let data = await this.$api.post(params, 'resource.delete');
        this.$refs.pageTable.listLoading = false;
        if (data === 0) {
          _this.$message({
            message: '删除成功',
            type: 'success'
          });
          this.$refs.pageTable.getPage();
        }
      },
      handleNodeClick: function (node) {
        this.filters.parentId = node.id;
        let _this = this;
        Vue.nextTick(function() {
          _this.$refs.pageTable.getPage();
        });
      }
    },
    mounted () {
      this.getResourceTree();
    }
  };
</script>

<style lang="scss">

</style>
