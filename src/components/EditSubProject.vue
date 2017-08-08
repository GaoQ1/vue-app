<template>
  <div v-if="formProduct.subProject">
    <header class="header">
      <h3>
        {{formProduct.subProject.name}}
        <span class="return" @click="goBack">返回上一页</span>
      </h3>
      <el-row class="title">
        <el-col :span="6">基本信息</el-col>
        <el-col :span="3" :offset="15">
          <el-button class="info__edit" @click="editSubProj(formProduct)">编辑</el-button>
          <el-button class="info__delete" @click="deleteSubProj(formProduct.subProject.id)">删除</el-button>
        </el-col>
      </el-row>
      <el-row class="info">
        <el-col :span="5">
          装修标准：{{formProduct.subProject.standard}}
        </el-col>
        <el-col :span="5">
          设计面积：{{formProduct.subProject.designArea}}
        </el-col>
        <el-col :span="5">
          提交时间：{{formProduct.subProject.submitDate | time-format}}
        </el-col>
        <el-col :span="5">
          下发时间：{{formProduct.subProject.dispatchDate | time-format}}
        </el-col>
      </el-row>
      <el-row class="info">
        <el-col :span="5">
          工程进展：{{formProduct.subProject.progress}}
        </el-col>
        <el-col :span="5">
          阶段性下发说明（初稿时间）：{{formProduct.subProject.draftDispatchDate | time-format}}
        </el-col>
        <el-col :span="5">
          项目负责人：{{formProduct.subProject.owner}}
        </el-col>
      </el-row>
    </header>

    <section>
      <leaf-let :latestVersion="formProduct.subProject.latestVersion"></leaf-let>
    </section>

    <create-child-dialog :formChild="formChild" :dialogFormVisible.sync="formChild.dialogFormVisible"
                         :isEdit="true"></create-child-dialog>
  </div>
</template>

<script>
  import {mapState, mapActions} from 'vuex'
  import {axiosDelete} from '@/assets/fetch'
  import {formChild} from '@/assets/customData'
  import LeafLet from '@/components/LeafLet.vue'
  import CreateChildDialog from '@/components/CreateChildDialog'
  export default{
    components: {
      LeafLet,
      CreateChildDialog
    },
    data(){
      return {
        formChild: formChild
      }
    },
    computed: mapState({
      formProduct: state => state.menu.subProjectData
    }),

    methods: {
      ...mapActions([
        'getSubProjects'
      ]),
      deleteSubProj(id){
        this.$confirm('删除后项目无法恢复，确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axiosDelete(`api/coord/project/sub/${id}`).then(deleteProj => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.$router.push({path: '/'})
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      editSubProj(data){
        this.formChild.title = data.project.name;

        Object.keys(this.formChild).forEach(name => {
          if (data.subProject[name]) {
            this.formChild[name] = data.subProject[name];
          }
        })
        this.formChild.dialogFormVisible = true;
      },
      goBack(){
        this.$router.go(-1)
      }
    },
    created(){
      let id = this.$route.params.id;
      this.getSubProjects(id);
    }
  }
</script>

<style lang="scss" scoped>
  .header {
    margin-bottom: 20px;

  .el-col {
    height: 2rem;
    line-height: 2rem;
  }

  h3 {
    background-color: #2C3137;
    color: white;
    padding: 5px 10px;
    height: 34px;

  .return {
    float: right;
    font-size: 14px;
    font-weight: 400;
    padding: 5px 10px;
    cursor: pointer;
  }

  }
  .info {
    color: #5b5b5b;
    font-size: 14px;
    margin: 10px 0;
  }

  .info__edit {
    width: 78px;
    height: 30px;
    background-repeat: no-repeat;
    background-image: url('../../static/img/editproject/icon-edit.svg');
    background-position: 16% 60%;
    background-size: 12px;
    border-radius: 2px;
  }

  .info__delete {
    width: 78px;
    height: 30px;
    background-repeat: no-repeat;
    background-image: url('../../static/img/editproject/icon-delete.svg');
    background-position: 16% 60%;
    background-size: 12px;
    border-radius: 2px;
  }

  }
  .title {
    color: #5b5b5b;
    font-size: 14px;
    border-bottom: solid 1px grey;
    font-weight: bold;
    line-height: 2rem;

  }
</style>
