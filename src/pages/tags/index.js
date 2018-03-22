import React, { Component } from 'react';

import Link from 'gatsby-link';
import moment from 'moment';

import Tag from '../../components/Tag';

const splitTag = (raw = '') => raw.split(', ');

const parseDate = date => moment(date).locale('zh-hk').format('YYYY/MM/DD');

const getTag = (item) => {
  const { tags, url, createdDate } = item.node;

  if (tags) {
    const date = parseDate(createdDate);
    const postPath = url === 'about' ? url : `${date}/${url}`;
    return {
      tags: splitTag(item.node.tags),
      title: item.node.title,
      url: postPath,
      createdDate,
    };
  }
  return item;
};

const Item = ({ url = '', title = '', createdDate = '' }) => (
  <li key={title}>
    <Link href={url} to={url}>
      {title} ({parseDate(createdDate)})
    </Link>
  </li>
);

const TagSession = ({ tag = 'tag', articles = [], url = '' }) => (
  <div className="row" id={tag}>
    <div className="col">
      <h3>{tag}:</h3>
      <ol>
        {articles.map(article => (
          <Item
            url={article.url}
            title={article.title}
            createdDate={article.createdDate}
          />
        ))}
      </ol>
    </div>
  </div>
);

class TagPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tags: {},
    };
  }

  componentWillMount() {
    const tags = {};
    const { edges } = this.props.data.tags;
    const temp = edges.map(item => getTag(item));

    // debugger;
    temp.forEach((x) => {
      const { title, url, createdDate } = x;

      for (let i = 0, n = x.tags.length; i < n; i += 1) {
        const item = { title, url, createdDate };
        if (tags[x.tags[i]]) {
          tags[x.tags[i]].push(item);
        } else {
          tags[x.tags[i]] = [item];
        }
      }
    });
    this.setState({ tags });
  }

  render() {
    const tags = Object.keys(this.state.tags).sort();

    return (
      <div className="container">
        <div className="row">
          <div className="col">
            <h2>Tags</h2>
          </div>
        </div>

        <div className="row">
          <div className="col">
            {tags.map(item => (
              <Tag
                name={item}
                count={this.state.tags[item].length}
                key={item}
              />))
            }
          </div>
        </div>

        {tags.map(tag => (
          <TagSession
            tag={tag}
            articles={this.state.tags[tag].filter((v, i, a) => a.indexOf(v) === i)}
            key={tag}
          />
          ))}
      </div>
    );
  }
}

export const pageQuery = graphql`
query myTags {
  tags: allContentfulMarkdown {
    edges {
      node {
        tags
        title
        url
        createdDate
      }
    }
  }
}
`;

export default TagPage;
