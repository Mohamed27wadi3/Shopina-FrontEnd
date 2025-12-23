import { createRoot } from "react-dom/client";
import "./index.css";

// Simple test component to verify React is working
function TestApp() {
    return (
        <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'Arial' }}>
            <h1 style={{ color: '#4F46E5', fontSize: '48px' }}>✅ Shopina Frontend Works!</h1>
            <p style={{ fontSize: '24px', marginTop: '20px' }}>
                React is rendering correctly.
            </p>
            <div style={{ marginTop: '40px', padding: '20px', background: '#f3f4f6', borderRadius: '8px' }}>
                <h2>Backend Connection Test</h2>
                <button
                    onClick={async () => {
                        try {
                            const res = await fetch('http://localhost:8000/api/shop/products/');
                            const data = await res.json();
                            alert(`✅ Backend connected! Found ${data.length} products`);
                        } catch (error) {
                            alert('❌ Backend connection failed: ' + error.message);
                        }
                    }}
                    style={{
                        padding: '12px 24px',
                        fontSize: '18px',
                        background: '#4F46E5',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        marginTop: '10px'
                    }}
                >
                    Test Backend Connection
                </button>
            </div>
            <div style={{ marginTop: '30px', fontSize: '14px', color: '#666' }}>
                <p>Frontend: http://localhost:3000</p>
                <p>Backend: http://localhost:8000</p>
            </div>
        </div>
    );
}

const rootElement = document.getElementById("root");
if (rootElement) {
    createRoot(rootElement).render(<TestApp />);
} else {
    console.error("Root element not found!");
}
