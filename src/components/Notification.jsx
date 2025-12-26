import { FaCheckCircle, FaExclamationCircle, FaInfoCircle } from 'react-icons/fa';

function Notification({ notification }) {
    if (!notification) return null;

    const icons = {
        success: <FaCheckCircle />,
        error: <FaExclamationCircle />,
        info: <FaInfoCircle />
    };

    return (
        <div className={`notification ${notification.type} show`}>
            {icons[notification.type]}
            {notification.message}
        </div>
    );
}

export default Notification;
