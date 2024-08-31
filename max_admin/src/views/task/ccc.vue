<!--  -->
<template>
    <div class='container_coat'>
      <div class="condition_warp select_warp">
        <el-form inline>
          <el-form-item>
            <el-input size="small" v-model="factorModel.card_no" clearable placeholder="请输入提现账号"
              style="width:180px;"></el-input>
          </el-form-item>
          <!-- <el-form-item class="change_new_time">
                      <el-date-picker size="small" v-model="factorModel.dateArry" type="daterange" value-format="yyyy-MM-dd" range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期" style='width:240px'>
                      </el-date-picker>
                  </el-form-item> -->
          <el-form-item>
            <el-button size="small" icon="el-icon-search" type="primary" @click="getPayOrderList(1)">{{ $t('sys_c002')
              }}</el-button>
            <el-button size="small" icon="el-icon-refresh-right" @click="restQueryBtn">{{ $t('sys_c049') }}</el-button>
            <el-button size="small" :disabled="pay_id.length == 0" type="warning" @click="delCardBtn(0, 1)">{{
              $t('sys_rai076', { value: $t('sys_p010') }) }}</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="switch_bar">
        <div class="consun_list handel_area">
          <el-table :data="bannerList" border style="width: 100%" height="700" ref="serveTable" v-loading="loading"
            element-loading-spinner="el-icon-loading" :header-cell-style="{ color: '#909399', textAlign: 'center' }"
            @selection-change="selectAllChange" @row-click="rowSelectChange">
            <el-table-column prop="account" label="拉群账号" width="120" />
            <el-table-column prop="ad_account" label="营销账号" width="120" />
            <el-table-column prop="status" :label="$t('sys_c005')" minWidth="100">
              <template slot="header">
                <el-dropdown trigger="click" size="medium " @command="(command) => handleNewwork(command)">
                  <span style="color:#909399" :class="[factorModel.status ? 'dropdown_title' : '']"> {{ $t('sys_c005') }}
                    <i class="el-icon-arrow-down el-icon--right" />
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item :class="{ 'dropdown_selected': idx == factorModel.status }"
                      v-for="(item, idx) in statusOptions" :key="idx" :command="idx">{{ item }}</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
              <template slot-scope="scope">
                <el-tag size="small" :type="scope.row.status == 2 ? 'success' : scope.row.status == 3 ? 'danger' : ''"> {{
              statusOptions[scope.row.status] }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="members" label="群成员" minWidth="120" />
            <el-table-column prop="member_num" label="群成员数量" minWidth="120" />
            <el-table-column prop="qid" label="群id" width="120" />
            <el-table-column prop="invite_link" label="邀请链接" minWidth="100" />
            <el-table-column prop="reason" label="原因" minWidth="100" />
            <el-table-column prop="itime" :label="$t('sys_c008')" minWidth="160">
              <template slot-scope="scope">
                <div>{{ scope.row.itime > 0 ? $baseFun.resetTime(scope.row.itime * 1000) : "-" }}</div>
              </template>
            </el-table-column>
            <el-table-column width="180" label="操作" align="center" fixed="right">
              <template slot-scope="scope">
                <el-button type="danger" :disabled="scope.row.status == 2 || scope.row.status == 3" size="mini" plain
                  @click="regectBtn(scope.row)">驳回</el-button>
                <el-button :type="scope.row.status == 2 ? 'info' : 'warning'"
                  :disabled="scope.row.status == 2 || scope.row.status == 3 || pay_id.length > 0" size="mini" plain
                  @click="delCardBtn(scope.row, 2)">
                  {{ scope.row.status == 2 ? $t('sys_p008') : $t('sys_p010') }}
                </el-button>
                <!-- <el-button type="danger" size="mini" plain @click="delCardBtn(scope.row,2)">删除</el-button> -->
              </template>
            </el-table-column>
          </el-table>
          <div class="layui_page">
            <el-pagination background @size-change="limitChange" @current-change="offestChange" :page-sizes="pageOption"
              :current-page.sync="factorModel.page" :page-size="factorModel.limit"
              layout="total, sizes, prev, pager, next, jumper" :total="factorModel.total">
            </el-pagination>
          </div>
        </div>
      </div>
      <!-- 新增轮播 -->
      <el-dialog title="驳回" :visible.sync="createModel" :close-on-click-modal="false" width="450px">
        <el-form size="small" :model="sendForm" label-width="100px" :rules="sendRules" ref="sendForm">
          <el-form-item label="备注：" prop="remark">
            <el-input type="textarea" :rows="4" :placeholder="$t('sys_mat061', { value: $t('sys_c071') })"
              v-model="sendForm.remark"></el-input>
          </el-form-item>
          <el-form-item style="text-align:center;margin-left: -110px;">
            <el-button @click="createModel = false">取消</el-button>
            <el-button type="primary" @click="submitSendBtn('sendForm')" :loading="isLoading">确定</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <el-image-viewer v-if="imgModel" :on-close="closeViewer" style="z-index:9999" @click.native="cloneImgpreview"
        :url-list="[viewImg]" />
    </div>
  </template>
  
  <script>
  import { successTips, resetPage } from '@/utils/index'
  import { getwithdrawapprovallist, dowithdrawapproval } from '@/api/pay'
  export default {
    components: { 'el-image-viewer': () => import('element-ui/packages/image/src/image-viewer') },
    data() {
      return {
        statusList: ["待启动", "初始化", "进行中", "失败", "完成", "关闭"],
        factorModel: {
          status: 0,
          card_no: "",
          task_name: "",
          total: 0,
          offset: 1,
          limit: 100
        },
        type: 0,
        pay_id: [],
        viewImg: "",
        loading: false,
        bannerList: [],
        isLoading: false,
        isUpload: false,
        imgModel: false,
        createModel: false,
        sendForm: {
          id: "",
          remark: "",
        },
        pageOption: resetPage(),
        sendRules: {
          remark: [
            { required: true, message: this.$t('sys_mat061', { value: this.$t('sys_c071') }), trigger: 'blur' }
          ]
        }
      }
    },
    computed: {
      lopOption() {
        return ["", this.$t('sys_c026'), this.$t('sys_c025')]
      },
      payOptions() {
        return [this.$t('sys_l053'), this.$t('sys_p007'), this.$t('sys_p008'), this.$t('sys_p015')]
      },
      drawOption() {
        return ["", this.$t('sys_p013'), this.$t('sys_p014')]
      },
      statusOptions(){
        return ["","开始任务","进行中","结算中","已结束"]
      }
    },
    mounted() {
      this.getPayOrderList();
    },
    methods: {
      restQueryBtn() {
        this.factorModel.card_no = "";
        this.getPayOrderList(1)
        this.$refs.serveTable.clearSelection();
      },
      //获取订单列表
      getPayOrderList(num) {
        this.loading = true;
        this.factorModel.page = num ? num : this.factorModel.page;
        let params = {
          page: this.factorModel.page,
          limit: this.factorModel.limit,
          status: this.factorModel.status,
          card_no: this.factorModel.card_no
        }
        getwithdrawapprovallist(params).then(res => {
          this.loading = false;
          this.factorModel.total = res.data.total;
          this.bannerList = res.data.list || [];
        })
      },
      selectAllChange(row) {
        this.pay_id = row.map(item => { return item.id })
      },
      rowSelectChange(row, column, event) {
        let refsElTable = this.$refs.serveTable;
        let findRow = this.pay_id.find(item => item == row.id);
        if (findRow) {
          refsElTable.toggleRowSelection(row, false);
          return;
        }
        refsElTable.toggleRowSelection(row, true);
      },
      handleNewwork(val) {
        this.factorModel.status = val;
        this.getPayOrderList();
      },
      limitChange(val) {
        this.factorModel.limit = val;
        this.getPayOrderList()
      },
      offestChange(val) {
        this.factorModel.offset = val;
        this.getPayOrderList()
      },
      regectBtn(row) {
        this.sendForm.id = row.id;
        this.createModel = true;
        this.$nextTick(() => {
          this.$refs.sendForm.resetFields();
        })
      },
      //添加
      addGroupBtn(val, idx) {
        this.type = idx;
        if (idx == 2) {
          this.sendForm.id = val.id;
          this.sendForm.task_name = val.name;
          this.sendForm.file_url = val.file_url;
          this.sendForm.link = val.link;
          this.sendForm.remark = val.remark;
          this.sendForm.status = val.status;
        }
        this.createModel = true;
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
              this.getPayOrderList()
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
              dowithdrawapproval({ status: 2, ids: type == 1 ? that.pay_id : [val.id] }).then(res => {
                instance.confirmButtonLoading = false;
                if (res.code != 0) return;
                successTips(that)
                that.getPayOrderList()
                done();
              })
            } else {
              done();
            }
          }
        }).catch(() => {
          that.$message({ type: 'info', message: '已取消' });
        });
      }
    },
    watch: {
      createModel(val) {
        if (val == false) {
          this.$refs.sendForm.resetFields();
          this.sendForm.id = "";
          this.sendForm.task_name = "";
          this.sendForm.file_url = "";
          this.sendForm.link = "";
          this.sendForm.remark = "";
          this.sendForm.status = 1;
        }
      }
    },
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