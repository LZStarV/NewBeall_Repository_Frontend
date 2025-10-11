<template>
  <div class="businessInfoPage">
    <h4>企业主营业务</h4>
    <div class="info">
      <div class="notice" @click="handleClickNotice">
        上传注意事项
        <lay-icon type="layui-icon-question" />
      </div>
      <div class="companyBus">
        <lay-row space="20">
          <lay-col v-for="item in companyBusList" :key="item.businessName" md="6" sm="8" xs="12">
            <div class="companyBusItem">
              <div class="icon">
                <img :src="getIconSrc(item.icon)" :alt="item.businessName" />
              </div>
              <div class="businessName">
                {{ item.businessName }}
              </div>
              <div class="delete-icon" @click="handleDelete(item)">
                <lay-icon type="layui-icon-delete" />
              </div>
            </div>
          </lay-col>
          <lay-col md="6" sm="8" xs="12">
            <div class="companyBusItem">
              <div class="add" @click="handleOpen">
                <lay-icon type="layui-icon-addition" />
              </div>
              <div class="businessName">添加业务</div>
            </div>
          </lay-col>
        </lay-row>
      </div>
    </div>
    <div style="text-align: end; margin: 30px">
      <lay-button type="normal" @click="handleSave">保存</lay-button>
    </div>
  </div>
  <lay-layer v-model="visiable" title="选择业务" :area="['80%', '80%']" @close="handleClose">
    <div class="modal-content">
      <h4>智能化</h4>
      <lay-row space="20" style="padding: 20px 0">
        <lay-col v-for="item in iconMap" :key="item.businessName" md="8" sm="12" xs="24">
          <div class="modalItem" :class="{ active: isSelected(item.businessName) }" @click="toggleSelection(item)">
            <div class="icon">
              <img :src="getIconSrc(item.icon)" :alt="item.businessName" />
            </div>
            <div class="itemName">
              {{ item.businessName }}
            </div>
          </div>
        </lay-col>
      </lay-row>
      <h4>自定义添加</h4>
      <lay-row space="20" style="padding: 20px 0">
        <lay-col
v-for="item in selectedList?.filter(
          (m) => m.businessType === '自定义添加')" :key="item.businessName" md="8" sm="12" xs="24">
          <div class="modalItem" :class="{ active: isSelected(item.businessName) }" @click="toggleSelection(item)">
            <div class="icon">
              <img :src="getIconSrc(item.icon)" :alt="item.businessName" />
            </div>
            <div class="itemName">
              {{ item.businessName }}
            </div>
          </div>
        </lay-col>
        <lay-col md="8" sm="12" xs="24">
          <div class="modalItem">
            <lay-tooltip trigger="hover">
              <div class="add">
                <lay-icon v-if="!addItem?.icon" type="layui-icon-addition" />
                <img v-else :src="getIconSrc(addItem.icon)" style="width: 20px" /></img>
              </div>
              <template #content>
                <div class="changeIcon">
                  <p>更换图标</p>
                  <div v-for="(value, key) in businessIconModules" :key="key" class="png">
                    <img :src="value as string" style="width: 20px" @click="setAddIcon(key)" /></img>
                  </div>
                </div>
              </template>
            </lay-tooltip>

            <lay-input
v-model="addItem.businessName" size="sm" placeholder="请输入业务名称"
              style="margin: 0 10px" />
            <div class="confirm" @click="handleCustomAdd">确定</div>
          </div>
        </lay-col>
      </lay-row>
    </div>
    <template #footer>
      <div class="footer">
        <span>已选择：</span>
        <div class="selected-tags">
          <lay-tag
v-for="name in selectedList.map(m => m.businessName)" :key="name" variant="light"
            :color="getPrimaryColor()" closable @close="handleUnselect(name)">
            {{ name }}
          </lay-tag>
        </div>
        <lay-button type="normal" @click="handleAdd">确认添加</lay-button>
      </div>
    </template>
  </lay-layer>
</template>
<script setup lang="ts">
import companyApi from '@/api/company/companyApi';
import type {
  CompanyBusiness,
  CompanyDetailResponseData,
} from '@/api/company/companyApi.type';
import { layer } from '@layui/layui-vue';
import { onMounted, ref, watch } from 'vue';

// 定义参数
interface Props {
  companyData?: CompanyDetailResponseData;
}
const props = withDefaults(defineProps<Props>(), {
  companyData: undefined,
});

const emits = defineEmits(['dataUpdated']);

