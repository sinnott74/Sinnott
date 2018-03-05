import React from "react";
import PropTypes from "prop-types";
import marked from "marked";
import Link from "core/components/Link";
import Button from "react-md/lib/Buttons/Button";
import Card from "core/components/Card";
import "./ViewBlogPost.css";

export default class ViewBlogPost extends React.Component {
  componentDidMount() {}

  render() {
    const authorName = this.props.author ? this.props.author.fullname : "";

    return (
      <Card className="blogpost">
        <h1 className="blogpost__title">{this.props.title}</h1>
        {this.props.author && (
          <div className="blogpost__subtitle">{`${
            this.props.date
          } by ${authorName}`}</div>
        )}
        <div
          className="blogpost__text"
          dangerouslySetInnerHTML={this.rawMarkup()}
        />
        {this.props.showActions && this.getActions()}
      </Card>
    );
  }

  rawMarkup() {
    if (this.props.text) {
      let rawMarkup = marked(this.props.text, {
        sanitize: true,
        breaks: true,
        gfm: true,
        tables: true
      });
      return { __html: rawMarkup };
    }
  }

  getActions() {
    // logged in user = blog post owner
    if (this.props.user_id && this.props.auth_id === this.props.user_id) {
      return (
        <div className="blogpost_actions">
          <Link to={`/blog/${this.props.id}/edit`}>
            <Button raised={true} secondary>
              Delete
            </Button>
          </Link>
          <Link to={`/blog/${this.props.id}/edit`}>
            <Button raised={true} primary>
              Edit
            </Button>
          </Link>
        </div>
      );
    }
  }
}

ViewBlogPost.PropTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  author: PropTypes.shape({
    fullname: PropTypes.string.isRequired
  }),
  user_id: PropTypes.string.isRequired,
  auth_id: PropTypes.string.isRequired,
  fetchData: PropTypes.func.isRequired,
  showActions: PropTypes.bool
};
