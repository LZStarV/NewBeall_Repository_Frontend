import { ref, watch, type Ref } from 'vue';

/**
 * 搜索参数值的联合类型
 */
export type SearchParamValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | string[]
  | number[];

/**
 * 搜索参数对象类型
 */
export type SearchParams = Record<string, SearchParamValue>;

/**
 * 错误对象类型
 */
export interface SearchError {
  message: string;
  code?: string | number;
  details?: unknown;
}

/**
 * 通用工具栏搜索Hook的配置选项
 * @template TResult API返回数据的类型
 * @template TParams 搜索参数的类型
 */
export interface UseToolbarSearchOptions<
  TResult = unknown,
  TParams extends SearchParams = SearchParams,
> {
  /** 搜索参数的键值对对象 */
  searchParams: Record<string, Ref<SearchParamValue>>;
  /** API调用函数 */
  apiFunction: (params: TParams) => Promise<TResult>;
  /** 是否启用防抖搜索，默认为true */
  enableDebounce?: boolean;
  /** 防抖延迟时间（毫秒），默认为300ms */
  debounceDelay?: number;
  /** 是否在初始化时立即执行搜索，默认为true */
  immediate?: boolean;
  /** 参数转换函数，用于在调用API前转换参数格式 */
  transformParams?: (params: SearchParams) => TParams;
  /** 结果转换函数，用于在返回结果前转换数据格式 */
  transformResult?: (result: TResult) => TResult;
  /** 错误处理函数 */
  onError?: (error: SearchError) => void;
}

/**
 * 通用工具栏搜索Hook的返回值
 * @template TResult API返回数据的类型
 */
export interface UseToolbarSearchReturn<TResult = unknown> {
  /** 搜索结果数据 */
  data: Ref<TResult | null>;
  /** 加载状态 */
  loading: Ref<boolean>;
  /** 错误信息 */
  error: Ref<string | null>;
  /** 手动触发搜索 */
  search: () => Promise<void>;
  /** 重置搜索参数和结果 */
  reset: () => void;
  /** 停止监听器 */
  stopWatching: () => void;
}

/**
 * 通用工具栏搜索Hook
 *
 * 功能特性：
 * - 自动监听搜索参数变化
 * - 防抖搜索功能
 * - 错误处理
 * - 加载状态管理
 * - 支持参数和结果转换
 * - 性能优化，避免不必要的API调用
 *
 * @example
 * ```typescript
 * const searchParams = {
 *   keyword: ref(''),
 *   category: ref(''),
 *   status: ref('')
 * };
 *
 * const { data, loading, error, search, reset } = useToolbarSearch({
 *   searchParams,
 *   apiFunction: (params) => api.searchItems(params),
 *   transformParams: (params) => ({
 *     ...params,
 *     page: 1,
 *     limit: 10
 *   })
 * });
 * ```
 *
 * @template TResult API返回数据的类型
 * @template TParams 搜索参数的类型
 * @param options 配置选项
 * @returns 搜索Hook的返回值
 */
export function useToolbarSearch<
  TResult = unknown,
  TParams extends SearchParams = SearchParams,
