<style lang="scss" scoped>
.earn {
  width: 100%;
  height: 100vh;
  -webkit-overflow-scrolling: touch;
  background: linear-gradient(180deg, #31acf2 1.61%, rgba(255, 255, 255, 0.5) 100%);
  .daily_main{
    padding: 0 20px;
    box-sizing: border-box;
    .even_daily{
      padding: 20px 0;
      box-sizing: border-box;
      border-radius: 20px;
      background: #fff;
      .daily_top{
        font-weight: bold;
        padding: 20px 30px;
        box-sizing: border-box;
      }
      .daily_list{
        flex-wrap: wrap;
        overflow: hidden;
        border-top: 1px solid $color-Nobtnbg;
        .daily_item{
          width: calc(100% / 4);
          flex-shrink: 0;
          // background: darkcyan;
          .day_text, .even_gold{
            padding: 10px 0;
            box-sizing: border-box;
          }
          .day_text{
            // border-top: 1px solid $color-Nobtnbg;
            border-bottom: 1px solid $color-Nobtnbg;
          }
          .even_gold{
            padding: 15px 0;
          }
          .even_gold{
            border-bottom: 1px solid $color-Nobtnbg;
            img{
              height: 60px;
            }
            .day_gold{
              font-weight: bold;
            }
          }
        }
        .daily_item:nth-child(even){
          border-left: 1px solid $color-Nobtnbg;
          border-right: 1px solid $color-Nobtnbg;
        }
        .daily_item:nth-child(4){
          border-right: transparent;
        }
        .daily_item:nth-child(7){
          flex-grow: 2;
        }
      }
      .sgin_btn{
        height: 88px;
        width: 90%;
        padding: 0;
        margin-top: 20px;
        padding: 0 20px;
        border-radius: 60px;
        color: $font-color-white;
        border-color: $color-theme;
        background-color: $color-theme;
        img{
          height: 42px;
        }
      }
    }
  }
}
</style>
<template>
  <div class="earn">
    <page-header :title="$t('mine_010')" :show-icon="true" :bgColor="true" />
    <div class="daily_main">
      <div class="even_daily w_f flex-item flex-dir-c flex-align">
        <div class="daily_top w_f flex-item flex-align flex-between font_28">
          <div>每日签到</div>
          <div>2月1号 星期三</div>
        </div>
        <div class="daily_list flex-item flex-align w_f">
          <div class="daily_item flex-item flex-align flex-dir-c font_28" v-for="item in 7" :key="item">
            <p class="day_text flex-item flex-align flex-center w_f">第{{item}}天</p>
            <div class="even_gold flex-item flex-align flex-center w_f flex-dir-c">
              <img src="@/assets/images/gold_icon.png" alt="">
              <p class="day_gold">+20</p>
            </div>
          </div>
        </div>
        <van-button class="sgin_btn flex-item flex-align flex-center">
          <!-- <span class="flex-item"></span> -->
          立即签到
          <!-- <img src="@/assets/images/gold_icon.png" alt=""> -->
        </van-button>
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
      index: null
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.User
    })
  },
  created() {
    // console.log(this.winNotis);
  },
  methods: {
  }
};
</script>