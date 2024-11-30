function StartScreen({ length, dispatch }) {
  return (
    <div className="start">
      <h2>Welcome to the React Quiz!</h2>
      <h3>{length} questions to testr your React matery</h3>
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "dataStart" })}>
        Let's start
      </button>
    </div>
  );
}

export default StartScreen;
