import { ref, computed, h, type Ref } from 'vue';
import { layer } from '@layui/layui-vue';
import ordersApi from '@/api/orders/ordersApi';
import clientApi from '@/api/client/clinetApi';
import notify from '@/utils/notify';
import Tree from '@/components/Tree.vue';
import type { QuotationListResponse } from '@/api/orders/orderApi.type';
import type { UserTreeType } from '@/api/client/clinetApi.type';

export interface UseQuotationCollaborateOptions {
  selectedKey: Ref<string | undefined>;
  dataSource: Ref<QuotationListResponse[]>;
}

export function useQuotationCollaborate(
  options: UseQuotationCollaborateOptions,
) {
  const { selectedKey, dataSource } = options;

  const userTreeData = ref<UserTreeType[]>([]);
  const expandedKeys = ref<string[]>([]);
  const selectedUserIds = ref<string[]>([]);

  /**
   * 协作功能
   */
  const handleCollaborate = async () => {
    // 1. 检查是否有选中的行
    if (!selectedKey.value) {
      layer.msg('请先选择要协作的订单', { icon: 2 });
      return;
    }

    try {
      // 2. 调用getCoopState API检查是否可以协作
      const coopStateResponse = (await ordersApi.getCoopState(
        selectedKey.value,
      )) as unknown as { code: string; msg: string };

      // 检查返回的code是否为"200"（字符串类型）
      if (coopStateResponse.code !== '200') {
        const errorMsg = coopStateResponse.msg || '无法进行协作操作';
        layer.msg(errorMsg, { icon: 2 });
        return;
      }

      // 3. 如果可以协作，获取用户树数据
      const userTreeResponse =
        (await clientApi.userTree()) as unknown as UserTreeType[];
      userTreeData.value = userTreeResponse;

      // 4. 设置默认展开的节点
      expandedKeys.value = userTreeData.value
        .filter((item) => item.open)
        .map((item) => item.id.toString());

      // 5. 清空之前的选择
      selectedUserIds.value = [];

      // 6. 显示协作抽屉
      layer.drawer({
        title: '选择协作用户',
        content: h(Tree, {
          data: transformedUserTreeDataForTree.value,
          multiple: true,
          showCheckbox: true,
          checkStrictly: false,
          onSelect: handleCoopTreeSelect,
        }),
        btn: [
          {
            text: '确定',
            callback() {
              handleCoopConfirm();
            },
          },
          {
            text: '取消',
            callback(idx) {
              layer.close(idx);
              selectedUserIds.value = [];
            },
          },
        ],
      });
    } catch (error) {
      console.error('协作操作失败:', error);
      layer.msg('协作操作失败，请重试', { icon: 2 });
    }
  };

  /**
   * 处理协作树组件的选择事件
   */
  const handleCoopTreeSelect = (
    selected: string | number | (string | number)[],
  ) => {
    if (Array.isArray(selected)) {
      selectedUserIds.value = selected.map((id) => String(id));
    } else {
      selectedUserIds.value = [String(selected)];
    }
  };

  /**
   * 确认协作操作
   */
  const handleCoopConfirm = async () => {
    if (selectedUserIds.value.length === 0) {
      layer.msg('请选择要协作的用户', { icon: 2 });
      return;
    }

    // 检查选择的用户数量
    if (selectedUserIds.value.length > 1) {
      layer.msg('每次只能选择一个用户进行协作', { icon: 2 });
      return;
    }

    try {
      // 获取当前选中行的信息
      if (!selectedKey.value) {
        layer.msg('请先选择要协作的报价单', { icon: 2 });
        return;
      }

      // 获取选中行的数据
      const selectedRowData = dataSource.value.find(
        (item) => item.ordersId === selectedKey.value,
      );

      // 调用协作开始API
      await ordersApi.coopStart(
        selectedKey.value, // orderId
        selectedUserIds.value[0], // coopUser
        selectedRowData ? selectedRowData.projectName : '', // projectName
      );

      // 关闭抽屉
      layer.closeAll();

      // 清空选择
      selectedUserIds.value = [];

      // 成功提示
      notify.success('协作开始');
    } catch (error) {
      console.error('开始协作失败:', error);
      layer.msg('开始协作失败，请重试', { icon: 2 });
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
        if (item.id === '0') {
          item.pId = '-1'; // 对总公司做特殊处理
        }
        flattenData.push({
          id: item.id,
          parentId: item.pId === '-1' ? null : item.pId,
          name: item.name,
          icon: item.isUser === 'true' ? 'user' : 'folder',
          showCheckbox: !item.nocheck, // 根据nocheck属性控制checkbox显示
          disabled: item.chkDisabled.toString() === 'true', // 根据chkDisabled属性控制是否禁用
          selected: item.checked,
          expanded: item.open, // 根据open属性控制默认展开状态
        });
      });
    };

    flatten(userTreeData.value);
    return flattenData;
  });

  /**
   * 取消协作
   */
  const handleCoopCancel = () => {
    selectedUserIds.value = [];
  };

  return {
    handleCollaborate,
    handleCoopTreeSelect,
    handleCoopConfirm,
    handleCoopCancel,
    transformedUserTreeDataForTree,
  };
}
