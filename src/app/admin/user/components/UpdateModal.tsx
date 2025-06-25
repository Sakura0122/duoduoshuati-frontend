import { ProColumns, ProTable } from '@ant-design/pro-components'
import { Modal } from 'antd'
import React from 'react'
import { UpdateUserDto, User } from '@/api/user/type'
import userApi from '@/api/user'
import { message } from '@/utils/AntdGlobal'

interface Props {
  oldData?: User
  visible: boolean
  columns: ProColumns<User>[]
  onSubmit: (values: UpdateUserDto) => void
  onCancel: () => void
}

/**
 * 更新节点
 *
 * @param fields
 */
const handleUpdate = async (fields: UpdateUserDto) => {
  const hide = message.loading('正在更新')
  try {
    await userApi.updateUser(fields)
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
        onSubmit={async (values: UpdateUserDto) => {
          const success = await handleUpdate({
            ...values,
            id: oldData?.id as any,
          } as any)
          if (success) {
            onSubmit?.(values)
          }
        }}
      />
    </Modal>
  )
}
export default UpdateModal
