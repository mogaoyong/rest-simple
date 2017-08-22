<template>
  <section>
    <!-- 工具栏 -->
    <el-form :inline="true" :model="filters">
      <el-row :class="toolBarRowCls">
        <el-col :span="18" :class="toolbarCls">
          <slot name="search" :filters="filters"></slot>
          <el-form-item>
            <el-button type="primary" icon="search" v-on:click="getPage">查询</el-button>
          </el-form-item>
        </el-col>
        <el-col :span='6' :class="toolbarCls">
          <el-form-item style="float:right">
            <el-button type="primary" icon="plus" @click="handleAdd">新增</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!--列表-->
    <el-table :data="data" highlight-current-row v-loading="listLoading" @sort-change="sort" stripe
              @selection-change="selsChange" style="width: 100%;">
      <slot name="columns" :data="data"></slot>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[15, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total" style="float:right;">
      </el-pagination>
    </el-col>
  </section>
</template>

<script type="text/ecmascript-6">
  var merge = require('webpack-merge');

  export default {
    components: {},
    props: {
      toolbarCls: {
        type: String,
        default: function () {
          return 'toolbar';
        }
      },
      toolBarRowCls: {
        type: String,
        default: function () {
          return '';
        }
      },
      filters: {
        type: Object,
        default: function () {
          return {};
        }
      },
      method: {
        type: String,
        default: function () {
          return '';
        }
      },
      handleAdd: Function
    },
    data () {
      return {
        data: [],
        order: '',
        orderBy: '',
        total: 0,
        pageCount: 1, // 总页数
        pageSize: 15, // 每页显示条目个数
        currentPage: 1, // 当前页数
        listLoading: false,
        sels: [] //  列表选中列,
      };
    },
    methods: {
      // 读取分页数据
      async getPage() {
        var _this = this;
        let params = {
          pageNo: this.currentPage,
          pageSize: this.pageSize,
          order: this.order,
          orderBy: this.orderBy
        };

        params = merge(params, this.filters);
        _this.listLoading = true;
        let data = await this.$api.post(params, this.method);
        _this.listLoading = false;
        if (data) {
          this.total = data.totalCount;
          this.pageCount = data.totalPages;
          this.pageSize = data.pageSize;
          _this.data = data.result;
          _this.$emit('data-loaded', _this.data);
        }
        // this.$emit('page-change', this.total, this.pageCount, this.currentPage, this.pageSize, this.order, this.orderBy, this.filters);
      },
      setData(data) {
        this.data = data;
      },
      //
      handleSizeChange (val) {
        this.pageSize = val;
        this.getPage();
      },
      // 分页
      handleCurrentChange (val) {
        this.currentPage = val;
        this.getPage();
      },
      // 排序
      sort: function (data) {
        this.order = data.order;
        this.orderBy = data.prop;
        this.getPage();
      },
      selsChange: function (sels) {
        this.sels = sels;
      },
      // 批量删除
      batchRemove: function () {
        var ids = this.sels.map(item => item.id).toString();
        this.$confirm('确认删除选中记录吗？', '提示', {
          type: 'warning'
        }).then(() => {
          this.$emit('batch-remove', ids);
        }).catch(() => {

        });
      }
    },
    mounted () {
      this.getPage();
    }
  };
</script>

<style lang="scss">

</style>
