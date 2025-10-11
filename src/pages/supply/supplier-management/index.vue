<template>
  <div class="supplier-management-page">
    <div class="header">
      <!-- 字母导航 -->
      <div class="alphabet-nav">
        <span class="nav-label">按姓名字母搜索</span>
        <div class="alphabet-list">
          <div
            v-for="letter in alphabetList"
            :key="letter"
            class="alphabet-item"
            @click="selectLetter(letter)"
          >
            {{ letter }}
          </div>
        </div>
        <lay-button size="sm" type="normal" @click="clearFilter"
          >
清除
</lay-button
        >
      </div>

      <!-- 搜索区域 -->
      <div class="search-section">
        <div class="search-item">
          <lay-input
            v-model="searchParams.contacts"
            placeholder="综合搜索"
            @input="searchSuppliers"
          />
        </div>
      </div>
    </div>

    <div class="details">
      <!-- 工具栏 -->
      <div class="toolbar">
        <lay-tooltip content="获取复制的名片消息" trigger="hover">
          <SvgIcon
            name="order_receive_order"
            @click="getClipboardCard"
          />
        </lay-tooltip>
        <lay-tooltip
          :content="showDuplicateOnly ? '显示全部供应商' : '显示重复供应商'"
          trigger="hover"
        >
          <SvgIcon name="group_chat" @click="toggleDuplicateView" />
        </lay-tooltip>
        <lay-tooltip content="复制" trigger="hover">
          <SvgIcon name="copy" @click="copySupplier" />
        </lay-tooltip>
        <lay-tooltip content="新增" trigger="hover">
          <SvgIcon name="add_to" @click="addSupplier" />
        </lay-tooltip>
        <lay-tooltip content="编辑" trigger="hover">
          <SvgIcon name="edit" @click="editSupplier" />
        </lay-tooltip>
        <lay-tooltip content="导入" trigger="hover">
          <SvgIcon name="download" />
        </lay-tooltip>
        <lay-tooltip content="导出" trigger="hover">
          <SvgIcon name="export" />
        </lay-tooltip>
        <lay-tooltip content="删除" trigger="hover">
          <SvgIcon name="garbage" @click="deleteSupplier" />
        </lay-tooltip>
        <lay-tooltip content="共享" trigger="hover">
          <SvgIcon name="share" @click="shareSupplier" />
        </lay-tooltip>
        <lay-tooltip content="切换视图" trigger="hover">
          <SvgIcon name="eye" />
        </lay-tooltip>
        <lay-tooltip content="刷新" trigger="hover">
          <SvgIcon name="refresh" />
        </lay-tooltip>
        <lay-tooltip content="列表" trigger="hover">
          <SvgIcon name="menu" />
        </lay-tooltip>
      </div>
      <!-- 供应商列表 -->
      <div class="supplier-list">
        <lay-row
          v-if="supplierList.length > 0"
          space="30"
          class="supplier-list"
        >
          <lay-col v-for="supplier in supplierList" md="6" sm="12" xs="24">
            <div
              :key="supplier.id"
              class="supplier-card"
              :class="{ active: activeSuppliers.includes(supplier.id) }"
              @click="toggleSupplierSelection(supplier.id)"
            >
              <div class="card-header">
                <div class="name" @click.stop="showDetais(supplier)">
                  {{ supplier.contacts || '未命名单位' }}
                </div>
                <i
                  class="layui-icon layui-icon-share"
                  title="分享"
                  @click.stop="shareCard(supplier.id)"
                ></i>
              </div>

              <div class="card-body">
                <div class="contact-info">
                  <div class="contact-name">
                    <span class="name">{{ supplier.contactUser || '-' }}</span>
                    <span v-if="supplier.job" class="position">{{
                      supplier.job
                    }}</span>
                  </div>

                  <div class="contact-details">
                    <div class="detail-item">
                      <i class="layui-icon layui-icon-cellphone"></i>
                      <span>{{ supplier.tel || '-' }}</span>
                    </div>
                    <div class="detail-item">
                      <i class="layui-icon layui-icon-login-qq"></i>
                      <span>{{ supplier.qq || '-' }}</span>
                    </div>
                    <div class="detail-item">
                      <i class="layui-icon layui-icon-email"></i>
                      <span>{{ supplier.email || '-' }}</span>
                    </div>
                    <div class="detail-item">
                      <i class="layui-icon layui-icon-location"></i>
                      <span>{{ supplier.address || '-' }}</span>
                    </div>
                    <div class="detail-item">
                      <i class="layui-icon layui-icon-website"></i>
                      <span>{{ supplier.clientWebsite || '-' }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </lay-col>
        </lay-row>
        <lay-empty v-else style="margin: 100px auto" />
      </div>
      <!-- 分页 -->
      <div class="pagination-wrapper">
        <div class="pagination-info">
          <span class="page-stats">
            显示第 {{ listParams.offset + 1 }} 到第
            {{
              Math.min(pagination.current * pagination.limit, pagination.total)
            }}
            条记录，总共 {{ pagination.total }} 条记录
          </span>
          <span class="selection-stats">
            已选中 {{ activeSuppliers.length }} 条数据
          </span>
        </div>

        <lay-page
          v-model="pagination.current"
          :total="pagination.total"
          :limit="pagination.limit"
          ellipsis-tooltip
          @change="handlePageChange"
        />
      </div>
    </div>
  </div>
  <ModalWindow
    :title="
      modalMode === 'add'
        ? '新增供应商'
        : modalMode === 'edit'
          ? '编辑供应商'
          : '供应商详情'
    "
    :visible="detailsVisiable"
    :btn="modalButtons"
    is-teleport
    :size-args="['80%', '80%']"
    @close="detailsVisiable = false"
  >
    <lay-loading :type="1" :loading="isAiLoading" tip="正在获取信息...">
      <lay-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        class="supplier-detail-form"
      >
        <lay-row :space="20">
          <!-- 1. 供应商单位 -->
          <lay-col :md="12" :sm="24" :xs="24">
            <lay-form-item label="供应商单位" prop="contacts" required>
              <lay-input
                v-model="formData.contacts"
                :disabled="modalMode === 'view'"
              />
            </lay-form-item>
          </lay-col>

          <!-- 2. 联系人 -->
          <lay-col :md="12" :sm="24" :xs="24">
            <lay-form-item label="联系人" prop="contactUser" required>
              <lay-input
                v-model="formData.contactUser"
                :disabled="modalMode === 'view'"
              />
            </lay-form-item>
          </lay-col>

          <!-- 3. 手机号 -->
          <lay-col :md="12" :sm="24" :xs="24">
            <lay-form-item label="手机号" prop="tel" required>
              <lay-input
                v-model="formData.tel"
                :disabled="modalMode === 'view'"
              />
            </lay-form-item>
          </lay-col>

          <!-- 4. 职务 -->
          <lay-col :md="12" :sm="24" :xs="24">
            <lay-form-item label="职务" prop="job">
              <lay-input
                v-model="formData.job"
                :disabled="modalMode === 'view'"
              />
            </lay-form-item>
          </lay-col>

          <!-- 5. QQ -->
          <lay-col :md="12" :sm="24" :xs="24">
            <lay-form-item label="QQ" prop="qq">
              <lay-input
                v-model="formData.qq"
                :disabled="modalMode === 'view'"
              />
            </lay-form-item>
          </lay-col>

          <!-- 6. 邮箱 -->
          <lay-col :md="12" :sm="24" :xs="24">
            <lay-form-item label="邮箱" prop="email">
              <lay-input
                v-model="formData.email"
                :disabled="modalMode === 'view'"
              />
            </lay-form-item>
          </lay-col>

          <!-- 7. 微信 -->
          <lay-col :md="12" :sm="24" :xs="24">
            <lay-form-item label="微信" prop="wechat">
              <lay-input
                v-model="formData.wechat"
                :disabled="modalMode === 'view'"
              />
            </lay-form-item>
          </lay-col>

          <!-- 8. 座机 -->
          <lay-col :md="12" :sm="24" :xs="24">
            <lay-form-item label="座机" prop="fax">
              <lay-input
                v-model="formData.fax"
                :disabled="modalMode === 'view'"
              />
            </lay-form-item>
          </lay-col>

          <!-- 9. 详细地址 -->
          <lay-col :md="12" :sm="24" :xs="24">
            <lay-form-item label="详细地址" prop="address">
              <lay-input
                v-model="formData.address"
                :disabled="modalMode === 'view'"
              />
            </lay-form-item>
          </lay-col>

          <!-- 10. 供应商网站 -->
          <lay-col :md="12" :sm="24" :xs="24">
            <lay-form-item label="供应商网站" prop="clientWebsite">
              <lay-input
                v-model="formData.clientWebsite"
                :disabled="modalMode === 'view'"
              />
            </lay-form-item>
          </lay-col>

          <!-- 11. 供应商来源 -->
          <lay-col :md="12" :sm="24" :xs="24">
            <lay-form-item label="供应商来源" prop="clientSource">
              <lay-select
                v-model="formData.clientSource"
                placeholder="请选择供应商来源"
                :disabled="modalMode === 'view'"
              >
                <lay-select-option value="广告">广告</lay-select-option>
                <lay-select-option value="社交推广">社交推广</lay-select-option>
                <lay-select-option value="研讨会">研讨会</lay-select-option>
                <lay-select-option value="搜索引擎">搜索引擎</lay-select-option>
                <lay-select-option value="客户介绍">客户介绍</lay-select-option>
                <lay-select-option value="独立开发">独立开发</lay-select-option>
                <lay-select-option value="代理商">代理商</lay-select-option>
                <lay-select-option value="其他">其他</lay-select-option>
              </lay-select>
            </lay-form-item>
          </lay-col>

          <!-- 12. 人员规模 -->
          <lay-col v-if="formData.clientSize" :md="12" :sm="24" :xs="24">
            <lay-form-item label="人员规模" prop="clientSize">
              <lay-input
                v-model="formData.clientSize"
                :disabled="modalMode === 'view'"
              />
            </lay-form-item>
          </lay-col>

          <!-- 13. 跟进状态 -->
          <lay-col :md="12" :sm="24" :xs="24">
            <lay-form-item label="跟进状态" prop="clientStatus">
              <lay-select
                v-model="formData.clientStatus"
                placeholder="请选择跟进状态"
                :disabled="modalMode === 'view'"
              >
                <lay-select-option value="初访">初访</lay-select-option>
                <lay-select-option value="意向">意向</lay-select-option>
                <lay-select-option value="报价">报价</lay-select-option>
                <lay-select-option value="成交">成交</lay-select-option>
                <lay-select-option value="暂时搁置">暂时搁置</lay-select-option>
              </lay-select>
            </lay-form-item>
          </lay-col>

          <!-- 14. 备注 -->
          <lay-col :md="12" :sm="24" :xs="24">
            <lay-form-item label="备注" prop="remark">
              <lay-input
                v-model="formData.remark"
                :disabled="modalMode === 'view'"
              />
            </lay-form-item>
          </lay-col>

          <!-- 15. 创建时间 -->
          <lay-col :md="12" :sm="24" :xs="24">
            <lay-form-item label="创建时间" prop="createtime">
              <lay-input v-model="formData.createtime" disabled />
            </lay-form-item>
          </lay-col>

          <!-- 16. 创建人 -->
          <lay-col :md="12" :sm="24" :xs="24">
            <lay-form-item label="创建人" prop="uname">
              <lay-input v-model="formData.uname" disabled />
            </lay-form-item>
          </lay-col>
        </lay-row>
      </lay-form>
    </lay-loading>
  </ModalWindow>

  <!-- 名片识别弹窗 -->
  <ModalWindow
    title="截图展示"
    :visible="cardImageVisible"
    :btn="[
      {
        text: '识别名片',
        style: 'primary',
        callback: recognizeCard,
      },
    ]"
    is-teleport
    :size-args="['600px', 'auto']"
    @close="cardImageVisible = false"
  >
    <lay-loading :type="1" :loading="isRecognizing" tip="正在识别名片...">
      <div class="card-image-container">
        <img
          v-if="cardImageBase64"
          :src="cardImageBase64"
          alt="名片图片"
          class="card-image"
        />
      </div>
    </lay-loading>
  </ModalWindow>
