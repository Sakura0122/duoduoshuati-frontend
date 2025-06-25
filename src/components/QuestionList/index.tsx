'use client'
import { Card, List } from 'antd'
import TagList from '@/components/TagList'
import Link from 'next/link'
import { QuestionVO } from '@/api/question/type'

interface Props {
  questionBankId?: number
  questionList: QuestionVO[]
  cardTitle?: string
}

/**
 * 题目列表组件
 * @param props
 * @constructor
 */
const QuestionList = (props: Props) => {
  const { questionList = [], cardTitle, questionBankId } = props

  return (
    <Card className="question-list" title={cardTitle}>
      <List
        dataSource={questionList}
        renderItem={(item) => (
          <List.Item extra={<TagList tagList={JSON.parse(item.tags) || []} />}>
            <List.Item.Meta
              title={
                <Link href={questionBankId ? `/bank/${questionBankId}/question/${item.id}` : `/question/${item.id}`}>
                  {item.title}
                </Link>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  )
}

export default QuestionList
