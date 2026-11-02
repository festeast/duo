import { useEffect, useState } from 'react'
import { Header } from './components/Header'
import { InviteBanner } from './components/InviteBanner'
import { t } from './i18n/kk'
import { initAuth } from './lib/api'
import { sfx } from './lib/sound'
import { useStore } from './lib/store'
import { configured } from './lib/supabase'
import { Auth } from './screens/Auth'
import { DialogPlay } from './screens/DialogPlay'
import { Home } from './screens/Home'
import { Lesson, type LessonResult } from './screens/Lesson'
import { Profile } from './screens/Profile'
import { Result } from './screens/Result'
import { Setup } from './screens/Setup'
import { Shop } from './screens/Shop'
import { Together, type DialogStart } from './screens/Together'

type Tab = 'learn' | 'together' | 'shop' | 'me'
type Screen =
  | { name: 'main'; tab: Tab }
  | { name: 'setup'; first?: boolean }
  | { name: 'lesson'; id: string }
  | { name: 'dialog'; start: DialogStart }
  | { name: 'result'; r: LessonResult; back: Tab }

const TABS: [Tab, string, string][] = [
  ['learn', '📚', t.tabLearn],
  ['together', '💞', t.tabTogether],
  ['shop', '🛍️', t.tabShop],
  ['me', '🐱', t.tabProfile],
]

export default function App() {
  const ready = useStore((s) => s.ready)
  const session = useStore((s) => s.session)
  const profile = useStore((s) => s.profile)
  const toastMsg = useStore((s) => s.toast)
  const [screen, setScreen] = useState<Screen>({ name: 'main', tab: 'learn' })

  useEffect(() => {
    if (configured) initAuth()
  }, [])

  const go = (s: Screen) => {
    setScreen(s)
    window.scrollTo(0, 0)
  }
  const main = (tab: Tab = 'learn') => go({ name: 'main', tab })

  let body
  if (!configured) {
    body = (
      <div className="screen center" style={{ justifyContent: 'center' }}>
        <h1 className="logo">{t.appName}</h1>
        <p className="error">{t.notConfigured}</p>
      </div>
    )
  } else if (!ready) {
    body = (
      <div className="screen center" style={{ justifyContent: 'center' }}>
        <h1 className="logo pulse">{t.appName}</h1>
      </div>
    )
  } else if (!session) {
    body = <Auth onSignedUp={() => setScreen({ name: 'setup', first: true })} />
  } else if (!profile) {
    body = (
      <div className="screen center" style={{ justifyContent: 'center' }}>
        <p className="muted">{t.loading}</p>
      </div>
    )
  } else {
    switch (screen.name) {
      case 'setup':
        body = <Setup first={screen.first} onDone={() => main(screen.first ? 'together' : 'me')} />
        break
      case 'lesson':
        body = <Lesson lessonId={screen.id} onExit={() => main()} onFinish={(r) => go({ name: 'result', r, back: 'learn' })} />
        break
      case 'dialog':
        body = (
          <DialogPlay
            key={screen.start.kind === 'online' ? screen.start.sessionId : screen.start.dialogId}
            start={screen.start}
            onExit={() => main('together')}
            onFinish={(r) => go({ name: 'result', r, back: 'together' })}
          />
        )
        break
      case 'result':
        body = <Result r={screen.r} onDone={() => main(screen.back)} />
        break
      case 'main':
        body = (
          <>
            <Header onCat={() => main('me')} />
            {screen.tab === 'learn' && <Home onLesson={(id) => go({ name: 'lesson', id })} />}
            {screen.tab === 'together' && <Together onDialog={(start) => go({ name: 'dialog', start })} />}
            {screen.tab === 'shop' && <Shop />}
            {screen.tab === 'me' && <Profile onEdit={() => go({ name: 'setup' })} />}
            <nav className="tabbar">
              {TABS.map(([id, ico, label]) => (
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
  }

  const inDialog = screen.name === 'dialog'

  return (
    <div className="app">
      {session && profile && !inDialog && <InviteBanner onJoin={(sessionId) => go({ name: 'dialog', start: { kind: 'online', sessionId } })} />}
      {body}
      {toastMsg && <div className="toast pop">{toastMsg}</div>}
    </div>
  )
}
