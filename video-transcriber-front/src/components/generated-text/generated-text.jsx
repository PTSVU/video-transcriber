import './generated-text.css';

export default function GeneratedText({text}) {
    return (
        <div className="generated-text-container">
            <div className="text-wrapper">
                <p className="generated-text">
                    {text}
                </p>
            </div>
        </div>
    )
}