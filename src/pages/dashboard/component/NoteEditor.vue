<template>
  <div class="quill-editor-wrapper">
    <div ref="editorRef" class="quill-container"></div>
    <div v-if="showWordCount" class="word-count">
      <span>
        {{ currentWordCount }}
        <span v-if="maxLength > 0">/ {{ maxLength }}</span>
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

// 定义 Quill 工具栏模块的类型
interface QuillToolbarModule {
  container: HTMLElement;
}

interface Props {
  content?: string; // 初始内容
  placeholder?: string; // 占位符
  readonly?: boolean; // 是否只读
  maxLength?: number; // 最大字数限制
  showWordCount?: boolean; // 是否显示字数统计
}

interface Emits {
  (e: 'update:content', content: string): void; // 内容更新
  (e: 'ready', quill: Quill): void; // 编辑器准备就绪
}

const props = withDefaults(defineProps<Props>(), {
  content: '',
  placeholder: '请输入内容...',
  readonly: false,
  maxLength: 0, // 0 表示无限制
  showWordCount: true,
});

const emit = defineEmits<Emits>();

const editorRef = ref<HTMLElement>();
let quillInstance: Quill | null = null;

// 字数统计相关
const currentWordCount = ref(0);

// Quill 配置
const quillOptions = {
  theme: 'snow',
  placeholder: props.placeholder,
  readOnly: props.readonly,
  modules: {
    toolbar: [
      [{ header: [1, 2, 3, false] }], // 标题
      ['bold', 'italic', 'underline', 'strike'], // 加粗、斜体、下划线、删除线
      [{ color: [] }, { background: [] }], // 字体颜色、背景色
      [{ font: [] }], // 字体
      [{ list: 'ordered' }, { list: 'bullet' }], // 有序、无序列表
      [{ align: [] }], // 对齐方式
      [{ indent: '-1' }, { indent: '+1' }], // 缩进
      ['blockquote', 'code-block'], // 引用、代码块
      ['link'], // 链接
      ['clean'], // 清除格式
    ],
  },
  history: {
    delay: 1000, // 撤销延迟
    maxStack: 50, // 最大撤销步骤
    userOnly: true, // 只记录用户操作
  },
  clipboard: {
    // 确保粘贴时保持HTML格式
    matchVisual: false,
  },
};

// 获取文本长度（不包含HTML标签）
const getTextLength = () => {
  if (!quillInstance) return 0;
  return quillInstance.getText().length - 1; // -1 是因为 Quill 总是在末尾添加一个换行符
};

// 更新字数统计
const updateWordCount = () => {
  currentWordCount.value = getTextLength();
};

// 处理文本超出限制
const handleTextOverLimit = () => {
  if (!quillInstance || props.maxLength <= 0) return;

  const text = quillInstance.getText();
  const currentLength = text.length - 1; // -1 因为 Quill 总是在末尾添加换行符

  if (currentLength > props.maxLength) {
    // 获取当前选择位置
    const selection = quillInstance.getSelection();

    // 截断文本到限制长度
    const truncatedText = text.substring(0, props.maxLength);
    quillInstance.setText(truncatedText);

    // 恢复光标位置，但不超过限制长度
    if (selection) {
      const newIndex = Math.min(selection.index, props.maxLength);
      quillInstance.setSelection(newIndex, 0);
    }

    // 更新字数统计
    updateWordCount();
  }
};

// 初始化编辑器
const initEditor = () => {
  if (editorRef.value && !quillInstance) {
    quillInstance = new Quill(editorRef.value, quillOptions);

    // 设置初始内容
    if (props.content) {
      quillInstance.clipboard.dangerouslyPasteHTML(props.content);
    }

    // 初始化字数统计
    updateWordCount();

    // 添加工具栏按钮提示
    nextTick(() => {
      addToolbarTooltips();
    });

    // 监听内容变化
    quillInstance.on('text-change', () => {
      if (quillInstance) {
        // 检查字数限制
        if (props.maxLength > 0 && getTextLength() > props.maxLength) {
          handleTextOverLimit();
          return;
        }

        const content = quillInstance.root.innerHTML;

        // 更新字数统计
        updateWordCount();

        emit('update:content', content);
      }
    });

    // 通知父组件编辑器已准备就绪
    emit('ready', quillInstance);
  }
};

