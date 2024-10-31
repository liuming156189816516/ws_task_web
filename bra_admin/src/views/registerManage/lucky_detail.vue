<template>
  <div>
      <el-form size="small" :inline="true" style="margin-top: 10px;">
        <el-form-item>
            <el-input clearable :placeholder="$t('sys_mat061',{value:$t('sys_c140')})" v-model="lucky_id" />
        </el-form-item>
        <el-form-item>
            <el-input clearable :placeholder="$t('sys_mat061',{value:$t('sys_m068')})" v-model="l_account" />
        </el-form-item>
        <el-form-item>
            <el-date-picker v-model="task_time" type="daterange" :range-separator="$t('sys_c108')" :start-placeholder="$t('sys_c109')" :end-placeholder="$t('sys_c110')" />
        </el-form-item>
        <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="initLuckyList(1)">{{ $t('sys_c002') }}</el-button>
            <el-button icon="el-icon-refresh-right" @click="restQueryBtn">{{ $t('sys_c049') }}</el-button>
        </el-form-item>
      </el-form>
      <!-- 分组管理 -->
      <div class="continer_main">
        <el-table :data="accountDataList" border height="760" v-loading="loading" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255,1)" style="width: 100%;" :header-cell-style="{ color: '#909399', textAlign: 'center' }" :cell-style="{ textAlign: 'center' }" ref="serveTable" @selection-change="handleSelectionChange" @row-click="rowSelectChange">
            <el-table-column type="index" :label="$t('sys_g020')" width="80" />
            <el-table-column prop="id" :label="$t('sys_c140')" minWidth="130" />
            <el-table-column prop="type" :label="$t('sys_c141')" minWidth="130">
                <template slot-scope="scope">
                    <span>{{luckyOption[scope.row.type]}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="l_account" :label="$t('sys_m068')" minWidth="130" />
            <el-table-column prop="f_account" :label="$t('sys_q134')" minWidth="130" />
            <!-- <el-table-column prop="type" :label="$t('sys_c005')" minWidth="130">
                <template slot="header">
                    <el-dropdown trigger="click" size="medium " @command="(command) => handleNewwork(command)">
                    <span style="color:#909399" :class="[task_type?'dropdown_title':'']"> {{ $t('sys_c005') }}
                        <i class="el-icon-arrow-down el-icon--right" />
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item :class="{'dropdown_selected':idx==task_type}" v-for="(item,idx) in taskOption" :key="idx" :command="idx">{{ item==''?$t('sys_l053'):$t(item) }}</el-dropdown-item>
                    </el-dropdown-menu>
                    </el-dropdown>
                </template>
                <template slot-scope="scope">
                    <el-tag size="small" :type="scope.row.status==1?'success':'danger'"> {{ $t(taskOption[scope.row.status]) }}</el-tag>
                </template>
            </el-table-column> -->
            <!-- <el-table-column prop="num" :label="$t('sys_m076')" minWidth="130" /> -->
            <!-- <el-table-column prop="l_account" :label="$t('sys_m068')" minWidth="100" />
            <el-table-column prop="f_account" :label="$t('sys_q134')" minWidth="100" /> -->
            <el-table-column prop="sys_c008" :label="$t('sys_c008')" minWidth="180">
                <template slot-scope="scope">
                    {{ scope.row.itime > 0 ? $baseFun.resetTime(scope.row.itime * 1000) : "-" }}
                </template>
            </el-table-column>
        </el-table>
        <div class="layui_page">
            <el-pagination background @size-change="handleSizeFun" @current-change="handlePageFun"
                :page-sizes="pageOption" :current-page.sync="page" :page-size="limit"
                layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
      </div>
  </div>
</template>
<script>
import { resetPage } from '@/utils/index'
import { gettaskrecordlist,getlotteryrecordlist } from '@/api/user'
export default {
    data() {
        return {
            page: 1,
            limit: 10,
            total: 0,
            account: "",
            lucky_id: "",
            l_account: "",
            task_time: "",
            loading:false,
            task_type:"",
            checkIdArry:[],
            checkAccount:[],
            accountDataList:[],
            pageOption: resetPage(),
            taskOption:["","sys_m109","sys_m110"],
            luckyOption:["","10","20","幸运奖","200","888","1888"]
        }
    },
    created() {
        // this.initNumberGroup();
        this.initLuckyList();
    },
    methods: {
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
            this.account="";
            this.task_time="";
            this.l_account="";
            this.lucky_id="";
            this.checkAccount = [];
            this.initLuckyList(1)
            // this.$refs.serveTable.clearSelection();
        },
        handleNewwork(type){
            this.task_type = type;
            this.initLuckyList(1)
        },
        initLuckyList(num) {
            this.loading = true;
            this.page = num || this.page;
            const sTime = this.task_time;
            const params = {
                page: this.page,
                limit: this.limit,
                id:this.lucky_id,
                l_account:this.l_account,
                start_time: sTime ? this.$baseFun.mexicoTime(sTime[0], 1) : -1,
                end_time: sTime ? this.$baseFun.mexicoTime(sTime[1], 2) : -1
            }
            getlotteryrecordlist(params).then(res => {
                this.loading = false;
                this.total = res.data.total;
                this.accountDataList = res.data.list || [];
            })
        },
        handleSizeFun(limit){
            this.limit = limit;
            this.initLuckyList(1);
        },
        handlePageFun(page){
            this.page = page;
            this.initLuckyList();
        },
        switchPage({page,size}) {
            this.loading = true;
            if (this.limit != size) {
                this.page = 1;
            }else{
                this.page = page;
            }
            this.limit = size;
            this.initLuckyList();
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
.continer_main {
  width: 100%;
}
</style>
  