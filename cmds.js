
const model = require('./model');

const {log, biglog, errorlog, colorize} = require("./out");



exports.helpCmd = rl => {
    log("Comandos:");
    log("   h|help - Muestra esta ayuda.");
    log("   list - Listar los quizzes existentes.");
    log("   show <id> - Muestra la pregunta y la respuesta el quiz indicado.");
    log("   add - Añadir un nuevo quiz interactivamente.");
    log("   delete <id> - Borrar el quiz indicado.");
    log("   edit <id> - Editar el quiz indicado.");
    log("   test <id> - Probar el quiz indicado.");
    log("   p|play - Jugar a preguntar aleatoriamente todos los quizzes.");
    log("   credits - Créditos.");
    log("   q|quit - Salir del programa.");
    rl.prompt();
};

exports.addCmd = rl => {

    rl.question(colorize(' Introduzca una pregunta: ', 'red'), question => {

        rl.question(colorize(' Introduzca la respuesta: ','red'), answer => {

            model.add(question, answer);
            log(` ${colorize('Se ha añadido', 'magenta')}: ${question} ${colorize('=>', 'magenta')} ${answer}`);
            rl.prompt();
        });
    });
};

exports.listCmd = rl => {

    model.getAll().forEach((quiz, id) => {
        log(`  [${colorize(id, 'magenta')}]:${quiz.question}`);
    });

    rl.prompt();
};

exports.showCmd = (rl, id) => {

    if(typeof id === "undefined") {
        errorlog(`Falta el parámetro id.`);
    }else{
        try{
            const quiz = model.getByIndex(id);
            log(` [${colorize(id, 'magenta')}]: ${quiz.question} ${colorize('=>', 'magenta')} ${quiz.answer}`);
        }catch(error) {
            errorlog(error.message);
        }
    }

    rl.prompt();
};


exports.testCmd = (rl, id) => {

    if(typeof id === "undefined") {
        errorlog(`Falta el parámetro id.`);
        rl.prompt();
    }else{
        try{
            const quiz = model.getByIndex(id);
            rl.question( colorize(quiz.question + '?  ' , 'red'), resp => {
                var respuestaCorrecta = RegExp(quiz.answer, 'i');
                const arrayRespuesta= resp.match(respuestaCorrecta);
                if(arrayRespuesta == null) {
                    console.log("Su respuesta es : ");
                    biglog("Incorrecta", 'red');
                }else if (arrayRespuesta[0].replace(respuestaCorrecta,quiz.answer).trim() == quiz.answer) {
                    console.log("Su respuesta es : ");
                    biglog("Correcta", 'green');
                } else{
                    console.log("Su respuesta es : ");
                    biglog("Incorrecta", 'red');
                }
                rl.prompt();
            });
        }catch(error) {
            errorlog(error.message);
            rl.prompt();
            }
    }
};




exports.playCmd = rl => {

    let score = 0;
    let toBeResolved = [];

        model.getAll().forEach((quiz, id) => {
            toBeResolved.push(id);
        });

const playOne = () => {
    if (toBeResolved.length === 0) {
        console.log(`No hay nada mas que preguntar.`);
        console.log(`Fin del examen. Aciertos:`);
        biglog(score, 'magenta');
        rl.prompt();
    } else {
        let idAzar = toBeResolved[Math.floor(toBeResolved.length * Math.random())];
        var index = toBeResolved.indexOf(idAzar);
        if (index > -1) {
            toBeResolved.splice(index, 1);
        }
        const quiz = model.getByIndex(idAzar);
        rl.question( colorize(quiz.question + '?  ' , 'red'), resp => {
            var respuestaCorrecta = RegExp(quiz.answer, 'i');
            const arrayRespuesta = resp.match(respuestaCorrecta);
            if(arrayRespuesta == null) {
                console.log(`INCORRECTO.`);
                console.log(`Fin del examen. Aciertos: `);
                biglog(score, 'magenta');
            }else if (arrayRespuesta[0].replace(respuestaCorrecta,quiz.answer).trim() == quiz.answer) {
                score++;
                console.log(` CORRECTO. Lleva ${score} aciertos `);
                playOne();
            } else {
                console.log(`INCORRECTO.`);
                console.log(`Fin del examen. Aciertos: `);
                biglog(score, 'magenta');
            }
            rl.prompt();
        });


    }
};
playOne();
};

exports.deleteCmd = (rl, id) => {

    if(typeof id === "undefined") {
        errorlog(`Falta el parámetro id.`);
    }else{
        try{
            const quiz = model.getByIndex(id).question
                model.deleteByIndex(id);
                log(` ${colorize('Se ha eliminado', 'magenta')}: ${quiz}`);
        }catch(error) {
            errorlog(error.message);
        }
    }

    rl.prompt();
};

exports.editCmd = (rl, id) => {

    if(typeof id === "undefined") {
        errorlog(`Falta el parámetro id.`);
        rl.prompt();
    }else{
        try{
            const quiz = model.getByIndex(id);

            process.stdout.isTTY && setTimeout(() => {rl.write(quiz.question)},0);

            rl.question(colorize(' Introduzca una pregunta: ', 'red'), question => {

                process.stdout.isTTY && setTimeout(() => {rl.write(quiz.answer)},0);


                rl.question(colorize(' Introduzca la respuesta: ','red'), answer => {
                    model.update(id, question, answer);
                    log(` Se ha cambiado el quiz ${colorize(id, 'magenta')} por: ${question} ${colorize('=>', 'magenta')} ${answer}`);
                    rl.prompt();
                });
            });
        }catch(error) {
            errorlog(error.message);
            rl.prompt();
        }
    }
};

exports.creditsCmd = rl => {
    log('Autor de la práctica:');
    log('Alonso Espasandín Hernán', 'green');
    rl.prompt();
};

exports.quitCmd = rl => {
    rl.close();
};