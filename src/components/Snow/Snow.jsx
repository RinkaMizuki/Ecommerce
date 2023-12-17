import Snowflake from "./SnowFlake";

const Snow = () => {
  let animationDelay = "0s";
  let fontSize = "100px";
  const arr = Array.from('Snowflakes are awesome!!! They are like little pieces of magic!!! Love snowflakes!!! Snowflakes are awesome!!! They are like little pieces of magic!!! Love snowflakes!!! Snowflakes are awesome!!! They are like little pieces of magic!!! Love snowflakes!!!')

  return arr.map((el, i) => {
    animationDelay = `${(Math.random() * 16).toFixed(2)}s`;
    fontSize = `${(Math.floor(Math.random() * 10) + 10)}px`;
    const style = {
      animationDelay,
      fontSize
    }
    return (<Snowflake key={i} id={i} style={style} />)
  })
};

export default Snow;
