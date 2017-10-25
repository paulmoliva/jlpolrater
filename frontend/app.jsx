import React from 'react';
import ReactDOM from 'react-dom';
import FacebookLogin from 'react-facebook-login';
import $ from 'jquery';

class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      user: null,
      loading: false,
      results: false
    }
  }

  componentDidMount(){
    $.ajax({
      url: rootEndpoint + '/categories',
      success: resp => {
        this.setState({
          categories: JSON.parse(resp)
        })
      }
    })
  }

  responseFacebook(response){
    $.ajax({
      url: rootEndpoint + '/login',
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
      url: rootEndpoint + '/requestPair',
      success: response => {
        const resp = JSON.parse(response);
        this.setState({
          politicianOne: resp.politicianOne,
          politicianTwo: resp.politicianTwo,
          category: resp.category,
          shownCategory: 1,
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

  makeRating(rating){
    $.ajax({
      url: rootEndpoint + '/rating',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(rating)
    });
    this.setState({
      loading: true
    });
    this.requestPairToRate();
  }

  showRater(){
    if(this.state.results && !this.state.loading){
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <h2>
            <a href="#" onClick={() => {
              this.setState({results: false, loading: true});
              this.requestPairToRate();
            }}>Rate more legislators
            </a>
          </h2>
          <select
                  value={Number(this.state.shownCategory)}
                  onChange={e => {
                    const categoryID = e.target.value;
                    this.setState({
                      loading: true
                    });
                    $.ajax({
                      url: rootEndpoint + 'scores/' + categoryID,
                      success: resp => {
                        this.setState({
                          scores: JSON.parse(resp),
                          shownCategory: categoryID,
                          loading: false
                        })
                      }
                    });
                  }}
          >
            {this.state.categories.map( el => {
              return <option value={el.id}>Alaska's {el.superlative} legislators</option>
            })}
          </select>
          <ol>
            {this.state.scores.map( el => {
              return <li>{el.name}</li>
            })}
          </ol>
        </div>
      )
    }
    if(!this.state.loading && !this.state.results){
      return (
        <div>
          <h2>
            <a href="#" onClick={() => {
              this.setState({results: true, loading: true});
              $.ajax({
                url: rootEndpoint + 'scores/' + this.state.categories[0].id,
                success: resp => {
                  this.setState({
                    scores: JSON.parse(resp),
                    loading: false
                  })
                }
              });
              }}>See results
            </a>
          </h2>
          <h1>Who is {this.state.category.title}?</h1>
          <p>(Click photo to choose)</p>
          <h2>{this.state.politicianOne.name}</h2>
          <div>
            <img
              style={{cursor: 'pointer'}}
              onClick={
                () => {
                  this.makeRating.bind(this)({
                    winner: this.state.politicianOne,
                    loser: this.state.politicianTwo,
                    category: this.state.category,
                    user: this.state.user
                  })
                }
              }
              src={`${this.state.politicianOne.image_url}`} />
          </div>
          <h1>OR</h1>
          <h2>{this.state.politicianTwo.name}</h2>
          <div>
            <img
              style={{cursor: 'pointer'}}
              onClick={
                () => {
                  this.makeRating.bind(this)({
                    winner: this.state.politicianTwo,
                    loser: this.state.politicianOne,
                    category: this.state.category,
                    user: this.state.user
                  })
                }
              }
              src={`${this.state.politicianTwo.image_url}`} />
          </div>
        </div>
      )
    } else {
      return (
        <div>
          <img src="/static/spinner.gif" />
          <h3>Loading</h3>
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
                  backgroundColor: 'rgba(159,159,159, 0.85)',
                  padding: '7px'
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

const rootEndpoint = 'http://http://jlpolrater.y3rqmziwcg.us-west-2.elasticbeanstalk.com';
