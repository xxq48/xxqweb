<template>
  <el-breadcrumb :separator-icon="ArrowRight" style="margin-bottom: 10px;">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>系统管理</el-breadcrumb-item>
    <el-breadcrumb-item>角色管理</el-breadcrumb-item>
  </el-breadcrumb>
  
  <el-button type="primary" :icon="Plus" @click="handleAdd">新增</el-button>
  
  <el-table :data="state.tableData" border stripe style="width: 100%; margin-top: 20px;">
    <el-table-column fixed prop="roleId" label="编号" width="100" />
    <el-table-column prop="name" label="角色名称" width="150" />
    <el-table-column prop="description" label="权限描述" width="300" />
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
  <el-dialog v-model="state.dialogFormVisible" title="修改角色信息" width="500">
    <el-form :model="state.form" ref="editFormRef" :rules="editRules">
      <el-form-item label="编号" :label-width="state.formLabelWidth" prop="roleId">
        <el-input v-model="state.form.roleId" autocomplete="off" readonly />
      </el-form-item>
      <el-form-item label="角色名称" :label-width="state.formLabelWidth" prop="name">
        <el-input v-model="state.form.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="权限描述" :label-width="state.formLabelWidth" prop="description">
        <el-input v-model="state.form.description" autocomplete="off" type="textarea" rows=3 />
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
  <el-dialog v-model="state.dialogAddFormVisible" title="新增角色信息" width="500">
    <el-form :model="state.Addform" ref="addFormRef" :rules="addRules">
      <el-form-item label="角色名称" :label-width="state.formLabelWidth" prop="name">
        <el-input v-model="state.Addform.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="权限描述" :label-width="state.formLabelWidth" prop="description">
        <el-input v-model="state.Addform.description" autocomplete="off" type="textarea" rows=3 />
      </el-form-item>
      <el-form-item label="创建时间" :label-width="state.formLabelWidth" prop="time">
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

// 定义角色数据类型接口
interface Role {
  roleId: string | number;
  name: string;
  description: string;
  time: string;
}

// 定义表单引用
const editFormRef = ref<FormInstance>();
const addFormRef = ref<FormInstance>();

// 定义页面状态
const state = reactive({
  dialogFormVisible: false,
  dialogAddFormVisible: false,
  formLabelWidth: "140px",
  tableData: [] as Role[],
  pageNum: 1,
  pageSize: 5,
  total: 0,
  form: {
    roleId: "",
    name: "",
    description: "",
    time: "",
  } as Role,
  Addform: {
    roleId: "",
    name: "",
    description: "",
    time: "",
  } as Role,
});

// 编辑表单验证规则
const editRules = reactive<FormRules<Role>>({
  roleId: [
    { required: true, message: "编号不能为空", trigger: "blur" },
    { type: "number", message: "编号必须为数字", trigger: "blur" },
  ],
  name: [{ required: true, message: "角色名称不能为空", trigger: "blur" }],
  description: [{ required: true, message: "权限描述不能为空", trigger: "blur" }],
  time: [{ required: true, message: "请选择创建时间", trigger: "blur" }],
});

// 新增表单验证规则
const addRules = reactive<FormRules<Role>>({
  name: [{ required: true, message: "角色名称不能为空", trigger: "blur" }],
  description: [{ required: true, message: "权限描述不能为空", trigger: "blur" }],
  time: [{ required: true, message: "请选择创建时间", trigger: "blur" }],
});

// 获取后台角色数据
const getData = () => {
  axios({
    method: "get",
    url: "http://localhost:8080/sysRole/pageRole",
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
const handleEdit = (index: number, row: Role) => {
  state.dialogFormVisible = true;
  // 深拷贝避免双向绑定问题
  state.form = JSON.parse(JSON.stringify(row));
};

// 更新角色
const update = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid) => {
    if (valid) {
      axios({
        method: "post",
        url: "http://localhost:8080/sysRole/updateRole",
        params: state.form,
      }).then((res) => {
        if (res.data.code === 0) {
          state.dialogFormVisible = false;
          getData();
          ElMessage.success("修改成功");
        } else {
          ElMessage.error(res.data.msg);
        }
      }).catch((err) => {
        ElMessage.error("修改失败：" + err.message);
      });
    }
  });
};

// 新增角色
const add = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid) => {
    if (valid) {
      axios({
        method: "post",
        url: "http://localhost:8080/sysRole/addRole",
        params: state.Addform,
      }).then((res) => {
        if (res.data.code === 0) {
          state.dialogAddFormVisible = false;
          getData();
          ElMessage.success("新增成功");
        } else {
          ElMessage.error(res.data.msg);
        }
      }).catch((err) => {
        ElMessage.error("新增失败：" + err.message);
      });
    }
  });
};

// 显示新增窗口
const handleAdd = () => {
  state.dialogAddFormVisible = true;
  // 重置表单
  state.Addform = {
    roleId: "",
    name: "",
    description: "",
    time: ""
  };
};

// 删除角色
const handleDelete = (row: Role) => {
  ElMessageBox.confirm("确定删除该角色吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    axios({
      method: "post",
      url: "http://localhost:8080/sysRole/delRole",
      params: { roleId: row.roleId },
    }).then((res) => {
      if (res.data.code === 0) {
        ElMessage.success("删除成功");
        getData();
      } else {
        ElMessage.error(res.data.msg);
      }
    }).catch((err) => {
      ElMessage.error("删除失败：" + err.message);
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