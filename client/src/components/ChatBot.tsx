import { useState, useRef, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { X, Send, Loader2, Bot } from "lucide-react";
import { nanoid } from "nanoid";

interface ChatBotProps {
  onClose: () => void;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatBot({ onClose }: ChatBotProps) {
  const [sessionId] = useState(() => nanoid());
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hallo! Ich bin der Schwalenbot, Ihr digitaler Assistent für Schieder-Schwalenberg. Ich kann Ihnen Informationen über die Stadt, Veranstaltungen, Öffnungszeiten und vieles mehr geben. Wie kann ich Ihnen helfen?",
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chatMutation = trpc.chat.send.useMutation({
    onSuccess: (data) => {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response },
      ]);
    },
    onError: () => {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Entschuldigung, es gab einen Fehler. Bitte versuchen Sie es erneut." },
      ]);
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || chatMutation.isPending) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInput("");

    chatMutation.mutate({
      message: userMessage,
      sessionId,
    });
  };

  const quickChips = [
    "Öffnungszeiten Rathaus",
    "Aktuelle Veranstaltungen",
    "Nächste Abfalltermine",
    "Bürgermeister kontaktieren",
    "Mängelmelder nutzen",
  ];

  const handleChipClick = (text: string) => {
    setInput(text);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
      <Card className="w-full md:max-w-2xl h-[90vh] md:h-[700px] flex flex-col rounded-t-2xl md:rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Bot size={24} />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Schwalenbot</h2>
              <p className="text-xs text-primary-foreground/80">Ihr digitaler Assistent</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-primary-foreground hover:bg-primary-foreground/20"
          >
            <X size={20} />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-background to-muted/20">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.role === "assistant" && (
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                  <Bot size={16} className="text-primary" />
                </div>
              )}
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-white border border-border shadow-sm"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
              </div>
            </div>
          ))}
          {chatMutation.isPending && (
            <div className="flex justify-start">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-2">
                <Bot size={16} className="text-primary" />
              </div>
              <div className="bg-white border border-border rounded-2xl px-4 py-3 shadow-sm">
                <Loader2 size={16} className="animate-spin text-primary" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Chips */}
        {messages.length === 1 && (
          <div className="px-4 pb-3 pt-2 border-t border-border bg-muted/30">
            <p className="text-xs text-muted-foreground mb-2">Vorschläge:</p>
            <div className="flex flex-wrap gap-2">
              {quickChips.map((chip, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleChipClick(chip)}
                  className="text-xs hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {chip}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-border bg-background">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Stellen Sie Ihre Frage..."
              className="flex-1"
              disabled={chatMutation.isPending}
              autoFocus
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || chatMutation.isPending}
              className="shadow-md"
            >
              <Send size={18} />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Powered by GPT - Echtzeit-Antworten
          </p>
        </form>
      </Card>
    </div>
  );
}

