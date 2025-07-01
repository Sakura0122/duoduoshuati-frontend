import Title from 'antd/es/typography/Title'
import { Avatar, Button, Card } from 'antd'
import Meta from 'antd/es/card/Meta'
import Paragraph from 'antd/es/typography/Paragraph'
import questionApi from '@/api/question'
import questionBankApi from '@/api/questionBank'
import QuestionTable from '@/components/QuestionTable'
import { QuestionListDto, QuestionVO } from '@/api/question/type'
import { PageDto } from '@/types/type'
import { QuestionBankVo } from '@/api/questionBank/type'

type BankProps = {
  params: {
    questionBankId: string
  }
}

const Bank = async ({ params }: BankProps) => {
  const { questionBankId } = params

  // 题库信息
  let bank: QuestionBankVo
  const bankRes = await questionBankApi.getQuestionBankById(questionBankId)
  bank = bankRes.data

  // 题目列表
  let questionList: QuestionVO[]
  let total
  const defaultSearchParams: PageDto<QuestionListDto> = {
    questionBankId,
    pageSize: 12,
  }
  const questionRes = await questionApi.getPublicList(defaultSearchParams)
  questionList = questionRes.data.list ?? []
  total = questionRes.data.total ?? 0

  if (!bank) {
    return <div>获取题库详情失败，请刷新重试</div>
  }

  // 获取第一道题目，用于 “开始刷题” 按钮跳转
  let firstQuestionId
  if (questionList.length > 0) {
    firstQuestionId = questionList[0].id
  }

  return (
    <div id="bankPage" className="max-width-content" style={{ width: '100%' }}>
      <Card>
        <Meta
          avatar={<Avatar src={bank.picture} size={72} />}
          title={
            <Title level={3} style={{ marginBottom: 0 }}>
              {bank.title}
            </Title>
          }
          description={
            <>
              <Paragraph type="secondary">{bank.description}</Paragraph>
              <Button
                type="primary"
                shape="round"
                href={`/bank/${questionBankId}/question/${firstQuestionId}`}
                target="_blank"
                disabled={!firstQuestionId}
              >
                开始刷题
              </Button>
            </>
          }
        ></Meta>
      </Card>
      <div style={{ marginBottom: 16 }} />
      <QuestionTable
        defaultQuestionList={questionList}
        defaultTotal={total}
        defaultSearchParams={defaultSearchParams}
      />
    </div>
  )
}

export default Bank
