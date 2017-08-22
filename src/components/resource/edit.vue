<template>
  <!--新增界面-->
  <el-row>
    <el-col :span="24" style="padding:20px;">
      <el-form :model="dataForm" label-width="80px" :rules="dataFormRules" ref="dataForm">
        <el-form-item label="父资源" prop="parentName">
          <template scope="scope">
            <el-popover trigger="click" width="400" placement="bottom-start">
              <ResourceTree :handleNodeClick="handleNodeClick" treeClass="select-resource-tree"></ResourceTree>
              <div slot="reference" class="name-wrapper">
                <el-input v-model="dataForm.parentId" v-show="false"></el-input>
                <el-input v-model="dataForm.parentName" :readonly="true" auto-complete="off"></el-input>
              </div>
            </el-popover>
          </template>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="dataForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="链接" prop="path">
          <el-input type="path" v-model="dataForm.path" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="权限编码" prop="code">
          <el-input v-model="dataForm.code" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="显示">
          <el-radio-group v-model="dataForm.display">
            <el-radio class="radio" :label="true">是</el-radio>
            <el-radio class="radio" :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="可用">
          <el-radio-group v-model="dataForm.enable">
            <el-radio class="radio" :label="true">是</el-radio>
            <el-radio class="radio" :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input v-model="dataForm.icon" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="orders">
          <el-input-number v-model="dataForm.orders" :min="0" :max="100"></el-input-number>
        </el-form-item>
      </el-form>
      <div class="dialog-footer">
        <el-button @click.native="back">取消</el-button>
        <el-button type="primary" @click.native="formSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-col>
  </el-row>
</template>

<script type="text/ecmascript-6">
  import ElCol from 'element-ui/packages/col/src/col';
  import ElPopover from '../../../node_modules/element-ui/packages/popover/src/main';
  import ResourceTree from 'components/resource-tree/resource-tree.vue';

  export default {
    components: {
      ElPopover,
      ElCol,
      ResourceTree
    },
    data() {
      return {
        addLoading: false,
        dataFormVisible: true,
        dataFormRules: {
          name: [
            {required: true, message: '请输入名称', trigger: 'blur'}
          ],
          code: [
            {required: true, message: '请输入权限编码', trigger: 'blur'}
          ]
        },
        //  新增界面数据
        dataForm: {
          id: '',
          name: '',
          path: '',
          code: '',
          display: 1,
          enable: 0,
          icon: '',
          parentId: '',
          parentName: '',
          orders: 0
        }
      };
    },
    methods: {
      handleNodeClick: function (node) {
        this.dataForm.parentName = node.name;
        this.dataForm.parentId = node.id;
      },
      // 获取资源
      getResource: async function () {
        let params = {
          id: this.$route.params.id
        };
        let data = await this.$api.post(params, 'resource.get');
        if (data) {
          Object.assign(this.dataForm, data);
          this.dataForm.parentName = data.map.parent.name;
          this.dataForm.parentId = data.map.parent.id;
        }
      },
      // 修改
      formSubmit: function () {
        this.$refs.dataForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(async() => {
              var _this = this;
              // NProgress.start();
              let params = Object.assign({}, this.dataForm);
              _this.addLoading = true;
              let data = await this.$api.post(params, 'resource.edit');
              _this.addLoading = false;
              if (data === 0) {
                _this.$message({
                  message: '操作成功',
                  type: 'success'
                });
                _this.$refs['dataForm'].resetFields();
                _this.$router.push({name: 'ResourceList'});
              }
            });
          }
        });
      },
      // 返回
      back: function () {
        this.$router.go(-1);
      }
    },
    mounted() {
      this.getResource();
    }
  };
</script>

<style lang="scss">
  .select-resource-tree {
    height: 200px;
    overflow: auto;
  }
</style>
