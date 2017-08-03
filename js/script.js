/**
 * Created by linh on 29/07/2017.
 */
$(function () {
    var res = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
        [1, 4, 7],
        [2, 5, 8],
        [3, 6, 9],
        [1, 5, 9],
        [3, 5, 7]
    ];
    var choose = [];
    var turn = 1;
    var win = false;
    var $cells = $('div .cells');
    var isComputer = 'X';
    var scorePlayer = 0;
    var scoreComputer = 0;

    function paint(c1, c2, c3) {
        setTimeout(function () {
            $cells.find('div[cell-id=' + c1 + ']').addClass('win');
            $cells.find('div[cell-id=' + c2 + ']').addClass('win');
            $cells.find('div[cell-id=' + c3 + ']').addClass('win');
        }, 500);
        setTimeout(function () {
            reset();
        },2000);

    }

    function checkWin() {
        for (var i = 0; i < res.length; i++) {
            if (choose[res[i][0]] === choose[res[i][1]] && choose[res[i][1]] === choose[res[i][2]]) {
                if (choose[res[i][0]] === 'X') {
                    //         alert('X WINNER');
                    win = true;
                    paint(res[i][0], res[i][1], res[i][2]);
                    return 'X';
                }
                if (choose[res[i][0]] === 'O') {
                    //          alert('O WINNER');
                    win = true;
                    paint(res[i][0], res[i][1], res[i][2]);
                    return 'O';
                }
            }
        }
        var draw = true;
        for (var i = 1;i<=9;i++)
            if (choose[i] === undefined) {
                draw = false;
                break;
            }
        if (draw)
            setTimeout(function () {
                reset();
            },2000);
        return 'NO';
    }
    function play(id,myTurn,color) {
        setTimeout(function () {
            var $cell = $cells.find('div[cell-id=' + id + ']');
            $cell.children().text(myTurn);
            $cell.children().css('color', color);
            turn *= -1;
        }, 500);
        choose[id] = myTurn;
    }

    function computerPlay(myTurn, color) {
        var yourTurn;
        if (myTurn === 'X')
            yourTurn = 'O';
        else
            yourTurn = 'X';

        function play(id) {
            setTimeout(function () {
                var $cell = $cells.find('div[cell-id=' + id + ']');
                $cell.children().text(myTurn);
                $cell.children().css('color', color);
                turn *= -1;
            }, 500);
            choose[id] = myTurn;
        }

        var ok = false;
        var isTick = function () {
            var yourChooseID = 1;
            for (var i = 0; i < res.length; i++) {
                if ((choose[res[i][0]] === choose[res[i][1]] && choose[res[i][0]] !== undefined)
                    || (choose[res[i][1]] === choose[res[i][2]] && choose[res[i][1]] !== undefined)
                    || (choose[res[i][0]] === choose[res[i][2]] && choose[res[i][0]] !== undefined)) {
                    var chooseId = 1;
                    for (var j = 0; j < 3; j++) {
                        var isDiff = true;
                        for (var k = 0; k < 3; k++)
                            if (choose[res[i][j]] === choose[res[i][k]] && j !== k) {
                                isDiff = false;
                                break;
                            }
                        if (isDiff) chooseId = res[i][j];
                    }
                    if (choose[chooseId] === undefined) {
                        if (choose[res[i][0]] === myTurn || choose[res[i][1]] === myTurn) {
                            play(chooseId);
                            ok = true;
                            return;
                        }
                        if (choose[res[i][0]] === yourTurn || choose[res[i][1]] === yourTurn) {
                            yourChooseID = chooseId;
                            ok = true;
                        }
                    }
                }
            }
            if (ok === true) {
                //        alert(yourChooseID);
                play(yourChooseID);
            }
        };

        isTick();
        console.log(0);
        if (ok === true) return;

        function check2Path() {
            for (var i = 1; i <= 9; i++) {
                if (choose[i] === undefined) {
                    var count = 0;
                    choose[i] = yourTurn;
                    for (var j = 0; j < res.length; j++) {
                        var ok = false;
                        for (var k = 0; k < 3; k++)
                            if (res[j][k] === i)
                                ok = true;
                        if (ok) {
                            if ((choose[res[j][0]] === choose[res[j][1]] && choose[res[j][0]] !== undefined)
                                || (choose[res[j][1]] === choose[res[j][2]] && choose[res[j][1]] !== undefined)
                                || (choose[res[j][0]] === choose[res[j][2]] && choose[res[j][0]] !== undefined)) {
                                count++;
                            }
                        }
                    }
                    console.log(choose);
                    choose[i] = undefined;
                    if (count >= 2) {
                        play(i);
                        return true;
                    }
                }
            }
            return false;
        }

        if (check2Path() === true) return;
        if (choose[5] === undefined)
            play(5);
        else {
            for (var i = 1; i <= 9; i++)
                if (i % 2 !== 0 && choose[i] === undefined) {
                    play(i);
                    return;
                }
            for (var i = 1; i <= 9; i++)
                if (choose[i] === undefined) {
                    play(i);
                    return;
                }
        }
    }

    function playPlayer($cell, symbol, color) {
        var id = $cell.attr('cell-id');
        $cell.children().text(symbol);
        $cell.children().css('color', color);
        choose[id] = symbol;
        console.log(choose);
    }
    function reset(){
        choose = [];
        var $divcell = $('div .cell');
        $divcell.removeClass("win");
        $divcell.children().text('');
        turn = 1;
        win = false;
        scorePlayer = 0;
        scoreComputer = 0;
    }
    $('div .player span.reset').click(function () {
        reset();
        $('div .cells').fadeOut(200);
        $('div .ques').fadeIn(400);
        $('div #score1').text(0);
        $('div #score2').text(0);
    });
    $('div .chooseX').click(function () {
        isComputer = 'O';
        $('div .cells').fadeIn(400);
        $(this).parent().fadeOut();
    });
    $('div .chooseO').click(function () {
        isComputer = 'X';
        $('div .cells').fadeIn(400);
        var k = Math.floor(Math.random() * 9) + 1;
        play(k,'X', 'red');
        $(this).parent().fadeOut();
    });
    $('div .cell').click(function () {
        if (!win) {
            /*  if (turn === 1) {
             if (isComputer === 'X') computerPlay('X','red');
             else {
             playPlayer($(this), 'X', 'red');
             turn *= -1;
             }
             }
             else
             if (turn === -1) {
             if (isComputer === 'O') computerPlay('O','blue');
             else {
             playPlayer($(this), 'O', 'blue');
             turn *= -1;
             }

             }*/
            var $divscore = $('div #score1');
            var id = $(this).attr('cell-id');
            if (choose[id] === undefined) {
                if (isComputer === 'X') {
                    playPlayer($(this), 'O', 'blue');
                    if (checkWin() !== 'NO') {
                        scorePlayer++;
                        $divscore.text(scorePlayer);
                        return;
                    }
                    computerPlay('X', 'red');
                }
                if (isComputer === 'O') {
                    playPlayer($(this), 'X', 'red');
                    if (checkWin() !== 'NO') {
                        scorePlayer++;
                        $divscore.text(scorePlayer);
                        return;
                    }
                    computerPlay('O', 'blue');
                }
                console.log(turn);
                if (checkWin() === isComputer) {
                    scoreComputer++;
                    $('div #score2').text(scoreComputer);
                }
            }
        }
    });


});

