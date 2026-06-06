import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null, message: '', name: '', cause: '', componentStack: '' }
  }

  static getDerivedStateFromError(error) {
    return {
      error,
      message: error?.message || '(sin mensaje)',
      name: error?.name || '(sin nombre)',
      cause: error?.cause || '(sin causa)',
    }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error)
    console.error('Component stack:', info.componentStack)
    this.setState({ componentStack: info.componentStack })
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: '2rem', color: 'red', fontFamily: 'monospace' }}>
          <h2>Error en producción:</h2>
          <p><strong>Nombre:</strong> {this.state.name}</p>
          <p><strong>Mensaje:</strong> {this.state.message}</p>
          <p><strong>Causa:</strong> {this.state.cause}</p>
          <pre style={{ background: '#111', padding: '1rem', borderRadius: 8, overflow: 'auto' }}>{this.state.error.stack}</pre>
          {this.state.componentStack && (
            <>
              <p><strong>Component Stack:</strong></p>
              <pre style={{ background: '#111', padding: '1rem', borderRadius: 8, overflow: 'auto' }}>{this.state.componentStack}</pre>
            </>
          )}
        </div>
      )
    }
    return this.props.children
  }
}
