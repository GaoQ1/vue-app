<template>
  <el-dialog :visible.sync="visible" title="新建子项目" top="1%"  class="parent__form">
    <el-form :model="formChild" :rules="rules" ref="formChild">
      <el-row>
        <el-col :span="12">
          <el-form-item label="项目名称" prop="title" :label-width="formLabelWidth">
            {{formChild.title}}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="所在区域" prop="region" :label-width="formLabelWidth">
            <el-input v-model="formChild.region"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="批次时段" prop="batchPeriod" :label-width="formLabelWidth">
            <el-input v-model="formChild.batchPeriod"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="工程名称" prop="name" :label-width="formLabelWidth">
        <el-input v-model="formChild.name"></el-input>
        <el-col class="remarks">(图纸封面名称)</el-col>
      </el-form-item>

      <el-row>
        <el-col :span="12">
          <el-form-item label="装修标准" prop="standard" :label-width="formLabelWidth">
            <el-input v-model="formChild.standard"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="下发日期" prop="dispatchDate" :label-width="formLabelWidth">
            <el-date-picker v-model="formChild.dispatchDate" type="date" placeholder="选择日期"></el-date-picker>
            <el-col class="remarks">（计划时间）</el-col>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="提交时间" prop="submitDate" :label-width="formLabelWidth">
            <el-date-picker v-model="formChild.submitDate" type="date" placeholder="选择日期"></el-date-picker>
            <el-col class="remarks">（外委时间）</el-col>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="设计面积"  prop="designArea" :label-width="formLabelWidth">
            <el-input v-model="formChild.designArea"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="项目负责人" prop="owner" :label-width="formLabelWidth">
            <el-input v-model="formChild.owner"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="初稿时间" prop="draftDispatchDate" :label-width="formLabelWidth">
            <el-date-picker v-model="formChild.draftDispatchDate" type="date" placeholder="选择日期"></el-date-picker>
            <el-col class="remarks">（阶段性下发说明）</el-col>

          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="出图类型" prop="cadType" :label-width="formLabelWidth">
            <el-input v-model="formChild.cadType"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="出图依据" prop="cadBasis" :label-width="formLabelWidth">
            <el-input v-model="formChild.cadBasis"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="18">
          <el-form-item label="图纸封面备注" prop="coverAccording" :label-width="formLabelWidth">
            <el-input v-model="formChild.paperCoverComment"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="出图单元" prop="pictureUnit" :label-width="formLabelWidth">
            <el-input v-model="formChild.cadUnit"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="6">
          <el-form-item label="地面装修层厚度" prop="floorDecoThickness" :label-width="formLabelWidth">
            <el-select v-model="formChild.floorDecoThickness">
              <el-option v-for="item in formChild.floorDecoThicknesses" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="大堂天花保温厚度" prop="ceilingHeatThickness" :label-width="formLabelWidth">
            <el-select v-model="formChild.ceilingHeatThickness">
              <el-option v-for="item in formChild.ceilingHeatThicknesses" :key="item.value" :label="item.value" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="有无沉箱" prop="hasCaisson" :label-width="formLabelWidth">
            <el-select v-model="formChild.hasCaisson">
              <el-option v-for="item in formChild.hasCaissons" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="有无喷淋" prop="hasSpray" :label-width="formLabelWidth">
            <el-select v-model="formChild.hasSpray">
              <el-option v-for="item in formChild.hasSprays" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="6">
          <el-form-item label="大堂是否防寒门" prop="coldDoor" :label-width="formLabelWidth">
            <el-select v-model="formChild.coldDoor">
              <el-option v-for="item in formChild.coldDoors" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="是否认定海边项目" prop="seasideProject" :label-width="formLabelWidth">
            <el-select v-model="formChild.seasideProject">
              <el-option v-for="item in formChild.seasideProjects" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="有无新风" prop="hasFreshAir" :label-width="formLabelWidth">
            <el-select v-model="formChild.hasFreshAir">
              <el-option v-for="item in formChild.hasFreshAirs" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="有无鞋柜" prop="hasShoeCabinet" :label-width="formLabelWidth">
            <el-select v-model="formChild.hasShoeCabinet">
              <el-option v-for="item in formChild.hasShoeCabinets" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="6">
          <el-form-item label="洋房内、外开窗" prop="insideOrOutSideDoor" :label-width="formLabelWidth">
            <el-select v-model="formChild.insideOrOutSideDoor">
              <el-option v-for="item in formChild.insideOrOutSideDoors" :key="item.value" :label="item.value" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="公区是否新防火门" prop="fireDoor" :label-width="formLabelWidth">
            <el-select v-model="formChild.fireDoor">
              <el-option v-for="item in formChild.fireDoors" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="有无小夜灯" prop="hasNightLight" :label-width="formLabelWidth">
            <el-select v-model="formChild.hasNightLight">
              <el-option v-for="item in formChild.hasNightLights" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="是否LED灯" prop="hasLEDLight" :label-width="formLabelWidth">
            <el-select v-model="formChild.hasLEDLight">
              <el-option v-for="item in formChild.hasLEDLights" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="6">
          <el-form-item label="有无入户挂钩" prop="hasDoorHook" :label-width="formLabelWidth">
            <el-select v-model="formChild.hasDoorHook">
              <el-option v-for="item in formChild.hasDoorHooks" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="有无厨房置物架" prop="hasKitchenRack" :label-width="formLabelWidth">
            <el-select v-model="formChild.hasKitchenRack">
              <el-option v-for="item in formChild.hasKitchenRacks" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="暖风机/排气扇" prop="warmAirBlowerOrAirVentilator" :label-width="formLabelWidth">
            <el-select v-model="formChild.warmAirBlowerOrAirVentilator">
              <el-option v-for="item in formChild.warmAirBlowerOrAirVentilators" :key="item.value" :label="item.value" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="阳台是否封闭" prop="balconySeal" :label-width="formLabelWidth">
            <el-select v-model="formChild.balconySeal">
              <el-option v-for="item in formChild.balconySeals" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="6">
          <el-form-item label="有无淋浴挂钩" prop="hasShowerHook" :label-width="formLabelWidth">
            <el-select v-model="formChild.hasShowerHook">
              <el-option v-for="item in formChild.hasShowerHooks" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="有无淋浴置物架" prop="hasShowerRack" :label-width="formLabelWidth">
            <el-select v-model="formChild.hasShowerRack">
              <el-option v-for="item in formChild.hasShowerRacks" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="是否有工人房" prop="hasWorkerRoom" :label-width="formLabelWidth">
            <el-select v-model="formChild.hasWorkerRoom">
              <el-option v-for="item in formChild.hasWorkerRooms" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="是否临时样板房" prop="hasSampleRoom" :label-width="formLabelWidth">
            <el-select v-model="formChild.hasSampleRoom">
              <el-option v-for="item in formChild.hasSampleRooms" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="20">
          <el-form-item label="图纸备注" prop="pictureRemark" :label-width="formLabelWidth">
            <el-input v-model="formChild.paperComment"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-col class="attention">（注意事项）</el-col>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="20">
          <el-form-item label="时间原因" prop="timeReason" :label-width="formLabelWidth">
            <el-input v-model="formChild.timeoutReason"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-col class="attention">（下发日期小于15天）</el-col>
        </el-col>
      </el-row>

      <el-row>
        <el-col>
          <div class="confirm__btn">
            <el-button @click="createNewSubProj('formChild')">确 定</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>
  </el-dialog>
