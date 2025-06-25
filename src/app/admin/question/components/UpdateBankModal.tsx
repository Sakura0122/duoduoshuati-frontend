import { Form, Modal, Select } from 'antd'
import React, { useEffect } from 'react'
import { QuestionBank } from '@/api/questionBank/type'
import questionApi from '@/api/question'
import questionBankApi from '@/api/questionBank'
import userStore from '@/stores/user'
import { message } from '@/utils/AntdGlobal'

interface Props {
  questionBankList: QuestionBank[]
  questionId?: string
  visible: boolean
  onCancel: () => void
}

/**
 * 更新题目所属题库弹窗
 * @param props
 * @constructor
 */
const UpdateBankModal: React.FC<Props> = (props) => {
  const { questionBankList, questionId, visible, onCancel } = props
  const [form] = Form.useForm()
  const { userinfo } = userStore()

  // 获取所属题库列表
  const getCurrentQuestionBankIdList = async () => {
    if (!questionId) return
    const res = await questionApi.getQuestionBanksById(questionId)
    form.setFieldValue('questionBankIdList' as any, res.data)
  }

  useEffect(() => {
    if (visible && questionId) {
      getCurrentQuestionBankIdList()
    }
  }, [questionId])

  return (
    <Modal
      destroyOnHidden
      title={'更新所属题库'}
      open={visible}
      footer={null}
      onCancel={() => {
        onCancel?.()
      }}
    >
      <Form form={form} style={{ marginTop: 24 }}>
        <Form.Item label="所属题库" name="questionBankIdList">
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            options={questionBankList.map((questionBank) => {
              return {
                label: questionBank.title,
                value: questionBank.id,
              }
            })}
            onSelect={async (value) => {
              const hide = message.loading('正在更新')
              try {
                await questionBankApi.addQuestionToBank({
                  questionIds: [questionId!],
                  questionBankId: value,
                  userId: userinfo.id,
                })
                hide()
                message.success('绑定题库成功')
              } finally {
                hide()
              }
            }}
            onDeselect={async (value) => {
              const hide = message.loading('正在更新')
              try {
                await questionBankApi.deleteQuestionFromBank({
                  questionIds: [questionId!],
                  questionBankId: value,
                })
                hide()
                message.success('取消绑定题库成功')
              } finally {
                hide()
              }
            }}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
export default UpdateBankModal
