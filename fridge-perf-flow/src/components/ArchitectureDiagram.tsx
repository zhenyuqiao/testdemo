import { useRef, useState } from 'react'
import './WorkflowDiagram.css'

type Pressure = '低' | '中' | '高'

const STEPS = [
  {
    id: 'intake',
    no: '01',
    title: '接收需求',
    short: '明确目标与约束',
    action: '接收产品尺寸、性能目标、区域标准、成本要求，并选择相应性能平台。',
    pressure: '中' as Pressure,
    reason: '需求来源分散，需要先统一口径。',
    roles: ['企划', '产品团队', '性能工程师'],
    tools: ['企划资料', '性能平台资料'],
    pain: ['性能、空间、成本目标可能尚未完全对齐'],
    ai: '将企划书、表格和自然语言需求结构化，识别缺项与约束冲突。',
  },
  {
    id: 'design',
    no: '02',
    title: '设计性能方案',
    short: '计算并形成初步配置',
    action: '确定压缩机选型、发泡层厚度、VIP 尺寸与厚度等关键配置，形成初步方案。',
    pressure: '高' as Pressure,
    reason: '知识分散在个人工具中，方案高度依赖资深专家经验。',
    roles: ['资深性能专家', '性能工程师'],
    tools: ['个人知识库', '个人 Excel', '经验公式', '仿真 / 计算模型'],
    pain: ['工具和经验难复用', '模型精度仍需实验验证', '方案依据不易追溯'],
    ai: '沉淀专家规则与历史方案，结合模型给出候选配置、依据和预测区间。',
  },
  {
    id: 'align',
    no: '03',
    title: '协调产品约束',
    short: '性能 × 空间 × 成本',
    action: '与产品及企划相关方协调方案；例如增加发泡层后空间不足，需要重新权衡。',
    pressure: '高' as Pressure,
    reason: '跨团队往返沟通，任一约束变化都可能触发方案重算。',
    roles: ['性能团队', '产品 / 结构团队', '企划 / 成本'],
    tools: ['会议沟通', '方案表格', '人工比对'],
    pain: ['多目标冲突', '反复沟通调整', '变更影响难快速评估'],
    ai: '自动检查空间、成本和性能约束，快速对比多套权衡方案并提示影响。',
  },
  {
    id: 'prototype',
    no: '04',
    title: '制作样机',
    short: '把方案变成可测对象',
    action: '方案协调通过后制作样机，准备软硬件配置与实验条件并送入实验室。',
    pressure: '中' as Pressure,
    reason: '样机与实验资源需要协调，配置错误会放大后续返工。',
    roles: ['样机团队', '性能工程师', '实验室'],
    tools: ['样机配置清单', '实验申请 / 排期'],
    pain: ['样机与设备资源有限', '配置和版本需要准确同步'],
    ai: '自动生成可追溯配置清单，检查版本一致性，并辅助设备与实验排期。',
  },
  {
    id: 'test',
    no: '05',
    title: '实验验证与调参',
    short: '运行实验、调整软硬件',
    action: '组合硬件、软件、测试条件和区域标准，运行实验并持续调整电控等参数。',
    pressure: '高' as Pressure,
    reason: '场景组合庞大且设备有限，参数之间还会相互影响。',
    roles: ['实验工程师', '性能工程师'],
    tools: ['第三方测试软件', '简单电控调参工具', '实验设备'],
    pain: ['无法穷举全部组合', '测试项可能互相干扰', '反复调参和等待实验结果'],
    ai: '用实验设计筛选高价值组合，约束下调度设备，并推荐下一组待验证参数。',
  },
  {
    id: 'analyse',
    no: '06',
    title: '结果分析与决策',
    short: '达标则定版，不达标则回路',
    action: '汇总实验数据、判断是否达标、定位偏差原因，并决定调整参数还是重做方案。',
    pressure: '高' as Pressure,
    reason: '数据分散、归因复杂；不达标会进入多轮“分析—调整—再验证”。',
    roles: ['性能工程师', '资深专家', '项目团队'],
    tools: ['测试报告', '人工分析', '经验判断'],
    pain: ['数据整理耗时', '问题归因依赖经验', '历史结果难直接反馈模型'],
    ai: '统一管理实验数据，自动对比目标、辅助归因，并把验证结果回流模型。',
  },
] as const

