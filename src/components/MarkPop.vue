<template>
  <div class="markpop">
    <el-dialog :visible.sync="visible">
      <el-form :model="formMark">
        <el-form-item :label-width="formLabelWidth" class="markpop__container">
          <i class="icon__position--grey"></i>
          <el-input type="textarea" :rows="5" placeholder="标注说明" v-model="formMark.text"></el-input>
        </el-form-item>
        <el-radio-group class="evaluate__container" v-model="formMark.priority">
          <i class="icon__position--red"></i>
          <el-radio class="radio" :label="1">非常紧急</el-radio>
          <i class="icon__position--orange"></i>
          <el-radio class="radio" :label="2">紧急</el-radio>
          <i class="icon__position--yellow"></i>
          <el-radio class="radio" :label="3">一般</el-radio>
        </el-radio-group>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="postMark">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { post } from '@/assets/fetch'
  import { bus } from '@/assets/bus'
  export default{
    props: ['formMark', 'dialogFormVisible'],
    data(){
      return{
        formLabelWidth: '120px'
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
      handleMarkData(label){
        switch (label) {
          case 1:
            return 'urgent'
            break;
          case 2:
            return 'important'
            break;
          case 3:
            return 'normal'
            break;
        }
      },
      postMark(){
        this.formMark.priority = this.handleMarkData(this.formMark.priority);
        bus.$emit('postMarkData', this.formMark)
      }
    }
  };
</script>

<style lang="scss" scoped>
@import "../styles/_mixin.scss";

  .icon__position--grey{
    display: inline-block;
    width: 80px;
    height: 80px;
    margin-top: 20px;
    margin-left: 20px;
    background-repeat: no-repeat;
    background-image: url('../../static/img/editproject/position-grey.svg');
  }

.icon__position--red{
  display: inline-block;
  width: 30px;
  height: 30px;
  background-repeat: no-repeat;
  background-image: url('../../static/img/editproject/position-red.svg');
  background-position: 100%;
}

.icon__position--orange{
  display: inline-block;
  width: 30px;
  height: 30px;
  background: url('../../static/img/editproject/position-orange.svg') no-repeat 100%;
}

.icon__position--yellow{
  display: inline-block;
  width: 30px;
  height: 30px;
  background-repeat: no-repeat;
  background-image: url('../../static/img/editproject/position-yellow.svg');
  background-position: 100%;

}
.markpop__container {
  .el-input {
    width: 80%;;
  }
}

.evaluate__container{
  text-align:center;
  width: 100%;
  .el-radio{
    margin-right: 40px;
  }
}
.dialog-footer{
  text-align: center;
  padding: 0;
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
}
</style>

<style lang="scss">
  .markpop__container{
    .el-form-item__content{
      display: flex;
      margin: 0 !important;
    }
    .el-textarea__inner{
      width: 90%;
      border-radius: 0;
      border:solid 1px grey;
      margin-left: 10px;
    }
  }

</style>
