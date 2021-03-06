import React, { Component } from 'react';

export default function(resolve, opts = {}) {
  const {
    loading: LoadingComponent = () => null,
    callback = () => null,
  } = opts;

  return class DynamicComponent extends Component {
    constructor(...args) {
      super(...args);
      this.LoadingComponent = LoadingComponent;
      this.state = {
        AsyncComponent: null,
      };
      this.load();
    }

    componentDidMount() {
      this.mounted = true;
    }

    componentWillUnmount() {
      this.mounted = false;
    }

    load() {
      resolve()
        .then(m => {
          const AsyncComponent = m.default || m;
          if (this.mounted) {
            this.setState({ AsyncComponent }, () => {
              callback();
            });
          } else {
            this.state.AsyncComponent = AsyncComponent; // eslint-disable-line
          }
        })
        .catch(err => {
          callback(err);
        });
    }

    render() {
      const { AsyncComponent } = this.state;
      const { LoadingComponent } = this;
      if (AsyncComponent) return <AsyncComponent {...this.props} />;

      return <LoadingComponent {...this.props} />;
    }
  };
}
