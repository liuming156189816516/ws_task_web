<template>
    <div class="person_c">
        <page-header :title="$t('pay_023')" :show-icon="true" :bgColor="true"></page-header>
        <div class="person_content">
            <div class="user_info w_f flex-item flex-content-l">
              <div class="lable_text">{{$t('pay_046')}}</div>
              <van-radio-group class="w_f flex-item flex-dir-r" v-model="countryType" >
                <van-radio name="Nigeria" @click="changeCountryType('Nigeria')" shape="square">{{$t('pay_047')}}</van-radio>
                <van-radio name="India" @click="changeCountryType('India')" shape="square">{{$t('pay_048')}}</van-radio>
              </van-radio-group>
            </div>
            <!-- 尼日利亚 -->
            <div class="user_info w_f flex-item flex-content-l" v-if="countryType==='Nigeria'">
                <div class="lable_text">{{$t('pay_038')}}</div>
                <van-radio-group class="w_f flex-item flex-dir-r" v-model="curIndex" @change="changeType">
                    <van-radio name="1" shape="square">{{$t('pay_039')}}</van-radio>
                    <van-radio name="2" shape="square">{{$t('pay_040')}}</van-radio>
                </van-radio-group>
            </div>
            <template v-if="countryType==='Nigeria'&&curIndex==1">
                <div class="user_info">
                    <span class="lable_text">{{ $t('pay_006') }}</span>
                    <van-field v-model="collectCard" :maxlength="10" :placeholder="$t('other_001',{value:$t('pay_006')})" oninput="value=value.replace(/[^\d]/g,'')" :border="false" />
                </div>
                <div class="user_info bank_account" @click="showBank(0)">
                    <span class="lable_text">{{ $t('pay_021') }}</span>
                    <div class="flex-between">
                        <van-field v-model="bankName" :readonly = true :placeholder="$t('other_014',{value:$t('pay_021')})" :border="false" />
                        <van-icon name="arrow" style="transition: all .3s linear" :style="{transform: `rotate(${accountModel == true ? 90 : 0}deg)`}" />
                    </div>
                </div>

                <div class="user_info">
                    <span class="lable_text">{{ $t('pay_022') }}</span>
                    <van-field v-model="collectName" :placeholder="$t('pay_022')" :border="false" />
                </div>

            </template>
            <template v-else-if="countryType==='Nigeria'">
                <div class="user_info alipay_info">
                    <span class="lable_text">{{ $t('pay_041') }}</span>
                    <van-field v-model="collectTRX" :placeholder="$t('other_001',{value:$t('pay_041')})" :border="false" oninput="value=value.replace(/[\u4E00-\u9FA5]/g,'')" />
                </div>
            </template>
            <!-- 印度 -->
            <template v-if="countryType==='India'">
              <div class="user_info">
                <span class="lable_text">{{ $t('pay_049') }}</span>
                <van-radio-group v-model="accountType" class="w_f flex-item flex-dir-r"  @change="changeAccountType">
                  <van-radio name="BANK" shape="square">{{$t('pay_050')}}</van-radio>
<!--                  <van-radio name="UPI" shape="square">{{$t('pay_051')}}</van-radio>-->
                </van-radio-group>
              </div>
              <div class="user_info">
                <span class="lable_text">{{ $t('pay_006') }}</span>
                <van-field v-model="collectCard" :maxlength="10" :placeholder="$t('other_001',{value:$t('pay_006')})" oninput="value=value.replace(/[^\d]/g,'')" :border="false" />
<!--                <van-field v-model="collectCard" :placeholder="$t('other_001',{value:$t('pay_006')})" :border="false" />-->
              </div>
              <div class="user_info">
                <span class="lable_text">{{ $t('pay_022') }}</span>
                <van-field v-model="collectName"  :placeholder="$t('other_001',{value:$t('pay_022')})" :border="false" />
              </div>
              <div class="user_info">
                <span class="lable_text">{{ $t('pay_052') }}</span>
                <van-field v-model="identifyNum"  :placeholder="$t('other_001',{value:$t('pay_052')})" :border="false" />
              </div>
            </template>


          <!-- <div class="user_info">
              <span class="lable_text">验证码</span>
              <van-field class="cell-block" :border="false" type="text" placeholder="请输入验证码" v-model="verify_code">
                  <template #button>
                      <van-button size="small" type="primary" id="TencentCaptcha" data-appid="2004381688" data-cbfn="callbackName" data-biz-state="data-biz-state" @click="getVerfyBtn">
                          {{countTime == 60?'发送验证码':`${countTime}秒后重新获取` }}</van-button>
                  </template>
              </van-field>
          </div> -->
            <!-- <van-action-sheet :round="false" v-model="selectBank" :actions="malayBank" @close="selectBank=false" @select="changeSelect" :cancel-text="$t('other_007')" /> -->
            <van-action-sheet :round="false" v-model="accountModel" :actions="bankOption" @close="accountModel=false" @select="changeAccount" :cancel-text="$t('other_007')" />
            <div class="button_area">
                <van-button type="primary" @click="submitBtn" :loading="isLoading">{{ $t('other_015') }}</van-button>
            </div>
            <div class="tip w_f flex-item flex-dir-c">
                <div class="cash_adverice">
                    <div class="title-tip w_f mb_10 font_34">{{ $t('other_008') }}</div>
                    <div class="title_item font_30">
                        <van-tag type="warning" /> {{$t('pay_035')}}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {getwithdrawcard, dowithdrawcard, getlistbanks} from "@/api/pay";
