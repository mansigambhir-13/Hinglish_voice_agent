import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';

export default function VoiceAgent() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversation, setConversation] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [callStarted, setCallStarted] = useState(false);

  const startCall = async () => {
    setCallStarted(true);
    setIsProcessing(true);
    
    try {
      const response = await fetch('/api/agent-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'CALL_START', isOpening: true })
      });
      
      const data = await response.json();
      setConversation([{ agent: data.response, farmer: '', timestamp: new Date().toLocaleTimeString() }]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const sendResponse = async (message: string) => {
    if (!message.trim()) return;
    
    setIsProcessing(true);
    
    try {
      const response = await fetch('/api/agent-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, isOpening: false })
      });
      
      const data = await response.json();
      setConversation(prev => [...prev, { agent: data.response, farmer: message, timestamp: new Date().toLocaleTimeString() }]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsProcessing(false);
      setInputText('');
    }
  };

  return (
    <>
      <Head>
        <title>PM-KUSUM Voice Agent</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-green-800 mb-2">
              🌾 PM-KUSUM Voice Agent
            </h1>
            <p className="text-lg text-gray-600">
              Natural Female Hinglish Conversation
            </p>
          </div>

          {!callStarted && (
            <div className="text-center mb-8">
              <button
                onClick={startCall}
                disabled={isProcessing}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg text-xl"
              >
                {isProcessing ? '📞 Starting...' : '📞 Start PM-KUSUM Call'}
              </button>
            </div>
          )}

          {callStarted && (
            <>
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h2 className="text-2xl font-semibold mb-4 text-green-800">Conversation</h2>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {conversation.map((entry, index) => (
                    <div key={index} className="space-y-2">
                      <div className="bg-green-100 p-3 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-green-800 font-semibold">🤖 Female Agent</span>
                          <span className="text-sm text-gray-500">{entry.timestamp}</span>
                        </div>
                        <p className="text-green-900">{entry.agent}</p>
                      </div>
                      {entry.farmer && (
                        <div className="bg-blue-100 p-3 rounded-lg ml-8">
                          <span className="text-blue-800 font-semibold">👨‍🌾 You</span>
                          <p className="text-blue-900">{entry.farmer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Your Response</h3>
                <form onSubmit={(e) => { e.preventDefault(); sendResponse(inputText); }} className="flex gap-2">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type your response in Hindi-English..."
                    disabled={isProcessing}
                    className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={isProcessing || !inputText.trim()}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg"
                  >
                    Send
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