</template>

<script lang="ts" setup>
import gyclientApi from '@/api/gyclient/gyclientApi';
import aiApi from '@/api/ai/aiApi';
import type {
  SupplierQueryListType,
  SupplierType,
  UserTreeType,
} from '@/api/gyclient/gyclientApi.type';
import SvgIcon from '@/components/SvgIcon.vue';
import ModalWindow from '@/components/ModalWindow.vue';
import Tree from '@/components/Tree.vue';
import { ref, reactive, onMounted, computed, h } from 'vue';
import { layer } from '@layui/layui-vue';

// 加载状态
const isAiLoading = ref(false);
const isRecognizing = ref(false); // 名片识别加载状态

// 是否显示重复供应商
const showDuplicateOnly = ref(false);

// 名片识别弹窗
const cardImageVisible = ref(false);
const cardImageBase64 = ref('');

// 用户树相关状态
const userTreeData = ref<UserTreeType[]>([]);
const expandedKeys = ref<(string | number)[]>([]);
const selectedUserIds = ref<(string | number)[]>([]);

// 字母表
const alphabetList = ref([
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
]);

// 分页信息
const pagination = reactive({
  current: 1,
  total: 0,
  limit: 10,
});

// 搜索参数
const searchParams = ref({
  contacts: '', // 综合查询
  sort: '', // 筛选方式
  pinyin: '', // 拼音查询
});

