import '@wangeditor/editor/dist/css/style.css'
import './index.less'
import { ProForm, ProFormItemProps } from '@ant-design/pro-components'
import { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor'
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import React, { useState, useEffect } from 'react'

const WangEditor: React.FC<{
  value?: string
  onChange?: (val: string) => void
}> = ({ value, onChange }) => {
  const [editor, setEditor] = useState<IDomEditor | null>(null)
  useEffect(() => {
    return () => {
      if (editor == null) return
      editor.destroy()
      setEditor(null)
    }
  }, [editor])

  const toolbarConfig: Partial<IToolbarConfig> = {}
  const editorConfig: Partial<IEditorConfig> = {
    placeholder: '请输入',
  }

  const triggerChange = (value: string) => {
    onChange?.(value === '<p><br></p>' ? '' : value)
  }

  return (
    <>
      <div style={{ border: '1px solid #ccc', zIndex: 100 }}>
        <Toolbar
          editor={editor}
          defaultConfig={toolbarConfig}
          mode="default"
          style={{ borderBottom: '1px solid #ccc' }}
        />
        <Editor
          defaultConfig={editorConfig}
          value={value}
          onCreated={setEditor}
          onChange={(editor) => triggerChange(editor.getHtml())}
          mode="default"
          style={{ height: '500px', overflowY: 'hidden' }}
        />
      </div>
    </>
  )
}

const ProFormWangEditor: React.FC<ProFormItemProps> = (props) => {
  return (
    <ProForm.Item {...props}>
      <WangEditor />
    </ProForm.Item>
  )
}

export { WangEditor, ProFormWangEditor }
