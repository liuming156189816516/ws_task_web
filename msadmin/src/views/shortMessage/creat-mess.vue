<template>
    <div>
        <el-button size="small" @click="$router.go(-1)">
            <i class="el-icon-back"></i>
            <span>{{$t('sys_q006')}}</span>
        </el-button>
        <div class="continer_main" style="width: 100%;margin-top: 30px;">
            <div class="left_mess">
                <el-row >
                    <el-col :span="24">
                        <el-form size="small" style="width:100%;" :model="quickForm" :rules="quickRules" ref="quickForm" label-width="100px" class="demo-ruleForm">
                            <el-form-item :label="$t('sys_q116')" prop="reply_name">
                                <el-input clearable maxlength="50" show-word-limit v-model="quickForm.reply_name" :placeholder="$t('sys_mat021')" />
                            </el-form-item>
                            <el-form-item :label="$t('sys_q121')" prop="group_id">
                                <el-select v-model="quickForm.group_id" :placeholder="$t('sys_c052')">
                                    <el-option v-for="item in accountGroupList" :key="item.id" :label="item.name+'(数量：'+item.count+'，在线：'+item.online_num+')'"  :value="item.group_id" />
                                </el-select>
                            </el-form-item>
                            <el-form-item :label="$t('sys_q122')" prop="keep_group_id_b">
                                <el-select v-model="quickForm.keep_group_id_b" :placeholder="$t('sys_c052')">
                                    <el-option v-for="item in accountGroupList" :key="item.id" :label="item.name+'(数量：'+item.count+'，在线：'+item.online_num+')'"  :value="item.group_id" />
                                </el-select>
                            </el-form-item>
                            <el-form-item :label="$t('sys_g079')" prop="end_time" class="hide_text">
                                <el-date-picker v-model="quickForm.end_time" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" :placeholder="$t('sys_c052')" />
                            </el-form-item>
                            <el-form-item :label="$t('sys_rai091')" prop="ad_str">
                                <el-input type="textarea" clearable v-model="quickForm.ad_str" :placeholder="$t('sys_mat061',{value:$t('sys_rai091')})" rows="6" />
                            </el-form-item>
                            <el-form-item style="margin-top: 20px;">
                                <el-button @click="$router.go(-1)">{{ $t('sys_c023') }}</el-button>
                                <el-button type="primary" :loading="isLoading" @click="submitReply('quickForm')">{{ $t('sys_q120') }}</el-button>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </el-row>
            </div>
            <div class="modile_model">
                <div class="model_main">
                    <div class="mobile_cover">
                        <div class="mobile_head">
                            <span class="local_time">12:58</span>
                        </div>
                        <div class="mess_content">
                            <div class="talk_dialog">
                                hello
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
    .continer_main{
        width: 100%;
        padding-right: 30px;
        display: flex;
    }
    .left_mess{
        width: 80%;
        margin-right: 30px;
    }
    .modile_model{
        display: flex;
        width: 300px;
        height: 600px;
        position: relative;
        flex-shrink: 0;
        margin-top: -30px;
        background: url(../../assets/iphone.png) no-repeat;
        background-size:cover;
        .model_main{
            width: 100%;
            height: 100%;
            padding: 30px 24px;
            box-sizing: border-box;
            position: absolute;
            top: 0;
            left: 0;
            .mobile_cover{
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                border-radius: 30px;
                // background: rgba($color:red,$alpha:.5);
                .mobile_head{
                    display: flex;
                    .local_time{
                        width: 80px;
                        height: 30px;
                        font-size: 12px;
                        color: #99A1B7;
                        padding: 10px 0 0 8px;
                        border-radius: 30px 0 0 0;
                        background: #F9F9F9;
                    }
                }
                .mess_content{
                    width: 100%;
                    padding: 0 20px;
                    margin-top: 78px;
                    box-sizing: border-box;
                    height: calc(100% - 110px);
                    .talk_dialog{
                        position: relative;
                        z-index: 0;
                        color: #fff;
                        padding: 10px;
                        border-radius: 10px;
                        background: #1b84ff;
                    }
                    .talk_dialog:after{
                        content: "";
                        position: absolute;
                        left: 0;
                        bottom: 0;
                        width: 10px;
                        height: 10px;
                        margin-left: -5px;
                        color: #1b84ff;
                        border-top: 6px solid;
                        border-top-left-radius: 80%;
                        -ms-transform: skewX(-30deg) scaleY(1.3);
                        transform: skew(-30deg) scaleY(1.3);
                        z-index: -1;
                    }
                }
            }
        }
    }
</style>
<script>
import { successTips } from '@/utils/index'
import material from '../content/material.vue';
// import { addkeeptask,getkeepgroup } from '@/api/task'
export default {
    components:{material},
    data() {
        return {
            id:"",
            group_id:"",
            source_id:"",
            isLoading:false,
            showSource:false,
            group_type:null,
            childMess:{
                check_len:0,
                check:true,
                is_show:1,
                type:0
            },
            draggedItemIndex:-1,
            accountGroupList:[],
            quickForm:{
                reply_name:"",
                group_id:"",
                group_link:"",
                ad_str:"",
                end_time:"",
                keep_group_id_b:"",
                source_list:[]
            }
        }
    },
    computed:{
        quickRules() {
            return {
                reply_name:[{ required: true, message: this.$t('sys_mat061',{value:this.$t('sys_q001')}), trigger: 'change' }],
                group_id:[{ required: true, message: this.$t('sys_c089',{value:this.$t('sys_q121')}), trigger: 'change' }],
                keep_group_id_b:[{ required: true, message: this.$t('sys_c089',{value:this.$t('sys_q122')}), trigger: 'change' }],
                group_link:[{ required: true, message: this.$t('sys_mat061',{value:this.$t('sys_q117')}), trigger: 'blure' }],
                ad_str:[{ required: true, message: this.$t('sys_mat061',{value:this.$t('sys_rai091')}), trigger: 'blure' }],
                end_time:[{ required: true, message: this.$t('sys_c089',{value:this.$t('sys_g079')}), trigger: 'change' }],
                source_list:[{ type: 'array', required: true, message: this.$t('sys_c089',{value:this.$t('sys_q005')}), trigger: 'change' }],
            }
        },
        sourceOption() {
            return ["",this.$t('sys_mat008'),this.$t('sys_mat009'),this.$t('sys_mat010'),this.$t('sys_mat011'),this.$t('sys_mat091'),this.$t('sys_mat092')]
        }
    },
    created(){
        // this.keepGroupList();
    },
    methods:{
        dragStart(index) {
          this.draggedItemIndex = index;
        },
        async keepGroupList(){
            let {data:{list}} = await getkeepgroup();
            this.accountGroupList = list||[];
        },
        async submitReply(formName) {
            this.$refs[formName].validate(async(valid) => {
                if (valid) {
                    let params = {
                        name:this.quickForm.reply_name,
                        keep_group_id:this.quickForm.group_id,
                        group_url_str:this.quickForm.group_link,
                        ad_str:this.quickForm.ad_str,
                        keep_group_id_b:this.quickForm.keep_group_id_b,
                        end_time:this.$baseFun.resetTime(this.quickForm.end_time,3)
                    }
                    this.isLoading = true;
                    let res = await addkeeptask(params);
                    this.isLoading = false;
                    if (res.code !=0) return;
                    successTips(this);
                    this.$router.go(-1)
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        }
    }
}
</script>
<style lang="scss" scoped>
    @import '../content/add.scss';
</style>