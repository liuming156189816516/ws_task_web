<template>
  <div ref="appEle" style="height: 100%;">
    <el-alert :title="$t('sys_c107')" type="warning" @close="handleClose">
      <template slot>
        <div class="storage_tips" ref="alert_tips">
          <div>{{ $t('sys_c101') }}</div>
          <div>{{ $t('sys_c102') }}</div>
          <div>{{ $t('sys_c103') }}</div>
          <div>{{ $t('sys_c104') }}</div>
          <div>{{ $t('sys_c105') }}</div>
          <div>{{ $t('sys_c106') }}</div>
        </div>
      </template>
    </el-alert>
    <el-form size="small" :inline="true" style="margin-top: 10px;">
      <el-form-item class="select_body">
        <el-input clearable :placeholder="$t('sys_l055')" v-model="model1.file_name" />
      </el-form-item>
      <el-form-item>
        <el-date-picker v-model="model1.ipCtime" type="daterange" :range-separator="$t('sys_c108')" :start-placeholder="$t('sys_c109')" :end-placeholder="$t('sys_c110')" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="initDatalist(1)">{{$t('sys_c002')}}</el-button>
      </el-form-item>
      <el-form-item class="el-item-right">
        <el-button type="danger" :disabled="checkIdArry.length==0" @click="batchDel">{{ $t('sys_l048') }}</el-button>
        <el-button type="warning" :disabled="checkIdArry.length==0" @click="exportModel=true">{{ $t('sys_mat050') }}</el-button>
        <el-button type="success" style="margin-left: 10px;" @click="batchExport"> {{ $t('sys_c111') }}</el-button>
      </el-form-item>
    </el-form>
    <div class="group_main">
      <div class="tab_check_warp">
        <i slot="reference" class="el-icon-info"></i>
        <div v-html="$t('sys_mat007',{value:checkIdArry.length})"></div>
      </div>
      <div>
        <el-table :data="dataList" border :height="autoHeight" row-key="id" v-loading="loading" element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(255, 255, 255,1)" style="width: 100%;" ref="serveTable"
          :header-cell-style="{ color: '#909399', textAlign: 'center' }" :cell-style="{ textAlign: 'center' }"
          @selection-change="handleSelectionChange" @row-click="rowSelectChange">
          <el-table-column type="selection" width="55" />
          <el-table-column prop="name" show-overflow-tooltip :label="$t('sys_l056')" minWidth="140" />
          <el-table-column prop="acc_type" :label="$t('sys_l057')" minWidth="100" />
          <el-table-column prop="account_type" :label="$t('sys_l058')" minWidth="100" >
            <template slot-scope="scope">
              <!-- {{ accountOption[scope.row.account_type] }} -->
              {{ deviceOption[scope.row.account_type] }}
            </template>
          </el-table-column>
          <el-table-column prop="status" :label="$t('sys_l059')" minWidth="100">
            <template slot-scope="scope">
              <el-tag :type="scope.row.status==1?'warning':'success'" size="small"> {{ taskOption[scope.row.status] }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="success_num" :label="$t('sys_l060')" minWidth="100" />
          <el-table-column prop="fail_num" :label="$t('sys_l061')" minWidth="100" />
          <el-table-column prop="remark" show-overflow-tooltip :label="$t('sys_l062')" minWidth="100" />
          <el-table-column prop="itime" :label="$t('sys_l063')" minWidth="148">
            <template slot-scope="scope">
              {{ scope.row.itime > 0 ? $baseFun.resetTime(scope.row.itime * 1000) : 0 }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('sys_c010')" width="120">
            <template slot-scope="scope">
              <!-- <el-button size="small" type="primary" @click="moveTable(scope.$index)">
                <i class="el-icon-sort"></i>
              </el-button> -->
              <el-button :disabled="checkIdArry.length > 0" size="small" type="primary" @click.stop="showDetailbtn(scope.row)">{{ $t('sys_l064') }}</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="layui_page">
          <el-pagination background @size-change="homelHandleSize" @current-change="homeHandleCurrent" :page-size="model1.limit"
          :page-sizes="pageOption" :current-page.sync="model1.page" layout="total, sizes, prev, pager, next, jumper" :total="model1.total">
          </el-pagination>
        </div>
      </div>
    </div>
    <!-- 新增-->
    <el-dialog :class="{'custom_dialog':storeIdx==1}" :title="dialog_title" center :visible.sync="storeModel" :close-on-click-modal="false" :width="numModelWidth">
      <el-form ref="accountForm" size="small" :model="accountForm" label-width="0" :rules="accountRules">
        <template v-if="storeIdx==1">
          <el-row>
            <el-col :span="12">
              <div class="export_type">
                <div class="device_type">
                  <h3 class="device_text">{{ $t('sys_l065') }}</h3>
                  <el-button type="primary" icon="el-icon-check" circle></el-button>
                </div>
                <div class="device_desc">
                  {{ $t('sys_m054') }}
                </div>
              </div>
            </el-col>
            <el-col :span="12"></el-col>
          </el-row>
          <el-row>
            <el-col :span="12" v-for="(item,idx) in deviceOption" :key="idx" v-show="item">
              <div class="nummber_type" @click="changeType(idx)">
                <div class="device_type">
                  <h3 class="device_text">{{ item }}</h3>
                  <el-button :type="deviceType==idx?'primary':''" icon="el-icon-check" circle></el-button>
                </div>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-button class="el-item-right" size="small" type="primary" style="margin-top: 10px;" @click="nextbtn">{{ $t('sys_l069') }}</el-button>
            </el-col>
          </el-row>
        </template>
        <template v-else>
          <el-row>
            <el-col :span="24"></el-col>
            <el-col :span="24">
                <el-form-item>
                    <el-steps :active="stepsActive">
                        <el-step :title="$t('sys_c058')" :description="$t('sys_m056')"></el-step>
                        <el-step :title="$t('sys_m055')" :description="$t('sys_m057')"></el-step>
                        <el-step :title="$t('sys_mat034')" :description="$t('sys_m058')"></el-step>
                    </el-steps>
                </el-form-item>
            </el-col>
            <template v-if="stepsActive==1">
                <el-col :span="9">
                    <el-form-item prop="group_id">
                        <div class="label_radius_title">{{ $t('sys_c053') }}</div>
                        <el-select clearable filterable v-model ="accountForm.group_id" :placeholder="$t('sys_c053')" style="width:100%;">
                          <el-option v-for="item in groupOption" :key="item.id" :label="item.name" :value="item.id" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="4" style="margin-left: 22px;">
                  <el-form-item label-width="0">
                    <div class="label_radius_title" style="opacity: 0;">?????</div>
                    <el-popover placement="top" width="260" v-model="visible">
                      <p>
                        <el-input v-model="accountForm.group_name" size="small" maxlength="10" show-word-limit :placeholder="$t('sys_c112')" />
                      </p>
                      <div style="text-align: right; margin: 0">
                        <el-button size="mini" type="text" @click="visible = false">{{ $t('sys_c023') }}</el-button>
                        <el-button type="primary" size="mini" :loading="groupLoading" :disabled="!accountForm.group_name.trim()" @click="addGroup">{{ $t('sys_c024') }}</el-button>
                      </div>
                      <el-button slot="reference" type="success">{{ $t('sys_c113') }}</el-button>
                    </el-popover>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item prop="data_way">
                        <div class="label_radius_title">{{ $t('sys_mat043') }}</div>
                        <el-radio-group v-model="accountForm.data_way">
                            <el-radio :label="idx" v-for="(item,idx) in accountOption" :key="idx" v-show="item!=''">{{ item }}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
                <el-col :span="24" >
                    <el-form-item>
                        <div class="label_radius_title">{{ $t('sys_c058') }}</div>
                        <div>{{ $t('sys_c114') }}</div>
                        <div class="submit_btn">
                            <el-button class="custom_file1" v-if="accountForm.group_id" style="margin-top: 0;">{{ $t('sys_c059') }}
                                <input type="file" ref='uploadclear' @change="checkDataIsUse" id="uploadFile" title=" " />
                            </el-button>
                            <el-button class="custom_file1" v-else style="margin-top: 0;" @click="submitWayBtn('accountForm')">{{ $t('sys_c059') }}</el-button>
                            <span class="export_tips" @click="downLoadTemp">
                                <i class="el-icon-download" />{{ $t('sys_l066') }}
                            </span>
                        </div>
                    </el-form-item>
                </el-col>
                <el-col :span="16">
                    <el-form-item prop="file_name">
                        <div class="label_title">{{ $t('sys_l062') }}</div>
                        <el-input type="text" :placeholder="$t('sys_c037')" v-model="accountForm.remark"  maxlength="20" show-word-limit />
                    </el-form-item>
                </el-col>
            </template>
            <el-col :span="24" v-if="stepsActive==2&&!checkLoading">
              <el-form-item label-width="0" style="margin-bottom: 14px;">
                <div class="upload_img">
                  <img style="width: 140px;height: 140px;margin-bottom: 10px;" src="../../assets/upload_03.png" alt="" srcset="">
                  <template v-if="success_number>0||fail_number>0">
                    <div>{{ $t('sys_c115') }}</div>
                    <div v-html="$t('sys_c116',{s_number:success_number,f_number:fail_number})"></div>
                    <span class="" v-if="success_number==0&&stepsHide" style="display: flex;cursor: pointer; font-size: 12px; align-items: center;color: #209cdf; margin-left: 20px;" @click="exportErrFile">
                      <i class="el-icon-download" />
                      {{ $t('sys_c117') }}
                    </span>
                  </template>
                  <template v-else>
                    <div style="display: flex;align-items: center;">
                      检测中... <img style="width: 20px; height: 20px;margin-left: 10px;" src="../../assets/loading_icon.gif" alt="" srcset="">
                    </div>
                  </template>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label-width="0">
                <template v-if="checkLoading">
                  <el-progress :text-inside="true" :stroke-width="14" :percentage="percentage"></el-progress>
                  <div class="upload_img">
                    <img src="../../assets/upload_ing.png" alt="" srcset="">
                  </div>
                </template>
                <div v-if="stepsActive==3&&!checkLoading" class="upload_img">
                  <img src="../../assets/success.png" alt="" srcset="">
                  <div style="font-weight: 600;">{{ $t('sys_c119') }}</div>
                  <div v-html="$t('sys_c118',{s_number:success_number,f_number:fail_number})"></div>
                  <!-- <div>成功导入账号数量{{success_number}}条，失败数据{{fail_number}}条,点击完成或继续上传</div> -->
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item v-if="stepsHide" label-width="0" style="text-align:center;" class="el-item-bottom">
            <el-button v-if="stepsActive==2" @click="storeModel=false">{{ $t('sys_c073') }}</el-button>
            <el-button v-if="stepsActive==3" @click="restUpload">{{ $t('sys_c076') }}</el-button>
            <el-button v-if="stepsActive==2&&success_number>0" type="primary" @click="exportDataBtn('ipForm')">{{ $t('sys_c121') }}</el-button>
            <el-button v-if="stepsActive==3" type="primary" @click="storeModel=false">{{ $t('sys_c075') }}</el-button>
          </el-form-item>
        </template>
      </el-form>
    </el-dialog>

    <!-- 详情-->
    <el-dialog :title="$t('sys_l064')" center :visible.sync="detailModel" :close-on-click-modal="false" width="450">
      <el-table :data="model2.data" border height="540" style="width: 100%;" :header-cell-style="{ color: '#909399', textAlign: 'center' }" :cell-style="{ textAlign: 'center' }">
        <el-table-column prop="account" :label="$t('sys_g027')" minWidth="140" />
        <el-table-column prop="status" :label="$t('sys_l059')" minWidth="100">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status==1?'danger':'success'" size="small"> {{ detailTaskOption[scope.row.status] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="reason" show-overflow-tooltip :label="$t('sys_c071')" minWidth="100" />
      </el-table>
        <div class="layui_page">
          <el-pagination background @size-change="detailHandleSize" @current-change="detailHandleCurrent" :page-sizes="pageOption"
          :page-size="model2.limit" :current-page.sync="model2.page" layout="total, sizes, prev, pager, next, jumper" :total="this.model2.total">
          </el-pagination>
        </div>
    </el-dialog>

    <!-- 导出-->
    <el-dialog :title="$t('sys_mat050')" center :visible.sync="exportModel" :close-on-click-modal="false" width="360px">
      <el-form ref="accountForm" size="small" :model="accountForm" label-width="80px" :rules="accountRules">
        <el-form-item :label="$t('sys_mat055')" prop="export_type">
            <el-select v-model="accountForm.export_type" :placeholder=" $t('sys_c052')">
              <el-option v-for="(item,idx) in exportOption" :key="idx" :label="item" :value="idx" v-show="item!=''" />
            </el-select>
        </el-form-item>
        <el-form-item label-width="0" style="text-align:center;margin-top:40px;" class="el-item-bottom">
          <el-button @click="exportModel = false">{{ $t('sys_c023') }}</el-button>
          <el-button type="primary" :loading="isDownLoading" @click="exportBtn('accountForm')">{{ $t('sys_c024')}}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { successTips,resetPage } from '@/utils/index'
import { getaccountfilelist,getaccountgrouplist,doaccountgroup,checkaccountfile,addaccount,getaccountschedule,getaccountloglist,dooutputaccountlog,dobathdelaccountfile } from '@/api/storeroom'
export default {
  data() {
    return {
      model1: {
        page: 1,
        limit: 10,
        total: 0,
        ipCtime:"",
        file_time: "",
        file_name: "",
      },
      isTips:true,
      autoHeight:null,
      pageOption:resetPage(),
      visible: false,
      loading: false,
      stepsHide: true,
      storeModel: false,
      groupLoading: false,
      checkLoading: false,
      isDownLoading: false,
      numModelWidth:"",
      fail_number:0,
      dialog_title:"",
      dataList: [],
      success_number:0,
      checkIdArry: [],
      groupOption: [],
      success_list: [],
      success_name:"",
      storeIdx:1,
      percentage:0,
      deviceType:2,
      stepsActive:1,
      errFileUrl:"",
      setInter:2000,
      waitTimer:null,
      accountForm: {
        id:"",
        remark: "",
        ip_file: "",
        file_name:"",
        group_id:"",
        group_name:"",
        data_way:1,
        device_type:1,
        export_type:"",
      },
      randomNum:[1,2,4,8,3,8,4,6,3,8],
      detailModel:false,
      exportModel:false,
      model2:{
        id:"",
        page: 1,
        limit: 10,
        total: 0,
        data:[]
      }
    }
  },
  computed: {
    taskOption(){
      return ["",this.$t('sys_mat046'),this.$t('sys_mat047')]
    },
    deviceOption(){
      return ["",this.$t('sys_l067'),this.$t('sys_l068')]
    },
    detailTaskOption(){
      return ["",this.$t('sys_mat048'),this.$t('sys_mat049')]
    },
    exportOption(){
      return ["",this.$t('sys_mat051'),this.$t('sys_mat052'),this.$t('sys_mat053')]
    },
    accountRules(){
      return {
        group_id: [{ required: true, message: this.$t('sys_c052'), trigger: 'change' }],
        export_type: [{ required: true, message: this.$t('sys_c052'), trigger: 'change' }],
      }
    },
    accountOption(){
      return ["",this.$t('sys_mat044'),this.$t('sys_q108')]
    }
  },
  created() {
    this.initGroup();
    this.initDatalist();
  },
  mounted() {
    this.setFullHeight();
    window.addEventListener("resize", this.setFullHeight);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.setFullHeight);
  },
  methods: {
    handleClose(){
      this.isTips = false;
      this.setFullHeight();
    },
    setFullHeight(){
      if(this.isTips){
        this.autoHeight = this.$refs.appEle.clientHeight-360;
      }else{
        this.autoHeight = this.$refs.appEle.clientHeight-180;
      }
    },
    handleSelectionChange(row) {
      this.checkIdArry = row.map(item => { return item.id })
    },
    moveTable(index){
      // if (index > 0) {
      //   const upDate = this.data[index - 1];
      //   this.data.splice(index - 1, 1);
      //   this.data.splice(index, 0, upDate);
      // } else {
      //   alert("已经是第一条，不可上移");
      // }

      // if (index + 1 === this.data.length) {
      //   alert("已经是最后一条，不可下移");
      // } else {
      //   const downDate = this.data[index + 1];
      //   this.data.splice(index + 1, 1);
      //   this.data.splice(index, 0, downDate);
      // }
    },
    rowSelectChange(row, column, event) {
      let tableCell = this.$refs.serveTable;
      if (this.checkIdArry.includes(row.id)) {
          tableCell.toggleRowSelection(row,false);
          return;
      }
      tableCell.toggleRowSelection(row,true);
    },
    initDatalist(num){
      this.loading=true;
      const sTime = this.model1.ipCtime;
      this.model1.page = num || this.model1.page;
      let params = {
        page:this.model1.page,
        limit:this.model1.limit,
        name:this.model1.file_name,
        start_time: sTime ? this.$baseFun.mexicoTime(sTime[0], 1) : -1,
        end_time: sTime ? this.$baseFun.mexicoTime(sTime[1], 2) : -1
      }
      getaccountfilelist(params).then(res => {
        this.loading=false;
        this.model1.total = res.data.total;
        this.dataList = res.data.list || [];
      })
    },
    async initGroup() {
      const { data } = await getaccountgrouplist({ page: 1, limit: 100 });
      this.groupOption = data.list || [];
    },
    async addGroup() {
      this.groupLoading=true;
      const result = await doaccountgroup({ ptype: 1,name: this.accountForm.group_name});
      this.groupLoading=false;
      if (result.code !== 0) return;
      this.visible = false;
      this.initGroup();
      successTips(this)
      setTimeout(()=>{
        this.accountForm.group_id = this.groupOption.filter(item => item.name == this.accountForm.group_name)[0].id;
      },600)
    },
    batchExport(){
      this.storeModel = true;
      this.$nextTick(()=>{
        this.storeIdx=1;
        this.numModelWidth="600px";
        this.dialog_title = this.$t('sys_mat043');
      })
    },
    nextbtn(){
      this.storeIdx = 2;
      this.dialog_title =`${this.$t('sys_l065')}-${this.deviceOption[this.deviceType]}-${this.$t('sys_mat045')}`;
    },
    changeType(idx){
      this.deviceType=idx;
    },
    submitWayBtn(formName) {
      this.$refs[formName].validate(valid=>{})
    },
    async checkDataIsUse() {
      this.errFileUrl = "";
      this.success_list = [];
      this.fail_number = 0;
      this.success_number = 0;
      let files = this.$refs.uploadclear.files[0];
      let formData = new FormData();
      formData.append('file', files);
      formData.append('import_type',this.accountForm.data_way);
      this.stepsHide=false;
      this.stepsActive=2;
      this.$refs.uploadclear.value = null;
      const result = await checkaccountfile(formData);
      this.stepsHide=true;
      if (result.code != 0) return;
      this.errFileUrl = result.data.url;
      this.success_name = result.data.name;
      this.success_list = result.data.success_list;
      this.fail_number = result.data.fail_number;
      this.success_number = result.data.success_number||0;
    },
    async exportDataBtn(){
      let params = {
        name:this.success_name,
        account_type:this.deviceType,
        success_list:this.success_list,
        import_type:this.accountForm.data_way,
        group_id:this.accountForm.group_id,
        remark:this.accountForm.remark
      }
      this.startPercent();
      this.fail_number=0;
      this.success_number=0;
      this.stepsHide=false;
      this.checkLoading = true;
      const result = await addaccount(params);
      if (result.code != 0) return;
      this.waitTimer = setInterval(async ()=>{
        const getResult = await getaccountschedule({id:result.data.id})
        if (getResult.code != 0) return;
        if (getResult.data.up_status == 2) {
            this.checkLoading=false;
            this.stepsActive = 3,
            this.stepsHide=true;
            clearInterval(this.waitTimer);
            this.initDatalist();
            this.fail_number = getResult.data.fail;
            this.success_number = getResult.data.success;
        }
      },this.setInter)    
    },
    restUpload(){
      this.storeIdx=2;
      this.stepsActive = 1;
      this.accountForm.remark="";
      this.accountForm.group_id="";
    },
    startPercent(){
      this.percentage = 0;
      this.progrTimer = setInterval(()=>{
          let curPercent = Number(this.randomNum[Math.floor(Math.random()*this.randomNum.length)]);
          if (this.percentage>=55) {
              if (this.percentage<96) {
                this.percentage++
              }else{
                this.percentage = 99
                clearInterval(this.progrTimer)
              }
          }else{
            this.percentage=this.percentage+curPercent
          }
      },500)
    },
    exportErrFile(){
      window.location.href = this.errFileUrl;
    },
    homelHandleSize(val) {
      this.model1.limit=val;
      this.initDatalist();
    },
    homeHandleCurrent(val) {
      this.model1.page=val;
      this.initDatalist();
    },
    showDetailbtn(row){
      this.model2.data=[];
      this.model2.file_id = row.id;
      this.detailModel = true;
      this.getDetail();
    },
    getDetail(){
      let params = {
        page:this.model2.page,
        limit:this.model2.limit,
        file_id:this.model2.file_id
      }
      getaccountloglist(params).then(res => {
        this.model2.total = res.data.total;
        this.model2.data = res.data.list || [];
      })
    },
    detailHandleSize(val){
      this.model2.limit=val;
      this.getDetail();
    },
    detailHandleCurrent(val){
      this.model2.page=val;
      this.getDetail();
    },
    exportBtn(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.isDownLoading=true;
          dooutputaccountlog({ptype:this.accountForm.export_type,ids:this.checkIdArry}).then(res => {
            this.isDownLoading=false;
            if (res.code != 0) return;
            this.exportModel=false;
            location.href = res.data.url;
          })
        }
      })
    },
    batchDel(){
      let that = this;
			that.$confirm(that.$t('sys_c046',{value:that.$t('sys_c028')}),that.$t('sys_l013'), {
				type: 'warning',
				confirmButtonText:that.$t('sys_c024'),
				cancelButtonText:that.$t('sys_c023'),
				beforeClose: function (action, instance,done) {
					if(action === 'confirm') {
            instance.confirmButtonLoading = true;
						dobathdelaccountfile({ids:that.checkIdArry}).then(res =>{
              instance.confirmButtonLoading = false;
							that.initDatalist();
              successTips(that)
							done();
						})
					}else{
						done();
            instance.confirmButtonLoading = false;
					}
				}
      }).catch(() => {
        that.$message({type: 'info',message:that.$t('sys_c048')});          
      })
    },
    downLoadTemp(){
      var blob = new Blob(["账号,公钥,私钥,消息公钥,消息私钥,号码ID"], { type: 'text/plain' });
      var a = document.createElement('a');
      a.href = window.URL.createObjectURL(blob);
      a.download = "example-wa_export-channe.txt";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(a.href);
    }
  },
  watch:{
    storeModel(val){
      if (!val) {
        this.deviceType=2;
        this.stepsActive=1;
        this.errFileUrl = "";
        this.success_name = 0;
        this.success_list = [];
        this.fail_number = 0;
        this.accountForm.data_way=1;
        this.accountForm.remark="";
        this.accountForm.group_id="";
      }
    },
    exportModel(val){
      if (!val) {
        this.$refs.accountForm.resetFields();
        this.accountForm.export_type="";
      }
    }
  }
}
</script>
<style scoped lang="scss">
  .custom_dialog{
    ::v-deep .el-dialog{
      background-color: #f2f7fa !important;
    }
  }
  .storage_tips {
    font-size: 14px;
    line-height: 1.5;
  }
  .export_type, .nummber_type{
    border: 0.5px solid #eee;
    padding: 8px;
    margin: 10px;
    background: #fff;
    border-radius: 5px;
    .device_type{
      display: flex;
      font-size: 14px;
      align-items: center;
      justify-content: space-between;
      .device_text{
        color: #333;
        font-weight: 700;
      }
      .el-button{
        padding: 6px;
      }
    }
    .device_desc{
      width: 100%;
      font-size: 14px;
      margin-top: 10px;
      line-height: 1.6;
      padding-right: 40px;
      box-sizing: border-box;
    }
  }
  .nummber_type{
    .device_type{
      display: flex;
      gap: 10px;
      justify-content: center;
    }
  }
  .label_radius_title, .label_title{
    color: #606266;
    font-size: 14px;
    font-weight: 700;
    margin-left: 16px;
    position: relative;
    word-break: break-all;
  }
  .label_title{
    margin-left: 0;
  }
  .label_radius_title::after{
    content: "";
    width: 4px;
    height: 4px;
    font-size: 20px;
    border-radius: 50%;
    position: absolute;
    left: -16px;
    top: 50%;
    transform: translateY(-50%);
    background-color: #606266;
  }
  .upload_img{
    width:100%;
    display:flex;
    flex-direction:column;
    align-items:center;
    line-height:30px; 
    margin-top: 10px;
    img{
        width: 280px;
        height: 188px;
        margin: 10px 0;
    }
}
</style>