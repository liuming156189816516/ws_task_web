<style lang="scss" scoped>
.earn {
  width: 100%;
  height: 100vh;
  -webkit-overflow-scrolling: touch;
  background: linear-gradient(180deg, #31acf2 1.61%, rgba(255, 255, 255, 0.5) 100%);
  .lucky_bg{
    .bg_01{
      height: 740px;
      position: relative;
      // background: rgba($color: red, $alpha: .5);
      .img_01{
        position: absolute;
        top: 0;
        left: 0;
      }
      .lucky_bg2{
        position: absolute;
        top: 0;
        left: 0;
        padding: 60px;
        box-sizing: border-box;
        background: transparent;
      }
      .lucky_bg3{
        padding: 60px;
        box-sizing: border-box;
        position: absolute;
        top: 0;
        left: 0;
        .lucky_main{
          width: 594px;
          height: 594px;
          position: absolute;
          top: 80px;
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
      <page-header :title="$t('mine_010')" :show-icon="true" :bgColor="true" />
      <div class="lucky_bg w_f">
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
                :blocks="blocks"
                :buttons="buttons"
                @start="startLucky"
                @end="luckyEnd"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="award_record w_f">
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
export default {
  name: "luckyWheel",
  components: { PageHeader },
  data() {
    return {
      index: null,
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
        { fonts: [{ text: "7金币", top: "60%",fontSize: "12px",fontColor: "#fff"}],background: "#76C5F0",imgs:[{src:require("../../assets/images/gold_icon.png"),top: "10%",width:"32px",height:"32px"}]},
        { fonts: [{ text: "10金币", top:"60%",fontSize: "12px",fontColor: "#fff"}],background: "#E3556B",imgs:[{src:require("../../assets/images/gold_icon.png"),top: "10%",width:"32px",height:"32px"}]},
        { fonts: [{ text: "5金币", top: "60%",fontSize: "12px",fontColor: "#fff"}],background: "#009241",imgs:[{src:require("../../assets/images/gold_icon.png"),top: "10%",width:"32px",height:"32px"}]},
        { fonts: [{ text: "2金币", top: "60%",fontSize: "12px",fontColor: "#fff"}],background: "#DD167B",imgs:[{src:require("../../assets/images/gold_icon.png"),top: "10%",width:"32px",height:"32px"}]},
        { fonts: [{ text: '6金币', top: '60%',fontSize: "12px",fontColor: "#fff"}],background: '#F8C301',imgs:[{src:require("../../assets/images/gold_icon.png"),top: "10%",width:"32px",height:"32px"}]},
        { fonts: [{ text: '0金币', top: '60%',fontSize: "12px",fontColor: "#fff"}],background: '#E77841',imgs:[{src:require("../../assets/images/gold_icon.png"),top: "10%",width:"32px",height:"32px"}]},
        // { fonts: [{ text: '柚子', top: '10%' }], background: '#42929D' },
        // { fonts: [{ text: '山竹', top: '10%' }], background: '#E3556B' },
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
    // console.log(this.winNotis);
  },
  methods: {
    startLucky() {
      this.$refs.myLucky.play();
      setTimeout(() => {
        const index = 0;
        this.$refs.myLucky.stop(index);
      }, 3000);
    },
    // 抽奖结束会触发end回调
    luckyEnd(prize) {
      console.log(prize);
    }
  }
};
</script>