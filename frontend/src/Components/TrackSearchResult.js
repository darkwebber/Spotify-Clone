import React from 'react';
const TrackSearchResult = ({track, chooseTrack})=>{
    const handlePlay = ()=>{
        chooseTrack(track);
    };
    return (
        <div className='d-flex m-2 align-items-center ' style={{cursor:"pointer"}} onClick={handlePlay}>
            <img src={track.Albumuri} style={{height:"64px",width:"64px"}}/>
            <div className='mx-3'>
                <div>{track.title}</div>
                <div className='text-muted'>{track.artists[0]}</div>
            </div>
            
        </div>
    );

};
export default TrackSearchResult;