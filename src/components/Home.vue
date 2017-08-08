<template>
  <div class="container home">
    <el-row class="home__title">
      <el-col :span="8">
        <h3><i class="logo"></i><router-link to="/">恒大在线协同审图系统</router-link></h3>
      </el-col>
      <el-col :span="5" class="home__search">
        <el-input  placeholder="输入您想要查找的项目" icon="search" v-model="searchInput"></el-input>
      </el-col>
      <el-col :offset="13" :span="5">
            <el-dropdown trigger="click" class="alarm__container">
              <span class="el-dropdown-link"><i class="alarm"></i><i class="el-icon-arrow-down el-icon--right"></i></span>
              <el-dropdown-menu slot="dropdown" class="alarm__menu">
                <div class="dropdown-title">消息盒子</div>
                <el-dropdown-item><span class="alarm__type">【任务】</span><span>少时诵诗书所所所谁谁谁</span></el-dropdown-item>
                <el-dropdown-item><span class="alarm__type">【通知】</span><span>wwwwwwwwwwwwwwwwwwwwww</span></el-dropdown-item>
                <el-button>查看全部</el-button>
              </el-dropdown-menu>
            </el-dropdown>
          <el-badge :value="12" class="home__title--info">
            <i></i>
          </el-badge>
          <el-dropdown>
            <span class="home__title--user">
              用户<i class="el-icon-caret-bottom el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>我的消息</el-dropdown-item>
              <el-dropdown-item>退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
    </el-row>

    <el-row class="home__body">
      <el-col :span="4">
        <div class="home__body__menu" v-if="!isPaper">
          <el-menu default-active="1" class="home__body__menu--container" router="router">
            <el-submenu index="1">
              <template slot="title"><h4><i></i>我的立项书</h4></template>
              <el-menu-item v-for="menu in menuData" :index="'/project/' + menu.id" :key="menu.id">{{menu.name}}</el-menu-item>
            </el-submenu>
          </el-menu>
          <el-button type="text" class="home__body__menu--create" @click="formParent.dialogFormVisible = true"><i class="el-icon-plus"></i> 新建项目</el-button>
        </div>

        <div class="home__body__menu" v-else>

          <h4><i></i><span>图纸目录</span></h4>
          <el-menu class="home__body__menu--container">
            <el-submenu v-for="paper in papers" :key="paper.dirId" :index="paper.dirId">
              <template slot="title">{{paper.dirName}}</template>
              <el-menu-item v-for="item in paper.papers" :key="item.id" :index="item.id" @click="emitImgChange(item.url, item.id)">{{item.name}}</el-menu-item>
              <!-- <el-submenu index="2-2">
                <template slot="title">目录</template>
                <el-menu-item index="2-2-1">目录1</el-menu-item>
                <el-menu-item index="2-2-2">目录2</el-menu-item>
              </el-submenu> -->
            </el-submenu>
          </el-menu>
        </div>
      </el-col>
      <el-col :span="20" class="home__body__content">
        <router-view></router-view>
      </el-col>
    </el-row>
    <create-parent-dialog :formParent="formParent" :dialogFormVisible.sync="formParent.dialogFormVisible" :editProjId="0"></create-parent-dialog>
    <create-child-dialog :formChild="formChild" :dialogFormVisible.sync="formChild.dialogFormVisible" :isEdit="false"></create-child-dialog>
    <mark-pop :formMark="formMark" :dialogFormVisible.sync="formMark.dialogFormVisible"></mark-pop>
  </div>
</template>

