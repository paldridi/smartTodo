import React, { useState } from 'react';
import { TypeAnimation } from 'react-type-animation';
import axios from '../api';

function AIChat() {
    const [input, setInput] = useState('');
    const [response, setResponse] = useState('');

    const handleSend = async () => {
        const res = await axios.post('/api/ai/recommend', { description: input });
        setResponse(res.data);
    };

    return (
        <div className="ai-chat">
            <TypeAnimation
                sequence={[response, 1000, '']}
                wrapper="span"
                cursor={true}
                repeat={Infinity}
            />
            <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask AI anything..."
            />
            <button onClick={handleSend}>Send</button>
        </div>
    );
}

export default AIChat;
