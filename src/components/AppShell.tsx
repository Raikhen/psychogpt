"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import { useConversations } from "@/hooks/useConversations";
import { MODELS } from "@/lib/models";
import { CHARACTERS } from "@/lib/characters";
import { Conversation, Message } from "@/types";

const SIDEBAR_DEFAULT = 320;
const SIDEBAR_MIN = 200;
const SIDEBAR_MAX = 480;

interface AppContextType {
  conversations: Conversation[];
  loaded: boolean;
  createConversation: (modelId: string, characterId: string) => Conversation;
  forkPreloaded: (preloaded: Conversation) => Conversation;
  updateConversation: (id: string, patch: Partial<Conversation>) => void;
  addMessage: (convoId: string, message: Message) => void;
  updateLastMessage: (convoId: string, content: string) => void;
  getConversation: (id: string) => Conversation | undefined;
  handleNewChat: (modelId?: string, characterId?: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppShell");
  return ctx;
}

export default function AppShell({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_DEFAULT);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const widthBeforeCollapse = useRef(SIDEBAR_DEFAULT);
  const router = useRouter();
  const {
    conversations,
    loaded,
    createConversation,
    forkPreloaded,
    updateConversation,
    addMessage,
    updateLastMessage,
    deleteConversation,
    getConversation,
  } = useConversations();

  const handleNewChat = useCallback((modelId?: string, characterId?: string) => {
    if (!characterId) {
      // No character selected — go to landing page to pick one
      router.push("/");
      setSidebarOpen(false);
      return;
    }
    const convo = createConversation(modelId ?? MODELS[0].id, characterId);
    router.push(`/chat/${convo.id}`);
    setSidebarOpen(false);
  }, [createConversation, router]);

  const handleDelete = useCallback(
    (id: string) => {
      deleteConversation(id);
      router.push("/");
    },
    [deleteConversation, router]
  );

  const handleToggleCollapse = useCallback(() => {
    setSidebarCollapsed((prev) => {
      if (!prev) {
        widthBeforeCollapse.current = sidebarWidth;
      } else {
        setSidebarWidth(widthBeforeCollapse.current);
      }
      return !prev;
    });
  }, [sidebarWidth]);

  const handleResizeStart = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    setIsResizing(true);
    const startX = e.clientX;
    const startWidth = sidebarWidth;

    const onMove = (ev: PointerEvent) => {
      const newWidth = Math.min(SIDEBAR_MAX, Math.max(SIDEBAR_MIN, startWidth + ev.clientX - startX));
      setSidebarWidth(newWidth);
    };

    const onUp = () => {
      setIsResizing(false);
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
    };

    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
  }, [sidebarWidth]);

  return (
    <AppContext.Provider
      value={{
        conversations,
        loaded,
        createConversation,
        forkPreloaded,
        updateConversation,
        addMessage,
        updateLastMessage,
        getConversation,
        handleNewChat,
        sidebarOpen,
        setSidebarOpen,
        sidebarCollapsed,
        setSidebarCollapsed: (v: boolean) => {
          if (v && !sidebarCollapsed) {
            widthBeforeCollapse.current = sidebarWidth;
          } else if (!v && sidebarCollapsed) {
            setSidebarWidth(widthBeforeCollapse.current);
          }
          setSidebarCollapsed(v);
        },
      }}
    >
      <div className={`h-dvh flex overflow-hidden bg-surface-0 ${isResizing ? "select-none" : ""}`}>
        <Sidebar
          conversations={conversations}
          onDeleteConversation={handleDelete}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          collapsed={sidebarCollapsed}
          onToggleCollapse={handleToggleCollapse}
          width={sidebarWidth}
          onResizeStart={handleResizeStart}
          isResizing={isResizing}
        />
        <main className="flex-1 flex flex-col min-w-0 min-h-0 overflow-y-auto">
          {sidebarCollapsed && (
            <button
              onClick={handleToggleCollapse}
              className="hidden lg:flex fixed top-3 left-3 z-20 p-2 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-2 transition-colors"
              title="Expand sidebar"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>
          )}
          {loaded && children}
        </main>
      </div>
    </AppContext.Provider>
  );
}
