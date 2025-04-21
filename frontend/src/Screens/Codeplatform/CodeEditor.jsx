import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import { ClipLoader } from 'react-spinners'; // Import the spinner component

function CodeEditor() {
  const [code, setCode] = useState(`#include <iostream>
using namespace std;

int main() {

    cout << "Hello, World!"<<endl;
int a,b;

cin>>a>>b;

cout<<a+b;

    return 0;
}`);
  const [inputs, setInputs] = useState(""); // State for user inputs
  const [consoleOutput, setConsoleOutput] = useState('');
  const [loading, setLoading] = useState(false); // Loading state for the spinner

  const handleEditorChange = (value) => {
    setCode(value);
  };

  const handleInputChange = (event) => {
    setInputs(event.target.value); // Update inputs state
  };

  const runCode = () => {
    setLoading(true); // Show spinner
    const payload = {
      code: code,
      inputs: inputs.split("\n"), // Convert multiline input into an array
    };

    axios.post('http://localhost:4000/run', payload)
      .then((response) => {
        setConsoleOutput(response.data.output);
      })
      .catch((error) => {
        setConsoleOutput(`Error: ${error.message}`);
      })
      .finally(() => {
        setLoading(false); // Hide spinner after response/error
      });
  };

  return (
    <div>
      <Editor
        height="300px"
        theme="vs-dark"
        defaultLanguage="cpp"
        value={code}
        onChange={handleEditorChange}
      />
      <textarea
        placeholder="Enter input for the program (one per line)"
        value={inputs}
        onChange={handleInputChange}
        style={{
          width: '100%',
          height: '100px',
          marginTop: '10px',
          fontSize: '16px',
          padding: '10px',
          borderRadius: '5px',
        }}
        className='bg-black text-white'
      ></textarea>
      <button
        onClick={runCode}
        style={{
          backgroundColor: '#007bff',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginTop: '10px',
        }}
        disabled={loading} // Disable button while loading
      >
        Run Code
      </button>

      {/* Spinner */}
      <div style={{ marginTop: '10px' }}>
        <ClipLoader color="#007bff" loading={loading} size={35} />
      </div>

      <div
        style={{
          backgroundColor: '#1e1e1e',
          color: 'white',
          marginTop: '20px',
          padding: '10px',
          borderRadius: '5px',
          minHeight: '100px',
          fontFamily: 'monospace',
          whiteSpace: 'pre-wrap',
        }}
      >
        {consoleOutput}
      </div>
    </div>
  );
}

export default CodeEditor;
