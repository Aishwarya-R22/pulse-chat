'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Archive,
  Bell,
  BellOff,
  Check,
  CheckCheck,
  ChevronDown,
  Copy,
  Download,
  Edit3,
  FileText,
  Hash,
  Image as ImageIcon,
  Info,
  Loader2,
  Menu,
  MessageCircle,
  Mic,
  Moon,
  MoreHorizontal,
  Paperclip,
  Phone,
  Plus,
  Reply,
  Search,
  Send,
  Smile,
  Sparkles,
  Sun,
  Trash2,
  Users,
  Video,
  Wifi,
  WifiOff,
  X,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
type Message = {
  id: string;
  author: string;
  initials: string;
  color: string;
  body: string;
  time: string;
  mine?: boolean;
  status?: MessageStatus;
  edited?: boolean;
  reply?: string;
  reaction?: { emoji: string; count: number; mine?: boolean };
  attachment?: { name: string; size: string; type: 'file' | 'image' };
};
const chats = [
  {
    id: 'design',
    name: 'Design Crew',
    initials: 'DC',
    color: 'bg-violet-500',
    preview: 'Maya: I’ll update the prototype',
    time: '10:42',
    unread: 3,
    group: true,
    online: true,
  },
  {
    id: 'aisha',
    name: 'Aisha Khan',
    initials: 'AK',
    color: 'bg-rose-400',
    preview: 'That sounds perfect!',
    time: '10:18',
    unread: 1,
    online: true,
  },
  {
    id: 'project',
    name: 'Project Atlas',
    initials: 'PA',
    color: 'bg-cyan-500',
    preview: 'Leo shared a document',
    time: 'Yesterday',
    unread: 0,
    group: true,
    online: true,
  },
  {
    id: 'marcus',
    name: 'Marcus Lee',
    initials: 'ML',
    color: 'bg-amber-500',
    preview: 'Let’s sync tomorrow morning',
    time: 'Tue',
    unread: 0,
    online: false,
  },
  {
    id: 'weekend',
    name: 'Weekend Plans',
    initials: 'WP',
    color: 'bg-emerald-500',
    preview: 'You: Count me in 🙌',
    time: 'Mon',
    unread: 0,
    group: true,
    online: true,
  },
];
const seedMessages: Message[] = [
  {
    id: '1',
    author: 'Maya Chen',
    initials: 'MC',
    color: 'bg-fuchsia-500',
    body: 'Morning team! I’ve pushed the latest mobile exploration to the shared project. The new navigation feels much lighter.',
    time: '9:38 AM',
    reaction: { emoji: '🔥', count: 4 },
  },
  {
    id: '2',
    author: 'Leo Martin',
    initials: 'LM',
    color: 'bg-cyan-500',
    body: 'Nice work! The hierarchy is much clearer now. I left a couple of notes on the checkout flow.',
    time: '9:43 AM',
    reply: 'The new navigation feels much lighter.',
  },
  {
    id: '3',
    author: 'Leo Martin',
    initials: 'LM',
    color: 'bg-cyan-500',
    body: 'Mobile-flow-v4.pdf',
    time: '9:44 AM',
    attachment: { name: 'Mobile-flow-v4.pdf', size: '8.4 MB', type: 'file' },
  },
  {
    id: '4',
    author: 'You',
    initials: 'JD',
    color: 'bg-indigo-600',
    body: 'I’m reviewing it now. The transition between discovery and checkout is especially smooth.',
    time: '10:02 AM',
    mine: true,
    status: 'read',
    reaction: { emoji: '✨', count: 2 },
  },
  {
    id: '5',
    author: 'Maya Chen',
    initials: 'MC',
    color: 'bg-fuchsia-500',
    body: 'Thank you! I’ll address Leo’s notes and update the prototype before our 2 PM review.',
    time: '10:37 AM',
  },
];
function Avatar({
  initials,
  color,
  online,
  small = false,
}: {
  initials: string;
  color: string;
  online?: boolean;
  small?: boolean;
}) {
  return (
    <div className={`avatar ${small ? 'avatar-sm' : ''} ${color}`}>
      <span>{initials}</span>
      {online !== undefined && <i className={online ? 'online' : ''} />}
    </div>
  );
}
function StatusIcon({ status }: { status?: MessageStatus }) {
  if (status === 'sending') return <Loader2 className="size-3 animate-spin" />;
  if (status === 'failed')
    return <span className="text-red-500">Failed · Retry</span>;
  if (status === 'sent') return <Check className="size-3" />;
  return (
    <CheckCheck
      className={`size-3 ${status === 'read' ? 'text-indigo-500' : ''}`}
    />
  );
}
export default function Home() {
  const [dark, setDark] = useState(false),
    [messages, setMessages] = useState(seedMessages),
    [draft, setDraft] = useState(''),
    [search, setSearch] = useState(''),
    [searchOpen, setSearchOpen] = useState(false),
    [detailsOpen, setDetailsOpen] = useState(false),
    [mobileList, setMobileList] = useState(true),
    [connected, setConnected] = useState(true),
    [typing, setTyping] = useState(true),
    [toast, setToast] = useState('');
  const [activeChat, setActiveChat] = useState('design'),
    [upload, setUpload] = useState<number | null>(null),
    [menuId, setMenuId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);
  useEffect(() => {
    const t = setTimeout(() => setTyping(false), 4500);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(''), 2200);
      return () => clearTimeout(t);
    }
  }, [toast]);
  const filteredChats = useMemo(
    () =>
      chats.filter((c) => c.name.toLowerCase().includes(search.toLowerCase())),
    [search],
  );
  const filteredMessages = useMemo(
    () =>
      searchOpen && search
        ? messages.filter((m) =>
            m.body.toLowerCase().includes(search.toLowerCase()),
          )
        : messages,
    [messages, search, searchOpen],
  );
  const sendMessage = () => {
    if (!draft.trim()) return;
    const id = crypto.randomUUID();
    setMessages((p) => [
      ...p,
      {
        id,
        author: 'You',
        initials: 'JD',
        color: 'bg-indigo-600',
        body: draft.trim(),
        time: 'Now',
        mine: true,
        status: connected ? 'sending' : 'failed',
      },
    ]);
    setDraft('');
    setTimeout(
      () => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }),
      50,
    );
    if (connected) {
      setTimeout(
        () =>
          setMessages((p) =>
            p.map((m) => (m.id === id ? { ...m, status: 'delivered' } : m)),
          ),
        650,
      );
      setTimeout(
        () =>
          setMessages((p) =>
            p.map((m) => (m.id === id ? { ...m, status: 'read' } : m)),
          ),
        1500,
      );
    }
  };
  const uploadFile = () => {
    setUpload(8);
    const timer = setInterval(
      () =>
        setUpload((v) => {
          const n = (v ?? 0) + 16;
          if (n >= 100) {
            clearInterval(timer);
            setTimeout(() => setUpload(null), 900);
            setMessages((p) => [
              ...p,
              {
                id: crypto.randomUUID(),
                author: 'You',
                initials: 'JD',
                color: 'bg-indigo-600',
                body: 'Design-system-notes.pdf',
                time: 'Now',
                mine: true,
                status: 'sent',
                attachment: {
                  name: 'Design-system-notes.pdf',
                  size: '2.6 MB',
                  type: 'file',
                },
              },
            ]);
            return 100;
          }
          return n;
        }),
      180,
    );
  };
  const deleteMessage = (id: string) => {
    setMessages((p) => p.filter((m) => m.id !== id));
    setMenuId(null);
    setToast('Message deleted');
  };
  const retryMessage = (id: string) => {
    if (!connected) {
      setToast('Reconnect before retrying');
      return;
    }
    setMessages((previous) =>
      previous.map((message) =>
        message.id === id ? { ...message, status: 'sending' } : message,
      ),
    );
    setTimeout(
      () =>
        setMessages((previous) =>
          previous.map((message) =>
            message.id === id ? { ...message, status: 'delivered' } : message,
          ),
        ),
      650,
    );
    setToast('Message retrying');
  };
  const reactMessage = (id: string) =>
    setMessages((p) =>
      p.map((m) =>
        m.id === id
          ? {
              ...m,
              reaction: {
                emoji: '👍',
                count: (m.reaction?.count ?? 0) + (m.reaction?.mine ? -1 : 1),
                mine: !m.reaction?.mine,
              },
            }
          : m,
      ),
    );
  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">
            <MessageCircle />
          </div>
          <span>pulse</span>
          <em>workspace</em>
        </div>
        <button className="global-search" onClick={() => setSearchOpen(true)}>
          <Search />
          <span>Search messages and people</span>
          <kbd>⌘ K</kbd>
        </button>
        <div className="top-actions">
          <button
            className={`connection-pill ${connected ? '' : 'offline'}`}
            onClick={() => setConnected(!connected)}
          >
            {connected ? <Wifi /> : <WifiOff />}
            <span>{connected ? 'Connected' : 'Reconnecting'}</span>
          </button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            onClick={() => setDark(!dark)}
          >
            {dark ? <Sun /> : <Moon />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Notifications"
            onClick={() => setToast('You have 4 unread messages')}
          >
            <Bell />
          </Button>
          <Avatar initials="JD" color="bg-indigo-600" online />
        </div>
      </header>
      <section className="workspace">
        <aside className={`chat-sidebar ${mobileList ? 'mobile-show' : ''}`}>
          <div className="sidebar-head">
            <div>
              <span className="eyebrow">MESSAGES</span>
              <h1>
                Inbox <b>4</b>
              </h1>
            </div>
            <Button
              size="icon"
              className="compose"
              aria-label="New message"
              onClick={() => setToast('New conversation composer opened')}
            >
              <Edit3 />
            </Button>
          </div>
          <div className="sidebar-search">
            <Search />
            <input
              aria-label="Search conversations"
              placeholder="Search conversations"
              value={searchOpen ? search : ''}
              onChange={(e) => {
                setSearch(e.target.value);
                setSearchOpen(true);
              }}
            />
          </div>
          <nav className="quick-nav" aria-label="Conversation filters">
            <button
              className="active"
              onClick={() => {
                setSearch('');
                setToast('Showing all messages');
              }}
            >
              <MessageCircle />
              All messages <span>4</span>
            </button>
            <button
              onClick={() => {
                setSearchOpen(false);
                setToast('Showing unread conversations');
              }}
            >
              <BellOff />
              Unread <span>4</span>
            </button>
            <button onClick={() => setToast('No archived conversations')}>
              <Archive />
              Archived
            </button>
          </nav>
          <div className="section-label">
            <span>RECENT</span>
            <button
              aria-label="Collapse recent conversations"
              onClick={() => setToast('Recent conversations are expanded')}
            >
              <ChevronDown />
            </button>
          </div>
          <div className="chat-list">
            {filteredChats.map((chat) => (
              <button
                key={chat.id}
                className={`chat-row ${activeChat === chat.id ? 'selected' : ''}`}
                onClick={() => {
                  setActiveChat(chat.id);
                  setMobileList(false);
                }}
              >
                <Avatar
                  initials={chat.initials}
                  color={chat.color}
                  online={chat.online}
                />
                <span className="chat-copy">
                  <strong>
                    {chat.name}
                    {chat.group && <Users />}
                  </strong>
                  <small>{chat.preview}</small>
                </span>
                <span className="chat-meta">
                  <time>{chat.time}</time>
                  {chat.unread > 0 && <b>{chat.unread}</b>}
                </span>
              </button>
            ))}
          </div>
          <button
            className="invite"
            onClick={() => setToast('Invite link copied')}
          >
            <span>
              <Plus />
            </span>
            <div>
              <strong>Invite teammates</strong>
              <small>Grow your workspace</small>
            </div>
          </button>
        </aside>
        <section className={`conversation ${mobileList ? '' : 'mobile-show'}`}>
          <header className="conversation-head">
            <Button
              variant="ghost"
              size="icon"
              className="mobile-menu"
              aria-label="Back to conversations"
              onClick={() => setMobileList(true)}
            >
              <Menu />
            </Button>
            <Avatar initials="DC" color="bg-violet-500" online />
            <div className="conversation-title">
              <h2>
                Design Crew <ChevronDown />
              </h2>
              <span>
                <i /> 5 members online
              </span>
            </div>
            <div className="conversation-actions">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Start audio call"
                onClick={() => setToast('Audio call started')}
              >
                <Phone />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Start video call"
                onClick={() => setToast('Video call started')}
              >
                <Video />
              </Button>
              <span className="divider" />
              <Button
                variant="ghost"
                size="icon"
                aria-label="Search messages"
                onClick={() => setSearchOpen(!searchOpen)}
              >
                <Search />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Conversation details"
                onClick={() => setDetailsOpen(!detailsOpen)}
              >
                <Info />
              </Button>
            </div>
          </header>
          {searchOpen && (
            <div className="message-search">
              <Search />
              <input
                autoFocus
                placeholder="Search in Design Crew…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <span>
                {search
                  ? `${filteredMessages.length} results`
                  : 'Type to search'}
              </span>
              <button
                onClick={() => {
                  setSearchOpen(false);
                  setSearch('');
                }}
              >
                <X />
              </button>
            </div>
          )}
          {!connected && (
            <div className="reconnect">
              <Loader2 /> Connection lost. Reconnecting securely…
            </div>
          )}
          <div className="messages">
            <button
              className="load-older"
              onClick={() => setToast('Earlier messages loaded')}
            >
              Load earlier messages
            </button>
            <div className="date-rule">
              <span>Today</span>
            </div>
            {filteredMessages.map((message) => (
              <article
                className={`message ${message.mine ? 'mine' : ''}`}
                key={message.id}
              >
                {!message.mine && (
                  <Avatar initials={message.initials} color={message.color} />
                )}
                <div className="message-content">
                  <div className="message-author">
                    <strong>{message.author}</strong>
                    <time>{message.time}</time>
                  </div>
                  <div className="bubble-wrap">
                    <div className="bubble">
                      {message.reply && (
                        <div className="reply-preview">
                          <Reply />
                          {message.reply}
                        </div>
                      )}
                      {message.attachment ? (
                        <div className="attachment">
                          <span>
                            <FileText />
                          </span>
                          <div>
                            <strong>{message.attachment.name}</strong>
                            <small>
                              {message.attachment.size} · PDF document
                            </small>
                          </div>
                          <button
                            aria-label="Download attachment"
                            onClick={() => setToast('Download prepared')}
                          >
                            <Download />
                          </button>
                        </div>
                      ) : (
                        <p>{message.body}</p>
                      )}
                      {message.edited && (
                        <small className="edited">edited</small>
                      )}
                    </div>
                    <div className="message-tools">
                      <button
                        title="React"
                        onClick={() => reactMessage(message.id)}
                      >
                        <Smile />
                      </button>
                      <button
                        title="Reply"
                        onClick={() => setDraft(`@${message.author} `)}
                      >
                        <Reply />
                      </button>
                      <button
                        title="Copy"
                        onClick={() => {
                          navigator.clipboard?.writeText(message.body);
                          setToast('Copied to clipboard');
                        }}
                      >
                        <Copy />
                      </button>
                      <button
                        title="More"
                        onClick={() =>
                          setMenuId(menuId === message.id ? null : message.id)
                        }
                      >
                        <MoreHorizontal />
                      </button>
                    </div>
                    {menuId === message.id && (
                      <div className="message-menu">
                        <button
                          onClick={() => {
                            setDraft(message.body);
                            setMenuId(null);
                          }}
                        >
                          <Edit3 />
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            navigator.clipboard?.writeText(message.body);
                            setToast('Copied to clipboard');
                            setMenuId(null);
                          }}
                        >
                          <Copy />
                          Copy
                        </button>
                        <button
                          className="danger"
                          onClick={() => deleteMessage(message.id)}
                        >
                          <Trash2 />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="under-message">
                    {message.reaction && (
                      <button
                        className={message.reaction.mine ? 'reacted' : ''}
                        onClick={() => reactMessage(message.id)}
                      >
                        {message.reaction.emoji} {message.reaction.count}
                      </button>
                    )}
                    {message.mine && message.status !== 'failed' && (
                      <span className="delivery">
                        <StatusIcon status={message.status} />
                      </span>
                    )}
                    {message.mine && message.status === 'failed' && (
                      <button
                        className="retry-message"
                        onClick={() => retryMessage(message.id)}
                      >
                        Failed · Retry
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
            {typing && (
              <div className="typing-row">
                <Avatar initials="MC" color="bg-fuchsia-500" small />
                <span>
                  <i />
                  <i />
                  <i />
                </span>
                <small>Maya is typing</small>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          <footer className="composer-area">
            {upload !== null && (
              <div className="upload-card">
                <span>
                  <FileText />
                </span>
                <div>
                  <strong>Design-system-notes.pdf</strong>
                  <div
                    className="progress"
                    role="progressbar"
                    aria-label="File upload progress"
                    aria-valuenow={upload}
                  >
                    <i style={{ width: `${upload}%` }} />
                  </div>
                  <small>
                    {upload < 100 ? `Uploading… ${upload}%` : 'Upload complete'}
                  </small>
                </div>
                <button
                  aria-label="Cancel upload"
                  onClick={() => setUpload(null)}
                >
                  <X />
                </button>
              </div>
            )}
            <div className="composer">
              <textarea
                aria-label="Message Design Crew"
                placeholder="Message Design Crew"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
              <div className="composer-tools">
                <div>
                  <button aria-label="Add attachment" onClick={uploadFile}>
                    <Paperclip />
                  </button>
                  <button aria-label="Add image" onClick={uploadFile}>
                    <ImageIcon />
                  </button>
                  <button
                    aria-label="Add emoji"
                    onClick={() => setDraft((v) => `${v} 😊`)}
                  >
                    <Smile />
                  </button>
                  <button
                    aria-label="Record voice message"
                    onClick={() => setToast('Voice recording ready')}
                  >
                    <Mic />
                  </button>
                </div>
                <button
                  className="send"
                  aria-label="Send message"
                  onClick={sendMessage}
                  disabled={!draft.trim()}
                >
                  <Send />
                  <span>Send</span>
                </button>
              </div>
            </div>
            <small className="composer-tip">
              <Zap /> Press Enter to send · Shift + Enter for a new line
            </small>
          </footer>
        </section>
        {detailsOpen && (
          <aside className="details" aria-label="Conversation details">
            <div className="details-head">
              <h3>Conversation details</h3>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Close conversation details"
                onClick={() => setDetailsOpen(false)}
              >
                <X />
              </Button>
            </div>
            <div className="group-profile">
              <Avatar initials="DC" color="bg-violet-500" />
              <h3>Design Crew</h3>
              <p>Where product ideas take shape.</p>
              <div className="detail-actions">
                <button onClick={() => setToast('Conversation muted')}>
                  <Bell />
                  <span>Mute</span>
                </button>
                <button onClick={() => setSearchOpen(true)}>
                  <Search />
                  <span>Search</span>
                </button>
                <button onClick={() => setToast('Conversation options opened')}>
                  <MoreHorizontal />
                  <span>More</span>
                </button>
              </div>
            </div>
            <div className="detail-section">
              <button onClick={() => setToast('Member list expanded')}>
                <span>
                  <Users />
                  Members · 8
                </span>
                <ChevronDown />
              </button>
              <div className="member">
                <Avatar initials="MC" color="bg-fuchsia-500" online small />
                <span>
                  <strong>Maya Chen</strong>
                  <small>Product Designer</small>
                </span>
                <i>Admin</i>
              </div>
              <div className="member">
                <Avatar initials="LM" color="bg-cyan-500" online small />
                <span>
                  <strong>Leo Martin</strong>
                  <small>Product Manager</small>
                </span>
              </div>
              <button
                className="view-all"
                onClick={() => setToast('All 8 members are available')}
              >
                View all members
              </button>
            </div>
            <div className="detail-section">
              <button onClick={() => setToast('Shared media expanded')}>
                <span>
                  <ImageIcon />
                  Shared media
                </span>
                <span className="subtle">
                  24 <ChevronDown />
                </span>
              </button>
              <div className="media-grid">
                <button
                  className="media m1"
                  aria-label="Open first shared item"
                  onClick={() => setToast('Media preview opened')}
                >
                  <Sparkles />
                </button>
                <button
                  className="media m2"
                  aria-label="Open second shared item"
                  onClick={() => setToast('Media preview opened')}
                >
                  <Hash />
                </button>
                <button
                  className="media m3"
                  aria-label="Open third shared item"
                  onClick={() => setToast('Media preview opened')}
                >
                  <MessageCircle />
                </button>
              </div>
              <button
                className="view-all"
                onClick={() => setToast('All shared media is available')}
              >
                View all media
              </button>
            </div>
            <div className="detail-section files">
              <button onClick={() => setToast('Files and links expanded')}>
                <span>
                  <FileText />
                  Files & links
                </span>
                <span className="subtle">
                  12 <ChevronDown />
                </span>
              </button>
              <button
                className="file-row"
                onClick={() => setToast('Mobile-flow-v4.pdf opened')}
              >
                <span>
                  <FileText />
                </span>
                <p>
                  <strong>Mobile-flow-v4.pdf</strong>
                  <small>Leo · Today</small>
                </p>
                <MoreHorizontal />
              </button>
              <button
                className="file-row"
                onClick={() => setToast('Research-summary.pdf opened')}
              >
                <span>
                  <FileText />
                </span>
                <p>
                  <strong>Research-summary.pdf</strong>
                  <small>Aisha · Yesterday</small>
                </p>
                <MoreHorizontal />
              </button>
            </div>
          </aside>
        )}
      </section>
      {toast && (
        <div className="toast" role="status" aria-live="polite">
          <Check />
          {toast}
        </div>
      )}
    </main>
  );
}
