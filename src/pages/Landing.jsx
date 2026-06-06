import { useTenant } from '../contexts/TenantContext'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import HowItWorks from '../components/HowItWorks'
import Plans from '../components/Plans'
import Contact from '../components/Contact'
import Footer from '../components/Footer'
import useScrollReveal from '../hooks/useScrollReveal'

export default function Landing() {
  const { tenant, loading } = useTenant()
  useScrollReveal()

  const style = tenant
    ? { '--primary': tenant.color }
    : {}

  if (loading) return null

  return (
    <div style={style}>
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <Plans />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
