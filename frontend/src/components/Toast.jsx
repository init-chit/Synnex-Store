import { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, XCircle } from 'lucide-react';

const Toast = ({ message, type = 'info', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    warning: <AlertCircle className="w-5 h-5 text-yellow-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />
  };

  const bgColors = {
    success: 'bg-black border-green-400',
    error: 'bg-black border-red-400',
    warning: 'bg-black border-yellow-400',
    info: 'bg-black border-blue-400'
  };

  return (
    <div className={`${bgColors[type]} border-2 rounded-lg shadow-lg p-4 min-w-[300px] max-w-md flex items-center gap-3 animate-slide-in`}>
      {icons[type]}
      <p className="flex-1 text-white font-semibold">{message}</p>
      <button
        onClick={onClose}
        className="text-white/70 hover:text-white transition"
      >
        <X size={18} />
      </button>
    </div>
  );
};

export default Toast;

