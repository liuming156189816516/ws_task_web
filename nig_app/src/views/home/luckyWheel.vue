
<template>
  <div class="earn w_f">
    <div class="custom_head w_f">
      <page-header :title="$t('home_124')" :show-icon="true" :bgColor="true" />
      <div class="lucky_bg w_f">
        <div class="lucky_rule flex-item flex-align flex-center font_32" @click="showRule">{{$t('home_117')}}</div>
        <div class="bg_01 w_f">
          <img class="img_01 w_f" src="../../assets/images/lucky/bg_01.png" alt="">
          <div class="lucky_bg2 w_f">
            <img class="img_02 w_f" src="../../assets/images/lucky/bg_02.png" alt="">
          </div>
          <div class="lucky_bg3 w_f">
            <img class="img_03 w_f" src="../../assets/images/lucky/bg_03.png" alt="">
            <div class="lucky_main w_f">
              <LuckyWheel
                class="custom_lucky"
                ref="myLucky"
                width="247px"
                height="247px"
                :prizes="prizes"
                :buttons="buttons"
                @start="startLucky"
                @end="luckyEnd"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="lucky_desc flex-item flex-align flex-center flex-dir-c font_28" v-if="winGold">
        <div class="win_text w_f flex-item flex-center flex-dir-c">
          <template v-if="winGold=='lucky'">
            <div class="content_service flex-item flex-align">
              <img src="@/assets/images/win_icon.png">
              <div class="serve_text flex-item">
                <span class="flex-item">{{$t('other_077')}}
                  <span class="serveic_line flex-item" @click="$Helper.globalSupport()">{{$t('serv_005')}}</span>
                </span>
              </div>
            </div>
            <div class="lucky_code w_f flex-item" v-if="lucky_id">
              <!-- {{$t('home_140')}} -->
              <span class="w_f flex-item flex-align flex-between">
                <span>{{lucky_id}}</span>
                <span class="copay_code flex-item flex-align flex-center" v-clipboard:copy="lucky_id" v-clipboard:success="copySuccess">{{$t('other_006')}}</span>
              </span>
            </div>
          </template>
          <template v-else>
            <div class="content_service flex-item flex-align">
              <img src="@/assets/images/win_icon2.png">
              {{$t('other_075',{value:winGold})}}
            </div>
          </template>
        </div>
      </div>
      <div class="award_record w_f">
        <h4 class="font_26 mb_24">{{$t('other_090')}}</h4>
        <!-- <div class="record_list w_f">
          <van-swipe class="my_swipe" style="height: 34px;" :autoplay="3000" :duration="1000" vertical :show-indicators="false">
            <van-swipe-item class="flex-item flex-align flex-center" v-for="(item,idx) in winNotis" :key="idx" style="height: 34px;width:100%;">
              <span class="award_item flex-item flex-align font_24">{{item.name}}</span>
              <span class="flex-item flex-center font_24">{{item.desc}}</span>
              <span class="aeard_icon flex-item flex-content-r font_24">
                <img src="@/assets/images/gold_icon.png" alt="" srcset="">
                {{item.goldNum}}
              </span>
            </van-swipe-item>
          </van-swipe>
        </div> -->
      </div>
      <div class="record_list w_f flex-item flex-dir-c">
        <div class="title_top task_title_head w_f flex-item flex-align flex-between font_24">
            <span class="flex-item flex-align">{{$t('tail_004')}}</span>
            <span class="flex-item flex-center">{{$t('spre_012')}}</span>
            <span class="flex-item">{{$t('home_022')}}</span>
        </div>
        <template v-if="luckyList&&luckyList.length>0">
            <div class="record_scroll w_f flex-item flex-dir-c">
                <!-- <van-list v-model="loading" :finished="finished" :loading-text="$t('other_029')" :finished-text="$t('other_063')" offset="60" @load="onLoad"> -->
                <div class="title_top record_item w_f flex-item flex-align flex-between font_24" v-for="(item,idx) in luckyList" :key="idx">
                    <span class="flex-item">{{ formatTime(item.itime) }}</span>
                    <span class="flex-item">{{prizes[item.type-1].fonts[0].text}}</span>
                    <span class="flex-item record_click" @click="showResult(item)">{{$t('home_135')}}</span>
                </div>
                <!-- </van-list> -->
            </div>
        </template>
        <template v-else>
            <div class="empty_box w_f flex-item flex-align flex-center flex-dir-c">
              <img src="@/assets/images/empty_icon.png" alt="" srcset="">
              <p class="font_28">{{$t('spre_013')}}</p>
            </div>
        </template>
        <div class="title_top footer_tips w_f flex-item font_24">
            {{$t('other_092')}}
        </div>
    </div>
    </div>
  </div>
