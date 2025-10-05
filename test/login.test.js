import { render, screen } from '@testing-library/react'
import Login from '../pages/login'

// Mock the next/router
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/login'
  })
}))

// Mock the Better Auth
jest.mock('@/lib/auth/client', () => ({
  useSession: () => ({ data: null, isPending: false }),
  authClient: {
    signIn: { github: jest.fn() }
  }
}))

describe('Login Page', () => {
  test('renderiza el título de bienvenida', () => {
    render(<Login />)
    expect(screen.getByText('Bienvenid@')).toBeInTheDocument()
  })

  test('renderiza el subtítulo del sistema', () => {
    render(<Login />)
    expect(screen.getByText('Sistema de Gestión de Ingresos y Egresos')).toBeInTheDocument()
  })

  test('muestra el botón de GitHub', () => {
    render(<Login />)
    expect(screen.getByText('Continuar con GitHub')).toBeInTheDocument()
  })

  test('muestra el título de iniciar sesión', () => {
    render(<Login />)
    expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument()
  })
})