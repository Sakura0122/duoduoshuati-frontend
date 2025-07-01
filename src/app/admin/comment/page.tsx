'use client'

import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { PageContainer, ProTable } from '@ant-design/pro-components'
import { Space, Typography } from 'antd'
import React, { useRef } from 'react'
import { message, modal } from '@/utils/AntdGlobal'
import commentApi from '@/api/comment'
import { Comment } from '@/api/comment/type'

/**
 * 题库管理页面
 *
 * @constructor
 */
const CommentPage: React.FC = () => {
  const actionRef = useRef<ActionType>(null)

  /**
   * 删除节点
   *
   * @param row
   */
  const handleDelete = async (row: Comment) => {
    const hide = message.loading('正在删除')
    if (!row) return true
    try {
      await commentApi.deleteComment(row.id)
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
  const columns: ProColumns<Comment>[] = [
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
      hideInForm: true,
      hideInTable: true,
    },
    {
      title: '评论内容',
      dataIndex: 'content',
      valueType: 'text',
      hideInForm: true,
      hideInSearch: true,
    },
    {
      title: '题目ID',
      dataIndex: 'questionId',
      valueType: 'text',
      hideInTable: true,
      hideInForm: true,
    },
    {
      title: '评论用户ID',
      dataIndex: 'userId',
      valueType: 'text',
      hideInTable: true,
      hideInForm: true,
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
      <ProTable<Comment>
        headerTitle={'查询表格'}
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        request={async (params, sort, filter) => {
          const sortField = Object.keys(sort)?.[0] || 'updateTime'
          const sortOrder = sort?.[sortField] ?? undefined

          const res = await commentApi.getCommentList({
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
    </PageContainer>
  )
}
export default CommentPage
