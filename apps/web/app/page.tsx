"use client";

import { FormEvent, useEffect, useState } from "react";
import { getGameMessages, sendGameMessage, type AgentAction } from "../lib/game-api";
import type { ChatMessage } from "../lib/game-types";

const GAME_ID = "a6d60ac7-33b6-440b-af62-b3cdbe7b52e5";

export default function Home() {
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const [actions, setActions] = useState<AgentAction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedMessage = message.trim();

    if (!trimmedMessage || loading) {
      return;
    }

    setLoading(true);
    setError("");

    const playerMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "player",
      content: trimmedMessage,
    };

    setMessages((current) => [...current, playerMessage]);
    setMessage("");

    try {
      const result = await sendGameMessage(
        GAME_ID,
        trimmedMessage
      );

      const gmMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "gm",
        content: result.message,
      };

      setMessages((current) => [...current, gmMessage]);
      setActions(result.actions);
    } catch (error) {
      console.error(error);
      setError("The Game Master could not respond.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const history = await getGameMessages(GAME_ID);

        setMessages(history.map((message) => ({
          id: message.id,
          content: message.content,
          role: message.role
        })))

      } catch (error: any) {
        alert(error.message)
      }

    }
    loadMessages()

  }, [GAME_ID])

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col p-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">
            Forgotten Kingdom
          </h1>

          <p className="mt-2 text-slate-400">
            AI Game Master
          </p>
        </header>

        <section className="flex-1 space-y-4 rounded-xl border border-slate-800 bg-slate-900 p-6">
          {messages.map((chatMessage) => (
            <div
              key={chatMessage.id}
              className={
                chatMessage.role === "player"
                  ? "ml-12 rounded-lg bg-slate-800 p-4"
                  : "mr-12 rounded-lg border border-slate-800 p-4"
              }
            >
              <div className="mb-1 text-xs font-semibold uppercase text-slate-500">
                {chatMessage.role === "player"
                  ? "You"
                  : "Game Master"}
              </div>

              <p className="leading-7">
                {chatMessage.content}
              </p>
            </div>
          ))}

          {loading && (
            <div className="mr-12 rounded-lg border border-slate-800 p-4">
              <p className="text-slate-400">
                The Game Master is thinking...
              </p>
            </div>
          )}

          {error && (
            <p className="text-red-400">
              {error}
            </p>
          )}
        </section>

        <section className="mt-6 rounded-xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="mb-4 text-lg font-semibold">
            Agent Actions
          </h2>

          {actions.length === 0 ? (
            <p className="text-slate-500">
              No actions yet.
            </p>
          ) : (
            <div className="space-y-2">
              {actions.map((action, index) => (
                <div
                  key={`${action.tool}-${index}`}
                  className="rounded bg-slate-800 px-3 py-2 font-mono text-sm"
                >
                  ✓ {action.tool}
                </div>
              ))}
            </div>
          )}
        </section>

        <form
          onSubmit={handleSubmit}
          className="mt-6 flex gap-3"
        >
          <input
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="What do you want to do?"
            disabled={loading}
            className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 outline-none placeholder:text-slate-500 focus:border-slate-500"
          />

          <button
            type="submit"
            disabled={loading || !message.trim()}
            className="rounded-lg bg-white px-5 py-3 font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Send
          </button>
        </form>
      </div>
    </main>
  );
}