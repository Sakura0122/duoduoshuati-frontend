import { ProColumns, ProTable } from '@ant-design/pro-components'
import { Modal } from 'antd'
import { message } from '@/utils/AntdGlobal'
import React from 'react'
import { Question, UpdateQuestionDto } from '@/api/question/type'
import questionApi from '@/api/question'

interface Props {
  oldData?: Question
  visible: boolean
  columns: ProColumns<Question>[]
  onSubmit: (values: UpdateQuestionDto) => void
  onCancel: () => void
}

/**
 * 更新节点
 *
 * @param fields
 */
const handleUpdate = async (fields: UpdateQuestionDto) => {
  const hide = message.loading('正在更新')
  try {
    await questionApi.updateQuestion(fields)
    hide()
    message.success('更新成功')
    return true
  } catch (error: any) {
    hide()
    return false
  }
}

/**
 * 更新弹窗
 * @param props
 * @constructor
 */
const UpdateModal: React.FC<Props> = (props) => {
  const { oldData, visible, columns, onSubmit, onCancel } = props

  if (!oldData?.id) {
    return <></>
  }

  // 表单初始化值格式转换
  const initValues = { ...oldData }
  if (oldData.tags) {
    initValues.tags = JSON.parse(oldData.tags) || []
  }

  return (
    <Modal
      destroyOnHidden
      width={1200}
      title={'更新'}
      open={visible}
      footer={null}
      onCancel={() => {
        onCancel?.()
      }}
    >
      <ProTable
        type="form"
        columns={columns}
        form={{
          initialValues: initValues,
        }}
        onSubmit={async (values: UpdateQuestionDto) => {
          const success = await handleUpdate({
            ...values,
            id: oldData?.id,
          })
          if (success) {
            onSubmit?.(values)
          }
        }}
      />
    </Modal>
  )
}
export default UpdateModal
