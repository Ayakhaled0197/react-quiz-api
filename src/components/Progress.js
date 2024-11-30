function Progress({ index, length, points, maxPoints, answer }) {
  return (
    <header className="progress">
      <progress max={length} value={index + Number(answer !== null)}></progress>
      <p>
        Questions <strong>{index + 1}</strong> / {length}
      </p>
      <p>
        <strong>{points}</strong> / {maxPoints}
      </p>
    </header>
  );
}

export default Progress;
