
<template>
  <div class="earn">
    <page-header :title="$t('home_177')" :show-icon="true" :bgColor="true" />
    <div class="daily_main flex-item w_f flex-dir-c">
      <!-- <div class="sgin_head flex-item flex-between">
        <div class="flex-item flex-center flex-dir-c">
          <h3 class="font_48">{{$t('other_079')}}</h3>
          <p class="font_34">{{$t('other_080')}}</p>
        </div>
        <img src="@/assets/images/sgin_bg.png">
      </div> -->
      <div class="user_vip w_f flex-item flex-dir-c">
          <p class="total_gold font_36" v-html="$t('mine_024',{value:baseInfo.his_balance})"></p>
          <div class="user_grade flex-item flex-align flex-center font_26" :class="[baseInfo.level==0?'grade_zome':'']">
            <span>V{{baseInfo.level}}</span>
          </div>
          <p class="grade_desc font_28" v-html="$t('mine_023',{gold:baseInfo.diferencia,vip:Number(baseInfo.level)+1})"></p>
          <p>
            <van-progress :percentage="baseInfo.cronograma" :show-pivot="false" track-color="#fff" color="linear-gradient(to right, #FFFF99, #FFD700)" />
          </p>
      </div>
      <div class="even_daily w_f flex-item flex-dir-c flex-align">
        <!-- <div class="daily_top w_f flex-item flex-align flex-between font_28">
          <div>{{$t('home_128')}}</div>
          <div>{{$t('home_130',{month:currentDay[0],number:currentDay[1],week:currentWeek})}}</div>
        </div> -->
        <div class="daily_list flex-item flex-align w_f">
          <div class="daily_item flex-item flex-align flex-dir-c font_28" :class="[item.isSgin?'day_daily':'']" v-for="(item,idx) in sginArry" :key="idx">
            <p class="day_text flex-item flex-align flex-center w_f">VIP{{idx+1}}</p>
            <div class="even_gold flex-item flex-align flex-center w_f flex-dir-c">
              <img src="@/assets/images/more_icon.png" alt="">
              <p class="day_gold flex-item">+{{item.gold}}</p>
            </div>
            <div class="finish_cover flex-item flex-align flex-center" v-if="item.disab">
              <img src="@/assets/images/home/ok_icon.png" alt="" srcset="">
            </div>
          </div>
        </div>
        <van-button class="sgin_btn flex-item flex-align flex-center" :loading="isLoading" :loading-text="$t('home_133')" @click="submitSgin">
          <!-- <span class="flex-item"></span> -->
          {{isSgin?$t('home_132'):$t('home_178')}}
          <!-- <img src="@/assets/images/gold_icon.png" alt=""> -->
        </van-button>
      </div>
      <div class="activ_desc flex-item w_f flex-dir-c font_28">
        <h3 class="mb_10">{{$t('other_071')}}</h3>
        <div class="title_item">
					<van-tag type="warning" /> {{$t('other_100')}}
				</div>
        <div class="title_item">
					<van-tag type="warning" /> {{$t('other_101')}}
				</div>
        <div class="title_item">
					<van-tag type="warning" /> {{$t('other_102')}}
				</div>
        <div class="title_item">
					<van-tag type="warning" /> {{$t('other_103')}}
				</div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import PageHeader from "@/components/Header";
import { boforeWeek,formatTime } from "@/utils/tool";
import { getsigninfo,dosign,getteammatesinfo } from '@/api/home'
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
      team_size:0,
      sginArry:[
        {disab:false,isSgin:false,gold:0},
        {disab:false,isSgin:false,gold:1888},
        {disab:false,isSgin:false,gold:4888},
        {disab:false,isSgin:false,gold:8888},
        {disab:false,isSgin:false,gold:28888},
        {disab:false,isSgin:false,gold:58888},
        {disab:false,isSgin:false,gold:88888},
        {disab:false,isSgin:false,gold:388888}
      ]
    }
  },
  computed: {
    ...mapState({
      baseInfo: state => state.User.userInfo
    }),
    currentWeek(){
      return boforeWeek();
    },
    currentDay(){
      return formatTime("",2);
    }
  },
  created() {
    this.$store.dispatch('User/getUserIncome');
    // this.initSgin();
    // this.getIncomeList();
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
      if(this.$Helper.checkBrowser()){
				window.open(process.env.VUE_APP_TELEGRAM,"_blank");
			}else{
				uniFun.postMessage({data:process.env.VUE_APP_TELEGRAM});
			}
      // if(this.isSgin||!this.isTask) return this.$toast(this.$t('home_137'));
      // this.isLoading=true;
      // setTimeout(()=>{this.isLoading=false;},5000);
      // let sginItem = this.sginArry[this.sginLen];
      // await dosign({type:this.sginLen+1});
      // sginItem.isSgin=false;
      // sginItem.disab=true;
      // this.isLoading=false;
      // this.isSgin=true;
      // this.$toast(this.$t('home_132'))
    }
  }
}
</script>
<style lang="scss" scoped>
.earn {
  width: 100%;
  overflow-y: auto;
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
    .user_vip{
      margin: 20px 0;
      padding: 20px 10px;
      border-radius: 20px;
      box-sizing: border-box;
      padding-bottom: 20px;
      position: relative;
      color: $font-color-white;
      // background: $home-mine-value;
      .total_gold{
        font-weight: bold;
      }
      .user_grade{
          width: 110px;
          height: 71px;
          position: absolute;
          top: 0px;
          right: 20px;
          z-index: 1;
          margin-top: 10px;
          background: url('../../assets/images/mine/vip_icon.png') no-repeat;
          background-size: 100% 100%;
          // color:$home-gold-value;
          span{
              font-weight: bold;
              font-style: italic;
              letter-spacing: -1px;
              position: relative;
              z-index: 3;
              padding-right: 6px;
              background: linear-gradient(307.11deg,#A38748 88.8%, #785728 14.91%);
              // background: linear-gradient(168.91deg, #785728 -69%, #F5E486 -25.53%, #B0803A 5.51%, #B0803A 32.42%, #F5E486 65.53%, #B0803A 102.79%, #F5E486 137.98%);
              // background: linear-gradient(307.11deg, #F1DE82 14.91%, #A38748 88.8%);
              -webkit-text-fill-color:transparent;
              -webkit-background-clip:text;
          }
          img{
              height: 66px;
          }
      }
      .grade_zome{
          filter: grayscale(.9);
      }
      .grade_desc{
          margin: 10px 0 20px 0;
          // margin: 20px 0;
          color: $font-color-white;
          .vip_g{
              color: $home-gold-value;
          }
      }
  }
    .even_daily{
      // padding: 20px 0;
      padding-bottom: 20px;
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
        // border-top: 1px solid rgba($color: $color-theme, $alpha: .5);
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
        .day_daily:nth-child(1){
          border-top-left-radius: 20px;
        }
        .day_daily:nth-child(4){
          border-top-right-radius: 20px;
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