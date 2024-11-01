<!--  -->
<template>
	<div class='container_coat'>
		<div class="condition_warp select_warp">
			<el-form inline>
                <el-form-item>
                    <el-input size="small" v-model="factorModel.task_name" clearable placeholder="请输入标题" style="width:180px;"></el-input>
				</el-form-item>
				<!-- <el-form-item class="change_new_time">
					<el-date-picker size="small" v-model="factorModel.dateArry" type="daterange" value-format="yyyy-MM-dd" range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期" style='width:240px'>
					</el-date-picker>
                </el-form-item> -->
                <el-form-item>
					<el-button size="small" type="primary" @click="getNoticeList(1)">查询</el-button>
				</el-form-item>
                <el-form-item style="float:right;">
                    <!-- <el-button size="small" type="danger" :disabled="factorModel.regestId==0" @click="delCardBtn(1,1)">批量删除</el-button> -->
                    <el-button size="small" type="primary" @click="addGroupBtn(0,1)">新增通知</el-button>
				</el-form-item>
			</el-form>
		</div>
		<div class="switch_bar">
			<div class="consun_list handel_area">
				<el-table :data="noticeList" border style="width: 100%" v-loading="loading" ref="serveTable" element-loading-spinner="el-icon-loading" :header-cell-style="{background:'#eef1f6',color:'#606266'}">
					<!-- <el-table-column type="selection" width="55"> </el-table-column> -->
					<el-table-column prop="wx_id" label="序号" width="60">
                        <template slot-scope="scope">
							<span>{{(factorModel.offset-1)*factorModel.limit+scope.$index+1}}</span>
						</template>
                    </el-table-column>
					<el-table-column prop="name" label="标题" minWidth="100" />
					<el-table-column prop="content" label="内容" minWidth="260">
						<template slot-scope="scope">
                            <div v-html="scope.row.content"></div>
						</template>
					</el-table-column>
					<el-table-column prop="status" label="状态" minWidth="80">
						<template slot-scope="scope">
                            <el-tag size="small" :type="scope.row.status==2?'success':'info'"> {{ lopOption[scope.row.status] }}</el-tag>
                            <!-- <span :style="'color:'+(scope.row.status==2?'#67c23a':'#f56c6c')" v-text="lopOption[scope.row.status]"></span> -->
						</template>
					</el-table-column>
                    <el-table-column prop="itime" label="创建时间" width="160">
                        <template slot-scope="scope">
                            {{scope.row.itime>0?$baseFun.resetTime(scope.row.itime*1000):"~" }}
                        </template>
                    </el-table-column>
                    <el-table-column width="160" label="操作" fixed="right">
						<template slot-scope="scope">
							<el-button type="primary" :disabled="scope.row.status==2" size="mini" plain @click="addGroupBtn(scope.row,2)">编辑</el-button>
							<el-button type="danger" size="mini" plain @click="delCardBtn(scope.row,2)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</div>
        <!-- 新增轮播 -->
        <el-dialog :title="type==1?'新增通知':'编辑通知'" :visible.sync="createModel" :close-on-click-modal="false" width="1020px">
			<el-form size="small" :model="sendForm" label-width="140px" :rules="sendRules" ref="sendForm">
                <el-form-item label="通知标题：" prop="task_name">
                    <el-input placeholder="请输入通知标题" v-model="sendForm.task_name" style="width:100%;"></el-input>
                </el-form-item>
                <el-form-item label="状态：" prop="status">
                    <el-radio-group v-model="sendForm.status">
                        <el-radio :label="idx" v-for="(item,idx) in lopOption" :key="idx" v-show="idx!=0">{{ item }}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="内容：" prop="mesContent">
                    <!-- <el-input type="textarea" rows="6" placeholder="请输入内容" v-model="sendForm.content"></el-input> -->
                    <vue-editor ref="editorEle" v-model="sendForm.mesContent" useCustomImageHandler :editorOptions="editorOption" @image-added="handleImageAdded" />
                </el-form-item>
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
import { successTips } from '@/utils/index'
import { materialFile } from '@/api/article'
import { getmessagelist,domessage } from '@/api/banner'
import { VueEditor,Quill } from "vue2-editor";
import ImageResize from 'quill-image-resize-module'
import { ImageDrop } from 'quill-image-drop-module';
Quill.register('modules/imageDrop', ImageDrop)
Quill.register('modules/imageResize', ImageResize)
export default {
    components: {VueEditor,'el-image-viewer': () => import('element-ui/packages/image/src/image-viewer') },
	data() {
		return {
			statusList:["待启动","初始化","进行中","失败","完成","关闭"],
			factorModel:{
                task_name:"",
                total:0,
                offset:1,
                limit: 100,
            },
            type:0,
            viewImg:"",
            loading:false,
            noticeList:[],
            isLoading:false,
            isUpload:false,
            imgModel:false,
            createModel:false,
            sendForm:{
				id:"",
                task_name:"",
                file_url:"",
                link:"",
                content:"",
                status:1,
                mesContent:""
            },
            sendRules:{
                task_name: [
                    { required: true, message:this.$t('sys_mat061',{value:this.$t('sys_mat017')}), trigger: 'blur' }
                ],
				content: [
                    { required: true, message:this.$t('sys_mat061',{value:this.$t('sys_mat019')}), trigger: 'blur' }
                ]
            },
            editorOption: {
                //  富文本编辑器配置
                modules: {
                    //工具栏定义的
                    imageDrop: false,
                    imageResize: {},
                    toolbar: [
                        ["bold", "italic", "underline", "strike"], // 加粗 斜体 下划线 删除线 -----['bold', 'italic', 'underline', 'strike']
                        ["blockquote", "code-block"], // 引用  代码块-----['blockquote', 'code-block']
                        [{ header: 1 }, { header: 2 }], // 1、2 级标题-----[{ header: 1 }, { header: 2 }]
                        [{ list: "ordered" }, { list: "bullet" }], // 有序、无序列表-----[{ list: 'ordered' }, { list: 'bullet' }]
                        [{ script: "sub" }, { script: "super" }], // 上标/下标-----[{ script: 'sub' }, { script: 'super' }]
                        [{ indent: "-1" }, { indent: "+1" }], // 缩进-----[{ indent: '-1' }, { indent: '+1' }]
                        [{ direction: "rtl" }], // 文本方向-----[{'direction': 'rtl'}]
                        [{ size: ["small", false, "large", "huge"] }], // 字体大小-----[{ size: ['small', false, 'large', 'huge'] }]
                        [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题-----[{ header: [1, 2, 3, 4, 5, 6, false] }]
                        [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色-----[{ color: [] }, { background: [] }]
                        [{ font: [] }], // 字体种类-----[{ font: [] }]
                        [{ align: [] }], // 对齐方式-----[{ align: [] }]
                        ["clean"], // 清除文本格式-----['clean']
                        ["image"] // 链接、图片、视频-----['link', 'image', 'video']
                    ]
                },
                //主题
                theme: "snow",
                placeholder: "请输入正文"
            },
            // editorOption: {
            //     modules: {
            //         imageDrop: false,
            //         imageResize: {}
            //     }
            // }
		}
	},
    computed: {
        lopOption() {
            return ["",this.$t('sys_c137'),this.$t('sys_c138')]
        }
    },
	mounted() {
        this.getNoticeList();
	},
	//方法集合
	methods: {
        handleImageAdded(file, Editor, cursorLocation,resetUploader) {
            let extension = file.name.split(".")[1];
            let extensionList = ["png", "jpg"];
            if (extensionList.indexOf(extension) < 0) {
                this.$Message.error('请上传'+extensionList+'格式图片');
                return false;
            }
            let params = new FormData();params.append("file",file);
            materialFile(params).then(res => {
                console.log(res);
                Editor.insertEmbed(cursorLocation,'image',res.data.url);
                resetUploader();
            })
        },
		//初始化消息列表
		getNoticeList(){
            this.loading =true;
			getmessagelist({page:1,limit:100,name:this.factorModel.task_name}).then(res =>{
                this.loading = false;
				this.noticeList = res.data.list || [];
			})
		},
        limitChange(val){
			this.factorModel.limit = val;
			this.getNoticeList()
        },
        offestChange(val){
			this.factorModel.offset = val;
			this.getNoticeList()
		},
        closeViewer(e) {
            this.imgModel = false;
        },
        previewImg(url){
            this.viewImg = url;
            this.imgModel = true;
        },
         //添加
        addGroupBtn(val,idx){
            this.type = idx;
			if(idx == 2){
				this.sendForm.id=val.id;
				this.sendForm.task_name=val.name;
                this.sendForm.mesContent=val.content;
			}
            this.createModel = true;
        },
        //提交
        submitSendBtn(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
					let data = {
						ptype:this.type,
                        status:this.sendForm.status,
                        name:this.sendForm.task_name,
                        content:this.sendForm.mesContent
					}
					this.type==2?data.id=this.sendForm.id:'',
                    this.isLoading = true;
					domessage(data).then(res =>{
                        this.isLoading = false;
						this.getNoticeList()
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
			let tipsText = type==1||type==2?'此操作将删除该通知, 是否继续?':type == 3?'此操作将启动该注册任务, 是否继续?':type == 4?'此操作将关闭该注册任务, 是否继续?':'';
			that.$confirm(tipsText, '提示', {
                type: 'warning',
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                beforeClose: function (action, instance,done) {
                    if(action === 'confirm') {
                        instance.confirmButtonLoading = true;
                        domessage({ptype:3,del_id:[val.id]}).then(res =>{
                            instance.confirmButtonLoading = false;
                            if (res.code !=0) return;
                            successTips(this)
							that.getNoticeList()
							done();
						})
                    }else{
                        done();
                    }
                }}).catch(() => {
                that.$message({type: 'info',message: '已取消'});          
            });
        },
		selectAllChange(row){
			this.factorModel.regestId = row.map(item=>{return item.id})
        },
        cloneImgpreview(e) {
            if (e.target.getAttribute('class') === 'el-image-viewer__mask') {
                this.imgModel = false;
            }
        },
        rowSelectChange(row, column, event) {
            let refsElTable = this.$refs.serveTable;
            let findRow = factorModel.regestId.find(item => item == row.id);
            if (findRow) {
                refsElTable.toggleRowSelection(row, false);
                return;
            }
            refsElTable.toggleRowSelection(row,true);
        }
	},
	watch:{
		createModel(val){
			if(val == false){
                this.sendForm.id="";
				this.sendForm.task_name="";
                this.sendForm.file_url="";
                this.sendForm.link="";
                this.sendForm.content="";
                this.sendForm.mesContent="";
                this.sendForm.status=1;
                this.$refs.editorEle.quill.setText("");
                this.$refs.sendForm.resetFields();
			}
		}
	},
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
