<template>
  <el-breadcrumb :separator-icon="ArrowRight" style="margin-bottom: 10px;">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>课程管理</el-breadcrumb-item>
    <el-breadcrumb-item>课程列表</el-breadcrumb-item>
  </el-breadcrumb>
  
  <el-button type="primary" :icon="Plus" @click="handleAdd">新增课程</el-button>
  
  <el-table :data="state.tableData" border stripe style="width: 100%; margin-top: 20px;">
    <el-table-column fixed prop="id" label="编号" width="100" />
    <el-table-column prop="title" label="课程名称" width="200" />
     <el-table-column prop="description" label="课程描述" width="250" />
    <el-table-column prop="price" label="价格" width="120" :formatter="formatPrice" />
    <el-table-column prop="duration" label="时长(月)" width="100" />
    <el-table-column prop="level" label="难度" width="100" :formatter="formatDifficulty" />
    <el-table-column prop="time" label="创建时间" width="200" />
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
  <el-dialog v-model="state.dialogFormVisible" title="修改课程信息" width="600">
    <el-form :model="state.form" ref="editFormRef" :rules="editRules">
      <el-form-item label="编号" :label-width="state.formLabelWidth" prop="id">
        <el-input v-model="state.form.id" autocomplete="off" readonly />
      </el-form-item>
      <el-form-item label="课程名称" :label-width="state.formLabelWidth" prop="title">
        <el-input v-model="state.form.title" autocomplete="off" />
      </el-form-item>
      <el-form-item label="图片路径" :label-width="state.formLabelWidth" prop="image">
        <el-input v-model="state.form.image" autocomplete="off" />
      </el-form-item>
      <el-form-item label="课程描述" :label-width="state.formLabelWidth" prop="description">
        <el-input v-model="state.form.description" type="textarea" rows="3" autocomplete="off" />
      </el-form-item>
      <el-form-item label="价格" :label-width="state.formLabelWidth" prop="price">
        <el-input v-model="state.form.price" autocomplete="off" type="number" />
      </el-form-item>
      <el-form-item label="时长(月)" :label-width="state.formLabelWidth" prop="duration">
        <el-input v-model="state.form.duration" autocomplete="off" type="number" />
      </el-form-item>
      <el-form-item label="难度" :label-width="state.formLabelWidth" prop="level">
        <el-select v-model="state.form.level" placeholder="请选择难度">
          <el-option label="初级" value="1" />
          <el-option label="中级" value="2" />
          <el-option label="高级" value="3" />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间" :label-width="state.formLabelWidth" prop="time">
        <el-date-picker
          v-model="state.form.time"
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
  <el-dialog v-model="state.dialogAddFormVisible" title="新增课程信息" width="600">
    <el-form :model="state.Addform" ref="addFormRef" :rules="addRules">
      <el-form-item label="课程名称" :label-width="state.formLabelWidth" prop="title">
        <el-input v-model="state.Addform.title" autocomplete="off" />
      </el-form-item>
      <el-form-item label="图片路径" :label-width="state.formLabelWidth" prop="image">
        <el-input v-model="state.Addform.image" autocomplete="off" />
      </el-form-item>
      <el-form-item label="课程描述" :label-width="state.formLabelWidth" prop="description">
        <el-input v-model="state.Addform.description" type="textarea" rows="3" autocomplete="off" />
      </el-form-item>
      <el-form-item label="价格" :label-width="state.formLabelWidth" prop="price">
        <el-input v-model="state.Addform.price" autocomplete="off" type="number" />
      </el-form-item>
      <el-form-item label="时长(月)" :label-width="state.formLabelWidth" prop="duration">
        <el-input v-model="state.Addform.duration" autocomplete="off" type="number" />
      </el-form-item>
      <el-form-item label="难度" :label-width="state.formLabelWidth" prop="level">
        <el-select v-model="state.Addform.level" placeholder="请选择难度">
          <el-option label="初级" value="1" />
          <el-option label="中级" value="2" />
          <el-option label="高级" value="3" />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间" :label-width="state.formLabelWidth" prop="createTime">
        <el-date-picker
          v-model="state.Addform.time"
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

