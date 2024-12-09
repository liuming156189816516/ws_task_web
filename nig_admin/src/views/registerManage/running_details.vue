<template>
    <div style="width:100%;height: 100%; float: left; position: relative;">
        <!-- 筛选条件 -->
        <el-form size="small" :inline="true" style="margin-top: 10px;">
            <el-form-item>
                <el-input clearable :placeholder="$t('sys_mat061',{value:$t('sys_m068')})" v-model="l_account" />
            </el-form-item>
            <el-form-item>
                <el-date-picker v-model="task_time" type="daterange" :picker-options="pickerOptions" :clearable="false" :range-separator="$t('sys_c108')" :start-placeholder="$t('sys_c109')" :end-placeholder="$t('sys_c110')" style="width: 240px;" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="initBillList(1)">{{ $t('sys_c002') }}</el-button>
                <el-button icon="el-icon-refresh-right" @click="restQueryBtn">{{ $t('sys_c049') }}</el-button>
            </el-form-item>
        </el-form>
        <!-- 分组管理 -->
        <div class="continer_main">
            <div class="group_continer">
                <!-- <div class="tab_check_warp">
                    <i slot="reference" class="el-icon-info"></i>
                    <div v-html="$t('sys_mat007',{value:checkIdArry.length})"></div>
                </div> -->
                <u-table :data="accountDataList" border height="760" v-loading="loading"
                    element-loading-spinner="el-icon-loading" style="width: 100%;" ref="serveTable" showBodyOverflow="title" :total="total" 
                    :page-sizes="pageOption" :page-size="limit" :current-page="page" :pagination-show="true" @handlePageSize="switchPage">
                    <u-table-column type="selection" />
                    <u-table-column type="index" :label="$t('sys_g020')" width="60" />
                    <u-table-column prop="task_type" :label="$t('sys_m066')" minWidth="100">
                        <template slot="header">
                            <el-dropdown trigger="click" size="medium " @command="(command) => handleNewwork(command,1)">
                            <span style="color:#909399" :class="[task_type?'dropdown_title':'']"> {{ $t('sys_m066') }}
                                <i class="el-icon-arrow-down el-icon--right" />
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item :class="{'dropdown_selected':idx==task_type}" v-for="(item,idx) in tasksOption" :key="idx" :command="idx">{{ item==''?$t('sys_l053'):item }}</el-dropdown-item>
                            </el-dropdown-menu>
                            </el-dropdown>
                        </template>
                        <template slot-scope="scope">
                            {{ tasksOption[scope.row.task_type]||"-" }}
                        </template>
                    </u-table-column>
                    <u-table-column prop="type" :label="$t('sys_m075')" minWidth="100">
                        <template slot="header">
                            <el-dropdown trigger="click" size="medium " @command="(command) => handleNewwork(command,2)">
                            <span style="color:#909399" :class="[type?'dropdown_title':'']"> {{ $t('sys_m075') }}
                                <i class="el-icon-arrow-down el-icon--right" />
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item :class="{'dropdown_selected':item.value==type}" v-for="(item,idx) in taskOption" :key="idx" :command="item">{{item.lable }}</el-dropdown-item>
                            </el-dropdown-menu>
                            </el-dropdown>
                        </template>
                        <template slot-scope="scope">
                            {{ taskOption.filter(item=>item.value==scope.row.type)[0].lable||"-" }}
                        </template>
                    </u-table-column>
                    <u-table-column prop="amount" :label="$t('sys_m076')" minWidth="130" />
                    <u-table-column prop="l_account" :label="$t('sys_m068')" minWidth="100" />
                    <u-table-column prop="f_account" :label="$t('sys_q134')" minWidth="100">
                        <template slot-scope="scope">
                            {{scope.row.f_account||"-" }}
                        </template>
                    </u-table-column>
                    <u-table-column prop="sys_c008" :label="$t('sys_c008')" width="180">
                        <template slot-scope="scope">
                            {{ scope.row.itime > 0 ? $baseFun.resetTime(scope.row.itime * 1000) : "-" }}
                        </template>
                    </u-table-column>
                    <!-- <u-table-column prop="offline_time" :label="$t('sys_g013')" minWidth="160">
                        <template slot-scope="scope">
                            {{ scope.row.offline_time > 0 ? $baseFun.resetTime(scope.row.offline_time * 1000) : "-" }}
                        </template>
                    </u-table-column> -->
                </u-table>
            </div>
        </div>
    </div>
