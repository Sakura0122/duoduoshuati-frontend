import Title from 'antd/es/typography/Title'
import { Divider, Flex } from 'antd'
import Link from 'next/link'
import questionBankApi from '@/api/questionBank'
import questionApi from '@/api/question'
import QuestionBankList from '@/components/QuestionBankList'
import QuestionList from '@/components/QuestionList'
import { QuestionBankVo } from '@/api/questionBank/type'
import { QuestionVO } from '@/api/question/type'
import QuestionTable from '@/components/QuestionTable'

// 本页面使用服务端渲染，禁用静态生成
export const dynamic = 'force-dynamic'

/**
 * 主页
 * @constructor
 */
export default async function HomePage() {
  let questionBankList: QuestionBankVo[]
  let questionList: QuestionVO[]
  const questionBankRes = await questionBankApi.getPublicList({
    pageSize: 12,
    sortField: 'createTime',
    isAsc: true,
  })
  questionBankList = questionBankRes.data.list ?? []

  // const questionRes = await questionApi.getPublicList({
  //   pageSize: 12,
  //   sortField: 'createTime',
  //   isAsc: true,
  // })
  // questionList = questionRes.data.list ?? []

  return (
    <div id="homePage" className="max-width-content">
      <Flex justify="space-between" align="center">
        <Title level={3}>最新题库</Title>
        <Link href={'/banks'}>查看更多</Link>
      </Flex>
      <QuestionBankList questionBankList={questionBankList} />
      <Divider />
      <Title level={3}>最新题目</Title>
      {/*<QuestionList questionList={questionList} />*/}
      <QuestionTable />
    </div>
  )
}
