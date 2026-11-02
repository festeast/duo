import { useState } from 'react'
import { Hud } from './components/Hud'
import { t } from './i18n/kk'
import { sfx } from './lib/sound'
import { activePlayer, useStore } from './lib/store'
import { Duo } from './screens/Duo'
import { Home } from './screens/Home'
import { Lesson, type LessonResult } from './screens/Lesson'
import { Result } from './screens/Result'
import { Setup } from './screens/Setup'
import { Shop } from './screens/Shop'
import { Title } from './screens/Title'

type Tab = 'learn' | 'duo' | 'shop'
type Screen =
  | { name: 'title' }
  | { name: 'setup'; edit?: boolean }
  | { name: 'main'; tab: Tab }
  | { name: 'lesson'; id: string }
  | { name: 'result'; r: LessonResult }

export default function App() {
  const me = useStore(activePlayer)
  const [screen, setScreen] = useState<Screen>({ name: 'title' })
  const go = (s: Screen) => {
    setScreen(s)
    window.scrollTo(0, 0)
  }
  const main = (tab: Tab = 'learn') => go({ name: 'main', tab })

  let body
  switch (screen.name) {
    case 'title':
      body = <Title onStart={() => (me ? main() : go({ name: 'setup' }))} />
      break
    case 'setup':
      body = (
        <Setup
          editing={screen.edit ? me : undefined}
          onDone={() => main(screen.edit ? 'learn' : me ? 'duo' : 'learn')}
          onCancel={me ? () => main() : undefined}
        />
      )
      break
    case 'lesson':
      body = <Lesson lessonId={screen.id} onExit={() => main()} onFinish={(r) => go({ name: 'result', r })} />
      break
    case 'result':
      body = <Result r={screen.r} onDone={() => main()} />
      break
    case 'main':
      body = (
        <>
          <Hud onCat={() => go({ name: 'setup', edit: true })} />
          {screen.tab === 'learn' && <Home onLesson={(id) => go({ name: 'lesson', id })} />}
          {screen.tab === 'duo' && <Duo onAddPartner={() => go({ name: 'setup' })} />}
          {screen.tab === 'shop' && <Shop />}
          <nav className="tabbar">
            {(
              [
                ['learn', '📖', t.tabLearn],
                ['duo', '💞', t.tabDuo],
                ['shop', '🛍', t.tabShop],
              ] as const
            ).map(([id, ico, label]) => (
              <button
                key={id}
                className={screen.tab === id ? 'on' : ''}
                onClick={() => {
                  sfx.click()
                  main(id)
                }}
              >
                <span className="ico">{ico}</span>
                {label}
              </button>
            ))}
          </nav>
        </>
      )
      break
  }

  return <div className="app">{body}</div>
}
