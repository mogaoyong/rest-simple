<template>
  <!--新增界面-->
  <el-row>
    <el-col :span="24" style="padding:20px;">
      <el-form :model="dataForm" label-width="80px" :rules="dataFormRules" v ref="dataForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="dataForm.username" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="dataForm.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPassword">
          <el-input type="password" v-model="dataForm.checkPassword" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="dataForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="部门" prop="department">
          <template scope="scope">
            <el-popover trigger="click" width="400" placement="bottom-start">
              <DepTree :handleNodeClick="handleNodeClick" treeClass="select-dep-tree"></DepTree>
              <div slot="reference" class="name-wrapper">
                <el-input v-model="dataForm.department" v-show="false"></el-input>
                <el-input v-model="dataForm.departmentName" :readonly="true" auto-complete="off"></el-input>
              </div>
            </el-popover>
          </template>
        </el-form-item>
        <el-form-item label="职位" prop="position">
          <el-input v-model="dataForm.position" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="dataForm.mobile" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="dataForm.gender">
            <el-radio class="radio" :label="'1'">男</el-radio>
            <el-radio class="radio" :label="'2'">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="dataForm.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="dataForm.status">
            <el-radio class="radio" :label="0">已删除</el-radio>
            <el-radio class="radio" :label="1">正常</el-radio>
            <el-radio class="radio" :label="2">禁用</el-radio>
            <el-radio class="radio" :label="5">锁定</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="头像">
          <el-input v-model="dataForm.avatar" v-show="false"></el-input>
          <el-upload
            class="avatar-uploader"
            action="http://localhost:8080/router?appKey=728546026281111356&method=file.upload&v=1.0"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="dataForm.avatar" :src="dataForm.avatar" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

      </el-form>
      <div class="dialog-footer">
        <el-button @click.native="back">取消</el-button>
        <el-button type="primary" @click.native="formSubmit" :loading="editLoading">提交</el-button>
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
        if (this.dataForm.checkPassword !== '') {
          this.$refs.dataForm.validateField('checkPassword');
        }
        callback();
      };
      var validateCheckPassword = (rule, value, callback) => {
        if (value !== this.dataForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        editLoading: false,
        dataFormRules: {
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'}
          ],
          name: [
            {required: true, message: '请输入姓名', trigger: 'blur'}
          ],
          password: [
            {validator: validatePass, trigger: 'blur'}
          ],
          checkPassword: [
            {validator: validateCheckPassword, trigger: 'blur'}
          ]
        },
        imageUrl: '',
        //  修改界面数据
        dataForm: {
          username: '',
          name: '',
          password: '',
          checkPassword: '',
          position: '',
          mobile: '',
          gender: 1,
          avatar: '',
          email: '',
          status: '',
          department: '',
          departmentName: ''
        }
      };
    },
    methods: {
      handleAvatarSuccess(res, file) {
        this.dataForm.avatar = res.url;
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
      // 选择部门响应
      handleNodeClick: function (node) {
        this.dataForm.departmentName = node.name;
        this.dataForm.department = node.id;
      },
      // 获取用户
      getUser: async function () {
        let params = {
          id: this.$route.params.id
        };
        let _this = this;
        let data = await this.$api.post(params, 'user.get');
        if (data) {
          Object.assign(_this.dataForm, data);
          _this.dataForm.departmentName = data.map.departments[0].name;
          _this.dataForm.department = data.map.departments[0].id;
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
              console.log(this.dataForm);
              _this.editLoading = true;
              let data = await this.$api.post(params, 'user.edit');
              _this.editLoading = false;
              if (data === 0) {
                _this.$message({
                  message: '操作成功',
                  type: 'success'
                });
                _this.$refs['dataForm'].resetFields();
                _this.$router.push({name: 'UserList'});
              }
            }).catch(() => {
              // do notong
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
      this.getUser();
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