>(
  options: UseToolbarSearchOptions<TResult, TParams>,
): UseToolbarSearchReturn<TResult> {
  const {
    searchParams,
    apiFunction,
    enableDebounce = true,
    debounceDelay = 300,
    immediate = true,
    transformParams,
    transformResult,
    onError,
  } = options;

  // 响应式状态
  const data: Ref<TResult | null> = ref(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const initialData: Ref<TResult | null> = ref(null);

  // 防抖定时器
  let searchTimeout: NodeJS.Timeout | null = null;

  /**
   * 获取当前搜索参数的值
   * @returns 搜索参数对象
   */
  const getCurrentParams = (): SearchParams => {
    const params: SearchParams = {};

    Object.keys(searchParams).forEach((key) => {
      const refValue = searchParams[key];
      if (
        refValue &&
        refValue.value !== undefined &&
        refValue.value !== null &&
        refValue.value !== ''
      ) {
        params[key] = refValue.value;
      }
    });

    return params;
  };

  /**
   * 检查参数是否有效（至少有一个非空值）
   * @param params 参数对象
   * @returns 是否有效
   */
  const isValidParams = (params: SearchParams): boolean => {
    return Object.values(params).some(
      (value) => value !== undefined && value !== null && value !== '',
    );
  };

  /**
   * 执行搜索
   * @param forceSearch 是否强制搜索（忽略参数验证）
   * @param isInitial 是否为初始加载
   */
  const executeSearch = async (
    forceSearch = false,
    isInitial = false,
  ): Promise<void> => {
    try {
      const currentParams = getCurrentParams();

      // 如果没有有效参数且不是强制搜索，则恢复初始数据
      if (!forceSearch && !isValidParams(currentParams)) {
        data.value = initialData.value;
        error.value = null;
        return;
      }

      loading.value = true;
      error.value = null;

      // 转换参数格式
      const finalParams = transformParams
        ? transformParams(currentParams)
        : (currentParams as TParams);

      // 调用API
      const result = await apiFunction(finalParams);

      // 转换结果格式
      const processedResult = transformResult
        ? transformResult(result)
        : result;
      data.value = processedResult;

      // 如果是初始加载，保存为初始数据
      if (isInitial) {
        initialData.value = processedResult;
      }
    } catch (err: unknown) {
      const searchError: SearchError = {
        message: err instanceof Error ? err.message : '搜索失败',
        code:
          err instanceof Error && 'code' in err
            ? (err as { code: string | number }).code
            : undefined,
        details: err,
      };

      error.value = searchError.message;
      data.value = null;

      // 调用错误处理函数
      if (onError) {
        onError(searchError);
      } else {
        console.error('搜索失败:', searchError);
      }
    } finally {
      loading.value = false;
    }
  };

  /**
   * 防抖搜索
   */
  const debouncedSearch = (): void => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    searchTimeout = setTimeout(() => {
      executeSearch();
    }, debounceDelay);
  };

  /**
   * 手动触发搜索（立即执行，不防抖）
   */
  const search = async (): Promise<void> => {
    // 清除防抖定时器
    if (searchTimeout) {
      clearTimeout(searchTimeout);
      searchTimeout = null;
    }

    await executeSearch(true);
  };

  /**
   * 重置搜索参数和结果
   */
  const reset = async (): Promise<void> => {
    // 清除防抖定时器
    if (searchTimeout) {
      clearTimeout(searchTimeout);
      searchTimeout = null;
    }

    // 重置所有搜索参数
    Object.keys(searchParams).forEach((key) => {
      const refValue = searchParams[key];
      if (refValue) {
        // 根据参数类型设置默认值
        if (typeof refValue.value === 'string') {
          refValue.value = '';
        } else if (typeof refValue.value === 'number') {
          refValue.value = 0;
        } else if (Array.isArray(refValue.value)) {
          refValue.value = [];
        } else {
          refValue.value = null;
        }
      }
    });

    // 重置后重新执行搜索以获取初始列表
    await executeSearch(true, true);
  };

  // 设置监听器
  const watchSources = Object.values(searchParams).filter(Boolean);

  let stopWatcher: (() => void) | null = null;

  if (watchSources.length > 0) {
    stopWatcher = watch(
      watchSources,
      () => {
        if (enableDebounce) {
          debouncedSearch();
        } else {
          executeSearch();
        }
      },
      {
        deep: true,
        immediate: false, // 不立即执行，由下面的immediate控制
      },
    );
  }

  /**
   * 停止监听器
   */
  const stopWatching = (): void => {
    if (stopWatcher) {
      stopWatcher();
      stopWatcher = null;
    }

    if (searchTimeout) {
      clearTimeout(searchTimeout);
      searchTimeout = null;
    }
  };

  // 如果启用立即搜索，则在初始化时执行一次搜索
  if (immediate) {
    executeSearch(true, true);
  }

  return {
    data,
    loading,
    error,
    search,
    reset,
    stopWatching,
  };
}

/**
 * 创建简化版本的工具栏搜索Hook
 * 适用于简单的搜索场景，减少配置复杂度
 *
 * @example
 * ```typescript
 * const keyword = ref('');
 * const category = ref('');
 *
 * const { data, loading, search } = useSimpleToolbarSearch(
 *   { keyword, category },
 *   (params) => api.searchItems(params)
 * );
 * ```
 */
export function useSimpleToolbarSearch<
  TResult = unknown,
  TParams extends SearchParams = SearchParams,
>(
  searchParams: Record<string, Ref<SearchParamValue>>,
  apiFunction: (params: TParams) => Promise<TResult>,
  debounceDelay = 300,
): UseToolbarSearchReturn<TResult> {
  return useToolbarSearch({
    searchParams,
    apiFunction,
    enableDebounce: true,
    debounceDelay,
    immediate: false,
  });
}
