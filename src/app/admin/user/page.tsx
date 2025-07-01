'use client'

import { PlusOutlined } from '@ant-design/icons'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { PageContainer, ProTable } from '@ant-design/pro-components'
import { Button, Space, Typography } from 'antd'
import React, { useRef, useState } from 'react'
import type { User } from '@/api/user/type'
import userApi from '@/api/user'
import CreateModal from './components/CreateModal'
import UpdateModal from './components/UpdateModal'
import { message, modal } from '@/utils/AntdGlobal'

/**
 * 用户管理页面
 *
 * @constructor
 */
const User: React.FC = () => {
  // 是否显示新建窗口
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false)
  // 是否显示更新窗口
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false)
  const actionRef = useRef<ActionType>(null)
  // 当前用户点击的数据
  const [currentRow, setCurrentRow] = useState<User>()

  /**
   * 删除节点
   *
   * @param row
   */
  const handleDelete = async (row: User) => {
    const hide = message.loading('正在删除')
    if (!row) return true
    try {
      await userApi.deleteUser(row.id)
      hide()
      message.success('删除成功')
      actionRef?.current?.reload()
      return true
    } catch (error: any) {
      hide()
      return false
    }
  }

  /**
   * 表格列配置
   */
  const columns: ProColumns[] = [
    {
      title: 'id',
      dataIndex: 'id',
      valueType: 'text',
      hideInForm: true,
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: '关键词',
      dataIndex: 'keyword',
      valueType: 'text',
      hideInTable: true,
      hideInForm: true,
      fieldProps: {
        placeholder: '请输入账号、用户名或手机号',
      },
    },
    {
      title: '账号',
      dataIndex: 'userAccount',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '用户名',
      dataIndex: 'userName',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '密码',
      dataIndex: 'userPassword',
      valueType: 'text',
      hideInTable: true,
      hideInSearch: true,
      fieldProps: {
        placeholder: '不修改密码请置空',
      },
    },
    {
      title: '头像',
      dataIndex: 'userAvatar',
      valueType: 'image',
      fieldProps: {
        width: 64,
      },
      hideInSearch: true,
    },
    {
      title: '简介',
      dataIndex: 'userProfile',
      valueType: 'textarea',
      hideInSearch: true,
    },
    {
      title: '权限',
      dataIndex: 'userRole',
      valueEnum: {
        user: {
          text: '用户',
        },
        admin: {
          text: '管理员',
        },
      },
    },
    {
      title: '创建时间',
      sorter: true,
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: '更新时间',
      sorter: true,
      dataIndex: 'updateTime',
      valueType: 'dateTime',
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record: User) => (
        <Space size="middle">
          <Typography.Link
            onClick={() => {
              record.userPassword = ''
              setCurrentRow(record)
              setUpdateModalVisible(true)
            }}
          >
            修改
          </Typography.Link>
          <Typography.Link
            type="danger"
            onClick={() => {
              modal.confirm({
                title: '确认删除',
                content: `确定要删除吗？`,
                okText: '确认',
                cancelText: '取消',
                onOk: () => handleDelete(record),
              })
            }}
          >
            删除
          </Typography.Link>
        </Space>
      ),
    },
  ]
  return (
    <PageContainer>
      <ProTable<User>
        headerTitle={'查询表格'}
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setCreateModalVisible(true)
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={async (params, sort, filter) => {
          const sortField = Object.keys(sort)?.[0] || 'updateTime'
          const sortOrder = sort?.[sortField] ?? undefined

          const res = await userApi.getUserList({
            ...params,
            currentPage: params.current,
            sortField,
            isAsc: sortOrder === 'ascend',
            ...filter,
          })

          return {
            success: res.code === 200,
            data: res.data.list || [],
            total: Number(res.data.total) || 0,
          }
        }}
        columns={columns}
      />
      <CreateModal
        visible={createModalVisible}
        columns={columns}
        onSubmit={() => {
          setCreateModalVisible(false)
          actionRef.current?.reload()
        }}
        onCancel={() => {
          setCreateModalVisible(false)
        }}
      />
      <UpdateModal
        visible={updateModalVisible}
        columns={columns}
        oldData={currentRow}
        onSubmit={() => {
          setUpdateModalVisible(false)
          setCurrentRow(undefined)
          actionRef.current?.reload()
        }}
        onCancel={() => {
          setUpdateModalVisible(false)
        }}
      />
    </PageContainer>
  )
}
export default User
