<template>
  <div class="container_coat">
    <div class="condition_warp select_warp">
      <el-form inline size="small">
        <el-form-item>
          <el-button :disabled="checkArry.length==0" type="primary" @click="scamperBtn(0,0)">{{
            $t('sys_q111')
          }}
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-input v-model="model1.user_account" clearable placeholder="请输入用户账号" style="width:180px;" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="model1.account" clearable placeholder="请输入拉群账号" style="width:180px;" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="model1.invite_link" clearable placeholder="请输入邀请链接" style="width:180px;" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="model1.ad_account" clearable placeholder="请输入营销账号" style="width:180px;" />
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="model1.ipCtime"
            :end-placeholder="$t('sys_c110')"
            :range-separator="$t('sys_c108')"
            :start-placeholder="$t('sys_c109')"
            type="datetimerange"
          />
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
          <el-button icon="el-icon-search" type="primary" @click="getTaskList(1)">{{ $t('sys_c002') }}</el-button>
          <el-button icon="el-icon-refresh-right" @click="restQueryBtn">{{ $t('sys_c049') }}</el-button>
          <el-button icon="el-icon-download" type="warning" @click="exportBtn">导出</el-button>
        </el-form-item>
        <el-form-item class="fr">
          自动炸群:
          <el-switch v-model="auto_scamper" active-text="开启" inactive-text="关闭" @change="handleScamper" />
        </el-form-item>
      </el-form>
    </div>
    <div class="switch_bar">
      <div class="consun_list handel_area">
        <el-table
          ref="serveTable"
          v-loading="loading"
          :data="groupTaskList"
          :header-cell-style="{ color: '#909399', textAlign: 'center' }"
          border
          element-loading-spinner="el-icon-loading"
          height="700"
          style="width: 100%"
          @selection-change="selectAllChange"
          @row-click="rowSelectChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column label="用户账号" min-width="100" prop="app_account" />
          <el-table-column label="国家" min-width="130" prop="country">
            <template slot="header">
              <el-dropdown size="medium" trigger="click" @command="(command) => handleNewwork(command,'country')">
                <span :class="[model1.country?'dropdown_title':'']" style="color:#909399"> 国家
                  <i class="el-icon-arrow-down el-icon--right" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-for="(item,idx) in countryList"
                    :key="idx"
                    :class="{'dropdown_selected':item.value===model1.country}"
                    :command="item.value"
                  >{{ item.label }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
            <template slot-scope="scope">
              {{ scope.row[scope.column.property] ? getLabelByVal(scope.row[scope.column.property], countryList) : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="拉群账号" prop="account" width="140" />
          <el-table-column label="营销账号" prop="ad_account" width="120" />
          <el-table-column :label="$t('sys_m066')" min-width="130" prop="task_type">
            <template slot="header">
              <el-dropdown size="medium " trigger="click" @command="(command) => handleNewwork(command,'task_type')">
                <span :class="[model1.task_type?'dropdown_title':'']" style="color:#909399"> {{ $t('sys_m066') }}
                  <i class="el-icon-arrow-down el-icon--right" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-for="(item,idx) in taskOption"
                    :key="idx"
                    :class="{'dropdown_selected':idx==model1.task_type}"
                    :command="idx"
                  >{{ item == '' ? $t('sys_l053') : item }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
            <template slot-scope="scope">
              {{ taskOption[scope.row.task_type] }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('sys_c005')" min-width="100" prop="status">
            <template slot="header">
              <el-dropdown size="medium " trigger="click" @command="(command) => handleNewwork(command,'status')">
                <span :class="[model1.status ? 'dropdown_title' : '']" style="color:#909399"> {{ $t('sys_c005') }}
                  <i class="el-icon-arrow-down el-icon--right" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-for="(item, idx) in statusOptions"
                    :key="idx"
                    :class="{ 'dropdown_selected': idx == model1.status }"
                    :command="idx"
                  >{{ !item ? $t('sys_l053') : item }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.status == 2 ? 'success' : scope.row.status == 3 ? 'warning' :scope.row.status == 5 ? 'danger': ''"
                size="small"
              > {{ statusOptions[scope.row.status] }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="群成员" min-width="120" prop="members" show-overflow-tooltip />
          <el-table-column label="数据包" min-width="140" prop="targets">
            <template slot-scope="scope">
              <el-tooltip :content="scope.row.targets" class="item" effect="dark" placement="top">
                <div style="max-width: 200px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">
                  {{ scope.row.targets || '-' }}
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
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
          <el-table-column label="群成员数量" min-width="120" prop="member_num" />
          <el-table-column label="炸群次数" min-width="120" prop="zq_num" />
          <el-table-column label="群id" min-width="140" prop="qid">
            <template slot-scope="scope">
              <el-tooltip :content="scope.row.qid" class="item" effect="dark" placement="top">
                <div style="max-width: 200px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">
                  {{ scope.row.qid || '-' }}
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="邀请链接" min-width="120" prop="invite_link">
            <template slot-scope="scope">
              <el-tooltip :content="scope.row.invite_link" class="item" effect="dark" placement="top">
                <div style="max-width: 200px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">
                  {{ scope.row.invite_link || '-' }}
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="原因" min-width="140" prop="reason">
            <template slot-scope="scope">
              <el-tooltip :content="scope.row.reason" class="item" effect="dark" placement="top">
                <div style="max-width: 200px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">
                  {{ scope.row.reason || '-' }}
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column :label="$t('sys_c008')" min-width="120" prop="itime">
            <template slot-scope="scope">
              <div>{{ scope.row.itime > 0 ? $baseFun.resetTime(scope.row.itime * 1000) : '-' }}</div>
            </template>
          </el-table-column>
          <!-- <el-table-column width="100" label="操作" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button type="danger" :disabled="checkArry.length>0" size="mini" plain @click="scamperBtn(scope.row,1)">炸群</el-button>
            </template>
          </el-table-column> -->
        </el-table>
        <div class="layui_page">
          <el-pagination
            :current-page.sync="model1.page"
            :page-size="model1.limit"
            :page-sizes="pageOption"
            :total="model1.total"
            background
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="limitChange"
            @current-change="offestChange"
          />
        </div>
      </div>
    </div>
    <el-dialog
      :title="$t('sys_q111')"
      :visible.sync="dialogVisible"
      :width="taskForm.group_type==1?'450px':'560px'"
      center
    >
      <el-form
        ref="taskForm"
        :model="taskForm"
        :rules="taskRules"
        class="demo-ruleForm"
        label-width="100px"
        size="small"
      >
        <el-form label-width="100px">
          <el-form-item :label="$t('sys_q132')+'：'" prop="group_type">
            <el-radio-group v-model="taskForm.group_type">
              <el-radio :label="1">默认</el-radio>
              <el-radio :label="2">自定义</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <el-form-item v-if="taskForm.group_type==2" :label="$t('sys_rai104')+'：'" prop="relpy_text">
          <el-input v-model="taskForm.relpy_text" :placeholder="$t('sys_g129')" clearable rows="6" type="textarea" />
        </el-form-item>
        <el-form-item>
          <div class="el-item-right">
            <el-button @click="dialogVisible=false">{{ $t('sys_c023') }}</el-button>
            <el-button :loading="isLoading" type="primary" @click="submitForm('taskForm')">{{
              $t('sys_c024')
            }}
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { successTips, resetPage, getLabelByVal } from '@/utils/index'
import { getcreategroupinfolist, getsysconfig, upsysconfig, groupsendmsg, dooutexcel } from '@/api/task'

export default {
  data() {
    return {
      model1: {
        status: 0,
        total: 0,
        offset: 1,
        limit: 10,
        account: '',
        ipCtime: '',
        user_account: '',
        invite_link: '',
        ad_account: '',
        task_type: '',
        country: ''
      },
      taskForm: {
        relpy_type: '',
        relpy_id: '',
        group_type: 1,
        relpy_text: '',
      },
      type: 0,
      checkArry: [],
      loading: false,
      auto_scamper: null,
      groupTaskList: [],
      isLoading: false,
      isUpload: false,
      imgModel: false,
      dialogVisible: false,
      pageOption: resetPage(),
      countryList: [
        { label: '全部', value: '' },
        { label: '尼日利亚', value: 'Nigeria' },
        { label: '印度', value: 'India' },
      ]
    }
  },
  computed: {
    statusOptions() {
      return ['', '开始任务', '进行中', '结算中', '成功', '失败']
    },
    taskOption() {
      return ['', '拉群', '拉粉']
    },
    taskRules() {
      return {
        group_type: [{ required: true, message: this.$t('sys_c052'), trigger: 'change' }],
        relpy_text: [{ required: true, message: this.$t('sys_mat021'), trigger: 'blure' }, {
          max: 2000,
          message: '最多可输入2000个字符',
          trigger: 'blur'
        }],
      }
    }
  },
  mounted() {
    this.getTaskList();
    this.initGroupConfig();
  },
  methods: {
    restQueryBtn() {
      this.model1.status = '';
      this.model1.account = '';
      this.model1.ipCtime = '';
      this.model1.invite_link = '';
      this.model1.task_type = '';
      this.model1.ad_account = '';
      this.model1.user_account = '';
      this.model1.country = '';
      this.getTaskList(1);
      // this.$refs.serveTable.clearSelection();
    },
    async exportBtn() {
      const sTime = this.model1.ipCtime;
      const start_time = sTime && sTime.length ? this.$baseFun.mexicoTime(sTime[0], 3) : -1;
      const end_time = sTime && sTime.length ? this.$baseFun.mexicoTime(sTime[1], 3) : -1;
      const params = {
        account: this.model1.account,
        status: this.model1.status || -1,
        invite_link: this.model1.invite_link,
        ad_account: this.model1.ad_account,
        app_account: this.model1.user_account,
        task_type: this.model1.task_type || -1,
        start_time: start_time,
        end_time: end_time
      }
      const { data: { url }} = await dooutexcel(params);
      window.location.href = url;
    },
    // 获取订单列表
    getTaskList(num) {
      this.loading = true;
      const sTime = this.model1.ipCtime;
      this.model1.page = num || this.model1.page;
      const start_time = sTime && sTime.length ? this.$baseFun.mexicoTime(sTime[0], 3) : -1;
      const end_time = sTime && sTime.length ? this.$baseFun.mexicoTime(sTime[1], 3) : -1;
      const params = {
        page: this.model1.page,
        limit: this.model1.limit,
        status: this.model1.status || -1,
        account: this.model1.account,
        invite_link: this.model1.invite_link,
        app_account: this.model1.user_account,
        ad_account: this.model1.ad_account,
        task_type: this.model1.task_type || -1,
        country: this.model1.country ,
        start_time: start_time,
        end_time: end_time
      }
      getcreategroupinfolist(params).then(res => {
        this.loading = false;
        this.model1.total = res.data.total;
        this.groupTaskList = res.data.list || [];
        for (let k = 0; k < this.groupTaskList.length; k++) {
          for (const key in this.groupTaskList[k]) {
            if (!this.groupTaskList[k][key]) {
              this.groupTaskList[k][key] = '-'
            }
          }
        }
      })
    },
    selectAllChange(row) {
      this.checkArry = row.map(item => {
        return item.id
      })
    },
    rowSelectChange(row, column, event) {
      const refsElTable = this.$refs.serveTable;
      const findRow = this.checkArry.find(item => item == row.id);
      if (findRow) {
        refsElTable.toggleRowSelection(row, false);
        return;
      }
      refsElTable.toggleRowSelection(row, true);
    },
    handleNewwork(val, key) {
      if (key === 'task_type') {
        this.model1.task_type = val;
      } else if (key === 'status') {
        this.model1.status = val;
      } else if (key === 'country') {
        this.model1.country = val;
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
    // 添加
    scamperBtn(row, type) {
      this.taskForm.relpy_type = type;
      this.taskForm.relpy_text = '';
      if (type == 1) {
        this.taskForm.relpy_id = row.id;
        this.taskForm.relpy_text = row.ad;
      }
      this.dialogVisible = true;
    },
    async initGroupConfig() {
      const { data: { auto_pull_group }} = await getsysconfig();
      this.auto_scamper = auto_pull_group == 1;
    },
    async handleScamper(e) {
      const { code } = await upsysconfig({ auto_big_group: -1, auto_pull_group: this.auto_scamper ? 1 : 0 });
      if (code != 0) return;
      this.auto_scamper = e;
      successTips(this)
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.isLoading = true;
          const params = {
            ids: this.checkArry,
            ad: this.taskForm.relpy_text
          }
          !params.ad ? delete params.ad : '';
          groupsendmsg(params).then(res => {
            this.isLoading = false;
            if (res.code != 0) return;
            successTips(this)
            this.getTaskList(1);
            this.dialogVisible = false;
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      })
    },
    // 提交
    submitSendBtn(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const data = {
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
    // 删除
    delCardBtn(val, type) {
      const that = this;
      that.$confirm(this.$t('sys_c046', { value: this.$t('sys_p011') }), this.$t('sys_l013'), {
        type: 'warning',
        confirmButtonText: this.$t('sys_c024'),
        cancelButtonText: this.$t('sys_c023'),
        beforeClose: function(action, instance, done) {
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
    },
    getLabelByVal
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
