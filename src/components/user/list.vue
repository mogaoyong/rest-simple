<template>
  <section>
    <el-row style="background:#f2f2f2;border-left:1px solid #dfe6ec;margin-top:15px;">
      <el-col :span="4" style="overflow:auto">
        <DepTree :render-content="renderContent" :handleNodeClick="handleNodeClick" treeClass="dep-tree"></DepTree>
      </el-col>
      <el-col :span="20">
        <!-- 工具栏 -->
        <el-form :inline="true" :model="filters">
          <el-row style="border-left:1px solid #dfe6ec;">
            <el-col :span="18" class="toolbar">

              <el-form-item>
                <el-input v-model="filters.username" placeholder="用户名" style="width:130px;"></el-input>
              </el-form-item>
              <el-form-item>
                <el-input v-model="filters.name" placeholder="姓名" style="width:130px;"></el-input>
              </el-form-item>
              <el-form-item>
                <el-input v-model="filters.mobile" placeholder="手机号码" style="width:130px;"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="search" v-on:click="getUsers">查询</el-button>
              </el-form-item>
            </el-col>
            <el-col :span='6' class="toolbar">
              <el-form-item style="float:right">
                <el-button type="danger" icon="delete" @click="batchRemove" :disabled="this.sels.length===0">删除
                </el-button>
                <el-button type="primary" icon="plus" @click="handleAdd">新增</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <!--列表-->
        <el-table :data="users" highlight-current-row v-loading="listLoading" @sort-change="sort"
                  @selection-change="selsChange" style="width: 100%;">
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
          <el-table-column label="操作" width="150">
            <template scope="scope">
              <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button type="danger" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
          <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize"
                         :total="total"
                         style="float:right;">
          </el-pagination>
        </el-col>
      </el-col>
    </el-row>
  </section>
</template>

<script type="text/ecmascript-6">
  import ElRow from 'element-ui/packages/row/src/row';
  import ElCol from 'element-ui/packages/col/src/col';
  import DepTree from 'components/dep-tree/dep-tree.vue';

  export default {
    components: {
      ElCol,
      ElRow,
      DepTree
    },
    data () {
      return {
        filters: {
          name: '',
          username: '',
          mobile: '',
          departmentId: ''
        },
        order: '',
        orderBy: '',
        users: [],
        total: 0,
        pageCount: 1, // 总页数
        pageSize: 15, // 每页显示条目个数
        currentPage: 1, // 当前页数
        listLoading: false,
        treeLoading: false,
        sels: [] //  列表选中列,
      };
    },
    methods: {
      //  性别显示转换
      formatSex: function (row, column) {
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
      // 分页
      handleCurrentChange (val) {
        this.currentPage = val;
        this.getUsers();
      },
      //  获取用户列表
      async getUsers () {
        var _this = this;
        let params = {
          pageNo: this.currentPage,
          pageSize: this.pageSize,
          order: this.order,
          orderBy: this.orderBy,
          name: this.filters.name,
          username: this.filters.username,
          mobile: this.filters.mobile,
          departmentId: this.filters.departmentId
        };
        _this.listLoading = true;
        let data = await this.$api.post(params, 'user.page');
        _this.listLoading = false;
        if (data) {
          _this.total = data.totalCount;
          _this.pageCount = data.totalPages;
          _this.pageSize = data.pageSize;
          _this.users = data.result;
          if (_this.users) {
            _this.users.forEach(user => {
              user.department = user.map.departments[0].name;
              user.nameStr = user.map.departments[0].nameStr;
            });
          }
        }
        // _this.listLoading = true;
        // NProgress.start();
        /* this.$api.post(params, 'user.page').then(response => {
           _this.listLoading = false;
           this.$api.proccess(response, function () {
             _this.total = response.data.data.totalCount;
             _this.pageCount = response.data.data.totalPages;
             _this.pageSize = response.data.data.pageSize;
             _this.users = response.data.data.result;
             if (_this.users) {
               _this.users.forEach(user => {
                 user.department = user.map.departments[0].name;
                 user.nameStr = user.map.departments[0].nameStr;
               });
             }
           });
         }); */
      },
      renderContent (h, {node, data, store}) {
        return (
          < span title = {node.label}>{node.label}</span >
        );
      },
      // 排序
      sort: function (data) {
        this.order = data.order;
        this.orderBy = data.prop;
        this.getUsers();
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
      selsChange: function (sels) {
        this.sels = sels;
      },
      // 批量删除
      batchRemove: function () {
        var _this = this;
        var ids = _this.sels.map(item => item.id).toString();
        console.log(ids);
        _this.$confirm('确认删除选中记录吗？', '提示', {
          type: 'warning'
        }).then(() => {
          _this.listLoading = true;
          // NProgress.start();
          let params = {ids: ids};
          _this.$api.post(params, 'user.delete').then((response) => {
            _this.listLoading = false;
            _this.$api.proccess(response, function () {
              // NProgress.done();
              _this.$message({
                message: '删除成功',
                type: 'success'
              });
              _this.getUsers();
            });
          });
        }).catch(() => {

        });
      }
    },
    mounted () {
      this.getUsers();
    }
  };
</script>

<style lang="scss">
  .toolbar {
    padding: 10px;
    margin: 0px;
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
