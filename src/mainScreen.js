import React, { useState } from 'react';
import { Grommet } from 'grommet';
import { Box, Grid, Container, Typography, CssBaseline, Avatar, Button, Input, TextField } from '@mui/material';

import Logo from './logo';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import { detectChords } from "/home/rserravi/Documentos/Javascript/chord-recognition/src/akkorder-main/src/main"

export const Main = () =>{

    
    const hiddenFileInput = React.useRef(null);
    const [audioFile, setAudioFile] = useState();
    const [fileName, setFileName] = useState("");
    var audioContext = null;
    

    const theme = {
        global: {
          font: {
            family: 'Roboto',
            size: '14px',
            height: '20px',
          },
        },
      };

    const handleFileChange = (event)=>{
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        audioContext = new AudioContext();
        event.target.files[0].arrayBuffer().then((song)=>{

            audioCtx.decodeAudioData( song, (buffer) => {
                console.log(buffer)
                setFileName(event.target.files[0].name)
                let rest = detectChords(buffer, buffer.sampleRate)
                rest.chords.map((chord) => {
                    return (console.log(chord));
                });
                console.log(rest.cromas);

              }, function(){alert("error loading!");} ); 
    
        })
    }



    return (
        <Grommet theme={theme}>
             <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                    >
                    <Logo />
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <AudiotrackIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Select a track from disk
                    </Typography>

                    <Grid
                        container
                        direction="column"
                        justifyContent="center"
                        alignItems="center"
                        >
                            <Box sx={{ '& > :not(style)': { m: 1 } }}>
                           
                            <TextField variant='standard' value={fileName}>
                            </TextField>
                             <Button variant="contained" component="label">
                                Upload
                               
                                <Input accept="image/*" id="upload-button" type="file" style={{display: 'none'}} ref={hiddenFileInput} onChange={handleFileChange}/> 
                            </Button>

                        </Box>
                    </Grid>   
                </Box>
            </Container>
        </Grommet>
    )
}