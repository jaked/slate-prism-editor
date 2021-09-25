import './App.css';
import React, { useEffect } from 'react';
import Prism from 'prismjs'
import { Segment, Header, Container } from 'semantic-ui-react'
import LiquidEditor from './LiquidEditor.jsx'

function App() {
  useEffect(() => {
    Prism.highlightAll()
  }, [])

  return (
    <div>
      <Segment inverted>
        <Container textAlign='center'>
          <Header
            as='h1'
            inverted
            color='grey'
          >
            Slate + PrismJS (POC)
          </Header>
        </Container>
      </Segment>

      <Container className="App">
        <LiquidEditor />

        <Segment>
          <pre className='line-numbers'>
            <code className="language-liquid">
              {`
                {% assign verb = "turned" %}
              `}
            </code>
          </pre>
        </Segment>

        <pre>
          <code className="language-css">{`
            .btn--green { background-color: #bada55; }
            `}
          </code>
        </pre>

        <pre>
          <code className="language-javascript">{`
            var hello = 'maria'
            var hi = { hey: 'this' }
            `}
          </code>
        </pre>

        <pre className='line-numbers'>
          <code className="language-liquid">{`
          {% assign verb = "turned" %}
          {% comment %}
          {% assign verb = "converted" %}
          {% endcomment %}
          Anything you put between {% comment %} and {% endcomment %} tags
          is {{ verb }} into a comment.
          `}</code>
        </pre>
      </Container>
    </div>
  )
}

export default App
