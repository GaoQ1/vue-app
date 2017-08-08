<template>
  <el-dialog :visible.sync="visible" title="新建项目" class="parent__form">
    <el-row>
      <el-col class="title__small">基本信息</el-col>
    </el-row>
    <el-form :model="formParent">
      <el-row>
        <el-col :span="8">
          <el-form-item label="项目名称" :label-width="formLabelWidth">
            <el-input v-model="formParent.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-form-item label="立项部门" :label-width="formLabelWidth">
            <el-input v-model="formParent.department"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="填表人" :label-width="formLabelWidth">
            <el-input v-model="formParent.inputPerson"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-form-item label="填表时间" :label-width="formLabelWidth">
            <el-date-picker v-model="formParent.inputDate" type="date" placeholder="选择日期"
                            :picker-options="pickerOptions"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="委托内容" :label-width="formLabelWidth">
        <el-input v-model="formParent.content"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="confirm__btn" >
      <el-button @click="createNewProj">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {mapActions} from 'vuex'
  import {post, put} from '@/assets/fetch'
  export default{
    props: ['formParent', 'dialogFormVisible', 'editProjId'],
    data(){
      return {
        formLabelWidth: '80px',
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        }
      }
    },
    computed: {
      visible: {
        get: function () {
          return this.dialogFormVisible
        },
        set: function (v) {
          this.$emit('update:dialogFormVisible', v)
        }
      }
    },
    methods: {
      ...mapActions([
        'getMenuData',
        'getProjects'
      ]),
      createNewProj(){
        let data = Object.assign({}, this.formParent);
        data.inputDate = +new Date(data.inputDate);

        if (!this.editProjId) {
          post('api/coord/project', {data: data}).then(projdata => {
            this.visible = false;
            this.getMenuData();
          })
        } else {
          put(`api/coord/project/${this.editProjId}`, {data: data}).then(projdata => {
            this.visible = false;
            this.getProjects(this.editProjId);
          })
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../styles/_mixin.scss";

  .confirm__btn {
    text-align: center;
    margin-top: -20px;
  }

  .title__small {
    margin-top: -20px;
    border-bottom: solid 1px black;
    margin-bottom: 20px;
    line-height: 2rem;
    font-weight: bold;
  }

  .el-button{
    background-color: $bg_hover_color;
    border-radius: 2px;
    color: white;
    font-weight: bold;
    height: 30px;
    line-height: 10px;
    width: 80px;
    margin-bottom: 10px;
  }

  .el-button:hover{
    border:none;
    color: white;
  }

</style>
<style lang="scss">

  .parent__form{
  .el-dialog__header{
    background-color: #2C3137;
    padding: 10px;
    margin: 1px;
  .el-dialog__title
  {
    color: white;
    font-size: 14px;
    font-weight: 400;
  }
  }
  .el-date-editor.el-input{
    width:100%;
  }
  .el-input{
  .el-input__inner{
    border: solid 1px #a2a3a5;
    border-radius: 2px;
    height: 30px;
    box-shadow: none;
  }
  }
  }
</style>
