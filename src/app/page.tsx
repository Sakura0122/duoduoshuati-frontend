import Title from 'antd/es/typography/Title'
import { Card, Divider, Flex } from 'antd'
import Link from 'next/link'
import questionBankApi from '@/api/questionBank'
import QuestionBankList from '@/components/QuestionBankList'
import { QuestionBankVo } from '@/api/questionBank/type'
import QuestionTable from '@/components/QuestionTable'
import { QuestionVO } from '@/api/question/type'
import questionApi from '@/api/question'

// 本页面使用服务端渲染，禁用静态生成
export const dynamic = 'force-dynamic'

/**
 * 主页
 * @constructor
 */
export default async function HomePage() {
  let questionBankList: QuestionBankVo[]
  const questionBankRes = await questionBankApi.getPublicList({
    pageSize: 12,
    sortField: 'createTime',
    isAsc: true,
  })
  questionBankList = questionBankRes.data.list ?? []

  let questionList: QuestionVO[]
  let total
  const defaultSearchParams = {
    pageSize: 12,
  }
  const questionRes = await questionApi.getPublicList(defaultSearchParams)
  questionList = questionRes.data.list ?? []
  total = questionRes.data.total ?? 0

  return (
    <div id="homePage" className="max-width-content">
      <Flex justify="space-between" align="center">
        <Title level={3}>最新题库</Title>
        <Link href={'/banks'}>查看更多</Link>
      </Flex>
      <QuestionBankList questionBankList={questionBankList} />
      <Divider />
      <Title level={3}>最新题目</Title>
      <Card>
        <QuestionTable
          defaultQuestionList={questionList}
          defaultTotal={total}
          defaultSearchParams={defaultSearchParams}
        />
      </Card>
    </div>
  )
}
