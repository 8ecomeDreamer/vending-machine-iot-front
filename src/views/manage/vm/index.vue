<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="设备编号" prop="innerCode">
        <el-input
          v-model="queryParams.innerCode"
          placeholder="请输入设备编号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="设备容量" prop="channelMaxCapacity">
        <el-input
          v-model="queryParams.channelMaxCapacity"
          placeholder="请输入设备容量"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="点位id" prop="nodeId">
        <el-input
          v-model="queryParams.nodeId"
          placeholder="请输入点位id"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="详细地址" prop="addr">
        <el-input
          v-model="queryParams.addr"
          placeholder="请输入详细地址"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="上次补货时间" prop="lastSupplyTime">
        <el-date-picker clearable
          v-model="queryParams.lastSupplyTime"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择上次补货时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="区域id" prop="regionId">
        <el-input
          v-model="queryParams.regionId"
          placeholder="请输入区域id"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="合作商id" prop="partnerId">
        <el-input
          v-model="queryParams.partnerId"
          placeholder="请输入合作商id"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="设备型号id" prop="vmTypeId">
        <el-input
          v-model="queryParams.vmTypeId"
          placeholder="请输入设备型号id"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="经度" prop="longitudes">
        <el-input
          v-model="queryParams.longitudes"
          placeholder="请输入经度"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="纬度" prop="latitude">
        <el-input
          v-model="queryParams.latitude"
          placeholder="请输入纬度"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="客户端连接id,做emq认证用" prop="clientId">
        <el-input
          v-model="queryParams.clientId"
          placeholder="请输入客户端连接id,做emq认证用"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="策略id" prop="policyId">
        <el-input
          v-model="queryParams.policyId"
          placeholder="请输入策略id"
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
          v-hasPermi="['manage:vm:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['manage:vm:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['manage:vm:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['manage:vm:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="vmList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键id" align="center" prop="id" />
      <el-table-column label="设备编号" align="center" prop="innerCode" />
      <el-table-column label="设备容量" align="center" prop="channelMaxCapacity" />
      <el-table-column label="点位id" align="center" prop="nodeId" />
      <el-table-column label="详细地址" align="center" prop="addr" />
      <el-table-column label="上次补货时间" align="center" prop="lastSupplyTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.lastSupplyTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商圈类型" align="center" prop="businessType" />
      <el-table-column label="区域id" align="center" prop="regionId" />
      <el-table-column label="合作商id" align="center" prop="partnerId" />
      <el-table-column label="设备型号id" align="center" prop="vmTypeId" />
      <el-table-column label="设备状态, 0:未投放-1:运营-3:撤机" align="center" prop="vmStatus" />
      <el-table-column label="运行状态" align="center" prop="runningStatus" />
      <el-table-column label="经度" align="center" prop="longitudes" />
      <el-table-column label="纬度" align="center" prop="latitude" />
      <el-table-column label="客户端连接id,做emq认证用" align="center" prop="clientId" />
      <el-table-column label="策略id" align="center" prop="policyId" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['manage:vm:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['manage:vm:remove']">删除</el-button>
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

    <!-- 添加或修改设备对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="vmRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="设备编号" prop="innerCode">
          <el-input v-model="form.innerCode" placeholder="请输入设备编号" />
        </el-form-item>
        <el-form-item label="设备容量" prop="channelMaxCapacity">
          <el-input v-model="form.channelMaxCapacity" placeholder="请输入设备容量" />
        </el-form-item>
        <el-form-item label="点位id" prop="nodeId">
          <el-input v-model="form.nodeId" placeholder="请输入点位id" />
        </el-form-item>
        <el-form-item label="详细地址" prop="addr">
          <el-input v-model="form.addr" placeholder="请输入详细地址" />
        </el-form-item>
        <el-form-item label="上次补货时间" prop="lastSupplyTime">
          <el-date-picker clearable
            v-model="form.lastSupplyTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择上次补货时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="区域id" prop="regionId">
          <el-input v-model="form.regionId" placeholder="请输入区域id" />
        </el-form-item>
        <el-form-item label="合作商id" prop="partnerId">
          <el-input v-model="form.partnerId" placeholder="请输入合作商id" />
        </el-form-item>
        <el-form-item label="设备型号id" prop="vmTypeId">
          <el-input v-model="form.vmTypeId" placeholder="请输入设备型号id" />
        </el-form-item>
        <el-form-item label="经度" prop="longitudes">
          <el-input v-model="form.longitudes" placeholder="请输入经度" />
        </el-form-item>
        <el-form-item label="纬度" prop="latitude">
          <el-input v-model="form.latitude" placeholder="请输入纬度" />
        </el-form-item>
        <el-form-item label="客户端连接id,做emq认证用" prop="clientId">
          <el-input v-model="form.clientId" placeholder="请输入客户端连接id,做emq认证用" />
        </el-form-item>
        <el-form-item label="策略id" prop="policyId">
          <el-input v-model="form.policyId" placeholder="请输入策略id" />
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

<script setup name="Vm">
import { listVm, getVm, delVm, addVm, updateVm } from "@/api/manage/vm";

const { proxy } = getCurrentInstance();

const vmList = ref([]);
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
    innerCode: null,
    channelMaxCapacity: null,
    nodeId: null,
    addr: null,
    lastSupplyTime: null,
    businessType: null,
    regionId: null,
    partnerId: null,
    vmTypeId: null,
    vmStatus: null,
    runningStatus: null,
    longitudes: null,
    latitude: null,
    clientId: null,
    policyId: null,
  },
  rules: {
    innerCode: [
      { required: true, message: "设备编号不能为空", trigger: "blur" }
    ],
    channelMaxCapacity: [
      { required: true, message: "设备容量不能为空", trigger: "blur" }
    ],
    nodeId: [
      { required: true, message: "点位id不能为空", trigger: "blur" }
    ],
    addr: [
      { required: true, message: "详细地址不能为空", trigger: "blur" }
    ],
    businessType: [
      { required: true, message: "商圈类型不能为空", trigger: "change" }
    ],
    regionId: [
      { required: true, message: "区域id不能为空", trigger: "blur" }
    ],
    partnerId: [
      { required: true, message: "合作商id不能为空", trigger: "blur" }
    ],
    vmTypeId: [
      { required: true, message: "设备型号id不能为空", trigger: "blur" }
    ],
    vmStatus: [
      { required: true, message: "设备状态, 0:未投放-1:运营-3:撤机不能为空", trigger: "change" }
    ],
    createTime: [
      { required: true, message: "创建时间不能为空", trigger: "blur" }
    ],
    updateTime: [
      { required: true, message: "修改时间不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询设备列表 */
function getList() {
  loading.value = true;
  listVm(queryParams.value).then(response => {
    vmList.value = response.rows;
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
    id: null,
    innerCode: null,
    channelMaxCapacity: null,
    nodeId: null,
    addr: null,
    lastSupplyTime: null,
    businessType: null,
    regionId: null,
    partnerId: null,
    vmTypeId: null,
    vmStatus: null,
    runningStatus: null,
    longitudes: null,
    latitude: null,
    clientId: null,
    policyId: null,
    createTime: null,
    updateTime: null,
    createBy: null,
    updateBy: null,
    remark: null
  };
  proxy.resetForm("vmRef");
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
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加设备";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getVm(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改设备";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["vmRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateVm(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addVm(form.value).then(response => {
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
  const _ids = row.id || ids.value;
  proxy.$modal.confirm('是否确认删除设备编号为"' + _ids + '"的数据项？').then(function() {
    return delVm(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('manage/vm/export', {
    ...queryParams.value
  }, `vm_${new Date().getTime()}.xlsx`)
}

getList();
</script>
