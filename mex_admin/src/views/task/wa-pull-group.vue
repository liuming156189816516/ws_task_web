<!--  -->this.checkArr
<template>
  <div class='container_coat'>
    <div class="condition_warp select_warp">
      <el-form size="small" inline>
        <el-form-item>
          <el-button type="primary" :disabled="checkArry.length==0" @click="scamperBtn(0,0)">{{ $t('sys_q111') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-input v-model="model1.user_account" clearable placeholder="请输入用户账号"  style="width:180px;" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="model1.account" clearable placeholder="请输入拉群账号"  style="width:180px;" />
        </el-form-item>
         <el-form-item>
          <el-input v-model="model1.invite_link" clearable placeholder="请输入邀请链接"  style="width:180px;" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="model1.ad_account" clearable placeholder="请输入营销账号"  style="width:180px;" />
        </el-form-item>
        <el-form-item>
          <el-date-picker v-model="model1.ipCtime" value-format="yyyy-MM-dd HH:mm:ss" type="datetimerange" :range-separator="$t('sys_c108')" :start-placeholder="$t('sys_c109')" :end-placeholder="$t('sys_c110')" />
        </el-form-item>
        <!-- <el-form-item>
          <el-button type="warning" :disabled="checkIdArry.length==0" @click="handleGroupBtn(1)">{{ $t('sys_rai081') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="warning" :disabled="checkIdArry.length==0" @click="handleGroupBtn(3)">{{ $t('sys_rai097') }}</el-button>
        </el-form-item> -->
        <!-- <el-form-item>
          <el-button type="danger" :disabled="checkIdArry.length==0" @click="handleGroupBtn(2)">{{ $t('sys_rai082') }}</el-button>
        </el-form-item> -->
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" @click="getTaskList(1)">{{ $t('sys_c002')}}</el-button>
          <el-button icon="el-icon-refresh-right" @click="restQueryBtn">{{ $t('sys_c049') }}</el-button>
          <el-button type="warning" icon="el-icon-download" @click="exportBtn">导出</el-button>
        </el-form-item>
        <el-form-item class="fr">
          自动炸群: <el-switch v-model="auto_scamper" active-text="开启" inactive-text="关闭" @change="handleScamper" />
        </el-form-item>
      </el-form>
    </div>
    <div class="switch_bar">
      <div class="consun_list handel_area">
        <el-table :data="groupTaskList" border style="width: 100%" height="700" ref="serveTable" v-loading="loading"
          element-loading-spinner="el-icon-loading" :header-cell-style="{ color: '#909399', textAlign: 'center' }"
          @selection-change="selectAllChange" @row-click="rowSelectChange">
          <el-table-column type="selection" width="55" />
          <el-table-column prop="app_account" label="用户账号" minWidth="100" />
          <el-table-column prop="account" label="拉群账号" width="140" />
          <el-table-column prop="ad_account" label="营销账号" width="120" />
          <el-table-column prop="task_type" :label="$t('sys_m066')" minWidth="130">
              <template slot="header">
                  <el-dropdown trigger="click" size="medium " @command="(command) => handleNewwork(command,1)">
                  <span style="color:#909399" :class="[model1.task_type?'dropdown_title':'']"> {{ $t('sys_m066') }}
                      <i class="el-icon-arrow-down el-icon--right" />
                  </span>
                  <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item :class="{'dropdown_selected':idx==model1.task_type}" v-for="(item,idx) in taskOption" :key="idx" :command="idx">{{ item==''?$t('sys_l053'):item }}</el-dropdown-item>
                  </el-dropdown-menu>
                  </el-dropdown>
              </template>
              <template slot-scope="scope">
                  {{ taskOption[scope.row.task_type] }}
              </template>
          </el-table-column>
          <el-table-column prop="status" :label="$t('sys_c005')" minWidth="100">
            <template slot="header">
              <el-dropdown trigger="click" size="medium " @command="(command) => handleNewwork(command,2)">
                <span style="color:#909399" :class="[model1.status ? 'dropdown_title' : '']"> {{ $t('sys_c005') }}
                  <i class="el-icon-arrow-down el-icon--right" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item :class="{ 'dropdown_selected': idx == model1.status }"
                    v-for="(item, idx) in statusOptions" :key="idx" :command="idx">{{!item?$t('sys_l053'): item }}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
            <template slot-scope="scope">
              <el-tag size="small" :type="scope.row.status == 2 ? 'success' : scope.row.status == 3 ? 'warning' :scope.row.status == 5 ? 'danger': ''"> {{ statusOptions[scope.row.status] }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="members" label="群成员" minWidth="120" show-overflow-tooltip />
            <!-- <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" :content="scope.row.members" placement="top">
                <div style="width: max-content;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">{{ scope.row.members||"-" }}</div>
              </el-tooltip>
            </template> -->
          <!-- </el-table-column> -->
          <!-- <el-table-column prop="members" label="群成员" minWidth="120">
            <template slot-scope="scope">
              <el-popover width="250" placement="top-start" trigger="hover" :content="scope.row.members">
                <el-input v-model="scope.row.members"></el-input>
              </el-popover>
            </template>
          </el-table-column> -->
          <el-table-column prop="member_num" label="群成员数量" minWidth="120" />
          <el-table-column prop="zq_num" label="炸群次数" minWidth="120" />
          <el-table-column prop="qid" label="群id" minWidth="140">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" :content="scope.row.qid" placement="top">
                <div style="max-width: 200px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">{{ scope.row.qid||"-" }}</div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="invite_link" label="邀请链接" minWidth="120">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" :content="scope.row.invite_link" placement="top">
                <div style="max-width: 200px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">{{ scope.row.invite_link||"-" }}</div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="reason" label="原因" minWidth="140">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" :content="scope.row.reason" placement="top">
                <div style="max-width: 200px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">{{ scope.row.reason||"-" }}</div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="itime" :label="$t('sys_c008')" minWidth="120">
            <template slot-scope="scope">
              <div>{{ scope.row.itime > 0 ? $baseFun.resetTime(scope.row.itime * 1000) : "-" }}</div>
            </template>
          </el-table-column>
          <!-- <el-table-column width="100" label="操作" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button type="danger" :disabled="checkArry.length>0" size="mini" plain @click="scamperBtn(scope.row,1)">炸群</el-button>
            </template>
          </el-table-column> -->
        </el-table>
        <div class="layui_page">
          <el-pagination background @size-change="limitChange" @current-change="offestChange" :page-sizes="pageOption"
            :current-page.sync="model1.page" :page-size="model1.limit"
            layout="total, sizes, prev, pager, next, jumper" :total="model1.total">
          </el-pagination>
        </div>
      </div>
    </div>
    <el-dialog :title="$t('sys_q111')" :visible.sync="dialogVisible" :width="taskForm.group_type==1?'450px':'560px'" center>
      <el-form :model="taskForm" size="small" :rules="taskRules" ref="taskForm" label-width="100px" class="demo-ruleForm">
        <el-form label-width="100px">
          <el-form-item :label="$t('sys_q132')+'：'" prop="group_type">
            <el-radio-group v-model="taskForm.group_type">
              <el-radio :label="1">默认</el-radio>
              <el-radio :label="2">自定义</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <el-form-item v-if="taskForm.group_type==2" :label="$t('sys_rai104')+'：'" prop="relpy_text">
          <el-input type="textarea" clearable v-model="taskForm.relpy_text" :placeholder="$t('sys_g129')" rows="6" />
        </el-form-item>
        <el-form-item>
          <div class="el-item-right">
            <el-button @click="dialogVisible=false">{{ $t('sys_c023') }}</el-button>
            <el-button type="primary" :loading="isLoading" @click="submitForm('taskForm')">{{ $t('sys_c024') }}</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { successTips, resetPage } from '@/utils/index'
import { getcreategroupinfolist,getsysconfig,upsysconfig,groupsendmsg,dooutexcel } from '@/api/task'
export default {
  data() {
    return {
      model1: {
        status: 0,
        total: 0,
        offset: 1,
        limit: 100,
        account: "",
        ipCtime: "",
        user_account: "",
        invite_link: "",
        ad_account: "",
        task_type:""
      },
      taskForm:{
        relpy_type:"",
        relpy_id:"",
        group_type:1,
        relpy_text:"",
      },
      type: 0,
      checkArry:[],
      loading: false,
      auto_scamper:null,
      groupTaskList: [],
      isLoading: false,
      isUpload: false,
      imgModel: false,
      dialogVisible:false,
      pageOption: resetPage()
    }
  },
  computed: {
    statusOptions(){
      return ["","开始任务","进行中","结算中","成功","失败"]
    },
    taskOption(){
      return ["","手动拉群","拉粉","自动拉群"]
    },
    taskRules() {
      return {
        group_type:[{ required: true, message: this.$t('sys_c052'), trigger: 'change' }],
        relpy_text: [{ required: true, message: this.$t('sys_mat021'), trigger: 'blure' },{ max: 2000, message: '最多可输入2000个字符', trigger: 'blur' }],
      }
    }
  },
  mounted() {
    this.getTaskList();
    this.initGroupConfig();
  },
  methods: {
    restQueryBtn() {
      this.model1.status = "";
      this.model1.account = "";
      this.model1.ipCtime = "";
      this.model1.invite_link = "";
      this.model1.task_type = "";
      this.model1.ad_account = "";
      this.model1.user_account = "";
      this.getTaskList(1);
      // this.$refs.serveTable.clearSelection();
    },
    async exportBtn(){
      const sTime = this.model1.ipCtime;
      let start_time = sTime&&sTime.length ? this.$baseFun.mexicoTime(sTime[0],3):-1;
      let end_time = sTime&&sTime.length ? this.$baseFun.mexicoTime(sTime[1],3):-1;
      let params = {
        account: this.model1.account,
        status: this.model1.status||-1,
        invite_link: this.model1.invite_link,
        ad_account: this.model1.ad_account,
        app_account: this.model1.user_account,
        task_type:this.model1.task_type||-1,
        start_time: start_time,
        end_time: end_time
      }
      let { data:{url} } = await dooutexcel(params);
      window.location.href = url;
    },
    //获取订单列表
    getTaskList(num) {
      this.loading = true;
      const sTime = this.model1.ipCtime;
      this.model1.page = num ? num : this.model1.page;
      let start_time = sTime&&sTime.length ? this.$baseFun.mexicoTime(sTime[0],3):-1;
      let end_time = sTime&&sTime.length ? this.$baseFun.mexicoTime(sTime[1],3):-1;
      let params = {
        page: this.model1.page,
        limit: this.model1.limit,
        status: this.model1.status||-1,
        account: this.model1.account,
        invite_link: this.model1.invite_link,
        app_account: this.model1.user_account,
        ad_account: this.model1.ad_account,
        task_type:this.model1.task_type||-1,
        start_time: start_time,
        end_time: end_time
      }
      getcreategroupinfolist(params).then(res => {
        this.loading = false;
        this.model1.total = res.data.total;
        this.groupTaskList = res.data.list || [];
        for (let k = 0; k < this.groupTaskList.length; k++) {
          for (const key in this.groupTaskList[k]) {
            if(!this.groupTaskList[k][key]){
              this.groupTaskList[k][key]="-"
            }
          }
        }
      })
    },
    selectAllChange(row) {
      this.checkArry = row.map(item => { return item.id })
    },
    rowSelectChange(row, column, event) {
      let refsElTable = this.$refs.serveTable;
      let findRow = this.checkArry.find(item => item == row.id);
      if (findRow) {
        refsElTable.toggleRowSelection(row, false);
        return;
      }
      refsElTable.toggleRowSelection(row, true);
    },
    handleNewwork(val,idx) {
      if(idx === 1){
        this.model1.task_type = val;
      }else{
        this.model1.status = val;
      }
      this.getTaskList();
    },
    limitChange(val) {
      this.model1.limit = val;
      this.getTaskList()
    },
    offestChange(val) {
      this.model1.offset = val;
      this.getTaskList()
    },
    regectBtn(row) {
      this.sendForm.id = row.id;
      this.createModel = true;
      this.$nextTick(() => {
        this.$refs.sendForm.resetFields();
      })
    },
    //添加
    scamperBtn(row,type){
      this.taskForm.relpy_type=type;
      this.taskForm.relpy_text=""; 
      if (type == 1) {
        this.taskForm.relpy_id=row.id;
        this.taskForm.relpy_text=row.ad; 
      }
      this.dialogVisible=true;
    },
    async initGroupConfig(){
      const {data:{auto_pull_group}} = await getsysconfig();
      this.auto_scamper = auto_pull_group==1?true:false;
    },
    async handleScamper(e){
      const {code} = await upsysconfig({auto_big_group:-1,auto_pull_group:this.auto_scamper?1:0});
      if (code !=0 ) return;
      this.auto_scamper = e;
      successTips(this)
    },
    submitForm(formName){
          this.$refs[formName].validate((valid) => {
            if (valid) {
              this.isLoading=true;
              let params = {
                ids:this.checkArry,
                ad:this.taskForm.relpy_text
              }
              !params.ad? delete params.ad:"";
              groupsendmsg(params).then(res=>{
                this.isLoading=false;
                if (res.code !=0 ) return;
                successTips(this)
                this.getTaskList(1);
                this.dialogVisible=false;
              })
            } else {
              console.log('error submit!!');
              return false;
            }
          })
        },
    //提交
    submitSendBtn(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = {
            ptype: 2,
            ids: [],
            id: this.sendForm.id,
            remark: this.sendForm.remark
          }
          this.isLoading = true;
          dowithdrawapproval(data).then(res => {
            this.isLoading = false;
            this.getTaskList()
            this.createModel = false;
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      })
    },
    //删除
    delCardBtn(val, type) {
      let that = this;
      that.$confirm(this.$t('sys_c046', { value: this.$t('sys_p011') }), this.$t('sys_l013'), {
        type: 'warning',
        confirmButtonText: this.$t('sys_c024'),
        cancelButtonText: this.$t('sys_c023'),
        beforeClose: function (action, instance, done) {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            dowithdrawapproval({ status: 2, ids: type == 1 ? that.checkArry : [val.id] }).then(res => {
              instance.confirmButtonLoading = false;
              if (res.code != 0) return;
              successTips(that)
              that.getTaskList()
              done();
            })
          } else {
            done();
          }
        }
      }).catch(() => {
        that.$message({ type: 'info', message: '已取消' });
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.view_img {
  width: 60px;
  height: 60px;
  display: flex;
  cursor: pointer;
  position: relative;

  img {
    width: 100%;
    height: 100%;
  }

  .cover_bg {
    opacity: 0;
    width: 100%;
    height: 100%;
    display: flex;
    gap: 8px;
    position: absolute;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, .7);
    transition: all .5s;

    i {
      font-size: 16px;
    }

    .el-icon-view {
      color: #409eff;
    }

    .el-icon-delete {
      color: #f56c6c;
    }
  }
}

.view_img:hover .cover_bg {
  opacity: 1;
}
</style>