<template>
  <el-breadcrumb :separator-icon="ArrowRight" style="margin-bottom: 10px;">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>咨询管理</el-breadcrumb-item>
    <el-breadcrumb-item>咨询列表</el-breadcrumb-item>
  </el-breadcrumb>
  
  <el-button type="primary" :icon="Plus" @click="handleAdd">新增</el-button>
  
  <el-table :data="state.tableData" border stripe style="width: 100%; margin-top: 20px;">
    <el-table-column fixed prop="id" label="编号" width="100" />
    <el-table-column prop="name" label="咨询人" width="120" />
    <el-table-column prop="phone" label="联系电话" width="150" />
    <el-table-column prop="email" label="邮箱" width="200" />
    <el-table-column prop="content" label="咨询内容" width="300" />
    <el-table-column prop="handlerId" label="处理人ID" width="100" />
    <el-table-column prop="reply" label="回复内容" width="300" />
    <el-table-column prop="createTime" label="咨询时间" width="200" />
    <el-table-column prop="replyTime" label="回复时间" width="200" />
    <el-table-column fixed="right" label="操作" min-width="120">
      <template #default="scope">
        <el-button link type="primary" size="small" @click="handleDelete(scope.row)">
          删除
        </el-button>
        <el-button
          link
          type="primary"
          size="small"
          @click="handleEdit(scope.$index, scope.row)"
        >编辑</el-button>
      </template>
    </el-table-column>
  </el-table>
  
  <el-pagination
    background
    layout="prev, pager, next"
    :total="state.total"
    :page-size="state.pageSize"
    @current-change="refreshData"
    style="margin-top: 20px; text-align: right;"
  />
  
  <!-- 编辑窗口 -->
  <el-dialog v-model="state.dialogFormVisible" title="修改咨询信息" width="600">
    <el-form :model="state.form" ref="editFormRef" :rules="editRules">
      <el-form-item label="编号" :label-width="state.formLabelWidth" prop="id">
        <el-input v-model="state.form.id" autocomplete="off" readonly />
      </el-form-item>
      <el-form-item label="咨询人" :label-width="state.formLabelWidth" prop="name">
        <el-input v-model="state.form.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="联系电话" :label-width="state.formLabelWidth" prop="phone">
        <el-input v-model="state.form.phone" autocomplete="off" />
      </el-form-item>
      <el-form-item label="邮箱" :label-width="state.formLabelWidth" prop="email">
        <el-input v-model="state.form.email" autocomplete="off" />
      </el-form-item>
      <el-form-item label="咨询内容" :label-width="state.formLabelWidth" prop="content">
        <el-input v-model="state.form.content" type="textarea" rows="3" autocomplete="off" />
      </el-form-item>
      <el-form-item label="处理人ID" :label-width="state.formLabelWidth" prop="handlerId">
        <el-input v-model="state.form.handlerId" autocomplete="off" />
      </el-form-item>
      <el-form-item label="回复内容" :label-width="state.formLabelWidth" prop="reply">
        <el-input v-model="state.form.reply" type="textarea" rows="3" autocomplete="off" />
      </el-form-item>
      <el-form-item label="咨询时间" :label-width="state.formLabelWidth" prop="createTime">
        <el-date-picker
          v-model="state.form.createTime"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          placeholder="请选择日期时间"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="回复时间" :label-width="state.formLabelWidth" prop="replyTime">
        <el-date-picker
          v-model="state.form.replyTime"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          placeholder="请选择日期时间"
          style="width: 100%"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="state.dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="update(editFormRef)">确认</el-button>
      </div>
    </template>
  </el-dialog>
  
  <!-- 新增窗口 -->
  <el-dialog v-model="state.dialogAddFormVisible" title="新增咨询信息" width="600">
    <el-form :model="state.Addform" ref="addFormRef" :rules="addRules">
      <el-form-item label="咨询人" :label-width="state.formLabelWidth" prop="name">
        <el-input v-model="state.Addform.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="联系电话" :label-width="state.formLabelWidth" prop="phone">
        <el-input v-model="state.Addform.phone" autocomplete="off" />
      </el-form-item>
      <el-form-item label="邮箱" :label-width="state.formLabelWidth" prop="email">
        <el-input v-model="state.Addform.email" autocomplete="off" />
      </el-form-item>
      <el-form-item label="咨询内容" :label-width="state.formLabelWidth" prop="content">
        <el-input v-model="state.Addform.content" type="textarea" rows="3" autocomplete="off" />
      </el-form-item>
      <el-form-item label="处理人ID" :label-width="state.formLabelWidth" prop="handlerId">
        <el-input v-model="state.Addform.handlerId" autocomplete="off" />
      </el-form-item>
      <el-form-item label="回复内容" :label-width="state.formLabelWidth" prop="reply">
        <el-input v-model="state.Addform.reply" type="textarea" rows="3" autocomplete="off" />
      </el-form-item>
      <el-form-item label="咨询时间" :label-width="state.formLabelWidth" prop="createTime">
        <el-date-picker
          v-model="state.Addform.createTime"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          placeholder="请选择日期时间"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="回复时间" :label-width="state.formLabelWidth" prop="replyTime">
        <el-date-picker
          v-model="state.Addform.replyTime"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          placeholder="请选择日期时间"
          style="width: 100%"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="state.dialogAddFormVisible = false">取消</el-button>
        <el-button type="primary" @click="add(addFormRef)">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { reactive, onMounted, ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import axios from "axios";
import type { FormInstance, FormRules } from "element-plus";
import { Plus, ArrowRight } from "@element-plus/icons-vue";

// 定义咨询数据类型接口
interface Consultation {
  id: string | number;
  name: string;
  phone: string;
  email: string;
  content: string;
  handlerId: string;
  reply: string;
  createTime: string;
  replyTime: string;
}

// 定义表单引用
const editFormRef = ref<FormInstance>();
const addFormRef = ref<FormInstance>();

// 定义页面状态
const state = reactive({
  dialogFormVisible: false,
  dialogAddFormVisible: false,
  formLabelWidth: "140px",
  tableData: [] as Consultation[],
  pageNum: 1,
  pageSize: 5,
  total: 0,
  form: {
    id: "",
    name: "",
    phone: "",
    email: "",
    content: "",
    handlerId: "",
    reply: "",
    createTime: "",
    replyTime: "",
  } as Consultation,
  Addform: {
    id: "",
    name: "",
    phone: "",
    email: "",
    content: "",
    handlerId: "",
    reply: "",
    createTime: "",
    replyTime: "",
  } as Consultation,
});

// 编辑表单验证规则
const editRules = reactive<FormRules<Consultation>>({
  id: [
    { required: true, message: "编号不能为空", trigger: "blur" },
    { type: "number", message: "编号必须为数字", trigger: "blur" },
  ],
  name: [{ required: true, message: "咨询人不能为空", trigger: "blur" }],
  phone: [{ required: true, message: "联系电话不能为空", trigger: "blur" }],
  content: [{ required: true, message: "咨询内容不能为空", trigger: "blur" }],
  createTime: [{ required: true, message: "请选择咨询时间", trigger: "blur" }],
});

// 新增表单验证规则
const addRules = reactive<FormRules<Consultation>>({
  name: [{ required: true, message: "咨询人不能为空", trigger: "blur" }],
  phone: [{ required: true, message: "联系电话不能为空", trigger: "blur" }],
  content: [{ required: true, message: "咨询内容不能为空", trigger: "blur" }],
  createTime: [{ required: true, message: "请选择咨询时间", trigger: "blur" }],
});

// 获取咨询数据
const getData = () => {
  // 实际项目中使用接口请求
  // axios({
  //   method: "get",
  //   url: "http://localhost:8080/consultation/pageConsultation",
  //   params: { pageNum: state.pageNum, pageSize: state.pageSize }
  // }).then((res) => {
  //   if (res.data.code === 0) {
  //     state.tableData = res.data.data;
  //     state.total = res.data.count;
  //   } else {
  //     ElMessage.error("加载失败：" + res.data.msg);
  //   }
  // }).catch((err) => {
  //   ElMessage.error("接口请求失败：" + err.message);
  // });

  // 模拟咨询数据（基于consultation.txt）
  const mockData = [
    {
      id: "1",
      name: "张同学",
      phone: "13725964587",
      email: "li_stu@highschool.com",
      content: "高一学生，目前 GPA 3.7，想申请美国 TOP20 本科，需要从哪些方面准备？",
      handlerId: "2",
      reply: "已为您定制 3 年规划方案（邮件发送），包含托福 / SAT 备考时间线",
      createTime: "2024-07-15 09:30:00",
      replyTime: "2024-07-15 11:20:00"
    },
    {
      id: "2",
      name: "陈家长",
      phone: "12578953641",
      email: "chen_parent@work.com",
      content: "孩子雅思模考 5.5 分，目标 6.5 分，请问报班后有一对一辅导吗？",
      handlerId: "2",
      reply: "有的，6.5 分班含 4 次 1 对 1 薄弱项辅导，已电话沟通细节",
      createTime: "2024-07-11 09:20:00",
      replyTime: "2024-07-11 09:20:00"
    },
    {
      id: "3",
      name: "刘同学",
      phone: "13788889999",
      email: "liu_stu@college.com",
      content: "国内高二，成绩中等，想申请澳洲八大，是否需要高考成绩？",
      handlerId: "2",
      reply: "澳洲八大可凭高中成绩申请，无需高考，已发送院校名单",
      createTime: "2024-07-05 11:30:00",
      replyTime: "2024-07-05 14:15:00"
    },
    {
      id: "4",
      name: "张家长",
      phone: "13699990000",
      email: "zhang_p@company.com",
      content: "孩子托福基础差，词汇量不足 2000，报基础班能跟上吗？",
      handlerId: "1",
      reply: "待吴老师回复",
      createTime: "2024-07-01 14:20:00",
      replyTime: "2024-07-02 10:45:00"
    }
  ];
  state.tableData = mockData;
  state.total = mockData.length;
};

// 刷新数据
const refreshData = (page: number) => {
  state.pageNum = page;
  getData();
};

// 显示编辑窗口
const handleEdit = (index: number, row: Consultation) => {
  state.dialogFormVisible = true;
  state.form = JSON.parse(JSON.stringify(row));
};

// 更新咨询信息
const update = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid) => {
    if (valid) {
      // 实际项目中替换为接口请求
      const index = state.tableData.findIndex(item => item.id === state.form.id);
      if (index !== -1) {
        state.tableData[index] = { ...state.form };
        state.dialogFormVisible = false;
        ElMessage.success("修改成功");
      }
      // axios({
      //   method: "post",
      //   url: "http://localhost:8080/consultation/updateConsultation",
      //   data: state.form,
      // }).then((res) => {
      //   if (res.data.code === 0) {
      //     state.dialogFormVisible = false;
      //     getData();
      //     ElMessage.success("修改成功");
      //   } else {
      //     ElMessage.error(res.data.msg);
      //   }
      // });
    }
  });
};

