import { ProColumns, ProTable } from '@ant-design/pro-components'
import { Modal } from 'antd'
import { message } from '@/utils/AntdGlobal'
import React from 'react'
import { QuestionBank, UpdateQuestionBankDto } from '@/api/questionBank/type'
import questionBankApi from '@/api/questionBank'

interface Props {
  oldData?: QuestionBank
  visible: boolean
  columns: ProColumns<QuestionBank>[]
  onSubmit: (values: UpdateQuestionBankDto) => void
  onCancel: () => void
}

/**
 * 更新节点
 *
 * @param fields
 */
const handleUpdate = async (fields: UpdateQuestionBankDto) => {
  const hide = message.loading('正在更新')
  try {
    await questionBankApi.updateQuestionBank(fields)
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

  if (!oldData) {
    return <></>
  }

  return (
    <Modal
      destroyOnHidden
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
          initialValues: oldData,
        }}
        onSubmit={async (values: UpdateQuestionBankDto) => {
          const success = await handleUpdate({
            ...values,
            id: oldData.id as any,
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
