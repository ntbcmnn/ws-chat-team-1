import React, {useState} from 'react';

interface MessageFormProps {
    onSendMessage: (message: string) => void;
}

const MessagesForm: React.FC<MessageFormProps> = ({onSendMessage}) => {
    const [text, setText] = useState('');

    const submitHandler = (e: React.FormEvent) => {
        e.preventDefault();
        if (text.trim()) {
            onSendMessage(text);
            setText('');
        }
    };

    const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setText(e.target.value);
    };


    return (
        <form className="d-flex align-items-center" onSubmit={submitHandler}>
            <input type="text" className="form-control me-2" id="exampleFormControlInput1"
                   placeholder="Enter your message" value={text} onChange={changeHandler} />
            <button type="submit" className="btn btn-secondary">Secondary</button>
        </form>
    );
};

export default MessagesForm;

