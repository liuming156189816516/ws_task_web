<!--  -->
<template>
  <div class='container_coat'>
    <div class="condition_warp select_warp">
      <el-form inline>
        <el-form-item>
          <el-input size="small" v-model="model1.account" clearable placeholder="请输入拉群账号"  style="width:180px;" />
        </el-form-item>
        <el-form-item>
          <el-input size="small" v-model="model1.ad_account" clearable placeholder="请输入营销账号"  style="width:180px;" />
        </el-form-item>
        <el-form-item>
          <el-button size="small" icon="el-icon-search" type="primary" @click="getTaskList(1)">{{ $t('sys_c002')}}</el-button>
          <el-button size="small" icon="el-icon-refresh-right" @click="restQueryBtn">{{ $t('sys_c049') }}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="switch_bar">
      <div class="consun_list handel_area">
        <el-table :data="groupTaskList" border style="width: 100%" height="700" ref="serveTable" v-loading="loading"
          element-loading-spinner="el-icon-loading" :header-cell-style="{ color: '#909399', textAlign: 'center' }"
          @selection-change="selectAllChange" @row-click="rowSelectChange">
          <el-table-column prop="account" label="拉群账号" width="120" />
          <el-table-column prop="ad_account" label="营销账号" width="120" />
          <el-table-column prop="status" :label="$t('sys_c005')" minWidth="100">
            <template slot="header">
              <el-dropdown trigger="click" size="medium " @command="(command) => handleNewwork(command)">
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
              <el-tag size="small" :type="scope.row.status == 2 ? 'success' : scope.row.status == 3 ? 'danger' : ''"> {{
            statusOptions[scope.row.status] }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="members" label="群成员" minWidth="120" />
          <el-table-column prop="member_num" label="群成员数量" minWidth="120" />
          <el-table-column prop="qid" label="群id" minWidth="140" />
          <el-table-column prop="invite_link" label="邀请链接" minWidth="100" />
          <el-table-column prop="reason" label="原因" minWidth="100" />
          <el-table-column prop="itime" :label="$t('sys_c008')" minWidth="120">
            <template slot-scope="scope">
              <div>{{ scope.row.itime > 0 ? $baseFun.resetTime(scope.row.itime * 1000) : "-" }}</div>
            </template>
          </el-table-column>
          <!-- <el-table-column width="180" label="操作" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button type="danger" :disabled="scope.row.status == 2 || scope.row.status == 3" size="mini" plain
                @click="regectBtn(scope.row)">驳回</el-button>
              <el-button :type="scope.row.status == 2 ? 'info' : 'warning'"
                :disabled="scope.row.status == 2 || scope.row.status == 3 || pay_id.length > 0" size="mini" plain
                @click="delCardBtn(scope.row, 2)">
                {{ scope.row.status == 2 ? $t('sys_p008') : $t('sys_p010') }}
              </el-button>
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
  </div>
</template>

<script>
import { successTips, resetPage } from '@/utils/index'
import { getcreategroupinfolist } from '@/api/task'
export default {
  data() {
    return {
      model1: {
        status: 0,
        total: 0,
        offset: 1,
        limit: 100,
        account: "",
        ad_account: "",
      },
      type: 0,
      loading: false,
      groupTaskList: [],
      isLoading: false,
      isUpload: false,
      imgModel: false,
      pageOption: resetPage()
    }
  },
  computed: {
    statusOptions(){
      return ["","开始任务","进行中","结算中","已结束"]
    }
  },
  mounted() {
    this.getTaskList();
  },
  methods: {
    restQueryBtn() {
      this.model1.status = "";
      this.model1.account = "";
      this.model1.ad_account = "";
      this.getTaskList(1)
      // this.$refs.serveTable.clearSelection();
    },
    //获取订单列表
    getTaskList(num) {
      this.loading = true;
      this.model1.page = num ? num : this.model1.page;
      let params = {
        page: this.model1.page,
        limit: this.model1.limit,
        status: this.model1.status||-1,
        account: this.model1.account,
        ad_account: this.model1.ad_account
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
      this.model1.status = val;
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
            dowithdrawapproval({ status: 2, ids: type == 1 ? that.pay_id : [val.id] }).then(res => {
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