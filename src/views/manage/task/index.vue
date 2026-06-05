<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="80px">
      <el-form-item label="工单编号" prop="taskCode">
        <el-input
          v-model="queryParams.taskCode"
          placeholder="请输入工单编号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所属设备" prop="innerCode">
          <el-select v-model="queryParams.innerCode" placeholder="请选择所属设备" clearable filterable>
            <el-option v-for="item in uniqueVmList" :key="item.innerCode" :label="item.innerCode" :value="item.innerCode"></el-option>
          </el-select>
        </el-form-item>
      <el-form-item label="工单状态" prop="taskStatus">
        <el-select v-model="queryParams.taskStatus" placeholder="请选择工单状态" clearable>
          <el-option label="待处理" value="1"></el-option>
          <el-option label="进行中" value="2"></el-option>
          <el-option label="已取消" value="3"></el-option>
          <el-option label="已完成" value="4"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="创建类型" prop="createType">
        <el-select v-model="queryParams.createType" placeholder="请选择创建类型" clearable>
          <el-option label="自动" value="0"></el-option>
          <el-option label="手动" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="工单类型" prop="productTypeId">
        <el-select v-model="queryParams.productTypeId" placeholder="请选择工单类型" clearable>
          <el-option v-for="item in taskTypeList" :key="item.typeId" :label="item.typeName" :value="item.typeId"></el-option>
        </el-select>
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
      <el-table-column label="工单编号" align="center" prop="taskCode" width="150" />
      <el-table-column label="工单状态" align="center" prop="taskStatus" width="80">
        <template #default="scope">
          <el-tag :type="getStatusType(scope.row.taskStatus)">
            {{ getStatusText(scope.row.taskStatus) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建类型" align="center" prop="createType" width="80">
        <template #default="scope">
          {{ scope.row.createType == 0 ? '自动' : '手动' }}
        </template>
      </el-table-column>
      <el-table-column label="所属设备" align="center" prop="innerCode" width="150" />
      <el-table-column label="工单类型" align="center" prop="typeName" width="100" />
      <el-table-column label="执行人" align="center" prop="userName" width="100" />
      <el-table-column label="所属区域" align="center" prop="regionName" width="120" />
      <el-table-column label="地址" align="center" prop="addr" width="300" />
      <el-table-column label="任务描述" align="center" prop="taskDesc" width="120" />
      <el-table-column label="备注" align="center" prop="remark" width="120" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="140">
        <template #default="scope">
          {{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{i}') }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="130" class-name="small-padding fixed-width" fixed="right">
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
    <el-dialog :title="title" v-model="open" width="600px" append-to-body>
      <el-form ref="taskRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="工单编号" prop="taskCode">
          <el-input v-model="form.taskCode" placeholder="自动生成" disabled />
        </el-form-item>
        <el-form-item label="所属设备" prop="vmId">
          <el-select
              v-model="form.vmId"
              placeholder="请选择所属设备"
              clearable
              filterable
              @change="handleVmChange"
          >
            <el-option v-for="item in uniqueVmList" :key="item.innerCode" :label="item.innerCode" :value="item.innerCode"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="设备编码" prop="innerCode">
          <el-input v-model="form.innerCode" placeholder="根据设备自动生成" disabled />
        </el-form-item> -->
        <el-form-item label="工单类型" prop="productTypeId">
          <el-select v-model="form.productTypeId" placeholder="请选择工单类型" clearable>
              <el-option v-for="item in taskTypeList" :key="item.typeId" :label="item.typeName" :value="item.typeId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工单状态" prop="taskStatus">
          <el-select v-model="form.taskStatus" placeholder="请选择工单状态" key-value="label" clearable>
            <el-option label="待处理" value="1"></el-option>
            <el-option label="进行中" value="2"></el-option>
            <el-option label="已取消" value="3"></el-option>
            <el-option label="已完成" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="执行人" prop="userName">
          <el-input v-model="form.userName" placeholder="请输入执行人名称" />
        </el-form-item>
        <el-form-item label="所属区域" prop="regionName">
          <el-input v-model="form.regionName" placeholder="根据设备自动生成" disabled />
        </el-form-item>
        <el-form-item label="地址" prop="addr">
          <el-input v-model="form.addr" placeholder="根据设备自动生成" disabled />
        </el-form-item>
        <el-form-item label="任务描述" prop="taskDesc">
          <el-input v-model="form.taskDesc" placeholder="请输入任务描述" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" />
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
import { listVm } from "@/api/manage/vm.js";
import { listTaskType } from "@/api/manage/taskType.js";

const { proxy } = getCurrentInstance();

const taskList = ref([]);
const vmList = ref([]);
const taskTypeList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

/** 去重后的设备列表 */
const uniqueVmList = computed(() => {
  const seen = new Set();
  return vmList.value.filter(item => {
    if (seen.has(item.innerCode)) {
      return false;
    }
    seen.add(item.innerCode);
    return true;
  });
});

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    taskCode: null,
    taskStatus: null,
    createType: null,
    innerCode: null,
    productTypeId: null,
  },
  rules: {
    vmId: [
      { required: true, message: "所属设备不能为空", trigger: "blur" }
    ],
    productTypeId: [
      { required: true, message: "工单类型不能为空", trigger: "blur" }
    ],
    taskStatus: [
      { required: true, message: "工单状态不能为空", trigger: "blur" }
    ],
    userName: [
      { required: true, message: "执行人不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 获取状态文本 */
function getStatusText(status) {
  const map = {
    '1': '待处理',
    '2': '进行中',
    '3': '已取消',
    '4': '已完成'
  };
  return map[status] || status;
}

/** 获取状态标签类型 */
function getStatusType(status) {
  const map = {
    '1': 'warning',
    '2': 'primary',
    '3': 'danger',
    '4': 'success'
  };
  return map[status] || 'default';
}

/** 生成工单编号 */
function generateTaskCode() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const prefix = `TASK${year}${month}${day}`;
  
  const existingCodes = taskList.value
    .filter(t => t.taskCode && t.taskCode.startsWith(prefix))
    .map(t => t.taskCode);
  
  let maxNum = 0;
  existingCodes.forEach(code => {
    const match = code.match(/TASK\d{8}(\d{3})/);
    if (match) {
      const num = parseInt(match[1]);
      if (!isNaN(num) && num > maxNum) {
        maxNum = num;
      }
    }
  });
  
  const newNum = String(maxNum + 1).padStart(3, '0');
  return `${prefix}${newNum}`;
}

/** 设备改变时自动填充相关信息 */
function handleVmChange(vmId) {
  const vm = uniqueVmList.value.find(item => item.innerCode === vmId);
  console.log(uniqueVmList)
  console.log(vm, vmId)
  if (vm) {
    form.value.innerCode = vm.innerCode;
    form.value.regionName = vm.nodeName;
    form.value.addr = vm.addr;
  } else {
    form.value.innerCode = null;
    form.value.regionName = null;
    form.value.addr = null;
  }
}

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
    taskStatus: '1',
    createType: '1',
    vmId: null,
    innerCode: null,
    userId: null,
    userName: null,
    regionName: null,
    taskDesc: null,
    productTypeId: null,
    typeName: null,
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
  form.value.taskCode = generateTaskCode();
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
  const taskCode = row.taskCode || '选中的工单';
  proxy.$modal.confirm('是否确认删除工单" ' + taskCode + ' "？').then(function() {
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

/** 查询设备列表 */
function getVmList() {
  listVm({}).then(response => {
    vmList.value = response.rows;
  });
}

/** 查询工单类型列表 */
function getTaskTypeList() {
  listTaskType({}).then(response => {
    taskTypeList.value = response.rows;
  });
}

getList();
getVmList();
getTaskTypeList();
</script>
