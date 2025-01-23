// import { createContext, useState } from "react";
// import run from "../Config/gemini";
// import { useActionState } from "react";

// export const Context = createContext();

// const ContextProvider = (props) => {

//     const [input, setInput] = useState("");
//     const [recentPrompt, setRecentPrompt] = useState("");
//     const [prevPrompts, setPrevPrompts] = useState([]);
//     const [showResult, setShowResult] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const [resultData, setResultData] = useState("");

//    const delayPara = (index,nextWord) =>{
//     setTimeout(function (){
//         setResultData(prev=>prev+nextWord);
//     },75*index)

//    }
//    const newChat = () =>{
//     setLoading(false)
//     setShowResult(false)
//    }

//     const onSent = async (prompt) => {

//         setResultData("")
//         setLoading(true)
//         setShowResult(true)
//         let response;
//         if (prompt !== undefined) {
//             response = await run(prompt);
//             setRecentPrompt(prompt)
//         }
//         else
//         {
//             setPrevPrompts(prev=>[...prev,input])
//             setRecentPrompt(input)
//             response = await run(input)
//         }

//         let responseArray = response.split("**");
//         let newResponse = "" ;
//         for(let i = 0; i < responseArray.length; i++){
//             if(i === 0 || i%2 !== 1) {
//                 newResponse += responseArray[i];
//             }
//             else{
//                 newResponse += "<b>"+responseArray[i]+"</b>"
//             }
//         }
//         let newResponse2 = newResponse.split("*").join("</br>")
//         let newResponseArray = newResponse2.split("");
//         for(let i = 0 ; i < newResponseArray.length; i++)
//         {
//             const nextWord = newResponseArray[i];
//             delayPara(i,nextWord + " ")
//         }
//         setLoading(false)
//         setInput("")
//     }

//     onSent("what is react js")

//     const ContextValue = {
//         prevPrompts,
//         setPrevPrompts,
//         onSent,
//         setRecentPrompt,
//         recentPrompt,
//         showResult,
//         loading,
//         resultData,
//         input,
//         setInput,
//         newChat
//     }

//     return(
//         <Context.Provider value={ContextValue}>
//             {props.children}
//         </Context.Provider>
//     )
// }

// export default ContextProvider;

import { createContext, useState } from "react";
import run from "../Config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");

  const delayPara = async (index, nextWord) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setResultData((prev) => prev + nextWord);
        resolve();
      }, 75 * index); // Control the delay timing here
    });
  };

  const onSent = async (prompt) => {
    try {
      setLoading(true);
      setResultData(""); // Clear previous result
      setShowResult(true);

      let response;
      if (prompt) {
        response = await run(prompt);
        setRecentPrompt(prompt);
      } else {
        setPrevPrompts((prev) => [...prev, input]);
        setRecentPrompt(input);
        response = await run(input);
      }

      // Log the response to debug
      console.log("Raw Response:", response);

      // Format the response
      const formattedResponse = response
        .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>") // Replace **bold** with <b>bold</b>
        .replace(/\n/g, "<br />"); // Replace new lines with <br />

      console.log("Formatted Response:", formattedResponse);

      setResultData(formattedResponse); // Set the formatted result
    } catch (error) {
      console.error("Error in onSent:", error.message);
      setResultData("An error occurred. Please try again.");
    } finally {
      setLoading(false);
      setInput(""); // Clear input
    }
  };

  const newChat = () => {
    setInput("");
    setResultData("");
    setShowResult(false);
    setPrevPrompts([]);
  };

  const ContextValue = {
    prevPrompts,
    setPrevPrompts,
    onSent,
    setRecentPrompt,
    recentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
    newChat,
  };

  return (
    <Context.Provider value={ContextValue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;