// 添加工具栏提示的函数
const addToolbarTooltips = () => {
  if (!quillInstance) return;

  const toolbar = (quillInstance.getModule('toolbar') as QuillToolbarModule)
    .container;

  // 工具栏按钮提示映射
  const tooltips = {
    '.ql-header .ql-picker-label': '标题',
    '.ql-header .ql-picker-item[data-value="1"]': '标题1',
    '.ql-header .ql-picker-item[data-value="2"]': '标题2',
    '.ql-header .ql-picker-item[data-value="3"]': '标题3',
    '.ql-header .ql-picker-item[data-value="false"]': '正文',
    '.ql-bold': '粗体',
    '.ql-italic': '斜体',
    '.ql-underline': '下划线',
    '.ql-strike': '删除线',
    '.ql-color .ql-picker-label': '字体颜色',
    '.ql-background .ql-picker-label': '背景色',
    '.ql-font .ql-picker-label': '字体',
    '.ql-list[value="ordered"]': '有序列表',
    '.ql-list[value="bullet"]': '无序列表',
    '.ql-align .ql-picker-label': '对齐方式',
    '.ql-align .ql-picker-item[data-value=""]': '左对齐',
    '.ql-align .ql-picker-item[data-value="center"]': '居中对齐',
    '.ql-align .ql-picker-item[data-value="right"]': '右对齐',
    '.ql-align .ql-picker-item[data-value="justify"]': '两端对齐',
    '.ql-indent[value="-1"]': '减少缩进',
    '.ql-indent[value="+1"]': '增加缩进',
    '.ql-blockquote': '引用',
    '.ql-code-block': '代码块',
    '.ql-link': '插入链接',
    '.ql-clean': '清除格式',
  };

  // 为每个按钮添加title属性
  Object.entries(tooltips).forEach(([selector, title]) => {
    const element = toolbar.querySelector(selector);
    if (element) {
      element.setAttribute('title', title);
    }
  });
};

// 获取内容
const getContent = () => {
  return quillInstance ? quillInstance.root.innerHTML : '';
};

// 设置内容
const setContent = (content: string) => {
  if (quillInstance) {
    if (content) {
      quillInstance.clipboard.dangerouslyPasteHTML(content);
    } else {
      quillInstance.setText(''); // 如果内容为空，清空编辑器
    }
    // 更新字数统计
    updateWordCount();
  }
};

// 重置编辑器
const resetEditor = () => {
  if (quillInstance) {
    quillInstance.setText('');
    updateWordCount();
  }
};

// 监听内容变化
watch(
  () => props.content,
  (newContent) => {
    if (quillInstance && newContent !== getContent()) {
      setContent(newContent);
    }
  },
);

// 组件挂载时初始化
onMounted(() => {
  nextTick(() => {
    initEditor();
  });
});

// 组件卸载时清理
onUnmounted(() => {
  if (quillInstance) {
    quillInstance = null;
  }
});

// 暴露方法给父组件
defineExpose({
  getContent,
  setContent,
  resetEditor,
  getQuill: () => quillInstance,
  getWordCount: () => currentWordCount.value,
  getTextLength,
});
</script>

<style lang="scss">
.quill-editor-wrapper {
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;

  .quill-container {
    flex: 1;
    position: relative;
    min-height: 0; // 确保flex子项可以收缩

    // 为字数统计预留空间
    .ql-editor {
      padding-bottom: 20px;
      height: 100%;
      overflow-y: auto;
    }
  }

  // 字数统计样式
  .word-count {
    position: absolute;
    bottom: 2px;
    right: 10px;
    font-size: 10px;
    color: #999;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 4px;
    pointer-events: none;
    z-index: 1000;
  }

  // 修复斜体样式
  .ql-editor em {
    font-style: italic !important;
  }

  // 工具栏按钮悬停效果
  .ql-toolbar {
    .ql-formats {
      button,
      .ql-picker {
        &:hover {
          background-color: #f0f0f0;
          border-radius: 4px;
        }
      }
    }
  }
}
</style>
