<template>
  <section>
    <el-row style="background:#f2f2f2;border-left:1px solid #dfe6ec;margin-top:15px;">
      <el-col :span="4" style="overflow:auto">
        <DepTree :render-content="renderContent" :handleNodeClick="handleNodeClick" treeClass="dep-tree"></DepTree>
      </el-col>
      <el-col :span="20">
        <!-- 工具栏 -->
        <PageTable ref="pageTable" :filters="filters" toolBarRowCls="user-toolbar-row" toolbarCls="user-toolbar" :handleAdd="handleAdd" :extraParams="extraParams" method='user.page' @data-loaded="getUsers" @batch-remove="batchRemove">
          <template slot="search">
            <el-form-item>
              <el-input v-model="filters.username" placeholder="用户名" style="width:130px;"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input v-model="filters.name" placeholder="姓名" style="width:130px;"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input v-model="filters.mobile" placeholder="手机号码" style="width:130px;"></el-input>
            </el-form-item>
          </template>

          <template slot="columns">
              <el-table-column type="selection" width="55"/>
              <el-table-column type="index" width="60"/>
              <el-table-column prop="username" label="用户名" width="120" sortable/>
              <el-table-column prop="name" label="姓名" width="100" sortable/>
              <el-table-column prop="department" label="部门" width="140">
                <template scope="scope">
                  <el-popover trigger="hover" placement="top">
                    {{ scope.row.nameStr }}
                    <div slot="reference" class="name-wrapper">
                      {{ scope.row.department }}
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column prop="mobile" label="手机号码" width="130"/>
              <el-table-column prop="gender" label="性别" :formatter="formatSex" min-width="80" sortable/>
              <el-table-column prop="status" label="状态" :formatter="formatStatus" min-width="80" sortable/>
              <el-table-column label="操作">
                <template scope="scope">
                  <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                </template>
              </el-table-column>
          </template>
        </PageTable>
      </el-col>
    </el-row>
  </section>
</template>

<script type="text/ecmascript-6">
  import ElRow from 'element-ui/packages/row/src/row';
  import ElCol from 'element-ui/packages/col/src/col';
  import DepTree from 'components/dep-tree/dep-tree.vue';
  import PageTable from 'components/page-table/page-table.vue';

  export default {
    components: {
      ElCol,
      ElRow,
      DepTree,
      PageTable
    },
    data () {
      return {
        filters: {
          name: '',
          username: '',
          mobile: '',
          departmentId: ''
        },
        users: []
      };
    },
    computed: {
      extraParams: function () {
        return {
          name: this.filters.name,
          username: this.filters.username,
          mobile: this.filters.mobile,
          departmentId: this.filters.departmentId
        };
      }
    },
    methods: {
      //  性别显示转换
      formatSex: function (row, column) {
        // console.log(row[column.property]);
        return row.gender === '1' ? '男' : row.gender === '2' ? '女' : '未知';
      },
      // 状态显示
      formatStatus: function (row, column) {
        if (row.status === 0) {
          return '已删除';
        } else if (row.status === 1) {
          return '正常';
        } else if (row.status === 2) {
          return '禁用';
        } else if (row.status === 5) {
          return '锁定';
        } else {
          return '未知';
        }
      },
      //  获取用户列表
      async getUsers (data) {
          if (data) {
            data.forEach(user => {
              user.department = user.map.departments[0].name;
              user.nameStr = user.map.departments[0].nameStr;
            });
            this.$refs.pageTable.setData(data);
          }
      },
      renderContent (h, {node, data, store}) {
        return (
          < span title = {node.label}>{node.label}</span >
        );
      },
      // 显示新增界面
      handleAdd: function () {
        this.$router.push({name: 'UserAdd'});
      },
      // 显示编辑界面
      handleEdit: function (index, row) {
        this.$router.push({name: 'UserEdit', params: {id: row.id}});
      },
      handleNodeClick (node) {
        this.filters.departmentId = node.id;
        this.getUsers();
      },
      // 批量删除
      batchRemove: async function (ids) {
        var _this = this;
        // NProgress.start();
        let params = {ids: ids};
        this.$refs.pageTable.listLoading = true;
        let data = await this.$api.post(params, 'user.delete');
        this.$refs.pageTable.listLoading = false;
        if (data === 0) {
          _this.$message({
            message: '删除成功',
            type: 'success'
          });
          this.$refs.pageTable.getPage();
        }
      }
    }
  };
</script>

<style lang="scss">
  .user-toolbar-row{
    border-left:1px solid #dfe6ec;
  }
  .user-toolbar {
    padding: 10px;
    margin: 0px;
    background: #f2f2f2;
    .el-form-item {
      margin-bottom: 0;
    }
  }

  .dep-tree {
    border: none;
    margin-top: 10px;
    margin-right: 0px;
    height: 700px;
    background: #f2f2f2;
    overflow: auto;
  }
</style>
