<style lang="scss" scoped>
.earn {
  width: 100%;
  padding-bottom: 40px;
  -webkit-overflow-scrolling: touch;
  background: linear-gradient(180deg, #31acf2 1.61%, rgba(255, 255, 255, 0.5) 100%);
  .daily_main{
    padding: 0 20px;
    box-sizing: border-box;
    .sgin_head{
        h3{
          color: $font-color-white;
        }
        p{
          color: $font-color-white; 
          margin-top: 6px;     
        }
        img{
          height: 260px;
        }
      }
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
          position: relative;
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
              height: 88px;
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
        .finish_cover{
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          z-index: 2;
          background: rgba($color: #000000, $alpha: .1);
          img{
            height: 66px;
          }
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
      <div class="sgin_head flex-item flex-between">
        <div class="flex-item flex-center flex-dir-c">
          <h3 class="font_48">{{$t('other_079')}}</h3>
          <p class="font_34">{{$t('other_080')}}</p>
        </div>
        <img src="@/assets/images/sgin_bg.png">
      </div>
      <div class="even_daily w_f flex-item flex-dir-c flex-align">
        <div class="daily_top w_f flex-item flex-align flex-between font_28">
          <div>{{$t('home_128')}}</div>
          <div>{{$t('home_130',{month:currentDay[0],number:currentDay[1],week:currentWeek})}}</div>
        </div>
        <div class="daily_list flex-item flex-align w_f">
          <div class="daily_item flex-item flex-align flex-dir-c font_28" :class="[item.isSgin?'day_daily':'']" v-for="(item,idx) in sginArry" :key="idx">
            <p class="day_text flex-item flex-align flex-center w_f">{{$t('home_129',{value:(idx+1)})}}</p>
            <div class="even_gold flex-item flex-align flex-center w_f flex-dir-c">
              <img src="@/assets/images/more_icon.png" alt="">
              <p class="day_gold flex-item">+{{item.gold}}</p>
            </div>
            <div class="finish_cover flex-item flex-align flex-center" v-if="item.disab">
              <img src="@/assets/images/home/ok_icon.png" alt="" srcset="">
            </div>
          </div>
        </div>
        <van-button class="sgin_btn flex-item flex-align flex-center" :loading="isLoading" :loading-text="$t('home_133')" :disabled="isSgin" @click="submitSgin">
          <!-- <span class="flex-item"></span> -->
          {{isSgin?$t('home_132'):$t('home_131')}}
          <!-- <img src="@/assets/images/gold_icon.png" alt=""> -->
        </van-button>
      </div>
      <div class="activ_desc flex-item w_f flex-dir-c font_28">
        <h3 class="mb_10">{{$t('other_071')}}</h3>
        <div class="title_item">
					<van-tag type="warning" /> {{$t('other_084')}}
				</div>
        <div class="title_item">
					<van-tag type="warning" /> {{$t('other_085')}}
				</div>
        <div class="title_item">
					<van-tag type="warning" /> {{$t('other_086')}}
				</div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import PageHeader from "@/components/Header";
import { boforeWeek,formatTime } from "@/utils/tool";
import { getsigninfo,dosign } from '@/api/home'
export default {
  name: "luckyWheel",
  components: { PageHeader },
  data() {
    return {
      index: null,
      sginLen:null,
      isSgin:true,
      isTask:false,
      isLoading:false,
      sginDay:[1,2,3],
      sginArry:[
        {disab:false,isSgin:false,gold:30},
        {disab:false,isSgin:false,gold:60},
        {disab:false,isSgin:false,gold:90},
        {disab:false,isSgin:false,gold:120},
        {disab:false,isSgin:false,gold:150},
        {disab:false,isSgin:false,gold:180},
        {disab:false,isSgin:false,gold:210}
      ]
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
    this.initSgin();
    // console.log(formatTime("",2));
    // console.log(this.winNotis);
  },
  methods: {
    initSgin(){
      getsigninfo().then(res=>{
        // console.log(res);
        this.sginDay = res.type||[];
        this.isSgin = res.is_sign;
        this.isTask = res.is_task;
        this.sginLen = this.sginDay.length;
        if(this.sginDay.length>0){
          for (let k = 0; k < this.sginArry.length; k++) {
            for (let h = 0; h < this.sginDay.length; h++) {
              if(k === h){
                this.sginArry[k].disab=true;
              }
            }
            if(k === this.sginLen&&!this.isSgin){
              this.sginArry[k].isSgin=true;
            }
          }
        }else{
          this.sginArry[0].isSgin=true;
        }
      })
    },
    async submitSgin(){
      if(!this.isSgin||!this.isTask) return this.$toast(this.$t('home_137'));
      this.isLoading=true;
      setTimeout(()=>{this.isLoading=false;},5000);
      let sginItem = this.sginArry[this.sginLen];
      await dosign({type:this.sginLen+1});
      sginItem.isSgin=false;
      sginItem.disab=true;
      this.isLoading=false;
      this.isSgin=true;
      this.$toast(this.$t('home_132'))
    }
  }
};
</script>