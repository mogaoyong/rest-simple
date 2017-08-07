<template>
  <section>
  <el-row>
    <el-col :span="12">
      <!-- 工具栏 -->
      <el-form :inline="true" :model="filters">
        <el-row >
          <el-col :span="18" class="toolbar">

            <el-form-item>
              <el-input v-model="filters.name" placeholder="字典名称" style="width:130px;"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input v-model="filters.text" placeholder="字典文本" style="width:130px;"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="search" v-on:click="getDictionaries">查询</el-button>
            </el-form-item>
          </el-col>
          <el-col :span='6' class="toolbar">
            <el-form-item style="float:right">
              <el-button type="primary" icon="plus" @click="handleAdd">新增</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!--列表-->
      <el-table :data="dictionaries" highlight-current-row v-loading="listLoading" @sort-change="sort"
                @selection-change="selsChange" style="width: 100%;">
        <el-table-column type="selection" width="55"/>
        <el-table-column prop="name" label="字典名称" width="140" sortable/>
        <el-table-column prop="text" label="字典文本" width="120" sortable/>
        <el-table-column prop="remark" label="备注" width="130"/>
        <el-table-column label="操作">
          <template scope="scope">
            <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--工具条-->
      <el-col :span="24" class="toolbar">
        <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
        <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize"
                       :total="total"
                       style="float:right;">
        </el-pagination>
      </el-col>
    </el-col>
    <el-col :span="12"></el-col>
  </el-row>
  </section>
</template>

<script type="text/ecmascript-6">
  export default {
    components: {
    },
    data () {
      return {
        filters: {
          name: '',
          text: ''
        },
        order: '',
        orderBy: '',
        dictionaries: [],
        total: 0,
        pageCount: 1, // 总页数
        pageSize: 15, // 每页显示条目个数
        currentPage: 1, // 当前页数
        listLoading: false,
        sels: [] //  列表选中列,
      };
    },
    methods: {
      // 分页
      handleCurrentChange (val) {
        this.currentPage = val;
        this.getDictionaries();
      },
      //  获取数据字典列表
      async getDictionaries () {
        let params = {
          pageNo: this.currentPage,
          pageSize: this.pageSize,
          order: this.order,
          orderBy: this.orderBy,
          name: this.filters.name,
          text: this.filters.text
        };
        this.listLoading = true;
        let data = await this.$api.post(params, 'dict.page');
        this.listLoading = false;
        if (data) {
          this.total = data.totalCount;
          this.pageCount = data.totalPages;
          this.pageSize = data.pageSize;
          this.dictionaries = data.result;
        }
      },
      // 排序
      sort: function (data) {
        this.order = data.order;
        this.orderBy = data.prop;
        this.getDictionaries();
      },
      // 显示新增界面
      handleAdd: function () {
        // this.$router.push({name: 'UserAdd'});
      },
      // 显示编辑界面
      handleEdit: function (index, row) {
        // this.$router.push({name: 'UserEdit', params: {id: row.id}});
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
              _this.getDictionaries();
            });
          });
        }).catch(() => {

        });
      }
    },
    mounted () {
      this.getDictionaries();
    }
  };
</script>

<style lang="scss">

</style>
