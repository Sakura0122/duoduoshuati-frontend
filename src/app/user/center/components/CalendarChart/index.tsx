import React, { useEffect, useState } from 'react'
import ReactECharts from 'echarts-for-react'
import dayjs from 'dayjs'
import userApi from '@/api/user'

const CalendarChart = () => {
  // 签到日期列表（[1, 200]，表示第 1 和第 200 天有签到记录）
  const [dataList, setDataList] = useState<number[]>([])
  // 当前年份
  const year = new Date().getFullYear()

  // 请求后端获取数据
  const fetchDataList = async () => {
    const res = await userApi.getUserSignInRecord(year)
    setDataList(res.data)
  }

  // 保证只会调用一次
  useEffect(() => {
    fetchDataList()
  }, [])

  // 计算图表所需的数据
  const optionsData = dataList.map((dayOfYear) => {
    // 计算日期字符串
    const dateStr = dayjs(`${year}-01-01`)
      .add(dayOfYear - 1, 'day')
      .format('YYYY-MM-DD')
    return [dateStr, 1]
  })

  // 图表配置
  const options = {
    tooltip: {
      formatter: function (params: any) {
        // params.value 是一个数组，格式为 [日期, 值]
        const date = params.value[0]
        const value = params.value[1]
        return `${date}<br/>`
      },
    },
    visualMap: {
      show: false,
      min: 0,
      max: 1,
      inRange: {
        // 颜色从灰色到浅绿色
        color: ['#efefef', 'lightgreen'],
      },
    },
    calendar: {
      range: year,
      left: 20,
      // 单元格自动宽度，高度为 16 像素
      cellSize: ['auto', 16],
      yearLabel: {
        position: 'top',
        formatter: `${year} 年刷题记录`,
      },
    },
    series: {
      type: 'heatmap',
      coordinateSystem: 'calendar',
      data: optionsData,
    },
  }

  return <ReactECharts className="calendar-chart" option={options} />
}

export default CalendarChart
