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

// 검체번호(또는 바코드번호), 검사코드, 검체코드, 검사결과본문(rtf), 전송자ID, 전송시간
// 연동 방식은 중간테이블에 결과 데이터를 직접 insert, update 해주시면 될 것 같습니다. 
// 결과 전송 이후 재전송이 가능한 부분에 대해 데이터 관리를 어떻게 할지 검토 부탁 드리며, 이를 위해 필요한 필드가 있으면 회신 부탁 드립니다. 

// 미들웨어 설정
app.use(express.json()); // JSON 요청 본문을 파싱

// 엔드포인트 설정`
app.use('/api/imgLoad', imgLoadRoutes);

// 기본 라우트
app.get('/', (req, res) => {
    res.send('Welcome to the Express API!');
});


// RTF SEND - 원자력
app.post('/0033-sendRTF', async (req, res) => {
    //  검체번호(또는 바코드번호), 검사코드, 검체코드, 검사결과본문(rtf), 전송자ID, 전송시간
    // barcodeNo, 검사 코드, 검체 코드, rtf 본문, 전송자 ID, 전송시간
    const { barcodeNo, rtfBody } = req.body;

    if (!barcodeNo || !rtfBody) {
        res.status(400).json({ error: 'barcodeNo or rtfBody are required' });
    }

    console.log('barcodeNo', barcodeNo);
    console.log('rtfBody', rtfBody);

    // 중간테이블 접속 후 insert, update문 필요
    res.send('Success');

    // 밑의 주석 코드는 oracle DB에 barcodeNo와 rtf를 업데이트 및 삽입 하는 내용입니다. 수정이 필요합니다.


    // const updateSQL = `
    //     UPDATE 중간테이블
    //     SET rtfBody = :rtfBody
    //     WHERE barcodeNo = :barcodeNo
    // `;

    // const insertSQL = `
    //     INSERT INTO 중간테이블 (barcodeNo, rtfBody)
    //     VALUES (:barcodeNo, :rtfBody)
    // `;

    // let connection;
    // try {
    //     connection = await oracledb.getConnection();
    //     // await connection.beginTransaction();  트랙잭션 시작

    //     const checkSQL = `
    //         SELECT COUNT(*) AS count
    //         FROM 중간테이블
    //         WHERE barcodeNo = :barcodeNo
    //     `;
    //     const result = await connection.execute(checkSQL, { barcodeNo });

    //     if (result.rows[0].COUNT > 0) {
    //         await connection.execute(updateSQL, { barcodeNo, rtfBody }, { autoCommit: true });

    //         // await connection.commit();  // 트랜잭션 커밋 - 만약 autoCommit이 false인 상태인 경우 위의 코드에서 { autoCommit: true }를 없애고 해당 코드 주석을 해제해야 함

    //         return res.status(200).json({ message: 'Data updated successfully' });
    //     } else {
    //         await connection.execute(insertSQL, { barocodeNo, rtfBody }, { autoCommit: true });
    //         // await connection.commit();  // 트랜잭션 커밋 - 만약 autoCommit이 false인 상태인 경우 위의 코드에서 { autoCommit: true }를 없애고 해당 코드 주석을 해제해야 함
    //         return res.status(201).json({ message: 'Data inserted successfully' });
    //     }
    // } catch (err) {
    //     console.error('Error while processing request:', err);
    //     return res.status(500).json({ error: 'Internal server error' });
    // } finally {
    //     if (connection) {
    //         try {
    //             await connection.close();
    //         } catch (closeErr) {
    //             console.error('연결 종료 중 오류: ', closeErr.message);
    //         }
    //     }
    // }
});

// 서버 실행
app.listen(PORT, async () => {
    await initializeDB();
    console.log(`Server is running on http://localhost:${PORT}`);
});
