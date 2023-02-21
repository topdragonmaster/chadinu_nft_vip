import React, { useState } from 'react';
import CopyToClipboard from "@vigosan/react-copy-to-clipboard";
import { AiOutlineCopy } from "react-icons/ai";
import { AiFillCopy } from "react-icons/ai";
import "./CopyClipboard.css";

const CopyClipboard = (props) => {
    const [copied, setCopied] = useState(false);
    const [tooltipText, setTooltipText] = useState("Copy Link");

    return (
      <CopyToClipboard
        onCopy={({ success, text }) => {
          var msg = success ? "Copied!" : "Whoops, not copied!";
          setTooltipText("Copied");
          setCopied(true);
        }}
        options={{format: 'text/plain'}}
        render={({ copy }) => (
            <div
             className='tooltip'
              style={{
                border: "none",
                borderRadius: " 18px",
                backgroundColor: "white",
                width: "37px",
                height: "37px",
                marginTop: "-14px"
              }}
              onClick={() => copy(props.text)}
              onMouseEnter={() => {setTooltipText("Copy link");}}
              onMouseLeave={() => {setCopied(false)}}
            >
              <div className='copy-button'>
                {copied ? <AiFillCopy size={24}/> : <AiOutlineCopy size={24}/>}
              </div>
              <span className='tooltiptext'>{tooltipText}</span>
            </div>
        )}
      />
    );
}

export default CopyClipboard;
