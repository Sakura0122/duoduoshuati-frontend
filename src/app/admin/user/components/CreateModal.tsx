import { ProColumns, ProTable } from '@ant-design/pro-components'
import { Modal } from 'antd'
import React from 'react'
import { AddUserDto, User } from '@/api/user/type'
import userApi from '@/api/user'
import { message } from '@/utils/AntdGlobal'

interface Props {
  visible: boolean
  columns: ProColumns<User>[]
  onSubmit: (values: AddUserDto) => void
  onCancel: () => void
}

/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: AddUserDto) => {
  const hide = message.loading('正在添加')
  try {
    await userApi.addUser(fields)
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
        onSubmit={async (values: AddUserDto) => {
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
