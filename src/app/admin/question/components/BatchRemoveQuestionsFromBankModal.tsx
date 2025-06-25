import { Button, Form, Modal, Select } from 'antd'
import React from 'react'
import { DeleteQuestionFromBankDto, QuestionBank } from '@/api/questionBank/type'
import { message } from '@/utils/AntdGlobal'
import questionBankApi from '@/api/questionBank'

interface Props {
  questionBankList: QuestionBank[]
  questionIdList?: string[]
  visible: boolean
  onSubmit: () => void
  onCancel: () => void
}

/**
 * 批量从题库移除题目弹窗
 * @param props
 * @constructor
 */
const BatchRemoveQuestionsToBankModal: React.FC<Props> = (props) => {
  const { questionIdList = [], questionBankList, visible, onCancel, onSubmit } = props
  const [form] = Form.useForm()

  /**
   * 提交
   *
   * @param values
   */
  const doSubmit = async (values: DeleteQuestionFromBankDto) => {
    const hide = message.loading('正在操作')
    const questionBankId = values.questionBankId
    if (!questionBankId) {
      return
    }
    try {
      await questionBankApi.deleteQuestionFromBank({
        questionBankId,
        questionIds: questionIdList,
      })
      hide()
      message.success('操作成功')
      onSubmit?.()
    } finally {
      hide()
    }
  }

  return (
    <Modal
      destroyOnHidden
      title={'批量从题库移除题目'}
      open={visible}
      footer={null}
      onCancel={() => {
        onCancel?.()
      }}
    >
      <Form form={form} style={{ marginTop: 24 }} onFinish={doSubmit}>
        <Form.Item label="选择题库" name="questionBankId">
          <Select
            style={{ width: '100%' }}
            options={questionBankList.map((questionBank) => {
              return {
                label: questionBank.title,
                value: questionBank.id,
              }
            })}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}
export default BatchRemoveQuestionsToBankModal
