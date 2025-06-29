'use server'
import questionApi from '@/api/question'
import QuestionCard from '@/components/QuestionCard'

type QuestionProps = {
  params: {
    questionId: string
  }
}

export default async function QuestionPage({ params }: QuestionProps) {
  const { questionId } = params

  // 获取题目详情
  let question
  const res = await questionApi.getQuestionById(questionId)
  question = res.data

  // 错误处理
  if (!question) {
    return <div>获取题目详情失败，请刷新重试</div>
  }

  return (
    <div id="questionPage">
      <QuestionCard question={question} />
    </div>
  )
}