// 列表参数
const listParams = computed<SupplierQueryListType>(() => ({
  order: 'desc', // 排序
  limit: pagination.limit, // 每页数量
  offset: (pagination.current - 1) * pagination.limit, // 偏移量
  ...searchParams.value, // 展开搜索参数
}));

// 供应商列表数据
const supplierList = ref<SupplierType[]>([]);

// 已选择供应商
const activeSuppliers = ref<number[]>([]);

// 模态框相关
const detailsVisiable = ref(false);
const modalMode = ref<'view' | 'add' | 'edit'>('view'); // 模态框模式
const formRef = ref(); // 表单引用

// 表单数据 - 定义需要提交的字段
const formData = ref({
  id: 0,
  contacts: '',
  contactUser: '',
  tel: '',
  job: '',
  qq: '',
  email: '',
  wechat: '',
  fax: '',
  address: '',
  clientWebsite: '',
  categoryName: '',
  clientCategory: '',
  clientSource: '',
  clientSize: '',
  clientStatus: '',
  remark: '',
  note: '',
  createtime: '', // 仅用于显示，提交时会被排除
  uname: '', // 仅用于显示，提交时会被排除
});

// 表单校验规则
const formRules = {
  contacts: [{ required: true, message: '请输入供应商单位', trigger: 'blur' }],
  contactUser: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
  tel: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: '请输入正确的手机号',
      trigger: 'blur',
    },
  ],
};

