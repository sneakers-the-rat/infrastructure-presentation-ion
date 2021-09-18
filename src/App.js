import React from 'react';
import {MDXProvider} from '@mdx-js/react';
import {
  Box,
  Deck,
  FlexBox,
  FullScreen,
  mdxComponentMap,
  Notes,
  Progress,
  Slide,
} from 'spectacle';
import HideSlide from './components/hideslide';

import {ThemeProvider} from '@material-ui/core';
import styled from '@material-ui/styles/styled/styled'

import TOC from './components/toc'

import slides_intro, {notes as notes_intro} from './slides/0_intro.mdx';
import slides_p2p, {notes as notes_p2p} from './slides/1_data.mdx';
import slides_tools, {notes as notes_tools} from './slides/2_tools.mdx';
import slides_knowledge, {notes as notes_knowledge} from './slides/3_knowledge.mdx';
import slides_conclusion, {notes as notes_conclusion} from './slides/4_conclusion.mdx';
import {material_theme, spectacle_theme, useMuiStyles} from './theme';

const StyledNotes = styled(Notes)({
  color: 'background'
})

let all_slides = [
  slides_intro,
  slides_p2p,
  slides_tools,
  slides_knowledge,
  slides_conclusion
]

let all_notes = [
  notes_intro,
  notes_p2p,
  notes_tools,
  notes_knowledge,
  notes_conclusion
]

const toc_slides = [
  {
    name: 'intro',
    display: 'Introduction',
    slides: slides_intro,
    notes: notes_intro
  },
  {
    name: 'data',
    display: 'Shared Data',
    slides: slides_p2p,
    notes: notes_p2p
  },
  {
    name: 'tools',
    display: 'Shared Tools',
    slides: slides_tools,
    notes: notes_tools
  },
  // {
  //   name: 'knowledge',
  //   display: 'Shared Knowledge',
  //   slides: slides_knowledge,
  //   notes: notes_knowledge
  // },
  // {
  //   name: 'outro',
  //   display: 'Outro',
  //   slides: slides_conclusion,
  //   notes: notes_conclusion
  // },
]

const toc_slides_flat = Array.prototype.concat(...toc_slides.map((slide_group) => (
    slide_group.slides.map((slide, idx) => ({slide:slide, group:slide_group.name, notes:slide_group.notes[idx]}))
)))

console.log(toc_slides_flat)

const transition = [
  {display:'none'},
  {display:'unset'},
  {display:'none'}
]

let slide_num = 0;
export const template = () => (
    <FlexBox
        justifyContent="space-between"
        flexDirection="column"
        position="absolute"
        left={0}
        height={1}
        // bottom={0}
        // width={1}
    >

      <TOC slides={toc_slides_flat}/>
      <Box padding="1em 0">
        <FullScreen style={{marginLeft:0, marginRight:0}}/>
      </Box>
      {/*<Box><Progress zIndex={3} color={"#000000"}/></Box>*/}
    </FlexBox>
);

function Presentation(){
  // iterate through slides here.
  // MDXSlide elements should have exported
  // variables as props (or at least
  // MDXCreateElement does in the debugger)
  const classes = useMuiStyles();

  return(
  <MDXProvider components={mdxComponentMap}>
    <ThemeProvider theme={material_theme}>
    <Deck theme={spectacle_theme} template={template}>
      {/*{all_slides.map((slides, j) =>*/}
      {/*    slides.map((MDXSlide, i) => [MDXSlide, all_notes[j][i]]).*/}
      {/*        map(([MDXSlide, MDXNote], i) => (*/}
      {/*              <HideSlide*/}
      {/*                  key={`slide-${j}-${i}`}*/}
      {/*                  slideNum={i}*/}
      {/*                  backgroundColor={'background'}*/}
      {/*                  bufferSlides={2}*/}
      {/*              >*/}
      {/*                <MDXSlide/>*/}
      {/*                <Notes>*/}
      {/*                  <MDXNote/>*/}
      {/*                </Notes>*/}
      {/*              </HideSlide>*/}
      {/*        ))*/}
      {/*)}*/}
      {toc_slides_flat.map((slide, i) =>
          // slides.map((MDXSlide, i) => [MDXSlide, all_notes[j][i]]).
          //     map(([MDXSlide, MDXNote], i) => (

          <HideSlide
            key={`slide-${i}`}
            slideNum={i}
            backgroundColor={'background'}
            bufferSlides={2}
            transition={transition}
          >
            <slide.slide key={`innerslide-${i}`}/>
            <StyledNotes color={"background"}>
              <div className={"notes-style-container"}>
                <slide.notes  color={"background"} />
              </div>
            </StyledNotes>
          </HideSlide>

      )}
    </Deck>
    </ThemeProvider>
  </MDXProvider>)
}

export default Presentation
//
