<template>
  <div>
    <header class="header">
      <h3>{{projectData.name}}</h3>
      <el-row class="title">
        <el-col :span="6">基本信息</el-col>
        <el-col :span="3" :offset="15">
          <el-button class="info__edit" @click="editProj(projectData)">编辑</el-button>
          <el-button class="info__delete" @click="deleteProj(projectData.id)">删除</el-button>
        </el-col>
      </el-row>
      <el-row class="info">
        <el-col :span="4">
          立项部门：{{projectData.department}}
        </el-col>
        <el-col :span="4">
          填表人：{{projectData.inputPerson}}
        </el-col>
        <el-col :span="4">
          填表时间：{{projectData.inputDate | time-format}}
        </el-col>
      </el-row>
      <el-row class="info">
        <el-col :span="20">
          委托内容：{{projectData.content}}
        </el-col>
      </el-row>
    </header>

    <el-row class="title">
      <el-col :span="24">立项内容</el-col>
    </el-row>
    <section>
        <el-card class="card" :body-style="{ padding: '0px' }">
          <div class="card--add" @click="childVisible(projectData.name)">
            <i class="el-icon-plus"></i>创建工程
          </div>
        </el-card>
        <el-card class="card" :body-style="{ padding: '0px' }" v-for="item in projectData.subProjects" :key="item.id">
          <div class="card__title">
            <div class="card__btn">
              <el-button class="download">下载</el-button>
              <router-link :to="'/subproject/' + item.id"> <el-button class="check">审核</el-button></router-link>
            </div>
          </div>
          <div class="card__footer">
             <!--<span>{{item.version}}</span>-->
            <div class="card__footer__name">{{item.name}}</div>
            <div>最后修改时间：{{item.lastUpdateTime}}</div>
          </div>
          <!-- <div class="card__badge">
              {{item.count}}
          </div> -->
        </el-card>
    </section>

    <create-parent-dialog :formParent="formParent" :dialogFormVisible.sync="formParent.dialogFormVisible"
                          :editProjId="formPrentEditId"></create-parent-dialog>
  </div>
</template>

<script>
    import { bus } from '@/assets/bus'
    import { mapState, mapActions } from 'vuex'
    import { axiosDelete } from '@/assets/fetch'
    import { formParent } from '@/assets/customData'
    import CreateParentDialog from '@/components/CreateParentDialog'
    export default{
        name: 'editproject',
        components: {
            CreateParentDialog
        },
        data(){
            return {
                formParent: formParent,
                formPrentEditId: null
            }
        },
        computed: mapState({
            projectData: state => {
              return state.menu.projectData
            }
        }),
        methods: {
            ...mapActions([
              'getMenuData',
              'getProjects'
            ]),
            childVisible(name){
              bus.$emit('childDialogVisible', {
                name: name,
                id: this.$route.params.id
              })
            },
            deleteProj(id){
                this.$confirm('删除后项目无法恢复，确定删除?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  axiosDelete(`api/coord/project/${id}`).then(deleteProj => {
                    this.$message({
                      type: 'success',
                      message: '删除成功!'
                    });
                    this.$router.push({ path: '/' })
                    this.getMenuData()
                  })
                }).catch(() => {
                  this.$message({
                    type: 'info',
                    message: '已取消删除'
                  });
                });
            },
            editProj(projectData){
              Object.keys(this.formParent).forEach(name => {
                if(projectData[name]){
                  this.formParent[name] = projectData[name];
                }
              })
              this.formPrentEditId = projectData.id;
              this.formParent.dialogFormVisible = true;
            }
        },
        watch:{
          '$route'(to, from){
            this.getProjects(to.params.id)
          }
        },
        mounted(){
          this.getProjects(this.$route.params.id)
        }

    }

</script>

<style lang="scss" scoped>
  .header {
    margin-bottom:20px;
    .el-col {
      height: 2rem;
      line-height: 2rem;
    }

    h3 {
      background-color: #2C3137;
      color: white;
      padding: 5px 10px;
      height: 34px;
    }

    .info{
      color: #5b5b5b;
      font-size: 14px;
      margin: 10px 0;
    }

    .info__edit{
      width: 78px;
      height: 30px;
      background-repeat: no-repeat;
      background-image: url('../../static/img/editproject/icon-edit.svg');
      background-position: 16% 60%;
      background-size: 12px;
      border-radius: 2px;
    }

    .info__delete{
      width: 78px;
      height: 30px;
      background-repeat: no-repeat;
      background-image: url('../../static/img/editproject/icon-delete.svg');
      background-position: 16% 60%;
      background-size: 12px;
      border-radius: 2px;
    }
  }

  section {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin-top: 20px;
  }

  .title {
    color: #5b5b5b;
    font-size: 14px;
    border-bottom: solid 1px grey;
    font-weight: bold;
    line-height: 2rem;

  }

  .card {
    width: 260px;
    height: 250px;
    min-height: 220px;
    position: relative;
    margin-bottom: 40px;
    margin-right: 12px;

  }

  .card--add {
    text-align: center;
    cursor: pointer;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .card__title {
    height: 200px;
    line-height: 160px;
    text-align: center;
  }

  .download ,
  .check{
    position: relative;
    margin-top: 40%;
    margin-left: 5px;
    margin-right: 5px;
    width: 78px;
    height: 32px;
    border-radius: 2px;
    background-color: transparent;
    border:solid 1px white;
    color: white;
  }
  .download:hover,
  .check:hover{
    border:solid 1px white;
    color: white;
  }

  .card__title:hover{
    opacity: 0.8;
    background-color: #1f2d3d;
  .card__btn{
    display: block;
  }
  }

  .card__btn{
    display: none;
  }

  .card__footer {
    width: 100%;
    height: 48px;
    background-color: #2c3137;
    line-height: 1rem;
    font-size: 12px;
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .card__footer__name{
    font-size: 14px;
    font-weight: bold;
  }

  .card__badge {
    position: absolute;
    top: 0;
    right: 0;
    width: 2.4rem;
    height: 2.4rem;
    line-height: 2.4rem;
    text-align: center;
    background-color: #ccc;
    border-radius: 100%;
  }
</style>
