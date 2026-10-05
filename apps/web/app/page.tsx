'use client'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { FormEvent, useEffect, useMemo, useState } from 'react'
import {
  Backpack,
  ChevronRight,
  CircleHelp,
  Compass,
  Crown,
  Gem,
  Heart,
  Map,
  Menu,
  MessageCircle,
  MoreHorizontal,
  ScrollText,
  Send,
  Shield,
  Sparkles,
  Swords,
  UserRound,
  X,
  Zap,
} from 'lucide-react'
import {
  getGameMessages,
  getInventory,
  getPlayer,
  sendGameMessage,
  type AgentAction,
  type InventoryItem,
  type PlayerState,
} from '../lib/game-api'

import type { ChatMessage } from '../lib/game-types'

const GAME_ID = '65cfed9f-a08c-4de3-a400-379d896f5f09'

const suggestions = [
  'Pickup the sword',
  'Go back to the town',
  'Pickup the gold',
]

export default function Page() {
  const [message, setMessage] = useState('')
  const [mobileMenu, setMobileMenu] = useState(false)

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [actions, setActions] = useState<AgentAction[]>([])

  const [player, setPlayer] = useState<PlayerState | null>(null)
  const [inventory, setInventory] = useState<InventoryItem[]>([])

  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState('')

  const latest = useMemo(
    () => messages[messages.length - 1],
    [messages]
  )

  useEffect(() => {
    let mounted = true

    async function loadGame() {
      try {
        setInitialLoading(true)
        setError('')

        const [history, playerState, inventoryState] =
          await Promise.all([
            getGameMessages(GAME_ID),
            getPlayer(GAME_ID),
            getInventory(GAME_ID),
          ])

        if (!mounted) return

        setMessages(
          history.map((chatMessage) => ({
            id: chatMessage.id,
            content: chatMessage.content,
            role: chatMessage.role,
          }))
        )

        setPlayer(playerState)
        setInventory(inventoryState)
      } catch (error) {
        console.error(error)

        if (mounted) {
          setError(
            error instanceof Error
              ? error.message
              : 'The game could not be loaded.'
          )
        }
      } finally {
        if (mounted) {
          setInitialLoading(false)
        }
      }
    }

    loadGame()

    return () => {
      mounted = false
    }
  }, [])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmed = message.trim()

    if (!trimmed || loading) {
      return
    }

    setLoading(true)
    setError('')

    const playerMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'player',
      content: trimmed,
    }

    setMessages((current) => [...current, playerMessage])
    setMessage('')

    try {
      const result = await sendGameMessage(
        GAME_ID,
        trimmed
      )

      const [updatedPlayer, updatedInventory] =
        await Promise.all([
          getPlayer(GAME_ID),
          getInventory(GAME_ID),
        ])

      setPlayer(updatedPlayer)
      setInventory(updatedInventory)

      const gmMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'gm',
        content: result.message,
      }

      setMessages((current) => [
        ...current,
        gmMessage,
      ])

      setActions(result.actions)
    } catch (error) {
      console.error(error)

      setError(
        error instanceof Error
          ? error.message
          : 'The Game Master could not respond.'
      )
    } finally {
      setLoading(false)
    }
  }

  function useSuggestion(suggestion: string) {
    if (loading) return

    setMessage(suggestion)
  }

  const playerName = player?.name ?? 'Arden Vale'
  const playerLevel = player?.level ?? 7
  const playerHp = player?.hp ?? 0
  const playerMaxHp = player?.maxHp ?? 100
  const playerGold = player?.gold ?? 0

  const hpPercentage =
    playerMaxHp > 0
      ? Math.min(
        100,
        Math.max(
          0,
          (playerHp / playerMaxHp) * 100
        )
      )
      : 0

  return (
    <main className="min-h-screen overflow-hidden bg-[#080b17] text-[#e8e9f2] selection:bg-cyan-300/30">
      <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col lg:flex-row">

        {/* SIDEBAR */}
        <aside
          className={`fixed inset-y-0 z-20 w-[280px] border-r border-white/[0.07] bg-[#0b0f1f] px-5 py-6 transition-[left] lg:relative lg:left-0 ${mobileMenu ? 'left-0' : '-left-[280px]'
            }`}
        >
          <div className="mb-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-xl border border-cyan-300/25 bg-cyan-300/10 text-cyan-300">
                <Crown />
              </div>

              <div>
                <p className="font-serif text-lg tracking-wide text-white">
                  Elderglen
                </p>

                <p className="text-[10px] uppercase tracking-[0.24em] text-cyan-300/60">
                  AI game master
                </p>
              </div>
            </div>

            <button
              onClick={() => setMobileMenu(false)}
              className="text-white/50 lg:hidden"
              aria-label="Close menu"
            >
              <X />
            </button>
          </div>

          <div className="mb-8 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
                Campaign
              </span>

              <MoreHorizontal className="size-4 text-white/30" />
            </div>

            <p className="font-serif text-base text-white">
              The Ashen Crown
            </p>

            <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[38%] rounded-full bg-gradient-to-r from-cyan-300 to-violet-400" />
            </div>

            <p className="mt-2 text-[11px] text-white/40">
              Chapter II · 38% explored
            </p>
          </div>

          <nav className="flex flex-col gap-2">
            <NavItem
              icon={<Compass />}
              label="Adventure"
              active
            />

            <NavItem
              icon={<Map />}
              label="World map"
            />

            <NavItem
              icon={<ScrollText />}
              label="Quest journal"
            />

            <NavItem
              icon={<Backpack />}
              label="Inventory"
            />

            <NavItem
              icon={<UserRound />}
              label="Character"
            />
          </nav>

          <div className="mt-auto hidden border-t border-white/[0.07] pt-6 lg:block">
            <button className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-white/45 transition hover:bg-white/5 hover:text-white">
              <CircleHelp className="size-4" />
              How to play
              <span className="ml-auto text-xs">?</span>
            </button>

            <div className="mt-5 flex items-center gap-3 rounded-xl bg-white/[0.035] p-3">
              <div className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-amber-200 to-orange-500 font-serif font-bold text-[#28160d]">
                {playerName.charAt(0).toUpperCase()}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white">
                  {playerName}
                </p>

                <p className="text-[11px] text-white/40">
                  Level {playerLevel} · Wayfarer
                </p>
              </div>
            </div>
          </div>
        </aside>

        {mobileMenu && (
          <button
            aria-label="Close navigation"
            className="fixed inset-0 z-10 bg-black/60 lg:hidden"
            onClick={() => setMobileMenu(false)}
          />
        )}

        {/* MAIN */}
        <section className="flex min-w-0 flex-1 flex-col">

          {/* HEADER */}
          <header className="flex h-[76px] items-center justify-between border-b border-white/[0.07] px-5 md:px-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileMenu(true)}
                className="text-white/60 lg:hidden"
                aria-label="Open menu"
              >
                <Menu />
              </button>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/35">
                  Current location
                </p>

                <h1 className="font-serif text-xl text-white md:text-2xl">
                  {player?.location?.name ?? 'Blackthorn Forest'}

                  <span className="ml-2 text-sm font-normal text-white/30">
                    ·
                  </span>

                  <span className="ml-2 text-sm font-sans font-normal text-white/45">
                    Moonrise
                  </span>
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {!error && (
                <div className="hidden items-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-300/5 px-3 py-1.5 text-xs text-emerald-300 sm:flex">
                  <span className="size-1.5 rounded-full bg-emerald-300 shadow-[0_0_10px] shadow-emerald-300" />
                  World saved
                </div>
              )}

              {error && (
                <div className="hidden max-w-[260px] truncate rounded-full border border-rose-300/20 bg-rose-300/5 px-3 py-1.5 text-xs text-rose-300 sm:block">
                  Game connection issue
                </div>
              )}

              <button
                className="grid size-9 place-items-center rounded-full border border-white/10 text-white/50 hover:bg-white/5"
                aria-label="Help"
              >
                <CircleHelp className="size-4" />
              </button>
            </div>
          </header>

          {/* CONTENT */}
          <div className="grid flex-1 xl:grid-cols-[minmax(0,1fr)_330px]">

            {/* STORY COLUMN */}
            <div className="min-w-0 px-5 py-6 md:px-8 md:py-8">

              {/* MAP */}
              <div className="relative mb-7 h-[220px] overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-cyan-950/20 md:h-[270px]">
                <img
                  src="/forgotten-kingdom-map.png"
                  alt="Moonlit map of Blackthorn Forest"
                  className="absolute inset-0 size-full object-cover opacity-80"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#0c1020] via-transparent to-[#0c1020]/20" />

                <div className="absolute bottom-5 left-5 flex items-end gap-3 md:left-7">
                  <div className="grid size-11 place-items-center rounded-full border border-cyan-200/40 bg-cyan-300/15 text-cyan-200 shadow-[0_0_25px] shadow-cyan-300/20">
                    <Compass className="size-5" />
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-[0.22em] text-cyan-200/70">
                      Exploration zone
                    </p>

                    <p className="font-serif text-2xl text-white">
                      {player?.location?.name ?? "The Watcher's Clearing"}
                    </p>
                  </div>
                </div>

                <div className="absolute right-5 top-5 rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-[10px] uppercase tracking-widest text-white/60 backdrop-blur">
                  Live world
                </div>
              </div>

              {/* STORY HEADER */}
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.23em] text-cyan-300/70">
                    Live story
                  </p>

                  <h2 className="mt-1 font-serif text-2xl text-white">
                    {latest?.role === 'player'
                      ? 'The path awaits'
                      : 'The path remembers'}
                  </h2>
                </div>

                <span className="rounded-full border border-violet-300/15 bg-violet-300/5 px-3 py-1 text-[10px] uppercase tracking-widest text-violet-200/70">
                  Narrative mode
                </span>
              </div>

              {/* INITIAL LOADING */}
              {initialLoading && (
                <div className="flex min-h-[280px] items-center justify-center">
                  <div className="flex items-center gap-3 text-sm text-white/40">
                    <Sparkles className="size-4 animate-pulse text-violet-300" />
                    Restoring your adventure...
                  </div>
                </div>
              )}

              {/* MESSAGES */}
              {!initialLoading && (
                <div className="flex max-h-[390px] flex-col gap-5 overflow-y-auto pr-1">

                  {messages.length === 0 && (
                    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] px-5 py-8 text-center">
                      <Sparkles className="mx-auto mb-3 size-6 text-violet-300/60" />

                      <p className="font-serif text-lg text-white">
                        Your story is waiting.
                      </p>

                      <p className="mt-2 text-sm text-white/40">
                        Tell the Game Master what you do next.
                      </p>
                    </div>
                  )}

                  {messages.map((item) => (
                    <article
                      key={item.id}
                      className={`flex gap-3 ${item.role === 'player'
                        ? 'flex-row-reverse'
                        : ''
                        }`}
                    >
                      <div
                        className={`mb-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] ${item.role === 'gm'
                          ? 'text-violet-200/50'
                          : 'text-amber-200/45'
                          } ${item.role === 'player'
                            ? 'justify-end'
                            : ''
                          }`}
                      >
                        {item.role === 'gm' ? (
                          <>
                            <Sparkles className="size-3" />
                            The Game Master
                          </>
                        ) : (
                          playerName
                        )}
                      </div>

                      <div
                        className={`rounded-2xl border ${item.role === 'gm'
                          ? 'rounded-tl-sm border-violet-300/[0.12] bg-gradient-to-br from-white/[0.045] to-violet-300/[0.025] text-white/80'
                          : 'rounded-tr-sm border-amber-200/15 bg-amber-200/[0.07] text-amber-50/80'
                          }`}
                      >
                        {item.role === 'gm' ? (
                          <GMMessage content={item.content} />
                        ) : (
                          <div className="px-4 py-3 text-sm leading-6">
                            {item.content}
                          </div>
                        )}
                      </div>

                    </article>
                  ))}

                  {loading && (
                    <div className="flex items-center gap-3 text-sm text-white/40">
                      <Sparkles className="size-4 animate-pulse text-violet-300" />
                      The world is listening...
                    </div>
                  )}

                  {error && (
                    <div className="rounded-xl border border-rose-300/15 bg-rose-300/[0.04] px-4 py-3 text-sm text-rose-200/80">
                      {error}
                    </div>
                  )}
                </div>
              )}

              {/* SUGGESTIONS */}
              <div className="mt-7 flex flex-wrap gap-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() =>
                      useSuggestion(suggestion)
                    }
                    disabled={loading}
                    className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.025] px-3 py-2 text-xs text-white/50 transition hover:border-cyan-300/30 hover:bg-cyan-300/5 hover:text-cyan-100 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {suggestion}

                    <ChevronRight className="size-3 opacity-50 transition group-hover:translate-x-0.5" />
                  </button>
                ))}
              </div>

              {/* INPUT */}
              <form
                onSubmit={submit}
                className="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-[#101527] p-2 shadow-lg shadow-black/20 focus-within:border-cyan-300/40"
              >
                <div className="pl-2 text-cyan-300/60">
                  <MessageCircle className="size-5" />
                </div>

                <input
                  value={message}
                  onChange={(event) =>
                    setMessage(event.target.value)
                  }
                  onKeyDown={(event) => {
                    if (
                      event.key === 'Enter' &&
                      (
                        event.nativeEvent as KeyboardEvent
                      ).isComposing
                    ) {
                      event.preventDefault()
                    }
                  }}
                  disabled={loading || initialLoading}
                  placeholder="What do you do?"
                  className="min-w-0 flex-1 bg-transparent px-1 py-3 text-sm text-white outline-none placeholder:text-white/25"
                />

                <button
                  type="submit"
                  disabled={
                    !message.trim() ||
                    loading ||
                    initialLoading
                  }
                  className="grid size-10 shrink-0 place-items-center rounded-xl bg-cyan-300 text-[#06121a] transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-30"
                  aria-label="Send action"
                >
                  <Send className="size-4" />
                </button>
              </form>
            </div>

            {/* RIGHT SIDEBAR */}
            <aside className="border-t border-white/[0.07] bg-[#0b0f1f]/70 px-5 py-6 md:px-8 xl:border-l xl:border-t-0">

              {/* ADVENTURER */}
              <div className="mb-7 flex items-center justify-between">
                <p className="text-[10px] font-semibold uppercase tracking-[0.23em] text-white/40">
                  Adventurer
                </p>

                <button
                  className="text-white/30 hover:text-white/70"
                  aria-label="Character options"
                >
                  <MoreHorizontal className="size-4" />
                </button>
              </div>

              <div className="mb-7 flex items-center gap-4">
                <div className="relative grid size-16 place-items-center rounded-2xl border border-amber-200/25 bg-gradient-to-br from-amber-100/20 to-orange-500/10 shadow-lg shadow-orange-950/30">
                  <Shield className="size-7 text-amber-200" />

                  <span className="absolute -bottom-2 -right-2 grid size-6 place-items-center rounded-full border-2 border-[#0b0f1f] bg-violet-400 text-[10px] font-bold text-[#180e2c]">
                    {playerLevel}
                  </span>
                </div>

                <div>
                  <h2 className="font-serif text-xl text-white">
                    {playerName}
                  </h2>

                  <p className="text-xs text-white/40">
                    Wayfarer · Human
                  </p>
                </div>
              </div>

              {/* STATS */}
              <div className="mb-7 grid grid-cols-2 gap-3">
                <Stat
                  icon={<Heart />}
                  label="Vitality"
                  value={`${playerHp} / ${playerMaxHp}`}
                  bar={`${hpPercentage}%`}
                  tone="rose"
                />

                <Stat
                  icon={<Zap />}
                  label="Focus"
                  value="—"
                  bar="0%"
                  tone="cyan"
                />
              </div>

              {/* QUEST */}
              <div className="mb-7 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">
                    Active quest
                  </p>

                  <ScrollText className="size-4 text-amber-200/60" />
                </div>

                <p className="font-serif text-base text-white">
                  The Ashen Crown
                </p>

                <p className="mt-2 text-xs leading-5 text-white/45">
                  Find the three lost fragments before the eclipse.
                </p>

                <div className="mt-4 flex items-center gap-2 text-xs text-amber-200/70">
                  <Gem className="size-3" />
                  1 of 3 fragments found
                </div>
              </div>

              {/* INVENTORY */}
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">
                    Satchel
                  </p>

                  <button className="text-[10px] uppercase tracking-widest text-cyan-300/70 hover:text-cyan-200">
                    View all
                  </button>
                </div>

                <div className="flex flex-col gap-2">
                  {inventory.length === 0 && (
                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-xs text-white/35">
                      Your inventory is empty.
                    </div>
                  )}

                  {inventory.map((item) => (
                    <InventoryRow
                      key={item.itemId}
                      item={item}
                    />
                  ))}
                </div>
              </div>

              {/* AGENT ACTIONS */}
              <div className="mt-7 border-t border-white/[0.07] pt-5">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">
                    World activity
                  </p>

                  <Sparkles className="size-3 text-violet-300/60" />
                </div>

                {actions.length === 0 ? (
                  <p className="text-xs text-white/30">
                    No recent actions.
                  </p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {actions.map((action, index) => (
                      <div
                        key={`${action.tool}-${index}`}
                        className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2"
                      >
                        <span className="grid size-5 shrink-0 place-items-center rounded-full bg-emerald-300/10 text-[10px] text-emerald-300">
                          ✓
                        </span>

                        <span className="truncate font-mono text-[10px] text-white/45">
                          {action.tool}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* FOOTER STATS */}
              <div className="mt-7 flex items-center justify-between border-t border-white/[0.07] pt-5">
                <div className="flex items-center gap-2 text-xs text-amber-200/70">
                  <span className="text-sm">◈</span>
                  {playerGold.toLocaleString()} gold
                </div>

                <div className="flex items-center gap-2 text-xs text-violet-200/70">
                  <Swords className="size-3" />
                  XP unknown
                </div>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </main>
  )
}

function NavItem({
  icon,
  label,
  active = false,
}: {
  icon: React.ReactNode
  label: string
  active?: boolean
}) {
  return (
    <button
      className={`flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition ${active
        ? 'bg-cyan-300/10 text-cyan-200 shadow-inner shadow-cyan-300/5'
        : 'text-white/45 hover:bg-white/5 hover:text-white'
        }`}
    >
      {icon}

      <span>{label}</span>

      {active && (
        <span className="ml-auto size-1.5 rounded-full bg-cyan-300" />
      )}
    </button>
  )
}

function Stat({
  icon,
  label,
  value,
  bar,
  tone,
}: {
  icon: React.ReactNode
  label: string
  value: string
  bar: string
  tone: 'rose' | 'cyan'
}) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-3">
      <div className="mb-2 flex items-center gap-2 text-xs text-white/45">
        {icon}
        <span>{label}</span>
      </div>

      <p className="mb-2 text-xs font-medium text-white/80">
        {value}
      </p>

      <div className="h-1 overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-full rounded-full ${tone === 'rose'
            ? 'bg-rose-300'
            : 'bg-cyan-300'
            }`}
          style={{ width: bar }}
        />
      </div>
    </div>
  )
}

function InventoryRow({
  item,
}: {
  item: InventoryItem
}) {
  return (
    <div className="group flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5 transition hover:bg-white/[0.05]">
      <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-cyan-300/10 text-lg text-cyan-200">
        <Gem className="size-4" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-medium text-white/80">
          {item.name}
        </p>

        <p className="mt-0.5 line-clamp-1 text-[9px] uppercase tracking-wider text-white/30">
          {item.description}
        </p>
      </div>

      <span className="text-xs text-white/40">
        ×{item.quantity}
      </span>
    </div>
  )
}


function GMMessage({
  content,
}: {
  content: string
}) {
  return (
    <div className="px-5 py-5 md:px-6 md:py-6">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="mb-4 font-serif text-2xl leading-tight text-white md:text-3xl">
              {children}
            </h1>
          ),

          h2: ({ children }) => (
            <h2 className="mb-3 mt-6 font-serif text-xl text-white">
              {children}
            </h2>
          ),

          h3: ({ children }) => (
            <h3 className="mb-2 mt-5 text-sm font-semibold uppercase tracking-[0.16em] text-cyan-200/80">
              {children}
            </h3>
          ),

          p: ({ children }) => (
            <p className="mb-4 text-[15px] leading-7 text-white/70 last:mb-0">
              {children}
            </p>
          ),

          strong: ({ children }) => (
            <strong className="font-semibold text-cyan-100">
              {children}
            </strong>
          ),

          em: ({ children }) => (
            <em className="text-violet-200/90">
              {children}
            </em>
          ),

          ul: ({ children }) => (
            <ul className="my-4 space-y-3 pl-1">
              {children}
            </ul>
          ),

          ol: ({ children }) => (
            <ol className="my-5 space-y-3 pl-0 [counter-reset:item]">
              {children}
            </ol>
          ),

          li: ({ children }) => (
            <li className="relative flex gap-3 rounded-xl border border-white/[0.06] bg-black/[0.12] px-4 py-3 text-sm leading-6 text-white/65">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-cyan-300 shadow-[0_0_8px] shadow-cyan-300/60" />
              <span className="min-w-0 flex-1">
                {children}
              </span>
            </li>
          ),

          blockquote: ({ children }) => (
            <blockquote className="my-5 border-l-2 border-violet-300/40 bg-violet-300/[0.04] px-4 py-3 text-sm italic leading-6 text-violet-100/65">
              {children}
            </blockquote>
          ),

          hr: () => (
            <div className="my-6 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          ),

          code: ({ children }) => (
            <code className="rounded-md bg-black/30 px-1.5 py-0.5 font-mono text-xs text-cyan-200">
              {children}
            </code>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
