import { useNavigate, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Bot,
  Send,
  Mic,
  Paperclip,
  MessageCircle,
  Building2,
  ClipboardList,
  Bell,
  HelpCircle,
  ArrowLeft,
  User,
  Sparkles,
  X,
} from "lucide-react";

import { askQuestion } from "../../services/chatbotsevice";
import api from "../../services/api";

// The chatbot's image URLs come in two shapes: a relative backend
// path for a faculty photo ("/faculty/id/<id>/image", since that
// image is served by THIS app's own API), or a full external URL for
// a facility photo (whatever the admin entered). Only the relative
// kind needs the API's base URL prefixed — an already-absolute URL is
// left untouched.
const resolveImageSrc = (src) => {
  if (/^https?:\/\//i.test(src)) {
    return src;
  }
  return `${api.defaults.baseURL}${src.startsWith("/") ? "" : "/"}${src}`;
};

const suggestedQuestions = [
  "How can I get admission?",
  "What branches are available?",
  "Tell me about placements.",
  "Where is the library?",
  "What hostel facilities are available?",
  "How can I contact the college?",
];

const getTime = () =>
  new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

export default function GPBuddyPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "bot",
      text: "👋 Hi! I'm GP Buddy, your AI assistant for Government Polytechnic Muzaffarpur. How can I help you today?",
      time: getTime(),
    },
  ]);

  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeSection, setActiveSection] = useState("chat");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const bottomRef = useRef(null);
  const historyRef = useRef([]);
  const MAX_HISTORY_TURNS = 10;

  const onNavigate = (path) => {
    if (path === "home") navigate("/");
    else if (path.startsWith("dept-")) navigate(`/dept/${path}`);
    else navigate(`/${path}`);

    setMobileOpen(false);
    setDeptOpen(false);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    const userMsg = {
      id: Date.now(),
      role: "user",
      text,
      time: getTime(),
    };

    setMessages((prev) => [...prev, userMsg]);

    setInput("");
    setIsTyping(true);

    try {
      const response = await askQuestion(text.trim(), historyRef.current);

      if (!response || response.success !== true) {
        throw new Error(
          response?.message || "Failed to generate answer"
        );
      }

      const answer = response?.data?.answer;

      if (!answer) {
        throw new Error("No answer received from chatbot");
      }

      const botMsg = {
        id: Date.now() + 1,
        role: "bot",
        text: answer,
        time: getTime(),
      };

      setMessages((prev) => [...prev, botMsg]);

      historyRef.current = [
        ...historyRef.current,
        { question: text.trim(), answer },
      ].slice(-MAX_HISTORY_TURNS);

    } catch (error) {
      console.error("GP Buddy error:", error);

      const botMsg = {
        id: Date.now() + 1,
        role: "bot",
        text: "Sorry, I couldn't process your question right now. Please try again.",
        time: getTime(),
      };

      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const sidebarItems = [
    { id: "chat", icon: MessageCircle, label: "Chat" },
    { id: "departments", icon: Building2, label: "Departments" },
    { id: "admissions", icon: ClipboardList, label: "Admissions" },
    { id: "notices", icon: Bell, label: "Notices" },
    { id: "help", icon: HelpCircle, label: "Help" },
  ];

  return (
    <div className="flex h-screen bg-[#f0f4f8] overflow-hidden">
      {/* Custom CSS for the Wave Typing Animation */}
      <style>{`
        @keyframes typing-wave {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-5px); opacity: 1; }
        }
        .typing-dot {
          animation: typing-wave 1.2s infinite ease-in-out;
        }
      `}</style>

      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 fixed lg:relative z-40 h-full w-64 lg:w-20 xl:w-56 bg-white border-r border-[#e2eaf4] flex flex-col transition-transform duration-300`}
      >
        <div className="p-4 border-b border-[#e2eaf4] flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0f2e5a] to-[#1a6bc5] flex items-center justify-center">
            <Bot size={18} className="text-white" />
          </div>

          <span className="text-[#0f2e5a] font-bold text-sm lg:hidden xl:block">
            GP Buddy
          </span>

          <button
            className="ml-auto lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {sidebarItems.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => {
                setActiveSection(id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${activeSection === id
                ? "bg-[#0f2e5a] text-white"
                : "text-[#4a6080] hover:bg-[#e8f1fb]"
                }`}
            >
              <Icon size={17} />
              <span className="lg:hidden xl:block">{label}</span>
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-[#e2eaf4]">
          <button
            onClick={() => onNavigate("home")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#4a6080]"
          >
            <ArrowLeft size={17} />
            <span className="lg:hidden xl:block">Back to Site</span>
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <div className="h-16 bg-white border-b border-[#e2eaf4] flex items-center gap-3 px-4 lg:px-6">
          <button
            className="lg:hidden p-2"
            onClick={() => setSidebarOpen(true)}
          >
            <Bot size={18} className="text-[#0f2e5a]" />
          </button>

          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0f2e5a] to-[#1a6bc5] hidden lg:flex items-center justify-center">
            <Bot size={18} className="text-white" />
          </div>

          <div>
            <div className="font-semibold text-sm text-[#0f2e5a]">GP Buddy</div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              <span className="text-xs text-[#4a6080]">
                Online · Ready to help
              </span>
            </div>
          </div>

          <div className="ml-auto">
            <span className="hidden sm:flex items-center gap-1.5 text-xs text-[#4a6080] bg-[#e8f1fb] px-3 py-1.5 rounded-full">
              <Sparkles size={12} className="text-[#38b2f0]" />
              AI Powered
            </span>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto px-4 lg:px-8 py-6 space-y-4">
          {messages.length <= 2 && (
            <div className="max-w-2xl mx-auto mb-5">
              <div className="bg-gradient-to-br from-[#0f2e5a] to-[#1a6bc5] rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    👋 Hi! I'm GP Buddy
                  </h2>
                  <p className="text-white/80 text-sm">
                    Your AI Assistant for Government Polytechnic Muzaffarpur.
                    Ask me anything about admissions, departments, facilities,
                    and more!
                  </p>
                </div>

                <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center">
                  <Bot size={40} className="text-white" />
                </div>
              </div>

              <div className="mt-5">
                <p className="text-xs text-[#4a6080] mb-3">
                  Suggested Questions
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {suggestedQuestions.map((q) => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      className="text-left px-4 py-3 bg-white rounded-xl border border-[#e2eaf4] text-sm text-[#0f2e5a] hover:border-[#38b2f0]"
                    >
                      <span className="text-[#38b2f0] mr-2">→</span>
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-end gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"
                }`}
            >
              {msg.role === "bot" && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0f2e5a] to-[#1a6bc5] flex items-center justify-center">
                  <Bot size={14} className="text-white" />
                </div>
              )}

              <div
                className={`max-w-3xl px-6 py-3 rounded-2xl text-sm ${msg.role === "user"
                  ? "bg-[#0f2e5a] text-white"
                  : "bg-white border text-[#0a1628]"
                  }`}
              >
                {msg.role === "bot" ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({ children }) => (
                        <p className="mb-3 last:mb-0 leading-6">
                          {children}
                        </p>
                      ),

                      ul: ({ children }) => (
                        <ul className="list-disc pl-5 mb-3 space-y-1">
                          {children}
                        </ul>
                      ),

                      ol: ({ children }) => (
                        <ol className="list-decimal pl-5 mb-3 space-y-1">
                          {children}
                        </ol>
                      ),

                      li: ({ children }) => (
                        <li className="leading-6">
                          {children}
                        </li>
                      ),

                      strong: ({ children }) => (
                        <strong className="font-semibold">
                          {children}
                        </strong>
                      ),

                      em: ({ children }) => (
                        <em className="italic">
                          {children}
                        </em>
                      ),

                      h1: ({ children }) => (
                        <h1 className="text-lg font-bold mb-3">
                          {children}
                        </h1>
                      ),

                      h2: ({ children }) => (
                        <h2 className="text-base font-bold mb-2">
                          {children}
                        </h2>
                      ),

                      h3: ({ children }) => (
                        <h3 className="font-semibold mb-2">
                          {children}
                        </h3>
                      ),

                      table: ({ children }) => (
                        <div className="overflow-x-auto my-3">
                          <table className="w-full border-collapse border border-gray-300 text-sm">
                            {children}
                          </table>
                        </div>
                      ),

                      thead: ({ children }) => (
                        <thead className="bg-gray-100">
                          {children}
                        </thead>
                      ),

                      th: ({ children }) => (
                        <th className="border border-gray-300 px-3 py-2 text-left font-semibold">
                          {children}
                        </th>
                      ),

                      td: ({ children }) => (
                        <td className="border border-gray-300 px-3 py-2">
                          {children}
                        </td>
                      ),

                      blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-[#38b2f0] pl-3 my-3 italic">
                          {children}
                        </blockquote>
                      ),

                      code: ({ children }) => (
                        <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">
                          {children}
                        </code>
                      ),

                      pre: ({ children }) => (
                        <pre className="bg-gray-900 text-white p-3 rounded-lg overflow-x-auto my-3 text-xs">
                          {children}
                        </pre>
                      ),

                      a: ({ href, children }) => (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          {children}
                        </a>
                      ),

                      img: ({ src, alt }) => (
                        <img
                          src={resolveImageSrc(src)}
                          alt={alt}
                          loading="lazy"
                          className="rounded-xl max-w-full my-2 border border-gray-200"
                        />
                      ),
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                ) : (
                  msg.text
                )}
              </div>

              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-xl bg-[#e8f1fb] flex items-center justify-center">
                  <User size={14} className="text-[#0f2e5a]" />
                </div>
              )}
            </div>
          ))}

          {/* Wave Typing Indicator */}
          {isTyping && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0f2e5a] to-[#1a6bc5] flex items-center justify-center">
                <Bot size={14} className="text-white" />
              </div>
              <div className="bg-white px-5 py-4 rounded-xl border flex items-center gap-1.5">
                {/* Dot 1 */}
                <span
                  className="w-2 h-2 rounded-full bg-[#0f2e5a] typing-dot"
                  style={{ animationDelay: "0ms" }}
                ></span>
                {/* Dot 2 */}
                <span
                  className="w-2 h-2 rounded-full bg-[#0f2e5a] typing-dot"
                  style={{ animationDelay: "150ms" }}
                ></span>
                {/* Dot 3 */}
                <span
                  className="w-2 h-2 rounded-full bg-[#0f2e5a] typing-dot"
                  style={{ animationDelay: "300ms" }}
                ></span>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="bg-white border-t border-[#e2eaf4] p-4">
          <div className="flex gap-3 max-w-4xl mx-auto">
            <button className="p-3 text-[#4a6080]">
              <Paperclip size={18} />
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage(input);
              }}
              placeholder="Ask me anything about GPMUZ..."
              className="flex-1 px-4 py-3 rounded-xl bg-[#f0f4f8] border outline-none"
            />

            <button className="p-3 text-[#4a6080]">
              <Mic size={18} />
            </button>

            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim()}
              className="p-3 rounded-xl bg-[#0f2e5a] text-white disabled:opacity-40"
            >
              <Send size={18} />
            </button>
          </div>

          <p className="text-center text-xs text-[#4a6080] mt-2">
            GP Buddy provides general information. For official queries,
            contact the college directly.
          </p>
        </div>
      </div>
    </div>
  );
}