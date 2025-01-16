// index.js
const express = require('express');
const oracledb = require('oracledb');
const dbConfig = require('./dbconfig');
const imgLoadRoutes = require('./routes/imgLoad');

const app = express();
const PORT = process.env.PORT || 3050;

// Oracle DB 연결
async function initializeDB() {
    try {
        await oracledb.createPool({
            user: dbConfig.user,
            password: dbConfig.password,
            connectString: dbConfig.connectString
        });
        console.log('Oracle DB에 연결되었습니다.');
    } catch (err) {
        console.error('DB 연결 오류:', err);
        process.exit(1);
    }
}

// 미들웨어 설정
app.use(express.json()); // JSON 요청 본문을 파싱

// 엔드포인트 설정
app.use('/api/imgLoad', imgLoadRoutes);

// 기본 라우트
app.get('/', (req, res) => {
    res.send('Welcome to the Express API!');
});

// 서버 실행
app.listen(PORT, async () => {
    await initializeDB();
    console.log(`Server is running on http://localhost:${PORT}`);
});
