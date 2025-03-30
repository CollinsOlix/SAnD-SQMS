import React, { useState } from 'react';
import './styles/OnlineServiceC.css';
import Plus from './images/plus.png';

function Select() {
    return (
        <select className='select' style={{ padding: "10px", fontSize: "20px" }} >
            <option value="someOption" style={{ margin: "50px", padding: "20px" }}><b>Branch</b></option>
        </select>
    );
}

function Box() {
    return (
        <div className='box-container' >
            <label style={{ fontSize: "20px", marginTop: "-50px" }}>Operation</label>
            <br />
            <div style={{ marginTop: "-10px", fontSize: "100px" }}><b>00</b></div>
            <br />
            <img
                src={Plus}
                alt='add'
                style={{ marginTop: '-25px', }}
            />
            <br />
            <button >Get a Tiket</button>
        </div >

    );
}
const App = () => {
    return (
        <div className='app'>

            <div style={{ marginleft: "150px", color: "white" }}><h1 >SAnD's Smart Queue Management System</h1></div>
            <Select />
            <div style={{ display: 'flex' }}>
                <div className='osc-box'><Box /></div>
                <div className='osc-box'><Box /></div>
                <div className='osc-box'><Box /></div>
                <div className='osc-box'><Box /></div>
            </div>
        </div>
    );
};

export default App;