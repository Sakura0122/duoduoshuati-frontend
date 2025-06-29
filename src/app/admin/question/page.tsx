'use client'

import { PlusOutlined } from '@ant-design/icons'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { PageContainer, ProTable } from '@ant-design/pro-components'
import { Button, Popconfirm, Select, Space, Table, Typography } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import TagList from '@/components/TagList'
import MdEditor from '@/components/MdEditor'
import CreateModal from './components/CreateModal'
import UpdateModal from './components/UpdateModal'
import UpdateBankModal from './components/UpdateBankModal'
import BatchAddQuestionsToBankModal from './components/BatchAddQuestionsToBankModal'
import BatchRemoveQuestionsFromBankModal from './components/BatchRemoveQuestionsFromBankModal'
import questionApi from '@/api/question'
import { Question } from '@/api/question/type'
import { message, modal } from '@/utils/AntdGlobal'
import questionBankApi from '@/api/questionBank'
import { QuestionBank } from '@/api/questionBank/type'
import { SelectProps } from 'antd'

/**
 * 题目管理页面
 *
 * @constructor
 */
const QuestionAdminPage: React.FC = () => {
  // 是否显示新建窗口
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false)
  // 是否显示更新窗口
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false)
  // 是否显示更新所属题库窗口
  const [updateBankModalVisible, setUpdateBankModalVisible] = useState<boolean>(false)
  // 是否显示批量向题库添加题目弹窗
  const [batchAddQuestionsToBankModalVisible, setBatchAddQuestionsToBankModalVisible] = useState<boolean>(false)
  // 是否显示批量从题库移除题目弹窗
  const [batchRemoveQuestionsFromBankModalVisible, setBatchRemoveQuestionsFromBankModalVisible] =
    useState<boolean>(false)
  // 当前选中的题目 id 列表
  const [selectedQuestionIdList, setSelectedQuestionIdList] = useState<string[]>([])
  const actionRef = useRef<ActionType>(null)
  // 当前题目点击的数据
  const [currentRow, setCurrentRow] = useState<Question>()

  // 获取题库列表
  const [questionBankList, setQuestionBankList] = useState<QuestionBank[]>([])
  const getQuestionBankList = async () => {
    const res = await questionBankApi.getQuestionBankList({
      pageSize: 200,
      sortField: 'createTime',
    })
    setQuestionBankList(res.data.list)
  }

  useEffect(() => {
    getQuestionBankList()
  }, [])

  /**
   * 删除节点
   *
   * @param row
   */
  const handleDelete = async (row: Question) => {
    const hide = message.loading('正在删除')
    if (!row) return true
    try {
      await questionApi.deleteQuestion(row.id)
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
   * 批量删除节点
   *
   * @param questionIdList
   */
  const handleBatchDelete = async (questionIdList: string[]) => {
    const hide = message.loading('正在操作')
    try {
      await questionApi.batchDeleteQuestion(questionIdList)
      hide()
      message.success('操作成功')
      actionRef?.current?.reload()
    } catch (error: any) {
      hide()
    }
  }

  /**
   * 表格列配置
   */
  const columns: ProColumns<Question>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      valueType: 'text',
      hideInForm: true,
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: '所属题库',
      dataIndex: 'questionBankId',
      hideInTable: true,
      hideInForm: true,
      renderFormItem: (_, config: any) => {
        return (
          <Select
            {...config.fieldProps}
            options={questionBankList.map((questionBank) => {
              return {
                label: questionBank.title,
                value: questionBank.id,
              }
            })}
            allowClear
          />
        )
      },
    },
    {
      title: '标题',
      dataIndex: 'title',
      valueType: 'text',
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
    },
    {
      title: '内容',
      dataIndex: 'content',
      valueType: 'text',
      hideInSearch: true,
      hideInTable: true,
      renderFormItem: (_, config: any) => {
        // 编写要渲染的表单项
        // value 和 onchange 会通过 form 自动注入
        return <MdEditor {...config} />
      },
    },
    {
      title: '答案',
      dataIndex: 'answer',
      valueType: 'text',
      hideInSearch: true,
      hideInTable: true,
      renderFormItem: (_, config: any, form) => {
        // 编写要渲染的表单项
        // value 和 onchange 会通过 form 自动注入
        return <MdEditor {...config} />
      },
    },
    {
      title: '标签',
      dataIndex: 'tags',
      valueType: 'select',
      fieldProps: {
        mode: 'tags',
      },
      render: (_, record) => {
        const tagList = JSON.parse(record.tags || '[]')
        return <TagList tagList={tagList} />
      },
    },
    {
      title: '是否VIP',
      dataIndex: 'isVip',
      valueType: 'select',
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
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
      fieldProps: {
        options: [
          {
            label: '待审核',
            value: 0,
          },
          {
            label: '通过',
            value: 1,
          },
          {
            label: '拒绝',
            value: 2,
          },
        ],
      },
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
      width: 200,
      render: (_, record) => (
        <Space size="middle">
          <Typography.Link
            onClick={() => {
              console.log(record)
              setCurrentRow(record)
              setUpdateModalVisible(true)
            }}
          >
            修改
          </Typography.Link>
          <Typography.Link
            onClick={() => {
              setCurrentRow(record)
              setUpdateBankModalVisible(true)
            }}
          >
            修改所属题库
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
      <ProTable<Question>
        headerTitle={'查询表格'}
        actionRef={actionRef}
        scroll={{
          x: true,
        }}
        search={{
          labelWidth: 120,
        }}
        rowKey="id"
        rowSelection={{
          // 自定义选择项参考: https://ant.design/components/table-cn/#components-table-demo-row-selection-custom
          // 注释该行则默认不显示下拉选项
          selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
        }}
        tableAlertRender={({ selectedRowKeys, selectedRows, onCleanSelected }) => {
          return (
            <Space size={24}>
              <span>
                已选 {selectedRowKeys.length} 项
                <a style={{ marginInlineStart: 8 }} onClick={onCleanSelected}>
                  取消选择
                </a>
              </span>
            </Space>
          )
        }}
        tableAlertOptionRender={({ selectedRowKeys, selectedRows, onCleanSelected }) => {
          return (
            <Space size={16}>
              <Button
                onClick={() => {
                  // 打开弹窗
                  setSelectedQuestionIdList(selectedRowKeys as string[])
                  setBatchAddQuestionsToBankModalVisible(true)
                }}
              >
                批量向题库添加题目
              </Button>
              <Button
                onClick={() => {
                  // 打开弹窗
                  setSelectedQuestionIdList(selectedRowKeys as string[])
                  setBatchRemoveQuestionsFromBankModalVisible(true)
                }}
              >
                批量从题库移除题目
              </Button>
              <Popconfirm
                title="确认删除"
                description="你确定要删除这些题目么？"
                onConfirm={() => {
                  // 批量删除
                  handleBatchDelete(selectedRowKeys as string[])
                }}
                okText="确认"
                cancelText="取消"
              >
                <Button
                  danger
                  onClick={() => {
                    // 打开弹窗
                  }}
                >
                  批量删除题目
                </Button>
              </Popconfirm>
            </Space>
          )
        }}
        toolBarRender={() => [
          <Button type="primary" ghost key="primary" href="/admin/question/ai" target="_blank">
            <PlusOutlined /> AI 生成题目
          </Button>,
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

          const res = await questionApi.getQuestionList({
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
      <UpdateBankModal
        questionBankList={questionBankList}
        visible={updateBankModalVisible}
        questionId={currentRow?.id}
        onCancel={() => {
          setUpdateBankModalVisible(false)
        }}
      />
      <BatchAddQuestionsToBankModal
        questionBankList={questionBankList}
        visible={batchAddQuestionsToBankModalVisible}
        questionIdList={selectedQuestionIdList}
        onSubmit={() => {
          setBatchAddQuestionsToBankModalVisible(false)
        }}
        onCancel={() => {
          setBatchAddQuestionsToBankModalVisible(false)
        }}
      />
      <BatchRemoveQuestionsFromBankModal
        questionBankList={questionBankList}
        visible={batchRemoveQuestionsFromBankModalVisible}
        questionIdList={selectedQuestionIdList}
        onSubmit={() => {
          setBatchRemoveQuestionsFromBankModalVisible(false)
        }}
        onCancel={() => {
          setBatchRemoveQuestionsFromBankModalVisible(false)
        }}
      />
    </PageContainer>
  )
}
export default QuestionAdminPage
