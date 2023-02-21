import React from 'react';
import "./BlackUserPage.css";

function BlackUserPage() {
    return (
        <div className='blackuser-text'>
            <p>INVALID REQUEST</p>
            <h2>
                This action could not be completed. Please contact<br />
                <span style={{ fontWeight: "bold" }}>team@chadinu.io</span> for assistance.
            </h2>
        </div>
    );
}

export default BlackUserPage;
