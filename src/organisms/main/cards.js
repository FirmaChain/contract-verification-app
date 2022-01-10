import React, { useState } from 'react'
import { IMG_SCAN, IMG_UPLOAD, IMG_VERIFYING } from 'constants/images'
import { CardBox, CardContainer, CardDesc, CardImg } from './styles'

export default function Cards() {
    const [focused, setFocused] = useState(-1);

    const cards = [
        {title: "1. UPLOAD", img: IMG_UPLOAD},
        {title: "2. CHECKING", img: IMG_SCAN},
        {title: "3. VERIFYING", img: IMG_VERIFYING}
    ]

    const handleFocused = (index) => {
        setFocused(index);
    }

    return (
        <CardContainer>
        {cards.map((item, index) => {
            return (
                <CardBox 
                    key={index} 
                    focused={focused === index} 
                    onMouseEnter={() => handleFocused(index)}
                    onMouseLeave={() => setFocused(-1)}>
                    <CardImg src={item.img} alt={item.title} />
                    <CardDesc>{item.title}</CardDesc>
                </CardBox>
            )
        })}
        </CardContainer>
    )
}
