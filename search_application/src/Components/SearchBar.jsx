import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useThrottle } from "../utils/throttle";

const SearchBarWrapper = styled.div`
  position: relative;
  border: 1px solid black;
  border-radius: 20px;
  display: flex;
  flex-direction: row;
  padding: 10px;
  border-bottom-right-radius: ${({ results }) => (results ? `0px` : `20px`)};
  border-bottom-left-radius: ${({ results }) => (results ? `0px` : `20px`)};
  border-bottom-color: ${({ results }) => (results ? `transparent` : `black`)};
`;

// const IconImage = styled.img`
//   height: 20px;
//   padding-right: 20px;
// `;

const Input = styled.input`
  border: none;
  outline: none;
  flex: 50%;
`;

const RightSide = styled.div`
  display: flex;
  flex: 0 0 auto;
  padding-right: 10px;
`;

const Spinner = styled.div`
  border: 2px solid gray;
  border-top: 2px solid blue;
  border-radius: 50%;
  width: 15px;
  height: 15px;
  animation: spin 1s linear infinite;
  margin-left: 15px;
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const Suggestions = styled.div`
  display: ${(props) => (props.len ? "flex" : "none")};
  flex-direction: column;
  flex: 0 0 auto;
  max-height: 150px;
  overflow: scroll;
  border-bottom-right-radius: 20px;
  border-bottom-left-radius: 20px;
  border: 1px solid black;
  & * {
    border: 1px solid black;
    border-top-color: transparent;
    border-bottom-color: transparent;
    flex: 1;
    padding: 5px;
    text-align: left;
    padding-left: 30px;
  }
  & :last-child {
    border-top-color: transparent;
  }
  & :nth-child(${({ active }) => active}) {
    background: gray;
    color: white;
    font-weight: bold;
  }
  & :nth-child(5 + ${({ limit }) => limit}) {
    display: none;
  }
`;

export default function SearchBar({
  value,
  suggestions,
  onChange,
  loading,
  setLoading
}) {
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const throttledVal = useThrottle(q, 1000);
  const handleInputChange = (e) => {
    setQ(e.target.value);
    setLoading(true);
  };

  useEffect(() => {
    onChange(throttledVal);
  }, [throttledVal, onChange]);

  const clearQuery = () => {
    setQ("");
    if (loading) setLoading(false);
  };

  const res = ["item 1", "item 2", "item 3", "item 4", "item 5"];

  const handleChangeActiveSuggestions = (e) => {
    console.log(e.keyCode, active);
    console.log(e.target.scrollHeight);
    e.target.scrollTo(0, 400);
    switch (e.keyCode) {
      case 40: {
        if (active >= active + 5) {
          setActive(1);
        } else {
          setActive((prev) => prev + 1);
        }
        return;
      }
      case 38: {
        if (active === 1) {
          setActive(0);
        } else if (active <= 0) {
          setActive(suggestions.length);
        } else {
          setActive((prev) => prev - 1);
        }
        return;
      }
      case 13: {
        // onEnter( active-1 )
        break;
      }
      default: {
        setActive(0);
        return;
      }
    }
  };

  return (
    <>
      <SearchBarWrapper
        onKeyUp={handleChangeActiveSuggestions}
        results={suggestions.length !== 0 && loading}
      >
        {/* <IconImage
          src="https://image.flaticon.com/icons/png/512/49/49116.png"
          alt="icon"
        /> */}
        <Input value={q} onChange={handleInputChange} />
        <RightSide>
          {q && <div onClick={clearQuery}>X</div>}
          {loading && <Spinner />}
        </RightSide>
      </SearchBarWrapper>
      {!loading && (
        <Suggestions active={active} limit={5} len={suggestions.length}>
          {suggestions.map((item, index) => (
            <div key={index} onMouseOver={() => setActive(index + 1)}>
              {item}
            </div>
          ))}
        </Suggestions>
      )}
    </>
  );
}
