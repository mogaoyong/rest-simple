<template>
  <!--新增界面-->
  <el-row>
    <el-col :span="24" style="padding:20px;">
      <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="addForm.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPassword">
          <el-input type="password" v-model="addForm.checkPassword" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="addForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="部门" prop="department">
          <template scope="scope">
            <el-popover trigger="click" width="400" placement="bottom-start">
              <DepTree :handleNodeClick="handleNodeClick" treeClass="select-dep-tree"></DepTree>
              <div slot="reference" class="name-wrapper">
                <el-input v-model="addForm.department" v-show="false"></el-input>
                <el-input v-model="addForm.departmentName" :readonly="true" auto-complete="off"></el-input>
              </div>
            </el-popover>
          </template>
        </el-form-item>
        <el-form-item label="职位" prop="position">
          <el-input v-model="addForm.position" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="addForm.gender">
            <el-radio class="radio" :label="1">男</el-radio>
            <el-radio class="radio" :label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="头像">
          <el-input v-model="addForm.avatar" v-show="false"></el-input>
          <el-upload
            class="avatar-uploader"
            action="http://localhost:8080/router?appKey=728546026281111356&method=file.upload&v=1.0"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

      </el-form>
      <div class="dialog-footer">
        <el-button @click.native="back">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-col>
  </el-row>
</template>

<script type="text/ecmascript-6">
  import ElCol from 'element-ui/packages/col/src/col';
  import ElPopover from '../../../node_modules/element-ui/packages/popover/src/main';
  import DepTree from 'components/dep-tree/dep-tree.vue';

  export default {
    components: {
      ElPopover,
      ElCol,
      DepTree
    },
    data() {
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.addForm.checkPassword !== '') {
            this.$refs.addForm.validateField('checkPassword');
          }
          callback();
        }
      };
      var validateCheckPassword = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.addForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        addLoading: false,
        addFormVisible: true,
        addFormRules: {
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'}
          ],
          name: [
            {required: true, message: '请输入姓名', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {validator: validatePass, trigger: 'blur'}
          ],
          checkPassword: [
            {required: true, message: '请再次输入密码', trigger: 'blur'},
            {validator: validateCheckPassword, trigger: 'blur'}
          ]
        },
        imageUrl: '',
        //  新增界面数据
        addForm: {
          username: '',
          name: '',
          password: '',
          checkPassword: '',
          position: '',
          mobile: '',
          gender: 1,
          avatar: '',
          email: '',
          departmentId: '',
          departmentName: ''
        }
      };
    },
    methods: {
      handleAvatarSuccess(res, file) {
        this.addForm.avatar = res.url;
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 PNG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      handleNodeClick: function (node) {
        this.addForm.departmentName = node.name;
        this.addForm.department = node.id;
      },
      // 新增
      addSubmit: function () {
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(async() => {
              var _this = this;
              // NProgress.start();
              let params = Object.assign({}, this.addForm);
              _this.addLoading = true;
              let data = await this.$api.post(params, 'user.add');
              _this.addLoading = false;
              if (data === 0) {
                _this.$message({
                  message: '操作成功',
                  type: 'success'
                });
                _this.$refs['addForm'].resetFields();
                _this.$router.push({name: 'UserList'});
              }
             /* this.$api.post(params, 'user.add').then(response => {
                _this.addLoading = false;
                this.$api.proccess(response, function () {
                  _this.$message({
                    message: '操作成功',
                    type: 'success'
                  });
                  _this.$refs['addForm'].resetFields();
                  _this.$router.push({name: 'UserList'});
                });
              }); */
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
      // this.getDepartmentTree();
    }
  };
</script>

<style lang="scss">
  .dialog-footer {
    text-align: right;
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

  .select-dep-tree {
    height: 200px;
    overflow: auto;
  }
</style>
