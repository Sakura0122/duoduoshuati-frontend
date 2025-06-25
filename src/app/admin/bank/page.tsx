'use client'
import CreateModal from './components/CreateModal'
import UpdateModal from './components/UpdateModal'
import { PlusOutlined } from '@ant-design/icons'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { PageContainer, ProTable } from '@ant-design/pro-components'
import { Button, message, Space, Typography } from 'antd'
import React, { useRef, useState } from 'react'
import { QuestionBank } from '@/api/questionBank/type'
import questionBankApi from '@/api/questionBank'
import { modal } from '@/utils/AntdGlobal'

/**
 * 题库管理页面
 *
 * @constructor
 */
const QuestionBankAdminPage: React.FC = () => {
  // 是否显示新建窗口
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false)
  // 是否显示更新窗口
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false)
  const actionRef = useRef<ActionType>(null)
  // 当前题库点击的数据
  const [currentRow, setCurrentRow] = useState<QuestionBank>()

  /**
   * 删除节点
   *
   * @param row
   */
  const handleDelete = async (row: QuestionBank) => {
    const hide = message.loading('正在删除')
    if (!row) return true
    try {
      await questionBankApi.deleteQuestionBank(row.id)
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
  const columns: ProColumns<QuestionBank>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      valueType: 'text',
      hideInForm: true,
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: '关键词',
      dataIndex: 'keyword',
      valueType: 'text',
      hideInTable: true,
      hideInForm: true,
      fieldProps: {
        placeholder: '请输入标题',
      },
    },
    {
      title: '标题',
      dataIndex: 'title',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '描述',
      dataIndex: 'description',
      width: 800,
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '图片',
      dataIndex: 'picture',
      valueType: 'image',
      fieldProps: {
        width: 64,
      },
      hideInSearch: true,
    },
    {
      title: '创建时间',
      sorter: true,
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInForm: true,
    },
    {
      title: '更新时间',
      sorter: true,
      dataIndex: 'updateTime',
      valueType: 'dateTime',
      hideInForm: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <Space size="middle">
          <Typography.Link
            onClick={() => {
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
      <ProTable<QuestionBank>
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
          const sortField = Object.keys(sort)?.[0]
          const sortOrder = sort?.[sortField] ?? undefined

          const res = await questionBankApi.getQuestionBankList({
            ...params,
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
export default QuestionBankAdminPage