</template>
<script>

import { mapState } from 'vuex';
import { formatTime } from "@/utils/tool";
import PageHeader from "@/components/Header";
import { getruletainfo,doblarruleta,getlotteryrecordlist } from '@/api/home'
export default {
  name: "luckyWheel",
  components: { PageHeader },
  data() {
    return {
      winGold:null,
      index: null,
      isLucky:true,
      showWin:false,
      lucky_id:"",
      luckyList:[],
      blocks: [
        {
          // padding: "40px", //可旋转区域与转盘边缘的距离
          background: "#eee", //转盘背景色
          imgs: [
            {
              // src:require('@/assets/images/lucky_btn.png'),   //图片url
              top: "0", //图片距顶部距离
              width: "400px", //图片宽
              height: "400px", //图片高
            }
          ]
        }
      ],
      // 扇形数组
      prizes: [
        {type:1, fonts: [{ text:this.$t('pay_034',{value:10}), top: "60%",fontSize: "12px",fontColor: "#fff"}],background: "#76C5F0",imgs:[{src:require("../../assets/images/more_icon.png"),top: "10%",width:"32px",height:"32px"}]},
        {type:2, fonts: [{ text:this.$t('pay_034',{value:20}), top:"60%",fontSize: "12px",fontColor: "#fff"}],background: "#E3556B",imgs:[{src:require("../../assets/images/more_icon.png"),top: "10%",width:"32px",height:"32px"}]},
        {type:3, fonts: [{ text:this.$t('other_087'),top:"60%",fontSize: "12px",fontColor: "#fff"}],background: "#009241",imgs:[{src:require("../../assets/images/win_icon.png"),top: "10%",width:"32px",height:"32px"}]},
        {type:4, fonts: [{ text:this.$t('pay_034',{value:200}), top: "60%",fontSize: "12px",fontColor: "#fff"}],background: "#DD167B",imgs:[{src:require("../../assets/images/more_icon.png"),top: "10%",width:"32px",height:"32px"}]},
        {type:5, fonts: [{ text:this.$t('pay_034',{value:888}), top: '60%',fontSize: "12px",fontColor: "#fff"}],background: '#F8C301',imgs:[{src:require("../../assets/images/more_icon.png"),top: "10%",width:"32px",height:"32px"}]},
        {type:6, fonts: [{ text:this.$t('pay_034',{value:1888}), top: '60%',fontSize: "12px",fontColor: "#fff"}],background: '#E77841',imgs:[{src:require("../../assets/images/more_icon.png"),top: "10%",width:"32px",height:"32px"}]},
      ],
      buttons: [
        {
          radius: "35%",
          // background: '#333',
          pointer: true,
          fonts: [
            {
              text: "", //文字
              // top: '-15%',          //文字距顶部距离
              fontColor: "#f00", //文字颜色
              fontSize: "16px", //文字大小
              fontStyle: "微软雅黑", //字体
              fontWeight: "500", //加粗
              lineHeight: "16px", //行高
            }
          ],
          //抽奖按钮图
          imgs: [
            {
              src: require("@/assets/images/lucky_btn.png"), //图片url
              top: "-110%", //图片距顶部距离
              width: "60px", //图片宽
              height: "80px", //图片高
            }
          ]
        }
      ]
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.User
    }),
    winNotis(){
      return this.$Helper.randomStrings(200,1)
    }
  },
  created() {
    this.luckyRecord();
    this.initLucky();
  },
  methods: {
    luckyRecord(){
      getlotteryrecordlist().then(res=>{
        this.luckyList = res.list||[];
      })
    },
    onLoad(){
      if(this.page >= this.page_total){
        this.finished = true;
      }else{
        this.page++;
        this.luckyRecord()
      }
    },
    initLucky(){
      getruletainfo().then(res=>{
        this.task_type = res.msg_type;
        this.isLucky = res.flag||false;
        this.lucky_id = res.lucky_id||"";
        if(res.type){
          const luckyNum = res.type-1;
          let goldNum = parseFloat(this.prizes[luckyNum].fonts[0].text);
          this.winGold = goldNum?goldNum:"lucky";
        }
      })
    },
    async startLucky() {
      if(!this.isLucky&&this.task_type==1){
        return this.$toast(this.$t('other_076'))
      }
      if(!this.isLucky&&this.task_type==2){
        return this.$toast(this.$t('other_091'))
      }
      this.isLucky = false;
      this.$refs.myLucky.play();
      const result = await doblarruleta();
      if(result.type){
        const luckyNum = result.type-1;
        this.lucky_id = result.lucky_id||"";
        this.$refs.myLucky.stop(luckyNum);
      }else{
        this.isLucky = true;
        this.$refs.myLucky.stop(null);
      }
    },
    showRule(){
      this.$popDialog({content:"",title:this.$t('other_078'),type:5})
    },
    luckyEnd(prize) {
      let goldNum = parseFloat(prize.fonts[0].text);
      this.winGold = goldNum?goldNum:"lucky";
      this.isLucky = true;
      this.luckyRecord();
    },
    copySuccess() {
      this.$toast(`${this.$t("other_044")}`);
    },
    formatTime(time) {
      return formatTime(time);
    },
    showResult(row){
      this.$popDialog({ content:row.Reason,number:row.id,title:this.$t('home_143'), type: 9 })
    }
  }
};
</script>
<style lang="scss" scoped>
.earn {
  width: 100%;
  padding-bottom: 40px;
  background: $color-minebg;
  -webkit-overflow-scrolling: touch;
  .lucky_bg{
    position: relative;
    .lucky_rule{
      width: 120px;
      padding: 10px 0;
      position: absolute;
      top: 0;
      right: 30px;
      z-index: 3;
      border-radius: 10px;
      color: $font-color-white;
      background: rgba($color: $home-month-value, $alpha: .7);
    }
    .bg_01{
      height: 700px;
      position: relative;
      // background: rgba($color: red, $alpha: .5);
      .img_01{
        position: absolute;
        top: -30px;
        left: 0;
      }
      .lucky_bg2{
        position: absolute;
        top: 0;
        left: 0;
        padding: 20px 60px;
        box-sizing: border-box;
        background: transparent;
      }
      .lucky_bg3{
        padding: 20px 60px;
        box-sizing: border-box;
        position: absolute;
        top: 0;
        left: 0;
        .lucky_main{
          width: 594px;
          height: 594px;
          position: absolute;
          top: 40px;
          left: 50%;
          transform: translateX(-50%);
          // background: rgba($color: #000000, $alpha: .5);
          .custom_lucky{
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
          }
        }
      }
    }
  }
  .lucky_desc{
    // p{
    //   margin-top: 10px;
    // }
    .win_text{
      padding: 20px 0;
      color: $home-order-title;
      .content_service{
        width:100%;
        padding:0 20px;
        box-sizing: border-box;
        span{
          display: inline-block;
        }
        .serve_text{
          flex-wrap: wrap;
        }
        .serveic_line{
          color: $color-theme;
          text-decoration: underline;
        }
      }
      .lucky_code{
        padding: 0 30px;
        box-sizing: border-box;
        color: $font-color-black;
        .copay_code {
          width: initial;
          flex-shrink: 0;
          padding: 0 18px;
          padding-top: 3px;
          margin-top: 10px;
          margin: 10px;
          line-height: initial;
          color: $font-color-white;
          background: $color-theme;
        }
      }
      img{
        height: 48px;
        margin-right: 10px;
      }
    }
  }
  .award_record{
    padding: 0 20px;
    box-sizing: border-box;
  }
  .record_list{
      // max-height: 300px;
      // overflow-y: auto;
      padding: 0 20px;
      margin-top: 20px;
      padding-bottom: 30px;
      box-sizing: border-box;
      color: $font-color-black;
      .task_title_head{
          font-weight: bold;
          color: $home-title-12;
      }
      .record_scroll{
          max-height: 1100px;
          overflow-y: auto;
          background: $font-color-white;
      }
      .title_top{
          height: 100px;
          padding: 0 40px;
          flex-shrink: 0;
          box-sizing: border-box;
          background: $home-title-10;
          span{
            flex: 1;
          }
      }
      .task_title_head {
        border-top-left-radius: 20px;
        border-top-right-radius: 20px;
      }
      // .title_top:nth-child(1){
      //     border-top-left-radius: 20px;
      //     border-top-right-radius: 20px;
      // }
      span:nth-child(2){
        // flex-grow: 0.8;
        justify-content: center;
      }
      span:nth-child(3){
        flex-grow: 0.8;
        justify-content: flex-end !important;
      }
      .record_item{
          height: 108px;
          background: $font-color-white;
          border-bottom: 1px solid $home-title-10;
      }
      .record_item:last-child{
          border-bottom: 1px solid transparent;
      }
      .record_click{
          color: $home-copay-title;
          text-decoration: underline;
      }
      .empty_box{
          padding: 0 30px;
          height: 364px;
          box-sizing: border-box;
          color: $home-title-14;
          background-color: $font-color-white;
          img{
              height: 202px;
          }
      }
      .footer_tips{
          height: auto;
          font-style: italic;
          padding: 16px 20px;
          color: $home-title-06;
          border-bottom-left-radius: 20px;
          border-bottom-right-radius: 20px;
      }
  }
}
</style>