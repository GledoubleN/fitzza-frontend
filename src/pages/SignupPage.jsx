import React, { useState } from 'react';

export default function SignupPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        passwordConfirm: '',
        nickname: '',
    });

    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.email || !formData.password || !formData.nickname) {
            setErrorMessage('모든 항목을 입력해주세요.');
            return;
        }

        if (formData.password !== formData.passwordConfirm) {
            setErrorMessage('비밀번호가 일치하지 않습니다.');
            return;
        }

        setErrorMessage('');
        console.log('회원가입 요청 데이터:', formData);
        alert('회원가입 검증 완료! (콘솔창을 확인하세요)');
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>회원가입</h2>
            <form onSubmit={handleSubmit} style={styles.form}>

                {/* 이메일 입력 */}
                <div style={styles.inputGroup}>
                    <label style={styles.label}>이메일</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="example@email.com"
                        style={styles.input}
                    />
                </div>

                {/* 닉네임 입력 */}
                <div style={styles.inputGroup}>
                    <label style={styles.label}>닉네임</label>
                    <input
                        type="text"
                        name="nickname"
                        value={formData.nickname}
                        onChange={handleChange}
                        placeholder="사용하실 닉네임을 입력하세요"
                        style={styles.input}
                    />
                </div>

                {/* 비밀번호 입력 */}
                <div style={styles.inputGroup}>
                    <label style={styles.label}>비밀번호</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="비밀번호를 입력하세요"
                        style={styles.input}
                    />
                </div>

                {/* 비밀번호 확인 */}
                <div style={styles.inputGroup}>
                    <label style={styles.label}>비밀번호 확인</label>
                    <input
                        type="password"
                        name="passwordConfirm"
                        value={formData.passwordConfirm}
                        onChange={handleChange}
                        placeholder="비밀번호를 다시 입력하세요"
                        style={styles.input}
                    />
                </div>

                {/* 에러 메시지 출력 */}
                {errorMessage && <p style={styles.error}>{errorMessage}</p>}

                {/* 가입 버튼 */}
                <button type="submit" style={styles.button}>가입하기</button>
            </form>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f9f9f9',
        fontFamily: 'sans-serif',
    },
    title: {
        marginBottom: '20px',
        color: '#333',
    },
    form: {
        width: '360px',
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
    },
    label: {
        fontSize: '13px',
        fontWeight: 'bold',
        color: '#555',
    },
    input: {
        padding: '10px 12px',
        borderRadius: '6px',
        border: '1px solid #ddd',
        fontSize: '14px',
        outline: 'none',
    },
    button: {
        padding: '12px',
        backgroundColor: '#2563eb',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        fontSize: '15px',
        fontWeight: 'bold',
        cursor: 'pointer',
        marginTop: '10px',
    },
    error: {
        color: '#ef4444',
        fontSize: '12px',
        margin: '0',
        textAlign: 'center',
    },
};