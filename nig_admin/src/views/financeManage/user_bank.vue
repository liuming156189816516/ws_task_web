<!--  -->
<template>
	<div class='container_coat'>
		<div class="condition_warp select_warp">
			<el-form inline size="small">
                <el-form-item>
                    <el-input v-model="factorModel.account" clearable placeholder="请输入用户账号" style="width:180px;" />
				</el-form-item>
                <el-form-item>
                    <el-input v-model="factorModel.card_no" clearable placeholder="请输入提现账号/USDT地址" style="width:230px;" />
				</el-form-item>
				<!-- <el-form-item class="change_new_time">
					<el-date-picker size="small" v-model="factorModel.dateArry" type="daterange" value-format="yyyy-MM-dd" range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期" style='width:240px'>
					</el-date-picker>
                </el-form-item> -->
                <el-form-item>
					<el-button size="small" icon="el-icon-search" type="primary" @click="getPayOrderList(1)">{{ $t('sys_c002') }}</el-button>
                    <el-button size="small" icon="el-icon-refresh-right" @click="restQueryBtn">{{ $t('sys_c049') }}</el-button>
                    <el-button size="small" :disabled="pay_id.length==0" type="warning" @click="regectBtn(0,1)">{{ $t('sys_rai076',{value:$t('sys_c010')}) }}</el-button>
                </el-form-item>
			</el-form>
		</div>
		<div class="switch_bar">
			<div class="consun_list handel_area">
				<el-table :data="bannerList" border style="width: 100%" height="700" ref="serveTable" v-loading="loading" element-loading-spinner="el-icon-loading" :header-cell-style="{ color: '#909399', textAlign: 'center' }" @selection-change="selectAllChange" @row-click="rowSelectChange">
					<el-table-column type="selection" width="55"> </el-table-column>
                    <el-table-column prop="app_account" :label="$t('sys_p022')" minWidth="100" align="center" />
                    <el-table-column prop="card_no" :label="$t('sys_p004')" minWidth="120" align="center">
                        <template slot-scope="scope">
                            <el-tooltip class="item" effect="dark" :content="scope.row.card_no" placement="top">
                                <div style="max-width: 200px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">{{ scope.row.card_no||"-" }}</div>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column prop="type" :label="$t('sys_p012')" minWidth="100" align="center">
                        <template slot-scope="scope">
                            {{ drawOption[scope.row.type]||"-"}}
						</template>
                    </el-table-column>
                    <el-table-column prop="payee_name" :label="$t('sys_p003')" minWidth="120" align="center">
                        <template slot-scope="scope">
                            {{ scope.row.payee_name||"-" }}
						</template>
                    </el-table-column>
                    <el-table-column prop="bank_name" :label="$t('sys_l111')" minWidth="140" align="center">
                        <template slot-scope="scope">
                            {{ scope.row.bank_name||"-"}}
						</template>
                    </el-table-column>
                    <!-- <el-table-column prop="bank_name" :label="$t('sys_p003')" minWidth="100" align="center">
                        <template slot-scope="scope">
                            {{ scope.row.bank_name||"-" }}
						</template>
                    </el-table-column> -->
                    <el-table-column prop="status" :label="$t('sys_c005')" minWidth="100">
                        <template slot="header">
                            <el-dropdown trigger="click" size="medium " @command="(command) => handleNewwork(command)">
                            <span style="color:#909399" :class="[factorModel.status?'dropdown_title':'']"> {{ $t('sys_c005') }}
                                <i class="el-icon-arrow-down el-icon--right" />
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item :class="{'dropdown_selected':idx==factorModel.status}" v-for="(item,idx) in payOptions" :key="idx" :command="idx">{{ item==''?$t('sys_l053'):item }}</el-dropdown-item>
                            </el-dropdown-menu>
                            </el-dropdown>
                        </template>
                        <template slot-scope="scope">
                            <el-tag size="small" :type="scope.row.status==1?'success':'danger'"> {{ payOptions[scope.row.status]||"-" }}</el-tag>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column prop="apy_status" :label="$t('sys_rai129')" minWidth="100">
                        <template slot="header">
                            <el-dropdown trigger="click" size="medium " @command="(command) => handleApply(command)">
                            <span style="color:#909399" :class="[factorModel.apy_status?'dropdown_title':'']"> {{ $t('sys_rai129') }}
                                <i class="el-icon-arrow-down el-icon--right" />
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item :class="{'dropdown_selected':idx==factorModel.apy_status}" v-for="(item,idx) in applyOption" :key="idx" :command="idx">{{ item==''?$t('sys_l053'):item }}</el-dropdown-item>
                            </el-dropdown-menu>
                            </el-dropdown>
                        </template>
                        <template slot-scope="scope">
                            <el-tag size="small" :type="scope.row.approval_status==2?'success':scope.row.approval_status==3?'danger':'info'"> {{ applyOption[scope.row.approval_status] }}</el-tag>
                        </template>
                    </el-table-column> -->
                    <!-- <el-table-column prop="remark" :label="$t('sys_p017')+$t('sys_c071')" minWidth="140">
                        <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" :content="scope.row.remark" placement="top">
                            <div style="max-width: 200px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">{{ scope.row.remark||"-" }}</div>
                        </el-tooltip>
                        </template>
                    </el-table-column> -->
                    <el-table-column prop="itime" :label="$t('sys_c008')" minWidth="120" align="center">
                        <template slot-scope="scope">
                            {{scope.row.itime>0?$baseFun.resetTime(scope.row.itime*1000):"~" }}
                        </template>
                    </el-table-column>
				</el-table>
                <div class="layui_page">
                    <el-pagination background @size-change="limitChange" @current-change="offestChange" :page-sizes="pageOption"
                        :current-page.sync="factorModel.page" :page-size="factorModel.limit" layout="total, sizes, prev, pager, next, jumper" :total="factorModel.total">
                    </el-pagination>
                </div>
			</div>
		</div>
        <el-dialog :title="$t('sys_rai076',{value:$t('sys_c010')})" :visible.sync="createModel" :close-on-click-modal="false" width="450px">
			<el-form size="small" :model="sendForm" label-width="100px" :rules="sendRules" ref="sendForm">
                <el-form-item :label="$t('sys_rai125')" prop="replay_type">
                    <el-radio-group v-model="sendForm.replay_type">
                        <el-radio :label="idx" v-for="(item,idx) in payOptions" :key="idx" v-if="item">{{ item }}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <!-- <el-form-item label="备注：" prop="remark" v-if="sendForm.replay_type==1">
                    <el-input v-model="sendForm.remark" type="textarea" :rows="4" :placeholder="$t('sys_mat061',{value:$t('sys_c071')})"></el-input>
                </el-form-item> -->
                <el-form-item style="text-align:center;margin-left: -110px;">
                    <el-button @click="createModel=false">取消</el-button>
                    <el-button type="primary" @click="submitSendBtn('sendForm')" :loading="isLoading">确定</el-button>
                </el-form-item>
			</el-form>
		</el-dialog>
        <el-image-viewer v-if="imgModel" :on-close="closeViewer" style="z-index:9999" @click.native="cloneImgpreview" :url-list="[viewImg]" />
	</div>
