<template>
  <div class="leaflet">
    <el-row>
      <el-col :span="2">
        <ul class="leaflet__toolbars" :class="{'leaflet__toolbars--fullscreen': isFullScreen}">
          <li @click="fullScreen"></li>
          <li @click="zoomin"></li>
          <li @click="zoomout"></li>
          <li @click="clickCircle" :class="{unclick: isDisabled}"></li>
          <li @click="clickMarker" :class="{unclick: isDisabled}"></li>
          <li @click="clickDeleteMarker(selectedTagId)" :class="{unclick: isDisabled}"></li>
          <li @click="doubleMap" :class="{doubleShow: doubleShow}"></li>
          <div class="leaflet__toolbars--prevNext">
            <el-button icon="arrow-left" size="small" @click="prevPaper" :disabled="paperPrevDisabled"></el-button>
            <el-button icon="arrow-right" size="small" @click="nextPaper" :disabled="paperNextDisabled"></el-button>
          </div>
        </ul>
      </el-col>
      <el-col :span="17">
        <div class="leaflet__body">
          <div class="leaflet__body__map" :class="{'leaflet__body__map--fullscreen': isFullScreen, 'leaflet__body__map--half': doubleShow }">
            <div id="leaflet" class="leaflet__body__map__body">
            </div>
            <el-select v-model="curversion" class="leaflet__body__map__version" @change="selectVersion(curversion)">
              <el-option v-for="item in versions" :key="item.value" :label="item.value" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="leaflet__body__map" :class="{'leaflet__body__map--fullscreen': isFullScreen, 'leaflet__body__map--half': doubleShow }" v-show="doubleShow">
            <div id="leaflet2" class="leaflet__body__map__body">
            </div>
            <el-select v-model="curversion" class="leaflet__body__map__version" @change="selectVersion(curversion)">
              <el-option v-for="item in versions" :key="item.value" :label="item.value" :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
      </el-col>
      <el-col :span="5">
        <div class="leaflet__results">
          <div class="leaflet__results__lists">
            <div class="leaflet__results__lists--title" :class="{disabled: isDisabled}">标注列表</div>
            <div class="leaflet__results__lists--menu">
              <ul v-if="htable.length > 0">
                <li v-for="item in htable" :key="item.tagId" @click="locateMarker(item.tagId)"><i></i><span>{{item.value}}</span><b/></li>
              </ul>
            </div>
          </div>
          <div class="leaflet__results--success" :class="{disabled: isDisabled}" v-show="htable.length == 0" @click="approve">审核通过</div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import L from 'leaflet'
  import {
    mapState,
    mapActions
  } from 'vuex'
  import {
    bus
  } from '@/assets/bus'
  import {
    post,
    axiosDelete,
    get,
    patch
  } from '@/assets/fetch'
  import ElButton from "../../node_modules/element-ui/packages/button/src/button";
  export default {
    components: {ElButton},
    props: ['latestVersion'],
    data() {
      return {
        subProjectId: null,
        selectedMarker: null,
        selectedTagId: null,
        markers: null,
        map: null,
        map2: null,
        baseLayers: null,
        overlays: null,
        markerIcon1: null,
        ifDrawM: false,
        ifDrawC: false,
        ifDrawL: false,
        htable: [],
        MARKERS: [],
        latlngs: [],
        prePolygon: null,
        isDisabled: false,
        paperImgs: [],
        paperImgIndex: 0,
        paperId: null,
        ctrlLayer: null,
        preImg: null,
        preImg2: null,
        doubleShow: false,
        isFullScreen: false,
        ID:"master",
        color:null,
        curversion: `版本V${this.latestVersion.toFixed(1)}`
      }
    },
    computed: {
      paperPrevDisabled() {
        if (this.paperImgIndex == 0) {
          return true
        } else {
          return false
        }
      },
      paperNextDisabled() {
        if (this.paperImgIndex == this.paperImgs.length) {
          return true
        } else {
          return false
        }
      },
      versions() {
        if (this.latestVersion > 1) {
          return Object.keys([...new Array(this.latestVersion)]).map(num => {
            return {
              value: '版本V' + (++num).toFixed(1)
            }
          })
        } else {
          return [{
            value: '版本V1.0'
          }]
        }
      },
      ...mapState({
        papers: state => {
          return state.leaflet.paperData
        },
        paperApproval: state => {
          return state.leaflet.paperApproval
        }
      })
    },
    watch: {
      papers: function(cur, prev) {
        if (cur.length > 0) {
          this.paperImgs = [];
          this.paperImgIndex = 0;
          cur.forEach(paper => {
            paper.papers.forEach(item => {
              this.paperImgs.push(item)
            })
          })
          this.imgChange(this.paperImgs[this.paperImgIndex].url, this.paperImgs[this.paperImgIndex].id);
          bus.$emit('isPaper', this.papers);
        }
      },
      paperApproval: function(cur,prev){
        if(cur){
          if(cur.progress === 'completed'){
            this.isDisabled = true
          }
        }else{
          this.isDisabled = false
        }
      }
    },
    methods: {
      ...mapActions([
        'getPapers',
        'getPaperApproval'
      ]),
      leaflet() {
        this.markers = L.layerGroup();
        this.map = L.map('leaflet', {
          crs: L.CRS.Simple,
          minZoom: -1,
          maxZoom: 5,
          layers: [this.markers],
          closePopupOnClick: false,
          zoomControl: false,
          doubleClickZoom: false,
          zoomAnimation:false,
        });
        this.map2 = L.map('leaflet2', {
          crs: L.CRS.Simple,
          minZoom: -1,
          maxZoom: 5,
          closePopupOnClick: false,
          zoomControl: false,
          doubleClickZoom: false,
          zoomAnimation:false,
        });
        this.overlays = {
          "显示标记": this.markers
        };
        this.ctrlLayer = L.control.layers(this.baseLayers, this.overlays).addTo(this.map);
        this.markerIcon1 = L.icon({
          iconUrl: 'static/img/leaflet/marker-icon.png',
          shadowUrl: 'static/img/leaflet/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        });
      },
      doubleMap() {
        this.map.off('click');
        this.doubleShow = !this.doubleShow;
        if (this.doubleShow) {
          let level = -1;
          let latlng;
          this.ctrlLayer.remove();
          this.map.setView([350, 1080], level);
          this.map2.setView([1050, -10], level);
          this.map.on('mousemove',(e)=>{
            latlng = e.latlng;
          });
          this.map.on('zoom',()=>{
            let latlng1 = this.map.getCenter();
            level = this.map.getZoom();
            this.map2.setView([latlng1.lat+700/Math.pow(2,level+1),latlng1.lng-1080/Math.pow(2,level+1)],level);
          })
          this.map.on('mousedown',()=>{
            this.map.on('mousemove',()=>{
              let latlng1 = this.map.getCenter();
              this.map2.setView([latlng1.lat+700/Math.pow(2,level+1),latlng1.lng-1080/Math.pow(2,level+1)],level);
            })
            this.map.on('mouseup',()=>{
              this.map.off('mousemove');
            })
          })
          this.map2.on('mousemove',(e)=>{
            latlng = e.latlng;
          });
          this.map2.on('zoom',()=>{
            let latlng1 = this.map2.getCenter();
            level = this.map2.getZoom();
            this.map.setView([latlng1.lat-700/Math.pow(2,level+1),latlng1.lng+1080/Math.pow(2,level+1)],level);
          })
          this.map2.on('mousedown',()=>{
            this.map2.on('mousemove',()=>{
              let latlng1 = this.map2.getCenter();
              this.map.setView([latlng1.lat-700/Math.pow(2,level+1),latlng1.lng+1080/Math.pow(2,level+1)],level);
            })
            this.map2.on('mouseup',()=>{
              this.map2.off('mousemove');
            })
          })
        }
        if (!this.doubleShow) {
          this.map.setView([350, 540], 0);
          this.ctrlLayer.addTo(this.map);
        }
      },
      clickMarker() {
        this.ifDrawM = !this.ifDrawM;
        this.ifDrawL = true;
        this.map.on('click', (e) => {
          if (this.ifDrawM == true) {
            bus.$emit('markPopVisible', true)
            this.markLatLng = e.latlng;
          }
        })
      },
      drawMark(value, latlng, tagId) {
        let popup = L.popup({
          maxHeight: 60,
          minWidth: 50,
          maxWidth: 200,
          keepInView: true,
        })
        popup.setContent(value);
        this.htable.push({
          value,
          tagId
        })
        let marker = L.marker(latlng, {
          draggable: true,
          icon: this.markerIcon1,
        }).addTo(this.markers);
        marker.tagId = tagId;
        this.selectedTagId = tagId;
        this.selectedMarker = marker;
        this.MARKERS.push(marker);
        marker.on('click', (e) => {
          this.selectedMarker = marker;
          this.selectedTagId = tagId;
        })
        marker.on('dragend', (e) => {
          this.selectedMarker = marker;
          this.selectedTagId = e.target.tagId;
          this.patchTag(this.selectedTagId, {
            "posX": e.target._latlng.lat,
            "posY": e.target._latlng.lng
          }, () => {
            this.deleteRawMarker(this.selectedMarker, this.selectedTagId)
            this.drawMark(value, e.target._latlng, this.selectedTagId)
          })
        })
        marker.bindPopup(popup);
        marker.on("mouseover", () => {
          marker.openPopup();
        });
      },
      patchTag(tagId, params, cb){
        patch(`api/coord/tag/${tagId}`, {
          data: params
        }).then(() => {
          if(cb && typeof cb === 'function'){
            cb()
          }
        })
      },
      postTags(params, cb) {
        post(`api/coord/sub/${this.subProjectId}/tag`, {
          data: params
        }).then(data => {
          if(cb && typeof cb === 'function'){
            cb(data.tagId)
          }
        })
      },
      getTag(paperId) {
        get(`api/coord/tag/byPaper/${paperId}`).then(data => {
          this.initTags(data.tags)
        })
      },
      clickCircle() {
        this.ifDrawC = !this.ifDrawC;
        this.ifDrawM = false;
        if(this.ID=="master")
            this.color="red"
        if(this.ID=="slave")
            this.color="blue"
        this.map.on('click', (e) => {
          if (this.ifDrawC == true) {
            this.$prompt("请输入半径：", {
              inputValue: 50
            }).then(radius => {

                this.postTags({
                  "paperId": this.paperId,
                  "posX": e.latlng.lat,
                  "posY": e.latlng.lng,
                  "text":this.color,
                  "radius": radius.value,
                  "type": "circle"
                }, (tagId) => {
                  this.drawCircle(radius.value, this.color, e.latlng, tagId);
                  this.ifDrawC = false;
                })

            }).catch(
              this.ifDrawC = false
            );
          }
        })
      },
      drawCircle(radius, color, latlng, tagId) {
        let circle = L.circle(latlng, parseInt(radius), {color:color}).addTo(this.markers);
        circle.radius = radius;
        circle.tagId = tagId;
        this.selectedMarker = circle;
        this.selectedTagId = tagId;
        this.MARKERS.push(circle);
        circle.on('click', () => {
          this.selectedMarker = circle;
          this.selectedTagId = tagId;
        })
        circle.on('mouseover', () => {
          this.map.on('keypress', () => {
            if (event.keyCode == 49) {
              this.patchTag(this.selectedTagId, {
                "radius": circle.getRadius() -3,
              }, () => {
                circle.setRadius(circle.getRadius() - 3);
                circle.redraw();
              })
            }
            if (event.keyCode == 50) {
              this.patchTag(this.selectedTagId, {
                "radius": circle.getRadius() +3,
              }, () => {
                circle.setRadius(circle.getRadius() +3);
                circle.redraw();
              })
            }
          })
          circle.on('mouseout', () => {
            this.map.off('keypress');
          })
        })
        circle.on('mousedown', () => {
          circle.on('mousemove', (e) => {
            circle.setLatLng(e.latlng);
            this.map.dragging.disable();
          });
          circle.once('mouseup', (e) => {
            circle.off('mousemove');
            this.map.dragging.enable();
            this.selectedMarker = circle;
            this.selectedTagId = tagId;
            this.patchTag(this.selectedTagId, {
              "posX": e.latlng.lat,
              "posY": e.latlng.lng
            }, () => {
              this.deleteRawMarker(this.selectedMarker, this.selectedTagId)
              this.drawCircle(circle.getRadius(), color, e.latlng, this.selectedTagId);
            })
          });
        })
      },
      clickDeleteMarker(tagId,cb) {
        this.map.off('click')
        axiosDelete(`api/coord/tag/${tagId}`).then(() => {
          this.deleteRawMarker(this.selectedMarker, tagId)
          if(cb && typeof cb === 'function'){
            cb()
          }
        })
      },
      locateMarker(tagId) {
        let marker = this.MARKERS.find(_ => _.tagId === tagId);
        this.map.setView(marker.getLatLng(), 0);
        this.selectedMarker = marker;
        this.selectedTagId = marker.tagId;
        marker.openPopup();
        if (marker.radius != 0) {
          marker.openPopup([marker.getLatLng().lat + marker.getRadius(), marker.getLatLng().lng]);
        }
      },
      deleteRawMarker(selectedMarker, tagId){
        selectedMarker.remove();
        this.markers.removeLayer(selectedMarker);
        let htIndex = this.htable.findIndex(_ => _.tagId === tagId);
        let markIndex = this.MARKERS.findIndex(_ => _.tagId === tagId);
        (htIndex > -1) && this.htable.splice(htIndex, 1);
        (markIndex > -1) && this.MARKERS.splice(markIndex, 1);
      },
      zoomin() {
        this.map.zoomIn();
      },
      zoomout() {
        this.map.zoomOut();
      },
      initTags(tags) {
        if (tags.length > 0) {
          this.initMark();
          tags.forEach(tag => {
            if (tag.type === 'point') {
              this.drawMark(tag.text, {
                lat: tag.posX,
                lng: tag.posY
              }, tag.id)
            } else if (tag.type === 'circle') {
              this.drawCircle(
                tag.radius,
                tag.text,{
                  lat: tag.posX,
                  lng: tag.posY
                },
                tag.id
              )
            }
          })
        } else {
          this.initMark();
        }
      },
      initMark() {
        this.htable = [];
        this.markers.clearLayers()
      },
      approve() {
        let parperId = this.paperImgs[this.paperImgIndex].id;
        post(`api/coord/paper/${parperId}/approval`, {
          data: {"progress": "completed"}
        }).then(data => {
          this.isDisabled = true;
        })
      },
      imgChange(url, paperId) {
        let bounds = [
          [0, 0],
          [700, 1080]
        ];
        if (this.preImg != null) {
          this.preImg.remove();
          this.preImg2.remove();
        }
        this.preImg = L.imageOverlay(url, bounds).addTo(this.map);
        this.preImg2 = L.imageOverlay(url, bounds).addTo(this.map2);
        this.paperId = paperId;
        this.getTag(paperId);
        if(!this.doubleShow)
          this.map.setView([350, 560], 0);
        if(this.doubleShow){
          this.map.setView([300, 1140], -1);
          this.map2.setView([1000,0], -1);
        }
        this.getPaperApproval(paperId)
      },
      prevPaper() {
        if (this.paperImgIndex == 0) {
          return
        }
        this.paperImgIndex--;
        this.imgChange(this.paperImgs[this.paperImgIndex].url, this.paperImgs[this.paperImgIndex].id);
      },
      nextPaper() {
        if (this.paperImgIndex == this.paperImgs.length) {
          return
        }
        this.paperImgIndex++;
        this.imgChange(this.paperImgs[this.paperImgIndex].url, this.paperImgs[this.paperImgIndex].id);
      },
      fullScreen() {
        this.map.off('click')
        this.isFullScreen = !this.isFullScreen
        this.doubleMap();
      },
      selectVersion(value) {
        this.getPapers({
          id: this.subProjectId,
          version: parseInt(value.slice(3))
        });
      },
      editNote(){
        //todo
      },
    },
    mounted() {
      this.subProjectId = this.$route.params.id;
      this.getPapers({
        id: this.subProjectId,
        version: this.latestVersion
      });
      this.leaflet();
      bus.$on('imgChange', data => {
        this.imgChange(data.url, data.id)
      });
      bus.$on('postMarkData', (data) => {
        if(!data.text) return
        this.postTags({
          "paperId": this.paperId,
          "posX": this.markLatLng.lat,
          "posY": this.markLatLng.lng,
          "text": data.text,
          "type": 'point',
          "priority": data.priority
        }, (tagId) => {
          bus.$emit('markPopVisible', false)
          this.drawMark(data.text, this.markLatLng, tagId)
          this.ifDrawM = false;
        })
      })
    },
    destroyed() {
      bus.$emit('isPaper');
    }
  }
</script>
<style lang="scss" scoped>
  @import "../styles/_mixin.scss";
  .leaflet {
    width: 100%;
    height: 700px;
  @include e ('toolbars') {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 700px;
  & > li {
        width: 36px;
        height: 36px;
        background-position: center center;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        cursor: pointer;
  &:nth-of-type(1) {
     background-image: url('../../static/img/leaflet/fullScreen01.svg');
     margin-bottom: 40px;
   }
  &:nth-of-type(2) {
     background-image: url('../../static/img/leaflet/zoomUp01.svg');
   }
  &:nth-of-type(3) {
     background-image: url('../../static/img/leaflet/zoomDown01.svg');
     margin-bottom: 40px;
   }
  &:nth-of-type(4) {
     background-image: url('../../static/img/leaflet/paint01.svg');
   }
  &:nth-of-type(4).unclick {
     background-image: url('../../static/img/leaflet/paint02.svg');
     pointer-events: none;
   }
  &:nth-of-type(5) {
     background-image: url('../../static/img/leaflet/location01.svg');
     margin-bottom: 40px;
   }
  &:nth-of-type(5).unclick {
     background-image: url('../../static/img/leaflet/location02.svg');
     margin-bottom: 40px;
     pointer-events: none;
   }
  &:nth-of-type(6) {
     background-image: url('../../static/img/leaflet/delete01.svg');
     margin-bottom: 40px;
   }
  &:nth-of-type(6).unclick {
     background-image: url('../../static/img/leaflet/delete02.svg');
     margin-bottom: 45px;
     pointer-events: none;
   }
  &:nth-of-type(7) {
     background-image: url('../../static/img/leaflet/contrast01.svg');
   }
  &:nth-of-type(7).doubleShow {
     background-image: url('../../static/img/leaflet/soloNor.svg');
   }
  }
  @include e ('paperlists') {
    position: absolute;
    z-index: 1001;
    bottom: 50px;
    @include e ('title') {
      width: 66px;
      height: 60px;
      background: url('../../static/img/leaflet/menuBg.svg') no-repeat center center;
      background-size: 100% 100%;
      color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: 600;
      font-size: 15px;
      cursor: pointer;
    };
    ul {
      position: absolute;
      width: 128px;
      background-color: $font_list_color;
      color: #fff;
    li {
      width: 100%;
      height: 34px;
      text-align: center;
      font-size: 14px;
      line-height: 34px;
      border-bottom: 1px solid #666;
      cursor: pointer;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      &:last-child {
         border-bottom: none;
       }
      &:hover {
         background-color: $bg_hover_color;
       }
     }
  }
  @include e ('firstList') {
    left: 105%;
    bottom: 9px;
  };
  @include e ('secList') {
    left: 105%;
    top: 0;
  };
  };
  @include m ('prevNext') {
    position: absolute;
    bottom: 0;
    width: 90%;
    display: flex;
    flex-direction: row;
  };
  @include m ('fullscreen') {
    position: fixed;
    width: 5%;
    height: 100%;
    left: 0;
    top: 0;
    background: rgb(211,211,211);
  };
  };
  @include e ('results') {
    padding-left: 20px;
    height: 700px;
    @include e ('lists') {
      @include m ('title') {
        height: 52px;
        line-height: 52px;
        text-align: center;
        background-color: #2C3137;
        color: #fff;
        font-size: 18px;
        font-weight: bold;
      };
      @include m ('menu') {
        ul {
          border: 1px solid #ccc;
          width: 100%;
          max-height:600px;
          overflow-y:auto;
          height: 100%;
        li {
          line-height: 1.2rem;
          padding: 10px 0;
          text-align: left;
          font-size: 14px;
          border-bottom: 1px solid #ccc;
          background-color: #F1F1F0;
          cursor: pointer;
          color: $font_list_color;
          display: flex;
          flex-direction: row;
          align-items: center;
      &:last-child {
         border-bottom: none;
       }
      &:hover {
         background-color: #D4E7F1;
       }
        i {
          display: block;
          width: 50px;
          height: 30px;
          margin-left: 10px;
          background-repeat: no-repeat;
          background-position: center center;
          background-size: 80% 80%;
          background-image: url('../../static/img/leaflet/p1.svg');
        }
        b {
          display: block;
          width: 15px;
          height: 15px;
          background: url('../../static/img/leaflet/edit.svg') no-repeat center center;
          background-size: auto;
          margin-right: 15px;
        }
        span {
          display: flex;
          flex: 1;
        }
      }
    }
  }
  };
  @include m ('success') {
    height: 52px;
    line-height: 52px;
    text-align: center;
    background-color: #3D7DB0;
    color: #fff;
    font-size: 18px;
    font-weight: bold;
    margin-top: 8px;
    cursor: pointer;
  };
  };
  @include e('body'){
    height: 700px;
    display: flex;
    justify-content: space-between;
    @include e ('map') {
      position: relative;
      width: 100%;
      height: 100%;
      @include m('half'){
        width: 49.8%;
      };
      @include e('body'){
        width: 100%;
        height: 100%;
      };
      @include m ('fullscreen') {
        position: fixed !important;
        width: 95%;
        height: 100%;
        left: 5%;
        top: 0;
        background: #ddd;
      };
      @include e ('version') {
        position: absolute;
        right: 0;
        bottom: 0;
        z-index: 1001;
        width: 110px;
      };
    };
  };
  }
  .disabled {
    background-color: #ABADAF;
    pointer-events: none;
  }
</style>
<style lang="scss">
  @import "../styles/_mixin.scss";
  .el-message-box{
  .el-message-box__header {
    background-color: black;
    padding: 10px;
    margin: 1px;
  .el-message-box__title {
    color: white;
    padding-top: 2px;
    font-size: 14px;
    font-weight: 400;
  }
  .el-message-box__headerbtn {
    top: 12px;
  }
  }
  .el-message-box__content {
    padding: 10px 20px;
  .el-message-box__input {
    padding-top: 10px;
  .el-input input {
    border: solid 1px #a2a3a5;
    border-radius: 2px;
    height: 30px;
    box-shadow: none;
  }
  }
  }
  .el-message-box__btns {
    text-align: center;
  button {
    background-color: $bg_hover_color;
    border-radius: 2px;
    color: white;
    font-weight: bold;
    height: 30px;
    line-height: 10px;
    width: 80px;
    margin-bottom: 10px;
  }
  button:hover {
    border: solid 1px white;
    color: white;
    background-color: $bg_hover_color;
  }
  }
  }
  .leaflet-popup-content {
    font-size: 18px;
  }
</style>