import PageHeader from "@/components/Header";
import {cloneDeep} from "lodash/lang";
export default {
    name: "mine",
    components: { PageHeader},
    data() {
        return {
            curIndex:"1",
            bank_id:"",
            bankName:"",
            bankCode:"",
            numberId:"",
            countryType:"", // 国家 类型
            collectCard:"", // 银行账号
            collectTRX:"",
            collectName:"", // 收款姓名
            identifyNum:'', // IFSC号码
            openBranch:"",
            usdtCard:"",
            selectType:null,
            verify_code:"",
            countTime:"",
            isLoading:false,
            selectBank:false,
            accountModel:false,
            bankOption: [],
            accountType:'',
            apiResData:{}
        }
    },
    computed: {
        userInfo() {
            return this.$store.state.User.userInfo;
        }
    },
    created() {
        this.curIndex = this.$route.query.type||"2";
        this.syncInitApi();
    },
    methods: {
        changeType(val){
            this.curIndex = val;
        },
        changeAccountType(val){
          this.accountType = val;
        },
        syncInitApi(){
            let fun1 = new Promise((resolve,reject)=>{
                getlistbanks().then(res =>{
                    resolve(res)
                })
            });
            let fun2 = new Promise((resolve,reject)=>{
                getwithdrawcard().then(res =>{
                    resolve(res)
                })
            });
            Promise.all([fun1,fun2]).then( res => {
                const [bankList,{id,bank_name,card_no,payee_name,code,type,country,account_type,identify_num}] = res;
                this.apiResData = cloneDeep(res)
                this.bankOption = bankList.banks||[];
                this.bank_id = id||"";
                this.bankCode = code||"";
                this.bankName = bank_name||"";
                this.collectName = payee_name||"";
                this.collectCard = type==1?card_no:"";
                this.collectTRX = type==2?card_no:"";
                this.countryType = country||"";
                this.accountType = account_type||'BANK'
                if (country==='India'){
                  this.collectCard = card_no||'';
                  this.identifyNum = identify_num||''
                }
            })
        },
        showBank(idx){
            idx==1?this.selectBank=true:this.accountModel=true;
        },
        changeSelect(val){
            this.bankCode=val.code;
            this.bankName=val.name;
            this.selectBank = false;
        },
        changeAccount(val){
            this.bankCode=val.code;
            this.bankName=val.name;
            this.accountModel = false;
        },
        async submitBtn(){
            let params = {};
            if(this.countryType==='Nigeria'&&this.curIndex == 1){
                params ={
                    ptype:this.bank_id?2:1,
                    code:this.bankCode,
                    type:Number(this.curIndex),
                    card_no:this.collectCard,
                    bank_name:this.bankName,
                    payee_name:this.collectName
                }
            }else if (this.countryType==='Nigeria'){
                params ={
                    ptype:this.bank_id?2:1,
                    type:Number(this.curIndex),
                    card_no:this.collectTRX
                }
            }
           if(this.countryType === 'India'){
             params ={
               ptype:this.bank_id?2:1,
               code:this.bankCode,
               card_no:this.collectCard,
               bank_name:this.bankName,
               payee_name:this.collectName,
               account_type:this.accountType,
               country:this.countryType,
               identify_num:this.identifyNum
             }
           }

      this.bank_id ? params.id = this.bank_id : "";
      // 国家类型 尼日利亚
      if (this.countryType === 'Nigeria') {
        if (this.curIndex == 1 && !this.collectCard) {
          return this.$toast(this.$t('other_001', {value: this.$t('pay_006')}))
        } else if (this.curIndex == 1 && !this.bankName) {
          return this.$toast(this.$t('other_014', {value: this.$t('pay_021')}))
        } else if (this.curIndex == 2 && !this.collectTRX) {
          return this.$toast(this.$t('other_001', {value: this.$t('pay_014')}))
        } else if (this.curIndex == 1 && !this.collectName) {
          return this.$toast(this.$t('other_001', {value: this.$t('pay_022')}))
        }
        // 国家类型 印度
      } else if (this.countryType === 'India') {
        if (!this.accountType) {
          return this.$toast(this.$t('other_014', {value: this.$t('pay_049')}))
        } else if (!this.collectCard) {
          return this.$toast(this.$t('other_001', {value: this.$t('pay_006')}))
        } else if (!this.collectName) {
          return this.$toast(this.$t('other_001', {value: this.$t('pay_022')}))
        } else if (!this.identifyNum) {
          return this.$toast(this.$t('other_001', {value: this.$t('pay_052')}))
        }
      }

      this.isLoading = true;
      const res = await dowithdrawcard(params);
      this.isLoading = false;
      if (res.code) return;
      this.$toast(this.$t('other_013'));
      setTimeout(() => {
        this.$router.go(-1)
      }, 500);
    },
    //
    // 切换国家
    changeCountryType(val) {
      this.countryType = val
      this.curIndex = '1'
      this.bankName = ''
      this.collectTRX = ''
      this.accountType = ''
      this.collectCard = ''
      this.collectName = ''
      this.identifyNum = ''
      const [bankList, {
        id,
        bank_name,
        card_no,
        payee_name,
        code,
        type,
        country,
        account_type,
        identify_num
      }] = this.apiResData;
      console.log('val',val)
      console.log('this.apiResData',this.apiResData)
      if (val === country) {
        this.curIndex = type ? String(type) : ''
        this.bankOption = bankList.banks || [];
        this.bank_id = id || "";
        this.bankCode = code || "";
        this.bankName = bank_name || "";
        this.collectName = payee_name || "";
        this.collectCard = type == 1 ? card_no : "";
        this.collectTRX = type == 2 ? card_no : "";
        this.accountType = account_type || ''
      }else if (val === 'India') {
        this.collectCard = card_no || '';
        this.identifyNum = identify_num || ''
        this.accountType = account_type || 'BANK'
      }
    }
  }
};
</script>
<style lang="scss">
.person_content {
  .van-collapse-item__content {
    padding: 0 !important;
  }
}

