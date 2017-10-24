import React from 'react';
import ReactDOM from 'react-dom';
import FacebookLogin from 'react-facebook-login';
import $ from 'jquery';

class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      user: null,
      loading: false
    }
  }

  responseFacebook(response){
    $.ajax({
      url: '/login',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(response),
      success: resp => {
        this.setState({
          user: JSON.parse(resp),
          loading: true
        });
        this.requestPairToRate.bind(this)();
      }
    });
    console.log(response);
  }

  requestPairToRate(){
    $.ajax({
      url: '/requestPair',
      success: response => {
        const resp = JSON.parse(response);
        this.setState({
          politicianOne: resp.politicianOne,
          politicianTwo: resp.politicianTwo,
          category: resp.category,
          loading: false
        })
      }
    })
  }

  promptLogin(){
    return(
      <div>
        <h1>Welcome to the Alaska Politician Rater!</h1>
        <h2>Please login to play.</h2>
        <FacebookLogin
          appId="160755601178277"
          autoLoad={true}
          fields="name,email,picture"
          callback={this.responseFacebook.bind(this)}
        />
      </div>
    )
  }

  showRater(){
    if(!this.state.loading){
      return (
        <div>
          <p>Hey, {this.state.user.name}</p>
          <h1>Who is {this.state.category.title}?</h1>
          <h2>{this.state.politicianOne.name}</h2>
          <div className="thumbnail">
            <img src={`${this.state.politicianOne.image_url}`} />
          </div>
          <h1>OR</h1>
          <h2>{this.state.politicianTwo.name}</h2>
          <div className="thumbnail">
            <img src={`${this.state.politicianTwo.image_url}`} />
          </div>
        </div>
      )
    } else {
      return (
        <div>
          <img src="/static/spinner.gif" />
          <h3>Loading your politicians</h3>
        </div>
      )
    }

  }

  render(){
    return (
      <div id="container">
        <div id="content">
          <div className="row">
              <div className="col-md-2"></div>
              <div className="col-md-8" id="ratings"
                style={{
                  marginBottom: '5px',
                  borderStyle: 'solid',
                  borderRadius: '5px',
                  backgroundColor: 'rgba(159,159,159, 0.85)'
                }}
              >
              {this.state.user ? this.showRater.bind(this)() : this.promptLogin()}
              </div>
              <div className="col-md-2"></div>
          </div>
        </div>
      </div>
    )
  }
}


ReactDOM.render(
  <App/>,
  document.getElementById('react-root')
);
