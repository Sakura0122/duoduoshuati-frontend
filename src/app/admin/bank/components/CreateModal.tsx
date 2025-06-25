import { ProColumns, ProTable } from '@ant-design/pro-components'
import { Modal } from 'antd'
import { message } from '@/utils/AntdGlobal'
import React from 'react'
import { AddQuestionBankDto } from '@/api/questionBank/type'
import { QuestionBank } from '@/api/questionBank/type'
import questionBankApi from '@/api/questionBank'

interface Props {
  visible: boolean
  columns: ProColumns<QuestionBank>[]
  onSubmit: (values: AddQuestionBankDto) => void
  onCancel: () => void
}

/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: AddQuestionBankDto) => {
  const hide = message.loading('正在添加')
  try {
    await questionBankApi.addQuestionBank(fields)
    hide()
    message.success('创建成功')
    return true
  } catch (error: any) {
    hide()
    return false
  }
}

/**
 * 创建弹窗
 * @param props
 * @constructor
 */
const CreateModal: React.FC<Props> = (props) => {
  const { visible, columns, onSubmit, onCancel } = props

  return (
    <Modal
      destroyOnHidden
      title={'创建'}
      open={visible}
      footer={null}
      onCancel={() => {
        onCancel?.()
      }}
    >
      <ProTable
        type="form"
        columns={columns}
        onSubmit={async (values: AddQuestionBankDto) => {
          const success = await handleAdd(values)
          if (success) {
            onSubmit?.(values)
          }
        }}
      />
    </Modal>
  )
}
export default CreateModal
