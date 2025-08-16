import React, { useState, useEffect } from "react";
import styled from "styled-components";

const Carousel = ({ slides }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === slides.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [slides.length]);



  return (
    <CarouselContainer>
      <CarouselInner style={{ transform: `translateX(-${currentIndex * 100}%)` }}>

        {slides.map((slide, index) => (
          <CarouselItem key={index}>
            {/* <Text>{slide.text}</Text> */}
            <img src={slide.image} alt={`Slide ${index + 1}`} />
          </CarouselItem>
        ))}

      </CarouselInner>
      {/* <CarouselControls>
        <button onClick={prevSlide}>Prev</button>
        <button onClick={nextSlide}>Next</button>
      </CarouselControls> */}
    </CarouselContainer>
  );
};

const CarouselContainer = styled.div`
  width: 90%;
  max-width: 800px;
  overflow: hidden;
  position: relative;
  margin: auto;
`;

const CarouselInner = styled.div`
  display: flex;
  transition: transform 0.5s ease;
`;

const CarouselItem = styled.div`
  min-width: 100%;
  box-sizing: border-box;
  position: relative;
  transition: transform 0.5s ease;

  img {
    width: 100%;
    display: block;
  }
`;

const Text = styled.p`
  position: absolute;
  
  left: 50%;
  transform: translateX(-50%);
  color: white;
  font-size: 20px;
  padding: 5px 10px;
  border-radius: 5px;
  margin: 0;
`;


const CarouselControls = styled.div`
  position: absolute;
  top: 50%;
  width: 100%;
  display: flex;
  justify-content: space-between;
  transform: translateY(-50%);

  button {
    background-color: rgba(0, 0, 0, 0.5);
    border: none;
    color: white;
    padding: 10px;
    cursor: pointer;
  }

  button:focus {
    outline: none;
  }
`;

export default Carousel;