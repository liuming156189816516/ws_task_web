<template>
  <div>
    <el-form :inline="true">
      <el-form-item >
        <el-input size="small" clearable v-model="userName" :placeholder="$t('sys_c001')" />
      </el-form-item>
      <el-form-item >
        <el-button size="small" icon="el-icon-search" type="primary" @click="initAccount(1)">{{ $t('sys_c002') }}</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="userList" height="656" border style="width: 100%;margin: 20px 0;" :header-cell-style="{color:'#909399',textAlign:'center'}" :cell-style="{textAlign:'center'}" v-loading="loading"
    element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255,1)">
      <el-table-column prop="account" :label="$t('sys_c003')" minWidth="100" />
      <el-table-column prop="invite_code" :label="$t('sys_q133')" minWidth="80" />
      <el-table-column prop="online_num" :label="$t('sys_p018')" minWidth="100" />
      <el-table-column prop="data_num" :label="$t('sys_p019')" minWidth="100" />
      <el-table-column prop="itime" :label="$t('sys_c008')" minWidth="100">
        <template slot-scope="scope">
          {{ $baseFun.resetTime(scope.row.itime*1000) }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('sys_c010')" width="140">
        <template slot-scope="scope">
          <el-button size="small" type="primary" plain @click="showUserDetail(scope.row)">{{ $t('sys_rai080') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="layui_page">
      <el-pagination background @size-change="setPageSize" @current-change="switchPage" :page-sizes="pageOption"
        :page-size="limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import md5 from "js-md5";
import { getUserInfo } from '@/utils/auth'
import {resetPage,successTips} from "@/utils/index"
import {getuserstatis} from "@/api/user"
export default {
  data() {
    return {
      limit:10,
      offest:1,
      total:0,
      userName:"",
      userList:[],
      loading:false,
      pageOption:resetPage(),
    }
  },
  created(){
    this.initAccount()
  },
  methods:{
   initAccount(num){
      this.offest=num?num:this.offest;
      let params = {
        account_type:2,
        page: this.offest,
        limit: this.limit,
        account: this.userName,
      }
      this.loading=true;
      getuserstatis(params).then(res=>{
        this.loading=false;
        this.total = res.data.total;
        this.userList = res.data.list||[];
      })
    },
    setPageSize(val){
      this.limit = val;
      this.initAccount()
    },
    switchPage(val){
      this.offest = val;
      this.initAccount()
    },
    showUserDetail(row){
      this.$router.push({path:"/user_statistics",query:{id:row.uid}})
    }
  }
}
</script>