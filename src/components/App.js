import React from 'react';

import Header from './Header';
import Footer from './Footer';
import Message from './Message';

const App = () => <React.Fragment>
  <Header/>
  <Message heading="React App">
    <p>Placeholder app content</p>
  </Message>
  <Footer/>
</React.Fragment>;

export default App;
