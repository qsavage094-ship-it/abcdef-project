import React, { useState, useEffect, useRef } from 'react';
import {
  Lock,
  Send,
  ShieldCheck,
  User,
  CheckCheck,
  KeyRound,
  FileCheck
} from 'lucide-react';
import { deriveConversationKey, encryptMessage, decryptMessage } from '../services/cryptoService';

export default function ChatModal({
  recipient,
  currentUserRole,
  currentUserId,
  onClose,
  initialMessages = [],
  t = {}
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [inputText, setInputText] = useState('');
  const [cryptoKey, setCryptoKey] = useState(null);
  const [isEncrypting, setIsEncrypting] = useState(false);
  const messagesEndRef = useRef(null);

  // Initialize E2EE cryptographic key for this channel
  useEffect(() => {
    async function initCrypto() {
      try {
        const key = await deriveConversationKey(currentUserId || 'farmer_1', recipient?.id || 'buyer_1');
        setCryptoKey(key);
      } catch (err) {
        console.error("Failed to derive cryptographic key:", err);
      }
    }
    initCrypto();
  }, [currentUserId, recipient]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const messageText = inputText;
    setInputText('');
    setIsEncrypting(true);

    try {
      // 1. Perform client-side cryptographic encryption using SubtleCrypto AES-GCM 256-bit
      let encryptedPayload = null;
      if (cryptoKey) {
        encryptedPayload = await encryptMessage(messageText, cryptoKey);
      }

      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const newMsg = {
        id: `msg_${Date.now()}`,
        channelId: `chat_${currentUserId}_${recipient.id}`,
        senderId: currentUserId,
        senderName: currentUserRole === 'farmer' ? "Rameshwar Patil (Farmer)" : "Vikram Malhotra (Buyer)",
        senderRole: currentUserRole === 'farmer' ? "Farmer" : "Buyer",
        timestamp: timeStr,
        plainText: messageText,
        encryptedPayload: encryptedPayload,
        isEncrypted: true
      };

      setMessages(prev => [...prev, newMsg]);
    } catch (err) {
      console.error("Encryption error:", err);
    } finally {
      setIsEncrypting(false);
    }
  };

  const handleQuickOffer = (text) => {
    setInputText(text);
  };

  return (
    <div className="modal-backdrop" style={{ backdropFilter: 'none', WebkitBackdropFilter: 'none' }}>
      <div className="modal-container" style={{ maxWidth: '600px', height: '640px', display: 'flex', flexDirection: 'column', padding: 0 }}>

        {/* Modal Header */}
        <div className="modal-header" style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-light)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.9rem'
            }}>
              {recipient?.companyName?.charAt(0) || recipient?.name?.charAt(0) || 'U'}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <h4 style={{ margin: 0, fontSize: '1rem' }}>
                  {recipient?.companyName || recipient?.name || 'Verified Partner'}
                </h4>
                <span className="tag tag-crypto" style={{ fontSize: '0.625rem', padding: '1px 5px' }}>
                  <Lock size={10} /> {t?.chat_encrypted_badge || "AES-GCM 256-bit Encrypted"}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.725rem', color: 'var(--text-secondary)' }}>
                {t?.chat_modal_title || "Encrypted Trade Channel"} • Direct Negotiation
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem', color: 'var(--text-primary)' }}
          >
            ✕
          </button>
        </div>

        {/* Message Thread */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          backgroundColor: 'var(--bg-subtle)'
        }}>
          {messages.map(msg => {
            const isMe = msg.senderId === currentUserId;
            return (
              <div
                key={msg.id}
                style={{
                  maxWidth: '75%',
                  alignSelf: isMe ? 'flex-end' : 'flex-start',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: isMe ? 'flex-end' : 'flex-start'
                }}
              >
                <div style={{
                  fontSize: '0.7rem',
                  color: 'var(--text-secondary)',
                  marginBottom: '3px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <span>{msg.senderName}</span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                </div>

                {/* Message Bubble */}
                <div style={{
                  padding: '10px 14px',
                  borderRadius: '12px',
                  backgroundColor: isMe ? 'var(--agri-green)' : '#ffffff',
                  color: isMe ? '#ffffff' : '#090d16',
                  border: isMe ? 'none' : '1px solid #d1d5db',
                  fontSize: '0.875rem',
                  lineHeight: '1.5',
                  wordBreak: 'break-word',
                  textRendering: 'optimizeLegibility',
                  WebkitFontSmoothing: 'antialiased',
                  MozOsxFontSmoothing: 'grayscale',
                }}>
                  {msg.plainText}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Negotiation Shortcut Buttons (Strictly in kg and ₹/kg) */}
        <div style={{
          padding: '8px 16px',
          backgroundColor: '#ffffff',
          borderTop: '1px solid var(--border-light)',
          display: 'flex',
          gap: '8px',
          overflowX: 'auto'
        }}>
          <button
            className="btn btn-outline btn-sm"
            style={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}
            onClick={() => handleQuickOffer("We can confirm ₹24.50/kg for 5,000 kg ready for pickup.")}
          >
            Offer ₹24.50/kg
          </button>

          <button
            className="btn btn-outline btn-sm"
            style={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}
            onClick={() => handleQuickOffer("Can you send an official 5kg sample to our quality lab first?")}
          >
            Request 5kg Sample
          </button>

          <button
            className="btn btn-outline btn-sm"
            style={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}
            onClick={() => handleQuickOffer("Please arrange Reefer cold-chain transit to maintain freshness.")}
          >
            Require Cold Storage
          </button>
        </div>

        {/* Message Input Box */}
        <form onSubmit={handleSendMessage} style={{
          padding: '14px 16px',
          backgroundColor: '#ffffff',
          borderTop: '1px solid var(--border-light)',
          display: 'flex',
          gap: '10px'
        }}>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={t?.chat_input_placeholder || "Type encrypted message or offer..."}
            className="form-input"
            style={{ flex: 1 }}
            disabled={isEncrypting}
            id="input-chat-message"
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isEncrypting || !inputText.trim()}
            id="btn-send-message"
          >
            <Send size={16} />
            <span>{t?.send_btn || "Send"}</span>
          </button>
        </form>

      </div>
    </div>
  );
}
