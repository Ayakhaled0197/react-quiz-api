function Question({ questions, dispatch, answer }) {
  const hasAnswer = answer !== null;
  return (
    <div>
      <h4>{questions.question}</h4>
      <div className="options">
        {questions.options.map((op, index) => (
          <button
            className={`btn btn-option ${index === answer ? "answer" : ""} ${
              hasAnswer
                ? index === questions.correctOption
                  ? "correct"
                  : "wrong"
                : ""
            }`}
            key={op}
            disabled={hasAnswer}
            onClick={() => dispatch({ type: "newAnswer", payload: index })}>
            {op}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Question;