// 模态框按钮配置
const modalButtons = ref([
  {
    text: '取消',
    style: 'default',
    callback: () => {
      closeModal();
    },
  },
  {
    text: modalMode.value === 'view' ? '关闭' : '提交',
    style: 'primary',
    callback: () => {
      handleSubmit();
    },
  },
]);

// 重置分页并刷新列表
const resetPaginationAndRefresh = async () => {
  pagination.current = 1;
  await handler.getSupplierList();
};

// 选择字母
const selectLetter = async (letter: string) => {
  searchParams.value.pinyin = letter;
  searchParams.value.sort = 'pinyin';
  await resetPaginationAndRefresh();
};

// 清除筛选
const clearFilter = async () => {
  Object.keys(searchParams.value).forEach((key) => {
    searchParams.value[key as keyof typeof searchParams.value] = '';
  });
  await resetPaginationAndRefresh();
};

// 搜索供应商
const searchSuppliers = resetPaginationAndRefresh;

// 切换显示重复供应商
const toggleDuplicateView = async () => {
  showDuplicateOnly.value = !showDuplicateOnly.value;
  pagination.current = 1;
  await handler.getSupplierList();
};

// 切换供应商选中状态
const toggleSupplierSelection = (supplierId: number) => {
  const index = activeSuppliers.value.indexOf(supplierId);
  if (index > -1) {
    // 如果已选中，则取消选中
    activeSuppliers.value.splice(index, 1);
  } else {
    // 如果未选中，则添加到选中列表
    activeSuppliers.value.push(supplierId);
  }
};

