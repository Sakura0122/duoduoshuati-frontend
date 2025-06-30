import { LockOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { useRouter } from 'next/navigation'
import React from 'react'
import './index.scss'

interface AccessControlPromptProps {
  type: 'vip' | 'login' // 必传，决定默认样式和逻辑
  title?: string // 可选，覆盖默认标题
  description?: string // 可选，覆盖默认描述
  buttonText?: string // 可选，覆盖默认按钮文字
  icon?: React.ReactNode // 可选，覆盖默认图标
  onButtonClick?: () => void // 可选，覆盖默认点击事件
  className?: string
  style?: React.CSSProperties
}

const AccessControlPrompt: React.FC<AccessControlPromptProps> = ({
  type,
  title,
  description,
  buttonText,
  icon,
  onButtonClick,
  className = '',
  style,
}) => {
  const router = useRouter()

  // 默认配置（颜色、标题、行为等）
  const defaultConfig = {
    vip: {
      icon: <LockOutlined />,
      iconColor: '#faad14',
      title: '会员专属内容',
      description: '对不起，本功能为会员专属，请先开通 VIP 后访问。',
      buttonText: '开通 VIP',
      action: () => router.push('/user/center'),
    },
    login: {
      icon: <LockOutlined />,
      iconColor: '#aaa',
      title: '登录后可查看答案',
      description: '',
      buttonText: '去登录',
      action: () => router.push('/user/login'),
    },
  }

  const currentConfig = defaultConfig[type]

  // 合并默认值和自定义props
  const mergedConfig = {
    icon: icon || currentConfig.icon,
    iconColor: currentConfig.iconColor, // 颜色固定用默认值
    title: title || currentConfig.title,
    description: description ?? currentConfig.description, // 允许显式传递空字符串
    buttonText: buttonText || currentConfig.buttonText,
    action: onButtonClick || currentConfig.action,
  }

  return (
    <div className={`access-control-prompt ${type}-prompt ${className}`} style={style}>
      <div className="prompt-icon" style={{ color: mergedConfig.iconColor }}>
        {mergedConfig.icon}
      </div>
      <h3 className="prompt-title">{mergedConfig.title}</h3>
      {mergedConfig.description && <p className="prompt-description">{mergedConfig.description}</p>}
      <Button type="primary" className="prompt-button" onClick={mergedConfig.action}>
        {mergedConfig.buttonText}
      </Button>
    </div>
  )
}

export default AccessControlPrompt