</template>

<script>
import { mapActions } from 'vuex'
import { post, put } from '@/assets/fetch'

export default {
  data() {
    return {
      formLabelWidth: '130px',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      rules: {
        title: [
          { required: true, message: '此处为必填项', trigger: 'blur' }
        ],
        region: [
          { required: true, message: '此处为必填项', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '此处为必填项', trigger: 'blur' }
        ],
        standard: [
          { required: true, message: '此处为必填项', trigger: 'blur' }
        ],
        batchPeriod: [
          { required: true, message: '此处为必填项', trigger: 'blur' }
        ],
        dispatchDate:[
          { required: true, message: '此处为必填项', trigger: 'blur' }
        ],
        submitDate:[
          { required: true, message: '此处为必填项', trigger: 'blur' }
        ],
        draftDispatchDate:[
          { required: true, message: '此处为必填项', trigger: 'blur' }
        ],
        designArea: [
          { required: true, message: '此处为必填项', trigger: 'blur' },
        ],
        owner: [
          { required: true, message: '此处为必填项', trigger: 'blur' }
        ],
        cadType: [
          { required: true, message: '此处为必填项', trigger: 'blur' }
        ],
        cadBasis: [
          { required: true, message: '此处为必填项', trigger: 'blur' }
        ]
      }
    };
  },
  props: ['formChild', 'dialogFormVisible', 'isEdit'],
  computed: {
    visible: {
      get: function() {
        return this.dialogFormVisible
      },
      set: function(v) {
        this.$emit('update:dialogFormVisible', v)
      }
    }
  },
  methods: {
    ...mapActions([
      'getProjects',
      'getSubProjects'
    ]),
    createNewSubProj(formName) {
        var self = this;
      let copyData = Object.assign({}, this.formChild);
      copyData.dispatchDate = +new Date(copyData.dispatchDate);
      copyData.draftDispatchDate = +new Date(copyData.draftDispatchDate);
      copyData.submitDate = +new Date(copyData.submitDate);

      self.$refs[formName].validate((valid) => {
        if (valid) {
          if(!self.isEdit){
            post(`api/coord/project/${this.formChild.id}/sub`,{data: copyData}).then(subdata => {
              self.visible = false;
              self.getProjects(this.formChild.id);
            })
          }
          else{
            put(`api/coord/project/sub/${copyData.id}`,{data: copyData}).then(projdata => {
              self.visible = false;
              self.getSubProjects(copyData.id);
            });
          }
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../styles/_mixin.scss";

  .remarks{
    color: #a2a3a5;
    font-size: 12px;
    margin-bottom: -22px;
    margin-top: -10px;
  }
  .attention{
    color: #a2a3a5;
    font-size: 12px;
    line-height: 2rem;
  }

  .confirm__btn {
    text-align: center;
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
