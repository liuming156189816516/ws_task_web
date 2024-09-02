<style lang="scss" scoped>
.earn {
  width: 100%;
  background-color: #f2f2f2;
  -webkit-overflow-scrolling: touch;
  .lucky_bg{
    .bg_01{
      position: relative;
      .img_01{
        position: absolute;
        top: 0;
        left: 0;
      }
      .lucky_bg2{
        padding: 60px;
        box-sizing: border-box;
        background: transparent;
      }
      .lucky_bg3{
        height: 600px;
        padding: 60px;
        box-sizing: border-box;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translateY(-50%);
        .lucky_main{
          width: 600px;
          height: 600px;
          padding: 60px;
          box-sizing: border-box;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%,-50%);
          // background: transparent;
          // background: darkmagenta;
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
    </div>
  </div>
</template>
<script>
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
              //   src:require('@/assets/LuckyWheel.png'),   //图片url
              top: "0", //图片距顶部距离
              width: "400px", //图片宽
              height: "400px", //图片高
            }
          ]
        }
      ],
      // 扇形数组
      prizes: [
        //单个扇形
        // {
        //   //奖品文字
        //   fonts: [
        //     {
        //       text: "苹果", //文字
        //       top: "10%", //文字距顶部距离
        //       fontColor: "#f00", //文字颜色
        //       fontSize: "16px", //文字大小
        //       fontStyle: "微软雅黑", //字体
        //       fontWeight: "500", //加粗
        //       lineHeight: "16px", //行高
        //       wordWrap: true, //换行
        //       lineClamp: 2, //2行，剩下的...
        //       wordWrap: true, //换行
        //     }
        //   ],
        //   //奖品图
        //   imgs: [
        //     {
        //       src: "https://img95.699pic.com/xsj/1s/5e/0g.jpg%21/fh/300", //图片url
        //       top: "30%", //图片距顶部距离
        //       width: "60px", //图片宽
        //       height: "60px", //图片高
        //     }
        //   ],
        //   background: "#FFF402", //扇形背景色
        //   range: 10, //当前prize.range/所有prize中range总和
        // },
        { fonts: [{ text: "7金币", top: "60%" }], background: "#76C5F0",imgs:[{src:require("../../assets/images/gold_icon.png"),top: "20%",width:"36px",height:"36px"}] },
        { fonts: [{ text: "10金币", top:"60%" }], background: "#2A1570",imgs:[{src:require("../../assets/images/gold_icon.png"),top: "20%",width:"36px",height:"36px"}]},
        { fonts: [{ text: "5金币", top: "60%" }], background: "#009241",imgs:[{src:require("../../assets/images/gold_icon.png"),top: "20%",width:"36px",height:"36px"}]},
        { fonts: [{ text: "2金币", top: "60%" }], background: "#DD167B",imgs:[{src:require("../../assets/images/gold_icon.png"),top: "20%",width:"36px",height:"36px"}]},
        { fonts: [{ text: '6金币', top: '60%' }], background: '#F8C301',imgs:[{src:require("../../assets/images/gold_icon.png"),top: "20%",width:"36px",height:"36px"}]},
        { fonts: [{ text: '0金币', top: '60%' }], background: '#E77841',imgs:[{src:require("../../assets/images/gold_icon.png"),top: "20%",width:"36px",height:"36px"}]},
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
              top: "-95%", //图片距顶部距离
              width: "88px", //图片宽
              height: "88px", //图片高
            }
          ]
        }
      ]
    }
  },
  computed: {},
  created() {},
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
    },
  },
};
</script>