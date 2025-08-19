import { useState } from 'react'
import styled from 'styled-components'
import { useNotifications } from '../hooks/useNotifications'
import { Bell, BellOff, Send, CheckCircle, AlertCircle, X } from 'lucide-react'

const Container = styled.div`
  padding: 24px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  backdrop-filter: blur(8px);
`

const Content = styled.div`
  text-align: center;
`

const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
`

const IconWrapper = styled.div`
  padding: 12px;
  background: rgba(59, 130, 246, 0.2);
  border-radius: 50%;
`

const Title = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #dbeafe;
  margin-bottom: 8px;
`

const Description = styled.p`
  font-size: 14px;
  color: #cbd5e1;
  line-height: 1.6;
  margin-bottom: 0;
`

const TipContainer = styled.div`
  margin-top: 16px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(59, 130, 246, 0.3);
`

const TipText = styled.p`
  font-size: 12px;
  color: #dbeafe;
  font-weight: 500;
  margin: 0;
`

const MainContainer = styled.div`
  padding: 24px;
  background: #1e293b;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  max-width: 400px;
`

const MainTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #e2e8f0;
`

const StatusContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background: #334155;
  border-radius: 8px;
  margin-bottom: 16px;
`

const StatusLabel = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #cbd5e1;
`

const StatusBadge = styled.span`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background: ${props => 
    props.$granted ? 'rgba(34, 197, 94, 0.2)' :
    props.$denied ? 'rgba(239, 68, 68, 0.2)' :
    'rgba(245, 158, 11, 0.2)'
  };
  color: ${props => 
    props.$granted ? '#86efac' :
    props.$denied ? '#fca5a5' :
    '#fde047'
  };
`

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const ActionButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => 
    props.$primary ? '#3b82f6' :
    props.$success ? '#10b981' :
    props.$danger ? '#ef4444' :
    props.$purple ? '#8b5cf6' :
    '#6b7280'
  };
  color: white;

  &:hover {
    background: ${props => 
      props.$primary ? '#2563eb' :
      props.$success ? '#059669' :
      props.$danger ? '#dc2626' :
      props.$purple ? '#7c3aed' :
      '#4b5563'
    };
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`

const MessageContainer = styled.div`
  padding: 12px;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 8px;
  margin-top: 16px;
`

const MessageText = styled.p`
  font-size: 14px;
  color: #dbeafe;
  margin: 0;
`

const SimpleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  max-width: 400px;
`

const BellIcon = styled(Bell)`
  color: #fca5a5;
  font-size: 24px;
`

const ProhibitionIcon = styled(X)`
  position: absolute;
  top: -4px;
  right: -4px;
  color: #ef4444;
  background: #1e293b;
  border-radius: 50%;
  padding: 2px;
  font-size: 12px;
  border: 1px solid #ef4444;
`

export const NotificationManager = ({ serverUrl = import.meta.env.VITE_API_URL_ONLY }) => {
  const {
    isSupported,
    permission,
    subscription,
    requestPermission,
    subscribeToNotifications,
    unsubscribeFromNotifications,
    sendTestNotification
  } = useNotifications()

  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleRequestPermission = async () => {
    setIsLoading(true)
    const granted = await requestPermission()
    if (granted) {
      setMessage('Permisos otorgados correctamente')
    } else {
      setMessage('Permisos denegados')
    }
    setIsLoading(false)
  }

  const handleSubscribe = async () => {
    setIsLoading(true)
    console.log({server_url: serverUrl})
    const result = await subscribeToNotifications(serverUrl)
    if (result) {
      setMessage('Suscripción exitosa')
    } else {
      setMessage('Error al suscribirse')
    }
    setIsLoading(false)
  }

  const handleUnsubscribe = async () => {
    setIsLoading(true)
    await unsubscribeFromNotifications(serverUrl)
    setMessage('Desuscripción exitosa')
    setIsLoading(false)
  }

  const handleTestNotification = async () => {
    setIsLoading(true)
    await sendTestNotification(serverUrl)
    setMessage('Notificación de prueba enviada')
    setIsLoading(false)
  }

  if (!isSupported) {
    return (
      <div>
        <BellIcon size={24} />
        <ProhibitionIcon size={12} />
      </div>
    )
  }

  return (
    <MainContainer>
      <MainTitle>
        <Bell size={20} color="#3b82f6" />
        Notificaciones Push
      </MainTitle>

      <StatusContainer>
        <StatusLabel>Permisos:</StatusLabel>
        <StatusBadge 
          $granted={permission === 'granted'}
          $denied={permission === 'denied'}
        >
          {permission === 'granted' ? 'Concedidos' :
           permission === 'denied' ? 'Denegados' : 'Pendientes'}
        </StatusBadge>
      </StatusContainer>

      <StatusContainer>
        <StatusLabel>Suscripción:</StatusLabel>
        <StatusBadge $granted={subscription}>
          {subscription ? 'Activa' : 'Inactiva'}
        </StatusBadge>
      </StatusContainer>

      <ButtonContainer>
        {permission !== 'granted' && (
          <ActionButton
            onClick={handleRequestPermission}
            disabled={isLoading}
            $primary
          >
            <Bell size={16} />
            Solicitar Permisos
          </ActionButton>
        )}

        {permission === 'granted' && !subscription && (
          <ActionButton
            onClick={handleSubscribe}
            disabled={isLoading}
            $success
          >
            <CheckCircle size={16} />
            Suscribirse
          </ActionButton>
        )}

        {subscription && (
          <>
            <ActionButton
              onClick={handleTestNotification}
              disabled={isLoading}
              $purple
            >
              <Send size={16} />
              Enviar Prueba
            </ActionButton>

            <ActionButton
              onClick={handleUnsubscribe}
              disabled={isLoading}
              $danger
            >
              <BellOff size={16} />
              Desuscribirse
            </ActionButton>
          </>
        )}
      </ButtonContainer>

      {message && (
        <MessageContainer>
          <MessageText>{message}</MessageText>
        </MessageContainer>
      )}
    </MainContainer>
  )
} 