import dynamic from 'next/dynamic'

const App = dynamic(() => import('../app/page'), { ssr: false })

export default function Home() {
  return <App />
}
