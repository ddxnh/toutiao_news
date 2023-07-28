// 富文本编辑器
// 创建编辑器函数，创建工具栏函数

// 富文本编辑器
const { createEditor, createToolbar } = window.wangEditor

// 编辑器的配置选项
const editorConfig = {
  placeholder: '发布文章内容...',
  onChange(editor) {
    const html = editor.getHtml()
    // 将编辑器里面内容同步到textarea中
    document.querySelector('.publish-content').value = html
  }
}

// 创建编辑器
const editor = createEditor({
  // 那个编辑器
  selector: '#editor-container',
  // 默认内容
  html: '<p><br></p>',
  config: editorConfig,
  mode: 'default', // or 'simple'
})

// 工具栏的配置选项
const toolbarConfig = {}

// 创建工具栏
const toolbar = createToolbar({
  editor,
  selector: '#toolbar-container',
  config: toolbarConfig,
  mode: 'default', // or 'simple'
})
