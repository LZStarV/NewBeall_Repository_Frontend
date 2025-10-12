import { ref } from 'vue';

// 已对接需求接口类型定义
export interface ConnectedDemand {
  id: string;
  selected: boolean;
  company: string;
  demandName: string;
  demandDetails: string;
  releaseTime: string;
  status: string;
  price: string;
  contacts: string;
  tel: string;
}

// 表格列配置
export const tableColumns = [
  { title: '', width: '20px', type: 'checkbox', fixed: 'left' as const },
  {
    title: 'id',
    key: 'id',
    width: '80px',
    sortable: true,
    type: 'text',
  },
  {
    title: '客户公司',
    key: 'company',
    width: '200px',
    customSlot: 'company',
    sortable: true,
    type: 'text',
  },
  {
    title: '方案名',
    key: 'demandName',
    width: '150px',
    customSlot: 'demandName',
    sortable: true,
    type: 'text',
  },
  {
    title: '方案预计价格',
    key: 'price',
    width: '150px',
    sortable: true,
    type: 'text',
  },
  {
    title: '方案详情',
    key: 'demandDetails',
    width: '300px',
    type: 'text',
    ellipsisTooltip: true,
  },
  {
    title: '发布时间',
    key: 'releaseTime',
    width: '180px',
    sortable: true,
    type: 'text',
  },
  {
    title: '状态',
    key: 'status',
    width: '120px',
    customSlot: 'status',
    type: 'text',
  },
  {
    title: '操作',
    key: 'action',
    width: '150px',
    customSlot: 'action',
    type: 'text',
  },
];

// 表格数据
export const tableData = ref<ConnectedDemand[]>([]);