// 难度等级映射
const levelMap: Record<string, string> = {
  '1': '初级',
  '2': '中级',
  '3': '高级'
};

// 课程数据类型接口
interface Course {
  id: string | number;
  title: string;
  image: string;
  description: string;
  price: number;
  duration: number;
  level: string;
  status: number;
 time: string;
}

// 表单引用
const editFormRef = ref<FormInstance>();
const addFormRef = ref<FormInstance>();

// 页面状态
const state = reactive({
  dialogFormVisible: false,
  dialogAddFormVisible: false,
  formLabelWidth: "140px",
  tableData: [] as Course[],
  pageNum: 1,
  pageSize: 5,
  total: 0,
  form: {
    id: "",
    title: "",
    image: "",
    description: "",
    price: 0,
    duration: 0,
    level: "",
    status: 1,
   time: "",
  } as Course,
  Addform: {
    title: "",
    image: "",
    description: "",
    price: 0,
    duration: 0,
    level: "",
    status: 1,
   time: "",
  } as Omit<Course, 'id'>,
});

// 编辑表单验证规则
const editRules = reactive<FormRules<Course>>({
  id: [
    { required: true, message: "编号不能为空", trigger: "blur" },
    { type: "number", message: "编号必须为数字", trigger: "blur", transform:(value)=> Number(value) },
  ],
  title: [{ required: true, message: "课程名称不能为空", trigger: "blur" }],
  price: [
    { required: true, message: "价格不能为空", trigger: "blur" },
    { type: "number", min: 0, message: "价格必须大于等于0", trigger: "blur", transform:(value)=> Number(value)}
  ],
  duration: [
    { required: true, message: "时长不能为空", trigger: "blur" },
    { type: "number", min: 1, message: "时长必须大于0", trigger: "blur", transform:(value)=> Number(value) }
  ],
  level: [{ required: true, message: "请选择难度", trigger: "blur" }],
  time: [{ required: true, message: "请选择创建时间", trigger: "blur" }],
});

// 新增表单验证规则
const addRules = reactive<FormRules<Course>>({
  title: [{ required: true, message: "课程名称不能为空", trigger: "blur" }],
  price: [
    { required: true, message: "价格不能为空", trigger: "blur" },
    { type: "number", min: 0, message: "价格必须大于等于0", trigger: "blur", transform:(value)=> Number(value)}
  ],
  duration: [
    { required: true, message: "时长不能为空", trigger: "blur" },
    { type: "number", min: 1, message: "时长必须大于0", trigger: "blur" , transform:(value)=> Number(value)}
  ],
  level: [{ required: true, message: "请选择难度", trigger: "blur" }],
  time: [{ required: true, message: "请选择创建时间", trigger: "blur" }],
});

// 格式化价格显示
const formatPrice = (row: Course) => {
  return `¥${row.price.toFixed(2)}`;
};

// 格式化难度显示
const formatDifficulty = (row: Course) => {
  return levelMap[row.level] || '未知';
};

// 获取课程数据
const getData = () => {
  axios({
    method: "get",
    url: "http://localhost:8080/course/pageCourse",
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

// 显示编辑窗口
const handleEdit = (index: number, row: Course) => {
  state.dialogFormVisible = true;
  state.form = JSON.parse(JSON.stringify(row));
};

// 更新课程
const update = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid) => {
    if (valid) {
      axios({
        method: "post",
        url: "http://localhost:8080/course/updateCourse",
        params: state.form,
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

// 新增课程
const add = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid) => {
    if (valid) {
      axios({
        method: "post",
        url: "http://localhost:8080/course/addCourse",
        params: state.Addform,
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

// 显示新增窗口
const handleAdd = () => {
  state.dialogAddFormVisible = true;
  state.Addform = {
    title: "",
    image: "",
    description: "",
    price: 0,
    duration: 0,
    level: "",
    status: 1,
    time: ""
  };
};

// 删除课程
const handleDelete = (row: Course) => {
  ElMessageBox.confirm("确定删除该课程吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    axios({
      method: "post",
      url: "http://localhost:8080/course/delCourse",
      params: { courseId: row.id },
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