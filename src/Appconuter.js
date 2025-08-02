import React from "react";
class counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 3 };
    this.handleDecrement = this.handleDecrement.bind(this);
    this.handleIncrement = this.handleIncrement.bind(this);
  }
  handleDecrement() {
    this.setState((curState) => {
      return { count: curState.count - 1 };
    });
  }
  handleIncrement() {
    this.setState((curState) => {
      return { count: curState.count + 1 };
    });
  }
  render() {
    const data = new Date("oct 12 2027");
    data.setDate(data.getDate() + this.state.count);
    return (
      <div>
        <button onClick={this.handleIncrement}>+</button>
        <span>
          {" "}
          {data.toDateString()}[{this.state.count}]
        </span>
        <button onClick={this.handleDecrement}>-</button>
      </div>
    );
  }
}
export default counter;
