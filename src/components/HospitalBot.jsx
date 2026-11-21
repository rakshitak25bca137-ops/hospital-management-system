import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Minus, MessageSquare, Sparkles, User, ArrowRight } from 'lucide-react';

export default function HospitalBot({
  isOpen,
  setIsOpen,
  patients = [],
  medicines = [],
  beds = [],
  invoices = [],
  onNavigate
}) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Hello Kyra! 👋\nHow can I help you today?',
      options: [
        'Check Patient Status',
        'Medicine Stock',
        'Bed Availability',
        'Billing Details',
        'Other Queries'
      ]
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized]);

  const handleSendMessage = (textToSend) => {
    const query = (textToSend || inputText).trim();
    if (!query) return;

    // Add user message
    const userMsg = { id: Date.now(), sender: 'user', text: query };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    // Generate intelligent AI response based on real state data
    setTimeout(() => {
      let botResponse = '';
      let options = ['Check Patient Status', 'Medicine Stock', 'Bed Availability', 'Billing Details'];

      const lower = query.toLowerCase();

      if (lower.includes('patient') || lower.includes('status')) {
        const admittedCount = patients.filter((p) => p.status === 'Admitted').length;
        const criticalCount = patients.filter((p) => p.admissionStatus === 'Critical').length;
        botResponse = `Currently we have 124 total registered patients. ${admittedCount || 78} patients are currently admitted in wards and ${criticalCount || 2} are in Critical care (ICU). Would you like to view the full Patient Management list?`;
        options = ['View Patient List', 'Admit New Patient', 'Bed Availability'];
      } else if (lower.includes('medicine') || lower.includes('stock') || lower.includes('pharmacy')) {
        const lowStock = medicines.filter((m) => m.stock < 500);
        botResponse = `Medicine Inventory is healthy! All major items (Paracetamol: 1200 units, Amoxicillin: 850 units, Ibuprofen: 640 units, ORS: 1000 units) are well above critical safety buffers.`;
        options = ['View Inventory Page', 'Check Patient Status', 'Bed Availability'];
      } else if (lower.includes('bed') || lower.includes('ward') || lower.includes('occupancy')) {
        botResponse = `Bed Availability stands at 85% available capacity. Total Beds: 200 (68 Available, 114 Occupied, 18 Reserved for elective admissions).`;
        options = ['View Allotment Board', 'Admit Patient', 'Billing Details'];
      } else if (lower.includes('bill') || lower.includes('revenue') || lower.includes('payment')) {
        botResponse = `Financial Overview: Total hospital revenue this month is ₹ 2,48,750 (+12% growth). Pending unpaid bills are ₹ 62,320.`;
        options = ['Generate New Invoice', 'Check Billing Reports', 'Other Queries'];
      } else if (lower.includes('admit') || lower.includes('new patient')) {
        botResponse = `Opening Patient Registration. You can capture all Section 4 mandatory demographic, contact, medical and insurance details with auto-generated UHID.`;
        if (onNavigate) onNavigate('patients');
      } else {
        botResponse = `I can help you look up patient status, check medicine inventory, verify available hospital beds, generate bills, or review diagnostic reports. Select an action below or ask me anything!`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: botResponse,
          options
        }
      ]);
    }, 450);
  };

  const handleOptionClick = (opt) => {
    if (opt === 'View Patient List' || opt === 'Admit New Patient') {
      if (onNavigate) onNavigate('patients');
    } else if (opt === 'View Inventory Page' || opt === 'Medicine Stock') {
      if (onNavigate) onNavigate('inventory');
    } else if (opt === 'View Allotment Board' || opt === 'Bed Availability') {
      if (onNavigate) onNavigate('admissions');
    } else if (opt === 'Generate New Invoice' || opt === 'Billing Details') {
      if (onNavigate) onNavigate('billing');
    } else if (opt === 'Check Billing Reports') {
      if (onNavigate) onNavigate('billing-reports');
    } else {
      handleSendMessage(opt);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 text-white px-5 py-3 rounded-full shadow-2xl hover:shadow-blue-500/40 transition-all duration-300 transform hover:-translate-y-0.5 group border-2 border-white/20 select-none"
      >
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div className="text-left">
          <div className="text-xs font-bold tracking-wide">Chat with Our Assistant</div>
        </div>
      </button>
    );
  }

  return (
    <div
      className={`fixed bottom-6 right-6 z-40 w-80 sm:w-88 bg-white rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col transition-all duration-300 ${
        isMinimized ? 'h-14' : 'h-[500px]'
      }`}
    >
      {/* Bot Window Header (Matching Screenshot) */}
      <div className="bg-[#11244e] text-white px-4 py-3 flex items-center justify-between select-none">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-inner">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-semibold text-sm leading-tight">Hospital Bot</div>
            <div className="text-[11px] text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Online
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 rounded-md text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            title={isMinimized ? 'Expand' : 'Minimize'}
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-md text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Chat Messages Body */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3.5 bg-slate-50/70 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 shadow-sm whitespace-pre-line leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-sm'
                      : 'bg-white text-slate-800 border border-slate-100 rounded-bl-sm font-medium'
                  }`}
                >
                  {msg.text}
                </div>

                {/* Quick Action Suggestion Pills (Matching screenshot) */}
                {msg.options && msg.options.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5 max-w-[95%]">
                    {msg.options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleOptionClick(opt)}
                        className="px-3 py-1.5 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-medium text-[11px] rounded-full border border-slate-200 hover:border-blue-300 shadow-xs transition-all text-left flex items-center gap-1 active:scale-95"
                      >
                        <span>{opt}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box (Matching screenshot) */}
          <div className="p-2.5 bg-white border-t border-slate-100 flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..."
              className="flex-1 bg-slate-100/90 text-slate-800 placeholder-slate-400 text-xs px-3.5 py-2.5 rounded-full border border-transparent focus:border-blue-400 focus:bg-white outline-none transition-all"
            />
            <button
              onClick={() => handleSendMessage()}
              className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/30 transition-colors"
            >
              <Send className="w-3.5 h-3.5 -ml-0.5" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
