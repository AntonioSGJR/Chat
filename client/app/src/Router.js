import React from "react";
import {Routes, Route} from "react-router-dom";

import App from "./App";
import Home from "./Home";

function Router()
{
    return(
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/chat" element={<App/>}/>
        </Routes>
    );
}

export default Router;