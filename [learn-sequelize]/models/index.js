// 1. 앱 환경 설정
const env = process.env.NODE_ENV || 'development';
// 2. 환경별로 설정 
const config = require('../config/config')[env];

// 1. 시컬라이즈 선언
const Sequelize = require('sequelize');

// 2. 시컬라이즈 연결 설정
const sequelize = new Sequelize(config.database
    , config.username, config.password, config);
    
// 빈 객체 생성
const db = {};

// 연결 설정된 시컬라이즈
db.sequelize = sequelize;
// 연결 설정 안된 시컬라이즈
db.Sequelize = Sequelize;


// 외부입력??? -> 맵핑된 테이블 모델 가져오기  (Object relation mapping)
const User = require('./user');
const Comment = require('./comment');

// 디비 객체에 모델 몰아 넣기
db.User = User;
db.Comment = Comment;

// 시컬라이즈 Sequelize.Model init 호출
User.init(sequelize);
Comment.init(sequelize);

// 시컬라이즈 hasMany 호출
User.associate(db);
Comment.associate(db);

module.exports = db;
