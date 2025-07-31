<template>
  <!-- 查询分页页面 -->
  <el-table :data="state.tableData" style="width: 100%">
    <el-table-column fixed prop="suId" label="编号" width="150" />
    <el-table-column prop="suName" label="用户名" width="120" />
    <el-table-column prop="suRole" label="角色" width="120" />
    <el-table-column prop="suTime" label="创建时间" />
    <el-table-column fixed="right" label="Operations" min-width="120">
      <template #default="scope">
        <el-button link type="primary" size="small" @click="handleClick">
          删除
        </el-button>
        <el-button 
          link 
          type="primary"  
          size="small" 
          @click="handleEdit(scope.$index, scope.row)" 
          :key="scope.$index"
        >
          编辑
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  
  <!-- 分页工具栏 -->
  <el-pagination
    background
    layout="prev, pager, next"
    :total="state.total"
    :page-size="state.pageSize"
    @current-change="refreshData"
  />
  
  <el-dialog v-model="state.dialogFormVisible" title="修改用户信息" width="500">
    <el-form :model="state.form">
      <el-form-item label="编号" :label-width="state.formLabelWidth">
        <el-input v-model="state.form.suId" autocomplete="off" />
      </el-form-item>
      <el-form-item label="用户名" :label-width="state.formLabelWidth">
        <el-input v-model="state.form.suName" autocomplete="off" />
      </el-form-item>
      <el-form-item label="角色" :label-width="state.formLabelWidth">
        <el-select v-model="state.form.suRole" placeholder="请选择角色">
          <el-option label="user" value="user" />
          <el-option label="admin" value="admin" />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间" :label-width="state.formLabelWidth">
        <el-date-picker
          v-model="state.form.suTime"
          type="datetime"
          placeholder="请选择日期时间"
          style="width: 100%"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="state.dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="state.dialogFormVisible = false">
          Confirm
        </el-button>
      </div>
    </template>
  </el-dialog>  
</template>

<script lang="ts" setup>
import { Menu as IconMenu, Message, Setting, Avatar } from "@element-plus/icons-vue";
import { reactive, onMounted } from "vue";
import axios from "axios";

// 定义用户数据类型接口
interface SysUser {
  suId: string;
  suName: string;
  suRole: string;
  suTime: string | Date;
}

const handleClick = () => {
  console.log('click')
}

// 定义页面的数据变量对象state
const state = reactive({
  tableData: [] as SysUser[],
  pageNum: 1,
  pageSize: 2,
  total: 0,
  dialogFormVisible: false, // 控制对话框显示
  form: {} as SysUser, // 表单数据
  formLabelWidth: '120px' // 表单标签宽度
});

// 获取后台数据的方法定义
const getData = () => {
  axios({
    method: "get",
    url: "http://localhost:8080/sysUser/pageUser",
    params: {
      pageNum: state.pageNum,
      pageSize: state.pageSize
    }
  }).then((res) => {
    state.tableData = res.data.data;
    state.total = res.data.count;
  });
};

// 页面初始化之后会执行这个方法
onMounted(() => {
  // 初始化表格数据
  getData();
});

// 当页码改变时，刷新数据
const refreshData = (page: number) => {
  state.pageNum = page;
  getData();
};

// 弹出修改窗口
const handleEdit = (index: number, row: SysUser) => {
  console.log(index);
  console.log(row);
  state.dialogFormVisible = true;
  // 回填表单数据(先转json字符串再转对象，避免row对象跟form对象关联)
  state.form = JSON.parse(JSON.stringify(row));
};
</script>