<script>
    import { mapState, mapActions } from 'vuex'
    import { bus } from '@/assets/bus'
    import { post } from '@/assets/fetch'
    import { formParent, formChild } from '@/assets/customData'
    import CreateParentDialog from '@/components/CreateParentDialog'
    import CreateChildDialog from '@/components/CreateChildDialog'
    import MarkPop from '@/components/MarkPop'
    export default {
        name: 'home',
        components: {
            CreateParentDialog,
            CreateChildDialog,
            MarkPop
        },
        data() {
            return {
                formParent: formParent,
                formChild: formChild,
                isPaper: false,
                papers: [],
                searchInput:"",
                formMark: {
                  dialogFormVisible: false,
                  text: '',
                  priority: 3
                }
            };
        },

        computed: mapState({
            menuData: state => state.menu.menuData
        }),

        methods: {
            ...mapActions([
              'getMenuData',
              'getProjects'
            ]),
            emitImgChange(url, id){
              bus.$emit('imgChange', {
                url: url,
                id: id
              })
            }
        },

        created(){
            this.getMenuData();
            bus.$on('isPaper', data => {
              if(!data){
                this.isPaper = false;
              }else{
                this.papers = data;
                this.isPaper = true;
              }
            })
        },

        mounted(){
            bus.$on('childDialogVisible', data => {
              this.formChild.title = data.name;
              this.formChild.id = data.id;
              this.formChild.dialogFormVisible = true;
            });
            bus.$on('createNewSubProj', data => {
              let copyData = Object.assign({}, data);
              copyData.dispatchDate = +new Date(copyData.dispatchDate);
              copyData.draftDispatchDate = +new Date(copyData.draftDispatchDate);
              copyData.submitDate = +new Date(copyData.submitDate);
              post(`api/coord/project/${this.formChild.id}/sub`,{data: copyData}).then(subdata => {
                this.formChild.dialogFormVisible = false;
                this.getProjects(this.formChild.id);
              })
            });
            bus.$on('error', error => {
              this.$message.error(error);
            }),
            bus.$on('markPopVisible', (bol) => {
              this.formMark.dialogFormVisible = bol;
            });
        }
    }
</script>

<style lang="scss">
  /*reset css*/
  *{
    box-sizing: border-box;
  }
  .container{
    width: 100%;
    font-family: 'Microsoft YaHei';
  }
  ul,li{
    margin: 0;
    padding: 0;
    list-style: none;
  }
  a{
    text-decoration: none;
  }
</style>

<style lang="scss" scoped>
  @import "../styles/home.scss";

  .el-submenu__title{
    height: 50px;
    line-height: 50px;
  }

  .el-menu li{
    border-top:1px solid #bec7d1;
  }

  .el-submenu__icon-arrow{
    right: 40px;
    margin-top: -6px;
  }
  .home__body__menu{
  h4{
    margin-top: 0px;
    font-size:16px;
  i{
    display: inline-block;
    position: relative;
    top: 8px;
    width: 30px;
    height: 30px;
    margin-left: 10px;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 60% 60%;
    background-image: url("../../static/img/leaflet/icon-menu.svg") ;
  }
  }
  .home__body__menu--container{
    h4{
    margin:0;
      i{
        display: inline-block;
        position: relative;
        top: 10px;
        width: 30px;
        height: 30px;
        margin-left: 10px;
        background-repeat: no-repeat;
        background-position: center center;
        background-size: 60% 60%;
        background-image: url("../../static/img/leaflet/icon-project.svg") ;
      }
    }
  }
  }
  .alarm__type{
    color: #3D7DB0;
    display: inline;
    font-size: 12px;
  }
  .alarm__container {
  display:inline-block;


  .el-dropdown-item{
    border-bottom: solid 1px grey;
  }
    .alarm{
      display: inline-block;
      position: relative;
      top: 10px;
      width: 30px;
      height: 30px;
      margin-left: 10px;
      background-repeat: no-repeat;
      background-position: center center;
      background-size: 60% 60%;
      background-image: url("../../static/img/leaflet/alarm.svg") ;
    }
    .el-icon--right{
      margin-left: -5px;
      margin-right: 10px;
      color: #dbdbdb;

    }
  }
  .dropdown-title{
    background-color: #2c3137;
    color: #b3b3b3;
    font-size: 14px;
    padding: 5px;
    margin-top: -6px;
  }

</style>
<style lang="scss">
  .home__search{
  .el-input__inner{
    border-radius: 28px;
    height: 28px;
    background-color: transparent;
    border: solid 1px #878787;
    font-size: 12px;
    color: #B9BBBD;
    padding-left: 15px;
  }
  }
  .alarm__menu {
    width: 250px;
    font-size: 14px;
    color:#4C5054;
    .el-button{
      position: relative;
      left: 30%;
      border: none;
      font-size: 12px;
      font-weight: bold;
      color: grey;
    }
  li{
    border-bottom: solid 1px #bfbfbf;
    font-size: 12px;
    color: #848484;
    span{
      display: inline-block;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      width: 170px;
      vertical-align: middle;
    }
  }
  }

</style>
