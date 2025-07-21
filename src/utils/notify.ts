import { layer } from '@layui/layui-vue';

/**
 * 通知提示配置项
 * @interface NotifyOptions
 * @property {string} [title] - 通知标题（可选，不同类型有默认值）
 * @property {string} content - 通知内容（必选，支持HTML）
 * @property {'rb' | 'rt' | 'lb' | 'lt'} [offset] - 显示位置（默认：'rt' 右上角）
 * @property {1 | 2 | 3 | 4} [icon] - 图标类型（1:成功 2:错误 3:警告 4:信息，不同类型有默认值）
 * @property {number} [time] - 自动关闭时间（毫秒，默认：3000ms）
 */
export interface NotifyOptions {
  title?: string;
  content: string;
  offset?: 'rb' | 'rt' | 'lb' | 'lt';
  icon?: 1 | 2 | 3 | 4;
  time?: number;
}

/**
 * 通知提示工具类（基于layui-vue的layer.notify封装）
 * 支持成功、错误、警告、信息四种类型的通知，可自定义标题、位置、时效等
 */
export default class Notify {
  /**
   * 基础通知方法（私有，供内部调用，统一处理参数）
   * @private
   * @param {string | NotifyOptions} options - 通知内容或完整配置项
   * @param {string} defaultTitle - 类型默认标题（如“成功”“错误”）
   * @param {1 | 2 | 3 | 4} defaultIcon - 类型默认图标
   */
  private static baseNotify(
    options: string | NotifyOptions,
    defaultTitle: string,
    defaultIcon: 1 | 2 | 3 | 4,
  ): void {
    // 处理参数：支持字符串（直接作为content）或完整配置对象
    const opts =
      typeof options === 'string' ? { content: options } : { ...options };

    // 合并默认配置与用户配置（用户配置优先级更高）
    layer.notify({
      title: opts.title || defaultTitle, // 标题：用户配置 > 类型默认值
      content: opts.content, // 内容为必选，无默认值
      icon: opts.icon || defaultIcon, // 图标：用户配置 > 类型默认值
      offset: opts.offset || 'rt', // 位置：默认右上角
      time: opts.time || 3000, // 时效：默认3秒关闭
    });
  }

  /**
   * 成功通知（绿色对勾图标）
   * @param {string | NotifyOptions} options - 通知内容或完整配置项
   * @example
   * // 简单用法
   * Notify.success('操作成功');
   * // 完整配置
   * Notify.success({
   *   title: '保存成功',
   *   content: '数据已同步至服务器',
   *   offset: 'rb',
   *   time: 2000
   * });
   */
  static success(options: string | NotifyOptions): void {
    this.baseNotify(options, '成功', 1);
  }

  /**
   * 错误通知（红色叉号图标）
   * @param {string | NotifyOptions} options - 通知内容或完整配置项
   * @example
   * Notify.error('网络请求失败，请重试');
   */
  static error(options: string | NotifyOptions): void {
    this.baseNotify(options, '错误', 2);
  }

  /**
   * 警告通知（黄色感叹号图标）
   * @param {string | NotifyOptions} options - 通知内容或完整配置项
   * @example
   * Notify.warn('数据格式不正确，请检查');
   */
  static warn(options: string | NotifyOptions): void {
    this.baseNotify(options, '警告', 3);
  }

  /**
   * 信息通知（蓝色信息图标）
   * @param {string | NotifyOptions} options - 通知内容或完整配置项
   * @example
   * Notify.info({
   *   title: '提示',
   *   content: '新消息已收到',
   *   offset: 'lt'
   * });
   */
  static info(options: string | NotifyOptions): void {
    this.baseNotify(options, '信息', 4);
  }
}
