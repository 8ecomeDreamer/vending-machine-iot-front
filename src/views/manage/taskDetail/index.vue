<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="80px">
      <el-form-item label="工单编号" prop="taskCode">
        <el-select v-model="queryParams.taskCode" placeholder="请选择工单编号" clearable filterable>
          <el-option v-for="item in uniqueTaskList" :key="item.taskCode" :label="item.taskCode" :value="item.taskCode"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="货道编号" prop="channelCode">
        <el-select v-model="queryParams.channelCode" placeholder="请选择货道编号" clearable filterable>
          <el-option v-for="item in uniqueChannelList" :key="item.channelCode" :label="item.channelCode" :value="item.channelCode"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品名称" prop="skuName">
        <el-select v-model="queryParams.skuName" placeholder="请选择商品名称" clearable filterable>
          <el-option v-for="item in skuList" :key="item.id" :label="item.name" :value="item.name"></el-option>
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
          v-hasPermi="['manage:taskDetail:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['manage:taskDetail:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['manage:taskDetail:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['manage:taskDetail:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="taskDetailList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="工单编号" align="center" prop="taskCode" width="140" />
      <el-table-column label="货道编号" align="center" prop="channelCode" width="120" />
      <el-table-column label="补货期望容量" align="center" prop="expectCapacity" width="120" />
      <el-table-column label="商品名称" align="center" prop="skuName" width="120" />
      <el-table-column label="商品图片" align="center" prop="skuImage" width="100">
        <template #default="scope">
          <img v-if="scope.row.skuImage" :src="scope.row.skuImage" width="40" height="40" />
          <span v-else>无图片</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="140">
        <template #default="scope">
          {{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{i}') }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['manage:taskDetail:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['manage:taskDetail:remove']">删除</el-button>
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

    <!-- 添加或修改工单详情对话框 -->
    <el-dialog :title="title" v-model="open" width="550px" append-to-body>
      <el-form ref="taskDetailRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="工单编号" prop="taskCode">
          <el-select
              v-model="form.taskCode"
              placeholder="请选择工单编号"
              clearable
              filterable
          >
            <el-option
                v-for="item in uniqueTaskList"
                :key="item.taskCode"
                :label="item.taskCode"
                :value="item.taskCode"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="货道编号" prop="channelCode">
          <el-select v-model="form.channelCode" placeholder="请选择货道编号" clearable filterable>
            <el-option v-for="item in uniqueChannelList" :key="item.channelCode" :label="item.channelCode" :value="item.channelCode"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="补货期望容量" prop="expectCapacity">
          <el-input v-model="form.expectCapacity" placeholder="请输入补货期望容量" />
        </el-form-item>
        <el-form-item label="商品名称" prop="skuName">
          <el-select
              v-model="form.skuName"
              placeholder="请选择商品名称"
              clearable
              filterable
          >
            <el-option
                v-for="item in skuList"
                :key="item.id"
                :label="item.name"
                :value="item.name"
            />
          </el-select>
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

<script setup name="TaskDetail">
import { computed } from 'vue';
import { listTaskDetail, getTaskDetail, delTaskDetail, addTaskDetail, updateTaskDetail } from "@/api/manage/taskDetail.js";
import { listTask } from "@/api/manage/task.js";
import { listChannel } from "@/api/manage/channel.js";
import { listSku } from "@/api/manage/sku.js";

const { proxy } = getCurrentInstance();

const taskDetailList = ref([]);
const taskList = ref([]);
const channelList = ref([]);
const skuList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

/** 去重后的工单列表 */
const uniqueTaskList = computed(() => {
  const seen = new Set();
  return taskList.value.filter(item => {
    if (seen.has(item.taskCode)) {
      return false;
    }
    seen.add(item.taskCode);
    return true;
  });
});

/** 去重后的货道列表 */
const uniqueChannelList = computed(() => {
  const seen = new Set();
  return channelList.value.filter(item => {
    if (seen.has(item.channelCode)) {
      return false;
    }
    seen.add(item.channelCode);
    return true;
  });
});

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    taskCode: null,
    channelCode: null,
    skuName: null,
  },
  rules: {
    taskCode: [
      { required: true, message: "工单编号不能为空", trigger: "blur" }
    ],
    channelCode: [
      { required: true, message: "货道编号不能为空", trigger: "blur" }
    ],
    expectCapacity: [
      { required: true, message: "补货期望容量不能为空", trigger: "blur" }
    ],
    skuName: [
      { required: true, message: "商品名称不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询工单详情列表 */
function getList() {
  loading.value = true;
  listTaskDetail(queryParams.value).then(response => {
    taskDetailList.value = response.rows;
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
    detailId: null,
    taskCode: null,
    channelCode: null,
    expectCapacity: null,
    skuName: null,
    skuImage: null,
    remark: null
  };
  proxy.resetForm("taskDetailRef");
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
  ids.value = selection.map(item => item.detailId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "新增工单详情";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _detailId = row.detailId || ids.value
  getTaskDetail(_detailId).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改工单详情";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["taskDetailRef"].validate(valid => {
    if (valid) {
      if (form.value.detailId != null) {
        updateTaskDetail(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addTaskDetail(form.value).then(response => {
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
  const _detailIds = row.detailId || ids.value;
  const info = row.channelCode ? `货道"${row.channelCode}"的工单详情` : '选中的工单详情';
  proxy.$modal.confirm('是否确认删除' + info + '？').then(function() {
    return delTaskDetail(_detailIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('manage/taskDetail/export', {
    ...queryParams.value
  }, `taskDetail_${new Date().getTime()}.xlsx`)
}

/** 查询工单列表 */
function getTaskList() {
  listTask({}).then(response => {
    taskList.value = response.rows;
  });
}

/** 查询货道列表 */
function getChannelList() {
  listChannel({}).then(response => {
    channelList.value = response.rows;
  });
}

/** 查询商品列表 */
function getSkuList() {
  listSku(listQueryParams).then(response => {
    skuList.value = response.rows;
  });
}

/** 商品查询参数 */
const listQueryParams = {
  pageNum: 1,
  pageSize: 100
};

getList();
getTaskList();
getChannelList();
getSkuList();
</script>