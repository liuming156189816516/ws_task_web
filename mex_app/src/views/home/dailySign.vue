<style lang="scss" scoped>
.earn {
  width: 100%;
  height: 100%;
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
        padding: 20px 30px;
        box-sizing: border-box;
        color: $color-theme;
        div:nth-child(1){
          font-weight: bold;
        }
      }
      .daily_list{
        flex-wrap: wrap;
        overflow: hidden;
        border-top: 1px solid rgba($color: $color-theme, $alpha: .5);
        .daily_item{
          width: calc(100% / 4);
          flex-shrink: 0;
          // background: darkcyan;
          .day_text, .even_gold{
            padding: 10px 0;
            box-sizing: border-box;
            color: $home-eart-hu;
          }
          .day_text{
            // border-top: 1px solid $color-theme;
            border-bottom: 1px solid rgba($color: $color-theme, $alpha: .5);
          }
          .even_gold{
            padding: 15px 0;
          }
          .even_gold{
            border-bottom: 1px solid rgba($color: $color-theme, $alpha: .5);
            img{
              height: 60px;
            }
            .day_gold{
              margin-top: 5px;
              font-weight: bold;
            }
          }
        }
        .daily_item:nth-child(even){
          border-left: 1px solid rgba($color: $color-theme, $alpha: .5);
          border-right: 1px solid rgba($color: $color-theme, $alpha: .5);
        }
        .daily_item:nth-child(4){
          border-right: transparent;
        }
        .daily_item:nth-child(7){
          flex-grow: 2;
        }
        .day_daily{
          background:rgba($color:$color-theme, $alpha: .5);
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
    .activ_desc{
      margin-top: 20px;
      gap: 14px;
    }
  }
}
</style>
<template>
  <div class="earn">
    <page-header :title="$t('home_125')" :show-icon="true" :bgColor="true" />
    <div class="daily_main flex-item w_f flex-dir-c">
      <div class="even_daily w_f flex-item flex-dir-c flex-align">
        <div class="daily_top w_f flex-item flex-align flex-between font_28">
          <div>{{$t('home_128')}}</div>
          <div>{{$t('home_130',{month:currentDay[0],number:currentDay[1],week:currentWeek})}}</div>
        </div>
        <div class="daily_list flex-item flex-align w_f">
          <div class="daily_item flex-item flex-align flex-dir-c font_28" :class="[item==dayIdx?'day_daily':'']" v-for="item in 7" :key="item">
            <p class="day_text flex-item flex-align flex-center w_f">{{$t('home_129',{value:item})}}</p>
            <div class="even_gold flex-item flex-align flex-center w_f flex-dir-c">
              <img src="@/assets/images/more_icon.png" alt="">
              <p class="day_gold flex-item">+{{item+item*2}}</p>
            </div>
          </div>
        </div>
        <van-button class="sgin_btn flex-item flex-align flex-center" @click="submitSgin">
          <!-- <span class="flex-item"></span> -->
          {{$t('home_131')}}
          <!-- <img src="@/assets/images/gold_icon.png" alt=""> -->
        </van-button>
      </div>
      <div class="activ_desc flex-item w_f flex-dir-c font_28">
        <h3 class="mb_10">{{$t('other_071')}}</h3>
        <div class="title_item">
					<van-tag type="warning" /> {{$t('pay_010',{value:withdraw_cash})}}
				</div>
        <div class="title_item">
					<van-tag type="warning" /> {{$t('pay_010',{value:withdraw_cash})}}
				</div>
        <div class="title_item">
					<van-tag type="warning" /> {{$t('pay_010',{value:withdraw_cash})}}
				</div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import PageHeader from "@/components/Header";
import { boforeWeek,formatTime } from "@/utils/tool";
export default {
  name: "luckyWheel",
  components: { PageHeader },
  data() {
    return {
      index: null,
      dayIdx:2
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.User
    }),
    currentWeek(){
      return boforeWeek();
    },
    currentDay(){
      return formatTime("",2);
    }
  },
  created() {
    // console.log(formatTime("",2));
    // console.log(this.winNotis);
  },
  methods: {
    submitSgin(){
      if(this.dayIdx == 7){
        this.dayIdx = 1;
      }else{
        this.dayIdx ++;
      }
      this.$toast(this.$t('home_132'))
    }
  }
};
</script>