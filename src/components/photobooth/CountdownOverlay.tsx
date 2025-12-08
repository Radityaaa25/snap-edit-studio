interface CountdownOverlayProps {
  count: number;
}

const CountdownOverlay = ({ count }: CountdownOverlayProps) => {
  return (
    <div className="countdown-overlay z-10">
      <span key={count} className="countdown-number">
        {count}
      </span>
    </div>
  );
};

export default CountdownOverlay;