export function ArchitectureDiagram() {
  const [activeId, setActiveId] = useState('design')
  const [focus, setFocus] = useState<'all' | 'pressure' | 'ai'>('all')
  const detailRef = useRef<HTMLElement>(null)
  const active = STEPS.find((step) => step.id === activeId) ?? STEPS[1]

  const selectStep = (id: string) => {
    setActiveId(id)
    if (window.matchMedia('(max-width: 720px)').matches) {
      requestAnimationFrame(() => {
        detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    }
  }

  return (
    <section className="workflow" aria-label="冰箱新产品性能开发交互流程图">
      <div className="toolbar">
        <div>
          <p className="section-kicker">WORKFLOW MAP</p>
          <h2>新产品性能开发全流程</h2>
        </div>
        <div className="view-switch" aria-label="流程图查看模式">
          {[
            ['all', '完整流程'],
            ['pressure', '时间消耗'],
            ['ai', 'AI 机会'],
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={focus === id ? 'is-active' : ''}
              onClick={() => setFocus(id as typeof focus)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="legend" aria-label="图例">
        <span><i className="dot dot--high" />高耗时压力</span>
        <span><i className="dot dot--mid" />中耗时压力</span>
        <span><i className="loop-mark">↩</i>返工 / 迭代回路</span>
        <span><i className="ai-mark">AI</i>探索机会，尚未落地</span>
      </div>

      <div className="flow-shell">
        <div className="flow-map">
          <div className="start-node">
            <span>输入</span>
            <strong>产品需求</strong>
            <small>性能 · 空间 · 成本</small>
          </div>

          <ol className="stage-list">
            {STEPS.map((step, index) => {
              const dimmed = focus === 'pressure' && step.pressure !== '高'
              return (
                <li key={step.id} className={dimmed ? 'is-dimmed' : ''}>
                  <button
                    type="button"
                    className={`stage-card stage-card--${step.pressure === '高' ? 'high' : 'mid'}${
                      active.id === step.id ? ' is-active' : ''
                    }${focus === 'ai' ? ' show-ai' : ''}`}
                    onClick={() => selectStep(step.id)}
                    aria-pressed={active.id === step.id}
                  >
                    <span className="stage-card__top">
                      <span className="stage-card__no">{step.no}</span>
                      <span className={`pressure pressure--${step.pressure === '高' ? 'high' : 'mid'}`}>
                        {step.pressure}耗时
                      </span>
                    </span>
                    <strong>{step.title}</strong>
                    <span className="stage-card__short">{step.short}</span>
                    {focus === 'ai' && <span className="stage-card__ai">AI 介入点</span>}
                  </button>
                  {index < STEPS.length - 1 && <span className="connector" aria-hidden>→</span>}
                </li>
              )
            })}
          </ol>

          <div className="end-node">
            <span>达标</span>
            <strong>方案定版</strong>
            <small>性能配置交付</small>
          </div>

          <div className="loop loop--tuning">
            <span><b>06</b> 实验不达标</span>
            <strong>分析原因 → 调整参数 → 再验证</strong>
            <span className="loop__target">回到 05 ↶</span>
          </div>
          <div className="loop loop--redesign">
            <span><b>06</b> 配置层面无法解决</span>
            <strong>返回方案设计 / 约束协调</strong>
            <span className="loop__target">回到 02 / 03 ↶</span>
          </div>
        </div>

        <aside className="detail-panel" key={active.id} ref={detailRef}>
          <div className="detail-panel__head">
            <div>
              <span className="detail-panel__step">STEP {active.no}</span>
              <h3>{active.title}</h3>
            </div>
            <span className={`pressure pressure--${active.pressure === '高' ? 'high' : 'mid'}`}>
              {active.pressure}耗时压力
            </span>
          </div>

          <p className="detail-panel__action">{active.action}</p>

          <div className="time-reason">
            <span>时间消耗原因</span>
            <p>{active.reason}</p>
          </div>

          <div className="detail-grid">
            <div>
              <h4>参与角色</h4>
              <div className="chips">
                {active.roles.map((role) => <span key={role}>{role}</span>)}
              </div>
            </div>
            <div>
              <h4>当前工具</h4>
              <div className="chips chips--tools">
                {active.tools.map((tool) => <span key={tool}>{tool}</span>)}
              </div>
            </div>
          </div>

          <div className="pain-box">
            <h4>关键痛点</h4>
            <ul>
              {active.pain.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>

          <div className="ai-box">
            <span>AI 探索机会</span>
            <p>{active.ai}</p>
            <small>需经真实数据、实验与工程师判断验证</small>
          </div>
        </aside>
      </div>

      <div className="insight-row">
        <article>
          <span className="insight-row__number">3</span>
          <div><strong>三处主要耗时区</strong><p>方案设计、约束协调、实验与分析闭环</p></div>
        </article>
        <article>
          <span className="insight-row__number">2</span>
          <div><strong>两类反复回路</strong><p>参数级迭代，以及方案级返工</p></div>
        </article>
        <article>
          <span className="insight-row__number">1</span>
          <div><strong>一条数据闭环</strong><p>方案依据 → 实验数据 → 分析结论 → 模型校准</p></div>
        </article>
        <div className="qualitative-note">
          <span>关于耗时</span>
          <p>当前资料未提供可靠工时；“高 / 中”表示相对压力，不代表实际时长或占比。</p>
        </div>
      </div>
    </section>
  )
}
