<template>
    <div style="width:100%;height: 100%; float: left; position: relative;">
        <!-- 筛选条件 -->
        <el-form size="small" :inline="true" style="margin-top: 10px;">
            <el-form-item>
                <el-input clearable :placeholder="$t('sys_mat061',{value:$t('sys_m062')})" v-model="account" />
            </el-form-item>
             <el-form-item>
                <el-input clearable :placeholder="$t('sys_mat061',{value:$t('sys_q134')})" v-model="fuser_name" />
            </el-form-item>
             <el-form-item>
                <el-input clearable :placeholder="$t('sys_mat061',{value:$t('sys_g144')})" v-model="user_ip" />
            </el-form-item>
            <el-form-item>
                <el-button type="warning" :disabled="checkIdArry.length==0" icon="el-icon-user" @click="pullBlackBtn(2)">{{ $t('sys_rai076',{value:$t('sys_m107')}) }}</el-button>
                <el-button type="success" :disabled="checkIdArry.length==0" icon="el-icon-user" @click="pullBlackBtn(1)">{{ $t('sys_rai076',{value:$t('sys_c025')}) }}</el-button>
                <el-button type="primary" icon="el-icon-search" @click="initNumberList(1)">{{ $t('sys_c002') }}</el-button>
                <el-button icon="el-icon-refresh-right" @click="restQueryBtn">{{ $t('sys_c049') }}</el-button>
            </el-form-item>
        </el-form>
        <!-- 分组管理 -->
        <div class="continer_main">
            <div class="group_continer">
                <u-table :data="accountDataList" row-key="uid" use-virtual border height="860" v-loading="loading"
                    element-loading-spinner="el-icon-loading" style="width: 100%;" ref="serveTable" showBodyOverflow="title" :total="total" 
                    :page-sizes="pageOption" :page-size="limit" :current-page="page" :pagination-show="true"
                    @selection-change="handleSelectionChange" @row-click="rowSelectChange" @handlePageSize="switchPage">
                    <u-table-column type="selection" width="55" />
                    <u-table-column type="index" :label="$t('sys_g020')" width="60" />
                    <u-table-column prop="head" :label="$t('sys_g021')" minWidth="80">
                        <template slot-scope="scope">
                            <el-avatar v-if="scope.row.head" :src="scope.row.head" />
                            <el-avatar v-else icon="el-icon-user-solid"></el-avatar>
                        </template>
                    </u-table-column>
                    <u-table-column prop="account" :label="$t('sys_m062')" minWidth="130" />
                    <u-table-column prop="ip" :label="$t('sys_g144')" minWidth="100">
                        <template slot-scope="scope">
                            {{ scope.row.ip?scope.row.ip:"-" }}
                        </template>
                    </u-table-column>
                    <u-table-column prop="pwd_str" :label="$t('sys_q126')" minWidth="130" />
                    <u-table-column prop="status" :label="$t('sys_c005')" minWidth="100">
                        <!-- <template slot="header">
                            <el-dropdown trigger="click" size="medium " @command="(command) => handleNewwork(command,1)">
                            <span style="color:#909399" :class="[status?'dropdown_title':'']"> {{ $t('sys_c005') }}
                                <i class="el-icon-arrow-down el-icon--right" />
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item :class="{'dropdown_selected':idx==status}" v-for="(item,idx) in accountOptions" :key="idx" :command="idx">{{ item==''?$t('sys_l053'):item }}</el-dropdown-item>
                            </el-dropdown-menu>
                            </el-dropdown>
                        </template> -->
                        <template slot-scope="scope">
                            <el-tag size="small" :type="scope.row.status==1?'success':'danger'"> {{ $t(accountOptions[scope.row.status]) }}</el-tag>
                        </template>
                    </u-table-column>
                    <u-table-column prop="invite_code" :label="$t('sys_q133')" minWidth="130" />
                    <u-table-column prop="fuser_name" :label="$t('sys_q134')" minWidth="100">
                        <template slot-scope="scope">
                            {{ scope.row.fuser_name?scope.row.fuser_name:"-" }}
                        </template>
                    </u-table-column>
                    <u-table-column prop="level" :label="$t('sys_q136')" minWidth="100">
                        <template slot-scope="scope">
                            {{ scope.row.level?scope.row.level:"-" }}
                        </template>
                    </u-table-column>
                    <u-table-column prop="balance" :label="$t('sys_m099')" minWidth="100">
                        <template slot-scope="scope">
                            {{ scope.row.balance||0 }}
                        </template>
                    </u-table-column>
                    <u-table-column prop="first_login_time" :label="$t('sys_q137')" width="180">
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
import { successTips, resetPage } from '@/utils/index'
import { getappuserlist,blacklist } from '@/api/user'
export default {
    data() {
        return {
            page: 1,
            limit: 100,
            total: 0,
            status:"",
            account: "",
            user_ip: "",
            fuser_name: "",
            loading:false,
            checkIdArry:[],
            accountDataList:[],
            pageOption: resetPage(),
            accountOptions:["","sys_l023","sys_c026"]
        }
    },
    computed: {},
    created() {
        // this.initNumberGroup();
        this.initNumberList();
    },
    methods: {
        handleSelectionChange(row) {
            this.checkIdArry = row.map(item => { return item.uid })
        },
        rowSelectChange(row) {
            let tableCell = this.$refs.serveTable;
            if (this.checkIdArry.includes(row.uid)) {
                tableCell.toggleRowSelection([{row:row,selected:false}]);
                return;
            }
            tableCell.toggleRowSelection([{row:row,selected:true}]);
        },
        restQueryBtn(){
            this.account="";
            this.user_ip="";
            this.fuser_name="";
            this.initNumberList(1)
            this.$refs.serveTable.clearSelection();
        },
        initNumberList(num) {
            this.loading = true;
            this.page = num || this.page;
            const params = {
                page: this.page,
                limit: this.limit,
                ip:this.user_ip,
                account:this.account,
                fuser_name:this.fuser_name
            }
            getappuserlist(params).then(res => {
                this.loading = false;
                this.total = res.data.total;
                this.accountDataList = res.data.list || [];
            })
        },
        handleSizeFun(limit){
            this.limit = limit;
            this.initNumberList(1);
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
            this.initNumberList();
        },
        pullBlackBtn(val){
            console.log(val);
            let that = this;
            let tips = that.$t('sys_c046',{value:val==2?that.$t('sys_m107'):that.$t('sys_c025')})
            that.$confirm(tips,that.$t('sys_l013'), {
                type: 'warning',
                confirmButtonText: that.$t('sys_c024'),
                cancelButtonText: that.$t('sys_c023'),
                beforeClose: function (action, instance, done) {
                    if (action === 'confirm') {
                    instance.confirmButtonLoading = true;
                        blacklist({ptype:val,ids:that.checkIdArry}).then(res=>{
                            instance.confirmButtonLoading = false;
                            if (res.code != 0) return;
                            that.initNumberList();
                            successTips(that)
                            done();
                        })
                    } else {
                        done();
                        instance.confirmButtonLoading = false;
                    }
                }
            }).catch(() => {
                that.$message({ type: 'info', message: that.$t('sys_c048') });
            })
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
    