import React from "react";
import * as Scroll from "react-scroll";

const scroll = Scroll.animateScroll;
const Events = Scroll.Events;
const scrollSpy = Scroll.scrollSpy;

class GazeMovement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            magnitude: 0,
            prevDir: "0",
            moving: false,
        };

        this.scroll = this.scroll.bind(this);
        //      this.updateScollMagnitude = this.updateScollMagnitude.bind(this);
    }

    componentDidMount() {
        Events.scrollEvent.register("begin", () => {
            if (!this.state.moving) {
                this.setState({ moving: true });
                //          console.log("begin", this.state.moveAmount);
            }
        });

        Events.scrollEvent.register("end", () => {
            if (this.state.moving) {
                this.setState({ moving: false });
                //        console.log("end", this.state.moveAmount);
            }
        });

        scrollSpy.update();
    }

    componentWillUnmount() {
        Events.scrollEvent.remove("begin");
        Events.scrollEvent.remove("end");
    }

    componentDidUpdate(prevProps) {
        if (
            !this.state.moving &&
            (this.props.x !== prevProps.x || this.props.y !== prevProps.y)
        ) {
            const y =
                this.props.y < 0
                    ? window.innerHeight / 2
                    : this.props.y > window.innerHeight
                    ? window.innerHeight / 2
                    : this.props.y;
            // if (this.props.y <= 300) {
            //     // the point is at the very top
            //     this.setState({ moveAmount: -500, prevDir: "--" }, () => {
            //         this.scroll();
            //     });
            // } else if (this.props.y >= window.innerHeight - 300) {
            //     // the point is at the very bottom
            //     this.setState({ moveAmount: 500, prevDir: "++" }, () => {
            //         this.scroll();
            //     });
            // }
            if (this.props.y <= 600) {
                // the point is towards the top
                let amt = -1 * (600 - this.props.y);
                this.setState({ moveAmount: amt, prevDir: "-" }, () => {
                    this.scroll();
                });
            } else if (this.props.y >= window.innerHeight - 600) {
                // the point is towards the bottom
                let amt = this.props.y - (window.innerHeight - 600);
                this.setState({ moveAmount: amt, prevDir: "+" }, () => {
                    this.scroll();
                });
            } else {
                // the point is in the center
                if (this.state.prevDir !== "0")
                    this.setState({ moveAmount: 0, prevDir: "0" });
                // if (this.state.magnitude > 0) {
                //     this.setState({ magnitude: this.state.magnitude - 0.05 });
                // } else if (this.state.magnitude < 0) {
                //     this.setState({ magnitude: this.state.magnitude + 0.05 });
                // }
            }
        }
    }

    scroll() {
        scroll.scrollMore(
            Math.sign(this.state.moveAmount) *
                Math.abs(this.state.moveAmount) ** 1.02,
            {
                duration: 1000 - Math.abs(this.state.moveAmount) ** 1.02,
                smooth: "linear",
            }
        );
    }

    //   scroll.scrollMore(100);
    render() {
        return (
            <div>
                <div
                    style={{
                        position: "fixed",
                        zIndex: 1000,
                        height: 40,
                        width: 40,
                        backgroundColor: "blue",
                        top: this.props.y || 0,
                        left: window.innerWidth / 2,
                    }}
                ></div>
                {this.props.children}
            </div>
        );
    }
}

export default GazeMovement;
