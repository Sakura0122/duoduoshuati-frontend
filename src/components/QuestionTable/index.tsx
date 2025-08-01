'use client'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { ProTable, ProFormSelect } from '@ant-design/pro-components'
import React, { useRef, useState } from 'react'
import TagList from '@/components/TagList'
import { Space, TablePaginationConfig } from 'antd'
import Link from 'next/link'
import { QuestionListDto, QuestionVO } from '@/api/question/type'
import questionApi from '@/api/question'
import { PageDto } from '@/types/type'
import VipTag from '@/components/VipTag'
import './index.scss'

interface Props {
  // 默认值（用于展示服务端渲染的数据）
  defaultQuestionList?: QuestionVO[]
  defaultTotal?: number
  // 默认搜索条件
  defaultSearchParams?: PageDto<QuestionListDto>
  // 请求
  defaultRequest?: (params: PageDto<QuestionListDto>) => Promise<any>
}

/**
 * 题目表格组件
 *
 * @constructor
 */
const QuestionTable = (props: Props) => {
  const {
    defaultQuestionList,
    defaultTotal,
    defaultSearchParams = {},
    defaultRequest = questionApi.getPublicList,
  } = props
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
      title: '标题',
      dataIndex: 'keyword',
      valueType: 'text',
      hideInTable: true,
      fieldProps: {
        placeholder: '请输入标题',
      },
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
      sorter: true,
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
      title: '会员专属',
      dataIndex: 'isVip',
      valueType: 'select',
      hideInTable: true,
      fieldProps: {
        options: [
          {
            label: '否',
            value: 0,
          },
          {
            label: '是',
            value: 1,
          },
        ],
      },
    },
    {
      title: '标签',
      dataIndex: 'tags',
      valueType: 'select',
      fieldProps: {
        mode: 'tags',
      },
      renderFormItem: (_, config: any) => {
        return (
          <ProFormSelect style={{ width: '200px' }} placeholder={'请输入标签'} label={'标签'} {...config.fieldProps} />
        )
      },
      render: (_, record) => {
        return (
          <Space>
            {record.isVip === 1 && <VipTag />}
            <TagList tagList={JSON.parse(record.tags) || []} />
          </Space>
        )
      },
    },
  ]

  return (
    <div className="question-table">
      <ProTable<QuestionVO>
        actionRef={actionRef}
        size="large"
        search={{
          filterType: 'light',
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
                success: true,
                data: defaultQuestionList,
                total: defaultTotal,
              }
            }
          }

          const sortParams =
            Object.keys(sort).length > 0
              ? {
                  sortField: Object.keys(sort)[0], // 排序字段
                  isAsc: sort[Object.keys(sort)[0]] === 'ascend', // 是否升序
                }
              : {}

          const res = await defaultRequest({
            ...params,
            ...sortParams,
            currentPage: params.current,
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
