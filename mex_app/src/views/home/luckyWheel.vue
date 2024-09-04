<style lang="scss" scoped>
.earn {
  width: 100%;
  padding-bottom: 40px;
  -webkit-overflow-scrolling: touch;
  background: linear-gradient(180deg, #31acf2 1.61%, rgba(255, 255, 255, 0.5) 100%);
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
      img{
        height: 48px;
        margin-right: 10px;
      }
    }
  }
  .award_record{
    padding: 0 20px;
    box-sizing: border-box;
    .record_list{
      height: 470px;
      overflow: hidden;
      border-radius: 20px;
      .my_swipe{
        height: 64px;
        overflow: initial;
        .award_item{
          height: 100%;
        }
        .aeard_icon{
          color: $color-theme;
          img{
            height: 32px;
            margin-right: 5px;
          }
        }
        .van-swipe-item{
          padding: 0 20px;
          box-sizing: border-box;
          span{
            flex: 1;
          }
          background: #e4eaf2;
        }
        .van-swipe-item:nth-child(even){
          background: #ecf0f6;
        }
      }
    }
  }
}
</style>
<template>
  <div class="earn">
    <div class="custom_head">
      <page-header :title="$t('home_124')" :show-icon="true" :bgColor="true" />
      <div class="lucky_bg w_f">
        <div class="lucky_rule flex-item flex-align flex-center font_32" @click="showRule">{{$t('home_117')}}</div>
        <div class="bg_01">
          <img class="img_01" src="../../assets/images/lucky/bg_01.png" alt="">
          <div class="lucky_bg2">
            <img class="img_02" src="../../assets/images/lucky/bg_02.png" alt="">
          </div>
          <div class="lucky_bg3 w_f">
            <img class="img_03" src="../../assets/images/lucky/bg_03.png" alt="">
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
      <div class="lucky_desc flex-item flex-align flex-center flex-dir-c font_28">
        <div class="win_text flex-item flex-align flex-center" v-if="winGold">
          <template v-if="winGold=='lucky'">
            <div class="content_service flex-item flex-align">
              <img src="../../assets/images/win_icon.png">
              <div class="serve_text flex-item" @click="$Helper.globalSupport()">
                <span class="flex-item">{{$t('other_077')}}<span class="serveic_line flex-item">{{$t('serv_005')}}</span></span>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="content_service flex-item flex-align">
              <img src="../../assets/images/win_icon2.png">
              {{$t('other_075',{value:winGold})}}
            </div>
          </template>
        </div>
      </div>
      <div class="award_record w_f">
        <h4 class="font_26 mb_24">{{$t('other_073')}}</h4>
        <div class="record_list w_f">
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
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import { mapState } from 'vuex';
import PageHeader from "@/components/Header";
import { getruletainfo,doblarruleta } from '@/api/home'
export default {
  name: "luckyWheel",
  components: { PageHeader },
  data() {
    return {
      winGold:null,
      index: null,
      isLucky:true,
      showWin:false,
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
        { fonts: [{ text:this.$t('pay_034',{value:50}), top: "60%",fontSize: "12px",fontColor: "#fff"}],background: "#76C5F0",imgs:[{src:require("../../assets/images/more_icon.png"),top: "10%",width:"32px",height:"32px"}]},
        { fonts: [{ text:this.$t('pay_034',{value:200}), top:"60%",fontSize: "12px",fontColor: "#fff"}],background: "#E3556B",imgs:[{src:require("../../assets/images/more_icon.png"),top: "10%",width:"32px",height:"32px"}]},
        { fonts: [{ text:this.$t('other_087'),top:"60%",fontSize: "12px",fontColor: "#fff"}],background: "#009241",imgs:[{src:require("../../assets/images/win_icon.png"),top: "10%",width:"32px",height:"32px"}]},
        { fonts: [{ text:this.$t('pay_034',{value:1000}), top: "60%",fontSize: "12px",fontColor: "#fff"}],background: "#DD167B",imgs:[{src:require("../../assets/images/more_icon.png"),top: "10%",width:"32px",height:"32px"}]},
        { fonts: [{ text:this.$t('pay_034',{value:1800}), top: '60%',fontSize: "12px",fontColor: "#fff"}],background: '#F8C301',imgs:[{src:require("../../assets/images/more_icon.png"),top: "10%",width:"32px",height:"32px"}]},
        { fonts: [{ text:this.$t('pay_034',{value:5000}), top: '60%',fontSize: "12px",fontColor: "#fff"}],background: '#E77841',imgs:[{src:require("../../assets/images/more_icon.png"),top: "10%",width:"32px",height:"32px"}]},
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
      return this.$Helper.randomStrings(100,1)
    }
  },
  created() {
    this.initLucky();
  },
  methods: {
    initLucky(){
      getruletainfo().then(res=>{
        // console.log(res);
        this.isLucky = res.flag||false;
        if(res.type){
          let goldNum = parseFloat(this.prizes[res.type].fonts[0].text);
          this.winGold = goldNum?goldNum:"lucky";
        }
      })
    },
    async startLucky() {
      if(!this.isLucky){
        return this.$toast(this.$t('other_076'))
      }
      this.isLucky = false;
      this.$refs.myLucky.play();
      const result = await doblarruleta();
      if(result.type){
        // console.log(result);
        this.$refs.myLucky.stop(result.type);
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
      // this.winGold = "lucky";
      this.isLucky = true;
    }
  }
};
</script>