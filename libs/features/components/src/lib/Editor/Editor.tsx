import '@wangeditor/editor/dist/css/style.css';
import { IDomEditor } from '@wangeditor/editor';
import { Editor as WangEditor, Toolbar } from '@wangeditor/editor-for-react';
import { message } from 'antd';
import axios from 'axios';
import { nanoid } from 'nanoid';
import {
  useEffect,
  useState,
  useMemo,
  forwardRef,
  useImperativeHandle,
} from 'react';
import type { Ref } from 'react';
import styled from 'styled-components';
import { extname } from '../utils';
import { matchUnknownTypes } from './matchUnknownTypes';

export interface signature {
  accessid: string;
  callback: string;
  dir: string;
  expire: string;
  host: string;
  policy: string;
  signature: string;
}

export interface types {
  imageTypes?: string[];
  videoTypes?: string[];
}

interface EditorProps {
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
  signature?: signature;
  types?: types;
  maxSize?: number;
}

const toolbarConfig = {
  // excludeKeys: ['insertImage', 'insertVideo'],
};

// TODO ref
export const Editor = (
  { className, value, onChange, signature, types, maxSize }: EditorProps,
  ref: Ref<() => IDomEditor | null>
) => {
  const [editor, setEditor] = useState<IDomEditor | null>(null);
  useEffect(() => {
    if (editor !== null) {
      editor.on('modalOrPanelShow', (modalOrPanel) => {
        if (modalOrPanel.type !== 'modal') return;
        const nodesList = document.querySelectorAll(
          'input[id^="w-e-insert-image-"]'
        );
        if (nodesList.length >= 3) {
          console.dir(nodesList[nodesList.length - 1]);
          nodesList[nodesList.length - 1].parentElement!.style.cssText = `
            display:none
          `;
        }
      });
    }
    return () => {
      if (editor == null) return;
      editor.destroy();
      setEditor(null);
    };
  }, [editor]);

  const getEditor = () => editor;

  useImperativeHandle(ref, () => getEditor);

  //验证类型
  const verifyType = (
    file: File,
    types: Array<string> = [],
    type: 'image' | 'video'
  ) => {
    const ext = matchUnknownTypes(type + '/' + extname(file.name));
    return types.some((t) => t === ext.toLowerCase());
  };

  //用于自定义上传
  const customUploadFn = async (
    file: File,
    signature: signature,
    type: 'image' | 'video'
  ) => {
    if (maxSize) {
      if (file.size > maxSize) {
        message.error(`文件大小限制为${file.size / 1024 / 1024}M`);
        return false;
      }
    } else {
      if (file.size > 50 * 1024 * 1024) {
        message.error(`文件大小限制为50M`);
        return false;
      }
    }

    if (
      !verifyType(
        file,
        type === 'image' ? types?.imageTypes : types?.videoTypes,
        type
      )
    )
      return message.error('不允许的上传类型');

    message.loading({
      content: '正在上传',
      duration: 0,
    });
    const formData = new FormData();
    const fileObj = {
      key: signature.dir + nanoid() + '.' + extname(file.name),
      policy: signature.policy,
      OSSAccessKeyId: signature.accessid,
      success_action_status: 200,
      callback: signature.callback,
      signature: signature.signature,
      file,
      name: file.name,
    };
    for (const key in fileObj) {
      formData.append(key, (fileObj as any)[key]);
    }
    const { data } = await axios.post(signature.host, formData);
    message.success('上传成功');
    return data;
  };

  const editorConfig = useMemo(() => {
    if (!signature)
      return {
        placeholder: '请输入内容...',
      };

    return {
      placeholder: '请输入内容...',
      MENU_CONF: {
        uploadImage: {
          // 自定义上传
          async customUpload(file: File, insertFn: any) {
            const data = await customUploadFn(file, signature, 'image');
            if (data) insertFn(data.resourceUrl, data.fileName);
          },
          //类型限制
          allowedFileTypes: types?.imageTypes ?? ['image/*'],
        },

        uploadVideo: {
          // 自定义上传
          async customUpload(file: File, insertFn: any) {
            // 自己实现上传，并得到视频url
            // 最后插入图片
            const data = await customUploadFn(file, signature, 'video');
            if (data) insertFn(data.resourceUrl);
          },
          //类型限制
          allowedFileTypes: types?.videoTypes ?? ['video/*'],
          maxFileSize: maxSize ?? 50 * 1024 * 1024,
        },
      },
    };
  }, [signature]);

  if (!signature) return <span>Loading...</span>;

  return (
    <Container className={className}>
      <Toolbar
        editor={editor}
        defaultConfig={toolbarConfig}
        mode="default"
        style={{ borderBottom: '1px solid #ccc' }}
      />
      <WangEditor
        defaultConfig={editorConfig}
        value={value}
        onCreated={setEditor}
        onChange={(editor) => {
          const html = editor.getHtml();
          onChange?.(html);
        }}
        mode="default"
        className="editor"
      />
    </Container>
  );
};

const Container = styled.div`
  .editor {
    height: 500px;
  }
`;

export default forwardRef(Editor);