.van-radio__icon--checked .van-icon {
  border-color: $color-theme !important;
  background-color: $color-theme;
}
</style>
<style lang="scss" scoped>
.person_c {
  width: 100%;
  float: left;
  height: 100%;
  overflow: hidden;
  font-size: 28px;
  background-color: #f2f2f2;

  .person_content {
    width: 100%;
    height: 100vh;
    float: left;
    margin-top: 20px;
    padding: 25px 30px 0 30px;
    box-sizing: border-box;
    background-color: #fff;

    .user_info {
      width: 100%;
      height: 96px;
      float: left;
      border-bottom: 1px solid #EEEEEE;
      display: flex;
      align-items: center;
      background-color: #fff;
      justify-content: space-between;

      .van-cell {
        flex-grow: 1;
      }

      .lable_text {
        width: 260px;
        color: #969799;
        line-height: 28px;
        flex-shrink: 0;
      }

      .van-radio-group {
        gap: 20px;
      }

      .van-icon {
        float: right;
      }

      .van-cell {
        width: 3.5rem;
        padding: 8px 0;
        background-color: transparent;
      }
    }

    .alipay_info {
      margin-top: 20px;
    }

    .van-tabs__wrap {
      font-size: 0.32rem;
    }

    .bank_list {
      width: 100%;
      height: 400px;
    }

    .van-collapse-item__content {
      padding: 0 !important;
    }

    .button_area {
      width: 100%;
      float: left;
      padding: 0 30px;
      margin-top: 114px;

      .van-button {
        height: 44px;
        width: 100%;
        border: none;
        border-radius: 44px;
        font-size: 0.32rem;
        border-color: $color-theme;
        background-color: $color-theme;
      }
    }

    .first_title, .bank_account {
      margin-top: 20px;
    }

    .bank_account {
      .van-cell {
        float: left;
      }

      .van-icon {
        font-size: 0.36rem;
      }
    }

    .van-action-sheet {
      max-height: 40%;
    }

    .van-action-sheet__item {
      // line-height: 0px;
      padding: 20px 0;
    }

    .van-action-sheet__cancel {
      padding: 12px 0;
      border-top: 1px solid #f2f2f2;
    }
  }

  .flex-between {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-grow: 1;
  }

}

.valid_title {
  padding: 30px 32px 10px;
  font-size: 24px;
}

::v-deep {
  .van-cell__value {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;

    .van-field__body {
      display: flex;
      justify-content: space-between;
      width: 100%;
    }

    .van-button--primary, .van-button--info {
      background-color: $color-theme;
      border-color: $color-theme;
    }

    .van-button--info {
      opacity: 0.75;
      pointer-events: none;
    }
  }
}

.cash_adverice {
  margin-top: 60px;

  .title-tip {
    font-weight: bold;
  }

  .title_item {
    color: $home-title-15;
  }
}
</style>