// 新增咨询
const add = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid) => {
    if (valid) {
      // 实际项目中替换为接口请求
      const newId = (Math.max(...state.tableData.map(item => Number(item.id))) + 1).toString();
      const newConsultation = {
        ...state.Addform,
        id: newId
      };
      state.tableData.unshift(newConsultation);
      state.total++;
      state.dialogAddFormVisible = false;
      ElMessage.success("新增成功");
      // axios({
      //   method: "post",
      //   url: "http://localhost:8080/consultation/addConsultation",
      //   data: state.Addform,
      // }).then((res) => {
      //   if (res.data.code === 0) {
      //     state.dialogAddFormVisible = false;
      //     getData();
      //     ElMessage.success("新增成功");
      //   } else {
      //     ElMessage.error(res.data.msg);
      //   }
      // });
    }
  });
};

// 显示新增窗口
const handleAdd = () => {
  state.dialogAddFormVisible = true;
  // 重置表单
  state.Addform = {
    id: "",
    name: "",
    phone: "",
    email: "",
    content: "",
    handlerId: "",
    reply: "",
    createTime: "",
    replyTime: "",
  };
};

// 删除咨询
const handleDelete = (row: Consultation) => {
  ElMessageBox.confirm("确定删除该咨询信息吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    // 实际项目中替换为接口请求
    state.tableData = state.tableData.filter(item => item.id !== row.id);
    state.total--;
    ElMessage.success("删除成功");
    // axios({
    //   method: "post",
    //   url: "http://localhost:8080/consultation/delConsultation",
    //   params: { id: row.id },
    // }).then((res) => {
    //   if (res.data.code === 0) {
    //     ElMessage.success("删除成功");
    //     getData();
    //   } else {
    //     ElMessage.error(res.data.msg);
    //   }
    // });
  });
};

// 页面初始化
onMounted(() => {
  getData();
});
</script>
<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>