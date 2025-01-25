
const configContainer= document.querySelector(".config-container");
const quizContainer= document.querySelector(".quiz-container");
const answerOptions= document.querySelector(".answer-options");
const nextQuestionBtn= document.querySelector(".next-question-btn");
const questionStatus= document.querySelector(".question-status");
const timerDisplay=document.querySelector(".time-duration");
const resultContainer=document.querySelector(".result-container");

const QUIZ_TIME_LIMIT= 15;
let currentTime= QUIZ_TIME_LIMIT;
let timer=null;
let quizCategory="programming"
let numberofQuestions=10;
let currentQuestion= null;
const questionIndexHistory =[];
let correctAnswersCount = 0;

const showQuizResult=()=>{
    quizContainer.style.display="none";
    resultContainer.style.display="block";

    const resultText=`Your answered <b>${correctAnswersCount}</b> out of <b>${numberofQuestions}</b> question correctly. Great efforts`;
    document.querySelector(".result-message").innerHTML =resultText;
}

const resetTimer=()=>{
    clearInterval(timer);
    currentTime=QUIZ_TIME_LIMIT;
    timerDisplay.textContent= `${currentTime}s`;
}

const startTimer=()=>{
    let remainingTime = QUIZ_TIME_LIMIT;  
    timer = setInterval(() => {
        remainingTime--;
        timerDisplay.textContent = `${remainingTime}s`;
        
        if (remainingTime <= 0) {
            clearInterval(timer);
            highlightCorrectAnswer();
            nextQuestionBtn.style.visibility = "visible";

            quizContainer.querySelector(".quiz-timer").style.background= "#c31420";

             //Disalbe all option after one option is selected
            answerOptions.querySelectorAll(".answer-option").forEach(option=> option.style.pointerEvents= "none" );


        }
    }, 1000)
}

const getRandomQuestion=()=>{
    console.log("Current Quiz Category:", quizCategory.toLowerCase());
    const categoryQuestions=questions.find(c=>c.category===quizCategory.toLowerCase()).questions || [];

    if(questionIndexHistory.length >=Math.min(categoryQuestions.length, numberofQuestions)) {
        return showQuizResult()
    }

    // console.log(categoryQuestions);
    const availableQuestion = categoryQuestions.filter((_, index)=>!questionIndexHistory.includes(index));

    const randomQuestion = availableQuestion[Math.floor(Math.random() * availableQuestion.length)];

    questionIndexHistory.push(categoryQuestions.indexOf(randomQuestion));
    return randomQuestion;
}

const highlightCorrectAnswer = ()=>{
    const correctOption=answerOptions.querySelectorAll(".answer-option")[currentQuestion.correctAnswer];

    correctOption.classList.add("correct");
    const iconHTML=`<span class="material-symbols-rounded">check_circle</span>`;
    correctOption.insertAdjacentHTML("beforeend",iconHTML);

}

const handleAnswer=(option,answerIndex)=>{
    clearInterval(timer);
    const isCorrect= currentQuestion.correctAnswer===answerIndex;
    option.classList.add(isCorrect ? 'correct' : 'incorrect');

    
    if (!isCorrect) {
        highlightCorrectAnswer();
    }
    else{
        
        correctAnswersCount++;
        
    }

    let iconName;
    if (isCorrect) {
        iconName = "check_circle";
    } else {
        iconName = "cancel";
        
    }

    const iconHTML = `<span class="material-symbols-rounded">${iconName}</span>`;
    option.insertAdjacentHTML("beforeend", iconHTML);

    //Disalbe all option after one option is selected
    answerOptions.querySelectorAll(".answer-option").forEach(option=> option.style.pointerEvents= "none" );

    nextQuestionBtn.style.visibility = "visible";
}

const renderQuestion=()=>{
    currentQuestion = getRandomQuestion();

    if(!currentQuestion) return;
    console.log(currentQuestion);

    resetTimer();
    startTimer();
    

    answerOptions.innerHTML= "";
    nextQuestionBtn.style.visibility = "hidden";
    quizContainer.querySelector(".quiz-timer").style.background= "#32313c";
    document.querySelector(".quiz-text").textContent = currentQuestion.question;
    questionStatus.innerHTML =` <b>${questionIndexHistory.length}</b> of <b>${numberofQuestions}</b>  Questions`;

// create option <li> elements and append them
    currentQuestion.options.forEach((option,index) =>{
        const li= document.createElement("li");
        li.classList.add("answer-option");
        li.textContent = option;
        answerOptions.appendChild(li);
        li.addEventListener("click",()=>handleAnswer(li, index))
    });
}

const resetQuiz =() =>{
    resetTimer();
    correctAnswersCount=0;
    questionIndexHistory.length=0;
    configContainer.style.display="block";
    resultContainer.style.display="none";
}

const startQuiz= ()=>{
    configContainer.style.display = 'none';
    quizContainer.style.display = "block";

    quizCategory = configContainer.querySelector(".category-options .category-option.active").textContent;
    numberofQuestions = parseInt(configContainer.querySelector(".question-options .question-option.active").textContent);

    console.log("Selected Category:", quizCategory);
    console.log("Selected Number of Questions:", numberofQuestions);

    renderQuestion();
}


document.querySelectorAll(".category-option, .question-option").forEach(option =>{
    option.addEventListener("click", ()=>{
        option.parentNode.querySelector(".active").classList.remove("active");
        option.classList.add("active");
    })
})

nextQuestionBtn.addEventListener("click",renderQuestion)
document.querySelector(".try-again-btn").addEventListener("click",resetQuiz);
document.querySelector(".start-quiz-btn").addEventListener("click",startQuiz);