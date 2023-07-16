import {
  type DrawerFormProps,
  type ProFormInstance,
  DrawerForm,
  ProFormText,
  ProFormDigit,
  ProFormTreeSelect,
  ProFormRadio,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { useRef, useEffect } from 'react';
import { useModel } from '@umijs/max';
import { addDept, updateDept, infoDept, selectableDept } from '@/apis/system/dept';
import type { DeptTreeVo } from '@/apis/types/system/dept';

interface UpdateFormProps extends DrawerFormProps {
  record: Nullable<DeptTreeVo>;
}

const UpdateForm: React.FC<UpdateFormProps> = ({ record, ...props }) => {
  const formRef = useRef<ProFormInstance>();

  /**
   * 注册字典数据
   */
  const { selectDict } = useModel('dict');
  const sysNormalDisable = selectDict('sys_normal_disable');

  /**
   * 获取初始化数据
   */
  useEffect(() => {
    formRef.current?.resetFields();
    if (record) {
      infoDept(record.deptId).then((info) => {
        formRef.current?.setFieldsValue({
          ...info,
          parentId: info.parentId || undefined,
        });
      });
    }
  }, [record]);

  /**
   * 提交表单
   * @param values 表单值
   */
  const handleSubmit = async (values: Recordable) => {
    if (record) {
      await updateDept({
        ...values,
        deptId: record.deptId,
      });
    } else {
      await addDept(values);
    }
    formRef.current?.resetFields();
  };

  return (
    <DrawerForm
      {...props}
      layout="horizontal"
      labelCol={{ flex: '100px' }}
      formRef={formRef}
      title={record ? `编辑部门-${record.deptName}` : `新增部门`}
      onFinish={async (values) => {
        await handleSubmit(values);
        props.onFinish?.(values);
        return true;
      }}
    >
      <ProFormTreeSelect
        name="parentId"
        label="上级部门"
        request={selectableDept}
        fieldProps={{
          fieldNames: { label: 'deptName', value: 'deptId' },
        }}
      />
      <ProFormText name="deptName" label="部门名称" rules={[{ required: true }]} />
      <ProFormDigit name="deptSort" label="显示顺序" fieldProps={{ min: 0, precision: 0 }} />
      <ProFormRadio.Group
        name="status"
        label="状态"
        initialValue={'0'}
        fieldProps={{ options: sysNormalDisable }}
      />
      <ProFormTextArea name="remark" label="备注" />
    </DrawerForm>
  );
};

export default UpdateForm;
