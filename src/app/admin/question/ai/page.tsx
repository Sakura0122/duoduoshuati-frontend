'use client'
import { Button, Form, Input, InputNumber } from 'antd'
import React, { useState } from 'react'
import './index.scss'
import questionApi from '@/api/question'
import { AiGenerateQuestionsDto } from '@/api/question/type'
import { message } from '@/utils/AntdGlobal'

const AiGenerateQuestionPage = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  /**
   * 提交
   *
   * @param values
   */
  const doSubmit = async (values: AiGenerateQuestionsDto) => {
    const hide = message.loading('正在操作')
    setLoading(true)
    try {
      await questionApi.aiGenerateQuestions(values)
      hide()
      message.success('操作成功')
    } finally {
      hide()
      setLoading(false)
    }
  }

  return (
    <div id="aiGenerateQuestionPage">
      <h2>AI 生成题目</h2>
      <Form form={form} style={{ marginTop: 24 }} onFinish={doSubmit}>
        <Form.Item label="题目方向" name="questionType">
          <Input placeholder="比如 Java" />
        </Form.Item>
        <Form.Item label="题目数量" name="number">
          <InputNumber defaultValue={10} max={50} min={1} />
        </Form.Item>
        <Form.Item>
          <Button loading={loading} style={{ width: 180 }} type="primary" htmlType="submit">
            提交
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}
export default AiGenerateQuestionPage
