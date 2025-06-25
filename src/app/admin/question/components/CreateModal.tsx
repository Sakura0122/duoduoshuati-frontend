import { ProColumns, ProTable } from '@ant-design/pro-components'
import { Modal } from 'antd'
import { message } from '@/utils/AntdGlobal'
import React from 'react'
import { AddQuestionDto, Question } from '@/api/question/type'
import questionApi from '@/api/question'

interface Props {
  visible: boolean
  columns: ProColumns<Question>[]
  onSubmit: (values: AddQuestionDto) => void
  onCancel: () => void
}

/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: AddQuestionDto) => {
  const hide = message.loading('正在添加')
  try {
    await questionApi.addQuestion(fields)
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
      width={1200}
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
        onSubmit={async (values: AddQuestionDto) => {
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