</template>
<script>
import {resetPage } from '@/utils/index'
import { getbillrecordlist } from '@/api/user'
export default {
    data() {
        return {
            page: 1,
            limit: 10,
            total: 0,
            account: "",
            type:"",
            task_type:"",
            l_account: "",
            choiceDate:"",
            loading:false,
            checkIdArry:[],
            checkAccount:[],
            maxRangeEnd: null, 
            accountDataList:[],
            pageOption: resetPage(),
            task_time:[new Date(),new Date()],
            pickerOptions: {
                onPick: ({ maxDate, minDate }) => {
                    this.choiceDate = minDate.getTime()
                    if (maxDate) {
                        this.choiceDate = ''
                    }
                },
                disabledDate: (time) => {
                    const self = this
                    if (self.choiceDate) {
                        const selectDate = new Date(self.choiceDate)
                        const nowYear = selectDate.getFullYear() // 当前年
                        const nowMonth = selectDate.getMonth() // 当前月
                        const nowDate = selectDate.getDate() // 当前几号
                        const nowDay = selectDate.getDay() // 当前星期几
                        // 本月的开始时间
                        const monthStartDate = new Date(nowYear, nowMonth, 1).getTime()
                        // 本月的结束时间
                        const monthEndDate = new Date(nowYear, nowMonth + 1, 0).getTime()
                        // 本年的开始时间
                        const yearStartDate = new Date(nowYear, 0, 1).getTime()
                        // 本年的结束时间
                        const yearEndDate = new Date(nowYear, 12, 0).getTime()
                        // 本周的开始时间，本周的结束时间
                        const weekStartDate = new Date(nowYear, nowMonth, nowDate - nowDay + 1)
                        const weekEndDate = new Date(nowYear, nowMonth, nowDate + (7 - nowDay))
                        // 前后三天
                        const tStartDate = new Date(nowYear, nowMonth, nowDate - 2)
                        const tEndDate = new Date(nowYear, nowMonth, nowDate + 2)
                        // 此处以不能跨月做示范
                        return time.getTime() < monthStartDate || time.getTime() > monthEndDate
                    }
                }
            }
        }
    },
    computed: {
        taskOption(){
            return [{lable:this.$t('sys_l053'),value:-1},{lable:"加粉赏金",value:1 },{lable:"加粉返佣",value:2 },{lable:"注册赠送",value:3},{lable:"轮盘赏金",value:4},{lable:"签到赏金",value:5},{lable:"下载赏金",value:6},{lable:"人工调整",value:8 },{lable:"提现扣款",value:9 }];
            // return [ {},{lable:"加粉赏金",value:1 },{lable:"加粉返佣",value:2 },{lable:"人工调整",value:8 },{lable:"提现扣款",value:9 }]
        },
        tasksOption(){
            return ["","挂机","拉群","拉粉"]
        }
    },
    created() {
        this.initBillList();
    },
    methods: {
        // 处理日期范围变化
        handleDateChange([startDate]) {
            if (startDate) {
                // 动态设置最大允许选择的结束日期为起始日期 + 1 个月
                const start = new Date(startDate);
                this.maxRangeEnd = new Date(start.setMonth(start.getMonth() + 1));
            } else {
                this.maxRangeEnd = null; // 如果清空选择，取消限制
            }
            },
            // 禁用超过范围的日期
            disabledDate(date) {
            if (!this.task_time[0]) return false; // 如果没有选择起始日期，不禁用任何日期

            const start = new Date(this.task_time[0]); // 起始日期
            const maxEnd = this.maxRangeEnd; // 最大结束日期

            return date < start || date > maxEnd; // 禁用超出范围的日期
        },
        handleNewwork(row,idx){
            if(idx == 1){
                this.task_type = row;
            }else{
                this.type = row.value==-1?"":row.value;
            }
            this.initBillList(1)
        },
        disabledDate(time) {  
            const now = new Date();  
            const currentYear = now.getFullYear();  
            const currentMonth = now.getMonth();  
            const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();  
            const startOfMonth = new Date(currentYear, currentMonth, 1);  
            const endOfMonth = new Date(currentYear, currentMonth, lastDayOfMonth);  
            return time.getTime() < startOfMonth.getTime() || time.getTime() > endOfMonth.getTime();  
        },
        handleSelectionChange(row) {
            this.checkIdArry = row.map(item => { return item.id })
            this.checkAccount = row.map(item => { return item.account })
        },
        rowSelectChange(row) {
            let tableCell = this.$refs.serveTable;
            if (this.checkIdArry.includes(row.id)) {
                tableCell.toggleRowSelection([{row:row,selected:false}]);
                return;
            }
            tableCell.toggleRowSelection([{row:row,selected:true}]);
        },
        restQueryBtn(){
            this.type="";
            this.account="";
            this.task_time="";
            this.l_account="";
            this.task_type="";
            this.checkAccount = [];
            this.initBillList(1)
            this.$refs.serveTable.clearSelection();
        },
        initBillList(num) {
            this.loading = true;
            this.page = num || this.page;
            const sTime = this.task_time;
            const params = {
                page: this.page,
                limit: this.limit,
                account:this.account,
                type:this.type||-1,
                l_account:this.l_account,
                task_type:this.task_type||-1,
                start_time: sTime ? this.$baseFun.mexicoTime(sTime[0], 1) : -1,
                end_time: sTime ? this.$baseFun.mexicoTime(sTime[1], 2) : -1
            }
            getbillrecordlist(params).then(res => {
                this.loading = false;
                this.total = res.data.total;
                this.accountDataList = res.data.list || [];
            })
        },
        handleSizeFun(limit){
            this.limit = limit;
            this.initBillList(1);
        },
        handlePageFun(page){
            this.page = page;
            this.initNumberList();
        },
        switchPage({page,size}) {
            this.loading = true;
            if (this.limit != size) {
                this.page = 1;
            }else{
                this.page = page;
            }
            this.limit = size;
            this.initBillList();
        },
        formatType(type){
          let result = this.taskOption.find(item=> item.value === type);
          return result.lable||""
        }
    },
    watch:{
        closeModel(val){
            if (val == false) {
                this.blockPramse.offest=1;
                if (this.$refs.blockTable) {
                    this.$refs.blockTable.clearSelection();
                }
            }
        },
        setIpModel(val){
            if (val == false) {
                this.$refs.ipForm.resetFields();
                this.ipForm.iptype="";
                this.ipForm.staffCheck=[];
                this.ipForm.group_id="";
                this.ipForm.use_status=1;
                this.ipForm.remock_text="";
            }
        }
    }
}
</script>
<style scoped lang="scss">
::v-deep .el-card__body {
    width: 100%;
    height: 118px;
    display: flex;
    flex-shrink: 0;
    position: relative;
    align-items: center;
    justify-content: space-between;
    -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);

    &>div {
        flex: 1;
    }

    .refsh_icon {
        cursor: pointer;
        color: #409eff;
        position: absolute;
        top: 8px;
        right: 8px;
    }

    .box_card_item {
        display: flex;
        cursor: pointer;
        padding: 6px;
        align-items: center;
        flex-direction: column;

        span {
            font-size: 16px;
        }

        .port_title {
            color: #409eff;
            font-size: 18px;
            margin-bottom: 20px;
        }
    }
}
.level_01{
    display: flex;
    color: #C0C4CC;
    align-items: center;
    width: max-content;
    padding: 0 15px;
    cursor: pointer;
    position: relative;
    border-radius: 4px;
    border: 1px solid #DCDFE6;
    .level_01_1{
        color: #606266;
        font-size: 13px;
        margin-left: 10px;
    }
    .screen_t_02{
        width: 20px;
        height: 20px;
        color: #fff;
        display: flex;
        font-size: 12px;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        margin-left: 5px;
        background-color: #409eff;
    }
    .down_01{
        width: 500px;
        height: 40px;
        position: absolute;
        top: 40px;
        left: 0;
        border-radius: 4px;
        border: solid 1px #dfe4ed;
        background-color: #FFFFFF;
        -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        .down_01_01{
            position: absolute;
            display: block;
            width: 0;
            height: 0;
            border-color: transparent;
            border-style: solid;
            top: -12px;
            left: 20%;
            transform: translateX(-50%);
            margin-right: 3px;
            border-bottom-width: 0;
            border-bottom-color: #e6ebf5;
            border-width: 6px;
            -webkit-filter: drop-shadow(0 2px 12px rgba(0, 0, 0, 0.03));
            filter: drop-shadow(0 2px 12px rgba(0, 0, 0, 0.03));
        }
        .down_01_01::after{
            position: absolute;
            display: block;
            width: 0;
            height: 0;
            border-color: transparent;
            border-style: solid;
        }
    }
}
.level_01:hover{
    border-color: #C0C4CC;
}
.custom_popover{
    .screen_01{
        color: #209cdf;
        display: flex;
        .screen_t_01{
            display: flex;
            opacity: .7;
            align-items: center;
            cursor: pointer;
            i{
                margin-right: 5px;
            }
        }
        .screen_t_01:nth-child(1){
            margin-right: 20px;
        }
        .screen_t_01:hover{
            opacity: 1;
        }
    }
    .select_02{
        .el-icon-close{
            font-size: 14px; 
            color: #f56c6c;
            font-weight: bold;
            cursor: pointer;
        }
    }
}
.level_01_01{
    width: 100%;
    display: flex;
    font-size: 12px;
    margin-bottom: 10px;
    .level_01_02{
        color: #409eff;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 4px 8px;
        border-radius: 4px;
        width: max-content;
        margin-right: 10px;
        background-color: #ecf5ff;
        .el-icon-error{
            color: #409eff;
            font-size: 17px;
            cursor: pointer;
            margin-left: 10px;
        }
    }
}
::v-deep .el-form-item{
    margin-bottom: 10px;
}
::v-deep .el-radio-group {
    margin-top: -2px;
}

