import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import "../App.css";
import { startTransition, useEffect, useReducer } from "react";
import { type } from "@testing-library/user-event/dist/type";
import NextQuestion from "./NextQuestion";
import Progress from "./Progress";
import FinishedScreen from "./FinishedScreen";
import Footer from "./Footer";
import Timer from "./Timer";

const SECS_PER_QUESTIONS = 30;
const initialState = {
  questions: [],
  // loading , error , ready , active
  statuss: "loading",
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  secondsRemaining: null,
};
function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return { ...state, questions: action.payload, statuss: "ready" };
    case "dataFailed":
      return { ...state, statuss: "error" };
    case "dataStart":
      return {
        ...state,
        statuss: "active",
        secondsRemaining: state.questions.length * 30,
      };
    case "newAnswer":
      const question = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    case "nextQuestion":
      return {
        ...state,
        index: state.index + 1,
        answer: null,
      };
    case "finished":
      return {
        ...state,
        statuss: "finished",
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };
    case "restart":
      return {
        ...initialState,
        questions: state.questions,
        statuss: "ready",
      };
    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        statuss: state.secondsRemaining === 0 ? "finished" : state.statuss,
      };
    default:
      throw new Error("Action unknown");
  }
}
function App() {
  const [
    { questions, statuss, index, answer, points, highscore, secondsRemaining },
    dispatch,
  ] = useReducer(reducer, initialState);
  const length = questions.length;
  const maxPoints = questions.reduce((prev, curr) => prev + curr.points, 0);
  useEffect(function () {
    fetch("http://localhost:8000/questions")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then((data) => dispatch({ type: "dataReceived", payload: data }))
      .catch((err) => dispatch({ type: "dataFailed" }));
  }, []);
  return (
    <div className="app">
      <Header />
      <Main>
        {statuss === "loading" && <Loader />}
        {statuss === "error" && <Error />}
        {statuss === "ready" && (
          <StartScreen length={length} dispatch={dispatch} />
        )}
        {statuss === "active" && (
          <>
            <Progress
              index={index}
              length={length}
              points={points}
              maxPoints={maxPoints}
              answer={answer}
            />
            <Question
              questions={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <Footer>
              <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
              <NextQuestion
                dispatch={dispatch}
                answer={answer}
                length={length}
                index={index}
              />
            </Footer>
          </>
        )}
        {statuss === "finished" && (
          <FinishedScreen
            points={points}
            maxPoints={maxPoints}
            highscore={highscore}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}

export default App;
