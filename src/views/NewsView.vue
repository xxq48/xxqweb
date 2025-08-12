<template>
  <el-breadcrumb :separator-icon="ArrowRight" style="margin-bottom: 10px;">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>内容管理</el-breadcrumb-item>
    <el-breadcrumb-item>新闻管理</el-breadcrumb-item>
  </el-breadcrumb>
  
  <el-button type="primary" :icon="Plus" @click="handleAdd">新增新闻</el-button>
  
  <el-table :data="state.tableData" border stripe style="width: 100%; margin-top: 20px;">
    <el-table-column fixed prop="id" label="编号" width="80" />
    <el-table-column prop="title" label="标题" width="200" />
    <el-table-column prop="author" label="作者" width="100" />
    <el-table-column 
      prop="status" 
      label="状态" 
      width="100"
      :formatter="formatStatus"
    />
    <el-table-column prop="createTime" label="创建时间" width="180" />
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
  <el-dialog v-model="state.dialogFormVisible" title="修改新闻信息" width="600">
    <el-form :model="state.form" ref="editFormRef" :rules="editRules">
      <el-form-item label="编号" :label-width="state.formLabelWidth" prop="id">
        <el-input v-model="state.form.id" autocomplete="off" readonly />
      </el-form-item>
      <el-form-item label="标题" :label-width="state.formLabelWidth" prop="title">
        <el-input v-model="state.form.title" autocomplete="off" />
      </el-form-item>
      <el-form-item label="图片路径" :label-width="state.formLabelWidth" prop="image">
        <el-input v-model="state.form.image" autocomplete="off" />
      </el-form-item>
      <el-form-item label="描述" :label-width="state.formLabelWidth" prop="description">
        <el-input 
          v-model="state.form.description" 
          autocomplete="off" 
          type="textarea" 
          rows="3"
        />
      </el-form-item>
      <el-form-item label="作者" :label-width="state.formLabelWidth" prop="author">
        <el-input v-model="state.form.author" autocomplete="off" />
      </el-form-item>
      <el-form-item label="阅读量" :label-width="state.formLabelWidth" prop="viewCount">
        <el-input v-model="state.form.viewCount" autocomplete="off" type="number" />
      </el-form-item>
      <el-form-item label="状态" :label-width="state.formLabelWidth" prop="status">
        <el-select v-model="state.form.status" placeholder="请选择状态">
          <el-option label="启用" value="1" />
          <el-option label="禁用" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间" :label-width="state.formLabelWidth" prop="createTime">
        <el-date-picker
          v-model="state.form.createTime"
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
  <el-dialog v-model="state.dialogAddFormVisible" title="新增新闻信息" width="600">
    <el-form :model="state.Addform" ref="addFormRef" :rules="addRules">
      <el-form-item label="标题" :label-width="state.formLabelWidth" prop="title">
        <el-input v-model="state.Addform.title" autocomplete="off" />
      </el-form-item>
      <el-form-item label="图片路径" :label-width="state.formLabelWidth" prop="image">
        <el-input v-model="state.Addform.image" autocomplete="off" />
      </el-form-item>
      <el-form-item label="描述" :label-width="state.formLabelWidth" prop="description">
        <el-input 
          v-model="state.Addform.description" 
          autocomplete="off" 
          type="textarea" 
          rows="3"
        />
      </el-form-item>
      <el-form-item label="作者" :label-width="state.formLabelWidth" prop="author">
        <el-input v-model="state.Addform.author" autocomplete="off" />
      </el-form-item>
      <el-form-item label="阅读量" :label-width="state.formLabelWidth" prop="viewCount">
        <el-input v-model="state.Addform.viewCount" autocomplete="off" type="number" />
      </el-form-item>
      <el-form-item label="状态" :label-width="state.formLabelWidth" prop="status">
        <el-select v-model="state.Addform.status" placeholder="请选择状态">
          <el-option label="启用" value="1" />
          <el-option label="禁用" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间" :label-width="state.formLabelWidth" prop="createTime">
        <el-date-picker
          v-model="state.Addform.createTime"
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

// 状态映射
const statusMap: { [key: string]: string } = {
  '1': '启用',
  '0': '禁用'
};

// 新闻数据类型接口
interface News {
  id: string | number;
  title: string;
  image: string;
  description: string;
  author: string;
  viewCount: number;
  status: string;
  createTime: string;
  updateTime: string;
}

// 表单引用
const editFormRef = ref<FormInstance>();
const addFormRef = ref<FormInstance>();

