import React, { useState } from 'react';
import '../styles/localservice.css';
import { QRCodeSVG } from "qrcode.react";



function Select() {
    return (
        <select className='select' style={{ padding: "10px", fontSize: "20px" }} >
            <option value="someOption" style={{ margin: "50px", padding: "20px" }}><b>Branch</b></option>
        </select>
    );
}

function Box() {
    const [url, setUrl] = useState('')
    const [qrcode, setQrcode] = useState('')

    const GenerateQRCode = () => {
        QRCodeSVG.toDataURL(url, (err, url) => {
            if (err) return console.error(err)

            console.log(url)
            setQrcode(url)
        })
    }
    return (
        <div className='box-container' >
            <label style={{ fontSize: "20px", marginTop: "-100px" }}>Operation</label>
            <br />
            <div style={{ marginTop: "-10px", fontSize: "100px" }}><b>00</b></div>
            <br />
            < QRCodeSVG
                value="https://example.com"
                style={{ marginTop: '-40px', width: '100px', height: '100px' }} />
            <br />
            <p style={{ marginTop: '10px', fontSize: "12px" }}><b>Scan the qrCode to join the queue</b></p>
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