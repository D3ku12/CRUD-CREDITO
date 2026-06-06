import { useEffect } from 'react'

export default function useScrollReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll('[data-reveal]')
    elements.forEach(el => {
      el.style.opacity = '1'
      el.style.transform = 'none'
    })
  }, [])
}
