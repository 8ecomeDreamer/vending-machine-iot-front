<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="工单编号" prop="taskCode">
        <el-input
          v-model="queryParams.taskCode"
          placeholder="请输入工单编号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="售货机编码" prop="innerCode">
        <el-input
          v-model="queryParams.innerCode"
          placeholder="请输入售货机编码"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="执行人id" prop="userId">
        <el-input
          v-model="queryParams.userId"
          placeholder="请输入执行人id"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="执行人名称" prop="userName">
        <el-input
          v-model="queryParams.userName"
          placeholder="请输入执行人名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所属区域id" prop="regionId">
        <el-input
          v-model="queryParams.regionId"
          placeholder="请输入所属区域id"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="备注" prop="taskDesc">
        <el-input
          v-model="queryParams.taskDesc"
          placeholder="请输入备注"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="工单类型id" prop="productTypeId">
        <el-input
          v-model="queryParams.productTypeId"
          placeholder="请输入工单类型id"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="指派人id" prop="assignorId">
        <el-input
          v-model="queryParams.assignorId"
          placeholder="请输入指派人id"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="地址" prop="addr">
        <el-input
          v-model="queryParams.addr"
          placeholder="请输入地址"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['manage:task:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['manage:task:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['manage:task:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['manage:task:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="taskList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="工单id" align="center" prop="taskId" />
      <el-table-column label="工单编号" align="center" prop="taskCode" />
      <el-table-column label="工单状态：1待处理、2进行中、3已取消、4已完成" align="center" prop="taskStatus" />
      <el-table-column label="创建类型：0自动、1手动" align="center" prop="createType" />
      <el-table-column label="售货机编码" align="center" prop="innerCode" />
      <el-table-column label="执行人id" align="center" prop="userId" />
      <el-table-column label="执行人名称" align="center" prop="userName" />
      <el-table-column label="所属区域id" align="center" prop="regionId" />
      <el-table-column label="备注" align="center" prop="taskDesc" />
      <el-table-column label="工单类型id" align="center" prop="productTypeId" />
      <el-table-column label="指派人id" align="center" prop="assignorId" />
      <el-table-column label="地址" align="center" prop="addr" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['manage:task:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['manage:task:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改工单对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="taskRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="工单编号" prop="taskCode">
          <el-input v-model="form.taskCode" placeholder="请输入工单编号" />
        </el-form-item>
        <el-form-item label="售货机编码" prop="innerCode">
          <el-input v-model="form.innerCode" placeholder="请输入售货机编码" />
        </el-form-item>
        <el-form-item label="执行人id" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入执行人id" />
        </el-form-item>
        <el-form-item label="执行人名称" prop="userName">
          <el-input v-model="form.userName" placeholder="请输入执行人名称" />
        </el-form-item>
        <el-form-item label="所属区域id" prop="regionId">
          <el-input v-model="form.regionId" placeholder="请输入所属区域id" />
        </el-form-item>
        <el-form-item label="备注" prop="taskDesc">
          <el-input v-model="form.taskDesc" placeholder="请输入备注" />
        </el-form-item>
        <el-form-item label="工单类型id" prop="productTypeId">
          <el-input v-model="form.productTypeId" placeholder="请输入工单类型id" />
        </el-form-item>
        <el-form-item label="指派人id" prop="assignorId">
          <el-input v-model="form.assignorId" placeholder="请输入指派人id" />
        </el-form-item>
        <el-form-item label="地址" prop="addr">
          <el-input v-model="form.addr" placeholder="请输入地址" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Task">
import { listTask, getTask, delTask, addTask, updateTask } from "@/api/manage/task.js";

const { proxy } = getCurrentInstance();

const taskList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    taskCode: null,
    taskStatus: null,
    createType: null,
    innerCode: null,
    userId: null,
    userName: null,
    regionId: null,
    taskDesc: null,
    productTypeId: null,
    assignorId: null,
    addr: null,
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询工单列表 */
function getList() {
  loading.value = true;
  listTask(queryParams.value).then(response => {
    taskList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    taskId: null,
    taskCode: null,
    taskStatus: null,
    createType: null,
    innerCode: null,
    userId: null,
    userName: null,
    regionId: null,
    taskDesc: null,
    productTypeId: null,
    assignorId: null,
    addr: null,
    createTime: null,
    updateTime: null,
    createBy: null,
    updateBy: null,
    remark: null
  };
  proxy.resetForm("taskRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.taskId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加工单";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _taskId = row.taskId || ids.value
  getTask(_taskId).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改工单";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["taskRef"].validate(valid => {
    if (valid) {
      if (form.value.taskId != null) {
        updateTask(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addTask(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _taskIds = row.taskId || ids.value;
  proxy.$modal.confirm('是否确认删除工单编号为"' + _taskIds + '"的数据项？').then(function() {
    return delTask(_taskIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('manage/task/export', {
    ...queryParams.value
  }, `task_${new Date().getTime()}.xlsx`)
}

getList();
</script>