::v-deep .el-radio-button:first-child .el-radio-button__inner {
    border-radius: 0;
}


.remark_ext {
    width: 90px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.select_body {
    .select_ele {
        width: 130px;

        ::v-deep .el-input__inner {
            border-right: transparent;
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
        }
    }

    .input_ele {
        width: 202px;

        ::v-deep .el-input__inner {
            border-left: transparent;
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
            border-left: 1px solid #DCDFE6;
        }
    }
}

.continer_main {
    display: flex;
    width: 100%;
    justify-content: space-between;
    .group_mian_hide{
        display: none;
    }
    .group_continer {
        width: 100%;
        overflow-x: auto;
    }
}
.group_tips{
    display: flex;
    color: #f56c6c;
    font-size: 12px;
    align-items: center;
    justify-content: center;
}

.group_head_warp {
    display: flex;
    width: 220px;
    height: 40px;
    flex-shrink: 0;
    position: relative;
    font-size: 14px;
    color: #606266;
    align-items: center;
    padding: 0 8px 0 15px;
    box-sizing: border-box;
    justify-content: space-between;
    background: #f5f7fa;

    .group_head {
        cursor: pointer;
        display: flex;
        align-items: center;

        .el-icon-d-arrow-left {
            color: #409eff;
            font-size: 18px;
            margin-right: 10px;
        }
    }

    .custom_popover {
        position: absolute;
        top: 280px;
        // position: absolute;
        // top: -80px;
    }

    .el-icon-setting {
        margin-left: 10px;
    }

    .group_icon {
        display: flex;

        i {
            cursor: pointer;
        }
    }
}

.group_warp {
    width: 220px;
    max-height: 550px;
    overflow-y: auto;
    flex-shrink: 0;
    flex-wrap: wrap;
    .group_item {
        display: flex;
        width: 100%;
        flex-shrink: 0;
        height: 36px;
        margin-top: 8px;
        cursor: pointer;
        font-size: 14px;
        align-items: center;
        justify-content: space-between;
        padding: 0 8px 0 12px;
        .group_name {
            width: 80%;
            display: flex;
            align-items: center;
            .left_icon {
                margin-right: 6px;
            }
            .group_text {
                max-width: 90%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }

        .el-icon-more,
        .el-icon-delete {
            margin-left: 10px;
            position: relative;

            .del_alert {
                //opacity: 0;
                width: 60px;
                padding: 10px;
                display: flex;
                position: absolute;
                top: 15px;
                left: -22px;
                z-index: 99999;
                border-radius: 4px;
                align-items: center;
                justify-content: center;
                // background-color: darkgreen;
                border: 1px solid #ebeef5;
                ;
                -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
                box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);

                .del_arrow {
                    position: absolute;
                    display: block;
                    width: 0;
                    height: 0;
                    border-color: transparent;
                    border-style: solid;
                    top: -12px;
                    left: 50%;
                    transform: translateX(-50%);
                    margin-right: 3px;
                    border-bottom-width: 0;
                    border-bottom-color: #ebeef5;
                    border-width: 6px;
                    filter: drop-shadow(0 2px 12px rgba(0, 0, 0, .03));
                }
            }
        }
    }

    .group_item:hover {
        background-color: #F5F8FA;
    }

    .group_active {
        background-color: #ebeef5;
    }
}

::v-deep .el-alert--success.is-light,
::v-deep .el-alert--success.is-light .el-alert__description {
    color: #67c23a;
    background-color: #f0f9eb;
}
.close_inherit, .add_inherit{
    display: flex;
    width: 100%;
    justify-content: center;
    .close_desc{
        display: flex;
        height: max-content;
        color: #606266;
        line-height: 1.4;
        font-size: 14px;
        padding: 10px;
        margin: 0 10px;
        border-radius: 10px;
        flex-direction: column;
        border: 1px solid #dcdcdc;
    }
    .footer_btn{
        display: flex;
        margin-top: 20px;
        justify-content: center;
    }
}
.add_inherit{
    justify-content:space-between;
    .table_group{
        display: flex;
        flex-grow: 1;
        flex-direction: column;
    }
    .table_ele{
        width: 100%;
        height: 100%;
        // display: flex;
        flex-grow: 2;
        flex-direction: column;
        .tab_check_warp{
            margin: 12px 0 20px 10px;
        }
    }
}
.seat_class{
    border:1px solid #e0e0e0;
    padding: 10px;
    border-radius: 10px;
    .seat_item{
        display: flex;
        align-items: center; 
        height: 28px; 
        padding: 5px;
        color: #409eff;
        background: #ecf5ff;
        border-radius: 4px;
        border:1px solid #b3d8ff;
    }
}
.loading_icon{
    margin-top: 10px;
}
</style>
<style lang="scss">
.group_continer{
    .el-pagination{
        text-align: left !important;
    }
}
</style>
    