// 关闭模态框
const closeModal = () => {
  detailsVisiable.value = false;
  modalMode.value = 'view';
  resetFormData();
};

// 重置表单数据
const resetFormData = () => {
  formData.value.id = 0;
  formData.value.contacts = '';
  formData.value.contactUser = '';
  formData.value.tel = '';
  formData.value.job = '';
  formData.value.qq = '';
  formData.value.email = '';
  formData.value.wechat = '';
  formData.value.fax = '';
  formData.value.address = '';
  formData.value.clientWebsite = '';
  formData.value.categoryName = '';
  formData.value.clientCategory = '';
  formData.value.clientSource = '';
  formData.value.clientSize = '';
  formData.value.clientStatus = '';
  formData.value.remark = '';
  formData.value.note = '';
  formData.value.createtime = '';
  formData.value.uname = '';
};

// 从供应商对象中提取表单字段
const extractFormFields = (supplier: SupplierType) => {
  const fields: any = {};
  Object.keys(formData.value).forEach((key) => {
    const value = supplier[key as keyof SupplierType];
    if (key === 'id') {
      fields[key] = typeof value === 'number' ? value : 0;
    } else {
      fields[key] = String(value || '');
    }
  });
  return fields as typeof formData.value;
};

// 打开模态框 - 统一处理查看、新增、编辑
const openModal = (mode: 'view' | 'add' | 'edit', supplier?: SupplierType) => {
  modalMode.value = mode;

  if (mode === 'add') {
    resetFormData();
  } else if (supplier) {
    formData.value = extractFormFields(supplier);
  }

  updateModalButtons();
  detailsVisiable.value = true;
};

// 显示供应商详情
const showDetais = (supplier: SupplierType) => {
  openModal('view', supplier);
};

// 新增供应商
const addSupplier = () => {
  openModal('add');
  // 设置默认值
  formData.value.clientStatus = '初访';
};

// 编辑供应商
const editSupplier = () => {
  if (activeSuppliers.value.length !== 1) {
    layer.msg('请选择一个供应商进行编辑');
    return;
  }

  const supplier = supplierList.value.find(
    (s) => s.id === activeSuppliers.value[0],
  );

  if (supplier) {
    openModal('edit', supplier);
  }
};

// 复制供应商
const copySupplier = async () => {
  if (activeSuppliers.value.length !== 1) {
    layer.msg('请选择一个供应商进行复制');
    return;
  }

  // 使用 layer.confirm 确认框
  layer.confirm('确认复制此供应商吗?', {
    title: '确认复制',
    btn: [
      {
        text: '确认',
        callback: async (id: string) => {
          try {
            await gyclientApi.copySupplier(activeSuppliers.value[0]);
            layer.msg('复制成功', { icon: 1 });
            layer.close(id);
            await handler.getSupplierList();
            activeSuppliers.value = [];
          } catch (error) {
            console.error('复制供应商失败:', error);
            layer.msg('复制失败，请重试', { icon: 2 });
          }
        },
      },
      {
        text: '取消',
        callback: (id: string) => {
          layer.close(id);
        },
      },
    ],
  });
};

// 删除供应商
const deleteSupplier = async () => {
  if (activeSuppliers.value.length === 0) {
    layer.msg('请至少选择一个供应商进行删除');
    return;
  }

  const count = activeSuppliers.value.length;

  // 创建确认删除弹窗
  layer.open({
    type: 0,
    title: '删除',
    isHtmlFragment: true,
    content: `
      <div style="padding: 20px; text-align: center;">
        <p style="font-size: 16px; margin-bottom: 10px;">确认删除选中的 ${count} 个供应商吗？</p>
        <p style="color: #999; font-size: 14px;">删除后将无法恢复</p>
      </div>
    `,
    btn: [
      {
        text: '确认删除',
        callback: async (id: string) => {
          try {
            const jstime = new Date().getTime();
            await gyclientApi.deleteSupplier(activeSuppliers.value, jstime);
            layer.msg('删除成功', { icon: 1 });
            layer.close(id);

            // 刷新列表并清空选中状态
            await handler.getSupplierList();
            activeSuppliers.value = [];
          } catch (error) {
            console.error('删除供应商失败:', error);
            layer.msg('删除失败，请重试', { icon: 2 });
          }
        },
      },
      {
        text: '取消',
        callback: (id: string) => {
          layer.close(id);
        },
      },
    ],
    area: ['400px', 'auto'],
  });
};

