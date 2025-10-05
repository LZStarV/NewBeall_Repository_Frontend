import { ref } from 'vue';

// 表格列配置
export const tableColumns = [
  {
    title: '共享名称',
    key: 'sharedName',
    width: '200px',
    customSlot: 'sharedName',
    sortable: true,
    type: 'text',
  },
  {
    title: '报价单类型',
    key: 'quoteType',
    width: '120px',
    type: 'text',
  },
  {
    title: '报价单性质',
    key: 'quoteNature',
    width: '120px',
    type: 'text',
  },
  {
    title: '积分',
    key: 'points',
    width: '100px',
    sortable: true,
    type: 'text',
  },
  {
    title: '下载量',
    key: 'downloads',
    width: '100px',
    sortable: true,
    type: 'text',
  },
  {
    title: '收藏',
    key: 'favorites',
    width: '100px',
    sortable: true,
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

// 方案接口类型定义
export interface Scheme {
  id: string;
  selected: boolean;
  sharedName: string;
  quoteType: string;
  quoteNature: string;
  points: number;
  downloads: number;
  favorites: number;
}

// 表格数据
export const tableData = ref<Scheme[]>([]);
