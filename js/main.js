'use strict';

{
  const h1 = document.querySelector('h1'); //ようこそ→取得中→問題１→あなたの正答率
  const genre = document.getElementById('genre'); //[ジャンル]
  const difficulty = document.getElementById('difficulty'); //[難易度]
  const question = document.getElementById('question'); //問題文
  const ul = document.querySelector('ul');　//ボタンリスト
  let index;
  let count;
  let tests ;
  let result = 0;

   //取得中画面に移行
  function getData() {
    h1.textContent ='取得中';
    question.textContent ='少々お待ち下さい';
    while(ul.firstChild !== null){
      ul.removeChild(ul.firstChild);
    }
  }

  //問題表示画面に移行
  function createQuestion(object) {
    count = index +1;
    h1.textContent = `問題${count}`;
    genre.textContent = `[ジャンル]${object.category}`;
    difficulty.textContent = `[難易度]${object.difficulty}`;
    question.textContent = object.question;

    const choices = object.incorrect_answers;
    //選択肢の配列作成
    const choicesArray = [];
    choices.forEach((choice) => {
      const choicesObject = {};
      choicesObject.text = choice;
      choicesObject.c_w = 'wrong';
      choicesArray.push(choicesObject);
    });
    const choicesObject = {};
    choicesObject.text = object.correct_answer;
    choicesObject.c_w = 'correct';
    choicesArray.push(choicesObject);
    //選択肢シャッフル
    shuffle(choicesArray);
    //選択肢ボタン作成
    choicesArray.forEach((choices) => {
      const li = document.createElement('li');
      const button = document.createElement('button');
      button.textContent = choices.text;
      if(choices.c_w === 'correct') {
        button.id = 'correct';
      }
      button.addEventListener('click', () => {
        if(button.id === 'correct') {
          //正解か判定
          result ++;
        }
        index ++;
        while(ul.firstChild !== null){
          ul.removeChild(ul.firstChild);
        }
        if(index <= 9) {
          createQuestion(tests[index]);
        } else if (index > 9){
          resultQuestion(result);
        }
      });
      li.appendChild(button);
      ul.appendChild(li);
    });
  }

  //選択肢シャッフル
  const shuffle = (array) => {
    for (let i = array.length - 1; i >= 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j],array[i]];
    }
    return array;
  }
 
  //正答率画面に移行関数
  function resultQuestion(variable) {
    h1.textContent = `あなたの正答数は${variable}です！！`;
    genre.textContent = '';
    difficulty.textContent = '';
    question.textContent = '再度チャレンジしたい場合は以下をクリック！！';
    while(ul.firstChild !== null){
      ul.removeChild(ul.firstChild);
    }
    const li = document.createElement('li');
    const button = document.createElement('button');
    button.textContent = 'ホームに戻る';
    button.addEventListener('click',() => {
      h1.textContent = 'ようこそ';
      question.textContent = '以下のボタンをクリック';
      while(ul.firstChild !== null){
        ul.removeChild(ul.firstChild);
      }
      const li = document.createElement('li');
      const button = document.createElement('button');
      button.textContent = '開始';
      button.addEventListener('click',getApi);
      li.appendChild(button);
      ul.appendChild(li);
    });
    li.appendChild(button);
    ul.appendChild(li);
  }

  //データ取得
  async function getApi(){
    try {
      //取得中画面に移行関数
      getData();
      //データ取得
      const res = await fetch('https://opentdb.com/api.php?amount=10');
      const api = await res.json();
      tests = api.results;
      tests.forEach((test) => {
        console.log(test);
      });
      index = 0;
      createQuestion(tests[index]);
    } catch (error) {
      console.log(`エラー発生：${error}`);
    }
  }

  document.querySelector('button').addEventListener('click', getApi);
}