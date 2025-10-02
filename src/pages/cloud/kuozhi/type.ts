import { ref } from 'vue';
// 表格列配置
export const tableColumns = [
  {
    title: '产品名称',
    key: 'name',
    width: '150px',
    customSlot: 'productName',
    sortable: true,
    type: 'text',
  },
  { title: '品牌', key: 'brand', width: '100px', type: 'text' },
  { title: '型号', key: 'model', width: '120px', type: 'text' },
  {
    title: '参数/特性',
    key: 'parameters',
    width: '100px',
    customSlot: 'parameters',
    type: 'text',
  },
  { title: '库存', key: 'inventory', width: '80px', type: 'text' },
  { title: '单位', key: 'unit', width: '60px', type: 'text' },
  {
    title: '库存售价',
    key: 'inventoryPrice',
    width: '100px',
    sortable: true,
    type: 'text',
  },
  {
    title: '产品图片',
    key: 'productImage',
    width: '100px',
    customSlot: 'productImage',
    type: 'text',
  },
  { title: '备注', key: 'remarks', width: '100px', type: 'text' },
];
// 产品接口类型定义
export interface Product {
  id: string;
  name: string;
  brand: string;
  model: string;
  parameters: string;
  inventory: number;
  unit: string;
  inventoryPrice: string;
  pictureaddress: string;
  remarks: string;
}
// 表格数据
export const tableData = ref<Product[]>([]);

export const cityOptions = ref([
  { value: '北京市', label: '北京市' },
  { value: '上海市', label: '上海市' },
  { value: '广州市', label: '广州市' },
  { value: '深圳市', label: '深圳市' },
  { value: '杭州市', label: '杭州市' },
  { value: '南京市', label: '南京市' },
]);
