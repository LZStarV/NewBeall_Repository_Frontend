import { ref } from 'vue';

// 表格列配置
export const tableColumns = [
  { title: '', width: '20px', type: 'checkbox', fixed: 'left' as const },
  {
    title: '所属公司',
    key: 'company',
    width: '200px',
    sortable: true,
    type: 'text',
  },
  {
    title: '需求名',
    key: 'demandName',
    width: '150px',
    customSlot: 'demandName',
    sortable: true,
    type: 'text',
  },
  {
    title: '需求详情',
    key: 'demandDetails',
    width: '200px',
    type: 'text',
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
    width: '100px',
    customSlot: 'action',
    type: 'text',
  },
];

// 需求接口类型定义
export interface Demand {
  id: string;
  selected: boolean;
  company: string;
  demandName: string;
  demandDetails: string;
  releaseTime: string;
  status: string;
}

// 表格数据
export const tableData = ref<Demand[]>([]);
