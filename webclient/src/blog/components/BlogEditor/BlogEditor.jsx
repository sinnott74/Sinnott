import React from 'react';
import PropTypes from 'prop-types';
import TextField from 'react-md/lib/TextFields/TextField';
import Tab from 'react-md/lib/Tabs/Tab';
import Tabs from 'react-md/lib/Tabs/Tabs';
import TabsContainer from 'react-md/lib/Tabs/TabsContainer';
import SubmitButton from 'core/components/SubmitButton';
import './BlogEditor.css';
import ViewBlogPost from '../ViewBlogPost/ViewBlogPost';

export default class BlogEditor extends React.Component {

  constructor(props) {
    super();

    this.state = {
      blogpost: {
        ...props.blogpost
      }
    }

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      blogpost: {
        ...nextProps.blogpost,
        ...this.state.blogpost
      }
    })
  }

  handleSubmit(e) {
    e.preventDefault();
    // const { username, password } = this.state;
    // if (username && password) {
    //    this.props.handleLogin(username, password);
    // }


    console.log('handle save now')
    this.props.handleSave(this.state.blogpost);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit} className='blogeditor__form'>
        <TabsContainer panelClassName="md-grid" colored style={{width: '100%'}}>
          <Tabs tabId="edit">
            <Tab label="Editor">
                <TextField
                  type='text'
                  name='title'
                  label='Title'
                  required
                  value={this.state.blogpost.title}
                  autoComplete=''
                  maxLength={255}
                  onChange={(title, e) => {
                    this.setState({
                      blogpost: {
                        ...this.state.blogpost,
                        title
                      }
                    });
                  }}
                />
                <TextField
                  type='text'
                  name='text'
                  label='Text'
                  required
                  rows={1}
                  value={this.state.blogpost.text}
                  onChange={(text, e) => {
                    this.setState({
                      blogpost: {
                        ...this.state.blogpost,
                        text
                      }
                    });
                  }}
                />
              </Tab>
              <Tab label="preview">
              <ViewBlogPost title={this.state.blogpost.title} text={this.state.blogpost.text} author={""} date={""} />
              </Tab>
            </Tabs>
          </TabsContainer>
          <SubmitButton isSubmitting={this.props.isSubmitting}>Save</SubmitButton>
        </form>
    );
  }
}

BlogEditor.propTypes = {
  handleSave: PropTypes.func.isRequired
}