const styles = {
  footer: {
    padding: '24px',
    borderTop: '1px solid rgba(255,255,255,0.04)',
    textAlign: 'center',
  },
  text: {
    fontSize: 13,
    color: 'var(--muted)',
  },
}

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <p style={styles.text}>
        &copy; {new Date().getFullYear()} Crediconfianza &mdash; Todos los derechos reservados
      </p>
    </footer>
  )
}
