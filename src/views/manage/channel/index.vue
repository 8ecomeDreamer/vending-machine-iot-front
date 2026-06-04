<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="货道编号" prop="channelCode">
        <el-input
          v-model="queryParams.channelCode"
          placeholder="请输入货道编号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所属设备" prop="affiliatedVm">
         <el-select v-model="queryParams.affiliatedVm" placeholder="请选择所属设备" clearable>
            <el-option v-for="item in vmList" :key="item.id" :label="item.innerCode" :value="item.innerCode"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="设备类型" prop="vmTypeName">
          <el-select v-model="queryParams.vmTypeName" placeholder="请选择设备类型" clearable>
            <el-option v-for="item in vmTypeList" :key="item.id" :label="item.name" :value="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否需要补货" prop="ifReplenish" label-width="100px">
        <el-select v-model="queryParams.ifReplenish" placeholder="是否需要补货" clearable style="width: 140px;">
          <el-option label="是" value="1"></el-option>
          <el-option label="否" value="0"></el-option>
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
          v-hasPermi="['manage:channel:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['manage:channel:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['manage:channel:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['manage:channel:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="channelList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="主键id" align="center" prop="id" width="70" /> -->
      <el-table-column label="货道编号" align="center" prop="channelCode" width="80" />
      <!-- <el-table-column label="商品id" align="center" prop="skuId" /> -->
      <!-- <el-table-column label="售货机id" align="center" prop="vmId" /> -->
      <el-table-column label="所属设备" align="center" prop="affiliatedVm" width="140" />
      <el-table-column label="设备类型" align="center" prop="vmTypeName" />
      <el-table-column label="设备容量" align="center" prop="channelMaxCapacity" />
      <el-table-column label="货道当前容量" align="center" prop="currentCapacity" />
      <el-table-column label="货道最大容量" align="center" prop="maxCapacity" />
      <el-table-column label="是否需要补货" align="center" prop="ifReplenish" >
        <template #default="scope">
          <span>{{ scope.row.maxCapacity ? '是' : '否' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上次补货时间" align="center" prop="lastSupplyTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.lastSupplyTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['manage:channel:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['manage:channel:remove']">删除</el-button>
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

    <!-- 添加或修改售货机货道对话框 -->
    <el-dialog :title="title" v-model="open" width="550px" append-to-body>
      <el-form ref="channelRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="所属设备" prop="vmId">
          <el-select
              v-model="form.vmId"
              placeholder="请选择所属设备"
              clearable
              filterable
              @change="handleVmChange"
          >
            <el-option
                v-for="item in vmList"
                :key="item.id"
                :label="item.innerCode"
                :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="货道编号" prop="channelCode">
          <el-input v-model="form.channelCode" placeholder="自动生成" disabled />
        </el-form-item>
        <el-form-item label="设备类型" prop="vmTypeName">
          <el-input v-model="form.vmTypeName" placeholder="根据设备自动生成" disabled />
        </el-form-item>
        <el-form-item label="设备容量" prop="channelMaxCapacity">
          <el-input v-model="form.channelMaxCapacity" placeholder="根据设备自动生成" disabled />
        </el-form-item>
        <el-form-item label="货道最大容量" prop="maxCapacity">
          <el-input v-model="form.maxCapacity" placeholder="根据设备自动生成" disabled />
        </el-form-item>
        <el-form-item label="货道当前容量" prop="currentCapacity">
          <el-input v-model="form.currentCapacity" placeholder="请输入货道当前容量" @change="handleCapacityChange" />
        </el-form-item>
        <el-form-item label="是否需要补货" prop="ifReplenish">
          <el-input v-model="form.ifReplenish" placeholder="根据容量自动判断" disabled />
        </el-form-item>
        <!-- <el-form-item label="上次补货时间" prop="lastSupplyTime">
          <el-date-picker clearable
            v-model="form.lastSupplyTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择上次补货时间">
          </el-date-picker>
        </el-form-item> -->
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

<script setup name="Channel">
import { listChannel, getChannel, delChannel, addChannel, updateChannel } from "@/api/manage/channel";
import { listVmType } from "@/api/manage/vmType";
import { listVm } from "@/api/manage/vm";

const { proxy } = getCurrentInstance();

const channelList = ref([]);
const vmList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const vmTypeList = ref([]);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    channelCode: null,
    skuId: null,
    vmId: null,
    innerCode: null,
    maxCapacity: null,
    currentCapacity: null,
    lastSupplyTime: null,
  },
  rules: {
    channelCode: [
      { required: true, message: "货道编号不能为空", trigger: "blur" }
    ],
    vmId: [
      { required: true, message: "所属设备不能为空", trigger: "blur" }
    ],
    currentCapacity: [
      { required: true, message: "货道当前容量不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询售货机货道列表 */
function getList() {
  loading.value = true;
  listChannel(queryParams.value).then(response => {
    channelList.value = response.rows;
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
    channelCode: null,
    skuId: null,
    vmId: null,
    innerCode: null,
    vmTypeName: null,
    channelMaxCapacity: null,
    maxCapacity: null,
    currentCapacity: null,
    ifReplenish: null,
    lastSupplyTime: null,
    createTime: null,
    updateTime: null,
    createBy: null,
    updateBy: null,
    remark: null
  };
  proxy.resetForm("channelRef");
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

/** 生成货道编号 */
function generateChannelCode(vmInnerCode) {
  const prefix = vmInnerCode ? vmInnerCode.replace('VM', '') : '';
  const existingCodes = channelList.value
    .filter(c => c.channelCode && c.channelCode.startsWith(prefix))
    .map(c => c.channelCode);
  
  let maxNum = 0;
  existingCodes.forEach(code => {
    const match = code.match(/(\d+)$/);
    if (match) {
      const num = parseInt(match[1]);
      if (!isNaN(num) && num > maxNum) {
        maxNum = num;
      }
    }
  });
  
  const newNum = String(maxNum + 1).padStart(2, '0');
  return prefix + '-' + newNum;
}

/** 设备改变时自动填充设备类型、设备容量、货道最大容量 */
function handleVmChange(vmId) {
  const vm = vmList.value.find(item => item.id === vmId);
  if (vm) {
    form.value.innerCode = vm.innerCode;
    form.value.vmTypeName = vm.vmTypeName;
    form.value.channelMaxCapacity = vm.channelMaxCapacity;
    form.value.maxCapacity = vm.channelMaxCapacity;
    // 生成货道编号
    form.value.channelCode = generateChannelCode(vm.innerCode);
  } else {
    form.value.innerCode = null;
    form.value.vmTypeName = null;
    form.value.channelMaxCapacity = null;
    form.value.maxCapacity = null;
    form.value.channelCode = null;
  }
}

/** 当前容量改变时自动判断是否需要补货 */
function handleCapacityChange() {
  const current = parseInt(form.value.currentCapacity) || 0;
  const max = parseInt(form.value.maxCapacity) || 0;
  form.value.ifReplenish = current >= max ? '否' : '是';
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加售货机货道";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getChannel(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改售货机货道";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["channelRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateChannel(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addChannel(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除售货机货道编号为"' + _ids + '"的数据项？').then(function() {
    return delChannel(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('manage/channel/export', {
    ...queryParams.value
  }, `channel_${new Date().getTime()}.xlsx`)
}

/** 查询设备类型列表 */
function getVmTypeList() {
  listVmType(queryParams.value).then(response => {
    vmTypeList.value = response.rows;
  });
}

/** 查询设备列表 */
function getVmList() {
  listVm(queryParams.value).then(response => {
    vmList.value = response.rows;
  });
}

getList();
getVmTypeList();
getVmList();
</script>
