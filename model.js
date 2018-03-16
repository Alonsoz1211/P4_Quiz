const Sequelize = require('sequelize');
const options = {logging: false};
const sequelize = new Sequelize("sqlite:quizzes.sqlite", options);

const quiz = sequelize.define( 'quiz',
    {question: {
            type: Sequelize.STRING,
            unique: {msg: "Quiz already exists"},
            validate: {notEmpty: {msg: "Question cannot be empty"}}
        },
        answer: {
            type: Sequelize.STRING,
            validate:{notEmpty: {msg: "Answer cannot be empty"}}
        }
    });

sequelize.sync()
    .then(()=> sequelize.models.quiz.count())
    .then((count) => {
        if (!count) {
            return sequelize.models.quiz.bulkCreate([
                {question: 'Capital of Spain', answer: 'Madrid', authorId: 1},
                {question: 'Capital of France', answer: 'Paris', authorId: 1},
                {question: 'Capital of Italy', answer: 'Rome', authorId: 2},
                {question: 'Capital of Russia', answer: 'Moscow', authorId: 3}
            ]);
        }
    })
    .catch( err =>
        console.log(`    ${err}`));

module.exports = sequelize;












