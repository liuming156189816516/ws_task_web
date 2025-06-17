<!-- 提现审批 -->
<template>
  <div class="container_coat">
    <div class="condition_warp select_warp">
      <el-form inline size="small">
        <el-form-item>
          <el-input v-model="factorModel.account" clearable placeholder="请输入用户账号" style="width:180px;" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="factorModel.card_no" clearable placeholder="请输入提现账号" style="width:180px;" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="factorModel.card_id" clearable placeholder="请输入订单号" style="width:180px;" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="factorModel.start_amount" clearable placeholder="开始金额" style="width:110px;" />
          -
          <el-input v-model="factorModel.end_amount" clearable placeholder="结束金额" style="width:110px;" />
        </el-form-item>
        <!-- <el-form-item class="change_new_time">
					<el-date-picker size="small" v-model="factorModel.dateArry" type="daterange" value-format="yyyy-MM-dd" range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期" style='width:240px'>
					</el-date-picker>
                </el-form-item> -->
        <el-form-item>
          <el-button icon="el-icon-search" size="small" type="primary" @click="getPayOrderList(1)">{{
            $t('sys_c002')
          }}
          </el-button>
          <el-button icon="el-icon-refresh-right" size="small" @click="restQueryBtn">{{ $t('sys_c049') }}</el-button>
          <el-button :disabled="pay_id.length==0" size="small" type="warning" @click="regectBtn(0,1)">
            {{ $t('sys_rai076', { value: $t('sys_rai124') }) }}
          </el-button>
        </el-form-item>
        <el-form-item class="fr">
          {{ $t('sys_p006') }}
          <em style="font-size: 16px;font-weight: bold;">{{ $baseFun.moneyCut(bounty_amount || 0) }}</em>
          <!-- <el-button size="small" type="primary" @click="addConfigBtn(0,1)">{{ $t('sys_s006') }}</el-button> -->
        </el-form-item>
        <!-- <el-form-item style="float:right;">
                    <el-button size="small" type="primary" @click="addConfigBtn(0,1)">{{ $t('sys_s006') }}</el-button>
				</el-form-item> -->
      </el-form>
    </div>
    <div class="switch_bar">
      <div class="consun_list handel_area">
        <el-table
          ref="serveTable"
          v-loading="loading"
          :data="bannerList"
          :header-cell-style="{ color: '#909399', textAlign: 'center' }"
          border
          element-loading-spinner="el-icon-loading"
          height="700"
          style="width: 100%"
          @selection-change="selectAllChange"
          @row-click="rowSelectChange"
        >
          <el-table-column :selectable="checkSelectable" type="selection" width="55" />
          <!-- <el-table-column prop="wx_id" label="序号" width="60" align="center">
                        <template slot-scope="scope">
							<span>{{(factorModel.offset-1)*factorModel.limit+scope.$index+1}}</span>
						</template>
                    </el-table-column> -->
          <el-table-column :label="$t('sys_m080')" min-width="140" prop="txid">
            <template slot-scope="scope">
              <el-tooltip :content="scope.row.txid" class="item" effect="dark" placement="top">
                <div style="max-width: 200px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">
                  {{ scope.row.txid || '-' }}
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column :label="$t('sys_c009')" align="center" min-width="120" prop="account" />
          <el-table-column align="center" label="国家" min-width="120" prop="country">
            <template slot="header">
              <el-dropdown trigger="click" @command="(val) => handleRowQuery(val,'country')">
                <span :class="[queryData.country ?'dropdown_title':'']" style="color:#909399">
                  国家<i class="el-icon-arrow-down el-icon--right" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-for="(item,index) in queryData.countryList"
                    :key="index"
                    :class="{'dropdown_selected':item.value===queryData.country}"
                    :command="item.value"
                  >{{ item.label }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
            <template slot-scope="scope">
              <div v-if="scope.row.country">
                {{ getLabelByVal(scope.row.country, queryData.countryList) || '-' }}
              </div>
              <div v-else> - </div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('sys_p012')" align="center" min-width="100" prop="type">
            <template slot-scope="scope">
              {{ drawOption[scope.row.type] }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('sys_p004')" align="center" min-width="100" prop="card_no">
            <template slot-scope="scope">
              <el-tooltip :content="scope.row.card_no" class="item" effect="dark" placement="top">
                <div style="max-width: 200px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">
                  {{ scope.row.card_no || '-' }}
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column :label="$t('sys_l111')" align="center" min-width="120" prop="bank_name">
            <template slot-scope="scope">
              {{ scope.row.bank_name || '-' }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('sys_p005')" align="center" min-width="100" prop="payee_name">
            <template slot-scope="scope">
              {{ scope.row.payee_name || '-' }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('sys_p006')" align="center" min-width="100" prop="amount">
            <template slot-scope="scope">
              {{ scope.row.amount + '(' + scope.row.fiat_amount + ')' || '-' }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('sys_c005')" min-width="100" prop="status">
            <template slot="header">
              <el-dropdown size="medium " trigger="click" @command="(command) => handleNewwork(command)">
                <span :class="[factorModel.status?'dropdown_title':'']" style="color:#909399"> {{ $t('sys_c005') }}
                  <i class="el-icon-arrow-down el-icon--right" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-for="(item,idx) in payOptions"
                    :key="idx"
                    :class="{'dropdown_selected':idx==factorModel.status}"
                    :command="idx"
                  >{{ item == '' ? $t('sys_l053') : item }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
            <template slot-scope="scope">
              <el-tag :type="scope.row.status==2?'success':scope.row.status==3?'danger':'warning'" size="small">
                {{ payOptions[scope.row.status] || '-' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column :label="$t('sys_rai129')" min-width="100" prop="apy_status">
            <template slot="header">
              <el-dropdown size="medium " trigger="click" @command="(command) => handleApply(command)">
                <span :class="[factorModel.apy_status?'dropdown_title':'']" style="color:#909399"> {{
                                                                                                     $t('sys_rai129')
                                                                                                   }}
                  <i class="el-icon-arrow-down el-icon--right" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-for="(item,idx) in applyOption"
                    :key="idx"
                    :class="{'dropdown_selected':idx==factorModel.apy_status}"
                    :command="idx"
                  >{{ item == '' ? $t('sys_l053') : item }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.approval_status==2?'success':scope.row.approval_status==3?'danger':'info'"
                size="small"
              > {{ applyOption[scope.row.approval_status] }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column :label="$t('sys_p017')+$t('sys_c071')" min-width="140" prop="remark">
            <template slot-scope="scope">
              <el-tooltip :content="scope.row.remark" class="item" effect="dark" placement="top">
                <div style="max-width: 200px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">
                  {{ scope.row.remark || '-' }}
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column :label="$t('sys_c008')" align="center" prop="itime" width="160">
            <template slot-scope="scope">
              {{ scope.row.itime > 0 ? $baseFun.resetTime(scope.row.itime * 1000) : '~' }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('sys_p009')" align="center" prop="ptime" width="160">
            <template slot-scope="scope">
              {{ scope.row.ptime > 0 ? $baseFun.resetTime(scope.row.ptime * 1000) : '~' }}
            </template>
          </el-table-column>
          <!-- <el-table-column width="180" label="操作" align="center" fixed="right">
						<template slot-scope="scope">
                            <el-button type="danger" :disabled="scope.row.status!=1||pay_id.length==0" size="mini" plain @click="regectBtn(scope.row)">驳回</el-button>
							<el-button :type="scope.row.status==1?'warning':'info'" :disabled="scope.row.status!=1||pay_id.length==0" size="mini" plain @click="delCardBtn(scope.row,2)">
                                {{ scope.row.status==2?$t('sys_p008'):$t('sys_p010') }}
                            </el-button>
							<el-button type="danger" size="mini" plain @click="delCardBtn(scope.row,2)">删除</el-button>
						</template>
					</el-table-column> -->
        </el-table>
        <div class="layui_page">
          <el-pagination
            :current-page.sync="factorModel.page"
            :page-size="factorModel.limit"
            :page-sizes="pageOption"
            :total="factorModel.total"
            background
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="limitChange"
            @current-change="offestChange"
          />
        </div>
      </div>
    </div>
    <!-- 新增轮播 -->
    <el-dialog
      :close-on-click-modal="false"
      :title="$t('sys_rai076',{value:$t('sys_rai124')})"
      :visible.sync="createModel"
      width="450px"
    >
      <el-form ref="sendForm" :model="sendForm" :rules="sendRules" label-width="100px" size="small">
        <el-form-item :label="$t('sys_rai125')" prop="replay_type">
          <el-radio-group v-model="sendForm.replay_type">
            <el-radio :label="2">通过</el-radio>
            <el-radio :label="3">驳回</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="sendForm.replay_type==1" label="备注：" prop="remark">
          <el-input
            v-model="sendForm.remark"
            :placeholder="$t('sys_mat061',{value:$t('sys_c071')})"
            :rows="4"
            type="textarea"
          />
        </el-form-item>
        <el-form-item style="text-align:center;margin-left: -110px;">
          <el-button @click="createModel=false">取消</el-button>
          <el-button :loading="isLoading" type="primary" @click="submitSendBtn('sendForm')">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-image-viewer
      v-if="imgModel"
      :on-close="closeViewer"
      :url-list="[viewImg]"
      style="z-index:9999"
      @click.native="cloneImgpreview"
    />
  </div>
</template>

<script>
import { successTips, resetPage ,getLabelByVal } from '@/utils/index'
import { getwithdrawapprovallist, dowithdrawapproval, doapproval } from '@/api/pay'

export default {
  components: { 'el-image-viewer': () => import('element-ui/packages/image/src/image-viewer') },
  data() {
    return {
      statusList: ['待启动', '初始化', '进行中', '失败', '完成', '关闭'],
      factorModel: {
        status: 0,
        card_no: '',
        task_name: '',
        account: '',
        apy_status: '',
        total: 0,
        offset: 1,
        limit: 10,
        card_id: '',
        start_amount: '',
        end_amount: ''
      },
      type: 0,
      pay_id: [],
      viewImg: '',
      loading: false,
      bannerList: [],
      isLoading: false,
      isUpload: false,
      imgModel: false,
      createModel: false,
      sendForm: {
        id: '',
        remark: '',
        replay_type: 2
      },
      bounty_amount: 0,
      pageOption: resetPage(),
      sendRules: {
        remark: [
          { required: true, message: this.$t('sys_mat061', { value: this.$t('sys_c071') }), trigger: 'blur' },
        ],
        replay_type: [
          { required: true, message: this.$t('sys_mat061', { value: this.$t('sys_c071') }), trigger: 'change' },
        ]
      },
      applyOption: ['', this.$t('sys_rai126'), this.$t('sys_rai127'), this.$t('sys_rai128')],
      queryData: {
        country: '',
        countryList: [
          { label: '全部',value: '' },
          { label: '尼日利亚',value: 'Nigeria' },
          { label: '印度',value: 'India' },
        ]
      }
    }
  },
  computed: {
    lopOption() {
      return ['', this.$t('sys_c026'), this.$t('sys_c025')]
    },
    payOptions() {
      return ['', this.$t('sys_p007'), this.$t('sys_p008'), this.$t('sys_p017')]
    },
    drawOption() {
      return ['', this.$t('sys_p013'), this.$t('sys_p021')]
    }
  },
  watch: {
    createModel(val) {
      if (val == false) {
        this.$refs.sendForm.resetFields();
        this.sendForm.id = '';
        this.sendForm.task_name = '';
        this.sendForm.file_url = '';
        this.sendForm.link = '';
        this.sendForm.remark = '';
        this.sendForm.status = 1;
      }
    }
  },
  mounted() {
    this.getPayOrderList();
  },
  methods: {
    restQueryBtn() {
      this.factorModel.card_id = '';
      this.factorModel.card_no = '';
      this.factorModel.account = '';
      this.factorModel.apy_status = '';
      this.factorModel.start_amount = '';
      this.factorModel.end_amount = '';
      this.getPayOrderList(1)
      this.$refs.serveTable.clearSelection();
    },
    // 获取订单列表
    getPayOrderList(num) {
      this.loading = true;
      this.factorModel.page = num || this.factorModel.page;
      const params = {
        id: this.factorModel.card_id,
        page: this.factorModel.page,
        limit: this.factorModel.limit,
        status: this.factorModel.status,
        card_no: this.factorModel.card_no,
        account: this.factorModel.account,
        start_amount: Number(this.factorModel.start_amount) || -1,
        end_amount: Number(this.factorModel.end_amount) || -1,
        approval_status: this.factorModel.apy_status || -1,
        country: this.queryData.country || ''
      }
      getwithdrawapprovallist(params).then(res => {
        this.loading = false;
        this.factorModel.total = res.data.total;
        this.bannerList = res.data.list || [];
        this.bounty_amount = res.data.total_amount || 0;
      })
    },
    checkSelectable(row) {
      if (row.status === 1 && row.approval_status == 1) {
        return true
      } else {
        return false
      }
    },
    selectAllChange(row) {
      this.pay_id = row.map(item => {
        return item.id
      })
      if (row.status != 1) {
        for (let k = 0; k < this.pay_id.length; k++) {
          if (this.pay_id[k] == row.id) {
            this.pay_id.splice(k, 1)
          }
        }
      }
    },
    rowSelectChange(row, column, event) {
      const refsElTable = this.$refs.serveTable;
      const findRow = this.pay_id.find(item => item == row.id);
      if (findRow) {
        refsElTable.toggleRowSelection(row, false);
        return;
      }
      if (row.approval_status === 1) {
        refsElTable.toggleRowSelection(row, true);
      }
    },
    handleApply(val) {
      this.factorModel.apy_status = val;
      this.getPayOrderList();
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
    // 添加
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
    // 提交
    submitSendBtn(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const data = {
            ids: this.pay_id,
            approval_status: this.sendForm.replay_type
          }
          this.isLoading = true;
          doapproval(data).then(res => {
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
    },
    // 行内筛选项
    handleRowQuery(val,key) {
      this.queryData[key] = val
      this.getPayOrderList()
    },
  getLabelByVal
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