// 导入所有的业务图标
const businessIconModules = import.meta.glob(
  '@assets/static/img/businessIcon/**/*.png',
  {
    eager: true, // 立即加载
    import: 'default',
  },
);

// 获取十六进制主题色
const getPrimaryColor = () => {
  return (
    getComputedStyle(document.documentElement)
      .getPropertyValue('--global-primary-color')
      .trim() || ''
  );
};

// 智能化图标映射关系
const iconMap = [
  { businessName: '智慧城市', icon: 'smartCity' },
  { businessName: '智慧社区', icon: 'smartcommunity' },
  { businessName: '智慧家居', icon: 'smartHome' },
  { businessName: '人工智能', icon: 'artificial' },
  { businessName: '建筑物自动化(BAS)', icon: 'build' },
  { businessName: '影音（AV）系统 ', icon: 'AV' },
  { businessName: '办公室自动化(OAS)', icon: 'autoOffice' },
  { businessName: '通信自动化(CAS)', icon: 'equipment' },
  { businessName: '安全保卫自动化系统(SAS)', icon: 'security' },
  { businessName: '消防自动化系统(FAS)', icon: 'fireControl' },
  { businessName: '结构化综合布线系统(SCS)', icon: 'structured' },
  { businessName: '智能楼宇综合信息管理自动化系统(MAS)', icon: 'Intelligent' },
];

// 业务数据
const companyBusList = ref<CompanyBusiness[]>([]);
const selectedList = ref<CompanyBusiness[]>([]);
const addItem = ref<CompanyBusiness>(
  {
    businessType: '自定义添加',
    businessName: '',
    icon: '',
  }
);

const visiable = ref(false);

// 找到对应的图标
const getIconSrc = (iconPath: string) => {
  if (!iconPath) return '';
  // 在预加载的模块中查找匹配项
  for (const fullPath in businessIconModules) {
    if (fullPath.includes(iconPath)) {
      return businessIconModules[fullPath] as string;
    }
  }
};

const setAddIcon = (iconPath: string) => {
  addItem.value!.icon = iconPath.replace('/src/assets', '');
};

// 切换选择状态
const toggleSelection = (item: CompanyBusiness | any) => {
  const index = selectedList.value!.findIndex(selected => selected.businessName === item.businessName);
  if (index > -1) {
    selectedList.value.splice(index, 1);
  } else {
    selectedList.value.push(item);
  }
};

// 判断是否选中
const isSelected = (name: string) => {
  return selectedList.value?.some(item => item.businessName === name);
};

const handleClickNotice = () => {
  layer.open({
    type: 0,
    title: '公司信息填写须知',
    area: ['50%'],
    isHtmlFragment: true,
    content: `
      <div style="
        padding: 20px;
        line-height: 1.6;
        color: #333;
        font-size: 14px;
      ">
        <p style="margin-bottom: 16px; text-align: justify;">
          您在本页面编辑、上传的公司信息将作为云端产品库下的公司主页展示，供平台采购商浏览。为保障采购商合法权益并确保您的产品效果，您承诺并确认：
        </p>

        <ul style="padding-left: 0px">
          <li style="margin-bottom: 12px; text-align: justify;">
            1、您的填写行为已获得所在公司的授权，相关内容经过公司确认。
          </li>

          <li style="margin-bottom: 12px; text-align: justify;">
            2、填写、上传真实、合法、有效的公司信息，据实填写并及时更新公司介绍、规模、产品等，以免对采购商造成误导。
          </li>

          <li style="margin-bottom: 12px; text-align: justify;">
            3、填写、上传的图文、视频等资料不存在违法违规或涉嫌侵犯第三方合法权益的情形，如由此产生相关法律风险或造成损失，由您及所在公司承担法律责任。
          </li>

          <li style="margin-bottom: 12px; text-align: justify;">
            4、您授权设计报价管理平台以提供产品服务为目的在其他场景下免费使用您在本页面填写的公司信息，以便为您提供更佳的服务体验。
          </li>
        </ul>
      </div>
    `,
  });
};
const handleOpen = () => {
  visiable.value = true;
  selectedList.value = [...companyBusList.value];
};
const handleUnselect = (name: string) => {
  const index = selectedList.value.findIndex(item => item.businessName === name);
  if (index > -1) {
    selectedList.value.splice(index, 1);
  }
};
const handleCustomAdd = () => {
  if (!addItem.value.icon) {
    layer.msg('请选择业务图标', { icon: 2 });
    return;
  }
  if (!addItem.value.businessName) {
    layer.msg('请输入业务名称', { icon: 2 });
    return;
  }
  const indexI = iconMap.findIndex(m => m.businessName === addItem.value.businessName);
  const indexC = selectedList.value.findIndex(m => m.businessName === addItem.value.businessName);
  if (indexI > -1 || indexC > -1) {
    layer.msg('该业务名称已存在', { icon: 2 });
    return;
  }
  selectedList.value.push({ ...addItem.value });
  addItem.value.businessName = '';
  addItem.value.icon = '';
};

