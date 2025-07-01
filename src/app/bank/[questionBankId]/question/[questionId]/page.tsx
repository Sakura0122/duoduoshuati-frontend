'use server'
import { Flex, Menu } from 'antd'
import Title from 'antd/es/typography/Title'
import Sider from 'antd/es/layout/Sider'
import { Content } from 'antd/es/layout/layout'
import QuestionCard from '@/components/QuestionCard'
import Link from 'next/link'
import questionBankApi from '@/api/questionBank'
import { QuestionBankWithSimpleQuestionsVo } from '@/api/questionBank/type'
import { QuestionVO } from '@/api/question/type'
import questionApi from '@/api/question'

interface BankQuestionProps {
  params: {
    questionBankId: string
    questionId: string
  }
}

const BankQuestion = async ({ params }: BankQuestionProps) => {
  const { questionBankId, questionId } = params

  // 获取题库详情
  let bank: QuestionBankWithSimpleQuestionsVo
  const bankRes = await questionBankApi.getQuestionBankWithSimpleQuestions(questionBankId)
  bank = bankRes.data

  // 错误处理
  if (!bank) {
    return <div>获取题库详情失败，请刷新重试</div>
  }

  // 获取题目详情
  let question: QuestionVO
  const questionRes = await questionApi.getQuestionById(questionId)
  question = questionRes.data

  // 错误处理
  if (!question) {
    return <div>获取题目详情失败，请刷新重试</div>
  }

  // 题目菜单列表
  const questionMenuItemList = bank.questionList.map((q) => {
    return {
      label: <Link href={`/bank/${questionBankId}/question/${q.id}`}>{q.title}</Link>,
      key: q.id,
      title: q.title,
    }
  })

  // 获取当前题目索引
  const currentIndex = bank.questionList.findIndex((q) => q.id === questionId)

  // 获取上一题和下一题的ID
  const prevQuestionId = currentIndex > 0 ? bank.questionList[currentIndex - 1].id : undefined
  const nextQuestionId =
    currentIndex < bank.questionList.length - 1 ? bank.questionList[currentIndex + 1].id : undefined

  return (
    <div id="bankQuestion">
      <Flex gap={24}>
        <Sider width={240} theme="light" style={{ padding: '24px 0' }}>
          <Title level={4} style={{ padding: '0 20px' }}>
            {bank.title}
          </Title>
          <Menu items={questionMenuItemList} selectedKeys={[question.id]} />
        </Sider>
        <Content>
          <QuestionCard
            showComments={true}
            question={question}
            questionBankId={questionBankId}
            prevQuestionId={prevQuestionId}
            nextQuestionId={nextQuestionId}
          />
        </Content>
      </Flex>
    </div>
  )
}

export default BankQuestion
