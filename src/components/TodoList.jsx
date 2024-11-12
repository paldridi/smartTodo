import { useEffect, useState, useCallback } from 'react';
import { FaEdit, FaTrashAlt, FaCheckCircle, FaTimesCircle, FaCaretDown, FaCaretUp, FaRedoAlt, FaPlusCircle, FaComments } from 'react-icons/fa';
import PropTypes from 'prop-types'; 
import { getAISuggestions } from '../api/openAI';
import EditTodo from './EditTodo';

const TodoList = ({ todo, onDelete, onComplete, onEdit, bucketId }) => {
  const [isEditing, setisEditing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState('Fetching AI suggestion...');
  const [loading, setLoading] = useState(false);
  const [chatMode, setChatMode] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]); // Store the chat history
  const [statusCompleted, setStatusCompleted] = useState(todo.done);

  const fetchAISuggestion = useCallback(async (extend = false) => {
    setLoading(true);
    const suggestion = await getAISuggestions(todo.description, extend, {
      title: todo.title,
      deadline: todo.deadline,
      status: todo.done
    });
    setAiSuggestion(suggestion);
    setLoading(false);
  }, [todo]);

  useEffect(() => {
    fetchAISuggestion();
  }, [fetchAISuggestion]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const toggleChat = () => {
    setChatMode(!chatMode);
    setChatMessage('');
  };

  const sendChatMessage = async () => {
    if (chatMessage.trim()) {
      const userMessage = `You: ${chatMessage}`;
      const aiResponse = await getAISuggestions(chatMessage, false, {
        title: todo.title,
        deadline: todo.deadline,
        status: todo.done
      });
      setChatHistory([...chatHistory, userMessage, `AI: ${aiResponse}`]);
      setChatMessage('');
    }
  };

  const handleCompleteToggle = () => {
    setStatusCompleted(!statusCompleted);
    onComplete(todo.id, !statusCompleted);
  };


  return (
    <div className="w-full p-4 bg-white rounded-lg shadow-md mb-4">
      {isEditing ? (
        <EditTodo  todoData={todo} setIsEditing={setisEditing} bucketId={bucketId}/>        
      ) : (
        <div className='flex justify-between items-center'>
        <div>
          <h2 className="text-lg font-semibold text-blue-800">{todo.title}</h2>
          <p className="text-gray-600">Deadline: {new Date(todo.deadline).toLocaleDateString()}</p>
        </div>

        <div className='flex items-center space-x-3'>
          <button className="text-sky-600 hover:text-sky-800" onClick={() => setisEditing(!isEditing)}>
            <FaEdit />
          </button>
          <button className="text-red-600 hover:text-red-800" onClick={() => onDelete(todo.id)}>
            <FaTrashAlt />
          </button>
          <button className={statusCompleted ? "text-gray-600 hover:text-gray-800" : "text-green-600 hover:text-green-800"} onClick={handleCompleteToggle}>
            {statusCompleted ? <FaTimesCircle /> : <FaCheckCircle />} 
          </button>

          <button onClick={toggleDropdown} className='text-gray-600 flex items-center'>
            {isOpen ? <FaCaretUp /> : <FaCaretDown />}
            <span className="ml-1">{isOpen ? 'Hide Details' : 'Show Details'}</span>
          </button>
        </div>
      </div>
      )}
      
      

      {isOpen && (
        <div className="mt-2 text-gray-700">
          <p>Description: {todo.description}</p>
          <div className="italic mt-2">
            <strong>AI Recommendation:</strong>
            <div style={{ maxHeight: '150px', overflowY: 'auto', whiteSpace: 'pre-wrap', wordWrap: 'break-word', padding: '8px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
              {loading ? 'Loading...' : aiSuggestion}
            </div>
          </div>

          <div className="flex space-x-3 mt-2">
            <button onClick={() => fetchAISuggestion()} className="text-blue-500 hover:text-blue-700" disabled={loading}>
              <FaRedoAlt /> Retry
            </button>
            <button onClick={() => fetchAISuggestion(true)} className="text-blue-500 hover:text-blue-700" disabled={loading}>
              <FaPlusCircle /> Extend
            </button>
            <button onClick={toggleChat} className="text-blue-500 hover:text-blue-700">
              <FaComments /> Chat
            </button>
          </div>

          {chatMode && (
            <div className="mt-4 p-4 border rounded-md bg-gray-100">
              <div style={{ maxHeight: '150px', overflowY: 'auto', backgroundColor: '#f1f5f9', padding: '8px', borderRadius: '8px' }}>
                {chatHistory.slice(0).reverse().map((message, index) => (
                  <div key={index} className={`p-2 ${message.startsWith("You:") ? "text-blue-600" : "text-gray-800"} bg-white rounded-lg shadow-sm mb-2`}>
                    <p>{message}</p>
                  </div>
                ))}
              </div>
              
              <textarea 
                value={chatMessage} 
                onChange={(e) => setChatMessage(e.target.value)} 
                rows={2} 
                className="w-full p-2 mt-4 border rounded-md focus:outline-none focus:ring"
                placeholder="Ask the AI anything..."
              />
              <button 
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
                onClick={sendChatMessage}
              >
                Send
              </button>
            </div>
          )}

          <p className="mt-4 text-gray-600">Status: {statusCompleted ? (
            <span className="text-green-600 font-semibold">Completed</span>
          ) : (
            <span className="text-red-600 font-semibold">Not Completed</span>
          )}</p>
        </div>
      )}
    </div>
  );
};

TodoList.propTypes = {
  todo: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    deadline: PropTypes.string.isRequired,
    done: PropTypes.bool.isRequired,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
  onComplete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired
};

export default TodoList;