// 获取剪贴板名片
const getClipboardCard = async () => {
  try {
    // 读取剪贴板
    const clipboardItems = await navigator.clipboard.read();

    for (const item of clipboardItems) {
      if (item.types.includes('image/png')) {
        const blob = await item.getType('image/png');
        const reader = new FileReader();
        reader.onload = (e) => {
          cardImageBase64.value = e.target?.result as string;
          cardImageVisible.value = true;
        };
        reader.readAsDataURL(blob);
        return;
      }
    }

    layer.msg('剪贴板中没有图片', { icon: 3 });
  } catch (error) {
    layer.msg('读取剪贴板失败,请确保已授予权限', { icon: 2 });
  }
};

// 分享供应商
const shareSupplier = async () => {
  if (activeSuppliers.value.length === 0) {
    layer.msg('请至少选择一个供应商进行分享');
    return;
  }

  try {
    // 获取用户树数据
    const userTreeResponse =
      (await gyclientApi.userTree()) as unknown as UserTreeType[];
    userTreeData.value = userTreeResponse;

    // 设置默认展开的节点
    expandedKeys.value = userTreeData.value
      .filter((node) => node.isOpen)
      .map((node) => node.id);

    // 清空之前的选择
    selectedUserIds.value = [];

    // 显示分享抽屉
    layer.drawer({
      title: '分享供应商',
      content: h('div', { style: 'padding: 20px;' }, [
        h(Tree, {
          data: transformedUserTreeDataForTree.value,
          showCheckbox: true,
          checkStrictly: false,
          onNodeClick: handleShareTreeSelect,
        }),
      ]),
      btn: [
        {
          text: '取消',
          callback: (id: string) => {
            layer.close(id);
          },
        },
        {
          text: '确认分享',
          callback: (id: string) => {
            handleShareConfirm(id);
          },
        },
      ],
      area: '30%',
    });
  } catch (error) {
    console.error('获取用户树失败:', error);
    layer.msg('获取用户树失败，请重试', { icon: 2 });
  }
};

/**
 * 处理分享树组件的选择事件
 */
const handleShareTreeSelect = (
  selected: string | number | (string | number)[],
) => {
  if (Array.isArray(selected)) {
    selectedUserIds.value = selected;
  } else {
    selectedUserIds.value = [selected];
  }
};

/**
 * 转换用户树数据格式，用于Tree组件
 */
const transformedUserTreeDataForTree = computed(() => {
  // 将层级数据转换为扁平化数据
  const flattenData: any[] = [];

  const flatten = (items: UserTreeType[]) => {
    items.forEach((item) => {
      flattenData.push({
        key: item.id,
        title: item.name,
        isLeaf: item.isUser === 'true',
        checkable: true,
        children: [],
      });
    });
  };

  flatten(userTreeData.value);
  return flattenData;
});

/**
 * 确认分享操作
 */
const handleShareConfirm = async (drawerId: string) => {
  if (selectedUserIds.value.length === 0) {
    layer.msg('请选择要分享的用户', { icon: 2 });
    return;
  }

  try {
    // 获取用户树中isUser为'true'的节点ID列表
    const userNodeIds = userTreeData.value
      .filter((node) => node.isUser === 'true')
      .map((node) => node.id);

    // 再次过滤selectedUserIds，确保只包含用户节点ID
    const filteredUserIds = selectedUserIds.value
      .filter((id) => userNodeIds.includes(String(id)))
      .map((id) => Number(id));

    if (filteredUserIds.length === 0) {
      layer.msg('请至少选择一个用户进行分享', { icon: 2 });
      return;
    }

    const jstime = new Date().getTime();
    // 调用分享API
    await gyclientApi.supplierShare(
      activeSuppliers.value,
      filteredUserIds,
      jstime,
    );

    layer.msg('分享成功', { icon: 1 });

    // 关闭抽屉
    layer.close(drawerId);

    // 清空选中状态
    selectedUserIds.value = [];
  } catch (error) {
    console.error('分享失败:', error);
    layer.msg('分享失败，请重试', { icon: 2 });
  }
};

