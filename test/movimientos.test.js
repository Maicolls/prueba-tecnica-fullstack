import { render, screen } from '@testing-library/react'
import MovimientosPage from '../pages/movimientos'

// Mock next/router
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/movimientos'
  })
}))

// Mock Better Auth - SIN sesión para evitar useEffect
jest.mock('@/lib/auth/client', () => ({
  useSession: () => ({
    data: null,  // Sin sesión = no ejecuta fetch
    isPending: true  // En loading = pantalla simple
  }),
  authClient: {
    signOut: jest.fn()
  }
}))

describe('Movimientos Page', () => {
  test('renderiza el componente sin errores', () => {
    expect(() => render(<MovimientosPage />)).not.toThrow()
  })

  test('muestra pantalla de cargando cuando no hay sesión', () => {
    render(<MovimientosPage />)
    expect(screen.getByText('Cargando...')).toBeInTheDocument()
  })
})