import React from 'react'
import { useSelector } from "react-redux";
import CodeEditor from './CodeEditor';
const CodingPlatform = () => {

    const userData = useSelector((state) => state.userData);
    console.log(userData.enrollmentNo)
  return (
    <>
    <div>CodingPlatform</div>

    <CodeEditor/>
    </>
    
  )
}

export default CodingPlatform