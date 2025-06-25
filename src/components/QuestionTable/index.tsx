'use client'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import React, { useRef, useState } from 'react'
import TagList from '@/components/TagList'
import { TablePaginationConfig, Tag } from 'antd'
import Link from 'next/link'
import { QuestionListDto, QuestionVO } from '@/api/question/type'
import questionApi from '@/api/question'

interface Props {
  // 默认值（用于展示服务端渲染的数据）
  defaultQuestionList?: QuestionVO[]
  defaultTotal?: number
  // 默认搜索条件
  defaultSearchParams?: QuestionListDto
}

/**
 * 题目表格组件
 *
 * @constructor
 */
const QuestionTable: React.FC = (props: Props) => {
  const { defaultQuestionList, defaultTotal, defaultSearchParams = {} } = props
  const actionRef = useRef<ActionType>(null)
  // 题目列表
  const [questionList, setQuestionList] = useState<QuestionVO[]>(defaultQuestionList || [])
  // 题目总数
  const [total, setTotal] = useState<number>(defaultTotal || 0)
  // 用于判断是否首次加载
  const [init, setInit] = useState<boolean>(true)

  /**
   * 表格列配置
   */
  const columns: ProColumns<QuestionVO>[] = [
    {
      title: '搜索',
      dataIndex: 'searchText',
      valueType: 'text',
      hideInTable: true,
    },
    {
      title: '标题',
      dataIndex: 'title',
      valueType: 'text',
      hideInSearch: true,
      render: (_, record) => {
        return <Link href={`/question/${record.id}`}>{record.title}</Link>
      },
    },
    {
      title: '难度',
      dataIndex: 'difficulty',
      valueType: 'select',
      fieldProps: {
        options: [
          {
            label: '简单',
            value: 1,
          },
          {
            label: '中等',
            value: 3,
          },
          {
            label: '困难',
            value: 5,
          },
        ],
      },
      render: (_, record) => {
        let color
        let text
        switch (record.difficulty) {
          case 1:
            color = '#EE9E0C'
            text = '简单'
            break
          case 3:
            color = 'green'
            text = '中等'
            break
          case 5:
            color = 'red'
            text = '困难'
            break
        }
        return <span style={{ color, fontWeight: 'bold', fontSize: '16px' }}>{text}</span>
      },
    },
    {
      title: '标签',
      dataIndex: 'tagList',
      valueType: 'select',
      fieldProps: {
        mode: 'tags',
      },
      render: (_, record) => {
        return <TagList tagList={JSON.parse(record.tags) || []} />
      },
    },
  ]

  return (
    <div className="question-table">
      <ProTable<QuestionVO>
        actionRef={actionRef}
        size="large"
        search={{
          labelWidth: 'auto',
        }}
        options={false}
        rowKey="id"
        form={{
          initialValues: defaultSearchParams,
        }}
        dataSource={questionList}
        pagination={
          {
            pageSize: 12,
            showTotal: (total) => `总共 ${total} 条`,
            showSizeChanger: false,
            total,
          } as TablePaginationConfig
        }
        request={async (params, sort, filter) => {
          if (init) {
            setInit(false)
            // 如果已有外层传来的默认数据，无需再次查询
            if (defaultQuestionList && defaultTotal) {
              return {
                success: true, // 必须返回 success
                data: defaultQuestionList, // 返回默认数据
                total: defaultTotal, // 返回默认总数
              }
            }
          }

          const sortField = Object.keys(sort)?.[0]
          const sortOrder = sort?.[sortField] ?? undefined

          const res = await questionApi.getPublicList({
            ...params,
            sortField,
            isAsc: sortOrder === 'ascend',
            ...filter,
          })

          // 更新结果
          const newData = res.data.list || []
          const newTotal = res.data.total || 0
          // 更新状态
          setQuestionList(newData)
          setTotal(newTotal)

          return {
            success: res.code === 200,
            data: newData,
            total: newTotal,
          }
        }}
        columns={columns}
      />
    </div>
  )
}
export default QuestionTable