// 页面状态
const state = reactive({
  dialogFormVisible: false,
  dialogAddFormVisible: false,
  formLabelWidth: "120px",
  tableData: [] as News[],
  pageNum: 1,
  pageSize: 5,
  total: 0,
  form: {
    id: "",
    title: "",
    image: "",
    description: "",
    author: "",
    viewCount: 0,
    status: "1",
    createTime: "",
    updateTime: ""
  } as News,
  Addform: {
    id: "",
    title: "",
    image: "",
    description: "",
    author: "",
    viewCount: 0,
    status: "1",
    createTime: "",
    updateTime: ""
  } as News,
});

// 编辑表单验证规则
const editRules = reactive<FormRules<News>>({
  id: [
    { required: true, message: "编号不能为空", trigger: "blur" },
    { type: "number", message: "编号必须为数字", trigger: "blur" }
  ],
  title: [{ required: true, message: "标题不能为空", trigger: "blur" }],
  author: [{ required: true, message: "作者不能为空", trigger: "blur" }],
  description: [{ required: true, message: "描述不能为空", trigger: "blur" }],
  viewCount: [
    { required: true, message: "阅读量不能为空", trigger: "blur" },
    { type: "number", message: "阅读量必须为数字", trigger: "blur" }
  ],
  status: [{ required: true, message: "请选择状态", trigger: "blur" }],
  createTime: [{ required: true, message: "请选择创建时间", trigger: "blur" }]
});

// 新增表单验证规则
const addRules = reactive<FormRules<News>>({
  title: [{ required: true, message: "标题不能为空", trigger: "blur" }],
  author: [{ required: true, message: "作者不能为空", trigger: "blur" }],
  description: [{ required: true, message: "描述不能为空", trigger: "blur" }],
  viewCount: [
    { required: true, message: "阅读量不能为空", trigger: "blur" },
    { type: "number", message: "阅读量必须为数字", trigger: "blur" }
  ],
  status: [{ required: true, message: "请选择状态", trigger: "blur" }],
  createTime: [{ required: true, message: "请选择创建时间", trigger: "blur" }]
});

// 格式化状态显示
const formatStatus = (row: News) => {
  return statusMap[row.status as keyof typeof statusMap] || '未知';
};

// 获取新闻数据
const getData = () => {
  axios({
    method: "get",
    url: "http://localhost:8080/news/pageNews",
    params: { pageNum: state.pageNum, pageSize: state.pageSize }
  }).then((res) => {
    if (res.data.code === 0) {
      state.tableData = res.data.data;
      state.total = res.data.count;
    } else {
      ElMessage.error("加载失败：" + res.data.msg);
      state.tableData = [];
    }
  }).catch((err) => {
    ElMessage.error("接口请求失败：" + err.message);
  });
};

// 刷新数据
const refreshData = (page: number) => {
  state.pageNum = page;
  getData();
};

// 编辑新闻
const handleEdit = (index: number, row: News) => {
  state.dialogFormVisible = true;
  state.form = JSON.parse(JSON.stringify(row));
};

// 更新新闻
const update = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid) => {
    if (valid) {
      axios({
        method: "post",
        url: "http://localhost:8080/news/updateNews",
        data: state.form
      }).then((res) => {
        if (res.data.code === 0) {
          state.dialogFormVisible = false;
          getData();
          ElMessage.success("修改成功");
        } else {
          ElMessage.error(res.data.msg);
        }
      });
    }
  });
};

// 新增新闻
const add = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid) => {
    if (valid) {
      axios({
        method: "post",
        url: "http://localhost:8080/news/addNews",
        data: state.Addform
      }).then((res) => {
        if (res.data.code === 0) {
          state.dialogAddFormVisible = false;
          getData();
          ElMessage.success("新增成功");
        } else {
          ElMessage.error(res.data.msg);
        }
      });
    }
  });
};

// 打开新增窗口
const handleAdd = () => {
  state.dialogAddFormVisible = true;
  state.Addform = {
    id: "",
    title: "",
    image: "",
    description: "",
    author: "",
   viewCount: 0,
    status: "1",
    createTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
    updateTime: ""
  };
};

// 删除新闻
const handleDelete = (row: News) => {
  ElMessageBox.confirm("确定删除该新闻吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    axios({
      method: "post",
      url: "http://localhost:8080/news/delNews",
      params: { id: row.id }
    }).then((res) => {
      if (res.data.code === 0) {
        ElMessage.success("删除成功");
        getData();
      } else {
        ElMessage.error(res.data.msg);
      }
    });
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