// 单个卡片分享
const shareCard = async (supplierId: number) => {
  // 临时设置选中的供应商ID
  const originalSelection = [...activeSuppliers.value];
  activeSuppliers.value = [supplierId];

  await shareSupplier();

  // 恢复原来的选中状态
  if (!activeSuppliers.value.includes(supplierId)) {
    activeSuppliers.value = originalSelection;
  }
};

// 识别名片
const recognizeCard = async () => {
  try {
    isRecognizing.value = true; // 开始加载
    const res = await aiApi.businessCard(cardImageBase64.value, 1);

    layer.msg(res.data, { icon: 1, time: 3000 });

    // 关闭弹窗
    cardImageVisible.value = false;
    cardImageBase64.value = '';

    // 刷新列表
    await handler.getSupplierList();
  } catch (error) {
    console.error('名片识别失败:', error);
    layer.msg('名片识别失败', { icon: 2 });
  } finally {
    isRecognizing.value = false; // 结束加载
  }
};

// 更新模态框按钮
const updateModalButtons = () => {
  const buttons: any[] = [
    {
      text: '取消',
      style: 'default',
      callback: () => {
        closeModal();
      },
    },
  ];

  // 如果是新增模式,添加AI获取信息按钮
  if (modalMode.value === 'add') {
    buttons.push({
      text: 'AI获取信息',
      style: 'normal',
      callback: () => {
        handleAiGetInfo();
      },
    });
  }

  // 添加提交/关闭按钮
  buttons.push({
    text: modalMode.value === 'view' ? '关闭' : '提交',
    style: 'primary',
    callback: () => {
      handleSubmit();
    },
  });

  modalButtons.value = buttons;
};

// AI获取信息
const handleAiGetInfo = async () => {
  if (!formData.value.contacts) {
    layer.msg('请先输入供应商单位', { icon: 3 });
    return;
  }

  try {
    isAiLoading.value = true;
    const res = await aiApi.getCompanyInformation(formData.value.contacts);

    if (res.data) {
      // 填充表单数据
      formData.value.contactUser = res.data.contactUser || '';
      formData.value.tel = res.data.tel || '';
      formData.value.address = res.data.address || '';
      formData.value.email = res.data.email || '';
      formData.value.clientWebsite = res.data.clientWebsite || '';

      layer.msg('信息获取成功', { icon: 1 });
    } else {
      layer.msg('未获取到相关信息', { icon: 3 });
    }
  } catch (error) {
    layer.msg('获取信息失败', { icon: 2 });
    console.error('AI获取信息失败:', error);
  } finally {
    isAiLoading.value = false;
  }
};

// 处理表单提交
const handleSubmit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();

    const jstime = new Date().getTime();
    const isEdit = modalMode.value === 'edit';

    // 排除系统字段(createtime, uname)和准备提交数据
    const { createtime, uname, id, ...editableFields } = formData.value;
    const submitData: any = {
      ...editableFields,
      ...(isEdit && id ? { id } : {}),
    };

    const api = isEdit
      ? gyclientApi.updateSupplier(submitData, jstime)
      : gyclientApi.addSupplier(submitData, jstime);

    await api;

    layer.msg(`${isEdit ? '更新' : '新增'}供应商成功`, { icon: 1 });
    closeModal();
    await handler.getSupplierList();
  } catch (error: any) {
    if (error?.message) {
      layer.msg('请完善必填信息', { icon: 2 });
    } else {
      console.error('提交失败:', error);
      layer.msg('操作失败，请重试', { icon: 2 });
    }
  }
};

// 分页器处理
const handlePageChange = async (pageInfo: {
  current: number;
  limit: number;
}) => {
  pagination.current = pageInfo.current;
  pagination.limit = pageInfo.limit;
  await handler.getSupplierList();
};

