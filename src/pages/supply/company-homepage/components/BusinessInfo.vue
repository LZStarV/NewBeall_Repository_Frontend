<template>
  <div class="businessInfoPage">
    <h4>企业主营业务</h4>
    <div class="info">
      <div class="notice" @click="handleClickNotice">
        上传注意事项
        <lay-icon type="layui-icon-question"></lay-icon>
      </div>
      <div class="companyBus">
        <lay-row space="20">
          <lay-col md="6" sm="8" xs="12" v-for="item in companyBusList">
            <div class="companyBusItem">
              <div class="icon">
                <img :src="getIconSrc(item.icon)" :alt="item.businessName" />
              </div>
              <div class="businessName">
                {{ item.businessName }}
              </div>
            </div>
          </lay-col>
        </lay-row>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type {
  CompanyBusiness,
  CompanyDetailResponseData,
} from '@/api/company/companyApi.type';
import { layer } from '@layui/layui-vue';
import { onMounted, ref, watch } from 'vue';

// 导入所有.png业务图标
const businessIconModules = import.meta.glob(
  '@assets/static/img/businessIcon/**/*.png',
  {
    eager: true,  // 立即加载
    import: 'default',
  },
);

// 定义参数
interface Props {
  companyData?: CompanyDetailResponseData;
}
const props = withDefaults(defineProps<Props>(), {
  companyData: undefined,
});

// 业务数据
const companyBusList = ref<CompanyBusiness[]>();

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

// 初始化表单数据的函数
const initData = async (companyData?: CompanyDetailResponseData) => {
  if (companyData) {
    companyBusList.value = companyData.companyBusList;
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
.businessInfoPage {
  h4 {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin: 0;
    border-left: 3px solid var(--global-primary-color);
    padding-left: 15px;
  }
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
  padding: 15px;
  gap: 5px;
  border: 1px solid #dddddd;
  background-color: $light-blue-background-color;
  border-radius: 10px;
  .businessName {
    font-size: 12px;
    font-weight: 600;
    color: #666666;
  }
}
</style>
