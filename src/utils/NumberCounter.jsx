import { useSpring, animated } from "react-spring";

const NumberCounter = ({ n }) => {
  const { number } = useSpring({
    from: { number: 0 },
    number: n,
    delay: 200,
    config: { mass: 1, tension: 35, friction: 10 },
  });

  return (
    <animated.span>
      {number.to((n) => Math.round(n).toLocaleString())}
    </animated.span>
  );
};

export default NumberCounter;