const handler = {
  // 获取供应商列表
  async getSupplierList() {
    const api = showDuplicateOnly.value
      ? gyclientApi.supplierDuplicateList(listParams.value)
      : gyclientApi.supplierList(listParams.value);

    const res = (await api) as unknown as {
      rows: SupplierType[];
      total: number;
    };
    supplierList.value = res.rows;
    pagination.total = res.total;
  },
};

onMounted(async () => {
  // 初始化加载数据
  await handler.getSupplierList();
});
</script>

<style scoped lang="scss">
.header {
  background-color: #fff;
  border-radius: 16px;
  margin-bottom: 10px;
  padding: 20px;
}

.alphabet-nav {
  @include flex(row, space-between, center);
  gap: 15px;

  .nav-label {
    font-size: 14px;
    color: #666;
    white-space: nowrap;
  }

  .alphabet-list {
    @include flex(row, flex-start, center);
    gap: 5px;
    flex-wrap: wrap;
    flex: 1;

    .alphabet-item {
      @include flex-center();
      width: 28px;
      height: 28px;
      border: 1px solid #d9d9d9;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 13px;
      font-weight: 500;
      color: #666;
      background: #fafafa;

      &:hover {
        border-color: var(--global-primary-color);
        color: var(--global-primary-color);
      }

      &.active {
        background-color: var(--global-primary-color);
        border-color: var(--global-primary-color);
        color: white;
      }
    }
  }
}

.search-section {
  @include flex-center();
  padding-top: 15px;
  gap: 15px;
  flex-wrap: wrap;

  .search-item {
    min-width: 300px;
    flex: 1;
  }
}
.details {
  background-color: #fff;
  border-radius: 16px;
  min-height: 60vh;
}
.toolbar {
  @include flex(row, flex-end, center);
  gap: 13px;
  padding: 15px 20px;
  border-bottom: 1px solid #e8e8e8;
}

.supplier-list {
  padding: 10px 20px;
  min-height: 60vh;

  .supplier-card {
    border: 1px solid #e8e8e8;
    border-radius: 8px;
    overflow: hidden;
    transition: all 0.2s ease;
    height: 250px;

    &:hover {
      background-color: var(--primary-background-color);
    }

    &.active {
      border-color: var(--global-primary-color);
      background-color: var(--primary-background-color);
    }

    .card-header {
      @include flex(row, space-between, center);
      gap: 20px;
      color: #fff;
      font-size: 15px;
      padding: 12px 20px;
      margin: 0;
      // 定制背景色
      background-image:
        linear-gradient(15deg, #6bf6d8, transparent),
        linear-gradient(
          135deg,
          var(--global-primary-color),
          var(--global-primary-color)
        );
      background-blend-mode: screen;
      .name {
        @include text-ellipsis();
        font-weight: 600;
        flex: 1;

        &:hover {
          cursor: pointer;
        }
      }
      i:hover {
        cursor: pointer;
      }
    }

    .card-body {
      padding: 20px;
      overflow: hidden;

      .contact-info {
        .contact-name {
          @include flex(row, flex-start, flex-end);
          gap: 10px;
          margin-bottom: 20px;

          .name {
            font-size: 20px;
            font-weight: 600;
            line-height: 1.1;
            color: #333;
          }

          .position {
            font-size: 12px;
            color: #666;
            padding: 2px 8px;
            background: #dedede;
            border-radius: 12px;
          }
        }

        .contact-details {
          .detail-item {
            @include flex(row, flex-start, center);
            gap: 12px;
            font-size: 12px;
            color: #666;
            line-height: 1.6;

            i {
              color: var(--global-primary-color);
              text-align: center;
              font-size: 14px;
            }

            span {
              @include text-ellipsis();
              flex: 1;
            }
          }
        }
      }
    }
  }
}

.pagination-wrapper {
  @include flex(row, space-between, center);
  padding: 15px 20px;
  border-top: 1px solid #e8e8e8;

  .pagination-info {
    font-size: 14px;

    .page-stats {
      color: #666;
      margin-right: 10px;
    }

    .selection-stats {
      color: var(--global-primary-color);
    }
  }
}
.supplier-detail-form {
  padding: 20px;
}

.card-image-container {
  padding: 20px;
  text-align: center;

  .card-image {
    max-width: 100%;
    max-height: 500px;
  }
}
</style>
