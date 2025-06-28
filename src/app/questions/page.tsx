'use server'
import Title from 'antd/es/typography/Title'
import QuestionTable from '@/components/QuestionTable'
import './index.css'
import questionApi from '@/api/question'

type QuestionProps = {
  searchParams: {
    keyword: string
  }
}

const Question = async ({ searchParams }: QuestionProps) => {
  // 获取 url 的查询参数
  const { keyword } = searchParams
  // 题目列表和总数
  let questionList
  let total

  const res = await questionApi.getPublicList({
    keyword,
    pageSize: 12,
    sortField: 'createTime',
  })
  questionList = res.data.list ?? []
  total = res.data.total ?? 0

  return (
    <div id="questionsPage" className="max-width-content">
      <Title level={3}>题目大全</Title>
      <QuestionTable
        defaultQuestionList={questionList}
        defaultTotal={total}
        defaultSearchParams={{
          keyword,
        }}
      />
    </div>
  )
}

export default Question