const handleAdd = () => {
  companyBusList.value = [...selectedList.value];
  handleClose();
};
const handleClose = () => {
  visiable.value = false;
  addItem.value.businessName = '';
  addItem.value.icon = '';
};

const handleDelete = (item: CompanyBusiness | any) => {
  const index = companyBusList.value.findIndex(m => m.businessName === item.businessName);
  if (index > -1) {
    companyBusList.value.splice(index, 1);
  }
};

const handleSave = async () => {
  try {
    const saveData = companyBusList.value.map(({ businessName, icon }) => ({
      businessName,
      icon
    }));
    await companyApi.updateCompanyBusiness(saveData, 'businessInfo');
    layer.msg('保存成功', { icon: 1 });
    emits('dataUpdated');
  } catch (error) {
    console.error('保存失败:', error);
    layer.msg('保存失败，请重试', { icon: 2 });
  }
};

// 初始化表单数据的函数
const initData = async (companyData?: CompanyDetailResponseData) => {
  try {
    if (companyData?.companyBusList) {
      companyBusList.value = [...companyData.companyBusList];
    }
  } catch (error) {
    console.error('初始化数据失败:', error);
    layer.msg('数据加载失败', { icon: 2 });
  }
};

// 监听 props 变化，更新表单数据
watch(
  () => props.companyData,
  async (newData) => {
    await initData(newData);
  },
  { immediate: true, deep: true },
);

onMounted(async () => {
  // 如果props中已经有数据，立即初始化表单
  if (props.companyData) {
    await initData(props.companyData);
  }
});
</script>

<style lang="scss" scoped>
h4 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
  border-left: 3px solid var(--global-primary-color);
  padding-left: 15px;
}

.businessInfoPage {
  .info {
    padding: 20px;

    .notice {
      color: red;
      font-size: 12px;
      margin-bottom: 10px;
      cursor: pointer;

      .layui-icon {
        font-size: 12px;
      }
    }
  }
}

.companyBusItem {
  @include flex(column, center, center);
  padding: 30px 0 20px;
  gap: 10px;
  border: 1px solid #dddddd;
  border-radius: 10px;
  position: relative;

  .businessName {
    font-size: 12px;
    font-weight: 600;
    color: var(--global-primary-color);
  }

  .add {
    @include flex-center();
    height: 32px;
    width: 60px;
    background-color: color-mix(in srgb,
        var(--global-primary-color),
        transparent 90%);
    border-radius: 5px;
    cursor: pointer;

    .layui-icon {
      color: var(--global-primary-color);
      font-size: 16px;
      font-weight: 600;
    }
  }

  .delete-icon {
    display: none;
  }

  &:hover {
    border-color: var(--global-primary-color);

    .delete-icon {
      display: block;
      position: absolute;
      top: 10px;
      right: 20px;
      cursor: pointer;
      color: #666;
    }
  }
}

.modal-content {
  padding: 20px;

  .modalItem {
    @include flex(row, flex-start, center);
    border: 1px solid #ddd;
    border-radius: 10px;
    padding: 15px;
    cursor: pointer;

    .itemName {
      margin-left: 15px;
      line-height: 1;
    }

    .add {
      @include flex-center();
      height: 32px;
      width: 42px;
      background-color: color-mix(in srgb,
          var(--global-primary-color),
          transparent 80%);
      color: var(--global-primary-color);
      font-size: 16px;
      font-weight: 600;
    }

    .confirm {
      text-wrap: nowrap;
      color: var(--global-primary-color);
    }

    &.active {
      background-color: color-mix(in srgb,
          var(--global-primary-color),
          transparent 85%);
    }

    &:hover {
      border-color: var(--global-primary-color);
    }
  }
}

.changeIcon {
  width: 240px;

  .png {
    display: inline-block;
    padding: 20px;

    img {
      cursor: pointer;
    }
  }
}

.footer {
  @include flex(row, space-between, center);
  padding: 20px;
  border-top: 1px solid #ddd;

  .selected-tags {
    flex: 1;

    .layui-tag {
      margin: 0 5px;
    }
  }
}
</style>