</template>

<script>
import { successTips, resetPage } from '@/utils/index'
import { dowithdrawapproval,getwithdrawcardlist,doapprovalcard } from '@/api/pay'
export default {
    components: {'el-image-viewer': () => import('element-ui/packages/image/src/image-viewer') },
	data() {
		return {
			factorModel:{
                total:0,
                offset:1,
                limit: 10,
                status:0,
                card_no:"",
                account:""
            },
            type:0,
            pay_id:[],
            viewImg:"",
            loading:false,
            bannerList:[],
            isLoading:false,
            isUpload:false,
            imgModel:false,
            createModel:false,
            sendForm:{
				id:"",
                remark:"",
                replay_type:1
            },
            bounty_amount:0,
            pageOption: resetPage(),
            sendRules:{
                remark: [
                    { required: true, message:this.$t('sys_mat061',{value:this.$t('sys_c071')}), trigger: 'blur' },
                ],
                replay_type: [
                    { required: true, message:this.$t('sys_mat061',{value:this.$t('sys_c071')}), trigger: 'change' },
                ]
            },
            applyOption:["",this.$t('sys_rai126'),this.$t('sys_rai127'),this.$t('sys_rai128')]
		}
	},
    computed: {
        lopOption() {
            return ["",this.$t('sys_c026'),this.$t('sys_c025')]
        },
        payOptions(){
            return ["",this.$t('sys_l023'),this.$t('sys_c026')]
        },
        drawOption(){
            return ["",this.$t('sys_p013'),this.$t('sys_p021')]
        }
    },
	mounted() {
        this.getPayOrderList();
	},
	methods: {
        restQueryBtn(){
            this.factorModel.status="";
            this.factorModel.card_id="";
            this.factorModel.card_no="";
            this.factorModel.account="";
            this.getPayOrderList(1)
            this.$refs.serveTable.clearSelection();
        },
		//获取订单列表
		getPayOrderList(num){
            this.loading =true;
            this.factorModel.page=num?num:this.factorModel.page;
            let params = { 
                id:this.factorModel.card_id,
                page: this.factorModel.page,
                limit: this.factorModel.limit,
                card_no:this.factorModel.card_no,
                status:this.factorModel.status||-1,
                app_account:this.factorModel.account,
            }
			getwithdrawcardlist(params).then(res =>{
                this.loading = false;
                this.factorModel.total=res.data.total;
				this.bannerList = res.data.list || [];
                this.bounty_amount = res.data.total_amount||0;
			})
		},
        selectAllChange(row){
            this.pay_id = row.map(item=>{return item.id})
        },
        rowSelectChange(row, column, event) {
            let refsElTable = this.$refs.serveTable;
            let findRow = this.pay_id.find(item => item == row.id);
            if (findRow) {
                refsElTable.toggleRowSelection(row, false);
                return;
            }
            refsElTable.toggleRowSelection(row,true);
        },
        handleNewwork(val){
            this.factorModel.status=val;
            this.getPayOrderList();
        },
        limitChange(val){
			this.factorModel.limit = val;
			this.getPayOrderList()
        },
        offestChange(val){
			this.factorModel.offset = val;
			this.getPayOrderList()
		},
        regectBtn(row){
            this.sendForm.id=row.id;
            this.createModel = true;
            this.$nextTick(()=>{
                this.$refs.sendForm.resetFields();
            })
        },
        //提交
        submitSendBtn(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
					let data = {
                        ids:this.pay_id,
                        status:this.sendForm.replay_type
					}
                    this.isLoading = true;
					doapprovalcard(data).then(res =>{
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
		delCardBtn(val,type){
			let that = this;
			that.$confirm(this.$t('sys_c046',{value:this.$t('sys_p011')}),this.$t('sys_l013'), {
                type: 'warning',
                confirmButtonText:this.$t('sys_c024'),
                cancelButtonText:this.$t('sys_c023'),
                beforeClose: function (action, instance,done) {
                    if(action === 'confirm') {
                        instance.confirmButtonLoading = true;
                        dowithdrawapproval({status:2,ids:type==1?that.pay_id:[val.id]}).then(res =>{
                            instance.confirmButtonLoading = false;
                            if (res.code !=0) return;
                            successTips(that)
							that.getPayOrderList()
							done();
						})
                    }else{
                        done();
                    }
                }}).catch(() => {
                that.$message({type: 'info',message: '已取消'});          
            });
        }
	}
}
</script>
<style lang="scss" scoped>
    .view_img{
        width: 60px;
        height: 60px;
        display: flex;
        cursor: pointer;
        position: relative;
        img{
            width: 100%;
            height: 100%;
        }
        .cover_bg{
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
            i{
                font-size: 16px;
            }
            .el-icon-view{
                color: #409eff;
            }
            .el-icon-delete{
                color: #f56c6c;
            }
        }
    }
    .view_img:hover .cover_bg{
        opacity: 1;
    }
</style>