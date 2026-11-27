import { ArchitectureDiagram } from './components/ArchitectureDiagram'
import './App.css'

export default function App() {
  return (
    <div className="app">
      <header className="hero">
        <div className="hero__meta">
          <span>新产品性能开发</span>
          <span>现状流程 · 时间消耗 · AI 机会</span>
        </div>
        <h1 className="hero__brand">从性能方案到实验闭环</h1>
        <p className="hero__lead">
          看清方案如何形成、时间消耗在哪里，以及实验不达标后如何回到分析与调整。
        </p>
      </header>

      <main className="main">
        <ArchitectureDiagram />
      </main>

      <footer className="footer">
        <p>边界：AI 方向为探索设想；模型预测与调参建议仍需真实实验和工程师审核。</p>
      </footer>
    </div>
  )
}
