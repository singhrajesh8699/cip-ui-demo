import React from 'react';

class Loading extends React.Component {

    render() {
        return (
          <div>
            <div className="xylo-msg-center">
              <h1>{this.props.message}</h1>
            </div>
            <div className="sk-spinner sk-spinner-fading-circle">
              <div className="sk-circle1 sk-circle"></div>
              <div className="sk-circle2 sk-circle"></div>
              <div className="sk-circle3 sk-circle"></div>
              <div className="sk-circle4 sk-circle"></div>
              <div className="sk-circle5 sk-circle"></div>
              <div className="sk-circle6 sk-circle"></div>
              <div className="sk-circle7 sk-circle"></div>
              <div className="sk-circle8 sk-circle"></div>
              <div className="sk-circle9 sk-circle"></div>
              <div className="sk-circle10 sk-circle"></div>
              <div className="sk-circle11 sk-circle"></div>
              <div className="sk-circle12 sk-circle"></div>
            </div>  
          </div>
        )
    }
}

export default Loading